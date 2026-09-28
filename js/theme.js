// =========================================================
// AI 강의자료 공통 스크립트 (문서형 리뉴얼)
// 글자 크기 / 목차 / DAY 드롭다운 / 이전·다음 DAY / 읽기 진행바 /
// 맨 위로 / 복사 / 목차 하이라이트
// =========================================================

var FONT_SIZE_KEY = 'lecture_font_size';

// 본문 글자 크기 (sm / md / lg) — 선택값은 브라우저에 저장해 다음 방문에도 유지
function setFontSize(size) {
  var root = document.documentElement;
  root.classList.remove('font-sm', 'font-md', 'font-lg');
  root.classList.add('font-' + size);
  document.querySelectorAll('[data-font-size]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.dataset.fontSize === size ? 'true' : 'false');
  });
  try { localStorage.setItem(FONT_SIZE_KEY, size); } catch (e) {}
}

function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

// 목차 열기/접기: 데스크톱은 접기(본문 넓게), 모바일은 서랍처럼 열기
function toggleSidebar(force) {
  var body = document.body;
  var btn = document.getElementById('sidebarToggleBtn');
  var open;
  if (isDesktop()) {
    var collapsed = body.classList.toggle('toc-collapsed', force === undefined ? undefined : !force);
    open = !collapsed;
  } else {
    open = body.classList.toggle('toc-open', force);
  }
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function syncSidebarState() {
  var btn = document.getElementById('sidebarToggleBtn');
  if (!btn) return;
  var open = isDesktop()
    ? !document.body.classList.contains('toc-collapsed')
    : document.body.classList.contains('toc-open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

// 드롭다운 메뉴 (DAY 선택, 글자 크기): data-menu="메뉴 id" 버튼과 연결
function closeMenus(except) {
  document.querySelectorAll('[data-menu]').forEach(function (btn) {
    if (btn === except) return;
    btn.setAttribute('aria-expanded', 'false');
    var menu = document.getElementById(btn.dataset.menu);
    if (menu) menu.hidden = true;
  });
}

function initMenus() {
  document.querySelectorAll('[data-menu]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var menu = document.getElementById(btn.dataset.menu);
      if (!menu) return;
      var willOpen = menu.hidden;
      closeMenus(btn);
      menu.hidden = !willOpen;
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu')) closeMenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeMenus();
    if (document.body.classList.contains('toc-open')) toggleSidebar(false);
  });
}

// DAY 드롭다운 + 이전/다음 DAY: js/day-nav-config.js의 window.DAY_NAV와
// #authGate의 data-subject / data-day를 기준으로 만든다
function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function initDayNav() {
  var gate = document.getElementById('authGate');
  if (!gate || !window.DAY_NAV) return;
  var days = window.DAY_NAV[gate.dataset.subject];
  if (!days || !days.length) return;
  var currentDay = parseInt(gate.dataset.day, 10) || 1;

  var list = document.getElementById('dayMenuList');
  if (list) {
    list.innerHTML = days.map(function (d) {
      var label = '<span class="menu__item-day">DAY ' + pad2(d.day) + '</span><span>' + d.title + '</span>';
      if (!d.href) {
        return '<span class="menu__item is-disabled" aria-disabled="true">' + label + '</span>';
      }
      var current = d.day === currentDay;
      return '<a href="' + d.href + '" class="menu__item' + (current ? ' is-current' : '') + '"' +
        (current ? ' aria-current="page"' : '') + '>' + label + '</a>';
    }).join('');
  }

  var pager = document.getElementById('dayPager');
  if (pager) {
    var idx = days.findIndex(function (d) { return d.day === currentDay; });
    var prev = idx > 0 ? days[idx - 1] : null;
    var next = idx >= 0 && idx < days.length - 1 ? days[idx + 1] : null;
    var html = '';
    if (prev && prev.href) {
      html += '<a href="' + prev.href + '" class="pager-link pager-link--prev">' +
        '<span class="pager-link__dir"><i class="fa-solid fa-arrow-left"></i> 이전 · DAY ' + pad2(prev.day) + '</span>' +
        '<span class="pager-link__title">' + prev.title + '</span></a>';
    }
    if (next && next.href) {
      html += '<a href="' + next.href + '" class="pager-link pager-link--next">' +
        '<span class="pager-link__dir">다음 · DAY ' + pad2(next.day) + ' <i class="fa-solid fa-arrow-right"></i></span>' +
        '<span class="pager-link__title">' + next.title + '</span></a>';
    }
    pager.innerHTML = html;
  }
}

// 읽기 진행바 + 맨 위로 버튼
function initScrollUI() {
  var bar = document.getElementById('readProgressBar');
  var topBtn = document.getElementById('backToTop');
  var ticking = false;

  function update() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (bar) bar.style.transform = 'scaleX(' + ratio + ')';
    if (topBtn) topBtn.classList.toggle('is-visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0 });
      var skipTarget = document.getElementById('mainContent');
      if (skipTarget) skipTarget.focus({ preventScroll: true });
    });
  }
}

// 목차: 현재 읽는 섹션 표시 + 모바일에서 항목을 누르면 서랍 닫기
function initToc() {
  var links = document.querySelectorAll('.toc-link');
  if (!links.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var link = document.querySelector('.toc-link[href="#' + entry.target.id + '"]');
      if (!link) return;
      links.forEach(function (l) {
        l.classList.remove('is-active');
        l.removeAttribute('aria-current');
      });
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'location');
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  document.querySelectorAll('#mainContent section[id]').forEach(function (section) {
    observer.observe(section);
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (!isDesktop()) toggleSidebar(false);
    });
  });
}

// 토스트 알림
var toastTimer;
function showToast(message) {
  var toast = document.getElementById('toastNotification');
  var toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 2500);
}

// 클립보드 복사 (Clipboard API 우선, 안 되면 textarea 방식)
function copyToClipboard(text) {
  function fallback() {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('클립보드에 복사되었습니다!');
    } catch (err) {
      showToast('복사에 실패했습니다.');
    }
    document.body.removeChild(textArea);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(function () {
      showToast('클립보드에 복사되었습니다!');
    }, fallback);
  } else {
    fallback();
  }
}

// id로 지정한 요소의 텍스트 복사 (프롬프트 상자·복사 버튼에서 사용)
function copyTextById(id) {
  var el = document.getElementById(id);
  if (!el) return;
  copyToClipboard(el.innerText.trim());
}

// 프롬프트 상자(whitespace-pre-line)가 HTML 줄바꿈 때문에 빈 줄로 시작·끝나지 않도록 정리
function trimPromptBoxes() {
  document.querySelectorAll('#mainContent [onclick^="copyTextById"][id]').forEach(function (el) {
    var first = el.firstChild;
    if (first && first.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s+/, '');
    var last = el.lastChild;
    if (last && last.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, '');
  });
}

// role="button"인 프롬프트 상자를 키보드(Enter/Space)로도 복사할 수 있게
function initKeyboardCopy() {
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target;
    if (el.getAttribute && el.getAttribute('role') === 'button' && el.id && el.getAttribute('onclick')) {
      e.preventDefault();
      el.click();
    }
  });
}

(function applySavedFontSize() {
  var saved;
  try { saved = localStorage.getItem(FONT_SIZE_KEY); } catch (e) {}
  if (saved === 'sm' || saved === 'md' || saved === 'lg') {
    var root = document.documentElement;
    root.classList.remove('font-sm', 'font-md', 'font-lg');
    root.classList.add('font-' + saved);
  }
})();

window.addEventListener('DOMContentLoaded', function () {
  var current = ['sm', 'md', 'lg'].find(function (s) {
    return document.documentElement.classList.contains('font-' + s);
  }) || 'md';
  setFontSize(current);

  initMenus();
  initDayNav();
  initScrollUI();
  initToc();
  initKeyboardCopy();
  trimPromptBoxes();
  syncSidebarState();

  var backdrop = document.getElementById('tocBackdrop');
  if (backdrop) backdrop.addEventListener('click', function () { toggleSidebar(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function () {
    document.body.classList.remove('toc-open');
    syncSidebarState();
  });
});
