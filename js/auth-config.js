/* =========================================================
   수강생 접근 제어 설정
   구글 시트를 "웹에 게시"(CSV) 한 뒤 그 주소를 아래에 넣으세요.
   시트 구조: 1행은 헤더, 이후 각 행은 [이름, 과목, 등록일(YYYY-MM-DD)]
   - 과목 이름은 페이지의 data-subject 값과 정확히 같아야 합니다.
     예) 바이브코딩 / AI 프롬프트 엔지니어링 2
   - 한 사람이 여러 과목을 듣는 경우, 과목마다 한 행씩 추가하세요.
   ========================================================= */
window.AUTH_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVkHGZ5C1THcC_3jFk9GYgaoZHzLn70f5evEprA1l4_lTt52FnEgRKh_-wvB3o1E0Xt0bIuXmSZkWt/pub?output=csv";

/* 등록일로부터 접속을 허용할 기간(일) */
window.AUTH_ACCESS_DAYS = 28;
