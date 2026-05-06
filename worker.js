const APP_VERSION = "v2.24.0";

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
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders(env), "Content-Type": "application/json; charset=utf-8" }
  });
}

function splitList(s) {
  return String(s || "").split(/[\n,，;；]+/).map(x => cleanText(x)).filter(Boolean);
}

function cjkCount(s) {
  const m = String(s || "").match(/[\u3400-\u9FFF]/g);
  return m ? m.length : 0;
}

function badTextScore(s) {
  s = String(s || "");
  let score = 0;
  const replacement = s.match(/\uFFFD/g);
  const controls = s.match(/[\u0080-\u009F]/g);
  const classic = s.match(/[ÃÂ]/g);
  const punctuation = s.match(/â[€€™œ“”–—¢]/g);
  const commonUtf8Mojibake = s.match(/[ÄÅÆÇÐÑØÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g);
  score += replacement ? replacement.length * 20 : 0;
  score += controls ? controls.length * 8 : 0;
  score += classic ? classic.length * 6 : 0;
  score += punctuation ? punctuation.length * 6 : 0;
  score += commonUtf8Mojibake ? commonUtf8Mojibake.length : 0;
  score -= cjkCount(s) * 3;
  return score;
}

function shouldTryEncodingRepair(s) {
  s = String(s || "");
  return /[\uFFFD\u0080-\u009FÃÂ]/.test(s) ||
    /â[€€™œ“”–—¢]/.test(s) ||
    /[ÄÅÆÇÐÑØÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/.test(s);
}

function latin1ToUtf8(s) {
  const arr = Array.from(String(s || ""), ch => ch.charCodeAt(0) & 255);
  return new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(arr));
}

function cleanText(value) {
  let best = String(value == null ? "" : value);
  if (!best) return "";
  if (!shouldTryEncodingRepair(best)) return best.trim();

  let current = best;
  let bestScore = badTextScore(best);
  let bestCjk = cjkCount(best);

  for (let i = 0; i < 4; i++) {
    const next = latin1ToUtf8(current);
    if (!next || next === current) break;
    const nextScore = badTextScore(next);
    const nextCjk = cjkCount(next);
    if (nextScore < bestScore || (nextScore === bestScore && nextCjk > bestCjk)) {
      best = next;
      bestScore = nextScore;
      bestCjk = nextCjk;
    }
    current = next;
  }

  return best.replace(/\uFEFF/g, "").trim();
}

function cleanName(name) {
  const s = cleanText(name);
  if (!s || /[\uFFFD\u0080-\u009F]/.test(s)) return "";
  return s;
}

function cleanNameList(list) {
  const seen = new Set();
  const out = [];
  const arr = Array.isArray(list) ? list : splitList(list);
  for (const name of arr) {
    const s = cleanName(name);
    if (!s) continue;
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Payload must be a JSON object");

  let items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length && Array.isArray(payload.rows)) {
    items = payload.rows.map(r => ({
      id: r.id || crypto.randomUUID(),
      dateISO: r.dateISO || "",
      time: cleanText(r.time || ""),
      group: cleanText(r.group || ""),
      content: cleanText(r.content || r.plan || ""),
      links: Array.isArray(r.links) ? r.links : splitList(r.links || r.link || ""),
      participants: Array.isArray(r.participants) ? r.participants : splitList(r.participants || "")
    }));
  }

  const settings = payload.settings && typeof payload.settings === "object" ? payload.settings : DEFAULT_DATA.settings;
  if (!settings.cloudflare || typeof settings.cloudflare !== "object") settings.cloudflare = DEFAULT_DATA.settings.cloudflare;
  settings.cloudflare.apiBase = String(settings.cloudflare.apiBase || "").trim().replace(/\/+$/, "").replace(/\/data\.json$/i, "").replace(/\/data$/i, "");
  settings.cloudflare.appPassword = String(settings.cloudflare.appPassword || "");
  settings.cloudflare.configSavedInDataJson = true;
  settings.cloudflare.passwordStorage = "data.json settings.cloudflare.appPassword";

  let peopleOptions = cleanNameList(Array.isArray(payload.peopleOptions) ? payload.peopleOptions : DEFAULT_DATA.peopleOptions);
  if (!peopleOptions.length) peopleOptions = [...DEFAULT_DATA.peopleOptions];

  const normalizedItems = items.map((r, idx) => ({
    id: String(r.id || crypto.randomUUID()),
    dateISO: String(r.dateISO || ""),
    time: cleanText(r.time || ""),
    group: cleanText(r.group || r.section || ""),
    content: cleanText(r.content || r.plan || ""),
    links: (Array.isArray(r.links) ? r.links : splitList(r.links || r.link || "")).map(x => cleanText(x)).filter(Boolean),
    participants: cleanNameList(Array.isArray(r.participants) ? r.participants : splitList(r.participants || "")),
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

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function b64Decode(str) {
  const binary = atob(String(str || "").replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes).replace(/^\uFEFF/, "");
}

function githubConfigured(env) {
  return env.GH_TOKEN && env.GH_OWNER && env.GH_REPO;
}

function githubPath(env) {
  return env.DATA_PATH || "data.json";
}

function githubBranch(env) {
  return env.GH_BRANCH || "main";
}

async function githubGet(env) {
  const url = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${encodeURIComponent(githubPath(env)).replace(/%2F/g, "/")}?ref=${encodeURIComponent(githubBranch(env))}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${env.GH_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "travel-plan-worker"
    }
  });
  if (res.status === 404) return { data: DEFAULT_DATA, sha: "" };
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const body = await res.json();
  const text = b64Decode(body.content || "");
  return { data: JSON.parse(text), sha: body.sha || "" };
}

async function githubPut(env, payload) {
  const current = await githubGet(env);
  const url = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${encodeURIComponent(githubPath(env)).replace(/%2F/g, "/")}`;
  const body = {
    message: `Update travel plan data ${new Date().toISOString()}`,
    content: b64Encode(JSON.stringify(payload, null, 2)),
    branch: githubBranch(env)
  };
  if (current.sha) body.sha = current.sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${env.GH_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "travel-plan-worker"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }
}

async function readData(env) {
  if (githubConfigured(env)) {
    const result = await githubGet(env);
    return normalizePayload(result.data);
  }
  if (env.TRAVEL_DATA) {
    const stored = await env.TRAVEL_DATA.get(env.DATA_PATH || "data.json");
    return stored ? normalizePayload(JSON.parse(stored)) : DEFAULT_DATA;
  }
  return DEFAULT_DATA;
}

async function writeData(env, payload) {
  const normalized = normalizePayload(payload);
  if (githubConfigured(env)) {
    await githubPut(env, normalized);
    return normalized;
  }
  if (env.TRAVEL_DATA) {
    await env.TRAVEL_DATA.put(env.DATA_PATH || "data.json", JSON.stringify(normalized, null, 2));
    return normalized;
  }
  throw new Error("No storage configured. Set GitHub variables or TRAVEL_DATA KV binding.");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

    const okPath = url.pathname === "/" || url.pathname === "/data" || url.pathname === "/data.json";
    if (!okPath) return jsonResponse({ ok: false, error: "Not found" }, 404, env);

    if (request.method === "GET") {
      try {
        const data = await readData(env);
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

      try {
        const payload = normalizePayload(JSON.parse(text));
        payload.updatedAt = new Date().toISOString();
        await writeData(env, payload);
        return jsonResponse({ ok: true, updatedAt: payload.updatedAt, version: payload.version }, 200, env);
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message || "Write failed" }, 500, env);
      }
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405, env);
  }
};
