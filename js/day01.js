// =========================================================
// DAY 01 전용 스크립트 — 실습(나만의 웹페이지 프롬프트 작성하기) 위젯
// =========================================================

// Set value for interactive builder from buttons
function setPreset(step, val) {
  const input = document.getElementById(`practice-${step}`);
  if (input) {
    input.value = val;
    updatePromptBuilder();
  }
}

// Append value for tags in builder
function appendPreset(step, val) {
  const input = document.getElementById(`practice-${step}`);
  if (input) {
    if (input.value.trim() === '') {
      input.value = val;
    } else {
      input.value += `, ${val}`;
    }
    updatePromptBuilder();
  }
}

// Rebuild prompt live
function updatePromptBuilder() {
  const step1 = document.getElementById('practice-step1').value.trim() || '(미입력)';
  const step2 = document.getElementById('practice-step2').value.trim() || '(미입력)';
  const step3 = document.getElementById('practice-step3').value.trim() || '(미입력)';
  const step4 = document.getElementById('practice-step4').value.trim() || '(미입력)';
  const step5 = document.getElementById('practice-step5').value.trim() || '(미입력)';
  const step6 = document.getElementById('practice-step6').value.trim() || '(미입력)';

  const fullPrompt =
`사이트 종류: ${step1}
목적: ${step2}
사용자: ${step3}
콘텐츠: ${step4}
디자인: ${step5}
기능: ${step6}

※ AI 요청문:
"${step1}을(를) 만들어줘. ${step2}을(를) 위한 목적이고 주요 사용자는 ${step3}이야.
콘텐츠는 ${step4}을(를) 포함해줘.
디자인은 ${step5} 스타일로 꾸며주고, ${step6} 기능이 잘 작동하도록 코드를 작성해줘."`;

  document.getElementById('generatedPromptArea').innerText = fullPrompt;
}

window.addEventListener('DOMContentLoaded', () => {
  updatePromptBuilder();
});
