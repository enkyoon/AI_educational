/* Individual practice: selection and self-checks stay in this browser. */
(function () {
  'use strict';
  function init() {
    const cards = Array.from(document.querySelectorAll('[data-office-mission]'));
    if (!cards.length) return;
    const panels = Array.from(document.querySelectorAll('[data-mission-panel]'));
    const status = document.getElementById('mission-choice-status');
    const hint = document.getElementById('mission-start-hint');
    const prefix = 'ai-office-mission-v1:';
    const read = key => { try { return localStorage.getItem(prefix + key); } catch (_) { return null; } };
    const save = (key, value) => { try { localStorage.setItem(prefix + key, value); } catch (_) {} };
    function refresh(panel) {
      const checks = Array.from(panel.querySelectorAll('[data-mission-check]'));
      const message = panel.querySelector('.office-complete__message');
      if (message) message.hidden = !checks.every(input => input.checked);
    }
    function select(key, focus) {
      const selected = panels.find(panel => panel.dataset.missionPanel === key);
      if (!selected) return;
      cards.forEach(card => card.setAttribute('aria-pressed', String(card.dataset.officeMission === key)));
      panels.forEach(panel => { panel.hidden = panel !== selected; });
      if (hint) hint.hidden = true;
      const title = selected.querySelector('h3');
      if (status) status.textContent = '선택한 미션: ' + title.textContent;
      save('selected', key);
      // Prompt editors calculate their height again after a hidden panel opens.
      selected.querySelectorAll('textarea').forEach(input => input.dispatchEvent(new Event('input', { bubbles: true })));
      if (focus && title) { title.tabIndex = -1; title.focus({ preventScroll: true }); selected.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    cards.forEach(card => card.addEventListener('click', () => select(card.dataset.officeMission, true)));
    panels.forEach(panel => {
      panel.querySelectorAll('[data-mission-check]').forEach(input => {
        input.checked = read(input.dataset.missionCheck) === 'true';
        input.addEventListener('change', () => { save(input.dataset.missionCheck, String(input.checked)); refresh(panel); });
      });
      refresh(panel);
    });
    const previous = read('selected');
    if (previous) select(previous, false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
