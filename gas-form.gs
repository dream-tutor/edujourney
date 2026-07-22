/**
 * 에듀저니 해외캠프 상담 접수 GAS (간편판)
 *
 * ★ 이 버전은 시트 안에서 만드는 방식이라 SHEET_ID가 필요 없습니다.
 *   시트 메뉴 → 확장 프로그램 → Apps Script → 전체 붙여넣기 → 배포(웹 앱, 모든 사용자)
 *   헤더(1행)도 첫 접수 때 자동으로 만들어집니다.
 */
var HEADERS = ["접수시각", "이름", "연락처", "학년", "관심캠프", "연락희망시간", "문의내용", "유입페이지", "유입페이지제목", "유입경로"];

function doGet(e) {
  var p = (e && e.parameter) || {};
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS); // 헤더 자동 생성
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
