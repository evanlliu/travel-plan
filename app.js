(function () {
  const APP_VERSION = "v2.0.0";
  const CONFIG = {
    apiBase: "",
    autoRefreshMs: 60000,
    passwordKey: "travel-plan-pro-password"
  };

  function uid() {
    return "i_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  const DEFAULT_DATA = {
    version: APP_VERSION,
    updatedAt: "",
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
      appTitle: "行程计划 Pro",
      subtitle: "按日期分组的更清晰界面，支持 Excel 导入、在线编辑、链接预览和多设备同步。",
      add: "新增安排",
      import: "导入 Excel",
      tplZh: "中文模板",
      tplEn: "英文模板",
      peopleConfig: "人员配置",
      refresh: "刷新同步",
      search: "搜索日期 / 内容 / 人员",
      days: "天数",
      items: "安排数",
      links: "链接数",
      people: "参与人员",
      date: "日期",
      time: "时间",
      weekday: "星期",
      group: "分组",
      content: "计划内容",
      rednote: "小红书链接",
      actions: "操作",
      edit: "编辑",
      delete: "删除",
      cancel: "取消",
      save: "保存",
      addTitle: "新增安排",
      editTitle: "编辑安排",
      groupPlaceholder: "例如：Plan 1",
      contentPlaceholder: "输入计划内容",
      linksPlaceholder: "每行一个链接",
      linksHint: "支持多个链接，每行一个；点击列表中的链接可弹窗预览。",
      peopleList: "人员列表",
      peopleHint: "一行一个名字。",
      preview: "链接预览",
      iframeTip: "如果无法显示，请新窗口打开。",
      openNew: "新窗口打开",
      loading: "正在加载数据...",
      loaded: "数据已加载",
      saved: "已保存并同步",
      localSaved: "Worker 未配置或不可用，已保存到本地 localStorage",
      imported: "Excel 已导入并保存",
      badFile: "未识别到有效数据，请检查模板格式",
      confirmDelete: "确定删除这条安排吗？",
      needPwd: "请输入 Cloudflare Worker 写入密码",
      wrongPwd: "密码错误或没有写入权限",
      networkErr: "同步失败，请检查 Worker 地址 / CORS / 网络",
      empty: "暂无安排，点击“新增安排”开始创建。",
      updated: "更新时间",
      itemCount: "项安排",
      noTime: "待定",
      selectPeople: "请选择"
    },
    en: {
      appTitle: "Travel Plan Pro",
      subtitle: "A clearer date-grouped planner with Excel import, inline editing, link preview, and multi-device sync.",
      add: "Add Item",
      import: "Import Excel",
      tplZh: "Chinese Template",
      tplEn: "English Template",
      peopleConfig: "People",
      refresh: "Refresh",
      search: "Search by date / content / people",
      days: "Days",
      items: "Items",
      links: "Links",
      people: "People",
      date: "Date",
      time: "Time",
      weekday: "Weekday",
      group: "Group",
      content: "Plan Content",
      rednote: "Red Note",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      addTitle: "Add Item",
      editTitle: "Edit Item",
      groupPlaceholder: "For example: Plan 1",
      contentPlaceholder: "Enter plan details",
      linksPlaceholder: "One link per line",
      linksHint: "Multiple links are supported. One link per line. Click a link to preview it.",
      peopleList: "People List",
      peopleHint: "One name per line.",
      preview: "Link Preview",
      iframeTip: "If the page does not load, open it in a new window.",
      openNew: "Open in new window",
      loading: "Loading data...",
      loaded: "Data loaded",
      saved: "Saved and synced",
      localSaved: "Worker is not configured or unavailable; data was saved to localStorage only",
      imported: "Excel imported and saved",
      badFile: "No valid rows found. Please check the template format",
      confirmDelete: "Delete this item?",
      needPwd: "Enter the Cloudflare Worker write password",
      wrongPwd: "Wrong password or no write permission",
      networkErr: "Sync failed. Check the Worker URL / CORS / network",
      empty: "No items yet. Click Add Item to create one.",
      updated: "Updated",
      itemCount: "items",
      noTime: "TBD",
      selectPeople: "Select people"
    }
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const WEEK_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const WEEK_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  let appLang = localStorage.getItem("travel-plan-ui-lang") || "zh";
  let data = clone(DEFAULT_DATA);
  let selectedPeople = [];

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
      return x.trim();
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

  function dataUrl() {
    return (CONFIG.apiBase ? CONFIG.apiBase.replace(/\/$/, "") : "") + "/data.json";
  }

  function setStatus(kind, message) {
    $("#statusDot").removeClass("ok warn err").addClass(kind || "");
    $("#statusText").text(message || "");
  }

  function normalize(raw) {
    const src = raw && typeof raw === "object" ? clone(raw) : clone(DEFAULT_DATA);
    let items = Array.isArray(src.items) ? src.items : [];

    if (!items.length && Array.isArray(src.rows)) {
      items = src.rows.map(function (r) {
        return {
          id: r.id || uid(),
          dateISO: r.dateISO || dateToInput(r.date),
          time: r.time || "",
          group: r.group || "",
          content: r.content || r.plan || "",
          links: Array.isArray(r.links) ? r.links : splitList(r.links || r.link),
          participants: Array.isArray(r.participants) ? r.participants : splitList(r.participants)
        };
      });
    }

    const result = {
      version: src.version || APP_VERSION,
      updatedAt: src.updatedAt || "",
      peopleOptions: Array.isArray(src.peopleOptions) ? src.peopleOptions.map(String).filter(Boolean) : clone(DEFAULT_DATA.peopleOptions),
      items: items.map(function (r, idx) {
        return {
          id: String(r.id || uid()),
          dateISO: r.dateISO || dateToInput(r.date),
          time: String(r.time || "").trim(),
          group: String(r.group || r.section || "").trim(),
          content: String(r.content || r.plan || "").trim(),
          links: (Array.isArray(r.links) ? r.links : splitList(r.links || r.link)).map(normalizeUrl).filter(Boolean),
          participants: (Array.isArray(r.participants) ? r.participants : splitList(r.participants)).map(String).filter(Boolean),
          sort: typeof r.sort === "number" ? r.sort : idx
        };
      }).filter(function (r) {
        return r.dateISO || r.content || r.links.length || r.participants.length;
      })
    };

    result.items.forEach(function (item) {
      item.participants.forEach(function (p) {
        if (!result.peopleOptions.includes(p)) result.peopleOptions.push(p);
      });
    });

    return result;
  }

  function persist() {
    localStorage.setItem("travel-plan-local-data", JSON.stringify(data));
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem("travel-plan-local-data");
      if (raw) data = normalize(JSON.parse(raw));
    } catch (e) {}
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
    return (people || []).map(function (p) {
      return '<span class="chip">' + esc(p) + '</span>';
    }).join("");
  }

  function renderStats(items) {
    $("#statDays").text(new Set(items.filter(function (x) { return x.dateISO; }).map(function (x) { return x.dateISO; })).size);
    $("#statItems").text(items.length);
    $("#statLinks").text(items.reduce(function (n, item) { return n + (item.links || []).length; }, 0));
    $("#statPeople").text(new Set(items.flatMap(function (x) { return x.participants || []; })).size);
  }

  function renderBoard(items) {
    const days = groupByDate(items);
    if (!days.length) {
      $("#board").html('<div class="empty">' + esc(t("empty")) + '</div>');
      return;
    }

    const html = days.map(function (day) {
      const uniquePeople = Array.from(new Set(day.items.flatMap(function (x) { return x.participants || []; })));
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
        '<div class="chips">' + chips(uniquePeople) + '</div>' +
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
    document.title = (appLang === "zh" ? "行程计划 Pro " : "Travel Plan Pro ") + APP_VERSION;
    $("[data-i18n]").each(function () {
      $(this).text(t($(this).data("i18n")));
    });
    $("[data-i18n-placeholder]").each(function () {
      $(this).attr("placeholder", t($(this).data("i18n-placeholder")));
    });
    $("#btnLang").text(appLang === "zh" ? "EN" : "中");
    $("#updatedText").text(data.updatedAt ? t("updated") + ": " + new Date(data.updatedAt).toLocaleString(appLang === "zh" ? "zh-CN" : "en-US") : "-");
    refreshWeekday();
  }

  function render() {
    const items = filteredItems();
    renderStats(items);
    renderBoard(items);
    applyI18n();
    setStatus("ok", t("loaded"));
  }

  async function loadData(silent) {
    if (!silent) setStatus("warn", t("loading"));
    if (!CONFIG.apiBase) {
      loadLocal();
      render();
      return;
    }

    try {
      const res = await fetch(dataUrl(), { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      data = normalize(await res.json());
      persist();
      render();
    } catch (e) {
      loadLocal();
      render();
      setStatus("warn", t("localSaved"));
    }
  }

  async function saveData() {
    data.version = APP_VERSION;
    data.updatedAt = new Date().toISOString();
    persist();

    if (!CONFIG.apiBase) {
      render();
      setStatus("warn", t("localSaved"));
      return;
    }

    try {
      let pwd = sessionStorage.getItem(CONFIG.passwordKey) || "";
      let res = await fetch(dataUrl(), {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-App-Password": pwd },
        body: JSON.stringify(data)
      });

      if (res.status === 401) {
        pwd = prompt(t("needPwd")) || "";
        res = await fetch(dataUrl(), {
          method: "PUT",
          headers: { "Content-Type": "application/json", "X-App-Password": pwd },
          body: JSON.stringify(data)
        });
        if (res.ok) sessionStorage.setItem(CONFIG.passwordKey, pwd);
      }

      if (!res.ok) throw new Error("save failed");
      render();
      setStatus("ok", t("saved"));
    } catch (e) {
      render();
      setStatus("err", t("networkErr"));
    }
  }

  function refreshWeekday() {
    const iso = $("#editDate").val();
    $("#editWeekday").val(iso ? weekday(iso) : "");
  }

  function renderPicker() {
    const opts = data.peopleOptions || [];
    $("#peopleSummary").html(selectedPeople.length ? '<span class="chips">' + chips(selectedPeople) + '</span>' : esc(t("selectPeople")));
    $("#peoplePanel").html(opts.map(function (p) {
      return '<label class="peopleOption"><input type="checkbox" value="' + esc(p) + '" ' + (selectedPeople.includes(p) ? "checked" : "") + '> <span>' + esc(p) + '</span></label>';
    }).join(""));
  }

  function openEdit(id) {
    const item = id ? data.items.find(function (x) { return x.id === id; }) : { id: uid(), dateISO: "", time: "", group: "", content: "", links: [], participants: [] };
    if (!item) return;
    $("#editTitle").text(id ? t("editTitle") : t("addTitle"));
    $("#editId").val(item.id);
    $("#editDate").val(item.dateISO || "");
    $("#editTime").val(item.time || "");
    $("#editGroup").val(item.group || "");
    $("#editContent").val(item.content || "");
    $("#editLinks").val((item.links || []).join("\n"));
    selectedPeople = clone(item.participants || []);
    renderPicker();
    refreshWeekday();
    $("#editMask").addClass("show");
  }

  function saveEdit() {
    const id = $("#editId").val();
    const item = {
      id: id,
      dateISO: $("#editDate").val(),
      time: $("#editTime").val(),
      group: $("#editGroup").val().trim(),
      content: $("#editContent").val().trim(),
      links: splitList($("#editLinks").val()).map(normalizeUrl).filter(Boolean),
      participants: clone(selectedPeople),
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

    $("#editMask").removeClass("show");
    saveData();
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
          const rawTime = ti >= 0 ? String(r[ti] || "").trim() : "";
          const rawGroup = gi >= 0 ? String(r[gi] || "").trim() : "";
          const rawContent = ci >= 0 ? String(r[ci] || "").trim() : "";
          const rawLink = li >= 0 ? String(r[li] || "").trim() : "";
          const rawPeople = pi >= 0 ? String(r[pi] || "").trim() : "";

          if (!rawDate && !rawTime && !rawGroup && !rawContent && !rawLink && !rawPeople) return;

          const parsedDate = dateToInput(rawDate);
          if (parsedDate) lastDate = parsedDate;
          if (rawPeople) lastPeople = splitList(rawPeople);

          imported.push({
            id: uid(),
            dateISO: lastDate,
            time: rawTime,
            group: rawGroup,
            content: rawContent,
            links: splitList(rawLink).map(normalizeUrl).filter(Boolean),
            participants: rawPeople ? splitList(rawPeople) : clone(lastPeople),
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
        saveData();
        setStatus("ok", t("imported"));
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
    XLSX.writeFile(wb, zh ? "travel-plan-pro-cn-v2.0.0.xlsx" : "travel-plan-pro-en-v2.0.0.xlsx");
  }

  $(document).on("click", "[data-close]", function () {
    $("#" + $(this).data("close")).removeClass("show");
  });

  $(document).on("click", ".mask", function (e) {
    if (e.target === this) $(this).removeClass("show");
  });

  $(document).on("click", "[data-edit]", function () {
    openEdit($(this).data("edit"));
  });

  $(document).on("click", "[data-del]", function () {
    const id = $(this).data("del");
    if (confirm(t("confirmDelete"))) {
      data.items = data.items.filter(function (x) { return x.id !== id; });
      saveData();
    }
  });

  $(document).on("click", ".linkBtn", function () {
    const url = $(this).data("link");
    $("#viewerFrame").attr("src", url);
    $("#viewerOpen").attr("href", url);
    $("#viewerMask").addClass("show");
  });

  $(document).on("change", "#peoplePanel input", function () {
    const v = $(this).val();
    if (this.checked) {
      if (!selectedPeople.includes(v)) selectedPeople.push(v);
    } else {
      selectedPeople = selectedPeople.filter(function (x) { return x !== v; });
    }
    renderPicker();
    $("#peoplePanel").addClass("open");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest("#peoplePicker").length) $("#peoplePanel").removeClass("open");
  });

  $("#btnAdd").on("click", function () { openEdit(null); });
  $("#btnSaveEdit").on("click", saveEdit);
  $("#btnImport").on("click", function () { $("#excelFile").click(); });
  $("#excelFile").on("change", function () {
    if (this.files && this.files[0]) importExcel(this.files[0]);
  });
  $("#btnTplZh").on("click", function () { downloadTemplate("zh"); });
  $("#btnTplEn").on("click", function () { downloadTemplate("en"); });
  $("#btnPeople").on("click", function () {
    $("#peopleText").val((data.peopleOptions || []).join("\n"));
    $("#peopleMask").addClass("show");
  });
  $("#btnSavePeople").on("click", function () {
    data.peopleOptions = $("#peopleText").val().split(/\n+/).map(function (x) {
      return x.trim();
    }).filter(Boolean);
    $("#peopleMask").removeClass("show");
    saveData();
  });
  $("#btnRefresh").on("click", function () { loadData(false); });
  $("#btnLang").on("click", function () {
    appLang = appLang === "zh" ? "en" : "zh";
    localStorage.setItem("travel-plan-ui-lang", appLang);
    render();
  });
  $("#searchInput").on("input", render);
  $("#editDate").on("input change", refreshWeekday);
  $("#peopleToggle").on("click", function () {
    $("#peoplePanel").toggleClass("open");
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) loadData(true);
  });

  loadLocal();
  render();
  loadData(false);
  setInterval(function () { loadData(true); }, CONFIG.autoRefreshMs);
})();
