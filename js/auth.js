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
    return new Date().toISOString().slice(0, 10);
  }

  function addDaysStr(dateStr, days) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function formatKorean(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  }

  // 등록일 기준으로 이 페이지(dayNumber)가 열리는 기간을 계산.
  // dayNumber 1,2 -> 등록일부터 바로 오픈 / 3,4 -> 등록일+7일부터 / 5,6 -> +14일 ...
  // 전체 접근 기한(ACCESS_DAYS)이 지나면 오픈 순서와 무관하게 막힘.
  function computeAccess(dayNumber, registeredAt) {
    var groupIndex = Math.ceil(dayNumber / DAYS_PER_UNLOCK);
    var openDate = addDaysStr(registeredAt, (groupIndex - 1) * UNLOCK_INTERVAL_DAYS);
    var closeDate = addDaysStr(registeredAt, ACCESS_DAYS);
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

  // 명단 시트 + (있으면) 관리자 시트를 함께 검사해서 이름+과목이 일치하는 등록일을 찾는다.
  // 오픈/만료 판정은 호출부에서 dayNumber로 처리.
  function findRegisteredAt(subject, name) {
    var mainFetch = fetchCSVRows(window.AUTH_SHEET_CSV_URL);
    var adminFetch = fetchCSVRows(window.AUTH_ADMIN_SHEET_CSV_URL).catch(function () {
      return [];
    });
    return Promise.all([mainFetch, adminFetch]).then(function (results) {
      var rows = results[0].concat(results[1]);
      var normalized = name.trim();
      var match = rows.find(function (r) {
        return r[0] && r[0].trim() === normalized && r[1] && r[1].trim() === subject;
      });
      if (!match || !match[2]) return null;
      return match[2].trim();
    });
  }

  function unlock(gate) {
    gate.classList.add("gate-hidden");
    document.documentElement.classList.remove("gate-locked");
  }

  function initGate(gate) {
    var subject = gate.dataset.subject;
    var dayNumber = parseInt(gate.dataset.day, 10) || 1;
    var cached = getCache(subject);
    var precheck = cached && cached.registeredAt ? computeAccess(dayNumber, cached.registeredAt) : null;
    if (precheck && precheck.ok) {
      unlock(gate);
      return;
    }

    document.documentElement.classList.add("gate-locked");

    var errorEl0 = gate.querySelector("#gateError");
    if (precheck && precheck.reason === "notyet") {
      errorEl0.textContent = "아직 이 회차가 열리지 않았습니다. " + formatKorean(precheck.openDate) + "부터 접속할 수 있어요.";
      errorEl0.hidden = false;
    } else if (precheck && precheck.reason === "expired") {
      errorEl0.textContent = "수강 등록일로부터 " + ACCESS_DAYS + "일이 지나 접근 기간이 만료되었습니다. 담당 강사에게 문의해주세요.";
      errorEl0.hidden = false;
    }

    // 닫기(X) 또는 카드 바깥 클릭 시: 로그인은 되지 않은 상태이므로 콘텐츠를 열어주는 대신
    // 메인 허브로 이동시켜 "갇힌 모달" 느낌만 해소한다.
    var homeLink = document.querySelector('header a[title="메인으로"]');
    var homeHref = homeLink ? homeLink.getAttribute("href") : "../../../index.html";
    function goHome() {
      window.location.href = homeHref;
    }
    var closeBtn = gate.querySelector("#gateCloseBtn");
    if (closeBtn) closeBtn.addEventListener("click", goHome);
    gate.addEventListener("click", function (e) {
      if (e.target === gate) goHome();
    });

    var form = gate.querySelector("#gateForm");
    var input = gate.querySelector("#gateNameInput");
    var errorEl = gate.querySelector("#gateError");
    var btn = form.querySelector("button[type=submit]");

    // 입력창 글자색을 투명하게 두고(IME 정상 동작), 길이만큼 점(•)을 오버레이에 표시해 마스킹
    var maskEl = gate.querySelector("#gateNameMask");
    if (maskEl) {
      var updateMask = function () {
        maskEl.textContent = input.value ? "•".repeat(input.value.length) : "";
      };
      input.addEventListener("input", updateMask);
      input.addEventListener("compositionupdate", updateMask);
      input.addEventListener("compositionend", updateMask);
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
        .then(function (registeredAt) {
          if (!registeredAt) {
            errorEl.textContent = "등록된 수강생 명단에서 이름을 찾을 수 없습니다. 이름을 정확히 입력했는지 확인해주세요.";
            errorEl.hidden = false;
            return;
          }
          var result = computeAccess(dayNumber, registeredAt);
          setCache(subject, name, registeredAt);
          if (result.ok) {
            unlock(gate);
          } else if (result.reason === "notyet") {
            errorEl.textContent = "아직 이 회차가 열리지 않았습니다. " + formatKorean(result.openDate) + "부터 접속할 수 있어요.";
            errorEl.hidden = false;
          } else {
            errorEl.textContent = "수강 등록일로부터 " + ACCESS_DAYS + "일이 지나 접근 기간이 만료되었습니다. 담당 강사에게 문의해주세요.";
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
