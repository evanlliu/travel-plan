const APP_VERSION = "v2.3.1";

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

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-App-Password",
    "Cache-Control": "no-store"
  };
}

function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(env), "Content-Type": "application/json; charset=utf-8" }
  });
}

function splitList(s) {
  return String(s || "").split(/[\n,，;；]+/).map((x) => x.trim()).filter(Boolean);
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Payload must be a JSON object");

  let items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length && Array.isArray(payload.rows)) {
    items = payload.rows.map((r) => ({
      id: r.id || crypto.randomUUID(),
      dateISO: r.dateISO || "",
      time: r.time || "",
      group: r.group || "",
      content: r.content || r.plan || "",
      links: Array.isArray(r.links) ? r.links : splitList(r.links || r.link || ""),
      participants: Array.isArray(r.participants) ? r.participants : splitList(r.participants || "")
    }));
  }

  const peopleOptions = Array.isArray(payload.peopleOptions) ? payload.peopleOptions.map(String).filter(Boolean) : [];
  const normalizedItems = items.map((r, idx) => ({
    id: String(r.id || crypto.randomUUID()),
    dateISO: String(r.dateISO || ""),
    time: String(r.time || ""),
    group: String(r.group || r.section || ""),
    content: String(r.content || r.plan || ""),
    links: (Array.isArray(r.links) ? r.links : splitList(r.links || r.link || "")).map(String).filter(Boolean),
    participants: (Array.isArray(r.participants) ? r.participants : splitList(r.participants || "")).map(String).filter(Boolean),
    sort: typeof r.sort === "number" ? r.sort : idx
  }));

  normalizedItems.forEach((item) => item.participants.forEach((p) => {
    if (!peopleOptions.includes(p)) peopleOptions.push(p);
  }));

  const incomingSettings = payload.settings && typeof payload.settings === "object" ? payload.settings : {};
  const incomingCloudflare = incomingSettings.cloudflare && typeof incomingSettings.cloudflare === "object" ? incomingSettings.cloudflare : {};
  const settings = {
    cloudflare: {
      apiBase: String(incomingCloudflare.apiBase || payload.cloudflareApiBase || "").trim().replace(/\/$/, ""),
      appPassword: String(incomingCloudflare.appPassword || incomingCloudflare.APP_PASSWORD || payload.appPassword || ""),
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    }
  };

  return {
    version: APP_VERSION,
    updatedAt: payload.updatedAt || new Date().toISOString(),
    settings,
    peopleOptions,
    items: normalizedItems
  };
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

function hasGitHub(env) {
  const cfg = githubConfig(env);
  return Boolean(cfg.owner && cfg.repo && cfg.token);
}

function githubHeaders(env) {
  return {
    "Authorization": `Bearer ${env.GH_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "User-Agent": "travel-plan-pro-worker"
  };
}

function githubContentsUrl(env) {
  const cfg = githubConfig(env);
  const encodedPath = encodeURIComponent(cfg.path).replace(/%2F/g, "/");
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodedPath}`;
}

function decodeBase64Text(content) {
  const clean = String(content || "").replace(/\s/g, "");
  const bin = atob(clean);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Text(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function githubRead(env) {
  const cfg = githubConfig(env);
  const res = await fetch(`${githubContentsUrl(env)}?ref=${encodeURIComponent(cfg.branch)}`, {
    headers: githubHeaders(env)
  });
  if (res.status === 404) return { text: JSON.stringify(DEFAULT_DATA), sha: null };
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const body = await res.json();
  return { text: decodeBase64Text(body.content), sha: body.sha || null };
}

async function githubWrite(env, text) {
  const cfg = githubConfig(env);
  let sha = null;
  try {
    const current = await githubRead(env);
    sha = current.sha;
  } catch (e) {
    // If the file cannot be read because it does not exist, GitHub PUT can create it without sha.
  }

  const body = {
    message: `Update ${cfg.path} from Travel Plan Pro ${APP_VERSION}`,
    content: encodeBase64Text(text),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(githubContentsUrl(env), {
    method: "PUT",
    headers: { ...githubHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${detail}`);
  }
  return await res.json();
}

async function storageRead(env) {
  if (hasGitHub(env)) {
    const result = await githubRead(env);
    return result.text;
  }
  if (env.TRAVEL_DATA) {
    return await env.TRAVEL_DATA.get(env.DATA_PATH || "data.json") || JSON.stringify(DEFAULT_DATA);
  }
  throw new Error("Missing storage. Configure GitHub variables GH_OWNER/GH_REPO/GH_BRANCH/DATA_PATH/GH_TOKEN, or KV binding TRAVEL_DATA.");
}

async function storageWrite(env, text) {
  if (hasGitHub(env)) {
    await githubWrite(env, text);
    return "github";
  }
  if (env.TRAVEL_DATA) {
    await env.TRAVEL_DATA.put(env.DATA_PATH || "data.json", text);
    return "kv";
  }
  throw new Error("Missing storage. Configure GitHub variables GH_OWNER/GH_REPO/GH_BRANCH/DATA_PATH/GH_TOKEN, or KV binding TRAVEL_DATA.");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const allowedPaths = new Set(["/", "/data", "/data.json"]);
    if (!allowedPaths.has(url.pathname)) return jsonResponse({ ok: false, error: "Not found", path: url.pathname, supported: ["/", "/data", "/data.json"] }, 404, env);

    if (request.method === "GET") {
      try {
        const stored = await storageRead(env);
        return new Response(stored || JSON.stringify(DEFAULT_DATA), {
          headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Read failed" }, 500, env);
      }
    }

    if (request.method === "PUT" || request.method === "POST") {
      if (env.APP_PASSWORD) {
        const password = request.headers.get("X-App-Password") || "";
        if (password !== env.APP_PASSWORD) return jsonResponse({ ok: false, error: "Unauthorized" }, 401, env);
      }

      const text = await request.text();
      if (text.length > 1024 * 1024) return jsonResponse({ ok: false, error: "JSON too large" }, 413, env);

      let payload;
      try {
        payload = normalizePayload(JSON.parse(text));
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Invalid JSON" }, 400, env);
      }

      try {
        const storage = await storageWrite(env, JSON.stringify(payload, null, 2));
        return jsonResponse({ ok: true, updatedAt: payload.updatedAt, version: payload.version, storage }, 200, env);
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Write failed" }, 500, env);
      }
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405, env);
  }
};
