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
    { day: 6, title: "AI로 짧은 애니메이션 만들기", href: "../day06/index.html" },
    { day: 7, title: "CapCut 편집과 AI 음악 만들기", href: "../day07/index.html" },
    { day: 8, title: "나만의 영상 — 기획부터 완성까지", href: "../day08/index.html" }
  ],
  "AI 에이전트": [
    { day: 1, title: "AI Agent 이해와 노드 기반 사고", href: "../day01/index.html" },
    { day: 2, title: "n8n 시작하기와 첫 번째 Workflow", href: "../day02/index.html" },
    { day: 3, title: "Google Sheets와 이메일 연결하기", href: "../day03/index.html" },
    { day: 4, title: "API와 Gemini를 활용한 AI Workflow", href: "../day04/index.html" },
    { day: 5, title: "조건과 분기로 똑똑한 Workflow" },
    { day: 6, title: "AI Agent와 Tool 사용 이해하기" },
    { day: 7, title: "나만의 AI Agent 기획·설계" },
    { day: 8, title: "나만의 AI Agent 완성·검증" }
  ],
  "AI 실무활용": [
    { day: 1, title: "오리엔테이션 · AI 시장 전망 · Gemini 시작하기", href: "../day01/index.html" },
    { day: 2, title: "요청 잘하기 심화 · 문서 업무 · 나만의 Gem", href: "../day02/index.html" },
    { day: 3, title: "Canvas로 문서 쓰기 → Google 문서 완성", href: "../day03/index.html" },
    { day: 4, title: "Google 시트 — 피벗 테이블 · 대시보드", href: "../day04/index.html" },
    { day: 5, title: "Google 슬라이드 — 보고용 발표자료", href: "../day05/index.html" },
    { day: 6, title: "Deep Research + Gemini Notebook", href: "../day06/index.html" },
    { day: 7, title: "기획안 고도화 · Apps Script 자동화", href: "../day07/index.html" },
    { day: 8, title: "실전 과제 — 지시부터 제출까지", href: "../day08/index.html" }
  ],
  "AI 콘텐츠제작": [
    { day: 1, title: "오리엔테이션 · Gemini로 첫 이미지 만들기", href: "../day01/index.html" },
    { day: 2, title: "여러 구도 · 여러 콘셉트로 바꾸기", href: "../day02/index.html" },
    { day: 3, title: "참고 이미지 · 여러 결과물 · 인스타 카드뉴스", href: "../day03/index.html" },
    { day: 4, title: "Google Flow로 광고 영상 장면 만들기", href: "../day04/index.html" },
    { day: 5, title: "CapCut 편집 · AI 배경음악 · 썸네일 · 이미지 릴스", href: "../day05/index.html" },
    { day: 6, title: "캐릭터 · 이모티콘 · 4컷 만화", href: "../day06/index.html" },
    { day: 7, title: "캐릭터 애니메이션 + TTS 내레이션", href: "../day07/index.html" },
    { day: 8, title: "뮤직비디오 또는 자유 주제", href: "../day08/index.html" }
  ],
  "수학의 힘 AI 교육특강": [
    { day: 1, title: "AI 활용 기초와 학원 자료 분석", href: "../day01/index.html" },
    { day: 2, title: "시험지·기출문제 분석", href: "../day02/index.html" },
    { day: 3, title: "학원 홍보 랜딩페이지 제작", href: "../day03/index.html" },
    { day: 4, title: "PPT·마케팅 콘텐츠 제작", href: "../day04/index.html" },
    { day: 5, title: "Claude로 만들고 AI SPACE로 배포하기", href: "../day05/index.html" }
  ]
};
