(function () {
  "use strict";

  const APP_VERSION = "v2.41.0";
  const LS_DATA = "travel-plan-local-data";
  const LS_LANG = "travel-plan-ui-lang";
  const AUTO_REFRESH_MS = 60000;

  const WEEK = {
    zh: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };

  const I18N = {
    zh: {
      appTitle: "行程计划",
      more: "更多功能",
      import: "导入 Excel",
      tplZh: "中文模板",
      tplEn: "英文模板",
      peopleConfig: "人员配置",
      cloudflareConfig: "Cloudflare 同步配置",
      refresh: "刷新同步",
      search: "搜索日期 / 内容 / 人员",
      loading: "正在加载数据...",
      loaded: "数据已加载",
      synced: "已同步",
      localMode: "本地模式",
      syncFailed: "同步失败",
      updatedAt: "更新时间：",
      noData: "暂无行程",
      noMatch: "没有匹配的行程",
      date: "日期",
      time: "时间",
      weekday: "星期",
      people: "参与人员",
      group: "分组",
      content: "计划内容",
      rednote: "小红书链接",
      priority: "类型",
      priorityMust: "必做",
      priorityOptional: "可选",
      action: "操作",
      addItem: "新增安排",
      editItem: "编辑安排",
      edit: "编辑",
      copy: "复制",
      delete: "删除",
      copied: "已复制",
      cancel: "取消",
      save: "保存",
      selectPeople: "请选择",
      groupPlaceholder: "例如：Plan 1",
      contentPlaceholder: "输入计划内容",
      linksPlaceholder: "每行一个链接",
      linksHint: "每行一个链接，点击页面中的链接会直接新窗口打开。",
      preview: "链接预览",
      iframeTip: "如果无法显示，请新窗口打开。",
      openNew: "新窗口打开",
      peopleSyncNotice: "人员配置会和行程一起保存到 data.json，新设备加载后也会自动同步。",
      peopleList: "人员列表",
      peopleHint: "一行一个名字。保存后会写入 data.json 的 peopleOptions。",
      savePeople: "保存人员配置",
      workerUrl: "Worker 地址",
      workerHint: "支持填写根地址、/data 或 /data.json。保存后会写入 data.json。",
      writePassword: "写入密码",
      passwordHint: "会保存到 data.json 的 settings.cloudflare.appPassword。",
      cloudNotice: "配置会保存到 data.json，新设备加载后会自动读取并同步。",
      testRead: "测试读取",
      saveConfig: "保存配置",
      configSaved: "配置已保存",
      testOk: "测试成功，可以读取 Cloudflare 数据。",
      testFail: "测试失败，请检查 Worker 地址、CORS 或网络。",
      saved: "已保存",
      deleted: "已删除",
      imported: "导入完成",
      importFailed: "导入失败",
      requiredDate: "请选择日期",
      confirmDelete: "确认删除这条安排吗？",
      uploadExcel: "请选择 Excel 文件",
      link: "链接"
    },
    en: {
      appTitle: "Travel Plan",
      more: "More",
      import: "Import Excel",
      tplZh: "Chinese Template",
      tplEn: "English Template",
      peopleConfig: "People Settings",
      cloudflareConfig: "Cloudflare Sync",
      refresh: "Refresh",
      search: "Search date / content / people",
      loading: "Loading data...",
      loaded: "Data loaded",
      synced: "Synced",
      localMode: "Local mode",
      syncFailed: "Sync failed",
      updatedAt: "Updated: ",
      noData: "No plans yet",
      noMatch: "No matching plans",
      date: "Date",
      time: "Time",
      weekday: "Weekday",
      people: "People",
      group: "Group",
      content: "Plan Content",
      rednote: "Red Note",
      priority: "Type",
      priorityMust: "Must do",
      priorityOptional: "Optional",
      action: "Action",
      addItem: "Add Item",
      editItem: "Edit Item",
      edit: "Edit",
      copy: "Copy",
      delete: "Delete",
      copied: "Copied",
      cancel: "Cancel",
      save: "Save",
      selectPeople: "Select people",
      groupPlaceholder: "For example: Plan 1",
      contentPlaceholder: "Enter plan details",
      linksPlaceholder: "One link per line",
      linksHint: "Multiple links are supported. One link per line. Click a link to open it in a new window.",
      preview: "Link Preview",
      iframeTip: "If it cannot be displayed, open it in a new window.",
      openNew: "Open new window",
      peopleSyncNotice: "People settings are saved to data.json together with plans and sync on new devices.",
      peopleList: "People list",
      peopleHint: "One name per line. Saving writes to data.json peopleOptions.",
      savePeople: "Save People",
      workerUrl: "Worker URL",
      workerHint: "Root URL, /data, or /data.json are supported. Saving writes to data.json.",
      writePassword: "Write password",
      passwordHint: "Saved to data.json settings.cloudflare.appPassword.",
      cloudNotice: "Config is saved to data.json and will sync automatically on new devices.",
      testRead: "Test Read",
      saveConfig: "Save Config",
      configSaved: "Config saved",
      testOk: "Test passed. Cloudflare data can be read.",
      testFail: "Test failed. Check Worker URL, CORS, or network.",
      saved: "Saved",
      deleted: "Deleted",
      imported: "Imported",
      importFailed: "Import failed",
      requiredDate: "Please choose a date",
      confirmDelete: "Delete this plan?",
      uploadExcel: "Please choose an Excel file",
      link: "Link"
    }
  };

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
    items: [
      { id: "i_001", dateISO: "2026-05-17", time: "13:00", group: "", content: "Center shopping", links: [], participants: ["Evan", "Gonca", "Lin"], priority: "must", sort: 1 },
      { id: "i_002", dateISO: "2026-05-17", time: "22:00", group: "", content: "Call sister eat street foods", links: [], participants: ["Evan", "Gonca", "Lin"], priority: "optional", sort: 2 },
      { id: "i_003", dateISO: "2026-05-17", time: "23:00", group: "", content: "Hotel", links: [], participants: ["Evan", "Gonca"], priority: "must", sort: 3 },
      { id: "i_004", dateISO: "2026-05-18", time: "08:00", group: "", content: "Medical checkup", links: [], participants: ["Evan", "Gonca", "Ainiya", "Lin"], priority: "must", sort: 4 },
      { id: "i_005", dateISO: "2026-05-18", time: "12:00", group: "", content: "JuZiZhou head, Snack Kingdom, Wenheyou", links: ["http://xhslink.com/o/4fAotv0DtEv"], participants: ["Evan", "Gonca", "Ainiya", "Lin"], priority: "optional", sort: 5 },
      { id: "i_006", dateISO: "2026-05-19", time: "09:00", group: "Plan 1", content: "Changsha Huayi Brothers Movie Town", links: ["http://xhslink.com/o/2SrIJCvzOXb"], participants: ["Evan", "Gonca"], priority: "must", sort: 6 }
    ]
  };

  let appLang = localStorage.getItem(LS_LANG) || "zh";
  let data = clone(DEFAULT_DATA);
  let selectedPeople = [];
  let modalScrollY = 0;
  let modalBaseHeight = 0;
  let autoRefreshTimer = null;

  function uid() {
    return "i_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function t(key) {
    return (I18N[appLang] && I18N[appLang][key]) || I18N.zh[key] || key;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function isStandaloneMode() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
  }

  function refreshStandaloneClass() {
    const standalone = isStandaloneMode();
    document.documentElement.classList.toggle("isStandalone", standalone);
    document.body.classList.toggle("isStandalone", standalone);
  }

  function setBottomUiOffsetVar() {
    let offset = 0;

    if (isMobile() && isStandaloneMode()) {
      offset = 56;
    } else if (isMobile() && window.visualViewport) {
      const vv = window.visualViewport;
      const base = window.innerHeight || document.documentElement.clientHeight || 0;
      offset = Math.min(140, Math.max(0, Math.round(base - (vv.height + vv.offsetTop))));
    }

    document.documentElement.style.setProperty("--bottom-ui-offset", `${offset}px`);
  }

  function setAppHeightVar() {
    let height;
    if (document.body.classList.contains("modalLocked") && modalBaseHeight) {
      height = modalBaseHeight;
    } else {
      height = window.innerHeight || document.documentElement.clientHeight || 0;
    }

    if (!height && window.visualViewport) height = window.visualViewport.height;
    document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
    refreshStandaloneClass();
    setBottomUiOffsetVar();
  }

  function lockPageScroll() {
    if (document.body.classList.contains("modalLocked")) return;

    modalScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    modalBaseHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!modalBaseHeight && window.visualViewport) modalBaseHeight = window.visualViewport.height;

    document.documentElement.classList.add("modalLocked");
    document.body.classList.add("modalLocked");
    document.body.style.top = `-${modalScrollY}px`;
    setAppHeightVar();
  }

  function unlockPageScroll() {
    if (!document.body.classList.contains("modalLocked")) return;

    document.documentElement.classList.remove("modalLocked");
    document.body.classList.remove("modalLocked", "keyboardOpen");
    document.body.style.top = "";
    modalBaseHeight = 0;
    setAppHeightVar();
    window.scrollTo(0, modalScrollY);
  }

  function openModal(id) {
    lockPageScroll();
    $(`#${id}`).addClass("show");
  }

  function closeModal(id) {
    $(`#${id}`).removeClass("show");
    $("#peoplePanel").removeClass("open");
    if (!$(".mask.show").length) unlockPageScroll();
  }

  function closeAllModals() {
    $(".mask.show").removeClass("show");
    $("#peoplePanel").removeClass("open");
    unlockPageScroll();
  }

  function isEditTextField(el) {
    if (!el || !el.closest || !el.closest("#editMask")) return false;
    if (el.id === "editDate") return false;

    const tag = (el.tagName || "").toLowerCase();
    const type = (el.getAttribute("type") || "").toLowerCase();
    return tag === "textarea" || (tag === "input" && !["date", "time", "hidden", "checkbox"].includes(type));
  }

  function refreshKeyboardState() {
    if (!document.body.classList.contains("modalLocked")) return;
    if (!window.visualViewport || !modalBaseHeight) return;

    if (modalBaseHeight - window.visualViewport.height < 80) {
      document.body.classList.remove("keyboardOpen");
    }
  }

  function cjkCount(s) {
    const match = String(s || "").match(/[\u3400-\u9FFF]/g);
    return match ? match.length : 0;
  }

  function badTextScore(s) {
    s = String(s || "");
    let score = 0;
    score += (s.match(/\uFFFD/g) || []).length * 20;
    score += (s.match(/[ÃÂ]/g) || []).length * 8;
    score += (s.match(/â[€€™œ“”–—¢]/g) || []).length * 8;
    score += (s.match(/[\u0080-\u009F]/g) || []).length * 6;
    score += (s.match(/[ÄÅÆÇÐÑØÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g) || []).length * 2;
    score -= cjkCount(s) * 3;
    return score;
  }

  function shouldRepairEncoding(s) {
    s = String(s || "");
    return /[\uFFFD\u0080-\u009FÃÂ]/.test(s) ||
      /â[€€™œ“”–—¢]/.test(s) ||
      /[ÄÅÆÇÐÑØÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/.test(s);
  }

  function latin1ToUtf8(s) {
    try {
      const bytes = Array.from(String(s || ""), ch => ch.charCodeAt(0) & 255);
      return new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
    } catch {
      try {
        return decodeURIComponent(escape(String(s || "")));
      } catch {
        return String(s || "");
      }
    }
  }

  function cleanText(value) {
    if (value == null) return "";
    let text = String(value).replace(/\u0000/g, "").trim();
    if (!text || !shouldRepairEncoding(text)) return text;

    const repaired = latin1ToUtf8(text).trim();
    return badTextScore(repaired) < badTextScore(text) ? repaired : text;
  }

  function splitList(value) {
    return String(value || "")
      .split(/[\n,，;；、]+/)
      .map(cleanText)
      .filter(Boolean);
  }

  function cleanNameList(list) {
    const seen = new Set();
    const output = [];
    (Array.isArray(list) ? list : splitList(list)).forEach(name => {
      name = cleanText(name);
      if (!name || seen.has(name)) return;
      seen.add(name);
      output.push(name);
    });
    return output;
  }

  function normalizeUrl(value) {
    value = cleanText(value);
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    return `https://${value}`;
  }

  function normalizeWorkerBase(value) {
    let url = String(value || "").trim();
    if (!url) return "";
    url = url.replace(/\/+$/, "");
    url = url.replace(/\/data\.json$/i, "");
    url = url.replace(/\/data$/i, "");
    return url;
  }

  function ensureSettings() {
    if (!data.settings || typeof data.settings !== "object") data.settings = clone(DEFAULT_DATA.settings);
    if (!data.settings.cloudflare || typeof data.settings.cloudflare !== "object") {
      data.settings.cloudflare = clone(DEFAULT_DATA.settings.cloudflare);
    }

    const cf = data.settings.cloudflare;
    cf.apiBase = normalizeWorkerBase(cf.apiBase);
    cf.appPassword = String(cf.appPassword || "");
    cf.configSavedInDataJson = true;
    cf.passwordStorage = "data.json settings.cloudflare.appPassword";
  }

  function getApiBase() {
    ensureSettings();
    return data.settings.cloudflare.apiBase;
  }

  function endpoint() {
    const base = getApiBase();
    return base ? `${base}/data.json` : "";
  }

  function getCloudPassword() {
    ensureSettings();
    return String(data.settings.cloudflare.appPassword || "");
  }

  function setCloudSettings(apiBase, password) {
    ensureSettings();
    data.settings.cloudflare.apiBase = normalizeWorkerBase(apiBase);
    data.settings.cloudflare.appPassword = String(password || "");
  }

  function parseExcelSerial(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return "";
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function isValidDate(y, m, d) {
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  }

  function dateToInput(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    if (typeof value === "number") return parseExcelSerial(value);

    let s = cleanText(value);
    if (!s) return "";
    s = s.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|星期[日一二三四五六]|周[日天一二三四五六])\s*,?\s*/i, "");

    let m = s.match(/^(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?$/);
    if (m && isValidDate(+m[1], +m[2], +m[3])) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

    m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (m && isValidDate(+m[3], +m[1], +m[2])) return `${m[3]}-${pad2(m[1])}-${pad2(m[2])}`;

    m = s.match(/^(\d{1,2})[-\s]?([A-Za-z]{3,9})(?:[-,\s]+)?(\d{2,4})?$/);
    if (m) {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const month = monthNames.findIndex(x => m[2].toLowerCase().startsWith(x)) + 1;
      const year = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : new Date().getFullYear();
      if (month && isValidDate(year, month, +m[1])) return `${year}-${pad2(month)}-${pad2(m[1])}`;
    }

    return "";
  }

  function weekdayText(iso) {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    return WEEK[appLang][date.getDay()];
  }

  function formatDate(iso) {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso || "";
    const wd = WEEK[appLang][date.getDay()];
    if (appLang === "en") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${wd}, ${months[date.getMonth()]} ${date.getDate()}`;
    }
    return `${wd} · ${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function normalizePriority(value) {
    const raw = cleanText(value).toLowerCase().replace(/\s+/g, "");
    if (["optional", "option", "maybe", "backup", "备用", "可选", "选做", "非必做"].includes(raw)) return "optional";
    if (["must", "mustdo", "required", "important", "必做", "必须", "重要"].includes(raw)) return "must";
    return "must";
  }

  function priorityLabel(value) {
    return t(normalizePriority(value) === "optional" ? "priorityOptional" : "priorityMust");
  }

  function priorityBadgeHtml(value) {
    const priority = normalizePriority(value);
    return `<span class="priorityBadge ${priority === "optional" ? "optional" : "must"}">${escapeHtml(priorityLabel(priority))}</span>`;
  }

  function displayDateTime(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString(appLang === "zh" ? "zh-CN" : "en-US", { hour12: false });
  }

  function itemSortValue(item) {
    const date = item.dateISO || "9999-12-31";
    const time = item.time || "99:99";
    const sort = Number(item.sort || 0);
    return `${date} ${time} ${String(sort).padStart(8, "0")}`;
  }

  function normalizeItem(item, index) {
    item = item && typeof item === "object" ? item : {};
    return {
      id: cleanText(item.id) || uid(),
      dateISO: dateToInput(item.dateISO || item.date || item["日期"] || item["Date"]) || new Date().toISOString().slice(0, 10),
      time: cleanText(item.time || item["时间"] || item["Time"]),
      group: cleanText(item.group || item["分组"] || item["Group"]),
      content: cleanText(item.content || item.plan || item["计划内容"] || item["Plan content"] || item["Plan Content"]),
      links: (Array.isArray(item.links) ? item.links : splitList(item.links || item.link || item["小红书链接"] || item["Red note"] || item["Red Note"]))
        .map(normalizeUrl)
        .filter(Boolean),
      participants: cleanNameList(item.participants || item.people || item["参与人员"] || item["People"]),
      priority: normalizePriority(item.priority || item.type || item["类型"] || item["重要程度"] || item["Priority"] || item["Type"]),
      sort: Number(item.sort || index + 1)
    };
  }

  function normalize(raw) {
    const base = clone(DEFAULT_DATA);
    const input = raw && typeof raw === "object" ? raw : {};

    base.version = APP_VERSION;
    base.updatedAt = cleanText(input.updatedAt || "");
    base.settings = Object.assign({}, base.settings, input.settings || {});
    base.peopleOptions = cleanNameList(input.peopleOptions || base.peopleOptions);
    base.items = (Array.isArray(input.items) ? input.items : []).map(normalizeItem);

    if (!base.peopleOptions.length) base.peopleOptions = cleanNameList(DEFAULT_DATA.peopleOptions);
    data = base;
    ensureSettings();
    repairData();
    return data;
  }

  function repairData() {
    const options = new Set(cleanNameList(data.peopleOptions));
    data.items.forEach((item, index) => {
      const fixed = normalizeItem(item, index);
      Object.assign(item, fixed);
      item.participants.forEach(name => options.add(name));
    });
    data.peopleOptions = Array.from(options).filter(Boolean);
  }

  function pickNewer(current, incoming) {
    if (!incoming) return current;
    const a = Date.parse(current?.updatedAt || "") || 0;
    const b = Date.parse(incoming?.updatedAt || "") || 0;
    return b >= a ? incoming : current;
  }

  function persistLocal() {
    data.version = APP_VERSION;
    localStorage.setItem(LS_DATA, JSON.stringify(data));
  }

  function loadLocal() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_DATA) || "null");
      if (raw) normalize(raw);
    } catch {
      normalize(DEFAULT_DATA);
    }
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async function loadBundledData() {
    try {
      const bundled = await fetchJson(`./data.json?ts=${Date.now()}`);
      normalize(pickNewer(data, bundled));
      persistLocal();
      return true;
    } catch {
      return false;
    }
  }

  async function loadCloudData() {
    const url = endpoint();
    if (!url) return false;

    try {
      const cloud = await fetchJson(`${url}?ts=${Date.now()}`);
      normalize(pickNewer(data, cloud));
      persistLocal();
      setStatus("ok", t("synced"));
      return true;
    } catch {
      setStatus("warn", t("syncFailed"));
      return false;
    }
  }

  async function writeCloudData() {
    const url = endpoint();
    if (!url) {
      setStatus("warn", t("localMode"));
      return false;
    }

    data.version = APP_VERSION;
    data.updatedAt = new Date().toISOString();
    persistLocal();

    try {
      await fetchJson(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "X-App-Password": getCloudPassword()
        },
        body: JSON.stringify(data)
      });
      setStatus("ok", t("synced"));
      return true;
    } catch {
      setStatus("warn", t("syncFailed"));
      return false;
    }
  }

  async function saveData(sync = true) {
    data.version = APP_VERSION;
    data.updatedAt = new Date().toISOString();
    repairData();
    persistLocal();
    render();
    if (sync) await writeCloudData();
  }

  function setStatus(kind, message) {
    $("#statusText").text(message);
    $("#statusDot").attr("class", `dot ${kind || ""}`);
    $("#updatedText").text(`${t("updatedAt")}${displayDateTime(data.updatedAt)}`);
  }

  function filteredItems() {
    const q = cleanText($("#searchInput").val()).toLowerCase();
    const items = data.items.slice().sort((a, b) => itemSortValue(a).localeCompare(itemSortValue(b)));

    if (!q) return items;
    return items.filter(item => {
      const haystack = [
        item.dateISO,
        formatDate(item.dateISO),
        item.time,
        item.group,
        item.content,
        item.links.join(" "),
        item.participants.join(" "),
        priorityLabel(item.priority)
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  function groupByDate(items) {
    const groups = new Map();
    items.forEach(item => {
      if (!groups.has(item.dateISO)) groups.set(item.dateISO, []);
      groups.get(item.dateISO).push(item);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }

  function chipHtml(people) {
    if (!people || !people.length) return "-";
    return `<div class="chips">${people.map(name => `<span>${escapeHtml(name)}</span>`).join("")}</div>`;
  }

  function linkHtml(links) {
    if (!links || !links.length) return "-";
    return links.map((url, index) => {
      const text = links.length === 1 ? url : `${t("link")} ${index + 1}`;
      return `<a class="xhsLink" href="${escapeHtml(url)}" data-url="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    }).join("<br>");
  }

  function daySummaryHtml(dayItems) {
    const times = dayItems.map(item => cleanText(item.time)).filter(Boolean).sort();
    const people = cleanNameList(dayItems.flatMap(item => item.participants || []));
    const linkCount = dayItems.reduce((count, item) => count + ((item.links || []).length), 0);
    const mustCount = dayItems.filter(item => normalizePriority(item.priority) === "must").length;
    const optionalCount = dayItems.filter(item => normalizePriority(item.priority) === "optional").length;
    const parts = [];

    if (times.length) {
      parts.push(times.length === 1 ? times[0] : `${times[0]}–${times[times.length - 1]}`);
    }
    if (mustCount) {
      parts.push(`${mustCount} ${escapeHtml(t("priorityMust"))}`);
    }
    if (optionalCount) {
      parts.push(`${optionalCount} ${escapeHtml(t("priorityOptional"))}`);
    }
    if (people.length) {
      parts.push(`${people.length} ${appLang === "zh" ? "人" : (people.length === 1 ? "person" : "people")}`);
    }
    if (linkCount) {
      parts.push(`${linkCount} ${appLang === "zh" ? "个链接" : (linkCount === 1 ? "link" : "links")}`);
    }

    if (!parts.length) return "";
    return `<div class="daySummary">${parts.map(part => `<span>${escapeHtml(part)}</span>`).join("")}</div>`;
  }

  function itemCardHtml(item) {
    const hasLinks = (item.links || []).length > 0;
    const hasPeople = (item.participants || []).length > 0;

    const priority = normalizePriority(item.priority);
    return `
      <article class="planRow priority-${priority} ${hasLinks ? "hasLinks" : ""} ${hasPeople ? "hasPeople" : ""}" data-id="${escapeHtml(item.id)}">
        <div class="cell timeCell" data-label="${escapeHtml(t("time"))}">${escapeHtml(item.time || "-")}</div>
        <div class="cell contentCell" data-label="${escapeHtml(t("content"))}">
          <div class="contentText">${priorityBadgeHtml(priority)}<span class="contentMain">${escapeHtml(item.content || "-")}</span></div>
        </div>
        <div class="cell linkCell ${hasLinks ? "" : "emptyCell"}" data-label="${escapeHtml(t("rednote"))}">${linkHtml(item.links)}</div>
        <div class="cell peopleCell ${hasPeople ? "" : "emptyCell"}" data-label="${escapeHtml(t("people"))}">${chipHtml(item.participants)}</div>
        <div class="cell actionCell">
          <button class="secondary btnEdit" data-id="${escapeHtml(item.id)}">${escapeHtml(t("edit"))}</button>
          <button class="secondary btnCopy" data-id="${escapeHtml(item.id)}">${escapeHtml(t("copy"))}</button>
          <button class="danger btnDelete" data-id="${escapeHtml(item.id)}">${escapeHtml(t("delete"))}</button>
        </div>
      </article>`;
  }

  function renderBoard(items) {
    const $board = $("#board");
    if (!data.items.length) {
      $board.html(`<section class="empty">${escapeHtml(t("noData"))}</section>`);
      return;
    }
    if (!items.length) {
      $board.html(`<section class="empty">${escapeHtml(t("noMatch"))}</section>`);
      return;
    }

    const html = groupByDate(items).map(([dateISO, dayItems]) => {
      const rows = [];
      let lastGroup = null;

      dayItems.forEach(item => {
        if (item.group && item.group !== lastGroup) {
          rows.push(`<div class="groupDivider">${escapeHtml(item.group)}</div>`);
          lastGroup = item.group;
        }
        rows.push(itemCardHtml(item));
      });

      return `
        <section class="dayCard">
          <header class="dayHead">
            <div>
              <h2>${escapeHtml(formatDate(dateISO))}</h2>
              <p>${dayItems.length} ${appLang === "zh" ? "项安排" : dayItems.length === 1 ? "item" : "items"}</p>
              ${daySummaryHtml(dayItems)}
            </div>
          </header>
          <div class="tableHead">
            <span>${escapeHtml(t("time"))}</span>
            <span>${escapeHtml(t("content"))}</span>
            <span>${escapeHtml(t("rednote"))}</span>
            <span>${escapeHtml(t("people"))}</span>
            <span>${escapeHtml(t("action"))}</span>
          </div>
          ${rows.join("")}
        </section>`;
    }).join("");

    $board.html(html);
  }

  function applyI18n() {
    document.documentElement.lang = appLang === "zh" ? "zh-CN" : "en";
    $("[data-i18n]").each(function () {
      const key = $(this).data("i18n");
      $(this).text(t(key));
    });
    $("[data-i18n-placeholder]").each(function () {
      const key = $(this).data("i18n-placeholder");
      $(this).attr("placeholder", t(key));
    });
    $("#btnLang").attr("title", appLang === "zh" ? "Switch to English" : "切换中文");
    $("#btnFabAdd").attr("title", t("addItem"));
    $("#btnFabAdd").attr("aria-label", t("addItem"));
  }

  function render() {
    applyI18n();
    ensureSettings();
    renderBoard(filteredItems());
    setStatus(getApiBase() ? "ok" : "warn", getApiBase() ? t("loaded") : t("localMode"));
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function refreshWeekday() {
    $("#editWeekday").val(weekdayText($("#editDate").val()));
  }

  function renderPeopleSummary() {
    const html = selectedPeople.length
      ? `<span class="chips">${selectedPeople.map(name => `<span>${escapeHtml(name)}</span>`).join("")}</span>`
      : escapeHtml(t("selectPeople"));
    $("#peopleSummary").html(html);
  }

  function renderPeoplePicker() {
    const options = cleanNameList([...(data.peopleOptions || []), ...selectedPeople]);
    const html = options.map(name => `
      <label class="peopleOption">
        <input type="checkbox" value="${escapeHtml(name)}" ${selectedPeople.includes(name) ? "checked" : ""}>
        <span>${escapeHtml(name)}</span>
      </label>`).join("");
    $("#peoplePanel").html(html);
    renderPeopleSummary();
  }

  function setEditPriority(value) {
    const priority = normalizePriority(value);
    $(`input[name=editPriority][value="${priority}"]`).prop("checked", true);
  }

  function openEdit(id) {
    const item = id ? data.items.find(x => x.id === id) : null;
    $("#editTitle").text(item ? t("editItem") : t("addItem"));
    $("#editId").val(item ? item.id : "");
    $("#editDate").attr({ type: "date", inputmode: "none", autocomplete: "off" }).val(item ? item.dateISO : todayISO());
    $("#editTime").attr({ type: "time", inputmode: "none" }).val(item ? item.time : "");
    $("#editGroup").val(item ? item.group : "");
    $("#editContent").val(item ? item.content : "");
    $("#editLinks").val(item ? (item.links || []).join("\n") : "");
    setEditPriority(item ? item.priority : "must");
    selectedPeople = item ? cleanNameList(item.participants) : [];
    refreshWeekday();
    renderPeoplePicker();
    openModal("editMask");
    setTimeout(() => $("#peoplePanel").removeClass("open"), 0);
  }

  async function saveEdit() {
    const id = $("#editId").val();
    const dateISO = dateToInput($("#editDate").val());
    if (!dateISO) {
      alert(t("requiredDate"));
      return;
    }

    const payload = {
      dateISO,
      time: cleanText($("#editTime").val()),
      group: cleanText($("#editGroup").val()),
      content: cleanText($("#editContent").val()),
      links: splitList($("#editLinks").val()).map(normalizeUrl).filter(Boolean),
      participants: cleanNameList(selectedPeople),
      priority: normalizePriority($("input[name=editPriority]:checked").val())
    };

    if (id) {
      const item = data.items.find(x => x.id === id);
      if (item) Object.assign(item, payload);
    } else {
      const maxSort = data.items.reduce((max, item) => Math.max(max, Number(item.sort || 0)), 0);
      data.items.push(Object.assign({ id: uid(), sort: maxSort + 1 }, payload));
    }

    closeModal("editMask");
    await saveData(true);
    setStatus("ok", t("saved"));
  }

  async function copyItem(id) {
    const source = data.items.find(item => item.id === id);
    if (!source) return;

    const maxSort = data.items.reduce((max, item) => Math.max(max, Number(item.sort || 0)), 0);
    const copied = normalizeItem(Object.assign(clone(source), {
      id: uid(),
      sort: maxSort + 1
    }), data.items.length);

    data.items.push(copied);
    await saveData(true);
    setStatus("ok", t("copied"));
  }

  async function deleteItem(id) {
    if (!confirm(t("confirmDelete"))) return;
    data.items = data.items.filter(item => item.id !== id);
    await saveData(true);
    setStatus("ok", t("deleted"));
  }

  function openPeopleConfig() {
    $("#peopleText").val(cleanNameList(data.peopleOptions).join("\n"));
    openModal("peopleMask");
  }

  async function savePeopleConfig() {
    data.peopleOptions = cleanNameList($("#peopleText").val());
    if (!data.peopleOptions.length) data.peopleOptions = cleanNameList(DEFAULT_DATA.peopleOptions);
    closeModal("peopleMask");
    await saveData(true);
    setStatus("ok", t("saved"));
  }

  function openCloudConfig() {
    ensureSettings();
    $("#cloudApiBase").val(getApiBase());
    $("#cloudPassword").val(getCloudPassword());
    $("#cloudResult").text(t("cloudNotice")).removeClass("error");
    openModal("cloudMask");
  }

  async function testCloudRead() {
    const apiBase = normalizeWorkerBase($("#cloudApiBase").val());
    const password = $("#cloudPassword").val();
    setCloudSettings(apiBase, password);

    try {
      if (!endpoint()) throw new Error("Missing endpoint");
      await fetchJson(`${endpoint()}?ts=${Date.now()}`);
      $("#cloudResult").text(t("testOk")).removeClass("error");
    } catch {
      $("#cloudResult").text(t("testFail")).addClass("error");
    }
  }

  async function saveCloudConfig() {
    setCloudSettings($("#cloudApiBase").val(), $("#cloudPassword").val());
    await saveData(true);
    $("#cloudResult").text(t("configSaved")).removeClass("error");
    setStatus("ok", t("configSaved"));
  }

  function headerMap(row) {
    const map = {};
    row.forEach((cell, index) => {
      const key = cleanText(cell).toLowerCase().replace(/\s+/g, "");
      if (["日期", "date"].includes(key)) map.date = index;
      if (["时间", "time"].includes(key)) map.time = index;
      if (["星期", "weekday", "week"].includes(key)) map.weekday = index;
      if (["计划内容", "plancontent", "content", "plan"].includes(key)) map.content = index;
      if (["小红书链接", "rednote", "rednotelink", "link", "links"].includes(key)) map.links = index;
      if (["参与人员", "people", "participants"].includes(key)) map.people = index;
      if (["类型", "重要程度", "priority", "type"].includes(key)) map.priority = index;
      if (["分组", "group"].includes(key)) map.group = index;
    });
    return map;
  }

  function findHeaderRow(rows) {
    for (let i = 0; i < Math.min(rows.length, 10); i += 1) {
      const map = headerMap(rows[i] || []);
      if (map.date != null && (map.content != null || map.time != null)) return { index: i, map };
    }
    return { index: 0, map: { date: 0, time: 1, content: 2, links: 3, people: 4 } };
  }

  function readCell(row, index) {
    return index == null ? "" : row[index];
  }

  async function importExcel(file) {
    if (!file) {
      alert(t("uploadExcel"));
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      const { index: headerIndex, map } = findHeaderRow(rows);

      const imported = [];
      let currentDate = "";
      let currentGroup = "";

      rows.slice(headerIndex + 1).forEach((row, rowIndex) => {
        if (!row || row.every(cell => cleanText(cell) === "")) return;

        const rawDateISO = dateToInput(readCell(row, map.date));
        const dateISO = rawDateISO || currentDate;
        const time = cleanText(readCell(row, map.time));
        const content = cleanText(readCell(row, map.content));
        const links = splitList(readCell(row, map.links)).map(normalizeUrl).filter(Boolean);
        const people = cleanNameList(readCell(row, map.people));
        const priority = normalizePriority(readCell(row, map.priority));
        const group = cleanText(readCell(row, map.group)) || currentGroup;

        if (rawDateISO) currentDate = rawDateISO;

        if (!rawDateISO && !time && content && !links.length && !people.length) {
          currentGroup = content;
          return;
        }

        if (!dateISO || (!content && !links.length && !time)) return;

        imported.push({
          id: uid(),
          dateISO,
          time,
          group,
          content,
          links,
          participants: people,
          priority,
          sort: data.items.length + imported.length + rowIndex + 1
        });
      });

      if (imported.length) {
        data.items = data.items.concat(imported.map(normalizeItem));
        await saveData(true);
      }

      setStatus("ok", `${t("imported")}：${imported.length}`);
    } catch (err) {
      console.error(err);
      alert(t("importFailed"));
      setStatus("warn", t("importFailed"));
    } finally {
      $("#excelFile").val("");
    }
  }

  function downloadWorkbook(workbook, filename) {
    XLSX.writeFile(workbook, filename);
  }

  function downloadTemplate(lang) {
    const zh = lang === "zh";
    const header = zh
      ? ["日期", "时间", "类型", "计划内容", "小红书链接", "参与人员"]
      : ["Date", "Time", "Type", "Plan content", "Red note", "People"];

    const rows = zh
      ? [
          header,
          ["2026-05-17", "13:00", "必做", "市中心购物", "", "Evan,Gonca"],
          ["2026-05-17", "22:00", "可选", "吃街头小吃", "", "Evan,Gonca,Lin"],
          ["2026-05-18", "08:00", "必做", "体检", "", "Evan,Gonca"]
        ]
      : [
          header,
          ["2026-05-17", "13:00", "Must do", "Center shopping", "", "Evan,Gonca"],
          ["2026-05-17", "22:00", "Optional", "Street foods", "", "Evan,Gonca,Lin"],
          ["2026-05-18", "08:00", "Must do", "Medical checkup", "", "Evan,Gonca"]
        ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 36 }, { wch: 42 }, { wch: 24 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, zh ? "中文模板" : "English Template");
    downloadWorkbook(wb, zh ? "travel-plan-template-zh.xlsx" : "travel-plan-template-en.xlsx");
  }

  function openViewer(url) {
    const safeUrl = normalizeUrl(url);
    if (!safeUrl) return;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }

  function bindEvents() {
    $("#btnMore").on("click", () => $("#morePanel").toggleClass("show"));
    $("#btnImport").on("click", () => $("#excelFile").trigger("click"));
    $("#excelFile").on("change", e => importExcel(e.target.files[0]));
    $("#btnTplZh").on("click", () => downloadTemplate("zh"));
    $("#btnTplEn").on("click", () => downloadTemplate("en"));
    $("#btnPeople").on("click", openPeopleConfig);
    $("#btnCloudflare").on("click", openCloudConfig);
    $("#btnRefresh").on("click", async () => { await loadCloudData(); render(); });
    $("#btnFabAdd").on("click", () => openEdit(null));
    $("#btnSaveEdit").on("click", saveEdit);
    $("#btnSavePeople").on("click", savePeopleConfig);
    $("#btnTestCloud").on("click", testCloudRead);
    $("#btnSaveCloud").on("click", saveCloudConfig);
    $("#searchInput").on("input", render);

    $("#btnLang").on("click", () => {
      appLang = appLang === "zh" ? "en" : "zh";
      localStorage.setItem(LS_LANG, appLang);
      render();
      refreshWeekday();
      renderPeopleSummary();
    });

    $("#editDate").on("change input", refreshWeekday);

    $("#peopleToggle").on("click", () => {
      $("#peoplePanel").toggleClass("open");
    });

    $("#peoplePanel").on("change", "input[type=checkbox]", function () {
      const value = cleanText(this.value);
      if (this.checked) {
        if (!selectedPeople.includes(value)) selectedPeople.push(value);
      } else {
        selectedPeople = selectedPeople.filter(name => name !== value);
      }
      renderPeopleSummary();
    });

    $(document).on("click", ".btnEdit", function () { openEdit($(this).data("id")); });
    $(document).on("click", ".btnCopy", function () { copyItem($(this).data("id")); });
    $(document).on("click", ".btnDelete", function () { deleteItem($(this).data("id")); });

    $(document).on("click", ".xhsLink", function (e) {
      e.preventDefault();
      openViewer($(this).data("url") || this.href);
    });

    $(document).on("click", "[data-close]", function () {
      closeModal($(this).data("close"));
    });

    $(".mask").on("click", function (e) {
      if (e.target === this) closeModal(this.id);
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeAllModals();
    });

    $(document).on("click", function (e) {
      if (!e.target.closest("#peoplePicker")) $("#peoplePanel").removeClass("open");
    });

    $(document).on("focusin", "#editMask input, #editMask textarea", function () {
      if (!isEditTextField(this)) return;
      document.body.classList.add("keyboardOpen");
      setTimeout(() => this.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" }), 180);
    });

    $(document).on("focusout", "#editMask input, #editMask textarea", function () {
      setTimeout(() => {
        if (!isEditTextField(document.activeElement)) document.body.classList.remove("keyboardOpen");
      }, 120);
    });

    document.addEventListener("touchmove", function (e) {
      if (!$(".mask.show").length) return;
      const scrollable = e.target.closest && e.target.closest(".modalBody, .peoplePanel");
      if (!scrollable) e.preventDefault();
    }, { passive: false });
  }

  async function boot() {
    refreshStandaloneClass();
    setAppHeightVar();
    bindEvents();

    loadLocal();
    render();
    setStatus("warn", t("loading"));

    await loadBundledData();
    await loadCloudData();
    render();

    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    autoRefreshTimer = setInterval(async () => {
      if (endpoint()) {
        await loadCloudData();
        render();
      }
    }, AUTO_REFRESH_MS);
  }

  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", () => setTimeout(setAppHeightVar, 250));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => { setAppHeightVar(); refreshKeyboardState(); });
    window.visualViewport.addEventListener("scroll", () => { setAppHeightVar(); refreshKeyboardState(); });
  }

  $(boot);
})();
