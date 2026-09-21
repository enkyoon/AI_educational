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

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDaysStr(dateStr, days) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function getCache(subject) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + subject);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setCache(subject, name, expiry) {
    try {
      localStorage.setItem(STORAGE_PREFIX + subject, JSON.stringify({ name: name, expiry: expiry }));
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

  function verifyName(subject, name) {
    var url = window.AUTH_SHEET_CSV_URL;
    return fetch(url, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("sheet fetch failed");
        return res.text();
      })
      .then(function (text) {
        var rows = parseCSV(text);
        var normalized = name.trim();
        var match = rows.find(function (r) {
          return r[0] && r[0].trim() === normalized && r[1] && r[1].trim() === subject;
        });
        if (!match || !match[2]) return { ok: false, reason: "notfound" };
        var expiry = addDaysStr(match[2].trim(), ACCESS_DAYS);
        if (todayStr() > expiry) return { ok: false, reason: "expired" };
        return { ok: true, expiry: expiry };
      });
  }

  function unlock(gate) {
    gate.classList.add("gate-hidden");
    document.documentElement.classList.remove("gate-locked");
  }

  function initGate(gate) {
    var subject = gate.dataset.subject;
    var cached = getCache(subject);
    if (cached && cached.expiry && todayStr() <= cached.expiry) {
      unlock(gate);
      return;
    }

    document.documentElement.classList.add("gate-locked");

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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = input.value.trim();
      if (!name) return;
      errorEl.hidden = true;
      btn.disabled = true;
      var originalLabel = btn.textContent;
      btn.textContent = "확인 중...";

      verifyName(subject, name)
        .then(function (result) {
          if (result.ok) {
            setCache(subject, name, result.expiry);
            unlock(gate);
          } else if (result.reason === "expired") {
            errorEl.textContent = "수강 등록일로부터 " + ACCESS_DAYS + "일이 지나 접근 기간이 만료되었습니다. 담당 강사에게 문의해주세요.";
            errorEl.hidden = false;
          } else {
            errorEl.textContent = "등록된 수강생 명단에서 이름을 찾을 수 없습니다. 이름을 정확히 입력했는지 확인해주세요.";
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
