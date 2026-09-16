# 바이브코딩 강의자료 제작 스킬

`참고자료/바이브코딩_01일차.html`, `참고자료/바이브코딩_02일차.html`을 분석해서 정리한
디자인 스타일 및 콘텐츠 톤앤매너 가이드입니다. 새로운 DAY 강의자료(HTML)를 만들 때
아래 규칙을 그대로 따릅니다.

## 1. 기술 스택 & 문서 기본 골격

- `<html lang="ko" class="scroll-smooth font-md">`
- Tailwind CSS는 CDN(`<script src="https://cdn.tailwindcss.com"></script>`)으로 로드, 별도 빌드 없음
- 폰트: Google Fonts `Pretendard`(본문), `JetBrains Mono`(코드/mono)
  - `preconnect` 2개 + `family=Pretendard:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600`
- 아이콘: FontAwesome 6.4.0 (`fa-solid`, `fa-regular` 사용)
- `tailwind.config`에 `fontFamily.sans/mono`와 `colors.brand`(인디고 스케일 50~900) 커스텀 등록
- `<body class="bg-slate-50 text-slate-800 antialiased font-sans">`

### 공통 `<style>` 블록 (그대로 재사용)
- 커스텀 스크롤바 (`::-webkit-scrollbar` 계열)
- 글자 크기 3단계: `html.font-sm` 15px / `html.font-md` 18px(기본) / `html.font-lg` 21px
- `.step-container`: 반응형 고정폭 컨테이너
  - 1600px~ → max-width 1440px
  - 1280~1599px → 1200px
  - 1024~1279px → 960px
  - 768~1023px → 720px
  - ~767px → 100% + 좌우 패딩 1rem
- `#sidebar`는 1024px 이상에서 width/min/max 280px 고정, `top: 84px` 고정 (글자 크기 변경 시 사이드바 크기 변동 방지)
- `#sidebar .toc-link`는 font-size 13.5px 고정

## 2. 페이지 레이아웃 구조

```
header (sticky, 상단 고정)
  ├─ DAY XX 배지 + 강의 제목
  └─ 글자크기 조절 / 검색창 / 목차 접기 버튼

.step-container (본문 wrapper)
  └─ flex (lg 이상 가로배치, 이하 세로배치)
       ├─ aside#sidebar (목차, sticky, 접기/펼치기 가능)
       └─ main#mainContent
            ├─ 상단 배너 섹션 (그라디언트, DAY 타이틀 + 한줄 소개)
            └─ section#sec-xxx (여러 개, 번호 순서대로)
```

### Header
- 좌측: `DAY 0X` 인디고 배지 + `<h1>` 강의 제목(truncate)
- 우측 컨트롤 3종(모두 동일 위치/순서 유지):
  1. 글자크기 스위처(작게/보통/크게) — `setFontSize('sm'|'md'|'lg')`
  2. 검색 입력창(`#searchInput`, `onkeyup="searchInPage()"`) — sm 이상에서만 노출
  3. 목차 접기/펼치기 버튼(`#sidebarToggleBtn`) — `toggleSidebar()`

### Sidebar (목차)
- 상단: "학습 목차" 라벨 + 세션 개수 배지 + 접기 버튼
- `<nav>` 안에 각 섹션 앵커(`#sec-xxx`) 링크 나열, hover 시 인디고 배경
- 하단: 안내 문구 박스 (예: 저작권 안내 또는 "원문 100% 반영" 등 자료 성격에 맞는 문구)

### 상단 배너 섹션 (매 DAY 첫 섹션)
```html
<section class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
  <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="relative z-10">
    <span class="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-300/30 text-indigo-200 text-xs font-semibold rounded-full mb-4">태그</span>
    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">DAY 0X. 강의 제목</h1>
    <p class="mt-3 text-indigo-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">한 줄 소개 문장</p>
  </div>
</section>
```

### 콘텐츠 섹션 공통 헤더
```html
<section id="sec-xxx" class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm transition-all hover:border-indigo-200">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">01</div>
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
  Version Control)

### 매 DAY 구성 순서 (권장 템플릿)
1. 수업 구성 (난이도 / 수업방식 / 핵심목표 3열 카드)
2. 이번 수업에서 무엇을 배우는가 (오늘 집중할 내용 vs 하지 않는 것, 전체 흐름)
3. 본문 핵심 개념 섹션들 (주제별로 3~9개)
4. 실습 섹션 (`#sec-practice`)
5. 오늘 내용 정리 & 다음 수업 예고 (`#sec-summary`)

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

## 5. JavaScript 기능 (모든 DAY 공통, 그대로 재사용)

- `setFontSize(size)`: 글자 크기 3단계 전환 + 버튼 active 스타일 갱신
- `toggleSidebar()`: 목차 사이드바 표시/숨김 + 버튼 라벨·색상 전환
- `searchInPage()`: `#searchInput` 값으로 `#mainContent > section` 텍스트를 필터링해 보이기/숨기기
- `copyTextById(id)` / `copyToClipboard(text)`: 프롬프트 예시 복사 버튼용, `document.execCommand('copy')` 폴백 + 토스트 알림(`showToast`)

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

1. 참고자료 2개 파일을 복사해서 뼈대(`<head>`, header, sidebar 구조, JS)를 그대로 재사용
2. `DAY 0X`, 제목, 상단 배너 태그/소개 문장만 교체
3. 사이드바 목차 개수와 링크를 실제 섹션 수에 맞게 갱신
4. 섹션 순서는 "수업 구성 → 학습 흐름 → 본문 개념(3~9개) → 실습 → 정리" 패턴 유지
5. 각 섹션은 위 2절의 UI 패턴(정의 박스/플로우 다이어그램/비교 카드/O·X 비교/주의 박스/표/코드블록/칩/카드그리드/비유박스/요약바) 중 내용에 맞는 것을 조합
6. 색상 의미 체계(4절)를 벗어나지 않게 사용
7. 문체와 톤(6절)을 전체 문서에서 일관되게 유지
8. **8단계 이상의 긴 흐름은 반드시 (2-1) 번호 칩 그리드(auto-fit) 사용** — 세로 화살표 스택이나
   고정 열 그리드(`lg:grid-cols-4` 등)로 만들지 않기. 항목 텍스트가 카드 폭에 비해 길어서
   단어 중간에 어색하게 줄바꿈되지 않는지 반드시 확인하기
