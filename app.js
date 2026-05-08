(function () {
  "use strict";

  const APP_VERSION = "v2.43.0";
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
      currentPlan: "当前计划",
      planManagement: "计划管理",
      planManageHint: "所有计划、归档状态和当前计划都会保存到 data.json，并通过 Cloudflare 同步。",
      activePlans: "当前计划",
      archivedPlans: "归档计划",
      newPlan: "新建计划",
      editPlan: "编辑计划",
      savePlan: "保存计划",
      planName: "计划名称",
      destination: "目的地",
      startDate: "开始日期",
      endDate: "结束日期",
      note: "备注",
      planNamePlaceholder: "例如：中国 7 天计划",
      destinationPlaceholder: "例如：中国 / 墨西哥 / 土耳其",
      planNotePlaceholder: "可选，记录这次旅行说明",
      openPlan: "打开",
      copyPlan: "复制",
      archivePlan: "归档",
      restorePlan: "恢复",
      permanentDelete: "永久删除",
      activePlanBadge: "当前",
      archivedBadge: "已归档",
      itemCount: "项安排",
      archivedReadonly: "当前是归档计划，只读查看；如需修改请先恢复。",
      confirmArchivePlan: "确认归档这个计划吗？行程不会删除，只会进入归档列表。",
      confirmDeletePlan: "确认永久删除这个归档计划和它下面的所有安排吗？此操作不可恢复。",
      requiredPlanName: "请输入计划名称",
      planSaved: "计划已保存",
      planArchived: "计划已归档",
      planRestored: "计划已恢复",
      planDeleted: "计划已删除",
      planCopied: "计划已复制",
      more: "更多功能",
      settings: "设置",
      cloudflareConfig: "Cloudflare 同步配置",
      syncData: "同步数据",
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
      settingsSyncNotice: "设置会和行程一起保存到 data.json，新设备加载后也会自动同步。",
      peopleList: "人员列表",
      peopleHint: "一行一个名字。保存后会写入 data.json 的 peopleOptions。",
      displaySettings: "显示配置",
      displaySettingsHint: "这些配置会保存到 data.json，可分别控制 PC 和移动端显示内容。",
      showOnPC: "PC显示",
      showOnMobile: "移动端显示",
      displayCardPeople: "计划内容卡片 People 列",
      displayDayItemCount: "日期卡片 items 数量行",
      displayDaySummary: "日期卡片时间 / 必做 / 人数摘要行",
      saveSettings: "保存设置",
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
      currentPlan: "Current Plan",
      planManagement: "Plan Management",
      planManageHint: "Plans, archive status, and the selected plan are saved to data.json and synced through Cloudflare.",
      activePlans: "Active Plans",
      archivedPlans: "Archived Plans",
      newPlan: "New Plan",
      editPlan: "Edit Plan",
      savePlan: "Save Plan",
      planName: "Plan Name",
      destination: "Destination",
      startDate: "Start Date",
      endDate: "End Date",
      note: "Note",
      planNamePlaceholder: "For example: China 7-day plan",
      destinationPlaceholder: "For example: China / Mexico / Turkey",
      planNotePlaceholder: "Optional note for this trip",
      openPlan: "Open",
      copyPlan: "Copy",
      archivePlan: "Archive",
      restorePlan: "Restore",
      permanentDelete: "Delete Forever",
      activePlanBadge: "Current",
      archivedBadge: "Archived",
      itemCount: "items",
      archivedReadonly: "This archived plan is read-only. Restore it before editing.",
      confirmArchivePlan: "Archive this plan? Its items will not be deleted.",
      confirmDeletePlan: "Delete this archived plan and all its items forever? This cannot be undone.",
      requiredPlanName: "Please enter a plan name",
      planSaved: "Plan saved",
      planArchived: "Plan archived",
      planRestored: "Plan restored",
      planDeleted: "Plan deleted",
      planCopied: "Plan copied",
      more: "More",
      import: "Import Excel",
      tplZh: "Chinese Template",
      tplEn: "English Template",
      settings: "Settings",
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
      settingsSyncNotice: "Settings are saved to data.json together with plans and sync on new devices.",
      peopleList: "People list",
      peopleHint: "One name per line. Saving writes to data.json peopleOptions.",
      displaySettings: "Display Settings",
      displaySettingsHint: "These settings are saved to data.json and can control PC and mobile display separately.",
      showOnPC: "Show on PC",
      showOnMobile: "Show on mobile",
      displayCardPeople: "People column in plan cards",
      displayDayItemCount: "Day card items count line",
      displayDaySummary: "Day card time / must-do / people summary line",
      saveSettings: "Save Settings",
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
      }
    },
    plans: [
      { id: "plan_default", name: "当前旅行计划", destination: "", startDate: "2026-05-17", endDate: "2026-05-19", status: "open", createdAt: "", archivedAt: "", sort: 1, note: "" }
    ],
    peopleOptions: ["Evan", "Gonca", "Ainiya", "Lin", "Mom", "全家"],
    items: [
      { id: "i_001", planId: "plan_default", dateISO: "2026-05-17", time: "13:00", group: "", content: "Center shopping", links: [], participants: ["Evan", "Gonca", "Lin"], priority: "must", sort: 1 },
      { id: "i_002", planId: "plan_default", dateISO: "2026-05-17", time: "22:00", group: "", content: "Call sister eat street foods", links: [], participants: ["Evan", "Gonca", "Lin"], priority: "optional", sort: 2 },
      { id: "i_003", planId: "plan_default", dateISO: "2026-05-17", time: "23:00", group: "", content: "Hotel", links: [], participants: ["Evan", "Gonca"], priority: "must", sort: 3 },
      { id: "i_004", planId: "plan_default", dateISO: "2026-05-18", time: "08:00", group: "", content: "Medical checkup", links: [], participants: ["Evan", "Gonca", "Ainiya", "Lin"], priority: "must", sort: 4 },
      { id: "i_005", planId: "plan_default", dateISO: "2026-05-18", time: "12:00", group: "", content: "JuZiZhou head, Snack Kingdom, Wenheyou", links: ["http://xhslink.com/o/4fAotv0DtEv"], participants: ["Evan", "Gonca", "Ainiya", "Lin"], priority: "optional", sort: 5 },
      { id: "i_006", planId: "plan_default", dateISO: "2026-05-19", time: "09:00", group: "Plan 1", content: "Changsha Huayi Brothers Movie Town", links: ["http://xhslink.com/o/2SrIJCvzOXb"], participants: ["Evan", "Gonca"], priority: "must", sort: 6 }
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

  function planUid() {
    return "plan_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
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

  function currentDeviceKey() {
    return isMobile() ? "mobile" : "pc";
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
    const fallback = clone(DEFAULT_DATA.settings.displayOptions);
    value = value && typeof value === "object" ? value : {};

    return {
      cardPeople: normalizeDeviceVisibility(value.cardPeople || value.peopleColumn || value.people, fallback.cardPeople),
      dayItemCount: normalizeDeviceVisibility(value.dayItemCount || value.itemCount || value.itemsLine, fallback.dayItemCount),
      daySummary: normalizeDeviceVisibility(value.daySummary || value.summaryLine || value.dayMeta, fallback.daySummary)
    };
  }

  function isDisplayOptionVisible(key) {
    ensureSettings();
    const device = currentDeviceKey();
    const options = data.settings.displayOptions || DEFAULT_DATA.settings.displayOptions;
    const item = options[key] || DEFAULT_DATA.settings.displayOptions[key] || { pc: true, mobile: true };
    return item[device] !== false;
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
    data.settings.displayOptions = normalizeDisplayOptions(data.settings.displayOptions);

    if (!Array.isArray(data.plans) || !data.plans.length) {
      data.plans = [makeDefaultPlanFromItems(data.items || [])];
    }

    const requestedPlanId = cleanText(data.settings.activePlanId || "");
    const firstOpen = (data.plans || []).find(plan => plan.status !== "archived");
    const firstPlan = firstOpen || (data.plans || [])[0];
    if (!requestedPlanId || !planExists(requestedPlanId)) {
      data.settings.activePlanId = firstPlan ? firstPlan.id : "plan_default";
    }
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


  function normalizePlanStatus(value) {
    const raw = cleanText(value).toLowerCase();
    if (["archived", "archive", "归档", "已归档"].includes(raw)) return "archived";
    return "open";
  }

  function normalizePlan(plan, index) {
    plan = plan && typeof plan === "object" ? plan : {};
    const id = cleanText(plan.id) || (index === 0 ? "plan_default" : planUid());
    const name = cleanText(plan.name || plan.title || plan["计划名称"] || plan["Plan Name"]) || (appLang === "en" ? "Travel Plan" : "当前旅行计划");
    return {
      id,
      name,
      destination: cleanText(plan.destination || plan.city || plan["目的地"] || plan["Destination"]),
      startDate: dateToInput(plan.startDate || plan.start || plan["开始日期"] || plan["Start Date"]),
      endDate: dateToInput(plan.endDate || plan.end || plan["结束日期"] || plan["End Date"]),
      status: normalizePlanStatus(plan.status),
      createdAt: cleanText(plan.createdAt) || new Date().toISOString(),
      archivedAt: cleanText(plan.archivedAt),
      sort: Number(plan.sort || index + 1),
      note: cleanText(plan.note || plan.remark || plan["备注"] || plan["Note"])
    };
  }

  function getPlanItems(planId) {
    const id = cleanText(planId || getActivePlanId());
    return data.items.filter(item => item.planId === id);
  }

  function derivePlanDates(items) {
    const dates = (items || []).map(item => dateToInput(item.dateISO || item.date)).filter(Boolean).sort();
    return { startDate: dates[0] || "", endDate: dates[dates.length - 1] || "" };
  }

  function makeDefaultPlanFromItems(items) {
    const range = derivePlanDates(items || []);
    return normalizePlan({
      id: "plan_default",
      name: appLang === "en" ? "Current Travel Plan" : "当前旅行计划",
      destination: "",
      startDate: range.startDate,
      endDate: range.endDate,
      status: "open",
      createdAt: "",
      archivedAt: "",
      sort: 1,
      note: ""
    }, 0);
  }

  function planExists(planId) {
    return (data.plans || []).some(plan => plan.id === planId);
  }

  function getOpenPlans() {
    return (data.plans || []).filter(plan => plan.status !== "archived").sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  }

  function getArchivedPlans() {
    return (data.plans || []).filter(plan => plan.status === "archived").sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  }

  function getActivePlanId() {
    ensureSettings();
    return data.settings.activePlanId;
  }

  function getActivePlan() {
    ensureSettings();
    return (data.plans || []).find(plan => plan.id === data.settings.activePlanId) || (data.plans || [])[0] || null;
  }

  function isActivePlanArchived() {
    const plan = getActivePlan();
    return Boolean(plan && plan.status === "archived");
  }

  function planRangeText(plan) {
    if (!plan) return "";
    if (plan.startDate && plan.endDate) return `${plan.startDate} ~ ${plan.endDate}`;
    return plan.startDate || plan.endDate || "";
  }

  function planItemCount(planId) {
    return data.items.filter(item => item.planId === planId).length;
  }

  function updatePlanBar() {
    const plan = getActivePlan();
    const count = plan ? planItemCount(plan.id) : 0;
    const name = plan ? plan.name : t("currentPlan");
    const statusHtml = plan && plan.status === "archived" ? `<span class="planStatus archived">${escapeHtml(t("archivedBadge"))}</span>` : "";
    const range = planRangeText(plan);
    const metaParts = [];
    if (range) metaParts.push(range);
    metaParts.push(`${count} ${escapeHtml(t("itemCount"))}`);
    if (plan && plan.destination) metaParts.push(plan.destination);

    $("#currentPlanName").text(name);
    $("#currentPlanStatus").html(statusHtml);
    $("#currentPlanMeta").text(metaParts.join(" · "));
    $("body").toggleClass("archivedPlanMode", Boolean(plan && plan.status === "archived"));
    $("#archivedReadonlyNotice").toggle(Boolean(plan && plan.status === "archived"));
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

  function normalizeItem(item, index, fallbackPlanId) {
    item = item && typeof item === "object" ? item : {};
    const planId = cleanText(item.planId || item.planID || item.tripId || item.tripID) || cleanText(fallbackPlanId) || "plan_default";
    return {
      id: cleanText(item.id) || uid(),
      planId,
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
    const rawItems = Array.isArray(input.items) ? input.items : [];
    let plans = Array.isArray(input.plans) ? input.plans.map(normalizePlan) : [];

    if (!plans.length) {
      plans = [makeDefaultPlanFromItems(rawItems.length ? rawItems : DEFAULT_DATA.items)];
    }

    const planIds = new Set(plans.map(plan => plan.id));
    let activePlanId = cleanText((input.settings && input.settings.activePlanId) || input.activePlanId || "");
    if (!activePlanId || !planIds.has(activePlanId)) {
      const firstOpen = plans.find(plan => plan.status !== "archived");
      activePlanId = (firstOpen || plans[0]).id;
    }

    base.version = APP_VERSION;
    base.updatedAt = cleanText(input.updatedAt || "");
    base.settings = Object.assign({}, base.settings, input.settings || {}, { activePlanId });
    base.settings.cloudflare = Object.assign({}, DEFAULT_DATA.settings.cloudflare, (input.settings && input.settings.cloudflare) || {});
    base.settings.displayOptions = normalizeDisplayOptions((input.settings && input.settings.displayOptions) || input.displayOptions);
    base.plans = plans;
    base.peopleOptions = cleanNameList(input.peopleOptions || base.peopleOptions);
    base.items = rawItems.map((item, index) => {
      const fixed = normalizeItem(item, index, activePlanId);
      if (!planIds.has(fixed.planId)) fixed.planId = activePlanId;
      return fixed;
    });

    if (!base.peopleOptions.length) base.peopleOptions = cleanNameList(DEFAULT_DATA.peopleOptions);
    data = base;
    ensureSettings();
    repairData();
    return data;
  }

  function repairData() {
    if (!Array.isArray(data.plans) || !data.plans.length) {
      data.plans = [makeDefaultPlanFromItems(data.items || [])];
    }

    data.plans = data.plans.map(normalizePlan);
    const planIds = new Set(data.plans.map(plan => plan.id));
    ensureSettings();
    const fallbackPlanId = data.settings.activePlanId || (data.plans[0] && data.plans[0].id) || "plan_default";
    const options = new Set(cleanNameList(data.peopleOptions));

    data.items = (Array.isArray(data.items) ? data.items : []).map((item, index) => {
      const fixed = normalizeItem(item, index, fallbackPlanId);
      if (!planIds.has(fixed.planId)) fixed.planId = fallbackPlanId;
      fixed.participants.forEach(name => options.add(name));
      return fixed;
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
    const activePlanId = getActivePlanId();
    const items = data.items
      .filter(item => item.planId === activePlanId)
      .sort((a, b) => itemSortValue(a).localeCompare(itemSortValue(b)));

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
    if (!isDisplayOptionVisible("daySummary")) return "";

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
    const showPeopleColumn = isDisplayOptionVisible("cardPeople");
    const hasPeople = showPeopleColumn && (item.participants || []).length > 0;
    const readonly = isActivePlanArchived();
    const actionButtons = readonly
      ? `<span class="readonlyTag">${escapeHtml(t("archivedBadge"))}</span>`
      : `
          <button class="secondary btnEdit" data-id="${escapeHtml(item.id)}">${escapeHtml(t("edit"))}</button>
          <button class="secondary btnCopy" data-id="${escapeHtml(item.id)}">${escapeHtml(t("copy"))}</button>
          <button class="danger btnDelete" data-id="${escapeHtml(item.id)}">${escapeHtml(t("delete"))}</button>`;
    const swipeButtons = readonly ? "" : `
          <button class="secondary btnEdit" data-id="${escapeHtml(item.id)}">${escapeHtml(t("edit"))}</button>
          <button class="secondary btnCopy" data-id="${escapeHtml(item.id)}">${escapeHtml(t("copy"))}</button>
          <button class="danger btnDelete" data-id="${escapeHtml(item.id)}">${escapeHtml(t("delete"))}</button>`;

    const priority = normalizePriority(item.priority);
    return `
      <article class="planRow priority-${priority} ${readonly ? "readonly" : ""} ${hasLinks ? "hasLinks" : ""} ${hasPeople ? "hasPeople" : ""} ${showPeopleColumn ? "" : "peopleHidden"}" data-id="${escapeHtml(item.id)}">
        <div class="cell timeCell" data-label="${escapeHtml(t("time"))}">${escapeHtml(item.time || "-")}</div>
        <div class="cell contentCell" data-label="${escapeHtml(t("content"))}">
          <div class="contentText">${priorityBadgeHtml(priority)}<span class="contentMain">${escapeHtml(item.content || "-")}</span></div>
        </div>
        <div class="cell linkCell ${hasLinks ? "" : "emptyCell"}" data-label="${escapeHtml(t("rednote"))}">${linkHtml(item.links)}</div>
        <div class="cell peopleCell ${showPeopleColumn ? "" : "hiddenBySetting"} ${hasPeople ? "" : "emptyCell"}" data-label="${escapeHtml(t("people"))}">${showPeopleColumn ? chipHtml(item.participants) : ""}</div>
        <div class="cell actionCell">${actionButtons}</div>
        <div class="swipeActions" aria-hidden="true">${swipeButtons}</div>
      </article>`;
  }

  function renderBoard(items) {
    const $board = $("#board");
    if (!getPlanItems(getActivePlanId()).length) {
      const archivedNotice = isActivePlanArchived() ? `<div class="notice archivedReadonlyInline">${escapeHtml(t("archivedReadonly"))}</div>` : "";
      $board.html(`${archivedNotice}<section class="empty">${escapeHtml(t("noData"))}</section>`);
      return;
    }
    if (!items.length) {
      $board.html(`<section class="empty">${escapeHtml(t("noMatch"))}</section>`);
      return;
    }

    const showPeopleColumn = isDisplayOptionVisible("cardPeople");
    const showDayItemCount = isDisplayOptionVisible("dayItemCount");

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
        <section class="dayCard ${showPeopleColumn ? "" : "hidePeopleColumn"}">
          <header class="dayHead">
            <div>
              <h2>${escapeHtml(formatDate(dateISO))}</h2>
              ${showDayItemCount ? `<p>${dayItems.length} ${appLang === "zh" ? "项安排" : dayItems.length === 1 ? "item" : "items"}</p>` : ""}
              ${daySummaryHtml(dayItems)}
            </div>
          </header>
          <div class="tableHead">
            <span>${escapeHtml(t("time"))}</span>
            <span>${escapeHtml(t("content"))}</span>
            <span>${escapeHtml(t("rednote"))}</span>
            <span class="${showPeopleColumn ? "" : "peopleHeadHidden"}">${escapeHtml(t("people"))}</span>
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

    $("#btnPeople").attr({ title: t("settings"), "aria-label": t("settings") });
    $("#btnCloudflare").attr({ title: t("cloudflareConfig"), "aria-label": t("cloudflareConfig") });
    $("#btnPlanManager").attr({ title: t("planManagement"), "aria-label": t("planManagement") });
    $("#btnCurrentPlan").attr({ title: t("planManagement"), "aria-label": t("planManagement") });
    $("#btnFabAdd").attr({ title: t("addItem"), "aria-label": t("addItem") });
    $("#btnFabSync").attr({ title: t("syncData"), "aria-label": t("syncData") });
    $("#btnLang").attr({
      title: appLang === "zh" ? "Switch to English" : "切换中文",
      "aria-label": appLang === "zh" ? "Switch to English" : "切换中文"
    });
  }

  function render() {
    applyI18n();
    ensureSettings();
    updatePlanBar();
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
    if (isActivePlanArchived()) {
      openPlanManager();
      return;
    }
    const activePlanId = getActivePlanId();
    const item = id ? data.items.find(x => x.id === id && x.planId === activePlanId) : null;
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
      const item = data.items.find(x => x.id === id && x.planId === getActivePlanId());
      if (item) Object.assign(item, payload);
    } else {
      const activePlanId = getActivePlanId();
      const maxSort = getPlanItems(activePlanId).reduce((max, item) => Math.max(max, Number(item.sort || 0)), 0);
      data.items.push(Object.assign({ id: uid(), planId: activePlanId, sort: maxSort + 1 }, payload));
    }

    closeModal("editMask");
    await saveData(true);
    setStatus("ok", t("saved"));
  }

  async function copyItem(id) {
    if (isActivePlanArchived()) return;
    const activePlanId = getActivePlanId();
    const source = data.items.find(item => item.id === id && item.planId === activePlanId);
    if (!source) return;

    const maxSort = getPlanItems(activePlanId).reduce((max, item) => Math.max(max, Number(item.sort || 0)), 0);
    const copied = normalizeItem(Object.assign(clone(source), {
      id: uid(),
      planId: activePlanId,
      sort: maxSort + 1
    }), data.items.length, activePlanId);

    data.items.push(copied);
    await saveData(true);
    setStatus("ok", t("copied"));
  }

  async function deleteItem(id) {
    if (isActivePlanArchived()) return;
    if (!confirm(t("confirmDelete"))) return;
    const activePlanId = getActivePlanId();
    data.items = data.items.filter(item => !(item.id === id && item.planId === activePlanId));
    await saveData(true);
    setStatus("ok", t("deleted"));
  }

  function renderDisplayOptionsConfig() {
    ensureSettings();
    const options = normalizeDisplayOptions(data.settings.displayOptions);

    $("#displayOptionsList input[data-display-key]").each(function () {
      const key = $(this).data("display-key");
      const device = $(this).data("device");
      const checked = options[key] && options[key][device] !== false;
      $(this).prop("checked", checked);
    });
  }

  function readDisplayOptionsConfig() {
    const options = normalizeDisplayOptions(data.settings && data.settings.displayOptions);

    $("#displayOptionsList input[data-display-key]").each(function () {
      const key = $(this).data("display-key");
      const device = $(this).data("device");
      if (!options[key]) options[key] = { pc: true, mobile: true };
      options[key][device] = this.checked;
    });

    return normalizeDisplayOptions(options);
  }

  function openPeopleConfig() {
    ensureSettings();
    $("#peopleText").val(cleanNameList(data.peopleOptions).join("\n"));
    renderDisplayOptionsConfig();
    openModal("peopleMask");
  }

  async function savePeopleConfig() {
    data.peopleOptions = cleanNameList($("#peopleText").val());
    if (!data.peopleOptions.length) data.peopleOptions = cleanNameList(DEFAULT_DATA.peopleOptions);
    ensureSettings();
    data.settings.displayOptions = readDisplayOptionsConfig();
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


  function resetPlanForm(plan) {
    const p = plan || null;
    $("#planEditTitle").text(p ? t("editPlan") : t("newPlan"));
    $("#planEditId").val(p ? p.id : "");
    $("#planName").val(p ? p.name : "");
    $("#planDestination").val(p ? p.destination : "");
    $("#planStartDate").attr({ type: "date", inputmode: "none", autocomplete: "off" }).val(p ? p.startDate : "");
    $("#planEndDate").attr({ type: "date", inputmode: "none", autocomplete: "off" }).val(p ? p.endDate : "");
    $("#planNote").val(p ? p.note : "");
  }

  function planCardHtml(plan) {
    const active = plan.id === getActivePlanId();
    const count = planItemCount(plan.id);
    const range = planRangeText(plan);
    const meta = [range, plan.destination, `${count} ${t("itemCount")}`].filter(Boolean).join(" · ");
    const statusBadge = active ? `<span class="planBadge active">${escapeHtml(t("activePlanBadge"))}</span>` : "";
    const archivedBadge = plan.status === "archived" ? `<span class="planBadge archived">${escapeHtml(t("archivedBadge"))}</span>` : "";
    const archivedAt = plan.status === "archived" && plan.archivedAt ? `<div class="planArchivedAt">${escapeHtml(t("updatedAt"))}${escapeHtml(displayDateTime(plan.archivedAt))}</div>` : "";
    const archiveAction = plan.status === "archived"
      ? `<button class="secondary" data-plan-action="restore" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("restorePlan"))}</button>
         <button class="danger" data-plan-action="delete" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("permanentDelete"))}</button>`
      : `<button class="danger" data-plan-action="archive" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("archivePlan"))}</button>`;

    return `
      <article class="planManageCard ${active ? "active" : ""} ${plan.status === "archived" ? "archived" : ""}">
        <div class="planManageMain">
          <div class="planManageName">${escapeHtml(plan.name)} ${statusBadge}${archivedBadge}</div>
          <div class="planManageMeta">${escapeHtml(meta || "-")}</div>
          ${plan.note ? `<div class="planManageNote">${escapeHtml(plan.note)}</div>` : ""}
          ${archivedAt}
        </div>
        <div class="planManageActions">
          <button class="secondary" data-plan-action="open" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("openPlan"))}</button>
          <button class="secondary" data-plan-action="edit" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("edit"))}</button>
          <button class="secondary" data-plan-action="copy" data-id="${escapeHtml(plan.id)}">${escapeHtml(t("copyPlan"))}</button>
          ${archiveAction}
        </div>
      </article>`;
  }

  function renderPlanList() {
    const openPlans = getOpenPlans();
    const archivedPlans = getArchivedPlans();
    const openHtml = openPlans.length ? openPlans.map(planCardHtml).join("") : `<div class="empty miniEmpty">${escapeHtml(t("noData"))}</div>`;
    const archivedHtml = archivedPlans.length ? archivedPlans.map(planCardHtml).join("") : `<div class="empty miniEmpty">${escapeHtml(t("noData"))}</div>`;
    $("#planList").html(`
      <section class="planListGroup">
        <h3>${escapeHtml(t("activePlans"))}</h3>
        ${openHtml}
      </section>
      <section class="planListGroup">
        <h3>${escapeHtml(t("archivedPlans"))}</h3>
        ${archivedHtml}
      </section>`);
  }

  function openPlanManager() {
    ensureSettings();
    resetPlanForm(null);
    renderPlanList();
    openModal("planMask");
  }

  async function savePlanForm() {
    const id = cleanText($("#planEditId").val());
    const name = cleanText($("#planName").val());
    if (!name) {
      alert(t("requiredPlanName"));
      return;
    }

    const payload = {
      name,
      destination: cleanText($("#planDestination").val()),
      startDate: dateToInput($("#planStartDate").val()),
      endDate: dateToInput($("#planEndDate").val()),
      note: cleanText($("#planNote").val())
    };

    if (id) {
      const plan = data.plans.find(item => item.id === id);
      if (plan) Object.assign(plan, payload);
    } else {
      const maxSort = data.plans.reduce((max, plan) => Math.max(max, Number(plan.sort || 0)), 0);
      const plan = normalizePlan(Object.assign({
        id: planUid(),
        status: "open",
        createdAt: new Date().toISOString(),
        archivedAt: "",
        sort: maxSort + 1
      }, payload), data.plans.length);
      data.plans.push(plan);
      data.settings.activePlanId = plan.id;
    }

    await saveData(true);
    resetPlanForm(null);
    renderPlanList();
    setStatus("ok", t("planSaved"));
  }

  async function openPlan(planId) {
    if (!planExists(planId)) return;
    data.settings.activePlanId = planId;
    $("#searchInput").val("");
    await saveData(true);
    renderPlanList();
    setStatus("ok", t("loaded"));
  }

  function editPlan(planId) {
    const plan = data.plans.find(item => item.id === planId);
    if (!plan) return;
    resetPlanForm(plan);
  }

  async function archivePlan(planId) {
    const plan = data.plans.find(item => item.id === planId);
    if (!plan || plan.status === "archived") return;
    if (!confirm(t("confirmArchivePlan"))) return;
    plan.status = "archived";
    plan.archivedAt = new Date().toISOString();
    await saveData(true);
    renderPlanList();
    setStatus("ok", t("planArchived"));
  }

  async function restorePlan(planId) {
    const plan = data.plans.find(item => item.id === planId);
    if (!plan) return;
    plan.status = "open";
    plan.archivedAt = "";
    data.settings.activePlanId = plan.id;
    await saveData(true);
    renderPlanList();
    setStatus("ok", t("planRestored"));
  }

  async function copyPlan(planId) {
    const source = data.plans.find(item => item.id === planId);
    if (!source) return;
    const newPlanId = planUid();
    const suffix = appLang === "en" ? " Copy" : " 副本";
    const maxPlanSort = data.plans.reduce((max, plan) => Math.max(max, Number(plan.sort || 0)), 0);
    const copiedPlan = normalizePlan(Object.assign(clone(source), {
      id: newPlanId,
      name: `${source.name}${suffix}`,
      status: "open",
      createdAt: new Date().toISOString(),
      archivedAt: "",
      sort: maxPlanSort + 1
    }), data.plans.length);

    const copiedItems = getPlanItems(source.id).map((item, index) => normalizeItem(Object.assign(clone(item), {
      id: uid(),
      planId: newPlanId,
      sort: index + 1
    }), index, newPlanId));

    data.plans.push(copiedPlan);
    data.items.push(...copiedItems);
    data.settings.activePlanId = newPlanId;
    await saveData(true);
    resetPlanForm(null);
    renderPlanList();
    setStatus("ok", t("planCopied"));
  }

  async function deletePlan(planId) {
    const plan = data.plans.find(item => item.id === planId);
    if (!plan || plan.status !== "archived") return;
    if (!confirm(t("confirmDeletePlan"))) return;
    data.plans = data.plans.filter(item => item.id !== planId);
    data.items = data.items.filter(item => item.planId !== planId);
    if (data.settings.activePlanId === planId) {
      const next = getOpenPlans()[0] || getArchivedPlans()[0] || makeDefaultPlanFromItems([]);
      if (!planExists(next.id)) data.plans.push(next);
      data.settings.activePlanId = next.id;
    }
    await saveData(true);
    resetPlanForm(null);
    renderPlanList();
    setStatus("ok", t("planDeleted"));
  }

  async function handlePlanAction(action, planId) {
    if (action === "open") return openPlan(planId);
    if (action === "edit") return editPlan(planId);
    if (action === "copy") return copyPlan(planId);
    if (action === "archive") return archivePlan(planId);
    if (action === "restore") return restorePlan(planId);
    if (action === "delete") return deletePlan(planId);
  }

  function openViewer(url) {
    const safeUrl = normalizeUrl(url);
    if (!safeUrl) return;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }

  function updateFabVisibilityBySwipe() {
    const hasOpenSwipeRow = window.innerWidth <= 760 && $(".planRow.swiped").length > 0;
    $(".fabGroup").toggleClass("swipeHidden", hasOpenSwipeRow);
  }

  function closeSwipeRows(exceptRow) {
    $(".planRow.swiped").each(function () {
      if (!exceptRow || this !== exceptRow) $(this).removeClass("swiped");
    });
    updateFabVisibilityBySwipe();
  }

  function bindMobileSwipeActions() {
    let startX = 0;
    let startY = 0;
    let activeRow = null;
    let tracking = false;

    $(document).on("touchstart", ".planRow", function (e) {
      if (window.innerWidth > 760) return;
      if ($(e.target).closest("button,a,input,textarea,select").length) return;
      const touch = e.originalEvent.touches && e.originalEvent.touches[0];
      if (!touch) return;
      activeRow = this;
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    });

    $(document).on("touchmove", ".planRow", function (e) {
      if (!tracking || !activeRow || window.innerWidth > 760) return;
      const touch = e.originalEvent.touches && e.originalEvent.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) e.preventDefault();
    });

    $(document).on("touchend", ".planRow", function (e) {
      if (!tracking || !activeRow || window.innerWidth > 760) return;
      const touch = e.originalEvent.changedTouches && e.originalEvent.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 36) {
        if (dx < 0) {
          closeSwipeRows(activeRow);
          $(activeRow).addClass("swiped");
          updateFabVisibilityBySwipe();
        } else {
          $(activeRow).removeClass("swiped");
          updateFabVisibilityBySwipe();
        }
      }

      startX = 0;
      startY = 0;
      activeRow = null;
      tracking = false;
    });

    $(document).on("click", function (e) {
      if (window.innerWidth > 760) return;
      if ($(e.target).closest(".planRow").length) return;
      closeSwipeRows();
    });

    $(window).on("resize", function () {
      if (window.innerWidth > 760) {
        closeSwipeRows();
      } else {
        updateFabVisibilityBySwipe();
      }
    });
  }

  function positionMorePanel() {
    const $panel = $("#morePanel");
    const btn = document.getElementById("btnMore");
    if (!$panel.hasClass("show") || !btn) return;

    const rect = btn.getBoundingClientRect();
    const gap = 8;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const panelWidth = Math.min(viewportWidth - 24, viewportWidth <= 760 ? 176 : 220);

    let left = rect.right - panelWidth;
    left = Math.max(12, Math.min(left, viewportWidth - panelWidth - 12));

    $panel.css({
      top: `${Math.round(rect.bottom + gap)}px`,
      left: `${Math.round(left)}px`,
      width: `${Math.round(panelWidth)}px`
    });
  }

  function closeMorePanel() {
    $("#morePanel").removeClass("show").removeAttr("style");
  }

  function bindEvents() {
    bindMobileSwipeActions();
    $("#btnMore").on("click", (e) => {
      e.stopPropagation();
      closeSwipeRows();
      $("#morePanel").toggleClass("show");
      positionMorePanel();
    });
    $("#btnPeople").on("click", () => {
      closeMorePanel();
      openPeopleConfig();
    });
    $("#btnCloudflare").on("click", () => {
      closeMorePanel();
      openCloudConfig();
    });
    $("#btnPlanManager, #btnCurrentPlan").on("click", () => {
      closeMorePanel();
      closeSwipeRows();
      openPlanManager();
    });
    $(document).on("click", function (e) {
      if ($(e.target).closest("#btnMore, #morePanel").length) return;
      closeMorePanel();
    });
    $(window).on("resize scroll", positionMorePanel);
    $("#btnFabAdd").on("click", () => {
      closeSwipeRows();
      openEdit(null);
    });
    $("#btnFabSync").on("click", async () => {
      closeSwipeRows();
      setStatus("loading", t("loading"));
      await loadCloudData();
      render();
      setStatus("ok", t("loaded"));
    });
    $("#btnSaveEdit").on("click", saveEdit);
    $("#btnSavePeople").on("click", savePeopleConfig);
    $("#btnTestCloud").on("click", testCloudRead);
    $("#btnSaveCloud").on("click", saveCloudConfig);
    $("#btnNewPlan").on("click", () => resetPlanForm(null));
    $("#btnSavePlan").on("click", savePlanForm);
    $("#planList").on("click", "[data-plan-action]", function () {
      handlePlanAction($(this).data("plan-action"), $(this).data("id"));
    });
    $("#searchInput").on("input", render);

    $("#btnLang").on("click", () => {
      closeSwipeRows();
      appLang = appLang === "zh" ? "en" : "zh";
      localStorage.setItem(LS_LANG, appLang);
      render();
      refreshWeekday();
      renderPeopleSummary();
      if ($("#peopleMask").hasClass("show")) {
        renderDisplayOptionsConfig();
      }
      if ($("#planMask").hasClass("show")) {
        $("#planEditTitle").text($("#planEditId").val() ? t("editPlan") : t("newPlan"));
        renderPlanList();
      }
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

    $(document).on("click", ".btnEdit", function () {
      closeSwipeRows();
      openEdit($(this).data("id"));
    });
    $(document).on("click", ".btnCopy", function () {
      closeSwipeRows();
      copyItem($(this).data("id"));
    });
    $(document).on("click", ".btnDelete", function () {
      closeSwipeRows();
      deleteItem($(this).data("id"));
    });

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

  let lastDeviceKey = currentDeviceKey();

  window.addEventListener("resize", () => {
    setAppHeightVar();
    const device = currentDeviceKey();
    if (device !== lastDeviceKey) {
      lastDeviceKey = device;
      render();
    }
  });
  window.addEventListener("orientationchange", () => setTimeout(setAppHeightVar, 250));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => { setAppHeightVar(); refreshKeyboardState(); });
    window.visualViewport.addEventListener("scroll", () => { setAppHeightVar(); refreshKeyboardState(); });
  }

  $(boot);
})();
