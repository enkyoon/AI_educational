/* =========================================================
   과목별 DAY 목록 (헤더의 DAY 배지 드롭다운에서 사용)
   각 DAY 페이지에서 다른 DAY로 상대경로로 이동하므로 href는
   "../dayNN/index.html" 형태(같은 과목 폴더 아래 형제 폴더로 이동).
   아직 만들지 않은 DAY는 href를 생략하면 "준비중"으로 표시됨.
   새 DAY 페이지를 추가하면 이 목록도 함께 갱신할 것 (skill.md 체크리스트 참고).
   ========================================================= */
window.DAY_NAV = {
  "바이브코딩": [
    { day: 1, title: "웹 개발 기본 이해", href: "../day01/index.html" },
    { day: 2, title: "Claude Code 및 개발환경 구축", href: "../day02/index.html" },
    { day: 3, title: "미니 웹페이지 제작", href: "../day03/index.html" }
  ],
  "AI 프롬프트 엔지니어링 2": [
    { day: 1, title: "Gemini와 Google AI로 업무 시작하기", href: "../day01v2/index.html" },
    { day: 2, title: "나만의 Gem과 이미지 활용", href: "../day02/index.html" },
    { day: 3, title: "NotebookLM으로 자료 분석", href: "../day03/index.html" },
    { day: 4, title: "Deep Research·Canvas", href: "../day04/index.html" }
  ]
};
