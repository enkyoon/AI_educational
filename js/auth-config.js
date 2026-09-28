/* =========================================================
   수강생 접근 제어 설정
   구글 시트 탭을 "파일 → 공유 → 웹에 게시 → (해당 탭) → CSV"로 게시한 뒤
   나온 주소를 아래 따옴표 안에 붙여넣으세요.
   ========================================================= */

/* 과목별 명단 시트
   - 과목마다 시트(탭)를 따로 만들고, 게시한 CSV 주소를 해당 과목 칸에 붙여넣으세요.
   - 시트 구조: 1행은 헤더, 이후 각 행은 [이름, 등록일(YYYY-MM-DD)]
     (기존처럼 [이름, 과목, 등록일] 3칸이어도 그대로 인식됩니다)
   - 칸을 비워두면("") 그 과목은 아래 공용 명단 시트로 확인합니다.
   - 왼쪽 과목 이름은 페이지의 data-subject 값과 정확히 같아야 하므로 바꾸지 마세요. */
window.AUTH_SUBJECT_SHEETS = {
  "바이브코딩": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=648369369&single=true&output=csv",
  "AI 프롬프트 엔지니어링 1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=1091687436&single=true&output=csv",
  "AI 프롬프트 엔지니어링 2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=326212015&single=true&output=csv",
  "AI 에이전트": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=504218624&single=true&output=csv"
};

/* 공용 명단 시트 (과목별 시트가 비어 있는 과목에서만 사용)
   시트 구조: 1행은 헤더, 이후 각 행은 [이름, 과목, 등록일(YYYY-MM-DD)]
   - 한 사람이 여러 과목을 듣는 경우, 과목마다 한 행씩 추가하세요.
   - 모든 과목을 과목별 시트로 옮겼다면 비워둬도 됩니다. */
// window.AUTH_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=974626258&single=true&output=csv";

/* 등록일로부터 접속을 허용할 전체 기간(일) — 이 날짜가 지나면 캐시가 있어도 다시 막힘 */
window.AUTH_ACCESS_DAYS = 28;

/* 회차(DAY)가 몇 일 간격으로 열리는지, 한 번에 며칠씩 열리는지
   예) 2일씩 / 7일 간격 = "1주일마다 2회차씩 오픈"
   각 DAY 페이지의 #authGate data-day 값(1부터 시작하는 회차 번호)을 기준으로
   openDate = 등록일 + (ceil(day / AUTH_DAYS_PER_UNLOCK) - 1) * AUTH_UNLOCK_INTERVAL_DAYS 로 계산 */
window.AUTH_DAYS_PER_UNLOCK = 2;
window.AUTH_UNLOCK_INTERVAL_DAYS = 7;

/* (선택) 관리자/테스트 계정용 별도 시트.
   같은 구글 문서 안에 "관리자" 탭을 추가하고 그 탭만 따로 "웹에 게시(CSV)"해서
   나온 주소를 넣으면, 로그인 시 명단 시트와 이 시트를 함께 검사한다.
   형식은 명단 시트와 동일: 이름, 과목, 등록일(YYYY-MM-DD)
   사용하지 않으면 비워둬도 됨(placeholder 상태면 자동으로 무시됨). */
window.AUTH_ADMIN_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?gid=1215229396&single=true&output=csv";
