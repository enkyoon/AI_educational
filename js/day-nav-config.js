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
    { day: 3, title: "카페 웹페이지 제작", href: "../day03/index.html" },
    { day: 4, title: "Supabase · SQL 메뉴 데이터 관리", href: "../day04/index.html" },
    { day: 5, title: "최종 프로젝트 기획", href: "../day05/index.html" },
    { day: 6, title: "최종 프로젝트 제작 ①", href: "../day06/index.html" },
    { day: 7, title: "최종 프로젝트 제작 ②", href: "../day07/index.html" },
    { day: 8, title: "최종 프로젝트 완성 · 발표", href: "../day08/index.html" }
  ],
  "AI 프롬프트 엔지니어링 1": [
    { day: 1, title: "생성형 AI 이해와 ChatGPT 시작하기", href: "../day01/index.html" },
    { day: 2, title: "프롬프트의 원리와 구조", href: "../day02/index.html" },
    { day: 3, title: "AI 이미지 생성과 레퍼런스 활용" },
    { day: 4, title: "4컷 콘텐츠와 AI 광고 비주얼" },
    { day: 5, title: "AI로 Excel 데이터 만들기·분석" },
    { day: 6, title: "AI 챗봇 기획과 나만의 GPT" },
    { day: 7, title: "AI로 아이디어 기획하기" },
    { day: 8, title: "기획안 고도화와 웹페이지 체험" }
  ],
  "AI 프롬프트 엔지니어링 2": [
    { day: 1, title: "Gemini와 Google AI로 업무 시작하기", href: "../day01v2/index.html" },
    { day: 2, title: "나만의 Gem과 이미지 활용", href: "../day02/index.html" },
    { day: 3, title: "NotebookLM으로 자료 분석", href: "../day03/index.html" },
    { day: 4, title: "Deep Research·Canvas", href: "../day04/index.html" },
    { day: 5, title: "AI 이미지로 영상소스 만들기", href: "../day05/index.html" },
    { day: 6, title: "Google Flow 장면 연결·확장", href: "../day06/index.html" },
    { day: 7, title: "영상 기획과 Lyria 음악 제작", href: "../day07/index.html" },
    { day: 8, title: "CapCut 편집으로 영상 완성", href: "../day08/index.html" }
  ]
};
