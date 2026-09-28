// =========================================================
// index.html (메인 페이지) 전용 스크립트 — 과목 아코디언 토글
// =========================================================

function toggleSubject(id) {
  var panel = document.getElementById('panel-' + id);
  var head = document.querySelector('[aria-controls="panel-' + id + '"]');
  if (!panel || !head) return;

  var isOpening = panel.hidden;
  panel.hidden = !isOpening;
  head.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
}
