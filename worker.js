const APP_VERSION = "v2.37.0";

const DEFAULT_DATA = {
  version: APP_VERSION,
  updatedAt: "",
  settings: {
    cloudflare: {
      apiBase: "",
      appPassword: "",
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    }
  },
  peopleOptions: ["Evan", "Gonca", "Ainiya", "Lin", "Mom", "全家"],
  items: []
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-App-Password",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function cleanText(value) {
  return value == null ? "" : String(value).replace(/\u0000/g, "").trim();
}

function cleanList(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(/[\n,，;；、]+/);
  const seen = new Set();
  const output = [];
  list.forEach(item => {
    const text = cleanText(item);
    if (!text || seen.has(text)) return;
    seen.add(text);
    output.push(text);
  });
  return output;
}

function normalizeUrl(value) {
  const url = cleanText(value);
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function normalizeSettings(settings) {
  const cf = settings && settings.cloudflare ? settings.cloudflare : {};
  return {
    cloudflare: {
      apiBase: cleanText(cf.apiBase).replace(/\/data\.json$/i, "").replace(/\/data$/i, "").replace(/\/+$/g, ""),
      appPassword: String(cf.appPassword || ""),
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    }
  };
}

function normalizeItem(item, index) {
  item = item && typeof item === "object" ? item : {};
  return {
    id: cleanText(item.id) || `i_${Date.now()}_${index}`,
    dateISO: cleanText(item.dateISO || item.date),
    time: cleanText(item.time),
    group: cleanText(item.group),
    content: cleanText(item.content || item.plan),
    links: (Array.isArray(item.links) ? item.links : cleanList(item.links)).map(normalizeUrl).filter(Boolean),
    participants: cleanList(item.participants || item.people),
    sort: Number(item.sort || index + 1)
  };
}

function normalizePayload(payload) {
  payload = payload && typeof payload === "object" ? payload : {};
  const data = {
    version: APP_VERSION,
    updatedAt: cleanText(payload.updatedAt),
    settings: normalizeSettings(payload.settings),
    peopleOptions: cleanList(payload.peopleOptions || DEFAULT_DATA.peopleOptions),
    items: (Array.isArray(payload.items) ? payload.items : []).map(normalizeItem)
  };

  const people = new Set(data.peopleOptions);
  data.items.forEach(item => item.participants.forEach(name => people.add(name)));
  data.peopleOptions = Array.from(people).filter(Boolean);

  return data;
}

function githubConfig(env) {
  return {
    owner: env.GH_OWNER,
    repo: env.GH_REPO,
    branch: env.GH_BRANCH || "main",
    path: env.DATA_PATH || "data.json",
    token: env.GH_TOKEN
  };
}

function hasGithubConfig(env) {
  const cfg = githubConfig(env);
  return Boolean(cfg.owner && cfg.repo && cfg.token);
}

function githubApiUrl(env) {
  const cfg = githubConfig(env);
  return `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path}?ref=${encodeURIComponent(cfg.branch)}`;
}

function githubHeaders(env) {
  return {
    "Authorization": `Bearer ${env.GH_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "User-Agent": "travel-plan-worker"
  };
}

function base64ToUtf8(base64) {
  const binary = atob(String(base64 || "").replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function readGithubData(env) {
  if (!hasGithubConfig(env)) return normalizePayload(DEFAULT_DATA);

  const response = await fetch(githubApiUrl(env), {
    method: "GET",
    headers: githubHeaders(env)
  });

  if (response.status === 404) return normalizePayload(DEFAULT_DATA);
  if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`);

  const file = await response.json();
  return normalizePayload(JSON.parse(base64ToUtf8(file.content)));
}

async function getGithubSha(env) {
  if (!hasGithubConfig(env)) throw new Error("Missing GitHub configuration");

  const response = await fetch(githubApiUrl(env), {
    method: "GET",
    headers: githubHeaders(env)
  });

  if (response.status === 404) return "";
  if (!response.ok) throw new Error(`GitHub SHA read failed: ${response.status}`);

  const file = await response.json();
  return file.sha || "";
}

async function writeGithubData(env, payload) {
  if (!hasGithubConfig(env)) throw new Error("Missing GitHub configuration");

  const cfg = githubConfig(env);
  const sha = await getGithubSha(env);
  const content = JSON.stringify(payload, null, 2);

  const body = {
    message: `Update travel plan ${payload.updatedAt || ""}`.trim(),
    content: utf8ToBase64(content),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;

  const response = await fetch(githubApiUrl(env), {
    method: "PUT",
    headers: {
      ...githubHeaders(env),
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub write failed: ${response.status} ${text}`);
  }

  return response.json();
}

function requirePassword(request, env) {
  if (!env.APP_PASSWORD) return true;
  return request.headers.get("X-App-Password") === env.APP_PASSWORD;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const validPath = path === "/" || path === "/data" || path === "/data.json";
    if (!validPath) return jsonResponse({ ok: false, error: "Not found" }, 404);

    if (request.method === "GET") {
      try {
        return jsonResponse(await readGithubData(env));
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message || "Read failed" }, 500);
      }
    }

    if (request.method === "PUT" || request.method === "POST") {
      if (!requirePassword(request, env)) return jsonResponse({ ok: false, error: "Unauthorized" }, 401);

      const text = await request.text();
      if (text.length > 1024 * 1024) return jsonResponse({ ok: false, error: "JSON too large" }, 413);

      try {
        const payload = normalizePayload(JSON.parse(text));
        payload.updatedAt = new Date().toISOString();
        await writeGithubData(env, payload);
        return jsonResponse({ ok: true, version: payload.version, updatedAt: payload.updatedAt });
      } catch (error) {
        return jsonResponse({ ok: false, error: error.message || "Write failed" }, 500);
      }
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
  }
};
