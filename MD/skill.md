# AI 강의자료 사이트 제작 스킬

이 사이트는 여러 과목(바이브코딩, AI 프롬프트 엔지니어링 1/2, AI 에이전트)의 강의자료를
모아둔 다과목 사이트입니다. `참고자료/` 안의 원본 교육자료(txt/HTML)를 분석해서 정리한
디자인 스타일과 콘텐츠 톤앤매너 가이드이며, 새로운 DAY 강의자료(HTML)를 만들 때
아래 규칙을 그대로 따릅니다. 실제 구현 예시는 `html/vibecoding/day03`(따라하기 실습),
`html/vibecoding/day05`(이미지 예시 · 쉬운 용어), `html/prompt-eng-2/day03`·`day04`
(실습 주제 고르기)를 참고합니다.

**수강생 대부분은 웹/디자인 지식이 없는 성인 초보자**입니다. 모든 규칙은 이 전제를 따릅니다
(6절 "쉬운 용어" 참고).

## 0. 사이트 전체 구조 & 파일 경로 규칙

```
바이브코딩 강의자료/
├── index.html                        ← 메인 허브 (AI 컨셉 랜딩 + 과목 아코디언 + 강사 소개 팝업, 전용 스타일은 파일 내 <style>)
├── css/
│   └── theme.css                     ← 모든 페이지 공통 테마 (문서형 디자인, 다크 모드, 로그인 게이트 포함)
├── js/
│   ├── tailwind-config.js            ← Tailwind 커스텀 설정 (DAY 페이지 공통)
│   ├── theme.js                      ← 모든 DAY 페이지 공통 스크립트
│   ├── day-nav-config.js             ← 과목별 DAY 목록 (헤더 드롭다운 · 이전/다음 버튼)
│   ├── auth-config.js / auth.js      ← 수강생 로그인 게이트 (8절)
│   └── index.js                      ← index.html 전용 스크립트 (과목 토글)
├── img/                              ← 이미지 (웹용으로 줄인 JPG만 둔다 — 아래 이미지 규칙)
│   ├── profile.jpg                   ← 강사 사진 (480px)
│   └── day05-wireframe-1~4.jpg       ← DAY 05 와이어프레임 예시
├── MD/skill.md                       ← 이 문서
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
  공통 자산은 항상 `../../../css/theme.css`, `../../../js/theme.js`,
  `../../../js/tailwind-config.js`, 홈 링크는 `../../../index.html`로 참조한다.
- **기존 내용을 새 버전으로 교체할 때**: 기존 파일은 삭제하지 않고 그대로 둔 채,
  `dayNN` 옆에 `dayNNv2` 같은 새 폴더를 만들어 새 내용을 넣고, `index.html`의 카드
  링크만 새 폴더로 바꾼다 (예: `html/prompt-eng-2/day01` → `day01v2`로 연결 교체).
- **index.html(메인 허브)**: 강의 페이지와 달리 **어두운 AI 컨셉 랜딩**이다. Tailwind 없이
  `theme.css`(초기화) + 파일 안의 `<style>`만 사용한다. 첫 화면은 신경망 캔버스 배경 +
  그라데이션 제목 + 예시 요청이 타이핑되는 프롬프트 입력창이고, 그 아래 `#subjects`에
  과목 아코디언이 있다. 하나의 `.subject-list` 안에 과목별 `.subject-box`를 두고, 펼치면
  `.day-list`에 `.day-link` 카드(`DAY NN` 배지 · 제목 · 설명 · 화살표)가 나열된다. 과목 행
  오른쪽의 `.subject-meta`에 강의 개수("8개 강의") 또는 `is-muted` "준비중"을 표시한다.
  새 DAY를 만들면 해당 과목 `.day-list`에 `<li><a class="day-link">` 카드를 추가하고
  (`<span class="day-link__day">DAY NN</span>` — 띄어쓰기 포함) 개수를 갱신한다.
  `<main>`의 id는 `mainContent`로 두지 않는다 (theme.css의 강의 페이지용 섹션 규칙이 적용됨)
- **강사 소개 팝업(index.html)**: 헤더의 "강사 소개" 버튼(`#instructorOpen`)을 누르면 가운데에
  `<dialog id="instructorModal" class="x-modal">`이 뜬다 (사진 · 이름 · 직함 · 담당 과목 ·
  국가기술자격(금색 강조) · AI·디자인·문서 자격). 사진 버튼(`#photoZoomOpen`)을 누르면 최대
  360px 크기의 확대 사진(`#photoZoom`)이 겹쳐 뜨고, 아무 곳이나 누르거나 Esc로 닫힌다.
  새 과목을 맡으면 `.x-modal__subjects` 목록에, 새 자격증은 해당 목록에 추가한다
- **이미지 규칙**: 원본(PNG 등)은 용량이 커서 저장소에 올리지 않는다. 가로 1400px 이하(사진은
  480px 정도)의 JPG 사본(품질 80~86, 한 장 200KB 안팎)을 만들어 `img/`에 두고 그것만 사용한다.
  파일 이름은 영문 소문자(`day05-wireframe-1.jpg` 형식)로 짓는다

## 1. 기술 스택 & 문서 기본 골격

- `<html lang="ko" class="scroll-smooth font-md">`
- Tailwind CSS는 CDN(`<script src="https://cdn.tailwindcss.com"></script>`)으로 로드, 별도 빌드 없음
- 폰트: Pretendard는 **jsDelivr CDN**에서 로드(Google Fonts에는 Pretendard가 없음),
  JetBrains Mono만 Google Fonts에서 로드
  - `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
  - `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap`
- 아이콘: FontAwesome 6.4.0 (`fa-solid`, `fa-regular` 사용)
- `tailwind.config`에 `fontFamily.sans/mono`(`Pretendard Variable` 우선)와 `colors.brand` 커스텀 등록
  (`js/tailwind-config.js`에 분리되어 있으며 모든 DAY 페이지가 동일 파일을 로드)
- `<body>` — 클래스 없음 (배경·글자색·폰트는 `theme.css`가 담당)

### 과목별 강조 색상 (Accent Color)
과목마다 브랜드 색을 다르게 써서 지금 어느 과목을 보고 있는지 시각적으로 구분한다.
페이지 안의 `indigo-*` 자리를 아래처럼 통째로 치환하면 된다 (배지, 사이드바 hover,
버튼, 정의박스 테두리, 프로그레스 그리드 번호 배지 등 전부 포함).

| 과목 | Accent | 비고 |
|---|---|---|
| 바이브코딩 | `indigo` (기본값) | 최초 설계된 색상, 기본 팔레트 |
| AI 프롬프트 엔지니어링 2 | `sky` | Gemini/Google 계열 톤 |
| AI 프롬프트 엔지니어링 1 | `purple` | ChatGPT 과목. 인디고·스카이와 구분되고 다크 모드 자동 변환 색 계열에 포함 |
| AI 에이전트 | 미정 (신규 제작 시 위 색들과 겹치지 않고, 1절 다크 모드 변환 색 계열 안에서 정하고 이 표에 추가) | |

한 페이지 안에서는 accent 색을 섞지 않고 하나로 통일한다 (버튼 hover, 사이드바 링크
hover, 아이콘 색 등 전부 같은 accent).

### 공통 테마 (`css/theme.css`) — 문서형 디자인
- **디자인 방향**: GitBook·기술 블로그 같은 문서형. 섹션은 카드가 아니라 구분선으로 나누고,
  카드 안에 카드를 넣는 중첩·그림자·그라디언트 배너를 쓰지 않는다
- **색상 토큰**: `:root`의 `--brand`, `--text`, `--muted`, `--border` 등을 사용
- **글자 크기 3단계**: `html.font-sm` 16px / `html.font-md` 18px(기본) / `html.font-lg` 20px.
  인터페이스(헤더·목차·메뉴·푸터)는 `theme.css`에서 **px**로, 본문(Tailwind)은 **rem**으로
  지정되어 있어 글자 크기 설정은 본문에만 반영된다 — `!important` 덮어쓰기 불필요.
  선택값은 `localStorage`에 저장되어 다음 방문에도 유지됨
- **본문 자동 정리**: `#mainContent` 안의 기존 Tailwind 마크업을 CSS에서 문서형으로 덮어쓴다
  - `section[id]` → 배경·테두리·그림자 제거, 위쪽 구분선만
  - 섹션 바로 아래 `div.bg-slate-50.rounded-2xl`(STEP 블록 등) → 왼쪽 선만 있는 들여쓰기 블록
  - `bg-slate-900` 어두운 강조 박스 → 밝은 강조 박스(`--brand-soft` + 왼쪽 선)
  - 그라디언트 정리 섹션 → 일반 섹션
  - 클릭 복사형 프롬프트 상자((12) 패턴) → 머리줄 + 본문의 코드 블록 형태
  - 본문 안 `shadow-*` 제거 (코드 블록 `pre`는 어두운 배경 유지)
  - 어두운 박스 안의 연한 강조 글씨(`text-sky/rose/emerald-200~400`)는 밝은 배경에서 읽히도록 진한 톤으로 자동 변경
- **가운데 정렬 문단 자동 보정**: 가운데 정렬(`text-center`) 문단이 3줄 이상이면 왼쪽 정렬로,
  2줄이면 두 줄 길이를 비슷하게 맞춘다 (`theme.js`의 `fixCenteredText`, 화면 폭·글자 크기가
  바뀔 때마다 다시 판단). 그래도 긴 문단은 처음부터 왼쪽 정렬로 쓰는 것이 좋다
- **다크 모드**: `html[data-theme="dark"]`에서 색상 토큰과 본문 Tailwind 색상 클래스
  (slate·indigo·sky·amber·emerald·rose·purple·blue·orange의 50/100 배경, 100/200 테두리,
  500~950 글씨)를 어두운 배경용으로 자동 변환한다. 새 페이지도 이 색 계열 안에서만 쓰면 따로
  손댈 필요가 없다. 로그인 게이트도 다크 모드에서는 어두운 카드로 바뀐다
- **메인 페이지와 이어지는 브랜드 요소**: 헤더 그라데이션 로고(`.brand-mark`), 보라→청록
  그라데이션 읽기 진행바, DAY 배지 스타일(`--grad`, `--badge-*` 토큰)
- 목차(`.doc-sidebar`)는 1024px 이상에서 화면 왼쪽에 고정(264px), 미만에서는 버튼으로 여는 서랍

## 2. 페이지 레이아웃 구조

```
<body>
  #authGate                   ← 로그인 게이트 (8절)
  a.skip-link                 ← "본문 바로가기" (키보드 사용자용)
  header.site-header          ← 한 줄짜리 고정 헤더 + 하단 읽기 진행바
  aside#sidebar.doc-sidebar   ← 학습 목차 (1024px↑ 왼쪽 고정, 미만은 서랍)
  div#tocBackdrop             ← 모바일에서 목차 서랍을 열었을 때 배경
  div#mainWrapper.doc-main
    ├─ main#mainContent.doc-content (최대폭 880px, 가운데 정렬)
    │    ├─ section.doc-hero       ← 제목 영역 (DAY · 태그 / 제목 / 소개)
    │    ├─ section#sec-xxx        ← 본문 섹션 (여러 개, 번호 순서대로)
    │    └─ nav#dayPager           ← 이전/다음 DAY (theme.js가 자동 생성)
    └─ footer.site-footer
  button#backToTop            ← 맨 위로 버튼 (600px 이상 스크롤 시 표시)
  div#toastNotification.toast ← 복사 완료 알림
```

새 DAY 페이지는 **기존 DAY 페이지 하나(예: `html/vibecoding/day03/index.html`)를 통째로
복사**해서 뼈대를 그대로 쓰고, 아래 표시한 값만 바꾼다.

### Header (한 줄)
```html
<header class="site-header">
  <div class="site-header__inner">
    [목차 버튼 #sidebarToggleBtn] [그라데이션 로고 a.brand-mark[title="메인으로"]] |
    <nav class="crumb">과목명 › [DAY NN / 08 ▾ 드롭다운 #dayMenu] › 강의 제목</nav>
    ... [다크 모드 버튼 #themeToggle] [글자 크기 버튼 → #fontMenu (작게/보통/크게)]
  </div>
  <div class="read-progress"><span id="readProgressBar"></span></div>
</header>
```
- 바꿀 값: `.crumb__subject`(과목명), `DAY NN`, `.menu__label`(과목명 강의 목록), `.crumb__title`(강의 제목)
- DAY 드롭다운 목록(`#dayMenuList`)은 `theme.js`가 `day-nav-config.js`로 자동으로 채운다
- 로고 링크(`.brand-mark`)의 `title="메인으로"`는 `auth.js`가 참조하므로 지우지 않는다
- **다크 모드 스위치**: `button#themeToggle.theme-switch[role="switch"]` — 해(왼쪽)·달(오른쪽)
  아이콘 트랙 위를 손잡이(`.theme-switch__knob`)가 미끄러지는 형태. 선택은 `lecture_theme`로
  저장되고, 저장값이 없으면 운영체제 설정을 따른다
- **다크 모드 선적용 스크립트**: `<head>`의 viewport 바로 아래에 저장된 테마를 먼저 적용하는 한 줄
  인라인 스크립트(`lecture_theme`)가 있어야 화면이 깜빡이지 않는다 — 기존 페이지를 복사하면 함께 따라옴
- 본문 검색창과 DAY 탭 줄은 없앴다 (검색은 브라우저 Ctrl+F로 충분하고, DAY 이동은 드롭다운과 하단 이전/다음 버튼으로)

### Sidebar (목차)
```html
<aside id="sidebar" class="doc-sidebar" aria-label="학습 목차">
  <div class="doc-sidebar__head"><span>학습 목차</span><span>16개 세션</span></div>
  <nav class="toc">
    <a href="#sec-overview" class="toc-link">1. 수업 구성</a>
    ...
  </nav>
</aside>
<div id="tocBackdrop" class="toc-backdrop"></div>
```
- `.toc-link`에는 Tailwind 클래스를 붙이지 않는다 (스타일·현재 위치 강조는 theme.css/js 담당)

### 제목 영역 (매 DAY 첫 섹션)
```html
<section class="doc-hero">
  <p class="doc-eyebrow"><span>DAY 03</span><span>바이브코딩 · 함께 따라하는 실습</span></p>
  <h1>강의 제목 (DAY 번호 없이)</h1>
  <p class="doc-lead">한두 문장 소개</p>
</section>
```
- 그라디언트 배너는 쓰지 않는다

### 콘텐츠 섹션 공통 헤더
```html
<section id="sec-xxx">
  <h2 class="doc-h2"><span class="doc-h2__num">1.</span><span>섹션 제목</span></h2>
  <!-- 본문 -->
</section>
```
- 번호 배지·영문 카테고리 라벨은 쓰지 않는다 — "번호. 제목" 한 줄로 표기
- 번호는 사이드바 목차 번호와 동일하게 맞춘다
- 섹션 `section`에는 클래스를 붙이지 않아도 된다 (구분선·여백은 theme.css가 담당)
- 한 섹션 안에서 STEP·소제목이 여러 개 이어지면 두 번째부터 `h3`에 `text-lg mt-16 pt-12 mb-4 border-t border-dashed border-slate-200`을
  주어 단계 사이를 넉넉히 띄운다 (섹션 사이 여백은 PC 80+72px, 휴대폰 56+48px)

### 하단 (main 끝 ~ body 끝)
```html
      <nav id="dayPager" class="day-pager" aria-label="이전·다음 강의"></nav>
    </main>
    <footer class="site-footer">
      <p>© 2026 박재윤. All rights reserved.</p>
      <p>본 강의자료의 무단 복제 및 배포를 금합니다.</p>
    </footer>
  </div>
  <button type="button" id="backToTop" class="back-to-top" aria-label="맨 위로"><i class="fa-solid fa-arrow-up"></i></button>
  <div id="toastNotification" class="toast" role="status" aria-live="polite">
    <i class="fa-solid fa-circle-check" aria-hidden="true"></i><span id="toastMsg"></span>
  </div>
```

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
너무 길어지지 않도록). 실제 예시: 바이브코딩 day01(11) · day02(13) · day03(16) · day04(17)
· day05(14) · day06(15) · day07(16) · day08(17), prompt-eng-2 day01v2(13) · day02(16) ·
day04(11) · day05(16) · day06(15) · day07(16) · day08(17), prompt-eng-1 day01(15) · day02(17).

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
- **어두운 배경 요약바(칩 없이 텍스트만 담는 칸)는 `minmax(170px,1fr)` 이상 + `gap-3` 이상,
  칩 하나당 `p-4` 이상의 패딩을 반드시 사용하기** — `minmax(120~140px)`나 `p-2.5`처럼 좁게 잡으면
  칸이 다닥다닥 붙어 밀도가 높아 보이고 답답함. 또한 칩 안 텍스트 줄 수가 항목마다 달라(1줄/2줄)
  세로 정렬이 흐트러지기 쉬우므로, 칩 자체에 `flex items-center justify-center min-h-[3.5rem]`을
  추가해서 텍스트가 항상 칩 정중앙에 오도록 만들기
```html
<div class="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 text-sm font-semibold text-indigo-100">
  <div class="p-4 bg-white/10 rounded-lg flex items-center justify-center text-center min-h-[3.5rem]">항목</div>
  <div class="p-4 bg-white rounded-lg flex items-center justify-center text-center text-indigo-900 font-bold min-h-[3.5rem]">마지막 강조 항목</div>
</div>
```

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
- "비유하자면:", "집에 비유하기" 등 강조 텍스트로 초보자 이해를 돕는 비유 삽입 (이모지 대신 필요하면 FontAwesome 아이콘)
- 예: Front-end=외모/표정, Back-end=두뇌, HTML=뼈대, CSS=옷, JavaScript=근육

### (11) 핵심 요약 강조 바 · "핵심 —" 문구 — 페이지당 2~3개까지만
- 섹션 끝에 `bg-slate-100 rounded-xl text-xs text-slate-700 text-center font-medium` 또는
  `bg-slate-900` 강조 박스(theme.css가 밝은 강조 박스로 바꿔 줌)로 그날 배운 핵심을 한 줄 요약
- `<p class="text-sm text-indigo-700 font-semibold text-center">핵심 — …</p>` 형태의 강조 문구는
  **한 페이지에 2~3개까지만** 쓴다. 모든 섹션 끝에 붙이면 강조 효과가 사라진다.
  그 밖의 안내는 `text-sm text-slate-600` 일반 문장으로 쓰고, 바로 위 설명을 되풀이하는 문장은 넣지 않는다

### (12) 클릭 복사형 프롬프트 상자 — 모든 실습 프롬프트에 필수 적용
수강생이 실제로 타이핑하거나 복사해서 쓰는 프롬프트(실습 프롬프트, STEP별 프롬프트,
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

### (12-1) 실습 주제 고르기 + 주제별 프롬프트 펼침 (여러 주제로 같은 과정을 따라할 때)
같은 실습 과정을 수강생이 여러 주제 중 하나를 골라 따라하게 할 때 사용한다. 딱딱한 업무 주제
하나(예: "기업교육 트렌드")만 주면 흥미가 떨어지므로, 과정은 같게 두고 **공감되는 주제 여러 개**를 준다.
실제 예시: `html/prompt-eng-2/day03`(NotebookLM) → `day04`(같은 주제를 Gemini Deep Research·Canvas로 이어서)
— 러닝 크루 · 대구 여행 · 카페 창업 · 수면 습관.
- **주제 카드**: `.topic-picker[role="radiogroup"]` 안에 `button.topic-card[data-topic="키"][role="radio"]`
  (`__icon`, `__title`, `__desc` 상황, `__goal` 결과물(선택)). 고르면 `html[data-topic]`이 바뀌고 선택이 저장됨
- **선택은 과목 단위로 저장**(`lecture_topic:<과목명>`)되므로, 한 DAY에서 고른 주제가 같은 과목의
  다음 DAY에도 자동으로 선택된다 — 여러 DAY에 걸쳐 같은 주제로 이어지는 실습을 만들 수 있다
- **프롬프트 자리**: `.topic-prompts` 안에 주제마다 `<details class="topic-prompt" data-topic="키">`,
  `<summary>`(아이콘·주제명) + `.topic-prompt__body`(기존 (12) 클릭 복사형 상자, id는 `promptNN-키`).
  고른 주제의 목록이 자동으로 펼쳐지고 "내 주제" 배지가 붙음, 다른 주제도 눌러 펼칠 수 있음
- **주제별 예시 문구**: `<span|div class="topic-text" data-topic="키">`를 주제 수만큼 나란히 두면
  고른 주제의 것만 보임 (Notebook 이름, 검색어, 분류 예시, 메모 예시 등)
- 주제 키는 현재 `run`/`trip`/`cafe`/`sleep` 네 개를 `theme.css`가 처리함 — 다른 키를 쓰면
  `theme.css`의 "고른 주제의 예시만 보이기" 규칙에 키를 추가할 것
- 주제별 프롬프트는 **구조(요청 형식·단계 수)는 똑같이** 두고 상황·대상·결과물만 주제에 맞게 바꾼다.
  건강 주제처럼 조심할 분야는 "의학적 판단이 필요한 부분은 전문가 상담이 필요하다고 표시해줘" 같은 문장을 넣는다

### (12-3) 바꿔 쓸 곳 표시 + 바꿔 보기 안내 — 복사만 하는 수업이 되지 않게
복사·붙여넣기만 반복하면 "이게 무슨 수업이지?"가 되기 쉽다. 프롬프트 안에서 **바꿔도 되는 곳**을 노란색으로
표시하고, 상자 바로 아래에 바꿔 볼 예시를 붙인다. 실제 예시: `html/prompt-eng-2/day02`.
```html
<p id="…" onclick="copyTextById('…')" …>투명한 유리병에 담긴 <mark class="edit-slot">고급 향수</mark> 제품 이미지를 만들어줘.</p>
<div class="edit-hint">
  <p class="edit-hint__title"><i class="fa-solid fa-pen" aria-hidden="true"></i> 바꿔 보기 — 처음 한 번은 그대로, 다음엔 내 제품으로</p>
  <p><b>제품</b> 고급 향수 → 수제 딸기잼 · 핸드크림 · 내가 파는 상품</p>
</div>
```
- `[제품 입력]` 같은 빈칸 대신 **예시 값을 채운 채 표시**한다 — 그대로 복사해도 동작해야 초보자가 막히지 않는다
- **표시하는 곳**: SET·STEP의 시작 프롬프트, 주제·분위기·숫자처럼 결과를 크게 바꾸는 자리.
  **표시하지 않는 곳**: "이어서 이렇게 고쳐줘" 같은 수정 요청(흐름을 배우는 부분이므로 그대로)
- 뒤 STEP 프롬프트에 특정 주제 단어(예: "향수")가 남아 있으면 "제품"처럼 일반 단어로 바꿔, 주제를 바꿔도 어색하지 않게 한다
- 첫 사용 섹션 소개 문장에 "노란색 표시는 바꿔 써도 되는 곳"이라고 한 번 안내한다
- SET 끝에는 필요하면 "내 버전으로 한 번 더 해보기" 상자(`bg-amber-50/70`, `fa-rotate`)를 둔다
- 스타일은 `theme.css`의 "바꿔 쓸 곳 표시" 블록(다크 모드 포함)

### (12-4) 작성 틀 + 예시 보기 — 수강생이 프롬프트를 직접 쓰게 할 때
완성된 프롬프트를 주면 복사만 하고 끝나기 쉽다. 프롬프트의 **구조 자체를 배우는 날**은 칸 이름과 안내만 있는
"작성 틀"을 복사 상자로 주고, 완성 예시는 접어 둔 뒤 막힐 때만 펼쳐 보게 한다. 실제 예시: `html/prompt-eng-2/day04`.
- **작성 틀**: 페이지에서 바로 고쳐 쓰는 입력칸(`.prompt-editor` + `textarea.prompt-editor__input`, id는 `tplNN`). `칸 이름: [무엇을 쓰는 칸인지 안내 — 예: …]` 형식으로 줄마다 한 칸.
  복사는 머리줄의 "복사하기" 버튼으로만 되고(상자 클릭 복사 없음), "처음으로"로 원래 틀 복구. `theme.js`의
  `initPromptEditors`가 높이 자동 조절·이 브라우저에 임시 저장(`lecture_draft:`)을 맡는다
- **예시 보기**: 틀 바로 아래 `<details class="mb-6 border border-dashed border-slate-300 rounded-xl bg-slate-50">`,
  summary는 `fa-regular fa-eye` + "막히면 예시 보기". summary 오른쪽 끝에는 펼칠 수 있다는 것이 보이도록
  버튼 모양(`ml-auto … bg-sky-600 text-white` "클릭해서 펼치기 ▾", 열리면 "접기 ▴" — details에 `group`, `group-open:` 사용)을 둔다. 예시는 **복사 버튼 없이** 보여준다(따라 쓰게).
  주제별 예시는 `.topic-text whitespace-pre-line`으로 둔다. 요청을 직접 쓰는 날은 주제 카드(`.topic-picker`)를 두지 않는다 —
  카드가 없어도 `theme.js`가 앞 DAY에서 고른 주제(`lecture_topic:<과목>`)의 예시만 보여주고, 없으면 첫 주제 예시를 보여준다
- 틀 다음에 **첨삭 체크**(빈칸이 남지 않았는가 / 목적과 관계없는 항목은 없는가 / 범위가 너무 넓지 않은가)를 붙여
  쓰고 나서 스스로 빼고 더하게 한다. 마지막 실습은 틀도 주지 않고 칸 이름만 보여주며 처음부터 쓰게 한다
- 이 방식을 쓰는 날은 제목 영역 바로 아래에 **수업 방식 경고 배너**(`bg-rose-600 text-white border-4 border-rose-300 rounded-2xl` — 과목 색(파랑 등)으로 하면 강조로 보이지 않음, 큰 글씨
  "복사해서 붙여넣기만 하면, 오늘 배운 것은 없습니다" + 구조 보기 → 직접 쓰기 → 빼고 더하기 → 결과 비교)를 둔다
- (12-3) 노란색 표시와 섞어 쓰지 않는다
- **간단 표기(권장)** — 머리줄·버튼·펼치기 버튼은 `theme.js`가 자동으로 만든다. 새 페이지는 이 형태로 쓴다
  (실제 예시: `html/prompt-eng-2/day01v2`~`day08`, DAY 04만 예전 전체 마크업):
  ```html
  <div class="prompt-editor" data-title="작성 틀 ① — 제목"><textarea id="tpl01" class="prompt-editor__input">
  칸 이름: [안내 — 예: …]</textarea></div>
  <div class="prompt-example" data-summary="막히면 예시 보기 — 완성된 예">완성된 예시 글 (줄바꿈 그대로 보임)</div>
  ```
  주제별 예시는 `.prompt-example` 안에 `<div class="topic-text" data-topic="run">…</div>`를 주제 수만큼 둔다
- AI 프롬프트 엔지니어링 2는 DAY 01~08 모두 이 방식이다(맨 위 경고 배너 포함). 다른 과목에 적용할 때도 같은 표기를 쓴다

### (12-2) 어느 도구에서 하는 단계인지 밝히기
여러 도구를 오가는 실습(예: Gemini에서 조사 항목 정리 → NotebookLM에서 자료 수집)은 단계마다
**어느 도구에서 입력하는지** 분명히 적는다. 프롬프트 라벨에 "— Gemini에 입력하기"를 붙이고,
헷갈리기 쉬운 곳에는 노란 안내 상자(`bg-amber-50 border-amber-200`, `fa-circle-info`)로
"이 단계는 NotebookLM이 아니라 Gemini에서 진행합니다"처럼 알려준다.

### (14) 본문 이미지 + 확대 보기
화면 캡처·예시 이미지는 아래처럼 넣는다. 이미지를 누르면 `theme.js`가 화면 가득 확대해 보여준다
(✕·배경 클릭·Esc로 닫힘). 이미지는 0절 "이미지 규칙"대로 줄인 JPG를 쓴다.
```html
<figure class="doc-figure">
  <a href="../../../img/파일.jpg" class="doc-figure__zoom" aria-label="크게 보기: 무엇의 이미지인지">
    <img src="../../../img/파일.jpg" alt="이미지 내용 설명" width="1400" height="1050" loading="lazy">
    <span class="doc-figure__hint"><i class="fa-solid fa-magnifying-glass-plus" aria-hidden="true"></i> 크게 보기</span>
  </a>
  <figcaption><strong>예시 1 · 제목</strong> 이 이미지에서 봐야 할 점 한두 문장</figcaption>
</figure>
```
- 여러 장은 `grid grid-cols-1 md:grid-cols-2 gap-6`(작은 예시) 또는 `space-y-6`(폭 전체) 안에 둔다
- 도구 사용법(설치, 버튼 위치 등)을 설명하는 단계에는 가능하면 화면 캡처를 넣는다 — 글로만 된 설명은
  초보자가 따라 하기 어렵다

### (15) 오늘 작업 저장하기 (Git) — 한 줄 체크
Git 저장 과정(Source Control → Stage → Commit → Push)은 **바이브코딩 DAY 02·03에서만 자세히**
설명한다(`day03`의 `#sec-git-save`). 그 이후 DAY는 흐름도를 반복하지 않고 한 줄 체크로 줄인다.
```html
<div class="flex items-start gap-3 p-4 mb-8 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
  <i class="fa-solid fa-floppy-disk text-indigo-500 mt-1"></i>
  <p><strong>오늘 작업 저장하기</strong> — □ Stage → Commit(메시지 예: "…") → Push까지 했나요?
    <span class="text-slate-500">방법이 기억나지 않으면 <a href="../day03/index.html#sec-git-save" class="text-indigo-600 underline underline-offset-2">DAY 03의 Git 저장 과정</a>을 참고하세요.</span></p>
</div>
```

### (16) 먼저 생각하고 펼쳐 보기 (판단 연습 문제)
"입력해도 될까?"처럼 수강생이 먼저 판단해 보는 연습 문제는 답을 바로 보여주지 않고 `<details>`로 접어 둔다.
실제 예시: `html/prompt-eng-1/day01` SET 01.
```html
<details class="group p-4 bg-white border border-slate-200 rounded-xl">
  <summary class="cursor-pointer text-sm text-slate-800 font-medium flex items-start gap-3">
    <span class="shrink-0 font-bold text-purple-600">상황 ①</span><span class="flex-1">문제 상황</span>
    <span class="shrink-0 text-xs text-purple-600 font-semibold">생각 정리 보기</span></summary>
  <p class="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-700"><strong class="text-emerald-700">판단</strong> — 이유</p>
</details>
```

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
- 지금 어느 교시인지 표시하고 싶으면 섹션 안 첫 줄에 작은 라벨로 `1교시` / `2교시`를 적는다
- 나란히 놓인 상자(예: "1교시 — … / 2교시 — …")는 글 길이가 달라 높이가 맞춰지므로, 한 줄짜리 글이 위로 붙지 않게 `flex items-center justify-center`를 함께 준다

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

### DAY 페이지 공통 (`js/theme.js`, 그대로 재사용)
- `setFontSize(size)`: 글자 크기 3단계 전환(루트 font-size) + `aria-pressed` 갱신 + localStorage 저장
- `toggleSidebar()`: 1024px 이상에서는 목차 접기/펼치기(`body.toc-collapsed`, 본문이 전체 폭 사용),
  미만에서는 서랍 열기/닫기(`body.toc-open`). 모바일에서 목차 항목을 누르면 서랍이 자동으로 닫힘
- 드롭다운(`data-menu="메뉴 id"` 버튼): DAY 선택·글자 크기 메뉴. 바깥 클릭·Esc로 닫힘
- `initDayNav()`: `js/day-nav-config.js`의 `window.DAY_NAV[과목명]`(`{ day, title, href }`)과
  `#authGate`의 `data-subject`/`data-day`로 **헤더 DAY 드롭다운(`#dayMenuList`)과 하단
  이전/다음 버튼(`#dayPager`)을 자동 생성**. **새 DAY 페이지를 추가하면 `day-nav-config.js`의
  해당 과목 배열에도 항목을 추가/갱신할 것** (`href`를 생략하면 "준비중" 비활성 표시)
- 읽기 진행바(`#readProgressBar`), 맨 위로 버튼(`#backToTop`), 목차 현재 위치 강조(`.toc-link.is-active`)
- `copyTextById(id)` / `copyToClipboard(text)`: 프롬프트 상자·복사 버튼 공용. Clipboard API 우선,
  실패 시 `execCommand('copy')` 폴백 + 토스트 알림(`showToast`). `role="button"` 프롬프트 상자는
  Enter/Space 키로도 복사됨. 프롬프트 상자의 앞뒤 빈 줄은 페이지 로드 시 자동으로 정리됨
- `toggleTheme()` / `applyTheme()` / `initTheme()`: 다크 모드 스위치. 선택 저장(`lecture_theme`),
  저장값이 없으면 운영체제 설정을 따르고 운영체제 설정이 바뀌면 함께 따라감
- `initTopics()` / `selectTopic()`: 실습 주제 카드((12-1)). 과목 단위로 선택 저장
- `initLightbox()`: `a.doc-figure__zoom` 이미지 확대 보기((14))
- `fixCenteredText()`: 가운데 정렬 문단의 줄 수를 보고 왼쪽 정렬 / 두 줄 균형을 자동 적용
- `initPromptEditors()` / `resetPromptEditor(id)`: 직접 고쳐 쓰는 작성 틀((12-4)). 높이 자동 조절, 입력 내용 임시 저장, 처음으로 되돌리기. `copyTextById`는 textarea면 입력된 값을 복사

### index.html(메인 허브) 전용 (`js/index.js` + 파일 안 `<script>`)
- `toggleSubject(id)`: 과목 행(`aria-controls="panel-{id}"`)을 누르면 `#panel-{id}`의 `hidden`을
  토글하고 `aria-expanded`를 갱신한다(화살표 회전·배경은 CSS가 `aria-expanded`로 처리).
  새 과목을 추가할 때는 `id="box-{slug}"`, `id="panel-{slug}"`, 버튼의 `aria-controls`를 맞춘다.
- 파일 안 `<script>`: 스크롤 시 헤더 배경, 스크롤 등장 애니메이션(`.reveal`, 스크립트가 동작할 때만
  숨김), 프롬프트 입력창 타이핑 효과, 신경망 캔버스 배경, 강사 소개 팝업·사진 확대 열고 닫기.
  움직임 줄이기 설정(`prefers-reduced-motion`)을 켠 사용자에게는 애니메이션을 멈춘다

## 6. 콘텐츠 톤앤매너

- **대상**: 코딩·웹·디자인 경험이 거의 없는 성인 초급자 (노안이 있는 분도 있으므로 글씨를 너무 작게 쓰지 않는다)
- **문체**: 목록·제목은 명사형 종결 "~하기" 통일 (예: "이해하기", "구성하기", "확인하기") — 설명체(다/입니다)는 정의 문장에서만 제한적으로 사용
- **수강생에게 말하는 말투**: 자료는 강의 계획서가 아니라 수강생이 읽는 교재다. "학생이 ~합니다",
  "학생마다 ~" 같은 강사 시점 문장을 쓰지 않고, "직접 ~해 보세요", "각자 ~", "프로젝트마다 ~"처럼 쓴다
- **쉬운 용어**: 웹·디자인 전문 용어는 쉬운 우리말로 바꾼다
  - 예: Must Have / Nice to Have → 꼭 필요한 기능 / 있으면 좋은 기능, 구현 → 만들기,
    Low-Fidelity → 회색 상자로 그린 간단한, Hero → 첫 화면, Navigation → 메뉴바, CTA → 행동 버튼,
    Form → 입력창, Color·Font·Animation → 색·글꼴·움직임 효과, Desktop·Mobile → PC·휴대폰
  - **예외 ① 그날 배우는 용어**: 수업 목표 자체가 용어를 익히는 것이면 유지하고 처음 나올 때 괄호로
    쉬운 설명을 붙인다 (예: 바이브코딩 DAY 05의 User Flow·Wireframe, DAY 06~08의 Header·Card·Grid·Hover 등).
    아직 배우기 전 날짜에 먼저 나오는 용어는 쉬운 말로 쓴다 (예: DAY 06에서는 Padding·Gap 대신 여백·간격)
  - **예외 ② 도구 화면의 버튼 이름**: Gemini·NotebookLM·Flow·CapCut 화면에 실제로 적힌 이름
    (Instructions, Knowledge, Split, Fade In 등)은 수강생이 찾아 눌러야 하므로 그대로 쓴다
  - 복사용 프롬프트도 같은 기준으로 쉬운 말로 쓴다 (AI는 쉬운 우리말도 충분히 알아듣는다)
- **비슷한 개념을 여러 개 가르치지 않기**: 초보자에게 차이가 작은 개념(예: User Flow와 Screen Flow)을 따로 가르치면 헷갈리기만 한다. 실제로 만들 때 필요한 것만 남기고 하나로 합친다 (바이브코딩 DAY 05는 "흐름(User Flow) → 화면 설계도(Wireframe)" 두 단계)
- **핵심목표는 항상 1문장**으로 명확하게 제시
- **실습 예시는 실제 프롬프트 문장을 그대로** 제시 (따옴표로 감싼 구체적 한국어 문장)
- **추상적 표현 지양**: "예쁘게 만들어줘" 같은 표현은 항상 X 예시로만 사용하고, 구체적 대안을 O 예시로 짝지어 보여주기
- **AI와 사람의 역할을 명확히 구분**해서 설명 (AI가 잘하는 일 / 사람이 판단해야 하는 일)
- **비유를 적극 활용**해서 기술 개념을 일상 개념으로 치환 설명
- **장식용 이모지(🎯 ✨ 👉 💡 🚀 💬 등)는 쓰지 않는다.** 강조가 필요하면 FontAwesome 아이콘 한 종류로
  통일한다 (✓ ✕ ↕ 같은 의미 있는 기호는 사용 가능)

## 7. 새 DAY 자료 제작 시 체크리스트

1. 원본 참고자료(txt/HTML)를 먼저 전부 읽고, 슬라이드 단위로 잘게 쪼개진 내용 중
   **같은 메시지를 반복하는 것들을 어떻게 묶을지** 판단한 뒤 섹션 구조(13~17개 목표)를
   정한다. 내용을 빼는 게 아니라 배치를 합리적으로 묶는 것이 원칙 — 사용자에게 병합/삭제
   계획을 먼저 말하고 확인받은 뒤 작업 시작 (단, 사용자가 "판단해서 알아서 하라"고 명시한
   경우는 확인 없이 진행)
2. 새 폴더 `html/<subject-slug>/dayNN/index.html` 생성 (0절 참고), 기존 파일을 교체하는
   경우 기존 파일은 지우지 말고 `dayNNv2` 등 새 경로를 만들어 index.html 링크만 교체
3. 기존 DAY 페이지 하나를 통째로 복사해서 뼈대(`<head>`, 한 줄 header, 목차 `.doc-sidebar`,
   `#mainWrapper.doc-main` 구조, `<body>` 바로 뒤의 **`#authGate` 로그인 게이트**, `#dayPager`·
   푸터·맨 위로·토스트, 하단 `<script>` 태그)를 그대로 재사용하고, 상대경로 깊이가 같은지 확인(`../../../`).
   `#authGate`의 `data-subject` 값을 해당 과목명(1절 표의 정확한 과목명)으로,
   `data-day` 값을 그 과목 내에서 몇 번째 DAY인지(1부터 시작하는 정수)로 맞춘다
   — 8절 참고
4. 헤더(과목명·`DAY NN`·강의 제목), 제목 영역(`.doc-hero`), 과목에 맞는 본문 accent 색상(1절 표)으로 교체
5. 사이드바 목차 개수와 링크를 실제 섹션 수에 맞게 갱신
6. 섹션 순서는 "수업 구성 → 오늘 배우는 내용&전체 흐름 → (지난 시간 복습) → 본문/실습
   섹션들 → 정리&다음 수업" 패턴 유지
7. 각 섹션은 3절의 UI 패턴(정의 박스/플로우 다이어그램/번호 칩 그리드/비교 카드/O·X
   비교/주의 박스/표/코드블록/칩/카드그리드/비유박스/요약바/**클릭 복사형 프롬프트
   상자**/주제 고르기/본문 이미지/교시 구분선) 중 내용에 맞는 것을 조합
8. 색상 의미 체계(4절)를 벗어나지 않게 사용, 과목 accent 색상을 페이지 전체에서 통일
9. 문체와 톤(6절)을 전체 문서에서 일관되게 유지
10. **8단계 이상의 긴 흐름은 반드시 (2-1) 번호 칩 그리드(auto-fit) 사용** — 세로 화살표
    스택이나 고정 열 그리드(`lg:grid-cols-4` 등)로 만들지 않기. 항목 텍스트가 카드 폭에
    비해 길어서 단어 중간에 어색하게 줄바꿈되지 않는지 반드시 확인하기
11. **수강생이 직접 입력/복사할 모든 프롬프트에 (12) 클릭 복사형 상자 패턴 적용** —
    힌트 문구 + `onclick` + hover/active 스타일 빠짐없이 넣기
12. 완성 후 `grep -c "<div"` / `"</div>"`, `<section` / `</section>` 개수가 일치하는지
    반드시 확인 (Bash로 빠르게 검증 가능)
13. `index.html`의 해당 과목 `.day-list`에 새 `.day-link` 행을 추가하고 `.subject-meta`의
    강의 개수 갱신
14. `#authGate`가 이 페이지에도 들어갔는지, `data-subject`가 정확한 과목명인지,
    `data-day`가 그 과목 안에서의 순번인지, `auth-config.js`/`auth.js` 스크립트
    태그가 `theme.js` 다음 줄에 있는지 확인
15. `js/day-nav-config.js`의 해당 과목 배열에 이 DAY 항목을 추가(또는 기존
    "준비중" 항목을 실제 `href`로 교체)하고, `day-nav-config.js` 스크립트 태그가
    `theme.js` 앞줄에 있는지 확인 — 이게 빠지면 헤더 DAY 드롭다운과 이전/다음 버튼이 안 뜸
16. 장식용 이모지가 없는지, 섹션 제목이 `doc-h2` 한 줄 형식인지 확인
17. **쉬운 용어·수강생 말투**(6절)인지 확인 — "학생이 ~합니다" 문장, 설명 없는 영어 전문 용어가 없는지
18. "핵심 —" 강조 문구가 페이지에 2~3개 이하인지 확인
19. 이미지는 줄인 JPG를 `img/`에 두고 (14) 형식으로 넣었는지, `alt`와 캡션이 있는지 확인
20. 바이브코딩 DAY 04 이후라면 Git 저장은 (15) 한 줄 체크로 넣었는지 확인
21. 라이트·다크 모드와 모바일(390px 폭)에서 글씨가 잘 보이고 가로로 넘치지 않는지 확인

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
- `</body>` 직전, `theme.js` 다음 줄: `auth-config.js` → `auth.js` 순서로 로드
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
- `css/theme.css`의 "수강생 접근 제어" 블록이 오버레이 스타일과 `html.gate-locked`
  스크롤 잠금을 담당 (한 곳만 수정하면 전 페이지 반영)

**명단(구글 시트) 관리**
- **과목별 시트(권장)**: 과목마다 탭을 따로 만들고 헤더를 `이름, 등록일(YYYY-MM-DD)`로 둔다.
  각 탭을 웹에 게시(CSV)한 URL을 `js/auth-config.js`의 `AUTH_SUBJECT_SHEETS["과목명"]`에
  붙여넣는다. 이름만 맞으면 통과한다(`이름, 과목, 등록일` 3칸 형식도 인식)
- **공용 시트**: `AUTH_SUBJECT_SHEETS`에서 칸이 비어 있는 과목은 `AUTH_SHEET_CSV_URL`
  공용 시트로 확인한다. 헤더는 `이름, 과목, 등록일(YYYY-MM-DD)`이고, 한 사람이 여러 과목을
  들으면 과목마다 한 행씩 추가한다 (양식 예시: `참고자료/수강생명단_양식.csv`)
- 새 과목을 만들면 `AUTH_SUBJECT_SHEETS`에 `"과목명": ""` 줄을 추가한다
- 과목명은 반드시 `data-subject` 값과 완전히 동일해야 매칭됨 (1절 accent 색상 표의
  과목명과 통일해서 사용)
- 구글 시트에서 `파일 → 공유 → 웹에 게시 → (탭 선택) → CSV` 로 얻은 URL을 `js/auth-config.js`의
  해당 과목 칸(또는 공용 시트 `AUTH_SHEET_CSV_URL`)에 붙여넣기

**관리자/테스트용 별도 시트(선택)**
- 같은 문서 안에 "관리자" 같은 별도 탭을 추가하고 그 탭만 따로 웹에 게시(CSV)해서
  얻은 URL을 `js/auth-config.js`의 `AUTH_ADMIN_SHEET_CSV_URL`에 넣으면, 로그인 시
  명단 시트와 이 시트를 함께 검사한다 (형식은 명단 시트와 동일: 이름/과목/등록일)
- 실제 수강생 명단과 분리해서 관리자·강사·테스트 계정을 넣을 때 사용. 회차 오픈/만료
  판정 로직은 명단 시트와 완전히 동일하게 적용되므로, 계속 접근하려면 등록일을
  주기적으로 갱신해야 함
- 사용하지 않으면 `AUTH_ADMIN_SHEET_CSV_URL`을 placeholder 상태로 두면 자동 무시됨
- **한계**: 정적 사이트라 서버 검증이 없으므로, 브라우저 개발자도구로 시트 내용이나
  로그인 우회를 시도하면 완벽히 막을 수는 없음 — "링크 유출/다른 과목 무단 열람"을
  막는 실용적 수준의 게이트이며, `fetch`가 필요하므로 **file://로는 동작하지 않고
  실제 웹서버(https)에 배포된 상태에서만 정상 동작**함
