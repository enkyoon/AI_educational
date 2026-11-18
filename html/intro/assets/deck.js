/* =========================================================
   과목별 오리엔테이션 공통 슬라이드 엔진
   - .slide[data-steps="N"] : 클릭할 때마다 한 단계씩 진행
   - .f[data-f="k"]          : k단계에서 나타나는 요소
   - 진행 중인 슬라이드에는 st1, st2 … 클래스가 붙음
     (사다리·시소·갈림길처럼 단계마다 모양이 바뀌는 그림에 사용)
   - 주소 뒤 #5.2 → 5번째 화면의 2단계로 바로 이동
   ========================================================= */
(function () {
  'use strict';

  // 시안 썸네일(.thumbs[data-count]) 자동 생성
  document.querySelectorAll('.thumbs[data-count]').forEach(function (box) {
    var n = Number(box.dataset.count) || 24;
    var best = Number(box.dataset.best) || 10;
    for (var i = 0; i < n; i++) {
      var t = document.createElement('span');
      t.className = 't' + (i === best ? ' best' : '');
      t.style.setProperty('--h', String((i * 47 + 150) % 360));
      t.style.setProperty('--d', String(i));
      if (i === best) t.innerHTML = '<span class="chk"><i class="fa-solid fa-check"></i></span>';
      box.appendChild(t);
    }
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var cur = 0, step = 0, touchStart = null;
  var nextBtn = document.getElementById('nextBtn');
  var prevBtn = document.getElementById('prevBtn');
  var count = document.getElementById('count');
  function maxStep(i) { return Number(slides[i].dataset.steps) || 0; }
  function hasSelection() { return Boolean(window.getSelection && String(window.getSelection()).trim()); }

  function render(resetScroll) {
    slides.forEach(function (slide, i) {
      var active = i === cur;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      if (active && resetScroll) slide.scrollTop = 0;
    });
    var active = slides[cur];
    for (var k = 1; k <= maxStep(cur); k++) active.classList.toggle('st' + k, step >= k);
    active.querySelectorAll('.f').forEach(function (el) {
      var shown = step >= Number(el.dataset.f);
      el.classList.toggle('on', shown);
      el.setAttribute('aria-hidden', String(!shown));
    });
    prevBtn.disabled = cur === 0 && step === 0;
    nextBtn.disabled = cur === slides.length - 1 && step === maxStep(cur);
    count.textContent = (cur + 1) + ' / ' + slides.length;
    count.setAttribute('aria-label', (cur + 1) + '번째 화면, 총 ' + slides.length + '개. 펼친 단계 ' + step + ' / ' + maxStep(cur));
    var completed = cur + (maxStep(cur) ? step / maxStep(cur) : 1);
    document.getElementById('progress').style.width = (completed / slides.length * 100) + '%';
    try { history.replaceState(null, '', '#' + (cur + 1) + (step ? '.' + step : '')); } catch (error) {}
  }
  function next() {
    var previous = cur;
    if (step < maxStep(cur)) step++;
    else if (cur < slides.length - 1) { cur++; step = 0; }
    render(cur !== previous);
  }
  function prev() {
    var previous = cur;
    if (step > 0) step--;
    else if (cur > 0) { cur--; step = maxStep(cur); }
    render(cur !== previous);
  }
  function toggleFs() {
    var result;
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) result = document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) result = document.exitFullscreen();
    if (result && result.catch) result.catch(function () {});
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  document.getElementById('fsBtn').addEventListener('click', toggleFs);
  document.getElementById('deck').addEventListener('click', function (event) {
    if (event.target.closest('a, button, input, textarea, select, summary') || hasSelection()) return;
    next();
  });
  document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('a, button, summary')) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].indexOf(event.key) !== -1) { event.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].indexOf(event.key) !== -1) { event.preventDefault(); prev(); }
    else if (event.key === 'Home') { event.preventDefault(); cur = 0; step = 0; render(true); }
    else if (event.key === 'End') { event.preventDefault(); cur = slides.length - 1; step = maxStep(cur); render(true); }
    else if (event.key.toLowerCase() === 'f') toggleFs();
  });
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1 || event.target.closest('a, button, input, textarea')) { touchStart = null; return; }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', function (event) {
    if (!touchStart || hasSelection()) { touchStart = null; return; }
    var dx = event.changedTouches[0].clientX - touchStart.x;
    var dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
  }, { passive: true });
  document.addEventListener('touchcancel', function () { touchStart = null; }, { passive: true });

  var hash = location.hash.slice(1).split('.');
  var start = parseInt(hash[0], 10);
  if (start >= 1 && start <= slides.length) {
    cur = start - 1;
    step = Math.max(0, Math.min(parseInt(hash[1], 10) || 0, maxStep(cur)));
  }
  render(true);
})();
