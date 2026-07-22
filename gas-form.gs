/**
 * 에듀저니 해외캠프 상담 접수 GAS
 *
 * 설치:
 * 1. 새 구글 시트 → 1행 헤더:
 *    접수시각 | 이름 | 연락처 | 학년 | 관심캠프 | 연락희망시간 | 문의내용 | 유입페이지 | 유입페이지제목 | 유입경로
 * 2. 아래 SHEET_ID에 시트 ID 또는 전체 URL 붙여넣기
 * 3. script.google.com 새 프로젝트에 이 코드 붙여넣기 → 배포 → 웹 앱
 *    (실행: 나 / 액세스: "모든 사용자" ← 반드시!)
 * 4. /exec URL을 site/data.js FORM_ENDPOINT에 넣고 node build.js 재실행
 * ※ 코드 수정 시: 배포 관리 → 연필 → 새 버전으로 배포 (URL 유지)
 */
var SHEET_ID = "여기에_시트_ID_또는_URL_붙여넣기";

function doGet(e) {
  var p = (e && e.parameter) || {};
  var id = (SHEET_ID.match(/[-\w]{25,}/) || [SHEET_ID])[0];
  var sh = SpreadsheetApp.openById(id).getSheets()[0];
  sh.appendRow([
    Utilities.formatDate(new Date(), "Asia/Seoul", "M/d HH:mm"),
    p["이름"] || "",
    p["연락처"] || "",
    p["학년"] || "",
    p["관심캠프"] || "",
    p["연락희망시간"] || "",
    p["문의내용"] || "",
    p["유입페이지"] || "",
    p["유입페이지제목"] || "",
    p["유입경로"] || "",
  ]);
  return ContentService.createTextOutput("ok");
}
