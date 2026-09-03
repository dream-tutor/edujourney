// ------------------------------------------------------------
// 캠프·유학 페이지 사진 — 캠프 안내서 PDF에서 추출 (docs/img/camp/)
//   얼굴이 식별되는 사진·브랜드 현수막이 찍힌 사진은 제외(사용자 지시 2026-09-02). 페이지당 1~2장만.
//   key = CAMPS/STUDY slug
// ------------------------------------------------------------
const P = (src, alt, cap) => ({ src, alt, cap });
const SITE_PHOTOS = {
  "canada-3week": [
    P("canada-arena.jpg", "아이스하키 경기장 관중석에서 본 경기", "아이스하키 경기 관람 — 주말 체험 활동"),
    P("canada-aquarium.jpg", "대형 수족관 앞에 선 학생들 뒷모습", "토론토 수족관 견학"),
  ],
  "canada-7week": [
    P("canada-hockey.jpg", "아이스하키 경기 장면", "아이스하키 경기 관람"),
    P("canada-skating.jpg", "야간 야외 스케이트장", "야외 스케이트장 — 저녁 체험 활동"),
  ],
  "malaysia": [
    P("malaysia-raffles.jpg", "래플즈 대학교 메디니 캠퍼스 건물 외관", "래플즈 대학교 메디니 캠퍼스"),
  ],
  "philippines": [
    P("philippines-spcf.jpg", "SPCF 대학교 본관 건물", "SPCF 대학교 캠퍼스"),
    P("philippines-pool.jpg", "대학 내 실외 수영장", "교내 수영장 — 방과 후 활동"),
  ],
  "study-newzealand": [
    P("nz-waiuku.jpg", "와이우쿠 컬리지 캠퍼스 항공 사진", "와이우쿠 컬리지 캠퍼스 전경"),
  ],
};
module.exports = { SITE_PHOTOS };
