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
  if (typeof scheduleFixCenteredText === 'function') scheduleFixCenteredText();
  if (typeof fitPromptEditors === 'function') fitPromptEditors();
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

  // 헤더 DAY 버튼에 전체 회차 표시 (예: DAY 03 / 08)
  var daySelect = document.querySelector('.day-select');
  if (daySelect && !daySelect.querySelector('.day-select__total')) {
    var total = document.createElement('span');
    total.className = 'day-select__total';
    total.textContent = '/ ' + pad2(days.length);
    daySelect.insertBefore(total, daySelect.querySelector('i'));
  }

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
  // 직접 고쳐 쓰는 입력칸(textarea)은 지금 입력된 내용을 복사
  copyToClipboard((el.tagName === 'TEXTAREA' ? el.value : el.innerText).trim());
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

// 가운데 정렬 문단 가독성 보정
// - 3줄 이상으로 늘어나는 가운데 정렬 문단 → 왼쪽 정렬(.is-long-center)
// - 2줄 문단 → 가운데 정렬 유지 + 두 줄 길이 균형(.is-balanced-center), 마지막 줄에 한 단어만 남지 않게
// 줄 수는 화면 폭·글자 크기에 따라 달라지므로 크기가 바뀔 때마다 다시 판단한다
function isTextLeaf(el) {
  var hasText = false;
  for (var n = el.firstChild; n; n = n.nextSibling) {
    if (n.nodeType === 3) {
      if (n.nodeValue.trim()) hasText = true;
    } else if (n.nodeType === 1) {
      var d = getComputedStyle(n).display;
      if (d !== 'inline' && d !== 'none' && n.tagName !== 'BR') return false;
    }
  }
  return hasText;
}

function lineCount(el, cs) {
  var lh = parseFloat(cs.lineHeight);
  if (isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.5;
  var h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  return Math.round(h / lh);
}

function fixCenteredText() {
  var root = document.getElementById('mainContent');
  if (!root) return;
  root.querySelectorAll('.is-long-center, .is-balanced-center').forEach(function (el) {
    el.classList.remove('is-long-center', 'is-balanced-center');
  });
  root.querySelectorAll('p, div, span, li, h3, h4, strong').forEach(function (el) {
    var cs = getComputedStyle(el);
    if (cs.textAlign !== 'center' || cs.display === 'none' || cs.display.indexOf('flex') > -1 ||
        cs.display.indexOf('grid') > -1 || cs.display === 'inline') return;
    if (!isTextLeaf(el)) return;
    var lines = lineCount(el, cs);
    if (lines >= 3) el.classList.add('is-long-center');
    else if (lines === 2) el.classList.add('is-balanced-center');
  });
}

var fixCenteredTimer;
function scheduleFixCenteredText() {
  clearTimeout(fixCenteredTimer);
  fixCenteredTimer = setTimeout(fixCenteredText, 150);
}

// 실습 주제 고르기: .topic-card를 누르면 html[data-topic]을 바꾸고,
// 같은 주제의 .topic-prompt(펼침 목록)를 모두 열고 나머지는 닫는다.
// 선택은 과목 단위로 저장해서 DAY 03에서 고른 주제가 DAY 04에도 그대로 이어진다
var LEGACY_TOPIC_KEY = 'lecture_topic:' + location.pathname;
var TOPIC_KEY = (function () {
  var gate = document.getElementById('authGate');
  return 'lecture_topic:' + (gate && gate.dataset.subject ? gate.dataset.subject : location.pathname);
})();

function selectTopic(topic, save) {
  document.documentElement.dataset.topic = topic;
  document.querySelectorAll('.topic-card').forEach(function (card) {
    card.setAttribute('aria-checked', card.dataset.topic === topic ? 'true' : 'false');
  });
  document.querySelectorAll('.topic-prompt').forEach(function (d) {
    var mine = d.dataset.topic === topic;
    d.classList.toggle('is-selected', mine);
    d.open = mine;
  });
  if (save) {
    try { localStorage.setItem(TOPIC_KEY, topic); } catch (e) {}
  }
  scheduleFixCenteredText();
}

function initTopics() {
  var cards = document.querySelectorAll('.topic-card');
  var saved;
  try { saved = localStorage.getItem(TOPIC_KEY) || localStorage.getItem(LEGACY_TOPIC_KEY); } catch (e) {}
  // 주제 카드가 없는 페이지: 앞 DAY에서 고른 주제가 있으면 그 주제의 예시(.topic-text)만 보이게 함
  if (!cards.length) {
    if (saved && document.querySelector('.topic-text[data-topic="' + saved + '"]')) {
      document.documentElement.dataset.topic = saved;
    }
    return;
  }
  var topics = Array.prototype.map.call(cards, function (c) { return c.dataset.topic; });
  selectTopic(topics.indexOf(saved) > -1 ? saved : topics[0], false);
  cards.forEach(function (card) {
    card.addEventListener('click', function () { selectTopic(card.dataset.topic, true); });
  });
}

// 직접 고쳐 쓰는 작성 틀: textarea.prompt-editor__input
// - 내용 길이에 맞춰 높이 자동 조절, 쓰던 내용은 이 브라우저에만 저장(새로고침해도 유지)
// - 복사는 머리줄의 "복사하기" 버튼으로만, "처음으로"는 원래 틀로 되돌림
function promptDraftKey(id) { return 'lecture_draft:' + location.pathname + ':' + id; }

function fitPromptEditor(ta) {
  ta.style.height = 'auto';
  ta.style.height = (ta.scrollHeight + 2) + 'px';
}

function fitPromptEditors() {
  document.querySelectorAll('textarea.prompt-editor__input').forEach(fitPromptEditor);
}

// 간단 표기로 쓴 작성 틀을 완성된 모양으로 바꿈
//   <div class="prompt-editor" data-title="작성 틀 ① — 제목"><textarea id="tpl01" class="prompt-editor__input">…</textarea></div>
//   → 머리줄(제목 + 처음으로 + 복사하기)과 안내 문구를 자동으로 붙인다
function buildPromptEditors() {
  document.querySelectorAll('.prompt-editor[data-title]').forEach(function (box) {
    if (box.querySelector('.prompt-editor__head')) return;
    var ta = box.querySelector('textarea.prompt-editor__input');
    if (!ta) return;
    var title = box.dataset.title;
    var head = document.createElement('div');
    head.className = 'prompt-editor__head';
    head.innerHTML =
      '<span class="prompt-editor__title"></span>' +
      '<span class="prompt-editor__actions">' +
      '<button type="button" class="prompt-editor__reset"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> 처음으로</button>' +
      '<button type="button" class="prompt-editor__copy"><i class="fa-regular fa-copy" aria-hidden="true"></i> 복사하기</button>' +
      '</span>';
    head.querySelector('.prompt-editor__title').textContent = title;
    head.querySelector('.prompt-editor__reset').addEventListener('click', function () { resetPromptEditor(ta.id); });
    head.querySelector('.prompt-editor__copy').addEventListener('click', function () { copyTextById(ta.id); });
    var hint = document.createElement('p');
    hint.className = 'prompt-editor__hint';
    if (box.dataset.fixed) {
      // 고치면 안 되는 내용(주소 등): 읽기 전용 + 안내 문구 교체
      ta.readOnly = true;
      head.querySelector('.prompt-editor__reset').style.display = 'none';
      hint.innerHTML = '<i class="fa-solid fa-lock" aria-hidden="true"></i> ';
      hint.appendChild(document.createTextNode(box.dataset.fixed));
    } else {
      hint.innerHTML = '<i class="fa-solid fa-pen" aria-hidden="true"></i> 칸 안을 눌러 [ ] 부분을 바로 고쳐 쓰세요. 다 쓰면 <strong>복사하기</strong>를 누르세요.';
    }
    box.insertBefore(hint, ta);
    box.insertBefore(head, hint);
    ta.setAttribute('spellcheck', 'false');
    if (!ta.getAttribute('aria-label')) ta.setAttribute('aria-label', title + ' — 직접 고쳐 쓰기');
  });
}

// 접어 둔 예시: <div class="prompt-example" data-summary="막히면 예시 보기">예시 글</div>
// → 오른쪽에 "클릭해서 펼치기" 버튼이 있는 <details>로 바꿈 (예시는 복사 버튼 없이 보고 따라 쓰게)
function buildPromptExamples() {
  document.querySelectorAll('div.prompt-example').forEach(function (el) {
    var d = document.createElement('details');
    d.className = 'prompt-example-box';
    d.innerHTML =
      '<summary><i class="fa-regular fa-eye" aria-hidden="true"></i><span class="prompt-example-box__label"></span>' +
      '<span class="prompt-example-box__btn"><span class="prompt-example-box__closed">클릭해서 펼치기</span>' +
      '<span class="prompt-example-box__open">접기</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span></summary>' +
      '<div class="prompt-example-box__body"></div>';
    d.querySelector('.prompt-example-box__label').textContent = el.dataset.summary || '막히면 예시 보기';
    var body = d.querySelector('.prompt-example-box__body');
    if (!el.children.length) {
      body.classList.add('is-text');
      body.textContent = el.textContent.trim();
    } else {
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && !n.nodeValue.trim()) return;
        body.appendChild(n);
      });
    }
    el.replaceWith(d);
  });
}

function initPromptEditors() {
  buildPromptEditors();
  buildPromptExamples();
  var editors = document.querySelectorAll('textarea.prompt-editor__input');
  if (!editors.length) return;
  editors.forEach(function (ta) {
    ta.value = ta.value.replace(/\s+$/, '');
    ta.dataset.original = ta.value;
    try {
      var saved = ta.readOnly ? null : localStorage.getItem(promptDraftKey(ta.id));
      if (saved !== null) ta.value = saved;
    } catch (e) {}
    ta.addEventListener('input', function () {
      fitPromptEditor(ta);
      try { localStorage.setItem(promptDraftKey(ta.id), ta.value); } catch (e) {}
    });
  });
  fitPromptEditors();
  window.addEventListener('resize', fitPromptEditors);
}

function resetPromptEditor(id) {
  var ta = document.getElementById(id);
  if (!ta) return;
  if (ta.value !== ta.dataset.original && !confirm('직접 쓴 내용을 지우고 처음 틀로 되돌릴까요?')) return;
  ta.value = ta.dataset.original;
  try { localStorage.removeItem(promptDraftKey(id)); } catch (e) {}
  fitPromptEditor(ta);
  ta.focus();
}

// 본문 이미지 확대 보기: a.doc-figure__zoom을 누르면 href(원본 이미지)를 화면 가득 띄운다
// 닫기: ✕ 버튼, 이미지·배경 클릭, Esc
function initLightbox() {
  var links = document.querySelectorAll('a.doc-figure__zoom');
  if (!links.length || !window.HTMLDialogElement) return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', '이미지 크게 보기');
  dialog.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="닫기"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
    '<div class="lightbox__inner"><img class="lightbox__img" alt=""></div>';
  document.body.appendChild(dialog);
  var img = dialog.querySelector('.lightbox__img');
  var opener = null;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      opener = link;
      var thumb = link.querySelector('img');
      img.src = link.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
    });
  });
  dialog.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('lightbox-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
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
  initTopics();
  initPromptEditors();
  initLightbox();
  syncSidebarState();

  // 줄 수 판단은 Tailwind·폰트가 적용된 뒤(load)에, 이후 창 크기가 바뀔 때마다 다시
  window.addEventListener('load', scheduleFixCenteredText);
  window.addEventListener('resize', scheduleFixCenteredText);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFixCenteredText);

  var backdrop = document.getElementById('tocBackdrop');
  if (backdrop) backdrop.addEventListener('click', function () { toggleSidebar(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function () {
    document.body.classList.remove('toc-open');
    syncSidebarState();
  });
});
