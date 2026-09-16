// =========================================================
// index.html (메인 페이지) 전용 스크립트 — 과목 아코디언 토글
// =========================================================

function toggleSubject(id) {
  const panel = document.getElementById(`panel-${id}`);
  const chevron = document.getElementById(`chevron-${id}`);
  const box = document.getElementById(`box-${id}`);
  if (!panel) return;

  const isOpening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden');

  if (chevron) {
    chevron.classList.toggle('rotate-180', isOpening);
  }
  if (box) {
    box.classList.toggle('is-open', isOpening);
  }
}
