/**
 * 러닝트래블 해외캠프 상담 접수 GAS (시트 내장형)
 *
 * 설치: 시트 메뉴 → 확장 프로그램 → Apps Script → 전체 붙여넣기 →
 *      배포 → 배포 관리 → 연필 아이콘 → 버전: 새 버전 → 배포 (URL 유지)
 *      ★ '새 버전'으로 배포하지 않으면 코드를 고쳐도 /exec는 옛날 코드를 계속 실행합니다.
 *
 * 2026-08-20 개정 — 메일 알림이 조용히 실패하던 문제 대응
 *  1) 메일 실패 사유를 시트 마지막 열(메일알림)에 기록
 *  2) 이름·연락처 없는 호출(봇/크롤러)은 무시 — 빈 행·빈 메일로 할당량(계정당 100통) 태우는 것 방지
 *  3) 남은 메일 할당량 함께 기록
 *  4) 메일 제목 [에듀저니] → [러닝트래블] (2026-08-12 리브랜딩 반영 — 재배포 필요)
 *
 * 2026-08-21 개정 — 시트 기록 방식을 '열 순서'에서 '헤더 이름'으로 변경
 *  시트 1행의 이름을 읽어 그 칸에 넣습니다. 열을 지우거나 순서를 바꿔도 값이 밀리지 않고,
 *  시트에 없는 항목은 헤더를 새로 만들어 뒤에 붙입니다. 열 작업 전후로 순서를 맞출 필요 없음.
 *  '연락희망시간'은 폼에서 뺐으므로 더 이상 보내지 않습니다 — 시트의 그 열은 지우셔도 됩니다.
 */
var HEADERS = ["접수시각", "이름", "연락처", "학년", "관심캠프", "문의내용", "유입페이지", "유입페이지제목", "유입경로", "메일알림"];
var ALERT_TO = "zskykr@naver.com";

// ── 시트 기록: 1행(헤더)을 읽어 그 이름에 맞는 칸에 넣는다 ─────────────────
// 열을 지우거나 순서를 바꿔도 값이 밀리지 않는다. 시트에 자리가 없는 항목은
// 헤더를 새로 만들어 맨 뒤에 붙인다 (값을 잃지 않기 위해).
var 열별칭 = { "문의과정": ["관심과정", "과정"], "문의지역": ["지역"], "소속": ["소속직급"] };
function 시트에기록(sh, 값) {
  var headers = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  var 남은 = {};
  Object.keys(값).forEach(function (k) { 남은[k] = true; });
  var out = [];
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i], hit = "";
    if (값.hasOwnProperty(h)) hit = h;
    else Object.keys(열별칭).forEach(function (k) {
      if (!hit && 열별칭[k].indexOf(h) > -1 && 값.hasOwnProperty(k)) hit = k;
    });
    out.push(hit ? 값[hit] : "");
    if (hit) delete 남은[hit];
  }
  Object.keys(남은).forEach(function (k) {
    headers.push(k);
    sh.getRange(1, headers.length).setValue(k);
    out.push(값[k]);
  });
  sh.appendRow(out);
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var name = (p["이름"] || "").trim();
  var tel = (p["연락처"] || "").trim();
  // 봇/크롤러가 파라미터 없이 이 URL을 호출하는 경우 — 기록도 메일도 하지 않는다
  if (!name && !tel) return ContentService.createTextOutput("OK");

  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS); // 헤더 자동 생성

  var quota = -1, mailNote = "";
  try { quota = MailApp.getRemainingDailyQuota(); } catch (err) { quota = -1; }
  try {
    if (quota === 0) throw new Error("일일 메일 할당량 소진(계정 공통 100통)");
    MailApp.sendEmail(
      ALERT_TO,
      "[러닝트래블] 새 상담 접수: " + (name || "무명") + " (" + (p["관심캠프"] || "캠프 미선택") + ")",
      "이름: " + name + "\n연락처: " + tel +
      "\n학년: " + (p["학년"] || "") + "\n관심캠프: " + (p["관심캠프"] || "") +
      "\n\n문의내용:\n" + (p["문의내용"] || "") + "\n\n유입: " + (p["유입페이지"] || "")
    );
    mailNote = "메일 발송 (남은 할당량 " + (quota > 0 ? quota - 1 : "?") + ")";
  } catch (err) {
    mailNote = "메일 실패: " + (err && err.message ? err.message : err) + " (남은 할당량 " + quota + ")";
  }

  시트에기록(sh, {
    "접수시각": Utilities.formatDate(new Date(), "Asia/Seoul", "M/d HH:mm"),
    "이름": name,
    "연락처": tel,
    "학년": p["학년"] || "",
    "관심캠프": p["관심캠프"] || "",
    "문의내용": p["문의내용"] || "",
    "유입페이지": p["유입페이지"] || "",
    "유입페이지제목": p["유입페이지제목"] || "",
    "유입경로": p["유입경로"] || "",
    "메일알림": mailNote,
  });
  return ContentService.createTextOutput("OK");
}

/**
 * 메일 알림 진단 — Apps Script 편집기에서 이 함수를 선택하고 ▶실행 후 '실행 로그' 확인.
 * 시트에는 아무것도 쓰지 않는다.
 */
function 진단() {
  var q = MailApp.getRemainingDailyQuota();
  Logger.log("오늘 남은 메일 할당량: " + q + " 통 (0이면 이게 원인)");
  Logger.log("스크립트 실행 계정: " + Session.getEffectiveUser().getEmail());
  if (q > 0) {
    MailApp.sendEmail(ALERT_TO, "[러닝트래블] 알림 테스트", "이 메일이 보이면 GAS 메일 발송 자체는 정상입니다.\n안 보이면 네이버 스팸함을 확인하세요.");
    Logger.log("테스트 메일을 " + ALERT_TO + " 로 보냈습니다. 받은편지함과 스팸함을 모두 확인하세요.");
  }
}
