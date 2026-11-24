/* =========================================================
   수강생 접근 제어(로그인 게이트)
   - 페이지 상단의 #authGate 오버레이(data-subject 속성)를 사용해
     "이름 입력 → 구글 시트 명단 대조 → 등록일 기준 N일 이내만 통과" 처리.
   - 통과하면 localStorage에 과목별로 캐시해서, 같은 브라우저에서는
     만료일까지 다시 묻지 않음.
   ========================================================= */
(function () {
  var STORAGE_PREFIX = "lecture_auth_";
  var ACCESS_DAYS = window.AUTH_ACCESS_DAYS || 28;
  var DAYS_PER_UNLOCK = window.AUTH_DAYS_PER_UNLOCK || 2;
  var UNLOCK_INTERVAL_DAYS = window.AUTH_UNLOCK_INTERVAL_DAYS || 7;

  function todayStr() {
    // 수업 날짜는 접속 기기의 시간대와 무관하게 한국 날짜로 판단한다.
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  function addDaysStr(dateStr, days) {
    // 달력 날짜끼리 계산: 현지 자정을 UTC로 바꾸면서 하루가 밀리지 않게 한다.
    var d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function formatKorean(dateStr) {
    var parts = dateStr.split("-");
    return Number(parts[1]) + "월 " + Number(parts[2]) + "일";
  }

  // 등록일 기준으로 이 페이지(dayNumber)가 열리는 기간을 계산.
  // dayNumber 1,2 -> 등록일부터 바로 오픈 / 3,4 -> 등록일+7일부터 / 5,6 -> +14일 ...
  // 전체 접근 기한(ACCESS_DAYS)이 지나면 오픈 순서와 무관하게 막힘.
  // 과목별 예외 규칙(AUTH_SUBJECT_RULES)이 있으면 그 값을, 없으면 공통 값을 쓴다.
  function rulesFor(subject) {
    var r = (window.AUTH_SUBJECT_RULES || {})[subject] || {};
    return {
      daysPerUnlock: r.daysPerUnlock || DAYS_PER_UNLOCK,
      intervalDays: r.intervalDays || UNLOCK_INTERVAL_DAYS,
      accessDays: r.accessDays || ACCESS_DAYS
    };
  }

  function computeAccess(dayNumber, registeredAt, subject) {
    var rule = rulesFor(subject);
    var groupIndex = Math.ceil(dayNumber / rule.daysPerUnlock);
    var openDate = addDaysStr(registeredAt, (groupIndex - 1) * rule.intervalDays);
    var closeDate = addDaysStr(registeredAt, rule.accessDays);
    var today = todayStr();
    if (today < openDate) return { ok: false, reason: "notyet", openDate: openDate };
    if (today > closeDate) return { ok: false, reason: "expired" };
    return { ok: true };
  }

  function getCache(subject) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + subject);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setCache(subject, name, registeredAt) {
    try {
      localStorage.setItem(STORAGE_PREFIX + subject, JSON.stringify({ name: name, registeredAt: registeredAt }));
    } catch (e) {}
  }

  function parseCSV(text) {
    var lines = text.replace(/\r/g, "").split("\n").filter(function (l) {
      return l.trim().length > 0;
    });
    lines.shift(); // 헤더 행 제거
    return lines.map(function (line) {
      return line.split(",").map(function (cell) {
        return cell.trim().replace(/^"|"$/g, "");
      });
    });
  }

  function fetchCSVRows(url) {
    if (!url || url.indexOf("http") !== 0) return Promise.resolve([]);
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("sheet fetch failed");
      return res.text();
    }).then(parseCSV);
  }

  function subjectSheetUrl(subject) {
    var sheets = window.AUTH_SUBJECT_SHEETS || {};
    var url = sheets[subject];
    return url && url.indexOf("http") === 0 ? url : null;
  }

  function isDate(cell) {
    return /^\d{4}-\d{1,2}-\d{1,2}$/.test((cell || "").trim());
  }

  // 등록일은 "YYYY-MM-DD" 형식이 되도록 월/일을 두 자리로 맞춘다 (문자열 비교용)
  function normalizeDate(cell) {
    var p = cell.trim().split("-");
    return p[0] + "-" + ("0" + p[1]).slice(-2) + "-" + ("0" + p[2]).slice(-2);
  }

  // 과목별 시트: 이름만 맞으면 됨 — [이름, 등록일] 또는 [이름, 과목, 등록일] 모두 허용
  function findInSubjectSheet(rows, name) {
    var match = rows.find(function (r) {
      return r[0] && r[0].trim() === name && r.slice(1).some(isDate);
    });
    return match ? normalizeDate(match.slice(1).find(isDate)) : null;
  }

  // 공용·관리자 시트: [이름, 과목, 등록일]에서 이름+과목이 모두 맞아야 함
  function findInSharedSheet(rows, subject, name) {
    var match = rows.find(function (r) {
      return r[0] && r[0].trim() === name && r[1] && r[1].trim() === subject && isDate(r[2]);
    });
    return match ? normalizeDate(match[2]) : null;
  }

  /* 키보드가 영어 상태에서 친 글자를 두벌식 한글로 바꾼다.
     예) "rlawodbs" → "김재윤". 이름이 영어 자판으로 입력돼도 통과되게 하기 위함. */
  var KEY_JAMO = {
    q: "ㅂ", w: "ㅈ", e: "ㄷ", r: "ㄱ", t: "ㅅ", y: "ㅛ", u: "ㅕ", i: "ㅑ", o: "ㅐ", p: "ㅔ",
    a: "ㅁ", s: "ㄴ", d: "ㅇ", f: "ㄹ", g: "ㅎ", h: "ㅗ", j: "ㅓ", k: "ㅏ", l: "ㅣ",
    z: "ㅋ", x: "ㅌ", c: "ㅊ", v: "ㅍ", b: "ㅠ", n: "ㅜ", m: "ㅡ",
    Q: "ㅃ", W: "ㅉ", E: "ㄸ", R: "ㄲ", T: "ㅆ", O: "ㅒ", P: "ㅖ"
  };
  var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  var JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
  var JONG = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";
  var VOWEL_PAIR = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
  var FINAL_PAIR = { "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ", "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ", "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ" };

  function engToKor(text) {
    var j = text.split("").map(function (ch) {
      return KEY_JAMO[ch] || KEY_JAMO[ch.toLowerCase()] || ch;
    });
    var isV = function (c) { return c && JUNG.indexOf(c) >= 0; };
    var isC = function (c) { return c && CHO.indexOf(c) >= 0; };
    var out = "";
    var i = 0;
    while (i < j.length) {
      if (!(isC(j[i]) && isV(j[i + 1]))) { out += j[i]; i++; continue; }
      var cho = j[i];
      var jung = j[i + 1];
      i += 2;
      if (VOWEL_PAIR[jung + j[i]]) { jung = VOWEL_PAIR[jung + j[i]]; i++; }
      var jong = "";
      // 받침 후보: 뒤에 모음이 오면 다음 글자의 첫소리로 넘긴다
      if (isC(j[i]) && !isV(j[i + 1]) && JONG.indexOf(j[i]) > 0) {
        jong = j[i];
        i++;
        if (FINAL_PAIR[jong + j[i]] && isC(j[i]) && !isV(j[i + 1])) { jong = FINAL_PAIR[jong + j[i]]; i++; }
      }
      out += String.fromCharCode(0xac00 + (CHO.indexOf(cho) * 21 + JUNG.indexOf(jung)) * 28 + (jong ? JONG.indexOf(jong) : 0));
    }
    return out;
  }

  // 입력한 그대로 + (영어 자판으로 친 경우) 한글로 바꾼 이름까지 후보로 만든다.
  // Caps Lock이 켜져 있으면 대·소문자가 뒤집혀 들어오므로(Shift+P → p) 뒤집은 것도,
  // 실수로 Shift를 누른 경우를 위해 모두 소문자로 바꾼 것도 함께 넣는다.
  function swapCase(s) {
    return s.replace(/[a-zA-Z]/g, function (c) {
      return c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase();
    });
  }
  function nameCandidates(name) {
    var list = [name];
    if (/^[a-zA-Z]+$/.test(name)) {
      [engToKor(name), engToKor(swapCase(name)), engToKor(name.toLowerCase())].forEach(function (n) {
        if (list.indexOf(n) < 0) list.push(n);
      });
    }
    return list;
  }

  // 과목별 시트(있으면) 또는 공용 명단 시트 + (있으면) 관리자 시트를 함께 검사해서
  // 등록일을 찾는다. 오픈/만료 판정은 호출부에서 dayNumber로 처리.
  // 돌려주는 값: { name: 명단에 적힌 이름, registeredAt: 등록일 } 또는 null
  function findRegisteredAt(subject, name) {
    var candidates = nameCandidates(name.trim());
    var subjectUrl = subjectSheetUrl(subject);
    var mainFetch = fetchCSVRows(subjectUrl || window.AUTH_SHEET_CSV_URL);
    var adminFetch = fetchCSVRows(window.AUTH_ADMIN_SHEET_CSV_URL).catch(function () {
      return [];
    });
    return Promise.all([mainFetch, adminFetch]).then(function (results) {
      for (var k = 0; k < candidates.length; k++) {
        var n = candidates[k];
        var found = (subjectUrl
          ? findInSubjectSheet(results[0], n)
          : findInSharedSheet(results[0], subject, n)) || findInSharedSheet(results[1], subject, n);
        if (found) return { name: n, registeredAt: found };
      }
      return null;
    });
  }

  function unlock(gate) {
    gate.classList.add("gate-hidden");
    document.documentElement.classList.remove("gate-locked");
  }

  function openGate(gate, focus) {
    gate.classList.remove("gate-hidden");
    document.documentElement.classList.add("gate-locked");
    var input = gate.querySelector("#gateNameInput");
    if (focus && input) setTimeout(function () { input.focus(); }, 50);
  }

  /* ---------------------------------------------------------
     1회차 미리보기 (data-preview="true")
     - 페이지 길이의 3분의 1에 가장 가까운 섹션 경계까지 공개하고,
       그 아래는 숨긴 채 "수강생 전용" 안내를 둔다.
       (data-preview-until="섹션 id"가 있으면 그 섹션까지 공개)
     - 페이지에 들어오면 먼저 확인 창을 띄워 수강생은 이름을 입력하고,
       방문자는 창 아래 "방문자 미리보기"로 공개 부분을 본다.
     - 안내 카드의 버튼이나 목차에서 숨긴 섹션을 누르면 확인 창을 다시 띄운다(askGate).
     --------------------------------------------------------- */
  function setupPreview(gate, askGate) {
    var main = document.getElementById("mainContent");
    if (!main) return null;
    var sections = Array.prototype.filter.call(main.children, function (el) {
      return el.tagName === "SECTION" && el.id;
    });
    if (sections.length < 2) return null;

    var cut = gate.dataset.previewUntil ? document.getElementById(gate.dataset.previewUntil) : null;
    if (!cut) {
      var mainTop = main.getBoundingClientRect().top;
      var target = main.scrollHeight / 3;
      var best = Infinity;
      sections.slice(0, -1).forEach(function (sec) {
        var gap = Math.abs(sec.getBoundingClientRect().bottom - mainTop - target);
        if (gap < best) { best = gap; cut = sec; }
      });
    }

    var hidden = [];
    for (var el = cut.nextElementSibling; el; el = el.nextElementSibling) {
      el.classList.add("preview-hidden");
      hidden.push(el);
    }
    hidden.forEach(function (el) {
      if (!el.id) return;
      var link = document.querySelector('.toc-link[href="#' + el.id + '"]');
      if (link) link.classList.add("toc-link--locked");
    });

    var wall = document.createElement("div");
    wall.className = "preview-wall";
    wall.innerHTML =
      '<div class="preview-wall__fade" aria-hidden="true"></div>' +
      '<div class="preview-wall__card">' +
      '<i class="fa-solid fa-lock" aria-hidden="true"></i>' +
      '<p class="preview-wall__title">여기부터는 수강생 전용입니다</p>' +
      '<p class="preview-wall__desc">수강생은 등록하신 이름을 확인하면 이어서 볼 수 있어요.</p>' +
      '<button type="button" class="preview-wall__btn">수강생 확인하기</button>' +
      '<p class="preview-wall__contact">수강 문의 <a href="mailto:enkyoon@gmail.com">enkyoon@gmail.com</a></p>' +
      "</div>";
    cut.parentNode.insertBefore(wall, cut.nextElementSibling);

    wall.querySelector(".preview-wall__btn").addEventListener("click", askGate);

    // 목차 등에서 숨긴 섹션으로 가려 하면 확인 창을 띄운다
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || !wall.isConnected) return;
      var dest = document.getElementById(a.getAttribute("href").slice(1));
      if (dest && dest.closest(".preview-hidden")) {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains("toc-open") && typeof toggleSidebar === "function") toggleSidebar(false);
        askGate();
      }
    }, true);

    return {
      close: function () {
        unlock(gate);
        window.scrollTo({ top: Math.max(0, wall.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.75), behavior: "smooth" });
      },
      reveal: function () {
        hidden.forEach(function (el) { el.classList.remove("preview-hidden"); });
        document.querySelectorAll(".toc-link--locked").forEach(function (l) { l.classList.remove("toc-link--locked"); });
        wall.remove();
      }
    };
  }

  function initGate(gate) {
    var subject = gate.dataset.subject;
    var dayNumber = parseInt(gate.dataset.day, 10) || 1;
    var hasStudentSheet = !!(subjectSheetUrl(subject) ||
      /^https?:\/\//.test(window.AUTH_SHEET_CSV_URL || ""));
    var cached = getCache(subject);
    var precheck = cached && cached.registeredAt ? computeAccess(dayNumber, cached.registeredAt, subject) : null;
    if (precheck && precheck.ok) {
      unlock(gate);
      return;
    }

    // 1회차 미리보기: 들어오자마자 확인 창을 띄우고, 창 아래에 방문자용 미리보기 버튼을 둔다.
    // 방문자를 고르면 같은 탭에서는 다시 묻지 않는다(sessionStorage).
    var visitorKey = "lecture_visitor_" + subject;
    var visitorChosen = false;
    try { visitorChosen = sessionStorage.getItem(visitorKey) === "1"; } catch (e) {}
    var h2 = gate.querySelector("h2");
    var visitorBtn = null;
    var visitorDesc = null;
    function askGate() {
      // 미리보기를 보다가 다시 연 경우: 제목과 버튼 문구를 바꾼다
      if (h2) h2.textContent = "여기부터는 수강생 전용입니다";
      if (visitorBtn) visitorBtn.textContent = "미리보기로 돌아가기";
      if (visitorDesc) visitorDesc.hidden = true;
      openGate(gate, true);
    }
    function enterPreview() {
      visitorChosen = true;
      try { sessionStorage.setItem(visitorKey, "1"); } catch (e) {}
      unlock(gate);
    }

    var preview = gate.dataset.preview === "true" ? setupPreview(gate, askGate) : null;
    if (preview) {
      var visitor = document.createElement("div");
      visitor.className = "gate-visitor";
      visitor.innerHTML =
        '<p class="gate-visitor__label">수강생이 아니신가요?</p>' +
        '<button type="button" class="gate-visitor__btn">방문자 미리보기</button>' +
        '<p class="gate-visitor__desc">1회차 앞부분을 먼저 둘러볼 수 있어요.</p>';
      gate.querySelector(".gate-card").appendChild(visitor);
      visitorBtn = visitor.querySelector(".gate-visitor__btn");
      visitorDesc = visitor.querySelector(".gate-visitor__desc");
      visitorBtn.addEventListener("click", function () {
        if (visitorChosen) preview.close(); else enterPreview();
      });
      if (visitorChosen) {
        if (h2) h2.textContent = "여기부터는 수강생 전용입니다";
        visitorBtn.textContent = "미리보기로 돌아가기";
        visitorDesc.hidden = true;
      } else {
        // 휴대폰에서는 자동 포커스 시 키보드가 올라와 방문자 버튼을 가리므로 마우스 환경에서만 포커스
        var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
        openGate(gate, finePointer);
      }
    } else {
      openGate(gate);
    }

    var errorEl0 = gate.querySelector("#gateError");
    if (precheck && precheck.reason === "notyet") {
      errorEl0.textContent = "아직 이 회차가 열리지 않았습니다. " + formatKorean(precheck.openDate) + "부터 접속할 수 있어요.";
      errorEl0.hidden = false;
    } else if (precheck && precheck.reason === "expired") {
      errorEl0.textContent = "수강 등록일로부터 " + rulesFor(subject).accessDays + "일이 지나 접근 기간이 만료되었습니다. 담당 강사에게 문의해주세요.";
      errorEl0.hidden = false;
    } else if (!hasStudentSheet) {
      var desc = gate.querySelector(".gate-desc");
      if (desc) desc.textContent = "수강생 명단을 준비 중입니다. 접속 안내는 담당 강사에게 문의해주세요.";
    }

    // 닫기(X) 또는 카드 바깥 클릭 시: 로그인은 되지 않은 상태이므로 콘텐츠를 열어주는 대신
    // 메인 허브로 이동시켜 "갇힌 모달" 느낌만 해소한다.
    var homeLink = document.querySelector('header a[title="메인으로"]');
    var homeHref = homeLink ? homeLink.getAttribute("href") : "../../../index.html";
    // 메인에서 들어왔다면 "뒤로 가기"로 돌아가서, 보던 위치(스크롤·펼친 과목)를 그대로 되살린다.
    // 링크로 바로 들어온 경우에만 메인을 새로 연다.
    function stripPage(url) {
      return url.split("#")[0].split("?")[0].replace(/index\.html$/, "");
    }
    function goHome() {
      var hub = stripPage(new URL(homeHref, window.location.href).href);
      if (document.referrer && stripPage(document.referrer) === hub && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = homeHref;
      }
    }
    // 미리보기 페이지에서는 메인으로 보내지 않는다.
    // 처음 뜬 창을 닫으면 방문자 미리보기로, 미리보기 중에 다시 연 창을 닫으면 공개 부분으로 되돌린다.
    var dismiss = preview
      ? function () { if (visitorChosen) preview.close(); else enterPreview(); }
      : goHome;
    var closeBtn = gate.querySelector("#gateCloseBtn");
    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    // 카드 바깥을 "눌렀다 뗀" 경우에만 닫는다.
    // (입력창을 드래그하다 카드 밖에서 손을 떼면 click이 바깥에서 난 것처럼 잡히므로 누른 위치도 확인)
    // 1회차 미리보기 창은 수강생/방문자를 직접 고르게 하려고 바깥을 눌러도 닫지 않는다(X·방문자 버튼으로만 닫힘).
    var pressedOutside = false;
    gate.addEventListener("pointerdown", function (e) {
      pressedOutside = e.target === gate;
    });
    gate.addEventListener("click", function (e) {
      if (!preview && e.target === gate && pressedOutside) dismiss();
      pressedOutside = false;
    });

    var form = gate.querySelector("#gateForm");
    var input = gate.querySelector("#gateNameInput");
    var errorEl = gate.querySelector("#gateError");
    var btn = form.querySelector("button[type=submit]");

    // 인증에 사용하는 내부 과목명 대신 화면에 표시된 과목명을 안내한다.
    var subjectNameEl = gate.querySelector(".gate-subject");
    var selectedSubjectName = (subjectNameEl && subjectNameEl.textContent.trim()) || subject;
    var subjectCheck = document.createElement("p");
    subjectCheck.id = "gateSubjectCheck";
    subjectCheck.className = "gate-subject-check";
    subjectCheck.textContent = "현재 선택한 과목은 ‘" + selectedSubjectName + "’입니다. 수강 중인 과목이 맞는지 확인해 주세요.";
    form.parentNode.insertBefore(subjectCheck, form);
    var inputDescription = input.getAttribute("aria-describedby");
    input.setAttribute("aria-describedby", inputDescription ? inputDescription + " gateSubjectCheck" : "gateSubjectCheck");

    // 입력창 바로 아래 안내: 한/영 상태를 몰라도 되고, 글자가 점으로 보이는 게 정상이라고 알려 준다.
    // (영어 자판·Caps Lock 상태로 친 이름도 한글로 바꿔서 확인하므로 Caps Lock 경고는 두지 않는다)
    var noteEl = document.createElement("p");
    noteEl.className = "gate-note";
    noteEl.textContent = "키보드가 한글 상태든 영어 상태든 상관없어요. 이름을 평소처럼 입력하면 됩니다. 입력한 글자는 점(•)으로 가려져 보여요.";
    errorEl.parentNode.insertBefore(noteEl, errorEl);

    // 입력창 자체는 opacity:0으로 완전히 숨기고(조합 중인 글자까지 포함해서 안 보이게),
    // 길이만큼 점(•)을 오버레이에 표시해 마스킹. 입력창의 placeholder도 안 보이므로
    // 비어있을 때는 오버레이가 대신 placeholder 문구를 보여준다.
    // 점은 한 글자씩 같은 폭의 칸(.m-dot)으로 그리고, 입력창의 커서 위치·선택 범위를 따라
    // 커서(.m-caret)와 선택 표시(.is-sel)를 함께 그린다. (입력창이 숨겨져 있어 원래 커서가 안 보이기 때문)
    var maskEl = gate.querySelector("#gateNameMask");
    if (maskEl) {
      var placeholderText = input.getAttribute("placeholder") || "";
      var caretHtml = '<span class="m-caret"></span>';
      var updateMask = function () {
        var len = input.value.length;
        var focused = document.activeElement === input;
        var s = input.selectionStart == null ? len : input.selectionStart;
        var e = input.selectionEnd == null ? len : input.selectionEnd;
        if (!len) {
          maskEl.classList.add("is-empty");
          maskEl.innerHTML = (focused ? caretHtml : "") + "<span></span>";
          maskEl.lastChild.textContent = placeholderText;
          return;
        }
        maskEl.classList.remove("is-empty");
        var html = "";
        for (var i = 0; i < len; i++) {
          if (focused && s === e && i === s) html += caretHtml;
          html += '<span class="m-dot' + (i >= s && i < e ? " is-sel" : "") + '">•</span>';
        }
        if (focused && s === e && s >= len) html += caretHtml;
        maskEl.innerHTML = html;
      };
      var updateSoon = function () { setTimeout(updateMask, 0); };
      updateMask();
      ["input", "compositionupdate", "compositionend", "focus", "blur", "select", "keydown", "keyup"].forEach(function (ev) {
        input.addEventListener(ev, updateSoon);
      });
      document.addEventListener("selectionchange", function () {
        if (document.activeElement === input) updateMask();
      });

      // 마우스로 누르거나 드래그하면 화면에 보이는 점의 위치를 기준으로 커서·선택 범위를 정한다
      // (터치는 기기 기본 동작 그대로 둔다)
      var indexFromX = function (x) {
        var dots = maskEl.querySelectorAll(".m-dot");
        for (var i = 0; i < dots.length; i++) {
          var r = dots[i].getBoundingClientRect();
          if (x < r.left + r.width / 2) return i;
        }
        return dots.length;
      };
      var dragAnchor = null;
      input.addEventListener("pointerdown", function (ev) {
        if (ev.pointerType !== "mouse" || ev.button !== 0) return;
        ev.preventDefault();
        input.focus();
        var idx = indexFromX(ev.clientX);
        if (ev.shiftKey) {
          var a = input.selectionDirection === "backward" ? input.selectionEnd : input.selectionStart;
          dragAnchor = a;
        } else {
          dragAnchor = idx;
        }
        input.setSelectionRange(Math.min(dragAnchor, idx), Math.max(dragAnchor, idx), idx < dragAnchor ? "backward" : "forward");
        updateMask();
      });
      document.addEventListener("pointermove", function (ev) {
        if (dragAnchor === null) return;
        var idx = indexFromX(ev.clientX);
        input.setSelectionRange(Math.min(dragAnchor, idx), Math.max(dragAnchor, idx), idx < dragAnchor ? "backward" : "forward");
        updateMask();
      });
      document.addEventListener("pointerup", function () { dragAnchor = null; });
      input.addEventListener("dblclick", function () { input.select(); updateMask(); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = input.value.trim();
      if (!name) return;
      errorEl.hidden = true;
      btn.disabled = true;
      var originalLabel = btn.textContent;
      btn.textContent = "확인 중...";

      findRegisteredAt(subject, name)
        .then(function (match) {
          var registeredAt = match && match.registeredAt;
          if (match) name = match.name;
          if (!registeredAt) {
            errorEl.textContent = hasStudentSheet
              ? "‘" + selectedSubjectName + "’ 과목의 등록 명단에서 이름을 찾을 수 없습니다. 이름과 선택한 과목이 맞는지 확인해 주세요."
              : "아직 수강생 명단이 연결되지 않았습니다. 담당 강사에게 문의해주세요.";
            errorEl.hidden = false;
            return;
          }
          var result = computeAccess(dayNumber, registeredAt, subject);
          setCache(subject, name, registeredAt);
          if (result.ok) {
            if (preview) preview.reveal();
            unlock(gate);
          } else if (result.reason === "notyet") {
            errorEl.textContent = "아직 이 회차가 열리지 않았습니다. " + formatKorean(result.openDate) + "부터 접속할 수 있어요.";
            errorEl.hidden = false;
          } else {
            errorEl.textContent = "수강 등록일로부터 " + rulesFor(subject).accessDays + "일이 지나 접근 기간이 만료되었습니다. 담당 강사에게 문의해주세요.";
            errorEl.hidden = false;
          }
        })
        .catch(function () {
          errorEl.textContent = "명단 확인 중 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.";
          errorEl.hidden = false;
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = originalLabel;
        });
    });
  }

  var gate = document.getElementById("authGate");
  if (gate) initGate(gate);
})();
