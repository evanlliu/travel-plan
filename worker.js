const APP_VERSION = "v2.43.29";

const DEFAULT_DATA = {
  version: APP_VERSION,
  updatedAt: "",
  settings: {
    activePlanId: "plan_default",
    cloudflare: {
      apiBase: "",
      appPassword: "",
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    },
    displayOptions: {
      cardPeople: { pc: true, mobile: true },
      dayItemCount: { pc: true, mobile: true },
      daySummary: { pc: true, mobile: true }
    },
    dayCollapsed: {}
  },
  plans: [
    { id: "plan_default", name: "当前旅行计划", destination: "", startDate: "", endDate: "", status: "open", createdAt: "", archivedAt: "", sort: 1, note: "" }
  ],
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

function normalizeVisibleValue(value, fallback = true) {
  if (value === false || value === 0) return false;
  const raw = cleanText(value).toLowerCase();
  if (["false", "0", "no", "hide", "hidden", "off", "不显示", "隐藏", "否", "关"].includes(raw)) return false;
  if (["true", "1", "yes", "show", "visible", "on", "显示", "是", "开"].includes(raw)) return true;
  return fallback;
}

function normalizeDeviceVisibility(value, fallback) {
  const base = fallback && typeof fallback === "object" ? fallback : { pc: true, mobile: true };
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    const visible = normalizeVisibleValue(value, true);
    return { pc: visible, mobile: visible };
  }

  value = value && typeof value === "object" ? value : {};
  return {
    pc: normalizeVisibleValue(value.pc ?? value.desktop ?? value.web, base.pc !== false),
    mobile: normalizeVisibleValue(value.mobile ?? value.ios ?? value.phone, base.mobile !== false)
  };
}

function normalizeDisplayOptions(value) {
  const fallback = DEFAULT_DATA.settings.displayOptions;
  value = value && typeof value === "object" ? value : {};

  return {
    cardPeople: normalizeDeviceVisibility(value.cardPeople || value.peopleColumn || value.people, fallback.cardPeople),
    dayItemCount: normalizeDeviceVisibility(value.dayItemCount || value.itemCount || value.itemsLine, fallback.dayItemCount),
    daySummary: normalizeDeviceVisibility(value.daySummary || value.summaryLine || value.dayMeta, fallback.daySummary)
  };
}

function normalizeDayCollapsed(value) {
  const output = {};
  value = value && typeof value === "object" ? value : {};

  Object.keys(value).forEach(planKey => {
    const planId = cleanText(planKey);
    const days = value[planKey];
    if (!planId || !days || typeof days !== "object" || Array.isArray(days)) return;

    const fixedDays = {};
    Object.keys(days).forEach(dateKey => {
      const dateISO = dateToInput(dateKey);
      if (dateISO && days[dateKey] === true) fixedDays[dateISO] = true;
    });

    if (Object.keys(fixedDays).length) output[planId] = fixedDays;
  });

  return output;
}


function dateToInput(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return "";
  return `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;
}

function normalizePlanStatus(value) {
  const raw = cleanText(value).toLowerCase();
  if (["archived", "archive", "归档", "已归档"].includes(raw)) return "archived";
  return "open";
}

function normalizePlan(plan, index) {
  plan = plan && typeof plan === "object" ? plan : {};
  return {
    id: cleanText(plan.id) || (index === 0 ? "plan_default" : `plan_${Date.now()}_${index}`),
    name: cleanText(plan.name || plan.title || plan["计划名称"] || plan["Plan Name"]) || "当前旅行计划",
    destination: cleanText(plan.destination || plan.city || plan["目的地"] || plan["Destination"]),
    startDate: dateToInput(plan.startDate || plan.start || plan["开始日期"] || plan["Start Date"]),
    endDate: dateToInput(plan.endDate || plan.end || plan["结束日期"] || plan["End Date"]),
    status: normalizePlanStatus(plan.status),
    createdAt: cleanText(plan.createdAt),
    archivedAt: cleanText(plan.archivedAt),
    sort: Number(plan.sort || index + 1),
    note: cleanText(plan.note || plan.remark || plan["备注"] || plan["Note"])
  };
}

function derivePlanDates(items) {
  const dates = (items || []).map(item => dateToInput(item.dateISO || item.date)).filter(Boolean).sort();
  return { startDate: dates[0] || "", endDate: dates[dates.length - 1] || "" };
}

function makeDefaultPlanFromItems(items) {
  const range = derivePlanDates(items || []);
  return normalizePlan({ id: "plan_default", name: "当前旅行计划", startDate: range.startDate, endDate: range.endDate, status: "open", sort: 1 }, 0);
}

function normalizeSettings(settings, activePlanId) {
  const cf = settings && settings.cloudflare ? settings.cloudflare : {};
  return {
    activePlanId: cleanText(activePlanId || (settings && settings.activePlanId) || DEFAULT_DATA.settings.activePlanId),
    cloudflare: {
      apiBase: cleanText(cf.apiBase).replace(/\/data\.json$/i, "").replace(/\/data$/i, "").replace(/\/+$/g, ""),
      appPassword: String(cf.appPassword || ""),
      configSavedInDataJson: true,
      passwordStorage: "data.json settings.cloudflare.appPassword"
    },
    displayOptions: normalizeDisplayOptions(settings && settings.displayOptions),
    dayCollapsed: normalizeDayCollapsed(settings && settings.dayCollapsed)
  };
}

function normalizePriority(value) {
  const raw = cleanText(value).toLowerCase().replace(/\s+/g, "");
  if (["optional", "option", "maybe", "backup", "备用", "可选", "选做", "非必做"].includes(raw)) return "optional";
  if (["must", "mustdo", "required", "important", "必做", "必须", "重要"].includes(raw)) return "must";
  return "must";
}

function normalizeItem(item, index, fallbackPlanId) {
  item = item && typeof item === "object" ? item : {};
  return {
    id: cleanText(item.id) || `i_${Date.now()}_${index}`,
    planId: cleanText(item.planId || item.planID || item.tripId || item.tripID) || cleanText(fallbackPlanId) || "plan_default",
    dateISO: cleanText(item.dateISO || item.date),
    time: cleanText(item.time),
    group: cleanText(item.group),
    content: cleanText(item.content || item.plan),
    links: (Array.isArray(item.links) ? item.links : cleanList(item.links)).map(normalizeUrl).filter(Boolean),
    participants: cleanList(item.participants || item.people),
    priority: normalizePriority(item.priority || item.type || item["类型"] || item["重要程度"] || item["Priority"] || item["Type"]),
    sort: Number(item.sort || index + 1)
  };
}

function normalizePayload(payload) {
  payload = payload && typeof payload === "object" ? payload : {};
  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  let plans = Array.isArray(payload.plans) ? payload.plans.map(normalizePlan) : [];
  if (!plans.length) plans = [makeDefaultPlanFromItems(rawItems)];

  const planIds = new Set(plans.map(plan => plan.id));
  let activePlanId = cleanText(payload.settings && payload.settings.activePlanId);
  if (!activePlanId || !planIds.has(activePlanId)) {
    const firstOpen = plans.find(plan => plan.status !== "archived");
    activePlanId = (firstOpen || plans[0]).id;
  }

  const data = {
    version: APP_VERSION,
    updatedAt: cleanText(payload.updatedAt),
    settings: normalizeSettings(payload.settings, activePlanId),
    plans,
    peopleOptions: cleanList(payload.peopleOptions || DEFAULT_DATA.peopleOptions),
    items: rawItems.map((item, index) => {
      const fixed = normalizeItem(item, index, activePlanId);
      if (!planIds.has(fixed.planId)) fixed.planId = activePlanId;
      return fixed;
    })
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
