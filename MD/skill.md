# AI 강의자료 사이트 제작 스킬

이 사이트는 여러 과목(바이브코딩, AI 프롬프트 엔지니어링 1/2, AI 에이전트)의 강의자료를
모아둔 다과목 사이트입니다. `참고자료/` 안의 원본 교육자료(txt/HTML)를 분석해서 정리한
디자인 스타일과 콘텐츠 톤앤매너 가이드이며, 새로운 DAY 강의자료(HTML)를 만들 때
아래 규칙을 그대로 따릅니다. 실제 구현 예시는 `html/vibecoding/day01~03`,
`html/prompt-eng-2/day01v2`, `html/prompt-eng-2/day02`를 참고합니다.

## 0. 사이트 전체 구조 & 파일 경로 규칙

```
바이브코딩 강의자료/
├── index.html                        ← 메인 허브 (과목 아코디언)
├── css/
│   ├── common.css                    ← 모든 DAY 페이지 공통 스타일
│   └── index.css                     ← index.html 전용 스타일 (아코디언 등)
├── js/
│   ├── tailwind-config.js            ← Tailwind 커스텀 설정 (모든 페이지 공통)
│   ├── common.js                     ← 모든 DAY 페이지 공통 스크립트
│   └── index.js                      ← index.html 전용 스크립트 (과목 토글)
└── html/
    └── <subject-slug>/               ← 과목 폴더 (vibecoding, prompt-eng-2 ...)
        └── dayNN/
            └── index.html            ← 실제 강의자료 (폴더명이 곧 "dayNN")
```

- **새 DAY 페이지 경로**: `html/<subject-slug>/dayNN/index.html` — 항상 `dayNN` 이름의
  폴더를 만들고 그 안에 `index.html`을 둔다 (예: `html/vibecoding/day01/index.html`).
  이렇게 폴더로 감싸두면 나중에 실제 서버에 배포할 때 `.../dayNN/`처럼 확장자 없는
  깔끔한 주소를 쓸 수 있다.
- **상대경로 깊이**: DAY 페이지는 루트 기준 3단계 깊이(`html/과목/dayNN/`)에 있으므로
  공통 자산은 항상 `../../../css/common.css`, `../../../js/common.js`,
  `../../../js/tailwind-config.js`, 홈 링크는 `../../../index.html`로 참조한다.
- **기존 내용을 새 버전으로 교체할 때**: 기존 파일은 삭제하지 않고 그대로 둔 채,
  `dayNN` 옆에 `dayNNv2` 같은 새 폴더를 만들어 새 내용을 넣고, `index.html`의 카드
  링크만 새 폴더로 바꾼다 (예: `html/prompt-eng-2/day01` → `day01v2`로 연결 교체).
- **index.html(메인 허브)**: 과목별로 `subject-box`(제목 클릭 시 아코디언처럼 펼쳐지는
  박스) 안에 `day-card` 그리드를 넣는다. 이미 만들어진 DAY는 `<a href="html/과목/dayNN/index.html">`
  카드로, 아직 없는 DAY는 `is-disabled opacity-60` + "준비중" 배지로 표시한다.
  새 DAY를 만들면 반드시 해당 과목의 `준비중` 카드를 실제 링크로 교체(또는 카드 추가)한다.

## 1. 기술 스택 & 문서 기본 골격

- `<html lang="ko" class="scroll-smooth font-md">`
- Tailwind CSS는 CDN(`<script src="https://cdn.tailwindcss.com"></script>`)으로 로드, 별도 빌드 없음
- 폰트: Google Fonts `Pretendard`(본문), `JetBrains Mono`(코드/mono)
  - `preconnect` 2개 + `family=Pretendard:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600`
- 아이콘: FontAwesome 6.4.0 (`fa-solid`, `fa-regular` 사용)
- `tailwind.config`에 `fontFamily.sans/mono`와 `colors.brand`(인디고 스케일 50~100) 커스텀 등록
  (`js/tailwind-config.js`에 분리되어 있으며 모든 페이지가 동일 파일을 로드)
- `<body class="bg-slate-50 text-slate-800 antialiased font-sans">`

### 과목별 강조 색상 (Accent Color)
과목마다 브랜드 색을 다르게 써서 지금 어느 과목을 보고 있는지 시각적으로 구분한다.
페이지 안의 `indigo-*` 자리를 아래처럼 통째로 치환하면 된다 (배지, 사이드바 hover,
버튼, 정의박스 테두리, 프로그레스 그리드 번호 배지 등 전부 포함).

| 과목 | Accent | 비고 |
|---|---|---|
| 바이브코딩 | `indigo` (기본값) | 최초 설계된 색상, 기본 팔레트 |
| AI 프롬프트 엔지니어링 2 | `sky` | Gemini/Google 계열 톤 |
| AI 프롬프트 엔지니어링 1 · AI 에이전트 | 미정 (신규 제작 시 인디고와 겹치지 않는 색으로 정하고 이 표에 추가) | |

한 페이지 안에서는 accent 색을 섞지 않고 하나로 통일한다 (버튼 hover, 사이드바 링크
hover, 아이콘 색 등 전부 같은 accent).

### 공통 `<style>` 블록 (그대로 재사용)
- 커스텀 스크롤바 (`::-webkit-scrollbar` 계열)
- 글자 크기 3단계: `html.font-sm` 15px / `html.font-md` 18px(기본) / `html.font-lg` 21px
- `.step-container`: 반응형 고정폭 컨테이너
  - 1600px~ → max-width 1440px
  - 1280~1599px → 1200px
  - 1024~1279px → 960px
  - 768~1023px → 720px
  - ~767px → 100% + 좌우 패딩 1rem
- `#sidebar`는 1024px 이상에서 `position: fixed; left: 0; top: 84px` + width/min/max 280px 고정,
  `height: calc(100vh - 84px)`, 오른쪽만 둥근 모서리(`border-radius: 0 1rem 1rem 0`) —
  **화면 진짜 왼쪽 끝에 고정**되어 본문이 가운데 공간을 넓게 쓸 수 있도록 함 (1024px 미만에서는
  기존처럼 본문 위에 쌓이는 일반 블록)
- `#sidebar .toc-link`는 font-size 13.5px 고정

## 2. 페이지 레이아웃 구조

```
<body>
  header (sticky, 상단 고정, 전체 폭)
    ├─ DAY XX 배지 + 강의 제목
    └─ 글자크기 조절 / 검색창 / 목차 접기 버튼

  aside#sidebar               ← header 바로 다음, 독립 형제 요소 (flex 래퍼로 감싸지 않음)
                                  1024px↑: 화면 왼쪽에 고정(position:fixed)
                                  1024px↓: 그냥 본문 위에 쌓이는 블록

  div#mainWrapper (lg:pl-[280px])   ← 사이드바 폭만큼 왼쪽 여백 확보
    └─ div.step-container (반응형 최대폭 + 좌우 패딩)
         └─ main#mainContent
              ├─ 상단 배너 섹션 (그라디언트, DAY 타이틀 + 한줄 소개)
              └─ section#sec-xxx (여러 개, 번호 순서대로)
```

핵심은 **사이드바와 본문이 더 이상 같은 flex 부모 안에 나란히 들어있지 않다**는 점이다.
사이드바는 header 뒤에 독립적으로 두고, 본문은 `#mainWrapper`로 감싸 `lg:pl-[280px]`로
사이드바 폭만큼만 왼쪽 여백을 확보한다. 목차를 접으면(`toggleSidebar()`) 이 패딩도
함께 사라져 본문이 전체 폭을 쓴다 (5절 JS 참고).

### Header
- 좌측: `DAY 0X` accent 배지 + `<h1>` 강의 제목(truncate) — DAY 페이지가 아닌 index.html은
  배지 대신 사이트 아이콘 사용
- 우측 컨트롤 3종(모두 동일 위치/순서 유지):
  1. 글자크기 스위처(작게/보통/크게) — `setFontSize('sm'|'md'|'lg')`
  2. 검색 입력창(`#searchInput`, `onkeyup="searchInPage()"`) — sm 이상에서만 노출
  3. 목차 접기/펼치기 버튼(`#sidebarToggleBtn`) — `toggleSidebar()`
- 홈 버튼(`<i class="fa-solid fa-house">`)을 배지 왼쪽에 두어 `../../../index.html`로 이동

### Sidebar (목차)
- 상단: "학습 목차" 라벨 + 세션 개수 배지 + 접기 버튼
- `<nav>` 안에 각 섹션 앵커(`#sec-xxx`) 링크 나열, hover 시 accent 배경
- 하단: 안내 문구 박스 — 재구성한 자료라면 `💡 학습자료 기반 재구성` / `제공된 교육내용을
  바탕으로 시각적으로 재구성했습니다.` 문구를 기본으로 사용

### 상단 배너 섹션 (매 DAY 첫 섹션)
공간을 넉넉하게 쓴다 — 패딩은 `p-10 sm:p-14`, 배지 아래 여백 `mb-5`, 제목 위 여백 `mt-5`,
설명 문단은 `leading-loose`로 줄간격을 넓게 준다.
```html
<section class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-10 sm:p-14 text-white shadow-xl relative overflow-hidden">
  <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="relative z-10">
    <span class="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-300/30 text-indigo-200 text-xs font-semibold rounded-full mb-5">과목명 또는 태그</span>
    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">DAY 0X. 강의 제목</h1>
    <p class="mt-5 text-indigo-100/90 text-sm sm:text-base max-w-2xl leading-loose">한 줄 소개 문장</p>
  </div>
</section>
```

### 콘텐츠 섹션 공통 헤더
섹션 패딩도 넉넉하게 `p-8 sm:p-12`, 번호 배지는 `w-11 h-11`, 헤더 아래 여백 `mb-8`.
공간을 좁게 쓰거나(글자가 여백 없이 붙어 보이거나), 좁은 카드 안에서 단어가 어색하게
잘리는 레이아웃은 지양한다 — 사용 가능한 가로/세로 공간을 항상 넉넉하게 활용하기.
```html
<section id="sec-xxx" class="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm transition-all hover:border-indigo-200">
  <div class="flex items-center gap-4 mb-8">
    <div class="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">01</div>
    <div>
      <span class="text-xs font-bold text-indigo-600 tracking-wider uppercase">English Category Label</span>
      <h2 class="text-xl font-bold text-slate-900">섹션 제목</h2>
    </div>
  </div>
  <!-- 본문 -->
</section>
```
- 번호는 두 자리(01, 02…), 영문 카테고리 라벨은 uppercase (예: Orientation, Roadmap, Definition,
  Process Workflow, Collaboration, Structure, Architecture, Core Web Tech, Methodology,
  AI Workspace, Core Features, Prompting Guide, Dev Tools Triad, Setup & Clone, Project Structure,
  Version Control, Hands-on Practice, Iteration, Key Concept, Wrap Up, Class Format, Audience
  Adaptation, Image Generation, Final Practice, Save & Publish, Next Class)

### 매 DAY 구성 순서 (권장 템플릿)
1. 수업 구성 (난이도 / 수업방식 / 실습비중 / 핵심목표 카드)
2. 오늘 배우는 내용 & 전체 흐름 (오늘 집중할 내용 칩 목록 + 전체 흐름, 8단계 이상이면
   (2-1) 번호 칩 그리드 사용)
3. (선택) 지난 시간 복습 섹션 — DAY 2 이상이면 지난 DAY 핵심 도구/개념을 짧게 되짚기
4. 본문 핵심 개념 섹션들 (주제별로 여러 개로 나눔 — 원본이 강의 슬라이드처럼 잘게
   쪼개져 있으면, 같은 메시지를 반복하는 슬라이드들은 한 섹션으로 병합해서 정리하기.
   원본 슬라이드 개수를 그대로 사이드바 항목 수로 옮기지 않기)
5. 실습 섹션(들) — 실습이 여러 단계(STEP/실습①②③)로 이어지면 관련 STEP을 묶어서
   섹션 3~5개 정도로 구성 (STEP 하나당 섹션 하나씩 만들지 않기)
6. 오늘 내용 정리 & 다음 수업 예고 (`#sec-summary`) — 핵심 키워드 그리드, 오늘 배운
   흐름 요약, 다음 DAY 예고를 포함

전체 섹션 수는 자료 분량에 따라 다르지만 대체로 **13~17개** 선에서 관리한다 (사이드바가
너무 길어지지 않도록). 실제 예시: 바이브코딩 day01(11) · day02(13) · day03(14),
prompt-eng-2 day01v2(13) · day02(16).

## 3. 반복 사용되는 콘텐츠 UI 패턴

### (1) 개념 정의 박스
```html
<div class="bg-indigo-50/80 border-l-4 border-indigo-600 p-5 rounded-r-xl mb-6">
  <h3 class="text-sm font-bold text-indigo-900 mb-1">개념 이름</h3>
  <p class="text-slate-800 text-sm leading-relaxed font-medium">정의 문장</p>
</div>
```

### (2) 세로 플로우 다이어그램 (프로세스/순서 표현, 7단계 이하)
- 박스 여러 개를 `space-y-1` 로 쌓고 사이사이 화살표 아이콘(`fa-arrow-down`) 삽입
- 마지막 단계는 `bg-indigo-600 text-white`로 강조
- **7단계 이하일 때만 사용.** 8단계 이상이면 세로로 너무 길어지므로 아래 (2-1) 번호 칩 그리드를 사용하기
```html
<div class="max-w-md mx-auto space-y-1 text-center text-sm font-semibold text-slate-800">
  <div class="p-3 bg-white rounded-xl border border-indigo-100 shadow-xs">단계 1</div>
  <div class="flex justify-center text-indigo-500 py-0.5"><i class="fa-solid fa-arrow-down text-xs"></i></div>
  ...
  <div class="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">마지막 단계</div>
</div>
```

### (2-1) 번호 칩 그리드 (긴 단계형 흐름, 8단계 이상 또는 "전체 흐름" 요약)
- 8단계 이상의 긴 흐름(예: "오늘 수업의 전체 흐름", "DAY 정리 흐름")은 세로 화살표 스택으로 만들지 않기 —
  화면 세로로 지나치게 길어지고 스크롤 부담이 커짐
- 대신 **화살표 없이 원형 번호 배지 + 그리드**로 한눈에 들어오게 구성하기
- **열 개수를 `sm:grid-cols-3 lg:grid-cols-4`처럼 고정하지 않기.** 항목 텍스트 길이가 제각각이라
  고정 열에서는 단어가 어색하게 잘리거나(예: "...프로그램 설" / "치"처럼 두 줄로 쪼개짐) 줄바꿈이 지저분해짐
- 반드시 `grid-cols-[repeat(auto-fit,minmax(220px,1fr))]` 같은 **auto-fit + minmax**를 사용해서
  카드마다 텍스트가 편하게 들어갈 최소 너비(약 200~220px)를 보장하고, 화면 크기에 따라 열 개수가
  자연스럽게 늘어나거나 줄어들게 하기
- 컨테이너는 `max-w-5xl mx-auto` 정도로 넉넉하게 잡아 사용 가능한 가로 공간을 충분히 활용하기
  (좁게 잡으면 auto-fit이 있어도 열이 억지로 줄어들어 답답해 보임)
```html
<div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 max-w-5xl mx-auto">
  <div class="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-xs flex items-center gap-2.5 text-sm font-semibold text-slate-800">
    <span class="w-6 h-6 shrink-0 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">1</span>
    <span>단계 설명 (길어도 카드 안에서 자연스럽게 줄바꿈됨)</span>
  </div>
  ...
  <div class="p-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-sm flex items-center gap-2.5 text-sm">
    <span class="w-6 h-6 shrink-0 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">N</span>
    <span>마지막 단계</span>
  </div>
</div>
```
- 어두운 배경(예: 그라디언트 요약 박스)에 여러 항목을 한 줄로 쭉 이어붙이는 방식(`flex flex-wrap` + `→` 구분자)도
  항목이 5개를 넘으면 글자가 작아지고 가로로 지나치게 길어져 읽기 힘들어짐 —
  이 경우도 화살표 없이 같은 auto-fit 그리드 방식(`text-sm sm:text-base`로 글자 키우기)으로 바꾸기

### (3) 좌/우 비교 카드 (기존 방식 vs AI/새 방식)
- 좌측: `bg-slate-50 border-slate-200` (기존/일반)
- 우측: `bg-indigo-50/40 border-indigo-200` (AI/신규, 강조)
- `grid grid-cols-1 md:grid-cols-2 gap-6`

### (4) O / X 비교 카드 (좋은 예 vs 나쁜 예)
- X: `bg-rose-50 border-rose-200 text-rose-950`
- O: `bg-emerald-50 border-emerald-200 text-emerald-950`
- 실제 프롬프트 문장을 그대로 예시로 제공

### (5) 주의사항 박스
```html
<div class="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
  <h3 class="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
    <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> 제목
  </h3>
  ...
</div>
```

### (6) 역할/기능 비교 표 (`<table>`)
- `thead: bg-slate-100 font-bold`, `tbody: divide-y divide-slate-200`, 행 hover `hover:bg-slate-50`
- 첫 컬럼은 `font-bold bg-slate-50/50`로 강조

### (7) 코드 블록
```html
<pre class="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto"><code>...</code></pre>
```
- 색상 강조가 필요하면 `text-sky-300`(CSS), `text-amber-300`(JS), `text-emerald-400`(터미널 명령어) 등 사용
- 프롬프트 예시에는 복사 버튼 추가 가능: `<button onclick="copyTextById('id')">예시 복사</button>`

### (8) 태그/칩 목록
- `flex flex-wrap gap-1.5` 컨테이너 안에 `px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg` 칩 나열

### (9) 카드형 그리드 (3~4열, 아이콘 + 제목 + 설명)
```html
<div class="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-xs transition-all">
  <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm mb-2.5">
    <i class="fa-solid fa-xxx"></i>
  </div>
  <h5 class="text-sm font-bold text-slate-900 mb-1">제목</h5>
  <p class="text-xs text-slate-600 leading-relaxed break-keep">설명</p>
</div>
```

### (10) 비유 설명 박스
- "💬 비유하자면:", "🏠 집에 비유하기" 등 이모지 + 강조 텍스트로 초보자 이해를 돕는 비유 삽입
- 예: Front-end=외모/표정, Back-end=두뇌, HTML=뼈대, CSS=옷, JavaScript=근육

### (11) 핵심 요약 강조 바
- 섹션 끝에 `bg-slate-100 rounded-xl text-xs text-slate-700 text-center font-medium` 또는
  인디고/그라디언트 배경으로 그날 배운 핵심을 한 줄 요약 (🎯, ✨, 👉, 💡 이모지 활용)

### (12) 클릭 복사형 프롬프트 상자 — 모든 실습 프롬프트에 필수 적용
학생이 실제로 타이핑하거나 복사해서 쓰는 프롬프트(실습 프롬프트, STEP별 프롬프트,
Gem Instructions 등)는 예외 없이 이 패턴을 사용한다. **상자 자체를 클릭해도 즉시
복사되고**, 클릭 가능하다는 것이 항상 보이는 안내 문구로 드러나야 한다 (마우스 호버가
없는 모바일에서도 알 수 있어야 하므로 hover 전용 힌트는 부족함).

```html
<div class="p-5 bg-white rounded-xl border border-indigo-200">
  <div class="flex items-center justify-between mb-2">
    <span class="text-xs font-bold text-indigo-800">실습 프롬프트 ①</span>
    <button onclick="copyTextById('promptId')" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
      <i class="fa-regular fa-copy"></i> 복사
    </button>
  </div>
  <span class="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-500 mb-1.5">
    <i class="fa-solid fa-hand-pointer"></i> 상자를 클릭하면 바로 복사돼요
  </span>
  <p id="promptId" onclick="copyTextById('promptId')" role="button" tabindex="0"
     class="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-200
            cursor-pointer hover:border-indigo-300 hover:bg-indigo-100/40 active:bg-indigo-100/60 transition">
프롬프트 내용을
여러 줄로 작성해도
줄바꿈이 그대로 보여야 함
  </p>
</div>
```
- **`whitespace-pre-line` 필수.** 이게 없으면 HTML의 개행이 브라우저에서 공백 하나로
  합쳐져 프롬프트가 한 줄로 붙어버린다. `whitespace-pre-line`은 소스의 줄바꿈은
  그대로 살리면서 문장이 길면 자동 줄바꿈도 되므로 프롬프트 상자에 가장 적합하다.
- 헤더 행의 "복사" 버튼은 그대로 유지한다 (버튼 클릭 / 상자 클릭 두 가지 방법 모두 제공)
- 힌트 문구(`상자를 클릭하면 바로 복사돼요`)는 **상자 바로 위에 항상 표시**, hover가 아니라
  기본 상태에서부터 보이게 한다
- `cursor-pointer` + `hover:border-{accent}-300 hover:bg-{accent}-100/40 active:bg-{accent}-100/60`
  로 클릭 가능함을 시각적으로 분명히 표시 (accent는 2절 표의 과목 색상)
- 어두운 배경 위의 실시간 생성 박스(`<div>`)에도 동일하게 적용하되 hover 색만
  `hover:border-indigo-400 hover:bg-slate-800`처럼 다크 톤에 맞게 조정
- 이 패턴은 무조건 모든 흰 박스에 적용하는 게 아니라 **실제 복사해서 쓰라고 주는
  프롬프트 예시에만** 적용한다 (설명용 인용문, 결과 예시 텍스트 등에는 붙이지 않기)

### (13) 교시 구분 / 쉬는시간 구분선
2교시 이상 진행되는 수업이나 "따라하기" 실습형 수업에서, 실제 강의 흐름(1교시/2교시,
10분 휴식)을 그대로 보여주고 싶을 때 사용하는 아주 짧은 구분선.
```html
<div class="flex items-center justify-center gap-3 text-sm font-bold text-slate-400">
  <span class="h-px flex-1 bg-slate-200"></span>
  <span class="px-3 py-1 bg-slate-100 rounded-full flex items-center gap-1.5"><i class="fa-solid fa-mug-hot"></i> 10분 휴식</span>
  <span class="h-px flex-1 bg-slate-200"></span>
</div>
```
- 섹션 헤더의 영문 카테고리 라벨에 `· 1교시` / `· 2교시`를 덧붙여 지금 어느 교시인지
  표시할 수도 있다 (예: `Hands-on Practice · 1교시`)

## 4. 색상 의미 체계 (일관되게 유지)

| 색상 | 의미 |
|---|---|
| Indigo | 핵심 개념, AI, 브랜드 강조 |
| Emerald | 권장/좋은 예/완료 |
| Rose | 비권장/나쁜 예/주의 |
| Amber | 주의사항/경고/팁 |
| Slate | 기본/중립/기존 방식 |
| Blue | Front-end 관련 |
| Purple | Back-end / Git 관련 |
| Sky | CSS 관련 |
| Orange | HTML 관련 |

## 5. JavaScript 기능

### DAY 페이지 공통 (`js/common.js`, 그대로 재사용)
- `setFontSize(size)`: 글자 크기 3단계 전환 + 버튼 active 스타일 갱신
- `toggleSidebar()`: 목차 사이드바 표시/숨김 + 버튼 라벨·색상 전환 + **`#mainWrapper`의
  `lg:pl-[280px]` ↔ `lg:pl-0` 클래스도 함께 토글**해서 목차를 접으면 본문이 화면
  전체 폭을 쓰도록 함 (fixed 사이드바 구조이므로 이 처리가 없으면 접어도 여백이 안 없어짐)
- `searchInPage()`: `#searchInput` 값으로 `#mainContent > section` 텍스트를 필터링해 보이기/숨기기
- `copyTextById(id)` / `copyToClipboard(text)`: 프롬프트 상자·복사 버튼 공용, 클릭 복사형
  프롬프트 상자((12) 패턴)의 `onclick`과 헤더의 "복사" 버튼이 모두 이 함수를 호출한다.
  `document.execCommand('copy')` 폴백 + 토스트 알림(`showToast`)

### index.html(메인 허브) 전용 (`js/index.js`)
- `toggleSubject(id)`: 과목 박스를 클릭하면 해당 `#panel-{id}`를 펼치고 화살표 아이콘을
  회전, 박스에 `is-open` 클래스를 토글해 테두리를 강조한다. 새 과목을 추가할 때는
  `id="box-{slug}"`, `id="panel-{slug}"`, `id="chevron-{slug}"` 세 쌍을 정확히 맞춰야 한다.

## 6. 콘텐츠 톤앤매너

- **대상**: 코딩 경험이 거의 없는 초급자
- **문체**: 명사형 종결 "~하기" 통일 (예: "이해하기", "구성하기", "확인하기") — 설명체(다/입니다)는 정의 문장에서만 제한적으로 사용
- **핵심목표는 항상 1문장**으로 명확하게 제시
- **실습 예시는 실제 프롬프트 문장을 그대로** 제시 (따옴표로 감싼 구체적 한국어 문장)
- **추상적 표현 지양**: "예쁘게 만들어줘" 같은 표현은 항상 X 예시로만 사용하고, 구체적 대안을 O 예시로 짝지어 보여주기
- **AI와 사람의 역할을 명확히 구분**해서 설명 (AI가 잘하는 일 / 사람이 판단해야 하는 일)
- **비유를 적극 활용**해서 기술 개념을 일상 개념으로 치환 설명
- 이모지는 절제해서 강조 포인트에만 사용: 🎯(목표), ✨(핵심 정리), 👉(행동 지침), 💡(팁), ⚠️(주의), 💬(비유)

## 7. 새 DAY 자료 제작 시 체크리스트

1. 원본 참고자료(txt/HTML)를 먼저 전부 읽고, 슬라이드 단위로 잘게 쪼개진 내용 중
   **같은 메시지를 반복하는 것들을 어떻게 묶을지** 판단한 뒤 섹션 구조(13~17개 목표)를
   정한다. 내용을 빼는 게 아니라 배치를 합리적으로 묶는 것이 원칙 — 사용자에게 병합/삭제
   계획을 먼저 말하고 확인받은 뒤 작업 시작 (단, 사용자가 "판단해서 알아서 하라"고 명시한
   경우는 확인 없이 진행)
2. 새 폴더 `html/<subject-slug>/dayNN/index.html` 생성 (0절 참고), 기존 파일을 교체하는
   경우 기존 파일은 지우지 말고 `dayNNv2` 등 새 경로를 만들어 index.html 링크만 교체
3. 기존 DAY 페이지 하나를 통째로 복사해서 뼈대(`<head>`, header, **fixed 사이드바 +
   `#mainWrapper` 구조**, `<body>` 바로 뒤의 **`#authGate` 로그인 게이트**, 하단
   `<script>` 태그)를 그대로 재사용하고, 상대경로 깊이가 같은지 확인(`../../../`).
   `#authGate`의 `data-subject` 값을 해당 과목명(1절 표의 정확한 과목명)으로,
   `data-day` 값을 그 과목 내에서 몇 번째 DAY인지(1부터 시작하는 정수)로 맞춘다
   — 8절 참고
4. `DAY 0X`, 제목, 상단 배너 태그/소개 문장, 과목에 맞는 accent 색상(1절 표)으로 교체
5. 사이드바 목차 개수와 링크를 실제 섹션 수에 맞게 갱신
6. 섹션 순서는 "수업 구성 → 오늘 배우는 내용&전체 흐름 → (지난 시간 복습) → 본문/실습
   섹션들 → 정리&다음 수업" 패턴 유지
7. 각 섹션은 3절의 UI 패턴(정의 박스/플로우 다이어그램/번호 칩 그리드/비교 카드/O·X
   비교/주의 박스/표/코드블록/칩/카드그리드/비유박스/요약바/**클릭 복사형 프롬프트
   상자**/교시 구분선) 중 내용에 맞는 것을 조합
8. 색상 의미 체계(4절)를 벗어나지 않게 사용, 과목 accent 색상을 페이지 전체에서 통일
9. 문체와 톤(6절)을 전체 문서에서 일관되게 유지
10. **8단계 이상의 긴 흐름은 반드시 (2-1) 번호 칩 그리드(auto-fit) 사용** — 세로 화살표
    스택이나 고정 열 그리드(`lg:grid-cols-4` 등)로 만들지 않기. 항목 텍스트가 카드 폭에
    비해 길어서 단어 중간에 어색하게 줄바꿈되지 않는지 반드시 확인하기
11. **학생이 직접 입력/복사할 모든 프롬프트에 (12) 클릭 복사형 상자 패턴 적용** —
    힌트 문구 + `onclick` + hover/active 스타일 빠짐없이 넣기
12. 완성 후 `grep -c "<div"` / `"</div>"`, `<section` / `</section>` 개수가 일치하는지
    반드시 확인 (Bash로 빠르게 검증 가능)
13. `index.html`의 해당 과목 패널에 새 DAY 카드를 추가하거나 "준비중" 카드를 실제
    링크로 교체
14. `#authGate`가 이 페이지에도 들어갔는지, `data-subject`가 정확한 과목명인지,
    `data-day`가 그 과목 안에서의 순번인지, `auth-config.js`/`auth.js` 스크립트
    태그가 `common.js` 다음 줄에 있는지 확인

## 8. 수강생 접근 제어 (로그인 게이트)

과목별 강의자료가 링크만 있으면 누구나(다른 과목 수강생 포함) 열람 가능한 문제를
막기 위해, 모든 DAY 페이지는 `<body>` 바로 다음에 `#authGate` 오버레이를 갖는다.
등록일 하루 만에 전체가 열리는 게 아니라, **회차 단위로 순차 오픈**된다
(기본값: 1주일마다 2개 DAY씩 오픈).

**구조**
- `<body>` 직후: `<div id="authGate" data-subject="과목명" data-day="N">...이름 입력 폼...</div>`
  (카드 마크업은 기존 DAY 페이지에서 그대로 복사, `data-subject`/`data-day`만 교체.
  `data-day`는 그 과목 안에서 몇 번째 DAY인지 1부터 매기는 번호 — 폴더명이
  `dayNNv2`처럼 바뀌어도 이 값은 실제 순번을 따른다)
- `</body>` 직전, `common.js` 다음 줄: `auth-config.js` → `auth.js` 순서로 로드
- `js/auth-config.js`: 구글 시트를 "웹에 게시(CSV)"한 URL(`window.AUTH_SHEET_CSV_URL`),
  전체 접근 기한(`window.AUTH_ACCESS_DAYS`, 기본 28일), 오픈 단위
  (`window.AUTH_DAYS_PER_UNLOCK`, 기본 2일치씩)와 오픈 간격
  (`window.AUTH_UNLOCK_INTERVAL_DAYS`, 기본 7일)을 정의 — **모든 페이지가 이 한
  파일을 공유**하므로 이 값들은 여기 한 곳만 바꾸면 전체 사이트에 반영됨.
  예) DAY1~2는 등록일부터, DAY3~4는 등록일+7일부터, DAY5~6은 +14일부터 오픈
- `js/auth.js`: `#authGate`를 찾아 이름 입력 → 구글 시트 CSV(`fetch`)를 받아 파싱 →
  `[이름, 과목, 등록일]` 행 중 `이름`과 `data-subject`가 모두 일치하는 행을 찾는다.
  이 페이지의 `data-day`로 회차(`ceil(day / AUTH_DAYS_PER_UNLOCK)`)를 계산해
  `오픈일 = 등록일 + (회차-1) × AUTH_UNLOCK_INTERVAL_DAYS`를 구하고, 오늘이 오픈일
  이전이면 "아직 안 열림", `등록일 + AUTH_ACCESS_DAYS`(전체 기한)를 지났으면 "만료"로
  막는다. 통과하면 `localStorage["lecture_auth_<과목명>"]`에 `{name, registeredAt}`을
  캐시(등록일 원본을 저장 — 페이지마다 `data-day`가 다르므로 만료일을 미리 계산해두지
  않고 방문할 때마다 그 페이지 기준으로 다시 계산)해서, 같은 브라우저는 같은 과목의
  다른 DAY로 이동해도 이름을 다시 묻지 않고 그 DAY의 오픈일만 확인함
- `css/common.css`의 "수강생 접근 제어" 블록이 오버레이 스타일과 `html.gate-locked`
  스크롤 잠금을 담당 (한 곳만 수정하면 전 페이지 반영)

**명단(구글 시트) 관리**
- 시트 헤더: `이름, 과목, 등록일(YYYY-MM-DD)` — 한 사람이 여러 과목을 들으면 과목마다
  한 행씩 추가 (양식 예시: `참고자료/수강생명단_양식.csv`)
- 과목명은 반드시 `data-subject` 값과 완전히 동일해야 매칭됨 (1절 accent 색상 표의
  과목명과 통일해서 사용)
- 구글 시트에서 `파일 → 공유 → 웹에 게시 → CSV` 로 얻은 URL을 `js/auth-config.js`의
  `AUTH_SHEET_CSV_URL`에 붙여넣기
- **한계**: 정적 사이트라 서버 검증이 없으므로, 브라우저 개발자도구로 시트 내용이나
  로그인 우회를 시도하면 완벽히 막을 수는 없음 — "링크 유출/다른 과목 무단 열람"을
  막는 실용적 수준의 게이트이며, `fetch`가 필요하므로 **file://로는 동작하지 않고
  실제 웹서버(https)에 배포된 상태에서만 정상 동작**함
