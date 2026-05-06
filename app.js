(function () {
  const APP_VERSION = "v2.19.0";
  const LS_DATA = "travel-plan-local-data";
  const LS_LANG = "travel-plan-ui-lang";
  const AUTO_REFRESH_MS = 60000;

  function uid() {
    return "i_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

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
      { id: uid(), dateISO: "2026-05-17", time: "13:00", group: "", content: "Center shopping", links: [], participants: ["Evan", "Gonca", "Lin"], sort: 1 },
      { id: uid(), dateISO: "2026-05-17", time: "22:00", group: "", content: "Call sister eat street foods", links: [], participants: ["Evan", "Gonca", "Lin"], sort: 2 },
      { id: uid(), dateISO: "2026-05-17", time: "23:00", group: "", content: "Hotel", links: [], participants: ["Evan", "Gonca", "Lin"], sort: 3 },
      { id: uid(), dateISO: "2026-05-18", time: "08:00", group: "", content: "Medical checkup", links: [], participants: ["Evan", "Gonca", "Ainiya", "Lin"], sort: 4 },
      { id: uid(), dateISO: "2026-05-18", time: "12:00", group: "", content: "JuZiZhou head, Snack Kingdom, Wenheyou", links: ["http://xhslink.com/o/4fAotv0DtEv"], participants: ["Evan", "Gonca", "Ainiya", "Lin"], sort: 5 },
      { id: uid(), dateISO: "2026-05-19", time: "09:00", group: "Plan 1", content: "Changsha Huayi Brothers Movie Town", links: ["http://xhslink.com/o/2SrlJCvzOXb"], participants: ["Evan", "Gonca"], sort: 6 },
      { id: uid(), dateISO: "2026-05-19", time: "19:00", group: "Plan 1", content: "Bar and club", links: [], participants: ["Evan", "Gonca"], sort: 7 },
      { id: uid(), dateISO: "2026-05-19", time: "22:00", group: "Plan 1", content: "Go back hotel", links: [], participants: ["Evan", "Gonca"], sort: 8 },
      { id: uid(), dateISO: "2026-05-19", time: "09:00", group: "Plan 2", content: "株洲攸县酒仙湖", links: ["http://xhslink.com/o/70msgGQjc3q"], participants: ["Evan", "Gonca"], sort: 9 },
      { id: uid(), dateISO: "2026-05-20", time: "11:00", group: "", content: "Go back ZhuZhou, Get glasses", links: [], participants: [], sort: 10 },
      { id: uid(), dateISO: "2026-05-20", time: "19:00", group: "", content: "Eat frog", links: [], participants: [], sort: 11 },
      { id: uid(), dateISO: "2026-05-21", time: "10:00", group: "", content: "Zoom", links: ["http://xhslink.com/o/2szPYKOkA9l"], participants: ["Evan", "Gonca", "Ainiya", "Mom"], sort: 12 },
      { id: uid(), dateISO: "2026-05-21", time: "17:00", group: "", content: "Go back ZhuZhou", links: [], participants: ["Evan", "Gonca", "Ainiya", "Mom"], sort: 13 },
      { id: uid(), dateISO: "2026-05-22", time: "", group: "", content: "BBQ, Lobster", links: [], participants: ["全家"], sort: 14 },
      { id: uid(), dateISO: "2026-05-23", time: "", group: "", content: "株洲港湾咖啡馆 / ZhuZhou Cafe", links: ["http://xhslink.com/o/3zoe1CNfnPz"], participants: ["Evan", "Gonca"], sort: 15 },
      { id: uid(), dateISO: "2026-05-24", time: "", group: "", content: "Rest, packing suitcase", links: [], participants: [], sort: 16 }
    ]
  };

  const I18N = {
    zh: {
      appTitle: "行程计划",
      add: "新增安排",
      more: "更多功能",
      import: "导入 Excel",
      tplZh: "中文模板",
      tplEn: "英文模板",
      peopleConfig: "人员配置",
      cloudflareConfig: "Cloudflare 同步配置",
      refresh: "刷新同步",
      search: "搜索日期 / 内容 / 人员",
      date: "日期",
      datePlaceholder: "选择日期",
      time: "时间",
      weekday: "星期",
      group: "分组",
      content: "计划内容",
      rednote: "小红书链接",
      people: "参与人员",
      actions: "操作",
      edit: "编辑",
      delete: "删除",
      cancel: "取消",
      save: "保存",
      savePeople: "保存人员配置",
      addTitle: "新增安排",
      editTitle: "编辑安排",
      groupPlaceholder: "例如：Plan 1",
      contentPlaceholder: "输入计划内容",
      linksPlaceholder: "每行一个链接",
      linksHint: "支持多个链接，每行一个；点击列表中的链接可弹窗预览。",
      peopleList: "人员列表",
      peopleHint: "一行一个名字。保存后会写入 data.json 的 peopleOptions。",
      peopleSyncNotice: "人员配置会和行程一起保存到 data.json，新设备加载后也会自动同步。已自动过滤乱码人员。",
      workerUrl: "Worker 地址",
      workerHint: "支持填写根地址、/data 或 /data.json。保存后会写入 data.json。",
      writePassword: "写入密码",
      passwordHint: "会保存到 data.json 的 settings.cloudflare.appPassword。",
      cloudNotice: "配置会保存到 data.json，新设备加载后会自动读取并同步。",
      testRead: "测试读取",
      saveConfig: "保存配置",
      preview: "链接预览",
      iframeTip: "如果无法显示，请新窗口打开。",
      openNew: "新窗口打开",
      loading: "正在加载数据...",
      loadingBootstrap: "正在读取本地 data.json 配置...",
      loaded: "数据已加载",
      saved: "已保存并同步",
      configSaved: "Cloudflare 配置已保存到 data.json",
      peopleSaved: "人员配置已保存到 data.json",
      localSaved: "Worker 未配置或不可用，已保存到本地 localStorage",
      imported: "Excel 已导入并保存",
      badFile: "未识别到有效数据，请检查模板格式",
      confirmDelete: "确定删除这条安排吗？",
      wrongPwd: "密码错误或没有写入权限",
      networkErr: "同步失败，请检查 Worker 地址 / CORS / 网络",
      empty: "暂无安排，点击“新增安排”开始创建。",
      updated: "更新时间",
      itemCount: "项安排",
      noTime: "待定",
      selectPeople: "请选择",
      testOk: "测试成功，已读取到 data.json。",
      testFail: "测试失败，请检查 Worker 地址、CORS 或网络。"
    },
    en: {
      eyebrow: "Multi-device travel planner",
      appTitle: "Travel Plan",
      subtitle: "Date-grouped planner with Excel import, people multi-select, Red Note preview, and Cloudflare + GitHub sync.",
      add: "Add Item",
      more: "More",
      import: "Import Excel",
      tplZh: "Chinese Template",
      tplEn: "English Template",
      peopleConfig: "People",
      cloudflareConfig: "Cloudflare Sync",
      refresh: "Refresh",
      search: "Search by date / content / people",
      date: "Date",
      datePlaceholder: "Choose a date",
      time: "Time",
      weekday: "Weekday",
      group: "Group",
      content: "Plan Content",
      rednote: "Red Note",
      people: "People",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      savePeople: "Save People",
      addTitle: "Add Item",
      editTitle: "Edit Item",
      groupPlaceholder: "For example: Plan 1",
      contentPlaceholder: "Enter plan details",
      linksPlaceholder: "One link per line",
      linksHint: "Multiple links are supported. One link per line. Click a link to preview it.",
      peopleList: "People List",
      peopleHint: "One name per line. Saved to data.json peopleOptions.",
      peopleSyncNotice: "People settings are saved to data.json with the itinerary and synced on new devices. Garbled names are filtered automatically.",
      workerUrl: "Worker URL",
      workerHint: "Root URL, /data, and /data.json are all supported. Saved to data.json.",
      writePassword: "Write Password",
      passwordHint: "Saved to data.json settings.cloudflare.appPassword.",
      cloudNotice: "Settings are saved to data.json and automatically loaded on new devices.",
      testRead: "Test Read",
      saveConfig: "Save Config",
      preview: "Link Preview",
      iframeTip: "If the page does not load, open it in a new window.",
      openNew: "Open in new window",
      loading: "Loading data...",
      loadingBootstrap: "Loading local data.json config...",
      loaded: "Data loaded",
      saved: "Saved and synced",
      configSaved: "Cloudflare config saved to data.json",
      peopleSaved: "People settings saved to data.json",
      localSaved: "Worker is not configured or unavailable; data was saved to localStorage only",
      imported: "Excel imported and saved",
      badFile: "No valid rows found. Please check the template format",
      confirmDelete: "Delete this item?",
      wrongPwd: "Wrong password or no write permission",
      networkErr: "Sync failed. Check the Worker URL / CORS / network",
      empty: "No items yet. Click Add Item to create one.",
      updated: "Updated",
      itemCount: "items",
      noTime: "TBD",
      selectPeople: "Select people",
      testOk: "Test succeeded. data.json was read.",
      testFail: "Test failed. Check Worker URL, CORS, or network."
    }
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const WEEK_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const WEEK_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  let appLang = localStorage.getItem(LS_LANG) || "zh";
  let data = clone(DEFAULT_DATA);
  let selectedPeople = [];

  let modalScrollY = 0;
  let modalBaseHeight = 0;

  function setAppHeightVar() {
    let h;

    if (document.body.classList.contains("modalLocked") && modalBaseHeight) {
      h = modalBaseHeight;
    } else {
      h = window.innerHeight || document.documentElement.clientHeight || 0;
    }

    if (!h && window.visualViewport) h = window.visualViewport.height;
    document.documentElement.style.setProperty("--app-height", Math.round(h) + "px");
  }


  
  function isMobileView() {
    return window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  }  function blurDateInput(instance, shouldBlur = true) {
    const inputs = [];
    const input = instance && instance.input ? instance.input : document.getElementById("editDate");
    const alt = instance && instance.altInput ? instance.altInput : null;
    if (input) inputs.push(input);
    if (alt) inputs.push(alt);

    inputs.forEach(function (el) {
      el.setAttribute("readonly", "readonly");
      el.setAttribute("inputmode", "none");
      el.setAttribute("autocomplete", "off");
      el.setAttribute("autocorrect", "off");
      el.setAttribute("autocapitalize", "off");
      el.setAttribute("spellcheck", "false");
      el.style.caretColor = "transparent";
      if (shouldBlur && document.activeElement === el) el.blur();
    });

    if (shouldBlur && document.activeElement && inputs.includes(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  function placeMobileCalendar(instance) {
    if (!instance || !instance.calendarContainer || !isMobileView()) return;
    const anchor = instance.altInput || instance.input;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const top = Math.max(74, Math.min(rect.bottom + 8, vh - 350));

    const cal = instance.calendarContainer;
    cal.style.position = "fixed";
    cal.style.left = "14px";
    cal.style.right = "14px";
    cal.style.top = Math.round(top) + "px";
    cal.style.width = Math.round(Math.min(vw - 28, 420)) + "px";
    cal.style.maxWidth = "calc(100vw - 28px)";
    cal.style.zIndex = "100000";
    cal.style.transform = "none";
  }

  function openDatePickerSafe() {
    if (!fp) return;
    setAppHeightVar();
    blurDateInput(fp, true);
    fp.open();
    setTimeout(function () {
      blurDateInput(fp, true);
      placeMobileCalendar(fp);
    }, 20);
    setTimeout(function () {
      blurDateInput(fp, true);
      placeMobileCalendar(fp);
    }, 120);
  }

  function lockPageScroll() {
    if (document.body.classList.contains("modalLocked")) return;
    modalScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    modalBaseHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!modalBaseHeight && window.visualViewport) modalBaseHeight = window.visualViewport.height;
    setAppHeightVar();
    document.documentElement.classList.add("modalLocked");
    document.body.classList.add("modalLocked");
    document.body.style.top = "-" + modalScrollY + "px";
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
    $("#" + id).addClass("show");
  }

  function closeModal(id) {
    $("#" + id).removeClass("show");
    if (!$(".mask.show").length) unlockPageScroll();
  }

  function closeAllModals() {
    $(".mask.show").removeClass("show");
    unlockPageScroll();
  }

  let fp = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function t(key) {
    return (I18N[appLang] && I18N[appLang][key]) || I18N.zh[key] || key;
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (s) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[s];
    });
  }

  function splitList(text) {
    return String(text || "").split(/[\n,，;；]+/).map(function (x) {
      return cleanText(x);
    }).filter(Boolean);
  }

  function normalizeUrl(url) {
    url = String(url || "").trim();
    return /^https?:\/\//i.test(url) ? url : "";
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function isValidDate(y, m, d) {
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
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
    if (typeof TextDecoder === "undefined" || typeof Uint8Array === "undefined") return String(s || "");
    const arr = Array.from(String(s || ""), function (ch) {
      return ch.charCodeAt(0) & 255;
    });
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
    (Array.isArray(list) ? list : splitList(list)).forEach(function (name) {
      const clean = cleanName(name);
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        out.push(clean);
      }
    });
    return out;
  }

  function defaultSettings() {
    return clone(DEFAULT_DATA.settings);
  }

  function normalizeWorkerBase(input) {
    let url = String(input || "").trim();
    if (!url) return "";
    url = url.replace(/\/+$/, "");
    url = url.replace(/\/data\.json$/i, "");
    url = url.replace(/\/data$/i, "");
    return url;
  }

  function ensureSettings() {
    if (!data.settings || typeof data.settings !== "object") data.settings = defaultSettings();
    if (!data.settings.cloudflare || typeof data.settings.cloudflare !== "object") data.settings.cloudflare = defaultSettings().cloudflare;
    data.settings.cloudflare.apiBase = normalizeWorkerBase(data.settings.cloudflare.apiBase || "");
    data.settings.cloudflare.appPassword = String(data.settings.cloudflare.appPassword || "");
    data.settings.cloudflare.configSavedInDataJson = true;
    data.settings.cloudflare.passwordStorage = "data.json settings.cloudflare.appPassword";
  }

  function getApiBase() {
    ensureSettings();
    return normalizeWorkerBase(data.settings.cloudflare.apiBase);
  }

  function setCloudApiBase(url) {
    ensureSettings();
    data.settings.cloudflare.apiBase = normalizeWorkerBase(url);
  }

  function getCloudPassword() {
    ensureSettings();
    return String(data.settings.cloudflare.appPassword || "");
  }

  function setCloudPassword(pwd) {
    ensureSettings();
    data.settings.cloudflare.appPassword = String(pwd || "");
  }

  function endpoint() {
    const base = getApiBase();
    return base ? base + "/data.json" : "";
  }

  function dateToInput(value) {
    let s = String(value || "").trim();
    s = s.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|星期[日一二三四五六]|周[日天一二三四五六])\s*,?\s*/i, "");
    if (!s) return "";

    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m && isValidDate(+m[1], +m[2], +m[3])) return m[1] + "-" + pad2(m[2]) + "-" + pad2(m[3]);

    m = s.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日?$/);
    if (m && isValidDate(+m[1], +m[2], +m[3])) return m[1] + "-" + pad2(m[2]) + "-" + pad2(m[3]);

    m = s.match(/^(\d{1,2})月(\d{1,2})日?$/);
    if (m) {
      const y = new Date().getFullYear();
      if (isValidDate(y, +m[1], +m[2])) return y + "-" + pad2(m[1]) + "-" + pad2(m[2]);
    }

    const map = { jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12 };

    m = s.match(/^(\d{1,2})[-\s/]?([A-Za-z]{3,9})(?:[-\s,/]*(\d{4}))?$/);
    if (m) {
      const y = +(m[3] || new Date().getFullYear());
      const mo = map[m[2].toLowerCase()];
      if (mo && isValidDate(y, mo, +m[1])) return y + "-" + pad2(mo) + "-" + pad2(m[1]);
    }

    m = s.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,?\s*(\d{4}))?$/);
    if (m) {
      const y = +(m[3] || new Date().getFullYear());
      const mo = map[m[1].toLowerCase()];
      if (mo && isValidDate(y, mo, +m[2])) return y + "-" + pad2(mo) + "-" + pad2(m[2]);
    }

    return "";
  }

  function formatDate(iso, withWeek) {
    const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return "";
    const dt = new Date(+m[1], +m[2] - 1, +m[3]);
    if (appLang === "zh") {
      const d = (dt.getMonth() + 1) + "月" + dt.getDate() + "日";
      return withWeek ? WEEK_ZH[dt.getDay()] + " · " + d : d;
    }
    const d = MONTHS[dt.getMonth()] + " " + dt.getDate();
    return withWeek ? WEEK_EN[dt.getDay()] + ", " + d : d;
  }

  function weekday(iso) {
    const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return "";
    const dt = new Date(+m[1], +m[2] - 1, +m[3]);
    return appLang === "zh" ? WEEK_ZH[dt.getDay()] : WEEK_EN[dt.getDay()];
  }

  function formatTime(time) {
    return String(time || "").trim() || t("noTime");
  }

  function setStatus(kind, message) {
    $("#statusDot").removeClass("ok warn err").addClass(kind || "");
    $("#statusText").text(message || "");
  }

  function normalize(raw) {
    const src = raw && typeof raw === "object" ? clone(raw) : clone(DEFAULT_DATA);

    data.version = src.version || APP_VERSION;
    data.updatedAt = src.updatedAt || "";
    data.settings = src.settings && typeof src.settings === "object" ? clone(src.settings) : defaultSettings();
    ensureSettings();

    let items = Array.isArray(src.items) ? src.items : [];
    if (!items.length && Array.isArray(src.rows)) {
      items = src.rows.map(function (r) {
        return {
          id: r.id || uid(),
          dateISO: r.dateISO || dateToInput(r.date),
          time: cleanText(r.time || ""),
          group: cleanText(r.group || ""),
          content: cleanText(r.content || r.plan || ""),
          links: Array.isArray(r.links) ? r.links : splitList(r.links || r.link),
          participants: Array.isArray(r.participants) ? r.participants : splitList(r.participants)
        };
      });
    }

    let peopleOptions = cleanNameList(Array.isArray(src.peopleOptions) ? src.peopleOptions : DEFAULT_DATA.peopleOptions);
    if (!peopleOptions.length) peopleOptions = clone(DEFAULT_DATA.peopleOptions);

    const normalizedItems = items.map(function (r, idx) {
      const participants = cleanNameList(Array.isArray(r.participants) ? r.participants : splitList(r.participants));
      return {
        id: String(r.id || uid()),
        dateISO: r.dateISO || dateToInput(r.date),
        time: cleanText(r.time || ""),
        group: cleanText(r.group || r.section || ""),
        content: cleanText(r.content || r.plan || ""),
        links: (Array.isArray(r.links) ? r.links : splitList(r.links || r.link)).map(normalizeUrl).filter(Boolean),
        participants: participants,
        sort: typeof r.sort === "number" ? r.sort : idx
      };
    }).filter(function (r) {
      return r.dateISO || r.content || r.links.length || r.participants.length;
    });

    normalizedItems.forEach(function (item) {
      item.participants.forEach(function (p) {
        if (!peopleOptions.includes(p)) peopleOptions.push(p);
      });
    });

    data.peopleOptions = cleanNameList(peopleOptions);
    data.items = normalizedItems.map(function (item) {
      item.participants = cleanNameList(item.participants);
      return item;
    });
  }

  function repairData() {
    ensureSettings();
    data.peopleOptions = cleanNameList(data.peopleOptions || []);
    data.items = (data.items || []).map(function (item) {
      item.time = cleanText(item.time || "");
      item.group = cleanText(item.group || "");
      item.content = cleanText(item.content || item.plan || "");
      item.links = (Array.isArray(item.links) ? item.links : splitList(item.links || item.link)).map(function (u) {
        return normalizeUrl(cleanText(u));
      }).filter(Boolean);
      item.participants = cleanNameList(item.participants || []);
      return item;
    });
  }

  function persist() {
    repairData();
    localStorage.setItem(LS_DATA, JSON.stringify(data));
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LS_DATA);
      if (raw) normalize(JSON.parse(raw));
    } catch (e) {}
  }

  async function loadBootstrapConfigFromDataJson() {
    try {
      setStatus("warn", t("loadingBootstrap"));
      const res = await fetch("./data.json?ts=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return false;
      const siteData = await res.json();
      normalize(siteData);
      persist();
      return true;
    } catch (e) {
      return false;
    }
  }

  function filteredItems() {
    const q = String($("#searchInput").val() || "").toLowerCase().trim();
    const list = clone(data.items || []).sort(function (a, b) {
      return (a.dateISO || "").localeCompare(b.dateISO || "") ||
        (a.group || "").localeCompare(b.group || "") ||
        (a.time || "").localeCompare(b.time || "") ||
        (a.sort || 0) - (b.sort || 0);
    });

    if (!q) return list;

    return list.filter(function (item) {
      return [
        formatDate(item.dateISO, true),
        item.time,
        item.group,
        item.content,
        (item.links || []).join(" "),
        (item.participants || []).join(" ")
      ].join(" ").toLowerCase().includes(q);
    });
  }

  function groupByDate(items) {
    const days = [];
    items.forEach(function (item) {
      const key = item.dateISO || "no-date";
      let day = days.find(function (x) { return x.key === key; });
      if (!day) {
        day = { key: key, dateISO: item.dateISO, items: [] };
        days.push(day);
      }
      day.items.push(item);
    });
    return days;
  }

  function chips(people) {
    return cleanNameList(people || []).map(function (p) {
      return '<span class="chip">' + esc(p) + '</span>';
    }).join("");
  }

  function renderBoard(items) {
    const days = groupByDate(items);
    if (!days.length) {
      $("#board").html('<div class="empty">' + esc(t("empty")) + '</div>');
      return;
    }

    const html = days.map(function (day) {
      const uniquePeople = cleanNameList(day.items.flatMap(function (x) { return x.participants || []; }));
      let currentGroup = null;

      const rows = day.items.map(function (item) {
        let section = "";
        const itemGroup = item.group || "";
        if (itemGroup !== currentGroup) {
          currentGroup = itemGroup;
          if (currentGroup) {
            section = '<tr class="sectionRow"><td colspan="5"><div class="section">' + esc(currentGroup) + '</div></td></tr>';
          }
        }

        const links = (item.links || []).length
          ? item.links.map(function (u) { return '<button class="linkBtn" data-link="' + esc(u) + '">' + esc(u) + '</button>'; }).join("")
          : '<span class="small">-</span>';

        return section + '<tr>' +
          '<td>' + esc(formatTime(item.time)) + '</td>' +
          '<td class="contentCell">' + esc(item.content || "-") + '</td>' +
          '<td>' + links + '</td>' +
          '<td><div class="chips">' + (chips(item.participants) || '<span class="small">-</span>') + '</div></td>' +
          '<td><div class="actions">' +
          '<button class="mini" data-edit="' + esc(item.id) + '">' + esc(t("edit")) + '</button>' +
          '<button class="mini danger" data-del="' + esc(item.id) + '">' + esc(t("delete")) + '</button>' +
          '</div></td>' +
          '</tr>';
      }).join("");

      return '<article class="day">' +
        '<div class="dayHead">' +
        '<div><h2>' + esc(formatDate(day.dateISO, true)) + '</h2><div class="small">' + day.items.length + " " + esc(t("itemCount")) + '</div></div>' +
        '<div class="chips dayPeople">' + chips(uniquePeople) + '</div>' +
        '</div>' +
        '<table class="table"><thead><tr>' +
        '<th>' + esc(t("time")) + '</th>' +
        '<th>' + esc(t("content")) + '</th>' +
        '<th>' + esc(t("rednote")) + '</th>' +
        '<th>' + esc(t("people")) + '</th>' +
        '<th>' + esc(t("actions")) + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>' +
        '</article>';
    }).join("");

    $("#board").html(html);
  }

  function applyI18n() {
    document.documentElement.lang = appLang === "zh" ? "zh-CN" : "en";
    document.title = (appLang === "zh" ? "行程计划 " : "Travel Plan ") + APP_VERSION;
    $("[data-i18n]").each(function () {
      $(this).text(t($(this).data("i18n")));
    });
    $("[data-i18n-placeholder]").each(function () {
      $(this).attr("placeholder", t($(this).data("i18n-placeholder")));
    });
    $("#btnLang").attr("title", appLang === "zh" ? "Switch to English" : "切换到中文")
      .attr("aria-label", appLang === "zh" ? "Switch to English" : "切换到中文");
    $("#btnFabAdd").attr("title", t("add")).attr("aria-label", t("add"));
    $("#updatedText").text(data.updatedAt ? t("updated") + ": " + new Date(data.updatedAt).toLocaleString(appLang === "zh" ? "zh-CN" : "en-US") : "-");
    initDatePicker();
    refreshWeekday();
  }

  function render() {
    repairData();
    renderBoard(filteredItems());
    applyI18n();
    setStatus("ok", t("loaded"));
  }

  async function loadData(silent) {
    if (!silent) setStatus("warn", t("loading"));
    const url = endpoint();
    if (!url) {
      loadLocal();
      render();
      setStatus("warn", t("localSaved"));
      return;
    }

    try {
      const res = await fetch(url + "?ts=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      normalize(await res.json());
      persist();
      render();
    } catch (e) {
      loadLocal();
      render();
      setStatus("warn", t("localSaved"));
    }
  }

  async function saveData(message) {
    repairData();
    data.version = APP_VERSION;
    data.updatedAt = new Date().toISOString();
    persist();

    const url = endpoint();
    if (!url) {
      render();
      setStatus("warn", t("localSaved"));
      return;
    }

    try {
      const pwd = getCloudPassword();
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-App-Password": pwd },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        if (res.status === 401) setStatus("err", t("wrongPwd"));
        throw new Error("save failed");
      }

      render();
      setStatus("ok", message || t("saved"));
    } catch (e) {
      render();
      setStatus("err", t("networkErr"));
    }
  }  function initDatePicker() {
    if (fp && typeof fp.destroy === "function") {
      fp.destroy();
    }
    fp = null;

    const $date = $("#editDate");
    $date
      .attr({
        type: "date",
        inputmode: "none",
        autocomplete: "off"
      })
      .prop("readonly", false);

    const el = $date.get(0);
    if (el && el.value && !/^\d{4}-\d{2}-\d{2}$/.test(el.value)) {
      const parsed = dateToInput(el.value);
      if (parsed) el.value = parsed;
    }
  }

  function refreshWeekday() {
    const iso = $("#editDate").val();
    $("#editWeekday").val(iso ? weekday(iso) : "");
  }

  function renderPicker() {
    const opts = cleanNameList(data.peopleOptions || []);
    $("#peopleSummary").html(
      selectedPeople.length
        ? '<span class="chips">' + chips(selectedPeople) + '</span>'
        : esc(t("selectPeople"))
    );
    $("#peoplePanel").html(opts.map(function (p) {
      return '<label class="peopleOption"><input type="checkbox" value="' + esc(p) + '" ' +
        (selectedPeople.includes(p) ? "checked" : "") +
        '> <span>' + esc(p) + '</span></label>';
    }).join(""));
  }

  function openEdit(id) {
    const item = id ? data.items.find(function (x) { return x.id === id; }) : { id: uid(), dateISO: todayISO(), time: "", group: "", content: "", links: [], participants: [] };
    if (!item) return;
    $("#editTitle").text(id ? t("editTitle") : t("addTitle"));
    $("#editId").val(item.id);
    $("#editDate").val(item.dateISO || "");
    if (fp) fp.setDate(item.dateISO || "", false, "Y-m-d");
    $("#editTime").val(item.time || "");
    $("#editGroup").val(item.group || "");
    $("#editContent").val(item.content || "");
    $("#editLinks").val((item.links || []).join("\n"));
    selectedPeople = cleanNameList(item.participants || []);
    renderPicker();
    refreshWeekday();
    openModal("editMask");
  }

  function todayISO() {
    const d = new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function saveEdit() {
    const id = $("#editId").val();
    const item = {
      id: id,
      dateISO: dateToInput($("#editDate").val()) || $("#editDate").val(),
      time: cleanText($("#editTime").val()),
      group: cleanText($("#editGroup").val()),
      content: cleanText($("#editContent").val()),
      links: splitList($("#editLinks").val()).map(normalizeUrl).filter(Boolean),
      participants: cleanNameList(selectedPeople),
      sort: Date.now()
    };

    item.participants.forEach(function (p) {
      if (!data.peopleOptions.includes(p)) data.peopleOptions.push(p);
    });

    const idx = data.items.findIndex(function (x) { return x.id === id; });
    if (idx >= 0) {
      item.sort = data.items[idx].sort || idx;
      data.items[idx] = item;
    } else {
      data.items.push(item);
    }

    closeModal("editMask");
    saveData(t("saved"));
  }

  function importExcel(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
        const header = rows.find(function (r) {
          return Array.isArray(r) && r.some(function (x) { return String(x).trim(); });
        });
        if (!header) throw new Error("bad header");

        const lower = header.map(function (x) { return String(x).trim().toLowerCase(); });
        function idx(names) {
          return lower.findIndex(function (x) {
            return names.map(function (n) { return n.toLowerCase(); }).includes(x);
          });
        }

        const di = idx(["日期", "date"]);
        const ti = idx(["时间", "time"]);
        const gi = idx(["分组", "group", "section"]);
        const ci = idx(["计划内容", "plan content", "content"]);
        const li = idx(["小红书链接", "red note", "xiaohongshu link", "link", "links"]);
        const pi = idx(["参与人员", "people", "participants"]);

        let lastDate = "";
        let lastPeople = [];
        const imported = [];
        const start = rows.indexOf(header) + 1;

        rows.slice(start).forEach(function (r) {
          const rawDate = di >= 0 ? String(r[di] || "").trim() : "";
          const rawTime = ti >= 0 ? cleanText(r[ti] || "") : "";
          const rawGroup = gi >= 0 ? cleanText(r[gi] || "") : "";
          const rawContent = ci >= 0 ? cleanText(r[ci] || "") : "";
          const rawLink = li >= 0 ? String(r[li] || "").trim() : "";
          const rawPeople = pi >= 0 ? cleanText(r[pi] || "") : "";

          if (!rawDate && !rawTime && !rawGroup && !rawContent && !rawLink && !rawPeople) return;

          const parsedDate = dateToInput(rawDate);
          if (parsedDate) lastDate = parsedDate;
          if (rawPeople) lastPeople = cleanNameList(splitList(rawPeople));

          imported.push({
            id: uid(),
            dateISO: lastDate,
            time: rawTime,
            group: rawGroup,
            content: rawContent,
            links: splitList(rawLink).map(normalizeUrl).filter(Boolean),
            participants: rawPeople ? cleanNameList(splitList(rawPeople)) : clone(lastPeople),
            sort: Date.now() + imported.length
          });
        });

        if (!imported.length) throw new Error("no rows");
        imported.forEach(function (item) {
          item.participants.forEach(function (p) {
            if (!data.peopleOptions.includes(p)) data.peopleOptions.push(p);
          });
        });

        data.items = imported;
        saveData(t("imported"));
      } catch (err) {
        alert(t("badFile"));
      }
      $("#excelFile").val("");
    };
    reader.readAsArrayBuffer(file);
  }

  function downloadTemplate(lang) {
    const zh = lang === "zh";
    const header = zh
      ? ["日期", "时间", "分组", "计划内容", "小红书链接", "参与人员"]
      : ["Date", "Time", "Group", "Plan Content", "Red Note", "People"];

    const rows = zh
      ? [
        ["2026-05-17", "13:00", "", "市中心逛街", "", "Evan,Gonca,Lin"],
        ["", "22:00", "", "吃夜宵", "", ""],
        ["2026-05-19", "09:00", "Plan 1", "长沙华谊兄弟电影小镇", "http://xhslink.com/o/example", "Evan,Gonca"],
        ["", "19:00", "Plan 1", "酒吧和俱乐部", "", ""],
        ["2026-05-19", "09:00", "Plan 2", "株洲攸县酒仙湖", "http://xhslink.com/o/example2", "Evan,Gonca"]
      ]
      : [
        ["2026-05-17", "13:00", "", "Center shopping", "", "Evan,Gonca,Lin"],
        ["", "22:00", "", "Eat street foods", "", ""],
        ["2026-05-19", "09:00", "Plan 1", "Changsha Huayi Brothers Movie Town", "http://xhslink.com/o/example", "Evan,Gonca"],
        ["", "19:00", "Plan 1", "Bar and club", "", ""],
        ["2026-05-19", "09:00", "Plan 2", "JiuXian Lake", "http://xhslink.com/o/example2", "Evan,Gonca"]
      ];

    const ws = XLSX.utils.aoa_to_sheet([header].concat(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, zh ? "中文模板" : "English Template");
    XLSX.writeFile(wb, zh ? "travel-plan-pro-cn-v2.19.0.xlsx" : "travel-plan-pro-en-v2.19.0.xlsx");
  }

  async function testCloud() {
    const oldBase = getApiBase();
    setCloudApiBase($("#cloudApiBase").val());
    setCloudPassword($("#cloudPassword").val());
    const url = endpoint();
    if (!url) {
      $("#cloudResult").removeClass("ok").addClass("err").text(t("testFail"));
      setCloudApiBase(oldBase);
      return;
    }
    try {
      const res = await fetch(url + "?ts=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("test failed");
      await res.json();
      $("#cloudResult").removeClass("err").addClass("ok").text(t("testOk"));
    } catch (e) {
      $("#cloudResult").removeClass("ok").addClass("err").text(t("testFail"));
    }
  }

  $(document).on("click", "[data-close]", function () {
    closeModal($(this).data("close"));
  });

  $(document).on("click", ".mask", function (e) {
    if (e.target === this) closeModal(this.id);
  });

  $(document).on("click", "[data-edit]", function () {
    openEdit($(this).data("edit"));
  });

  $(document).on("click", "[data-del]", function () {
    const id = $(this).data("del");
    if (confirm(t("confirmDelete"))) {
      data.items = data.items.filter(function (x) { return x.id !== id; });
      saveData(t("saved"));
    }
  });

  $(document).on("click", ".linkBtn", function () {
    const url = $(this).data("link");
    $("#viewerFrame").attr("src", url);
    $("#viewerOpen").attr("href", url);
    openModal("viewerMask");
  });

  $(document).on("change", "#peoplePanel input", function () {
    const v = $(this).val();
    if (this.checked) {
      if (!selectedPeople.includes(v)) selectedPeople.push(v);
    } else {
      selectedPeople = selectedPeople.filter(function (x) { return x !== v; });
    }
    selectedPeople = cleanNameList(selectedPeople);
    renderPicker();
    $("#peoplePanel").addClass("open");
  });


  let activeModalScroller = null;
  let activeModalTouchY = 0;
  let activeModalTouchX = 0;

  document.addEventListener("touchstart", function (e) {
    if (!$(".mask.show").length || !e.touches || !e.touches.length) return;
    activeModalScroller = e.target.closest(".modalBody, .peoplePanel");
    activeModalTouchY = e.touches[0].clientY;
    activeModalTouchX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchmove", function (e) {
    if (!$(".mask.show").length || !e.touches || !e.touches.length) return;

    const target = e.target;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - activeModalTouchY;
    const deltaX = currentX - activeModalTouchX;

    if (target.closest("#viewerFrame")) return;

    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
      return;
    }

    const scroller = target.closest(".modalBody, .peoplePanel");
    if (!scroller) {
      e.preventDefault();
      return;
    }

    const atTop = scroller.scrollTop <= 0;
    const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;

    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      e.preventDefault();
      return;
    }

    activeModalTouchY = currentY;
    activeModalTouchX = currentX;
  }, { passive: false });

  $(document).on("touchmove", ".mask.show", function (e) {
    const $target = $(e.target);
    if (!$target.closest(".modalBody, .peoplePanel, #viewerFrame").length) {
      e.preventDefault();
    }
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest("#peoplePicker").length) $("#peoplePanel").removeClass("open");
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeAllModals();
  });  document.addEventListener("gesturestart", function (e) {
    if ($(".mask.show").length) e.preventDefault();
  }, { passive: false });

  document.addEventListener("touchmove", function (e) {
    if (!$(".mask.show").length || !e.touches || !e.touches.length) return;
    const x = e.touches[0].clientX;
    if (typeof window.__lastModalTouchX === "number" && Math.abs(x - window.__lastModalTouchX) > 4) {
      e.preventDefault();
    }
    window.__lastModalTouchX = x;
  }, { passive: false });

  document.addEventListener("touchend", function () {
    window.__lastModalTouchX = null;
  }, { passive: true });

  $(document).on("click touchstart", "#editDate", function () {
    const el = this;
    el.readOnly = false;
    el.type = "date";
    el.inputMode = "none";
  });

  function isEditTextField(el) {
    if (!el || !el.closest || !el.closest("#editMask")) return false;
    if (el.id === "editDate") return false;
    const tag = (el.tagName || "").toLowerCase();
    const type = (el.getAttribute("type") || "").toLowerCase();
    return tag === "textarea" || (tag === "input" && type !== "date" && type !== "hidden" && type !== "checkbox");
  }

  $(document).on("focusin", "#editMask input, #editMask textarea", function () {
    if (!isEditTextField(this)) return;
    document.body.classList.add("keyboardOpen");
    setTimeout(() => {
      const body = document.querySelector("#editMask .modalBody");
      if (body && this.scrollIntoView) {
        this.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }
    }, 260);
  });

  $(document).on("focusout", "#editMask input, #editMask textarea", function () {
    setTimeout(() => {
      const active = document.activeElement;
      if (!isEditTextField(active)) {
        document.body.classList.remove("keyboardOpen");
      }
    }, 120);
  });

  $("#btnFabAdd").on("click", function () { openEdit(null); });
  $("#btnMore").on("click", function () { $("#morePanel").toggleClass("show"); });
  $("#btnSaveEdit").on("click", saveEdit);
  $("#btnImport").on("click", function () { $("#excelFile").click(); });
  $("#excelFile").on("change", function () {
    if (this.files && this.files[0]) importExcel(this.files[0]);
  });
  $("#btnTplZh").on("click", function () { downloadTemplate("zh"); });
  $("#btnTplEn").on("click", function () { downloadTemplate("en"); });
  $("#btnPeople").on("click", function () {
    repairData();
    $("#peopleText").val(cleanNameList(data.peopleOptions || []).join("\n"));
    openModal("peopleMask");
  });
  $("#btnSavePeople").on("click", function () {
    const newOptions = cleanNameList($("#peopleText").val().split(/\n+/));
    data.peopleOptions = newOptions;
    data.items = (data.items || []).map(function (item) {
      item.participants = cleanNameList(item.participants || []).filter(function (p) {
        return newOptions.includes(p);
      });
      return item;
    });
    closeModal("peopleMask");
    saveData(t("peopleSaved"));
  });
  $("#btnCloudflare").on("click", function () {
    $("#cloudApiBase").val(getApiBase());
    $("#cloudPassword").val(getCloudPassword());
    $("#cloudResult").removeClass("ok err").text(t("cloudNotice"));
    openModal("cloudMask");
  });
  $("#btnSaveCloud").on("click", function () {
    setCloudApiBase($("#cloudApiBase").val());
    setCloudPassword($("#cloudPassword").val());
    closeModal("cloudMask");
    saveData(t("configSaved"));
  });
  $("#btnTestCloud").on("click", testCloud);
  $("#btnRefresh").on("click", function () { loadData(false); });
  $("#btnLang").on("click", function () {
    appLang = appLang === "zh" ? "en" : "zh";
    localStorage.setItem(LS_LANG, appLang);
    render();
  });
  $("#searchInput").on("input", render);
  $("#editDate").on("input change", refreshWeekday);
  $("#peopleToggle").on("click", function () { $("#peoplePanel").toggleClass("open"); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) loadData(true); });

  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setAppHeightVar);
    window.visualViewport.addEventListener("scroll", setAppHeightVar);
  }
  window.addEventListener("orientationchange", function () {
    setTimeout(setAppHeightVar, 250);
  });


  async function boot() {
    loadLocal();
    render();
    await loadBootstrapConfigFromDataJson();
    await loadData(false);
    setInterval(function () { loadData(true); }, AUTO_REFRESH_MS);
  }

  boot();
})();
