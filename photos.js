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
    P("canada-school-snow.jpg", "담쟁이로 덮인 캐나다 학교 건물 겨울 외관", "캐나다 캠프 현지 학교 (자료 사진)"),
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
  // 2026-09-05 운영사 홈페이지 자료에서 얼굴 없는 부분만 잘라 사용 (홈페이지자료(이미지) 폴더)
  "newzealand": [
    P("nz-hobbiton-sign.jpg", "호비튼 무비셋 입구 안내판", "호비튼 영화마을 — 주말 투어"),
  ],
  "japan": [
    P("japan-dotonbori.jpg", "오사카 도톤보리 글리코 간판", "주말 오사카 투어 — 도톤보리"),
  ],
  "exchange-usa": [
    P("usa-flag.jpg", "미국 국기가 걸린 학교 건물", "미국 공립 고등학교"),
  ],
  "ef-academy": [
    P("ef-campus.jpg", "잔디밭이 있는 기숙학교 캠퍼스 건물", "기숙학교 캠퍼스"),
  ],
  "stpaul-clark": [
    P("stpaul-clark-building.jpg", "세인트폴 아메리칸 스쿨 클락 정문 건물", "세인트폴 아메리칸 스쿨 클락"),
  ],
  "college-consulting": [
    P("graduation-caps.jpg", "졸업식에서 하늘로 던진 학사모", "대학 졸업"),
  ],
  "about": [
    P("globe-network.jpg", "네트워크 선으로 연결된 지구본", "각 나라 교육청·학교와 직접 제휴"),
    P("consulting-desk.jpg", "책상에서 메모하며 상담하는 모습", "1:1 상담"),
    P("university-building.jpg", "석조 대학 건물 외관", "성적별 입학 가능 대학 안내"),
  ],
};
module.exports = { SITE_PHOTOS };
