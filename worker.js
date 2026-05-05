const DEFAULT_DATA = {
  version: 1,
  updatedAt: "",
  peopleOptions: ["Evan", "Gonca", "Ainiya", "Lin", "Mom", "全家"],
  rows: []
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

function normalizePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Payload must be a JSON object");
  if (!Array.isArray(payload.rows)) payload.rows = [];
  if (!Array.isArray(payload.peopleOptions)) payload.peopleOptions = [];
  payload.version = 1;
  payload.updatedAt = payload.updatedAt || new Date().toISOString();
  payload.rows = payload.rows.map((r) => ({
    id: String(r.id || crypto.randomUUID()),
    lang: String(r.lang || r.language || "中文"),
    date: String(r.date || ""),
    weekday: String(r.weekday || ""),
    content: String(r.content || r.plan || ""),
    links: Array.isArray(r.links) ? r.links.map(String).filter(Boolean) : [],
    participants: Array.isArray(r.participants) ? r.participants.map(String).filter(Boolean) : []
  }));
  payload.peopleOptions = payload.peopleOptions.map(String).filter(Boolean);
  return payload;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (url.pathname !== "/" && url.pathname !== "/data.json") return jsonResponse({ ok: false, error: "Not found" }, 404, env);
    if (!env.TRAVEL_DATA) return jsonResponse({ ok: false, error: "Missing KV binding: TRAVEL_DATA" }, 500, env);

    if (request.method === "GET") {
      const stored = await env.TRAVEL_DATA.get("data.json");
      return new Response(stored || JSON.stringify(DEFAULT_DATA), {
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    if (request.method === "PUT" || request.method === "POST") {
      if (env.APP_PASSWORD) {
        const password = request.headers.get("X-App-Password") || "";
        if (password !== env.APP_PASSWORD) return jsonResponse({ ok: false, error: "Unauthorized" }, 401, env);
      }
      const text = await request.text();
      if (text.length > 1024 * 1024) return jsonResponse({ ok: false, error: "JSON too large" }, 413, env);
      let payload;
      try { payload = normalizePayload(JSON.parse(text)); }
      catch (e) { return jsonResponse({ ok: false, error: e.message || "Invalid JSON" }, 400, env); }
      await env.TRAVEL_DATA.put("data.json", JSON.stringify(payload));
      return jsonResponse({ ok: true, updatedAt: payload.updatedAt }, 200, env);
    }

    return jsonResponse({ ok: false, error: "Method not allowed" }, 405, env);
  }
};
