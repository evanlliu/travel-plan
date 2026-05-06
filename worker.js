const APP_VERSION = "v2.5.0";

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
  return String(s || "").split(/[\n,，;；]+/).map(x => x.trim()).filter(Boolean);
}

function defaultSettings() {
  return {
    cloudflare: {
      apiBase: "",
      appPassword: "",
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    }
  };
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Payload must be a JSON object");

  let items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length && Array.isArray(payload.rows)) {
    items = payload.rows.map(r => ({
      id: r.id || crypto.randomUUID(),
      dateISO: r.dateISO || "",
      time: r.time || "",
      group: r.group || "",
      content: r.content || r.plan || "",
      links: Array.isArray(r.links) ? r.links : splitList(r.links || r.link || ""),
      participants: Array.isArray(r.participants) ? r.participants : splitList(r.participants || "")
    }));
  }

  const settings = payload.settings && typeof payload.settings === "object" ? payload.settings : defaultSettings();
  if (!settings.cloudflare || typeof settings.cloudflare !== "object") settings.cloudflare = defaultSettings().cloudflare;
  settings.cloudflare.apiBase = String(settings.cloudflare.apiBase || "");
  settings.cloudflare.appPassword = String(settings.cloudflare.appPassword || "");
  settings.cloudflare.configSavedInDataJson = true;
  settings.cloudflare.passwordStorage = "data.json settings.cloudflare.appPassword";

  const peopleOptions = Array.isArray(payload.peopleOptions)
    ? payload.peopleOptions.map(String).map(x => x.trim()).filter(Boolean)
    : [];

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

  normalizedItems.forEach(item => {
    item.participants.forEach(p => {
      if (!peopleOptions.includes(p)) peopleOptions.push(p);
    });
  });

  return {
    version: APP_VERSION,
    updatedAt: payload.updatedAt || new Date().toISOString(),
    settings,
    peopleOptions,
    items: normalizedItems
  };
}

function isGithubMode(env) {
  return !!(env.GH_TOKEN && env.GH_OWNER && env.GH_REPO);
}

function dataPath(env) {
  return env.DATA_PATH || "data.json";
}

async function githubGet(env) {
  const owner = env.GH_OWNER;
  const repo = env.GH_REPO;
  const branch = env.GH_BRANCH || "main";
  const path = dataPath(env);
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${env.GH_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "travel-plan-worker"
    }
  });
  if (res.status === 404) return { data: DEFAULT_DATA, sha: null };
  if (!res.ok) throw new Error("GitHub read failed: " + res.status);
  const body = await res.json();
  const decoded = atob(String(body.content || "").replace(/\n/g, ""));
  return { data: JSON.parse(decoded), sha: body.sha || null };
}

async function githubPut(env, payload) {
  const owner = env.GH_OWNER;
  const repo = env.GH_REPO;
  const branch = env.GH_BRANCH || "main";
  const path = dataPath(env);
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const current = await githubGet(env).catch(() => ({ data: DEFAULT_DATA, sha: null }));
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const body = {
    message: `Update travel plan data ${new Date().toISOString()}`,
    content,
    branch
  };
  if (current.sha) body.sha = current.sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${env.GH_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "travel-plan-worker",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("GitHub write failed: " + res.status + " " + text.slice(0, 200));
  }
  return await res.json();
}

async function kvGet(env) {
  if (!env.TRAVEL_DATA) return DEFAULT_DATA;
  const stored = await env.TRAVEL_DATA.get(dataPath(env));
  return stored ? JSON.parse(stored) : DEFAULT_DATA;
}

async function kvPut(env, payload) {
  if (!env.TRAVEL_DATA) throw new Error("Missing KV binding: TRAVEL_DATA");
  await env.TRAVEL_DATA.put(dataPath(env), JSON.stringify(payload, null, 2));
}

function acceptedPath(pathname) {
  return pathname === "/" || pathname === "/data" || pathname === "/data.json";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(env) });
    if (!acceptedPath(url.pathname)) return jsonResponse({ ok: false, error: "Not found" }, 404, env);

    if (request.method === "GET") {
      try {
        const raw = isGithubMode(env) ? (await githubGet(env)).data : await kvGet(env);
        const data = normalizePayload(raw);
        return jsonResponse(data, 200, env);
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
        payload.updatedAt = new Date().toISOString();
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Invalid JSON" }, 400, env);
      }

      try {
        if (isGithubMode(env)) await githubPut(env, payload);
        else await kvPut(env, payload);
        return jsonResponse({ ok: true, version: payload.version, updatedAt: payload.updatedAt }, 200, env);
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Write failed" }, 500, env);
      }
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405, env);
  }
};
