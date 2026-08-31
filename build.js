// ============================================================
// 러닝트래블 해외캠프 사이트 생성기 — 실행: node build.js → docs/
// ============================================================
const fs = require("fs");
const path = require("path");
const { BASE_URL, SEASON_LABEL, FORM_ENDPOINT, CAMPS, COMMON, GRADES, AGE_GROUPS, COUNTRIES, STUDY, STPAUL, ELC, SCHEDULES, CAMP_FAQ } = require("./data.js");
const { STPAUL_DETAIL, STUDY_INFO, STUDY_GRADES } = require("./study-data.js");
const CAMP_COUNT = Object.keys(CAMPS).length;
const GUIDES = [...require("./guides.js"), ...require("./guides2.js"), ...require("./guides3.js")];
const STUDY_GUIDES = require("./guides-study.js");
const ALL_GUIDES = [...GUIDES, ...STUDY_GUIDES];

const OUT = path.join(__dirname, "docs");
fs.mkdirSync(OUT, { recursive: true });
const CSS_VER = Date.now().toString(36);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ------------------------------------------------------------
// 레이아웃
// ------------------------------------------------------------
function page({ file, title, desc, body, hero = "", jsonld = null }) {
  const url = `${BASE_URL}/${file === "index.html" ? "" : file}`;
  return {
    file,
    html: `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE_URL}/og-image.png?v=3">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="google-site-verification" content="Og-iGasiwVbAcetzn0H82vPY5damjOoCzdJTnbObbFE">
<meta name="naver-site-verification" content="38c50e5aa8a59faf08ed852ccf456adc9a5f00e8">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2316324f'/%3E%3Cpath d='M14 40 L32 18 L50 40' stroke='%23e8734a' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='32' cy='46' r='4' fill='%232f7bd0'/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="stylesheet" href="style.css?v=${CSS_VER}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html"><span class="brand-word">러닝<em>트래블</em></span></a>
    <nav class="nav">
      <a href="index.html#camps">캠프 안내</a>
      <a href="compare.html">캠프 비교</a>
      <a href="study.html">유학</a>
      <a href="stpaul.html">세인트폴 대치</a>
      <a href="elc.html">대학 토플면제</a>
      <a href="about.html">운영·안전</a>
      <a href="guide.html">가이드</a>
      <a href="faq.html">자주 묻는 질문</a>
      <a class="nav-cta" href="#consult">상담 신청</a>
      <details class="mnav">
        <summary aria-label="메뉴 열기">☰</summary>
        <div class="mnav-list">
          <a href="index.html#camps">캠프 안내</a>
          <a href="compare.html">캠프 비교</a>
          <a href="study.html">유학 안내</a>
          <a href="stpaul.html">세인트폴 대치 아카데미</a>
          <a href="elc.html">미국·캐나다 대학 토플면제교육원</a>
          <a href="about.html">운영·안전</a>
          <a href="guide.html">캠프 가이드</a>
          <a href="study-guide.html">유학 가이드</a>
          <a href="faq.html">자주 묻는 질문</a>
          <a href="#consult">상담 신청</a>
        </div>
      </details>
    </nav>
  </div>
</header>
${hero}
<main>
${body}
</main>
${footer()}
<a class="float-cta" href="#consult">상담 신청</a>
<script defer src="https://xn--vb0by3y5wigqb.com/t.js" data-site="edujourney"></script>
<script>
(function(){
  var fc = document.querySelector('.float-cta');
  var consult = document.getElementById('consult');
  if(!fc || !consult || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function(en){ fc.classList.toggle('hide', en[0].isIntersecting); }).observe(consult);
})();
(function(){
  function isFormEl(t){ return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT'); }
  document.addEventListener('keydown', function(e){
    if(e.key === 'F12' ||
       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
       (e.ctrlKey && (e.key === 'u' || e.key === 'U'))){
      e.preventDefault();
    }
  });
  document.addEventListener('dragstart', function(e){ e.preventDefault(); });
  document.addEventListener('selectstart', function(e){ if(!isFormEl(e.target)) e.preventDefault(); });
})();
</script>
</body>
</html>`,
  };
}

function footer() {
  const campLinks = Object.values(CAMPS).map((c) => `<a href="${c.slug}.html">${c.name}</a>`).join("\n");
  const ageLinks = AGE_GROUPS.map((a) => `<a href="${a.slug}.html">${a.label} 캠프</a>`).join("\n");
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-word">러닝<em>트래블</em></div>
        <p>캐나다·뉴질랜드·일본·말레이시아·필리핀 해외캠프와<br>중·고등 유학을 안내합니다. 지금까지 16,000명 넘는<br>학생들과 다녀온 경험이 저희의 전부이자 자랑입니다.</p>
        <a class="btn btn-coral footer-cta" href="#consult">상담 신청하기</a>
      </div>
      <div class="footer-links">
        <h3>캠프 안내</h3>
        <div class="footer-linkset">${campLinks}\n${ageLinks}\n<a href="summer.html">여름캠프 사전상담</a>\n<a href="compare.html">캠프 비교</a>\n<a href="guide.html">캠프 가이드</a>\n<a href="faq.html">자주 묻는 질문</a>\n<a href="info-usa.html">미국</a>\n<a href="info-uk.html">영국</a>\n<a href="info-australia.html">호주</a>\n<a href="info-philippines.html">필리핀</a>\n<a href="info-singapore.html">싱가포르</a></div>
        <h3 style="margin-top:26px">유학 · 세인트폴 대치 아카데미</h3>
        <div class="footer-linkset"><a href="study.html">유학 전체 안내</a>\n<a href="study-newzealand.html">뉴질랜드 중·고등 유학</a>\n<a href="study-canada.html">캐나다 관리형 유학</a>\n<a href="study-compare.html">유학 비교</a>\n<a href="study-cost.html">유학 비용</a>\n<a href="study-process.html">준비 절차</a>\n<a href="study-visa.html">비자·서류</a>\n<a href="study-guardian.html">현지 관리</a>\n<a href="study-after.html">졸업 후 진로</a>\n<a href="study-faq.html">유학 FAQ</a>\n<a href="study-guide.html">유학 가이드</a>\n${STUDY_GRADES.map((g) => `<a href="${g.slug}.html">${g.label} 유학</a>`).join("\n")}\n<a href="stpaul.html">세인트폴 대치 아카데미</a>\n<a href="stpaul-admission.html">입학 안내</a>\n<a href="stpaul-curriculum.html">수업·커리큘럼</a>\n<a href="stpaul-tuition.html">학비</a>\n<a href="stpaul-college.html">진학 실적</a>\n<a href="stpaul-life.html">학교생활</a>\n<a href="stpaul-vs-abroad.html">유학과 비교</a>\n<a href="stpaul-faq.html">세인트폴 FAQ</a>\n<a href="elc.html">미국·캐나다 대학 토플면제교육원</a></div>
      </div>
    </div>
    <p class="footer-fine">러닝트래블 해외캠프 안내 페이지 · 일정과 비용은 항공·현지 사정에 따라 변경될 수 있습니다. 문의는 상담 신청 양식을 이용해 주세요.<br>본 페이지의 캠프·유학 자료 출처: 쏠루트 유학</p>
  </div>
</footer>`;
}

// ------------------------------------------------------------
// 공용 조각
// ------------------------------------------------------------
function campCard(c) {
  return `<a class="camp-card" href="${c.slug}.html">
    <span class="camp-flag">${c.flag} ${c.countryName}</span>
    <h3>${c.name}</h3>
    <p class="camp-tag">${c.tag}</p>
    <dl class="camp-meta">
      <div><dt>기간</dt><dd>${c.periodShort}</dd></div>
      <div><dt>대상</dt><dd>${c.target}</dd></div>
      <div><dt>참가비</dt><dd>${c.price}</dd></div>
    </dl>
    <span class="camp-more">자세히 보기 →</span>
  </a>`;
}

function compareTable() {
  const cs = Object.values(CAMPS);
  const row = (label, fn) => `<tr><th>${label}</th>${cs.map((c) => `<td>${fn(c)}</td>`).join("")}</tr>`;
  // 뉴질랜드처럼 " · "로 이어진 값(3주·4주·7주)은 표에서 줄바꿈으로 표시 (2026-08-26 사용자 요청)
  const br = (s) => String(s).replace(/ · /g, "<br>");
  return `<div class="table-wrap"><table class="cmp">
    <thead><tr><th></th>${cs.map((c) => `<th><a href="${c.slug}.html">${c.flag}<br>${c.name}</a></th>`).join("")}</tr></thead>
    <tbody>
      ${row("형태", (c) => c.type)}
      ${row("기간", (c) => c.periodShort)}
      ${row("대상", (c) => br(c.target))}
      ${row("정원", (c) => c.capacity)}
      ${row("참가비", (c) => `<strong>${br(c.price)}</strong>`)}
      ${row("숙소", (c) => c.stay)}
      ${row("모집 마감", (c) => c.deadline)}
    </tbody>
  </table></div>`;
}

function safetySection(list = null) {
  return `<section class="section alt">
  <div class="wrap">
    <h2 class="sec-title">안전 관리는 이렇게 하고 있습니다</h2>
    <p class="sec-sub">16,000명 넘는 학생들과 캠프를 다니며 하나씩 자리잡은 규칙들입니다.</p>
    <ul class="safe-list">
      ${(list || COMMON.safety).map((s) => `<li>${s}</li>`).join("\n")}
    </ul>
  </div>
</section>`;
}

function applySection(steps = null) {
  return `<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title">참가 신청 절차</h2>
    <ol class="step-list">${(steps || COMMON.applySteps).map((s) => `<li>${s}</li>`).join("")}</ol>
    <p class="sec-sub" style="margin-top:14px">모집은 선착순이며 정원이 차면 조기 마감됩니다. 환불 규정은 <a href="faq.html#refund">여기</a>에서 확인하세요.</p>
  </div>
</section>`;
}

// 홈 전용: 섹션을 제목 바만 남기고 접는다 (모바일 페이지 길이 줄이기).
// 기본은 접힌 상태 — 홈 하단 스크립트가 데스크톱(≥821px)에서 전부 펼치고, #study 같은 앵커 진입 시 해당 섹션을 펼친다.
function foldSection(html) {
  return html.replace(
    /(<div class="wrap[^"]*">\s*)<h2 class="sec-title">([\s\S]*?)<\/h2>([\s\S]*?)(<\/div>\s*<\/section>)$/,
    (m, pre, t, rest, post) => `${pre}<details class="sec-fold"><summary><h2 class="sec-title">${t}</h2></summary>${rest}</details>${post}`
  );
}

function consultSection(preset = {}) {
  const campOpts = Object.values(CAMPS)
    .map((c) => `<option value="${c.name}"${preset.camp === c.slug ? " selected" : ""}>${c.name}</option>`)
    .join("");
  const studyOpts = [...Object.values(STUDY), STPAUL, ELC]
    .map((s) => `<option value="${s.name}"${preset.camp === s.slug ? " selected" : ""}>${s.name}</option>`)
    .join("");
  const gradeOpts = GRADES.map((g) => `<option value="${g.label}"${preset.grade === g.key ? " selected" : ""}>${g.label}</option>`).join("");
  const summerOpt = `<option value="2027 여름캠프 사전 상담"${preset.camp === "summer" ? " selected" : ""}>2027 여름캠프 사전 상담</option>`;
  // 상담 폼은 페이지 하단 고정 섹션이 아니라 팝업(모달)로 뜬다 — 상담 CTA(a[href$="#consult"]) 클릭 시 열림 (2026-08-24)
  return `<div class="consult-ov" id="consultOv" hidden>
  <div class="consult-box">
  <button type="button" class="consult-x" aria-label="닫기">✕</button>
  <section class="consult" id="consult">
  <div class="wrap consult-grid">
    <div class="consult-copy">
      <h2>${preset.title || "캠프 상담 신청"}</h2>
      <p>${preset.copy || "아이 학년과 궁금한 점을 남겨 주세요.<br>확인 후 맞는 캠프와 일정을 안내해 드립니다."}</p>
      <ul class="consult-points">
        ${(preset.points || ["모집은 선착순, 정원 마감 전 상담을 권합니다", "영어 실력·성향에 맞는 캠프 추천", "유학 연계, 형제 동반 참가 문의 환영"]).map((p) => `<li>${p}</li>`).join("\n        ")}
      </ul>
    </div>
    <form class="consult-form" id="consultForm" autocomplete="off">
      <div class="form-row two">
        <label><span class="lab">학생 이름 <b class="req">*</b></span><input type="text" name="이름" required placeholder="이름"></label>
        <label><span class="lab">연락처 <b class="req">*</b></span><div style="display:flex;gap:6px"><select name="연락처앞" style="flex:0 0 44px;appearance:none;-webkit-appearance:none;text-align:center;text-align-last:center;padding:0"><option value="010" selected>010</option><option value="011">011</option><option value="016">016</option><option value="017">017</option><option value="018">018</option><option value="019">019</option></select><input type="tel" name="연락처" required placeholder="1234-5678" style="flex:1;min-width:0"></div></label>
      </div>
      <div class="form-row two">
        <label>자녀 학년<select name="학년"><option value="">선택해 주세요</option>${gradeOpts}<option value="기타">기타</option></select></label>
        <label>관심 캠프<select name="관심캠프"><option value="">선택해 주세요</option><optgroup label="겨울캠프">${campOpts}</optgroup><optgroup label="여름캠프">${summerOpt}</optgroup><optgroup label="유학·진학 과정">${studyOpts}</optgroup><option value="추천 받고 싶어요">추천 받고 싶어요</option></select></label>
      </div>
      <div class="form-row two">
      </div>
      <div class="form-row">
        <label>문의 내용<textarea name="문의내용" rows="5" placeholder="아이의 영어 수준, 해외 경험 여부, 현재 복용하는 약, 알레르기 여부(음식·동물), 궁금한 점을 자유롭게 남겨 주세요"></textarea></label>
      </div>
      <button type="submit" class="btn btn-coral form-submit">상담 신청하기</button>
      <p class="form-fine">남겨주신 정보는 상담 목적으로만 사용됩니다.</p>
      <div class="form-done" id="consultDone" hidden>
        <strong>상담 신청이 접수되었습니다.</strong>
        <p>확인 후 순차적으로 연락드리겠습니다. 감사합니다.</p>
      </div>
    </form>
  </div>
  <script>
  (function(){
    var EP = ${JSON.stringify(FORM_ENDPOINT)};
    var form = document.getElementById('consultForm');
    if(!form) return;
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var f = new FormData(form);
      var name = (f.get('이름')||'').trim(), tel = (function(p,v){v=String(v||'').replace(/\\D/g,'');return v.length===11?v.slice(0,3)+'-'+v.slice(3,7)+'-'+v.slice(7):v.length===10?v.slice(0,3)+'-'+v.slice(3,6)+'-'+v.slice(6):v.length===8?p+'-'+v.slice(0,4)+'-'+v.slice(4):v.length===7?p+'-'+v.slice(0,3)+'-'+v.slice(3):p+'-'+v;})((f.get('연락처앞')||'010'),(f.get('연락처')||'').trim());
      if(!name || !tel){ alert('성함과 연락처를 입력해 주세요.'); return; }
      var btn = form.querySelector('.form-submit');
      btn.disabled = true; btn.textContent = '접수 중...';
      var data = {
        '이름': name, '연락처': tel,
        '학년': f.get('학년')||'', '관심캠프': f.get('관심캠프')||'',
        '문의내용': f.get('문의내용')||'',
        '신청일': new Date().toLocaleString('ko-KR'),
        '유입페이지': location.href, '유입페이지제목': document.title,
        '유입경로': document.referrer || '직접입력'
      };
      var qs = Object.keys(data).map(function(k){ return encodeURIComponent(k)+'='+encodeURIComponent(data[k]); }).join('&');
      if(EP){ var img = new Image(); img.src = EP + '?' + qs; }
      else { console.warn('FORM_ENDPOINT 미설정 — 데모 모드'); }
      setTimeout(function(){
        form.querySelectorAll('.form-row, .form-submit, .form-fine').forEach(function(el){ el.style.display='none'; });
        document.getElementById('consultDone').hidden = false;
      }, 700);
    });
  })();
  (function(){
    var ov = document.getElementById('consultOv');
    if(!ov) return;
    function open(){ ov.hidden = false; document.body.style.overflow = 'hidden'; }
    function close(){ ov.hidden = true; document.body.style.overflow = ''; }
    document.addEventListener('click', function(e){
      if(!e.target.closest) return;
      var a = e.target.closest('a[href$="#consult"]');
      if(a){ e.preventDefault(); open(); return; }
      if(e.target === ov || e.target.closest('.consult-x')) close();
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !ov.hidden) close(); });
  })();
  </script>
</section>
</div>
</div>`;
}

// ------------------------------------------------------------
// 홈
// ------------------------------------------------------------
function buildIndex() {
  const hero = `<section class="hero hero-slider" id="heroSlider">
  <div class="hs-track">
    <div class="hs-slide">
      <div class="wrap hero-inner">
        <p class="hero-kicker">${SEASON_LABEL} 해외캠프 모집</p>
        <h1>겨울방학 3주,<br>캐나다 학교에 다녀보면 어떨까요</h1>
        <p class="hero-sub">현지 학교 수업에 직접 들어가는 스쿨링부터 대학 캠퍼스 영어캠프까지. 캐나다·뉴질랜드·일본·말레이시아·필리핀 ${CAMP_COUNT}개 과정,<br>신청부터 귀국까지 한국인 인솔자가 붙어 있습니다.</p>
        <div class="hero-actions">
          <a class="btn btn-coral" href="#camps">${SEASON_LABEL} 캠프 보기</a>
          <a class="btn btn-line" href="compare.html">한눈에 비교하기</a>
        </div>
      </div>
    </div>
    <div class="hs-slide">
      <div class="wrap hero-inner">
        <p class="hero-kicker">중·고등 유학</p>
        <h1>캠프로 확인했다면,<br>유학으로 이어갑니다</h1>
        <p class="hero-sub">뉴질랜드는 캠프와 같은 학교로, 캐나다는 같은 교육청으로 이어집니다.<br>10주 한 텀부터 졸업까지, 법적 가디언과 월간 리포트가 붙는 관리형 유학입니다.</p>
        <div class="hero-actions">
          <a class="btn btn-coral" href="study.html">유학 과정 보기</a>
          <a class="btn btn-line" href="#consult">상담 신청</a>
        </div>
      </div>
    </div>
    <div class="hs-slide">
      <div class="wrap hero-inner">
        <p class="hero-kicker">세인트폴 대치 아카데미</p>
        <h1>유학 없이 대치동에서<br>미국 교과과정 그대로</h1>
        <p class="hero-sub">미국 SPASS 글로벌 8개교의 서울 캠퍼스. 전교 95명 소수정예, AP 15과목 이상,<br>존스홉킨스·UC버클리 등 미국 명문대 진학 실적. 2월·8월 학기 모집.</p>
        <div class="hero-actions">
          <a class="btn btn-coral" href="stpaul.html">학교 안내 보기</a>
          <a class="btn btn-line" href="#consult">상담 신청</a>
        </div>
      </div>
    </div>
    <div class="hs-slide">
      <div class="wrap hero-inner">
        <p class="hero-kicker">미국·캐나다 대학 토플면제교육원</p>
        <h1>TOEFL·SAT·내신 없이,<br>미국·캐나다 대학으로</h1>
        <p class="hero-sub">국내 6개월 공인 ESL 과정을 마치면 텍사스주립대·뉴욕주립대·UC 편입 명문 컬리지까지.<br>고3 졸업생·재수생·검정고시생 대상, 2027 겨울학기 45명 선착순 모집.</p>
        <div class="hero-actions">
          <a class="btn btn-coral" href="elc.html">과정 안내 보기</a>
          <a class="btn btn-line" href="#consult">상담 신청</a>
        </div>
      </div>
    </div>
  </div>
  <button class="hs-arrow hs-prev" type="button" aria-label="이전 화면">‹</button>
  <button class="hs-arrow hs-next" type="button" aria-label="다음 화면">›</button>
  <div class="hs-dots" role="tablist">
    <button type="button" class="on" aria-label="1번 화면"></button>
    <button type="button" aria-label="2번 화면"></button>
    <button type="button" aria-label="3번 화면"></button>
    <button type="button" aria-label="4번 화면"></button>
  </div>
  <script>
  (function(){
    var root = document.getElementById('heroSlider');
    var track = root.querySelector('.hs-track');
    var dots = root.querySelectorAll('.hs-dots button');
    var n = dots.length, i = 0, timer = null;
    function go(to){
      i = (to + n) % n;
      track.style.transform = 'translateX(-' + (i * 100) + '%)';
      for (var d = 0; d < n; d++) dots[d].classList.toggle('on', d === i);
    }
    function auto(){ clearInterval(timer); timer = setInterval(function(){ go(i + 1); }, 6000); }
    root.querySelector('.hs-prev').addEventListener('click', function(){ go(i - 1); auto(); });
    root.querySelector('.hs-next').addEventListener('click', function(){ go(i + 1); auto(); });
    for (var d = 0; d < n; d++) (function(d){ dots[d].addEventListener('click', function(){ go(d); auto(); }); })(d);
    var sx = null;
    root.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    root.addEventListener('touchend', function(e){
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); auto(); }
      sx = null;
    }, {passive:true});
    root.addEventListener('mouseenter', function(){ clearInterval(timer); });
    root.addEventListener('mouseleave', auto);
    auto();
  })();
  </script>
</section>
<section class="stats">
  <div class="wrap stats-grid">
    <div><strong>16,000+</strong><span>누적 참가 학생</span></div>
    <div><strong>${CAMP_COUNT}개 캠프</strong><span>${SEASON_LABEL} 시즌 운영</span></div>
    <div><strong>전 일정</strong><span>한국인 인솔자 동행</span></div>
    <div><strong>실시간</strong><span>학부모 밴드 공유</span></div>
  </div>
</section>`;

  const body = `
<section class="section" id="camps">
  <div class="wrap">
    <h2 class="sec-title">${SEASON_LABEL} 캠프 라인업</h2>
    <p class="sec-sub">스쿨링·영어캠프·어학연수까지, 아이의 나이와 목적에 맞는 캠프를 고르세요. 모두 인솔자 동행, 선착순 마감입니다.</p>
    <div class="camp-grid">${Object.values(CAMPS).map(campCard).join("\n")}</div>
    <div class="btn-row"><a class="btn btn-navy" href="compare.html">${CAMP_COUNT}개 캠프 한눈에 비교하기 →</a>
    <a class="btn btn-coral" href="summer.html">2027 여름캠프 사전 상담 →</a></div>
  </div>
</section>

${foldSection(safetySection())}

<section class="section">
  <div class="wrap">
    <details class="sec-fold"><summary><h2 class="sec-title">어떤 캠프를 골라야 할지 모르겠다면</h2></summary>
    <div class="fit-grid">
      <div><strong>처음 나가는 초등학생이라면</strong><p>3주짜리가 무난합니다. 학교에서 버디 친구를 붙여주는 <a href="canada-3week.html">캐나다 3주</a>나, 1월이 여름이라 지내기 좋은 <a href="newzealand.html">뉴질랜드</a>로 시작하는 집이 많습니다.</p></div>
      <div><strong>유학을 진지하게 고민 중이라면</strong><p>바로 보내지 마시고 <a href="canada-7week.html">캐나다 7주</a>부터 겪어보게 하세요. 사립학교 수업을 그대로 다녀보고 결정해도 늦지 않습니다.</p></div>
      <div><strong>영어가 아직 자신 없다면</strong><p><a href="newzealand.html">뉴질랜드 캠프</a>가 부담이 덜합니다. 1월엔 캠프생끼리 영어수업으로 몸을 풀고, 2월에 현지 수업에 들어가는 순서라서요.</p></div>
      <div><strong>일본어에 빠진 중고생이라면</strong><p><a href="japan.html">교토 2주</a> 다녀오면 일본어 진로를 계속 갈지 본인 입으로 답이 나옵니다.</p></div>
      <div><strong>말하기 연습량이 절실하다면</strong><p><a href="philippines.html">필리핀 클락</a>이 답입니다. 매일 1:1 수업만 4시간입니다. 다른 어느 캠프보다 입을 여는 시간이 깁니다.</p></div>
      <div><strong>비용 대비 알찬 첫 캠프를 찾는다면</strong><p><a href="malaysia.html">말레이시아 래플즈 캠프</a>는 항공권 포함 599만원에 싱가포르 투어까지 묶여 있어 부담이 가장 적습니다.</p></div>
    </div>
    </details>
  </div>
</section>

${foldSection(applySection()).replace(`class="section"`, `class="section alt"`).replace(`class="wrap narrow"`, `class="wrap"`)}

<section class="section">
  <div class="wrap">
    <details class="sec-fold"><summary><h2 class="sec-title">학부모님들이 가장 많이 묻는 질문</h2></summary>
    <div class="faq-list">
      ${COMMON.faq.slice(0, 4).map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
    </div>
    <div class="btn-row"><a class="btn btn-navy" href="faq.html">전체 질문·환불 규정 보기 →</a></div>
    </details>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <details class="sec-fold"><summary><h2 class="sec-title">캠프 가이드</h2></summary>
    <p class="sec-sub">첫 캠프 나이부터 홈스테이 적응, 준비물까지. 보내기 전에 읽어두면 좋은 글들.</p>
    <div class="guide-grid">${GUIDES.slice(0, 6).map(guideCard).join("\n")}</div>
    <div class="btn-row"><a class="btn btn-navy" href="guide.html">가이드 전체 보기 →</a></div>
    </details>
  </div>
</section>

<section class="section" id="study">
  <div class="wrap">
    <h2 class="sec-title">캠프만 하는 곳이 아닙니다 — 중·고등 유학</h2>
    <p class="sec-sub">캠프로 가능성을 확인했다면 그 다음을 준비할 차례입니다. 캠프와 같은 학교·같은 교육청으로 이어지는 정규 유학 과정을 직접 진행합니다. 캠프를 다녀오지 않은 학생도 상담받으실 수 있습니다.</p>
    <div class="camp-grid">
      <a class="camp-card" href="study-newzealand.html">
        <span class="camp-flag">🇳🇿 뉴질랜드</span>
        <h3>뉴질랜드 중·고등 유학</h3>
        <p class="camp-tag">겨울캠프의 그 학교, Waiuku College에서 10주 한 텀부터 졸업까지</p>
        <dl class="camp-meta">
          <div><dt>대상</dt><dd>중1~고2</dd></div>
          <div><dt>기간</dt><dd>텀(10주)~학년 단위</dd></div>
          <div><dt>비용</dt><dd>연 3,200만원</dd></div>
        </dl>
        <span class="camp-more">자세히 보기 →</span>
      </a>
      <a class="camp-card" href="study-canada.html">
        <span class="camp-flag">🇨🇦 캐나다</span>
        <h3>캐나다 관리형 중·고등 유학</h3>
        <p class="camp-tag">나이아가라 공립 교육청 8개 고교, 법적 가디언 + 월간 리포트</p>
        <dl class="camp-meta">
          <div><dt>대상</dt><dd>중1~고2</dd></div>
          <div><dt>기간</dt><dd>학기~학년 단위</dd></div>
          <div><dt>비용</dt><dd>연 4,250만원</dd></div>
        </dl>
        <span class="camp-more">자세히 보기 →</span>
      </a>
      <a class="camp-card" href="study-compare.html">
        <span class="camp-flag">📋 어디로 보낼까</span>
        <h3>두 나라 비교하기</h3>
        <p class="camp-tag">학제·시작 단위·졸업장·비용·환경을 표 하나로 놓고 봅니다</p>
        <dl class="camp-meta">
          <div><dt>시작 단위</dt><dd>텀 vs 학기</dd></div>
          <div><dt>졸업장</dt><dd>NCEA vs OSSD</dd></div>
          <div><dt>비용차</dt><dd>연 1,050만원</dd></div>
        </dl>
        <span class="camp-more">비교표 보기 →</span>
      </a>
    </div>
    <div class="fit-grid" style="margin-top:26px">
      <div><strong>얼마나 드나요</strong><p>참가비에 포함된 것과 따로 나가는 것(항공·용돈·비자)을 <a href="study-cost.html">비용 페이지</a>에 항목별로 펼쳐 두었습니다.</p></div>
      <div><strong>언제부터 준비하나요</strong><p>출국 6~8개월 전부터의 <a href="study-process.html">준비 타임라인</a>과 <a href="study-visa.html">비자·서류</a> 안내를 보세요.</p></div>
      <div><strong>현지에서 누가 봐 주나요</strong><p>법적 가디언·홈스테이 관리·월간 리포트까지, <a href="study-guardian.html">관리 체계</a>를 정리했습니다.</p></div>
      <div><strong>우리 아이 학년이면</strong><p>${STUDY_GRADES.map((g) => `<a href="${g.slug}.html">${g.key}</a>`).join(" · ")} — 학년별로 시작 시점의 의미가 다릅니다.</p></div>
    </div>
    <div class="btn-row"><a class="btn btn-navy" href="study.html">유학 전체 안내 →</a>
    <a class="btn btn-line" href="study-faq.html">유학 자주 묻는 질문 →</a></div>
  </div>
</section>

<section class="section alt" id="stpaul">
  <div class="wrap">
    <h2 class="sec-title">해외로 나가기 어렵다면 — 세인트폴 대치 아카데미</h2>
    <p class="sec-sub">집에서 통학하면서 미국 교과과정 8~12학년을 그대로 밟는 길입니다. 전 과목 영어 수업, AP 15과목 이상, 졸업 시 미국 고교 졸업장. 서울 대치동에 있습니다.</p>
    <div class="two-col">
      <div>
        <dl class="info-list">
          <div><dt>대상</dt><dd>중2~고2 편입학 (고3은 상담 후 결정)</dd></div>
          <div><dt>모집</dt><dd>매년 2월·8월 학기 · 학년당 12~22명</dd></div>
          <div><dt>규모</dt><dd>전교 95명 소수정예 · 전 과목 영어 수업</dd></div>
          <div><dt>학비</dt><dd>연 2,540만원 (등록비·교재비 별도)</dd></div>
        </dl>
      </div>
      <div>
        <ul class="check-list">
          <li>미국 3대 학력인증(AI · NCPSA · MSA-CESS) 취득 학교</li>
          <li>존스홉킨스·UC버클리·UCLA·NYU 등 미국 명문대 진학 실적</li>
          <li>UCLA 출신 전담 College Counselor 진학 상담 주 3회</li>
          <li>국내 학력이 인정되지 않는 미인가 과정이라는 점은 미리 확인하셔야 합니다</li>
        </ul>
      </div>
    </div>
    <div class="btn-row"><a class="btn btn-navy" href="stpaul.html">세인트폴 대치 아카데미 안내 →</a>
    <a class="btn btn-line" href="stpaul-admission.html">입학 절차 보기 →</a>
    <a class="btn btn-line" href="stpaul-vs-abroad.html">해외 유학과 비교 →</a></div>
  </div>
</section>

<section class="section" id="elc">
  <div class="wrap">
    <h2 class="sec-title">고3·재수생이라면 — 미국·캐나다 대학 토플면제교육원</h2>
    <p class="sec-sub">수능 대신 미국·캐나다 대학으로 방향을 정한 학생을 위한 과정입니다. 국내에서 6개월 공인 ESL 과정과 대학 교양학점을 채우면 TOEFL·SAT·내신 없이 파트너 대학으로 진학합니다. 2011년부터 1,000명 넘게 이 길로 갔습니다.</p>
    <div class="two-col">
      <div>
        <dl class="info-list">
          <div><dt>대상</dt><dd>고3 졸업(예정)생 · 재수생 · 검정고시생 · 대학생</dd></div>
          <div><dt>모집</dt><dd>2027 겨울학기 45명 · 선착순 마감</dd></div>
          <div><dt>과정</dt><dd>2027년 1월 개강 · 6개월 후 8월 출국</dd></div>
          <div><dt>진학처</dt><dd>텍사스·뉴욕·캘리포니아 주립대, UC 편입 컬리지, 캐나다 세네카 등 20개교</dd></div>
        </dl>
      </div>
      <div>
        <ul class="check-list">
          <li>No TOEFL · No SAT · No 내신 — 자체 전형(서류+영어테스트·면접)으로 선발</li>
          <li>산타모니카·디앤자 컬리지 경유 UCLA·UC버클리 편입 트랙 운영</li>
          <li>편입장학금 수혜 시 In-State 학비 적용, 연 $13,000~20,000 절감 가능</li>
          <li>대학 지원·수속 대행부터 공항 픽업·기숙사 등 현지 정착까지 지원</li>
        </ul>
      </div>
    </div>
    <div class="btn-row"><a class="btn btn-navy" href="elc.html">토플면제교육원 안내 →</a>
    <a class="btn btn-line" href="#consult">상담 신청 →</a></div>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <details class="sec-fold"><summary><h2 class="sec-title">유학 가이드</h2></summary>
    <p class="sec-sub">조기유학은 언제가 적기인지, 1년에 실제로 얼마가 드는지, 귀국하면 학적은 어떻게 되는지 — 자주 받는 질문부터 하나씩 짚었습니다.</p>
    <div class="guide-grid">${STUDY_GUIDES.slice(0, 6).map(guideCard).join("\n")}</div>
    <div class="btn-row"><a class="btn btn-navy" href="study-guide.html">유학 가이드 전체 보기 →</a></div>
    </details>
  </div>
</section>

${consultSection()}`;

  return page({
    file: "index.html",
    title: `러닝트래블 | ${SEASON_LABEL} 해외캠프 · 중고등 유학 · 미국·캐나다 대학 토플면제`,
    desc: `해외 겨울캠프 ${CAMP_COUNT}종(캐나다·뉴질랜드·일본·말레이시아·필리핀)부터 뉴질랜드·캐나다 관리형 유학, 세인트폴 대치 아카데미, 미국·캐나다 대학 토플면제교육원까지. 캠프 체험에서 유학·대학 진학까지 한 곳에서. 인솔자 동행, 학부모 실시간 공유, ${SEASON_LABEL} 시즌 선착순 모집.`,
    hero,
    body,
    jsonld: { "@context": "https://schema.org", "@type": "Organization", name: "러닝트래블", url: BASE_URL },
  });
}

// ------------------------------------------------------------
// 캠프 상세
// ------------------------------------------------------------

function scheduleSection(slug) {
  const rows = SCHEDULES[slug];
  if (!rows) return "";
  return `
<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title">전체 일정</h2>
    <p class="sec-sub">안내자료에 실린 일정 그대로입니다. 현지 날씨나 학교 사정에 따라 바뀔 수 있습니다.</p>
    <ol class="sch">${rows.map(([d, w, t]) => `<li><span class="sch-d">${d}${w ? `<i>${w}</i>` : ""}</span><span class="sch-t">${t}</span></li>`).join("")}</ol>
  </div>
</section>`;
}

function campFaqSection(slug) {
  const own = CAMP_FAQ[slug] || [];
  const list = own.concat(COMMON.faq.slice(0, 4));
  return `
<section class="section alt">
  <div class="wrap narrow">
    <h2 class="sec-title">이 캠프에 자주 오는 질문</h2>
    <div class="faq-list">
      ${list.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
    </div>
    <p class="sec-sub" style="margin-top:14px">더 궁금한 점은 <a href="faq.html">자주 묻는 질문</a>에서 확인하실 수 있습니다.</p>
  </div>
</section>`;
}

function refundSection() {
  return `
<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title-sm">환불 규정</h2>
    <dl class="info-list">${COMMON.refund.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
    <p class="dim" style="margin-top:12px">천재지변, 항공 결항처럼 주최 측이 통제할 수 없는 사유로 진행이 어려운 경우는 별도로 안내드립니다.</p>
  </div>
</section>`;
}

function buildCamp(key) {
  const c = CAMPS[key];
  const hero = `<section class="hero hero-sm">
  <div class="wrap hero-inner">
    <p class="hero-kicker">${c.flag} ${c.countryName} · ${c.type}</p>
    <h1>${c.name}</h1>
    <p class="hero-sub">${c.tag}</p>
  </div>
</section>`;

  const body = `
<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title">모집 안내</h2>
    <dl class="info-list">
      <div><dt>기간</dt><dd>${c.period}</dd></div>
      <div><dt>대상</dt><dd>${c.target}</dd></div>
      <div><dt>정원</dt><dd>${c.capacity} (선착순)</dd></div>
      <div><dt>참가비</dt><dd><strong>${c.price}</strong><br><span class="dim">${c.priceNote}</span></dd></div>
      <div><dt>숙소</dt><dd>${c.stay}</dd></div>
      <div><dt>모집 마감</dt><dd>${c.deadline}</dd></div>
      <div><dt>문의·신청</dt><dd><a href="#consult">하단 상담 신청 양식으로 문의해 주세요 →</a></dd></div>
    </dl>
  </div>
</section>

<section class="section alt">
  <div class="wrap narrow">
    <h2 class="sec-title">이 캠프의 하이라이트</h2>
    <ul class="check-list">${c.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
  </div>
</section>

<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title">${c.school}</h2>
    <p class="lead">${c.schoolDesc}</p>
  </div>
</section>

<section class="section alt">
  <div class="wrap two-col">
    <div>
      <h2 class="sec-title-sm">참가비에 포함</h2>
      <p>${c.includes}</p>
    </div>
    <div>
      <h2 class="sec-title-sm">불포함 (별도)</h2>
      <p>${c.excludes}</p>
      <p class="dim" style="margin-top:10px">권장 용돈: ${c.pocket}</p>
    </div>
  </div>
</section>

${scheduleSection(c.slug)}
${SCHEDULES[c.slug] ? `<section class="section alt" style="padding-top:0"><div class="wrap narrow"><p class="sec-sub"><a href="schedule-${c.slug}.html"><strong>${c.name} 일정표만 따로 보기</strong></a></p></div></section>` : ""}
${safetySection(c.safety)}
${applySection(c.applySteps)}
${refundSection()}
${campFaqSection(c.slug)}

<section class="section alt">
  <div class="wrap narrow">
    <h2 class="sec-title-sm">캠프가 끝난 뒤에도</h2>
    <p>${c.extend}. 자세한 내용은 상담 시 안내해 드립니다.</p>
    ${c.country === "canada" ? `<p style="margin-top:10px">유학까지 생각하고 계시다면, 이 캠프와 같은 교육청에서 진행하는 <a href="study-canada.html"><strong>캐나다 관리형 중·고등 유학</strong></a>을 함께 살펴보세요.</p>` : ""}
    ${c.country === "newzealand" ? `<p style="margin-top:10px">유학까지 생각하고 계시다면, 이 캠프와 같은 학교로 이어지는 <a href="study-newzealand.html"><strong>뉴질랜드 중·고등 유학</strong></a>을 함께 살펴보세요.</p>` : ""}
    <p class="sec-sub" style="margin-top:16px">다른 캠프와 비교하기: <a href="compare.html">${CAMP_COUNT}개 캠프 비교표</a> ·
      ${Object.values(CAMPS).filter((x) => x.slug !== c.slug).map((x) => `<a href="${x.slug}.html">${x.name}</a>`).join(" · ")}</p>
  </div>
</section>

${consultSection({ camp: c.slug })}`;

  return page({
    file: `${c.slug}.html`,
    title: `${c.name} | ${c.periodShort} · ${c.target} · ${c.price}`,
    desc: `${c.tag}. ${c.period}, ${c.target}, 참가비 ${c.price}. ${c.school} · ${c.stay}. ${c.deadline}.`,
    hero,
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "Event",
      name: c.name,
      description: c.tag,
      organizer: { "@type": "Organization", name: "러닝트래블" },
    },
  });
}

// ------------------------------------------------------------
// 비교 / 소개 / FAQ
// ------------------------------------------------------------

// ------------------------------------------------------------
// 과정 단가표 — 기간·비용 축 페이지의 기준 데이터
// (뉴질랜드처럼 한 캠프에 기간이 여러 개면 행을 나눠 둡니다)
// ------------------------------------------------------------
const PRICE_ROWS = [
  { camp: "japan",        label: "일본 교토 2주",   won: 594,  weeks: 2 },
  { camp: "malaysia",     label: "말레이시아 4주",  won: 599,  weeks: 4 },
  { camp: "philippines",  label: "필리핀 클락 4주", won: 599,  weeks: 4 },
  { camp: "newzealand",   label: "뉴질랜드 3주",    won: 690,  weeks: 3 },
  { camp: "newzealand",   label: "뉴질랜드 4주",    won: 810,  weeks: 4 },
  { camp: "canada-3week", label: "캐나다 3주",      won: 890,  weeks: 3 },
  { camp: "newzealand",   label: "뉴질랜드 7주",    won: 1090, weeks: 7 },
  { camp: "canada-7week", label: "캐나다 7주",      won: 1290, weeks: 7 },
];
const DURATIONS = [
  { slug: "2week", weeks: 2, label: "2주", note: "학기 중 부담이 가장 적은 기간입니다. 처음 보내는 집에서 많이 고릅니다." },
  { slug: "3week", weeks: 3, label: "3주", note: "겨울방학 안에 끝나는 가장 무난한 기간입니다. 문의가 제일 많습니다." },
  { slug: "4week", weeks: 4, label: "4주", note: "적응하고 나서 지내는 시간이 생기는 기간입니다. 영어 사용량이 눈에 띄게 늘어납니다." },
  { slug: "7week", weeks: 7, label: "7주", note: "한 학기의 일부를 현지에서 보냅니다. 유학을 염두에 둔 집에서 고릅니다." },
];
const BUDGETS = [
  { slug: "under-600", label: "600만원 미만", min: 0,    max: 599,  note: "항공료를 더해도 700만원 안쪽에서 정리되는 편입니다." },
  { slug: "600-800",   label: "600만~800만원", min: 600, max: 899,  note: "기간과 나라의 균형이 가장 좋은 구간입니다." },
  { slug: "800-1000",  label: "800만~1,000만원", min: 800, max: 1089, note: "스쿨링과 여행 일정이 함께 붙는 과정이 여기 있습니다." },
  { slug: "over-1000", label: "1,000만원 이상", min: 1090, max: 99999, note: "학기 단위로 다니는 장기 과정입니다." },
];
const DEPARTURES = [
  { slug: "jan-early", label: "1월 초 출발", match: (c) => /1\.3/.test(c.periodShort), note: "방학이 시작하자마자 출발합니다. 귀국 후 개학까지 시간이 남습니다." },
  { slug: "jan-mid",   label: "1월 중순 출발", match: (c) => /1\.9/.test(c.periodShort), note: "설 연휴 전에 출발해 방학 대부분을 현지에서 보냅니다." },
  { slug: "feb",       label: "2월 출발", match: (c) => /^2027\.2/.test(c.periodShort), note: "학년이 바뀌기 직전에 다녀옵니다. 새 학기 준비와 겹치지 않게 일정을 잡습니다." },
];

function campsByWeeks(w) {
  const slugs = [...new Set(PRICE_ROWS.filter((r) => r.weeks === w).map((r) => r.camp))];
  return slugs.map((s) => CAMPS[s]).filter(Boolean);
}
function campsByBudget(bd) {
  const slugs = [...new Set(PRICE_ROWS.filter((r) => r.won >= bd.min && r.won <= bd.max).map((r) => r.camp))];
  return slugs.map((s) => CAMPS[s]).filter(Boolean);
}
function moreLinks(exclude = "") {
  const d = DURATIONS.filter((x) => x.slug !== exclude).map((x) => `<a href="duration-${x.slug}.html">${x.label} 캠프</a>`).join(" · ");
  const g = BUDGETS.filter((x) => x.slug !== exclude).map((x) => `<a href="budget-${x.slug}.html">${x.label}</a>`).join(" · ");
  const s = DEPARTURES.filter((x) => x.slug !== exclude).map((x) => `<a href="depart-${x.slug}.html">${x.label}</a>`).join(" · ");
  return `
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">조건으로 찾아보기</h2>
  <p class="sec-sub">기간: ${d}</p>
  <p class="sec-sub">비용: ${g}</p>
  <p class="sec-sub">출발 시기: ${s} · <a href="calendar.html">출발·귀국일 한눈에 보기</a></p>
  <p class="sec-sub">일정표: ${Object.keys(SCHEDULES).map((k) => `<a href="schedule-${k}.html">${CAMPS[k].name} 일정</a>`).join(" · ")}</p>
</div></section>`;
}

// ── 1) 캠프별 일정표 페이지 ───────────────────────────────
function buildSchedulePage(slug) {
  const c = CAMPS[slug];
  const rows = SCHEDULES[slug];
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${c.flag} ${c.countryName} · ${c.periodShort}</p>
    <h1>${c.name} 일정표</h1>
    <p class="hero-sub">출국일부터 귀국일까지 날짜별로 무엇을 하는지 정리했습니다.</p>
  </div></section>`;
  const body = `
${scheduleSection(slug)}
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">일정을 볼 때 같이 보시면 좋은 것</h2>
  <ul class="check-list">
    <li>주중은 학교나 어학원 수업, 주말은 문화·여행 일정으로 나뉩니다.</li>
    <li>방과 후와 주말 자유시간은 홈스테이 가족과 보냅니다. 일정표에 없는 시간이 실제로는 가장 깁니다.</li>
    <li>현지 학교의 휴일(PA Day 등)이나 날씨로 순서가 바뀔 수 있어, 확정 일정은 출국 전 오리엔테이션에서 다시 안내드립니다.</li>
  </ul>
  <p class="sec-sub" style="margin-top:18px">
    <a href="${slug}.html"><strong>${c.name} 상세 안내</strong></a> ·
    <a href="compare.html">${CAMP_COUNT}개 캠프 비교표</a></p>
</div></section>
${moreLinks()}
${consultSection({ camp: slug })}`;
  return page({
    file: `schedule-${slug}.html`,
    title: `${c.name} 일정표 | 날짜별 전체 일정 ${c.periodShort}`,
    desc: `${c.name} 날짜별 일정. ${c.periodShort}, ${c.target}. 학교 수업과 주말 문화·여행 일정을 출국일부터 귀국일까지 정리했습니다.`,
    hero, body,
  });
}

// ── 2) 기간별 허브 ────────────────────────────────────────
function buildDuration(d) {
  const camps = campsByWeeks(d.weeks);
  const rows = PRICE_ROWS.filter((r) => r.weeks === d.weeks);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">기간으로 고르기</p>
    <h1>${d.label} 해외캠프</h1>
    <p class="hero-sub">${d.note}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">${d.label}짜리 과정 ${rows.length}개</h2>
  <dl class="info-list" style="max-width:760px;margin:0 auto 26px">
    ${rows.map((r) => `<div><dt>${r.label}</dt><dd>${r.won.toLocaleString()}만원 <span class="dim">(항공료 별도)</span></dd></div>`).join("")}
  </dl>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">${d.label} 과정을 고르실 때</h2>
  <p class="lead">${d.note} 같은 ${d.label}이라도 현지 학교 수업에 들어가는 스쿨링인지, 어학원 수업 중심인지에 따라 하루가 완전히 다릅니다.
  아이가 지금 필요한 것이 영어 사용량인지 현지 학교 경험인지부터 정하시면 선택이 빨라집니다.</p>
  <p class="sec-sub" style="margin-top:16px">학년별로 보기: ${GRADES.map((g) => `<a href="${g.slug}-${d.slug}.html">${g.label}</a>`).join(" · ")}</p>
</div></section>
${moreLinks(d.slug)}
${consultSection({})}`;
  return page({
    file: `duration-${d.slug}.html`,
    title: `${d.label} 해외캠프 | ${SEASON_LABEL} ${d.label} 겨울캠프 비용·일정`,
    desc: `${d.label} 해외 겨울캠프 ${rows.length}개 (${rows.map((r) => `${r.label} ${r.won.toLocaleString()}만원`).join(", ")}). ${d.note}`,
    hero, body,
  });
}

// ── 3) 학년 × 기간 ────────────────────────────────────────
function buildGradeDuration(g, d) {
  const camps = campsByWeeks(d.weeks).filter((c) => c.targetGrades.includes(g.key));
  const alt = DURATIONS.filter((x) => x.slug !== d.slug)
    .map((x) => ({ d: x, camps: campsByWeeks(x.weeks).filter((c) => c.targetGrades.includes(g.key)) }))
    .filter((x) => x.camps.length);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${g.label} · ${d.label}</p>
    <h1>${g.label} ${d.label} 캠프</h1>
    <p class="hero-sub">${SEASON_LABEL} 시즌, ${g.label} 학생이 갈 수 있는 ${d.label} 과정입니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  ${camps.length ? `<h2 class="sec-title">${g.label}이 갈 수 있는 ${d.label} 과정 ${camps.length}개</h2>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>`
    : `<h2 class="sec-title">${g.label} ${d.label} 과정 안내</h2>
  <p class="lead" style="max-width:760px">${SEASON_LABEL} 시즌에는 ${g.label}이 참가할 수 있는 ${d.label} 과정이 없습니다.
  아래 다른 기간의 과정을 보시거나 상담을 남겨 주시면 다음 시즌 개설 소식과 함께 안내해 드립니다.</p>`}
  ${alt.length ? `<h2 class="sec-title-sm" style="margin-top:34px">${g.label}이 갈 수 있는 다른 기간</h2>
  <p class="sec-sub">${alt.map((x) => `<a href="${g.slug}-${x.d.slug}.html">${x.d.label} (${x.camps.length}개)</a>`).join(" · ")}</p>` : ""}
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">더 살펴보기</h2>
  <p class="sec-sub"><a href="${g.slug}.html">${g.label} 전체 캠프</a> ·
    <a href="duration-${d.slug}.html">${d.label} 전체 과정</a> ·
    <a href="compare.html">${CAMP_COUNT}개 캠프 비교표</a></p>
</div></section>
${consultSection({ grade: g.key })}`;
  return page({
    file: `${g.slug}-${d.slug}.html`,
    title: `${g.label} ${d.label} 캠프 | ${g.label} ${d.label} 해외 겨울캠프`,
    desc: `${g.label} 학생의 ${d.label} 해외캠프. ${camps.length ? camps.map((c) => `${c.name}(${c.price})`).join(", ") + " 참가 가능." : "이번 시즌 대상 과정과 대안 기간 안내."}`,
    hero, body,
  });
}

// ── 4) 출발 시기별 ────────────────────────────────────────
function buildDeparture(dp) {
  const camps = Object.values(CAMPS).filter(dp.match);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">출발 시기로 고르기</p>
    <h1>${dp.label} 해외캠프</h1>
    <p class="hero-sub">${dp.note}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">${dp.label} 과정 ${camps.length}개</h2>
  <dl class="info-list" style="max-width:760px;margin:0 auto 26px">
    ${camps.map((c) => `<div><dt>${c.countryName}</dt><dd>${c.period}<br><span class="dim">${c.target} · ${c.price}</span></dd></div>`).join("")}
  </dl>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">출발일을 정할 때 확인할 것</h2>
  <ul class="check-list">
    <li>학교 방학식·개학일과 겹치지 않는지 먼저 확인해 주세요. 겹치면 체험학습 처리를 학교와 상의해야 합니다.</li>
    <li>여권 유효기간이 6개월 이상 남아 있어야 합니다. 만료가 가깝다면 출발 두 달 전에는 갱신을 시작하시는 편이 안전합니다.</li>
    <li>전자비자는 캠프에서 진행해 드리지만, 여권 사본 제출이 늦으면 일정이 밀립니다.</li>
    <li>항공권은 단체로 잡습니다. 개별 발권을 원하시면 미리 알려 주세요.</li>
  </ul>
</div></section>
${moreLinks(dp.slug)}
${consultSection({})}`;
  return page({
    file: `depart-${dp.slug}.html`,
    title: `${dp.label} 해외캠프 | ${SEASON_LABEL} 출발 일정`,
    desc: `${dp.label} 해외 겨울캠프 ${camps.length}개. ${camps.map((c) => `${c.countryName} ${c.periodShort}`).join(", ")}. ${dp.note}`,
    hero, body,
  });
}

// 출발·귀국일 한눈에 보기
function buildCalendar() {
  const rows = Object.values(CAMPS);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${SEASON_LABEL}</p>
    <h1>캠프 출발·귀국일 한눈에</h1>
    <p class="hero-sub">방학 일정과 겹쳐 보기 좋게 출국일과 귀국일만 모았습니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">${SEASON_LABEL} 전체 일정</h2>
  <dl class="info-list">
    ${rows.map((c) => `<div><dt>${c.flag} ${c.countryName}</dt><dd><strong>${c.period}</strong><br><span class="dim">${c.target} · ${c.price} · 마감 ${c.deadline}</span></dd></div>`).join("")}
  </dl>
  <p class="sec-sub" style="margin-top:18px">날짜별 상세 일정은 각 캠프 일정표에서 보실 수 있습니다:
    ${Object.keys(SCHEDULES).map((k) => `<a href="schedule-${k}.html">${CAMPS[k].name}</a>`).join(" · ")}</p>
</div></section>
${moreLinks()}
${consultSection({})}`;
  return page({
    file: "calendar.html",
    title: `${SEASON_LABEL} 해외캠프 출발·귀국일 정리 | 방학 일정 맞추기`,
    desc: `${SEASON_LABEL} 해외캠프 ${rows.length}개의 출국일·귀국일·모집 마감일 정리. 학교 방학 일정과 맞춰 보실 수 있습니다.`,
    hero, body,
  });
}

// ── 5) 비용대별 ───────────────────────────────────────────
function buildBudget(bd) {
  const rows = PRICE_ROWS.filter((r) => r.won >= bd.min && r.won <= bd.max);
  const camps = campsByBudget(bd);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">비용으로 고르기</p>
    <h1>${bd.label} 해외캠프</h1>
    <p class="hero-sub">${bd.note}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">${bd.label} 과정 ${rows.length}개</h2>
  <dl class="info-list" style="max-width:760px;margin:0 auto 26px">
    ${rows.map((r) => `<div><dt>${r.label}</dt><dd><strong>${r.won.toLocaleString()}만원</strong> <span class="dim">· ${r.weeks}주 · 항공료 별도</span></dd></div>`).join("")}
  </dl>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">참가비 외에 더 드는 돈</h2>
  <ul class="check-list">
    <li>항공료가 가장 큽니다. 캐나다 토론토 직항 기준 250만~300만원, 일본은 훨씬 낮습니다.</li>
    <li>여권 발급비와 개인 용돈은 따로입니다. 3주 기준 현지화 300~500달러(일본은 70만~80만원)를 권해 드립니다.</li>
    <li>개별 출·귀국을 하시면 항공사 UM 서비스 비용이 붙습니다.</li>
    <li>참가비에는 학비·홈스테이비·현지 관리비·보험료·전자비자 진행비가 들어 있습니다.</li>
  </ul>
  <p class="sec-sub" style="margin-top:16px">과정별 포함·불포함 내역은 각 캠프 페이지에 그대로 적어 두었습니다.</p>
</div></section>
${moreLinks(bd.slug)}
${consultSection({})}`;
  return page({
    file: `budget-${bd.slug}.html`,
    title: `${bd.label} 해외캠프 | ${SEASON_LABEL} 겨울캠프 비용 비교`,
    desc: `참가비 ${bd.label} 해외 겨울캠프 ${rows.length}개 (${rows.map((r) => `${r.label} ${r.won.toLocaleString()}만원`).join(", ")}). 항공료 등 추가 비용까지 함께 안내합니다.`,
    hero, body,
  });
}

function buildCompare() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${SEASON_LABEL} Camp Comparison</p>
    <h1>${CAMP_COUNT}개 캠프, 한눈에 비교</h1>
    <p class="hero-sub">기간·대상·비용·형태를 나란히 놓고 우리 아이에게 맞는 캠프를 찾아보세요.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  ${compareTable()}
  <p class="sec-sub" style="margin-top:18px">캐나다·뉴질랜드·일본 캠프의 항공료는 별도이며 단체 예약으로 진행합니다 (개별 발권 가능). 말레이시아·필리핀 캠프는 왕복 항공권이 참가비에 포함되어 있습니다. 어떤 캠프가 맞을지 고민되시면 아이 학년·영어 수준을 적어 상담을 남겨 주세요.</p>
</div></section>
<section class="section alt"><div class="wrap">
  <h2 class="sec-title">고르기 어려울 때 참고하세요</h2>
  <div class="fit-grid">
    <div><strong>첫 해외 경험이라면</strong><p>3주면 충분합니다. 첫 주에 적응하고, 둘째 주부터 재미를 붙이고, 셋째 주엔 아쉬워하면서 돌아옵니다.</p></div>
    <div><strong>유학 보내기 전 점검이라면</strong><p>7주를 권합니다. 한 달을 넘겨야 손님 대접이 끝나고 진짜 생활이 시작되거든요.</p></div>
    <div><strong>영어 기초가 걱정이라면</strong><p>뉴질랜드로 보내세요. 영어수업으로 시작해서 현지 수업으로 넘어가는 순서라 덜 힘들어합니다.</p></div>
    <div><strong>일본어 진로를 알아보는 중이라면</strong><p>교토 2주가 맞습니다. 중2~고2만 받는 소수 정예 과정입니다.</p></div>
    <div><strong>말하기 연습량이 우선이라면</strong><p>필리핀 클락입니다. 매일 1:1 수업 4시간입니다. 입을 여는 시간이 압도적으로 깁니다.</p></div>
    <div><strong>비용 부담을 줄이고 싶다면</strong><p>말레이시아 래플즈 캠프가 항공권 포함 599만원으로 가장 가볍습니다. 싱가포르 투어까지 묶여 있습니다.</p></div>
  </div>
</div></section>
${moreLinks()}
${consultSection()}`;
  return page({
    file: "compare.html",
    title: `해외 겨울캠프 비교 | 캐나다·뉴질랜드·일본·말레이시아·필리핀 기간·비용·대상 총정리`,
    desc: `${SEASON_LABEL} 해외캠프 ${CAMP_COUNT}종 비교표. 캐나다 스쿨링 3주(890만원)·7주(1,290만원), 뉴질랜드 3~7주(690만원~), 일본 교토 2주(594만원), 말레이시아·필리핀 4주(각 599만원·항공 포함). 기간·대상·숙소·마감일 한눈에.`,
    hero, body,
  });
}

function buildAbout() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Why Learning Travel</p>
    <h1>16,000명을 데리고<br>다녀온 팀이 만드는 캠프</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">캠프를 고를 때 일정표는 사실 큰 차이가 없습니다. 차이가 나는 건 사고가 났을 때입니다.
  아이가 한밤중에 아프면 누가 몇 분 안에 오는지, 홈스테이와 갈등이 생기면 누가 중간에서 풀어주는지.
  저희는 여기에 답할 수 있느냐를 기준으로 프로그램을 짜 왔습니다. 아래가 그 답입니다.</p>
</div></section>
<section class="section alt"><div class="wrap">
  <h2 class="sec-title">러닝트래블 캠프의 운영 원칙</h2>
  <div class="fit-grid">
    <div><strong>교육기관과 직접 연결</strong><p>학교·교육청과 직접 연계된 프로그램만 운영합니다. 홈스테이도 교육기관이 검증한 가정만 배정됩니다.</p></div>
    <div><strong>인솔자 + 현지 관리자 이중 체계</strong><p>한국에서 함께 출국한 인솔자와, 현지에 상주하는 관리자가 학교와 홈스테이 양쪽을 살핍니다.</p></div>
    <div><strong>학부모 실시간 공유</strong><p>네이버 밴드에 전체 공지방과 학생별 개인방을 운영합니다. 아이의 하루가 매일 사진과 글로 도착합니다.</p></div>
    <div><strong>명문화된 원칙</strong><p>규정 위반 3단계 원칙, 단계별 환불 규정까지, 모든 원칙이 계약서에 문서로 존재합니다.</p></div>
  </div>
</div></section>
${safetySection()}
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">환불 규정</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${COMMON.refund.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">천재지변·항공 지연 등 주관사가 통제할 수 없는 사유는 별도 기준이 적용됩니다. 말레이시아·필리핀 캠프는 운영 규정이 일부 다를 수 있어 상담 시 함께 안내해 드립니다. 계약 전 상담에서 전문을 안내해 드립니다.</p>
</div></section>
${consultSection()}`;
  return page({
    file: "about.html",
    title: "러닝트래블 운영·안전 시스템 | 해외캠프, 무엇이 달라야 하는가",
    desc: "16,000명 이상과 함께해 온 해외캠프 운영 체계. 교육기관 직접 연계, 인솔자·현지 관리자 이중 체계, 학부모 실시간 공유, 명문화된 환불 규정.",
    hero, body,
  });
}

function buildFaq() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">FAQ</p>
    <h1>자주 묻는 질문</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <div class="faq-list">
    ${COMMON.faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
  </div>
</div></section>
<section class="section alt" id="refund"><div class="wrap narrow">
  <h2 class="sec-title">환불 규정</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${COMMON.refund.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">말레이시아·필리핀 캠프는 운영 규정이 일부 다를 수 있어 상담 시 함께 안내해 드립니다.</p>
</div></section>
${consultSection()}`;
  return page({
    file: "faq.html",
    title: "해외캠프 자주 묻는 질문 | 안전·홈스테이·용돈·환불 규정",
    desc: "해외캠프 학부모 FAQ — 영어 실력, 안전, 홈스테이 배정, 휴대폰 규칙, 용돈, 유학 연장, 환불 규정까지 한 페이지에.",
    hero, body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: COMMON.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  });
}

// ------------------------------------------------------------
// 국가 / 연령 / 학년 페이지
// ------------------------------------------------------------
function buildCountry(ct) {
  const camps = ct.camps.map((k) => CAMPS[k]);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${camps[0].flag} ${ct.name} Camp Guide</p>
    <h1>${ct.name} 겨울캠프 안내</h1>
    <p class="hero-sub">${SEASON_LABEL} 시즌 ${ct.name} 캠프 ${camps.length}종 — 일정·비용·프로그램 총정리</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">${ct.name}에서 운영하는 캠프</h2>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">${ct.name} 캠프, 이런 점이 좋습니다</h2>
  <ul class="check-list">
    ${ct.slug === "canada" ? `
    <li>세계에서 가장 안전한 유학·캠프 국가로 꼽히는 교육 환경</li>
    <li>공립·사립학교 정규수업에 직접 참여하는 진짜 스쿨링</li>
    <li>미국 동부(뉴욕·보스턴)와 아이비리그 투어를 묶을 수 있는 유일한 지역</li>
    <li>토론토 직항으로 이동 부담이 적음</li>` : ""}
    ${ct.slug === "newzealand" ? `
    <li>한국의 겨울이 현지의 여름, 야외활동에 최적의 계절</li>
    <li>유학생 비율이 낮은 학교에서 현지 학생들과 깊게 어울리는 환경</li>
    <li>1월 영어캠프 + 2월 정규과정으로 기초부터 실전까지 단계적 구성</li>
    <li>3주·4주·7주 선택 + 주 단위 연장 가능한 유연함</li>` : ""}
    ${ct.slug === "japan" ? `
    <li>비행 2시간, 첫 단독 해외 경험의 부담이 가장 적은 나라</li>
    <li>천년 고도 교토에서 어학과 전통문화를 동시에</li>
    <li>일본어 전공·유학 진로를 실제로 확인해 보는 기회</li>
    <li>중2~고2 또래 소수 정예 + 인솔자 전 일정 동행</li>` : ""}
    ${ct.slug === "malaysia" ? `
    <li>영미권 캠프의 절반 수준 비용으로 캠브리지 커리큘럼 수업, 항공권까지 포함 599만원</li>
    <li>말레이시아와 싱가포르, 두 나라를 한 번의 캠프로 경험</li>
    <li>세계 치안지수 19위(싱가포르 5위), 경제특구의 안전한 환경</li>
    <li>4성급 호텔 숙소 + 한식 위주 식단으로 첫 장기 캠프의 생활 부담 최소화</li>` : ""}
    ${ct.slug === "philippines" ? `
    <li>매일 1:1 수업 4시간, 어느 캠프보다 말하기 연습량이 많은 구성</li>
    <li>대학 캠퍼스 안 기숙사 상주형, 이동 최소화로 안전과 몰입을 동시에</li>
    <li>데일카네기 리더십 아카데미 2일 과정, 영어에 발표력·자신감까지</li>
    <li>비행 4시간대, 시차 1시간, 체력 부담이 적은 첫 캠프</li>` : ""}
  </ul>
  <p class="sec-sub" style="margin-top:16px">다른 나라와 비교하기: <a href="compare.html">전체 캠프 비교표</a></p>
</div></section>
${consultSection({ camp: ct.camps[0] })}`;
  return page({
    file: `country-${ct.slug}.html`,
    title: `${ct.name} 겨울캠프·스쿨링 캠프 안내 | ${SEASON_LABEL} 모집`,
    desc: `${ct.name} 해외 겨울캠프 총정리 — ${camps.map((c) => `${c.name}(${c.price})`).join(", ")}. 홈스테이·인솔자 동행·학부모 실시간 공유.`,
    hero, body,
  });
}

function buildAgeGroup(a) {
  const fits = Object.values(CAMPS).filter((c) => c.targetGrades.some((g) => a.keys.includes(g)));
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${a.label} · ${SEASON_LABEL}</p>
    <h1>${a.label} 해외 겨울캠프</h1>
    <p class="hero-sub">${a.kw} — ${a.label}이 참가할 수 있는 캠프만 모았습니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">${a.label}이 참가 가능한 캠프</h2>
  <div class="camp-grid">${fits.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">${a.label} 캠프 선택 가이드</h2>
  ${a.slug === "elementary" ? `
  <p class="lead">초등학생의 첫 캠프는 기간과 관리 밀도가 핵심입니다. 3주 스쿨링(캐나다·뉴질랜드)이 표준이고,
  버디 친구와 홈스테이 가족이 붙는 구조라 영어가 서툴러도 소외되지 않습니다. 초등 4학년부터 참가할 수 있으며,
  유학을 염두에 둔 가정이라면 초5~6에 7주형으로 한 단계 올리는 흐름을 권합니다.</p>` : ""}
  ${a.slug === "middle" ? `
  <p class="lead">중학생은 캠프 효과가 가장 큰 시기입니다. 언어 흡수가 빠르면서 진로 고민이 시작되는 나이라,
  스쿨링(캐나다 7주·뉴질랜드)으로 유학 적성을 확인하거나, 교토 캠프로 제2외국어 진로를 탐색하는 선택이 모두 열려 있습니다.
  고교 진학 전 마지막 긴 방학을 어떻게 쓸지의 문제이기도 합니다.</p>` : ""}
  ${a.slug === "high" ? `
  <p class="lead">고등학생에게 방학 캠프는 시간 대비 효율이 중요합니다. 뉴질랜드 3주(초4~고2)는 짧고 굵은 영어 몰입을,
  교토 2주(중2~고2)는 일본어 진로 탐색을 제공합니다. 생기부·진로와 연결 지어 계획하면 캠프가 스펙이 아니라 방향이 됩니다.</p>` : ""}
  <p class="sec-sub" style="margin-top:16px">학년별 상세: ${GRADES.map((g) => `<a href="${g.slug}.html">${g.label}</a>`).join(" · ")}</p>
</div></section>
${consultSection()}`;
  return page({
    file: `${a.slug}.html`,
    title: `${a.label} 해외 겨울캠프 추천 | ${a.kw} — ${SEASON_LABEL} 모집`,
    desc: `${a.label}이 참가할 수 있는 해외 겨울캠프 — ${fits.map((c) => c.name).join(", ")}. 인솔자 동행·홈스테이·실시간 공유. 선착순 모집.`,
    hero, body,
  });
}

function buildGrade(g) {
  const fits = Object.values(CAMPS).filter((c) => c.targetGrades.includes(g.key));
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${g.label} · ${SEASON_LABEL}</p>
    <h1>${g.label} 참가 가능한<br>해외 겨울캠프</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <p class="lead" style="max-width:760px">${g.label} 자녀를 둔 학부모님께 — ${SEASON_LABEL} 시즌에 ${g.label} 학생이 참가할 수 있는 캠프는 ${fits.length}개입니다.
  캠프마다 학년 기준이 달라 아래 목록에서 바로 확인하세요.</p>
  <div class="camp-grid" style="margin-top:26px">${fits.map(campCard).join("\n")}</div>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">비슷한 또래 페이지</h2>
  <p class="sec-sub">${GRADES.filter((x) => x.slug !== g.slug).map((x) => `<a href="${x.slug}.html">${x.label}</a>`).join(" · ")}</p>
  <p class="sec-sub">${g.label} 나라별로 보기: ${COUNTRIES.map((ct) => `<a href="${g.slug}-${ct.slug}.html">${g.label} ${ct.name} 캠프</a>`).join(" · ")}</p>
  <p class="sec-sub">${g.label} 기간별로 보기: ${DURATIONS.map((d) => `<a href="${g.slug}-${d.slug}.html">${g.label} ${d.label}</a>`).join(" · ")}</p>
  <p class="sec-sub">읽어보면 좋은 글: <a href="guide-first-camp-age.html">첫 해외캠프, 몇 살이 적당할까</a> · <a href="guide-duration.html">기간은 어떻게 고를까</a></p>
</div></section>
${consultSection({ grade: g.key })}`;
  return page({
    file: `${g.slug}.html`,
    title: `${g.label} 해외캠프 | ${g.label} 겨울 어학연수·스쿨링 캠프 ${fits.length}종`,
    desc: `${g.label} 학생이 참가할 수 있는 ${SEASON_LABEL} 해외캠프 — ${fits.map((c) => c.name).join(", ")}. 대상 학년·비용·기간 안내와 상담 신청.`,
    hero, body,
  });
}

// ------------------------------------------------------------
// 학년 × 국가 조합 페이지
// ------------------------------------------------------------
function buildGradeCountry(g, ct) {
  const camps = ct.camps.map((k) => CAMPS[k]).filter((c) => c.targetGrades.includes(g.key));
  const otherCountries = COUNTRIES.filter((x) => x.slug !== ct.slug)
    .map((x) => ({ ct: x, camps: x.camps.map((k) => CAMPS[k]).filter((c) => c.targetGrades.includes(g.key)) }))
    .filter((x) => x.camps.length);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${g.label} · ${ct.name}</p>
    <h1>${g.label} ${ct.name} 캠프</h1>
    <p class="hero-sub">${SEASON_LABEL} 시즌, ${g.label} 학생이 갈 수 있는 ${ct.name} 캠프를 정리했습니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  ${camps.length ? `
  <h2 class="sec-title">${g.label}이 참가 가능한 ${ct.name} 캠프 ${camps.length}종</h2>
  <div class="camp-grid">${camps.map(campCard).join("\n")}</div>` : `
  <h2 class="sec-title">${g.label} ${ct.name} 캠프 안내</h2>
  <p class="lead" style="max-width:760px">${SEASON_LABEL} 시즌 ${ct.name} 캠프는 ${g.label} 학년이 참가 대상에 포함되지 않습니다.
  같은 학년이 참가할 수 있는 다른 나라 캠프를 아래에서 확인하시거나, 상담을 남겨 주시면 다음 시즌 개설 소식과 함께 맞는 과정을 안내해 드립니다.</p>
  ${otherCountries.length ? `<h2 class="sec-title-sm" style="margin-top:30px">${g.label}이 갈 수 있는 다른 나라 캠프</h2>
  <div class="camp-grid">${otherCountries.flatMap((x) => x.camps).map(campCard).join("\n")}</div>` : ""}`}
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">더 살펴보기</h2>
  <p class="sec-sub">
    ${g.label} 전체 캠프: <a href="${g.slug}.html">${g.label} 캠프 모아보기</a> ·
    ${ct.name} 전체: <a href="country-${ct.slug}.html">${ct.name} 캠프 안내</a> ·
    <a href="compare.html">${CAMP_COUNT}개 캠프 비교표</a></p>
  <p class="sec-sub">다른 학년 × ${ct.name}: ${GRADES.filter((x) => x.slug !== g.slug).map((x) => `<a href="${x.slug}-${ct.slug}.html">${x.label}</a>`).join(" · ")}</p>
</div></section>
${consultSection({ grade: g.key, camp: camps.length ? camps[0].slug : undefined })}`;
  return page({
    file: `${g.slug}-${ct.slug}.html`,
    title: `${g.label} ${ct.name} 캠프 | ${g.label} ${ct.name} 겨울 어학연수·스쿨링`,
    desc: `${g.label} 학생의 ${ct.name} 해외캠프 — ${camps.length ? camps.map((c) => `${c.name}(${c.price})`).join(", ") + " 참가 가능." : "이번 시즌 대상 과정과 대안 캠프 안내."} 상담 신청 가능.`,
    hero, body,
  });
}

// ------------------------------------------------------------
// 여름캠프 페이지 (2027 여름 사전 상담)
// ------------------------------------------------------------
function summerConsult() {
  return consultSection({
    camp: "summer",
    title: "여름캠프 사전 상담",
    copy: "아이 학년과 희망 국가를 남겨 주세요.<br>일정·비용이 확정되는 대로 가장 먼저 안내드립니다.",
    points: [
      "모집 시작 전 우선 안내 — 여름 시즌은 자리가 빨리 찹니다",
      "학년·영어 수준에 맞는 국가와 기간 추천",
      "겨울캠프와 여름캠프 중 어느 시즌이 맞는지도 함께 상담",
    ],
  });
}

const SUMMER_COUNTRIES = [
  { slug: "canada", name: "캐나다", note: "여름의 캐나다는 날씨가 가장 좋은 계절입니다. 스쿨링은 현지 방학과 겹쳐 서머스쿨·액티비티 중심 프로그램으로 구성됩니다." },
  { slug: "newzealand", name: "뉴질랜드", note: "우리 여름은 뉴질랜드의 겨울 학기 중이라, 현지 학교 정규수업 참여(스쿨링)에 가장 좋은 시즌입니다." },
  { slug: "japan", name: "일본", note: "여름방학 단기 일본어 연수 수요가 가장 몰리는 시즌입니다. 교토 과정의 여름 기수를 준비하고 있습니다." },
];

function buildSummerHub() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Summer 2027 · 사전 상담</p>
    <h1>2027 여름 해외캠프,<br>미리 준비하는 분들께</h1>
    <p class="hero-sub">여름 시즌은 자리가 빨리 찹니다. 일정 확정 전에 사전 상담을 남겨두시면 모집 시작과 동시에 먼저 안내드립니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">여름 해외캠프는 방학이 짧아 2~4주 과정 중심으로 운영됩니다. 2027 여름 시즌의 국가·학교·일정은 확정 단계에 있으며,
  겨울캠프와 동일한 운영 원칙(인솔자 동행, 검증된 홈스테이, 학부모 실시간 공유)이 그대로 적용됩니다.</p>
  <h2 class="sec-title-sm" style="margin-top:26px">국가별 여름 캠프 방향</h2>
  <div class="fit-grid">
    ${SUMMER_COUNTRIES.map((s) => `<div><strong><a href="summer-${s.slug}.html">${s.name} 여름캠프</a></strong><p>${s.note}</p></div>`).join("\n")}
    <div><strong>겨울이 더 맞다면</strong><p>기간이 긴 겨울 시즌이 스쿨링에는 더 유리합니다. <a href="index.html#camps">${SEASON_LABEL} 캠프</a>를 먼저 보세요.</p></div>
  </div>
  <h2 class="sec-title-sm" style="margin-top:34px">사전 상담을 남겨두면</h2>
  <ul class="check-list">
    <li>일정·비용 확정 즉시 가장 먼저 안내받습니다 (모집은 선착순입니다)</li>
    <li>아이 학년·영어 수준에 맞는 국가와 기간을 미리 좁혀둘 수 있습니다</li>
    <li>겨울캠프와 여름캠프 중 어느 시즌이 맞는지도 함께 판단해 드립니다</li>
  </ul>
</div></section>
${summerConsult()}`;
  return page({
    file: "summer.html",
    title: "여름 해외캠프 2027 | 초등·중등 여름방학 어학연수 사전 상담",
    desc: "2027 여름방학 해외캠프 사전 상담 — 캐나다·뉴질랜드·일본 2~4주 과정 준비 중. 인솔자 동행, 홈스테이, 선착순 모집. 일정 확정 시 우선 안내.",
    hero, body,
  });
}

function buildSummerCountry(s) {
  const winterCamps = (COUNTRIES.find((c) => c.slug === s.slug)?.camps || []).map((k) => CAMPS[k]);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Summer 2027 · ${s.name}</p>
    <h1>${s.name} 여름캠프</h1>
    <p class="hero-sub">2027 여름 시즌 사전 상담 접수 중</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">${s.note}</p>
  <p>2027 여름 ${s.name} 과정은 일정 확정 단계입니다. 사전 상담을 남겨두시면 모집 시작과 동시에 일정·비용을 가장 먼저 안내드리고,
  아이 학년과 목적에 맞는지 함께 판단해 드립니다. 운영 방식은 겨울 시즌과 동일합니다 — 인솔자 동행, 교육기관 검증 숙소, 학부모 실시간 공유.</p>
  ${winterCamps.length ? `<h2 class="sec-title-sm" style="margin-top:30px">겨울 시즌 ${s.name} 캠프를 먼저 볼 수도 있습니다</h2>
  <div class="camp-grid">${winterCamps.map(campCard).join("\n")}</div>` : ""}
  <p class="sec-sub" style="margin-top:20px">다른 나라 여름캠프: ${SUMMER_COUNTRIES.filter((x) => x.slug !== s.slug).map((x) => `<a href="summer-${x.slug}.html">${x.name}</a>`).join(" · ")} · <a href="summer.html">여름캠프 전체 안내</a></p>
</div></section>
${summerConsult()}`;
  return page({
    file: `summer-${s.slug}.html`,
    title: `${s.name} 여름캠프 2027 | 여름방학 ${s.name} 어학연수·스쿨링 사전 상담`,
    desc: `2027 여름방학 ${s.name} 캠프 사전 상담 — ${s.note} 일정 확정 시 우선 안내, 선착순 모집.`,
    hero, body,
  });
}

// ------------------------------------------------------------
// 확장 국가 정보 가이드 (정규 모집 외 국가 — 맞춤 상담 안내)
// ------------------------------------------------------------
const INFO_COUNTRIES = [
  { slug: "usa", name: "미국", flag: "🇺🇸", intro: "미국은 서머캠프의 본고장입니다. 대학 기숙사 캠프, 스포츠·STEM 특화 캠프까지 폭이 가장 넓지만, 그만큼 비용대도 높고 프로그램 편차가 큽니다.",
    points: ["보스턴·뉴욕 등 동부는 명문대 캠퍼스 투어와 묶기 좋음", "비용대는 주요국 중 최상위 (2~3주 1,000만원 이상이 보통)", "ESTA 전자여행허가 필요 — 수속은 어렵지 않음", "저희 캐나다 캠프는 뉴욕·보스턴·아이비리그 투어가 포함되어 미국 경험을 함께 얻는 구성입니다"] },
  { slug: "uk", name: "영국", flag: "🇬🇧", intro: "영국은 전통적인 보딩스쿨 서머코스가 강점입니다. 영국식 영어와 기숙사 문화를 경험할 수 있지만 비용이 높고 비행이 깁니다.",
    points: ["보딩스쿨 캠퍼스에서 숙식하는 기숙형이 표준", "예절·토론 중심의 클래식한 교육 문화", "비용은 미국과 비슷한 최상위권", "첫 캠프보다는 두 번째 이후, 또는 영국 유학을 겨냥한 가정에 적합"] },
  { slug: "australia", name: "호주", flag: "🇦🇺", intro: "호주는 뉴질랜드와 같은 남반구라 우리 겨울에 현지 학기가 시작됩니다. 스쿨링 환경이 좋고 도시 인프라가 발달해 있습니다.",
    points: ["우리 겨울 = 현지 여름~새 학년, 스쿨링에 유리한 학사일정", "시차 1~2시간으로 부모와 소통이 편함", "대도시 중심이라 뉴질랜드보다 도시적인 환경", "같은 남반구 스쿨링이라면 저희는 유학생 비율이 낮은 뉴질랜드 소도시 학교를 우선 추천합니다"] },
  { slug: "philippines", name: "필리핀", flag: "🇵🇭", intro: "필리핀은 1:1 수업 중심의 스파르타식 어학연수로 유명합니다. 비용 대비 수업량이 가장 많은 나라입니다.",
    points: ["1:1 맞춤 수업 4~6시간 — 말하기 훈련량은 최고 수준", "비용이 주요국의 절반 이하", "생활·문화 체험보다는 학습 집중형", "영어 몰입 '생활'을 원하면 영미권 홈스테이형, '훈련량'을 원하면 필리핀형 — 목적이 다릅니다"] },
  { slug: "singapore", name: "싱가포르", flag: "🇸🇬", intro: "싱가포르는 아시아에서 가장 안전한 영어권 도시국가입니다. 비행 6시간대에 치안·위생 걱정이 적어 저학년 첫 해외로 거론됩니다.",
    points: ["영어+중국어 이중언어 환경", "치안·위생 최상위, 도시 전체가 깨끗하고 안전", "국토가 작아 프로그램이 도시 탐방 중심 — 자연·스포츠형과는 결이 다름", "짧은 비행의 안전한 첫 경험이 목적이라면 일본 교토 과정도 함께 비교해 보세요"] },
];

function buildInfoCountry(ic) {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${ic.flag} Country Guide</p>
    <h1>${ic.name} 캠프·어학연수 가이드</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">${ic.intro}</p>
  <h2 class="sec-title-sm" style="margin-top:26px">${ic.name}, 이것만은 알고 결정하세요</h2>
  <ul class="check-list">${ic.points.map((p) => `<li>${p}</li>`).join("")}</ul>
  <div class="guide-cta" style="margin-top:30px">
    <span>${ic.name}을 포함해 아이에게 맞는 나라를 찾고 있다면</span>
    <a class="btn btn-navy" href="#consult">맞춤 상담 남기기 →</a>
  </div>
  <p class="sec-sub" style="margin-top:24px">현재 정규 모집 중인 캠프는 <a href="country-canada.html">캐나다</a> · <a href="country-newzealand.html">뉴질랜드</a> · <a href="country-japan.html">일본</a>입니다.
  ${ic.name} 프로그램은 시즌·학년에 따라 맞춤 상담으로 안내해 드립니다.
  다른 나라 가이드: ${INFO_COUNTRIES.filter((x) => x.slug !== ic.slug).map((x) => `<a href="info-${x.slug}.html">${x.name}</a>`).join(" · ")}</p>
</div></section>
${consultSection()}`;
  return page({
    file: `info-${ic.slug}.html`,
    title: `${ic.name} 어학연수·캠프 가이드 | ${ic.name} 주니어 캠프 알아보기`,
    desc: `${ic.intro} 장단점과 비용감, 우리 아이에게 맞는지 판단 기준을 정리했습니다.`,
    hero, body,
  });
}

// ------------------------------------------------------------
// 가이드(칼럼)
// ------------------------------------------------------------
// ------------------------------------------------------------
// 유학 · 세인트폴 대치 아카데미
// ------------------------------------------------------------
function studyConsult(slug, preset = {}) {
  return consultSection({
    camp: slug,
    title: preset.title || "유학 상담 신청",
    copy: preset.copy || "아이 학년과 지금 상황을 남겨 주세요.<br>과정·시기·비용을 함께 정리해 안내해 드립니다.",
    points: preset.points || [
      "학년·영어 수준에 맞는 과정과 시작 시점 안내",
      "1년 총비용 견적 (항공·용돈·비자 포함 기준)",
      "캠프 먼저 다녀오는 순서도 함께 상담해 드립니다",
    ],
  });
}

function studyNav(current = "") {
  const items = [
    ["study.html", "유학 전체"],
    ["study-newzealand.html", "뉴질랜드 유학"],
    ["study-canada.html", "캐나다 관리형"],
    ["study-compare.html", "두 나라 비교"],
    ["study-cost.html", "비용"],
    ["study-process.html", "준비 절차"],
    ["study-visa.html", "비자·서류"],
    ["study-guardian.html", "현지 관리"],
    ["study-after.html", "졸업 후 진로"],
    ["study-faq.html", "자주 묻는 질문"],
    ["study-guide.html", "유학 가이드"],
    ["elc.html", "대학 토플면제"],
  ].filter(([href]) => href !== current);
  return `<p class="sec-sub" style="margin-top:18px">유학 안내 더 보기: ${items.map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")}</p>`;
}

function stpaulNav(current = "") {
  const items = [
    ["stpaul.html", "세인트폴 대치 아카데미"],
    ["stpaul-admission.html", "입학 안내"],
    ["stpaul-curriculum.html", "수업·커리큘럼"],
    ["stpaul-tuition.html", "학비"],
    ["stpaul-college.html", "진학 실적"],
    ["stpaul-life.html", "학교생활"],
    ["stpaul-vs-abroad.html", "해외 유학과 비교"],
    ["stpaul-faq.html", "자주 묻는 질문"],
  ].filter(([href]) => href !== current);
  return `<p class="sec-sub" style="margin-top:18px">세인트폴 안내 더 보기: ${items.map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")}</p>`;
}

function studyCard(s) {
  return `<a class="camp-card" href="${s.slug}.html">
    <span class="camp-flag">${s.flag || "🏫"} ${s.type}</span>
    <h3>${s.name}</h3>
    <p class="camp-tag">${s.tag}</p>
    <dl class="camp-meta">
      <div><dt>대상</dt><dd>${s.target.split("(")[0].trim()}</dd></div>
      <div><dt>비용</dt><dd>${s.price}</dd></div>
    </dl>
    <span class="camp-more">자세히 보기 →</span>
  </a>`;
}

function buildStudyHub() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Study Abroad</p>
    <h1>중·고등 유학,<br>세 가지 길이 있습니다</h1>
    <p class="hero-sub">뉴질랜드로, 캐나다로, 또는 나가지 않고 대치동에서.<br>같은 목표를 두고도 아이 성향과 남은 기간에 따라 답이 달라집니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">러닝트래블이 안내하는 3가지 길</h2>
  <p class="sec-sub">두 곳은 저희 겨울캠프가 진행되는 바로 그 학교·교육청이고, 한 곳은 서울 대치동에 있습니다. 캠프를 다녀오지 않은 학생도 상담받으실 수 있습니다.</p>
  <div class="camp-grid">
    ${Object.values(STUDY).map(studyCard).join("\n")}
    ${studyCard({ ...STPAUL, flag: "🏫", type: "대치동 미국 교과과정" })}
  </div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">먼저 정해야 할 세 가지</h2>
  <div class="fit-grid">
    <div><strong>기간 — 한 텀인가, 졸업까지인가</strong><p>뉴질랜드는 10주 한 텀부터, 캐나다는 학기 단위로 시작합니다. 처음부터 졸업을 목표로 잡을 필요는 없습니다. <a href="study-compare.html">두 나라 비교</a></p></div>
    <div><strong>예산 — 1년치가 아니라 총액으로</strong><p>참가비 외에 항공·용돈·비자가 붙습니다. 2년 또는 졸업까지의 총액을 계산해 보고 결정하세요. <a href="study-cost.html">비용 항목별 정리</a></p></div>
    <div><strong>귀국 가능성 — 열어 둘 것인가</strong><p>돌아올 수 있다고 보시면 학년 단위로 끊는 편이 깔끔합니다. <a href="study-after.html">졸업 후 진로와 귀국</a></p></div>
  </div>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">캠프에서 유학으로, 저희가 권하는 순서</h2>
  <ol class="step-list">
    <li>겨울캠프 3~7주로 현지 학교와 홈스테이 생활을 직접 겪어봅니다</li>
    <li>아이의 적응력·의지를 확인한 뒤 텀(학기) 단위로 짧게 시작합니다</li>
    <li>잘 맞으면 연장, 뉴질랜드는 NCEA, 캐나다는 온타리오 졸업장까지 이어집니다</li>
    <li>해외 출국이 부담스럽다면 대치동에서 미국 교과과정을 밟는 길도 있습니다</li>
  </ol>
  <p class="sec-sub" style="margin-top:16px">뉴질랜드 유학은 <a href="newzealand.html">뉴질랜드 겨울캠프</a>와 같은 학교, 캐나다 관리형은 <a href="canada-3week.html">캐나다 3주 캠프</a>와 같은 교육청에서 진행됩니다. 준비 일정은 <a href="study-process.html">유학 준비 절차</a>에 월 단위로 정리해 두었습니다.</p>
  <p class="sec-sub" style="margin-top:10px">고3 졸업(예정)생·재수생이라면 중·고등 유학 대신 <a href="elc.html">미국·캐나다 대학 토플면제교육원</a> — 국내 6개월 과정으로 TOEFL 없이 대학에 진학하는 길을 보세요.</p>
</div></section>

<section class="section alt"><div class="wrap">
  <h2 class="sec-title">학년별로 시작 시점의 의미가 다릅니다</h2>
  <div class="fit-grid">
    ${STUDY_GRADES.map((g) => `<div><strong><a href="${g.slug}.html">${g.label} 유학</a></strong><p>${g.lead}</p></div>`).join("\n    ")}
  </div>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">보내기 전에 점검할 것들</h2>
  <ul class="check-list">${STUDY_INFO.checklist.map((c) => `<li>${c}</li>`).join("")}</ul>
  <p class="sec-sub" style="margin-top:16px">현지에서 누가 어떻게 관리하는지는 <a href="study-guardian.html">관리 체계 안내</a>에, 비자와 서류는 <a href="study-visa.html">비자·서류 안내</a>에 정리해 두었습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">이런 질문을 많이 받습니다</h2>
  <div class="faq-list">
    ${STUDY_INFO.faq.slice(0, 4).map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n    ")}
  </div>
  <p style="margin-top:20px"><a class="btn btn-navy" href="study-faq.html">유학 질문 전체 보기 →</a>
  <a class="btn btn-line" style="margin-left:8px" href="study-guide.html">유학 가이드 읽기 →</a></p>
  ${studyNav("study.html")}
</div></section>
${studyConsult("")}`;
  return page({
    file: "study.html",
    title: "중·고등 유학 안내 | 뉴질랜드 유학·캐나다 관리형 유학·세인트폴 대치 아카데미",
    desc: "중·고등 조기유학 세 가지 길 — 뉴질랜드 Waiuku College 유학(연 3,200만원), 캐나다 나이아가라 관리형 유학(연 4,250만원), 세인트폴 대치 아카데미(미국 교과과정). 비용·절차·비자·관리 체계와 학년별 안내.",
    hero, body,
  });
}

function buildStudy(key) {
  const s = STUDY[key];
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${s.flag} ${s.type}</p>
    <h1>${s.name}</h1>
    <p class="hero-sub">${s.tag}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">모집 안내</h2>
  <dl class="info-list">
    <div><dt>대상</dt><dd>${s.target}</dd></div>
    <div><dt>기간</dt><dd>${s.period}</dd></div>
    <div><dt>학사 일정</dt><dd>${s.terms}</dd></div>
    <div><dt>비용</dt><dd><strong>${s.price}</strong><br><span class="dim">${s.priceNote}</span></dd></div>
    <div><dt>비용에 포함</dt><dd>${s.includes}</dd></div>
    <div><dt>문의·신청</dt><dd><a href="#consult">하단 상담 신청 양식으로 문의해 주세요 →</a></dd></div>
  </dl>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">이 과정의 하이라이트</h2>
  <ul class="check-list">${s.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
</div></section>
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">${s.school}</h2>
  <p class="lead">${s.schoolDesc}</p>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">유학 중 관리는 이렇게 합니다</h2>
  <ul class="safe-list">${s.manage.map((m) => `<li>${m}</li>`).join("")}</ul>
</div></section>
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">진행 절차</h2>
  <ol class="step-list">${s.procedure.map((p) => `<li>${p}</li>`).join("")}</ol>
  <p class="sec-sub" style="margin-top:14px">${s.faqNote}</p>
  <p class="sec-sub" style="margin-top:10px">월 단위 준비 일정은 <a href="study-process.html">유학 준비 절차</a>에, ${key === "study-newzealand" ? "뉴질랜드 학생비자" : "캐나다 학습허가"} 요건은 <a href="study-visa.html">비자·서류 안내</a>에 정리해 두었습니다.</p>
</div></section>
<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">참가비 외에 따로 드는 비용</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${STUDY_INFO.extraCosts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">1년 총액 계산은 <a href="study-cost.html">유학 비용 정리</a>에서 보실 수 있습니다. 확정 견적은 상담 후 등록 시점 환율로 다시 잡아 드립니다.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title-sm">유학이 아직 망설여진다면</h2>
  <p>${key === "study-newzealand"
    ? `같은 학교에서 진행하는 <a href="newzealand.html"><strong>뉴질랜드 겨울캠프</strong></a>(3~7주)로 먼저 겪어보세요. 캠프 후 현지에서 바로 텀 단위 연장도 가능합니다.`
    : `같은 교육청에서 진행하는 <a href="canada-3week.html"><strong>캐나다 3주 겨울캠프</strong></a>로 먼저 겪어보세요. 캠프는 유학 결정 전 아이의 적응력을 확인하는 가장 안전한 방법입니다.`}</p>
  <p style="margin-top:14px">해외로 나가는 것 자체가 부담이라면 <a href="stpaul.html">세인트폴 대치 아카데미</a>처럼 국내에서 미국 교과과정을 밟는 길도 있습니다. <a href="stpaul-vs-abroad.html">항목별 비교</a></p>
  <p class="sec-sub" style="margin-top:16px">학년별 안내: ${STUDY_GRADES.map((g) => `<a href="${g.slug}.html">${g.key}</a>`).join(" · ")}</p>
  <p class="sec-sub" style="margin-top:10px">다른 과정: ${Object.values(STUDY).filter((x) => x.slug !== s.slug).map((x) => `<a href="${x.slug}.html">${x.name}</a>`).join(" · ")} · <a href="study-compare.html">두 나라 비교표</a> · <a href="study.html">유학 전체 안내</a></p>
</div></section>
${studyConsult(s.slug, { title: `${s.name} 상담 신청` })}`;
  return page({
    file: `${s.slug}.html`,
    title: `${s.name} | ${s.school} — ${s.price} · ${s.target.split("(")[0].trim()}`,
    desc: `${s.tag}. ${s.period}. ${s.price}, ${s.school}. 관리 체계·비용·절차 안내와 상담 신청.`,
    hero, body,
    jsonld: { "@context": "https://schema.org", "@type": "Service", name: s.name, provider: { "@type": "Organization", name: "러닝트래블" } },
  });
}

function buildStPaul() {
  const s = STPAUL;
  const d = STPAUL_DETAIL;
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">🏫 서울 대치동 · 미국 교과과정</p>
    <h1>${s.name}</h1>
    <p class="hero-sub">${s.tag}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">한눈에 보기</h2>
  <dl class="info-list">
    ${s.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
    <div><dt>모집</dt><dd>${s.target}</dd></div>
    <div><dt>학비</dt><dd><strong>${s.price}</strong><br><span class="dim">${s.priceNote}</span></dd></div>
    <div><dt>문의·신청</dt><dd><a href="#consult">하단 상담 신청 양식으로 문의해 주세요 →</a></dd></div>
  </dl>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">어떤 학교인가요</h2>
  <p class="lead">${s.name}는 미국 Saint Paul American School System(SPASS)이 운영하는 서울 캠퍼스입니다.
  미네소타 본교를 비롯해 베이징·파리 등 8개 캠퍼스가 같은 학사 기준으로 운영되고, 서울에서도 미국 커리큘럼
  그대로 전 과목을 영어로 수업합니다. Common Core(영어·수학)·NGSS(과학) 표준을 따르며, 졸업하면 미국 고교 졸업장이 수여됩니다.</p>
  <p style="margin-top:14px">해외로 나가지 않고 미국 교과과정을 밟는다는 점이 핵심입니다. 아이는 집에서 통학하고, 부모는 매일 얼굴을 보면서
  진로만 미국 쪽으로 돌리는 구조입니다. 대신 <strong>국내 학력이 인정되지 않는 미인가 과정</strong>이라는 점은 입학 전에 반드시 짚고 가야 합니다.</p>
  <div class="two-col" style="margin-top:24px">
    <div>
      <h3 class="sec-title-sm">이런 학생에게 맞습니다</h3>
      <ul class="check-list">
        <li>해외 대학 진학을 목표로 두고 있는 학생</li>
        <li>유학은 아직 이르지만 미국 과정을 밟고 싶은 학생</li>
        <li>질문과 토론이 많은, 한국 교실이 답답한 학생</li>
        <li>부모가 곁에서 사춘기를 지켜보고 싶은 가정</li>
      </ul>
    </div>
    <div>
      <h3 class="sec-title-sm">이런 경우는 다시 생각해 보세요</h3>
      <ul class="check-list">
        <li>국내 대학 진학이 1순위인 경우 (검정고시 경로를 거쳐야 합니다)</li>
        <li>영어로 수업을 따라갈 준비가 아직 안 된 경우</li>
        <li>영어를 생활 언어로 만드는 것이 목표인 경우 — 그건 <a href="study.html">해외 유학</a> 쪽입니다</li>
      </ul>
    </div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <h2 class="sec-title">자세히 보기</h2>
  <div class="camp-grid">
    <a class="camp-card" href="stpaul-admission.html"><span class="camp-flag">📝 입학</span><h3>입학 안내</h3><p class="camp-tag">모집 일정, 입학 테스트, 제출 서류, 학년 배정까지</p><span class="camp-more">자세히 보기 →</span></a>
    <a class="camp-card" href="stpaul-curriculum.html"><span class="camp-flag">📚 수업</span><h3>커리큘럼 · AP</h3><p class="camp-tag">8~12학년 과목 구성, AP, 제2외국어, MAP 진단</p><span class="camp-more">자세히 보기 →</span></a>
    <a class="camp-card" href="stpaul-tuition.html"><span class="camp-flag">💳 비용</span><h3>학비 안내</h3><p class="camp-tag">등록비·학비·교재비와 첫 해 실제 총액</p><span class="camp-more">자세히 보기 →</span></a>
    <a class="camp-card" href="stpaul-college.html"><span class="camp-flag">🎓 진학</span><h3>진학 실적 · 상담</h3><p class="camp-tag">합격 실적과 College Counselor 상담 체계</p><span class="camp-more">자세히 보기 →</span></a>
    <a class="camp-card" href="stpaul-life.html"><span class="camp-flag">🏫 생활</span><h3>학교생활</h3><p class="camp-tag">하루 일과, 클럽, 통학과 학사, 학교 분위기</p><span class="camp-more">자세히 보기 →</span></a>
    <a class="camp-card" href="stpaul-vs-abroad.html"><span class="camp-flag">⚖️ 비교</span><h3>해외 유학과 비교</h3><p class="camp-tag">비용·생활·졸업장·되돌릴 여지를 표로</p><span class="camp-more">자세히 보기 →</span></a>
  </div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">하루는 이렇게 흘러갑니다</h2>
  <p>${s.daily}</p>
  <p style="margin-top:10px"><strong>클럽 활동</strong> · ${s.clubs}</p>
  <p style="margin-top:8px"><strong>진학 지원</strong> · ${s.counseling}</p>
  <p style="margin-top:8px"><strong>학습 진단</strong> · ${d.curriculum.map}</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">진학 실적</h2>
  <ul class="check-list">${s.results.map((r) => `<li>${r}</li>`).join("")}</ul>
  <p class="sec-sub" style="margin-top:14px">학교 발표 기준이며 연도별로 달라집니다. 최근 실적은 <a href="stpaul-college.html">진학 안내</a>에서 함께 보실 수 있습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">입학 전 꼭 확인하세요</h2>
  <p>${s.notice}</p>
  ${stpaulNav("stpaul.html")}
  <p class="sec-sub" style="margin-top:10px">해외 유학과 비교해 보기: <a href="study-canada.html">캐나다 관리형 유학</a> · <a href="study-newzealand.html">뉴질랜드 중·고등 유학</a> · <a href="study.html">유학 전체 안내</a></p>
</div></section>
${studyConsult(s.slug, { title: "세인트폴 대치 아카데미 상담", copy: "학년과 현재 영어 수준, 희망 진학 방향을 남겨 주세요.<br>입학 시기와 준비할 것을 정리해 안내해 드립니다.", points: ["학년 배정과 입학 테스트 안내", "학비 외 실제로 드는 비용 정리", "해외 유학과 비교해 함께 상담 가능"] })}`;
  return page({
    file: "stpaul.html",
    title: `세인트폴 대치 아카데미 | 대치동 미국 교과과정 — 학비·모집·진학 실적`,
    desc: `유학 없이 대치동에서 미국 교과과정, SPASS 서울 캠퍼스, 8~12학년 95명 소수정예, AP 15과목 이상, 존스홉킨스·UC버클리 등 진학 실적. 학비 연 2,540만원, 2월·8월 학기 모집. 입학 절차와 상담 안내.`,
    hero, body,
    jsonld: { "@context": "https://schema.org", "@type": "School", name: s.name, address: { "@type": "PostalAddress", addressLocality: "서울 강남구 대치동" } },
  });
}

// ------------------------------------------------------------
// 미국·캐나다 대학 토플면제교육원 (ELC)
// ------------------------------------------------------------
function buildElc() {
  const s = ELC;
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">🎓 국내 6개월 → 미국·캐나다 대학</p>
    <h1>${s.name}</h1>
    <p class="hero-sub">${s.tag}</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">한눈에 보기</h2>
  <dl class="info-list">
    <div><dt>기관</dt><dd>${s.engName} — 2011년 서울 설립 공인 ESL 교육기관</dd></div>
    <div><dt>과정</dt><dd>국내 6개월 공인 ESL + 국내대학 교양과목 이수 → 미국·캐나다 파트너 대학 진학</dd></div>
    <div><dt>지원 자격</dt><dd>${s.target}</dd></div>
    <div><dt>모집</dt><dd>2027학년도 신·편입생 수시모집(겨울학기) · 45명 선착순</dd></div>
    <div><dt>비용</dt><dd>${s.price} · 대학별 연간 유학 비용은 아래 표 참고</dd></div>
    <div><dt>문의·신청</dt><dd><a href="#consult">하단 상담 신청 양식으로 문의해 주세요 →</a></dd></div>
  </dl>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">어떤 과정인가요</h2>
  <p class="lead">${s.intro}</p>
  <p style="margin-top:14px">핵심은 순서를 바꾸는 것입니다. 영어 점수를 만들어 유학을 떠나는 대신, <strong>한국에서 먼저 6개월간 대학 수업을 감당할 영어를 만들고</strong>
  미국 대학이 학점으로 인정하는 국내대학 교양과목까지 이수한 뒤 출국합니다. 그래서 TOEFL·SAT·내신 없이 지원이 가능하고, 현지에서 어학연수로 보내는 기간과 비용이 줄어듭니다.</p>
  <ul class="check-list" style="margin-top:20px">${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">2027 겨울학기 모집 개요</h2>
  <dl class="info-list">
    ${s.schedule.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
  </dl>
  <h3 class="sec-title-sm" style="margin-top:28px">지원 서류</h3>
  <ul class="check-list">${s.applyDocs.map((d) => `<li>${d}</li>`).join("")}</ul>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">입학 전형은 이렇게 진행됩니다</h2>
  <ol class="step-list">${s.admission.map((a) => `<li>${a}</li>`).join("")}</ol>
  <p class="sec-sub" style="margin-top:14px">공인 영어 성적이 없어도 지원할 수 있습니다. 심층면접은 원어민 면접관과 한국 교수님이 함께 진행하며, 한국어로 면접을 볼 수 있습니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">6개월 교육과정</h2>
  <dl class="info-list">
    <div><dt>하루 일과</dt><dd>${s.curriculum.daily}</dd></div>
    <div><dt>반 편성</dt><dd>${s.curriculum.levels}</dd></div>
    <div><dt>TOEFL 면제 요건</dt><dd>${s.curriculum.waiver}</dd></div>
    <div><dt>교양 이수 요건</dt><dd>${s.curriculum.gpa}</dd></div>
  </dl>
  <p class="sec-sub" style="margin-top:14px">TESOL 석사 등 원어민 교수진이 듣기·말하기(L/S)와 읽기·쓰기(R/W)를 나눠 맡아, 미국 대학 부설 어학원과 같은 방식으로 수업합니다.</p>
</div></section>

<section class="section alt"><div class="wrap">
  <h2 class="sec-title">진학 로드맵 — 세 가지 트랙</h2>
  <p class="sec-sub">6개월 과정을 마친 뒤 학생의 성적·전공·예산에 따라 트랙을 정합니다.</p>
  <div class="fit-grid">
    ${s.tracks.map(([k, v]) => `<div><strong>${k}</strong><p>${v}</p></div>`).join("\n    ")}
  </div>
  <p class="sec-sub" style="margin-top:16px">${s.clep}</p>
</div></section>

<section class="section"><div class="wrap">
  <h2 class="sec-title">대학별 입학 요건 · 연간 예상 유학 비용</h2>
  <p class="table-hint">← 옆으로 밀어서 보세요 →</p>
  <div class="table-wrap"><table class="cmp">
    <thead><tr><th>대학명</th><th>공인영어</th><th>대학교양</th><th>내신</th><th>학비</th><th>기숙사·식비</th><th>연간 합계</th></tr></thead>
    <tbody>${s.universities.map((u) => `<tr><th>${u[0]}</th>${u.slice(1).map((c, i) => `<td>${i === 5 ? `<strong>${c}</strong>` : c}</td>`).join("")}</tr>`).join("\n    ")}</tbody>
  </table></div>
  <ul class="check-list" style="margin-top:20px">${s.universityNotes.map((n) => `<li>${n}</li>`).join("")}</ul>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">${s.warmup.title}</h2>
  <dl class="info-list">
    <div><dt>기간</dt><dd>${s.warmup.period}</dd></div>
    <div><dt>대상</dt><dd>${s.warmup.target}</dd></div>
  </dl>
  <ul class="check-list" style="margin-top:18px">${s.warmup.points.map((p) => `<li>${p}</li>`).join("")}</ul>
  <p class="sec-sub" style="margin-top:14px">일찍 합격해 두면 정식 개강 전 토요일 과정으로 영어 워밍업과 교양학점 선이수를 시작할 수 있습니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title-sm">자주 묻는 질문</h2>
  <div class="faq-list">
    ${s.faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n    ")}
  </div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">신청 전 확인하세요</h2>
  <p>${s.notice}</p>
  <p class="sec-sub" style="margin-top:16px">중·고등학생이라면 시기가 다릅니다: <a href="study.html">중·고등 유학 안내</a> · <a href="stpaul.html">세인트폴 대치 아카데미</a> — 고교 단계에서 미리 준비하는 길을 보세요.</p>
</div></section>
${studyConsult(s.slug, {
    title: "미국·캐나다 대학 토플면제교육원 상담",
    copy: "학생의 현재 상황(졸업 연도·검정고시·대학 재학 여부)과 희망 전공을 남겨 주세요.<br>지원 자격과 전형 일정, 비용을 정리해 안내해 드립니다.",
    points: ["모집 45명 선착순 — 마감 전 상담을 권합니다", "영어 성적이 없어도 지원 가능 여부 확인", "대학별 비용·장학금 절감 방법까지 함께 안내"],
  })}`;
  return page({
    file: "elc.html",
    title: `미국·캐나다 대학 토플면제교육원 | TOEFL·SAT·내신 없이 미국 대학 진학 — 2027 겨울학기 모집`,
    desc: `국내 6개월 공인 ESL 과정으로 TOEFL·SAT·내신 없이 미국·캐나다 대학 진학. 텍사스·뉴욕·캘리포니아 주립대, UCLA·UC버클리 편입 트랙, 캐나다 세네카까지 20개 대학. 고3 졸업생·재수생·검정고시생 대상, 2027년 1월 개강 45명 선착순.`,
    hero, body,
    jsonld: { "@context": "https://schema.org", "@type": "Service", name: s.name, provider: { "@type": "Organization", name: "러닝트래블" } },
  });
}

// ------------------------------------------------------------
// 세인트폴 상세 페이지
// ------------------------------------------------------------
function stpaulPage({ file, kicker, h1, sub, body, title, desc, jsonld = null }) {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${kicker}</p>
    <h1>${h1}</h1>
    <p class="hero-sub">${sub}</p>
  </div></section>`;
  return page({
    file, title, desc, hero, jsonld,
    body: `${body}
<section class="${altAfter(body)}"><div class="wrap narrow">
  ${stpaulNav(file)}
  <p class="sec-sub" style="margin-top:10px">해외 유학도 함께 보고 계시다면: <a href="study.html">유학 전체 안내</a> · <a href="study-compare.html">뉴질랜드·캐나다 비교</a> · <a href="stpaul-vs-abroad.html">세인트폴과 유학 비교</a></p>
</div></section>
${studyConsult(STPAUL.slug, { title: "세인트폴 대치 아카데미 상담", copy: "학년과 현재 영어 수준, 희망 진학 방향을 남겨 주세요.<br>입학 시기와 준비할 것을 정리해 안내해 드립니다.", points: ["학년 배정과 입학 테스트 안내", "학비 외 실제로 드는 비용 정리", "해외 유학과 비교해 함께 상담 가능"] })}`,
  });
}

function buildStPaulAdmission() {
  const a = STPAUL_DETAIL.admission;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">모집 일정</h2>
  <p class="lead">${a.schedule}</p>
  <dl class="info-list" style="margin-top:20px">
    <div><dt>대상</dt><dd>${STPAUL.target}</dd></div>
    <div><dt>정원</dt><dd>전교 95명 · 학년당 12~22명</dd></div>
    <div><dt>테스트비</dt><dd>25만원 (지원 시 1회)</dd></div>
    <div><dt>등록비</dt><dd>450만원 (신입생 1회)</dd></div>
  </dl>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">입학까지의 순서</h2>
  <ol class="step-list">${a.steps.map((x) => `<li>${x}</li>`).join("")}</ol>
  <p class="sec-sub" style="margin-top:14px">상담부터 입학까지 보통 1~2개월이 걸립니다. 학년별 자리가 남아 있는지에 따라 달라지니, 희망 학기 3~4개월 전에는 문의해 주세요.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">입학 테스트</h2>
  <p class="lead">${a.testNote}</p>
  <h3 class="sec-title-sm" style="margin-top:26px">준비 서류</h3>
  <ul class="check-list">${a.docs.map((x) => `<li>${x}</li>`).join("")}</ul>
  <p class="sec-sub" style="margin-top:14px">서류 양식과 제출 방법은 상담 후 안내해 드립니다. 학교 방문 참관을 함께 잡아 드릴 수 있습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">학년 배정은 어떻게 되나요</h2>
  <p>한국 학년이 그대로 옮겨지지 않습니다. 미국 학제는 9~12학년이 고등학교이고, 테스트 결과와 이수 이력을 함께 보고 배정합니다.
  한 학년 아래로 배정되는 경우도 있는데, 이건 실력이 부족해서라기보다 <strong>졸업 요건을 여유 있게 채우기 위한 판단</strong>인 경우가 많습니다.</p>
  <p style="margin-top:14px">고2에 편입학하면 남은 기간이 짧아 학점·시험·원서 일정이 한꺼번에 몰립니다. 고3은 상담 후 결정하는데,
  12학년만 다니고 졸업하는 형태는 대학 지원 일정과 겹쳐 권해 드리지 않는 경우가 많습니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title-sm">입학 전 반드시 확인할 것</h2>
  <p>${STPAUL.notice}</p>
  <p style="margin-top:14px">다니던 학교의 학적 처리(자퇴 또는 유예)를 어떻게 할지가 실제로는 가장 큰 결정입니다.
  담임 선생님과 먼저 이야기해 보시고, 국내 대학 가능성을 열어 두실 거라면 <a href="stpaul-faq.html">검정고시 경로</a>도 함께 확인하세요.</p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-admission.html",
    kicker: "📝 입학 안내",
    h1: "세인트폴 대치 아카데미<br>입학 안내",
    sub: "2월·8월 학기 모집 · 중2~고2 편입학 · 입학 테스트와 학년 배정까지",
    body,
    title: "세인트폴 대치 아카데미 입학 안내 | 모집 일정·입학 테스트·제출 서류",
    desc: "세인트폴 대치 아카데미 입학 절차 — 2월·8월 학기 모집, 중2~고2 편입학, 입학 테스트(25만원)와 학년 배정 기준, 제출 서류, 등록비 450만원. 상담부터 입학까지 순서를 정리했습니다.",
  });
}

function buildStPaulCurriculum() {
  const c = STPAUL_DETAIL.curriculum;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">수업은 이렇게 구성됩니다</h2>
  <p class="lead">${c.intro}</p>
  <div class="table-wrap" style="margin-top:22px"><table class="cmp"><tbody>
    ${c.subjects.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">AP를 어떻게 활용하나요</h2>
  <p>AP는 고등학교에서 듣는 대학 수준 과목입니다. 점수가 좋으면 대학 학점으로 인정되기도 하지만, 실제로 더 큰 역할은
  지원서에서 <strong>"어려운 과목을 골라 들었다"는 신호</strong>가 된다는 점입니다. 15과목 이상 개설되어 있어도 다 들을 필요는 없습니다.
  진학하려는 전공 방향에 맞춰 3~5과목을 제대로 하는 편이 낫고, 그 선택을 진학 상담에서 함께 잡아 줍니다.</p>
  <p style="margin-top:14px">개설 과목은 학기와 수요에 따라 달라집니다. 관심 있는 과목이 있으시면 상담 때 개설 여부를 확인해 드립니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">지금 어디쯤 있는지 확인하는 방법</h2>
  <p class="lead">${c.map}</p>
  <p style="margin-top:14px">한국 학교의 중간·기말 등수와 달리, MAP은 미국 전역 학생과의 상대 위치를 보여줍니다.
  성적표 한 장으로 "우리 아이가 미국 대학에 지원할 만한 위치인가"를 학기 중에 가늠할 수 있다는 점이 실질적인 차이입니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">한국 학교와 무엇이 다른가</h2>
  <div class="fit-grid">
    <div><strong>평가 방식</strong><p>시험 한 번이 아니라 과제·발표·에세이·참여도가 학기 내내 누적됩니다. 벼락치기가 통하지 않는 구조입니다.</p></div>
    <div><strong>수업 형태</strong><p>50분 6교시, 교사가 설명하고 학생이 받아 적는 방식보다 질문과 토론의 비중이 큽니다.</p></div>
    <div><strong>과목 선택</strong><p>학년이 올라가면 계열과 AP를 스스로 고릅니다. 선택이 곧 진학 전략이라 상담이 함께 갑니다.</p></div>
    <div><strong>영어 부담</strong><p>ESL 완충 수업이 따로 없습니다. 그래서 입학 테스트에서 수업을 따라갈 수준인지 먼저 확인합니다.</p></div>
  </div>
  <p class="sec-sub" style="margin-top:18px">입학 테스트와 학년 배정 기준은 <a href="stpaul-admission.html">입학 안내</a>에서 보실 수 있습니다.</p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-curriculum.html",
    kicker: "📚 커리큘럼",
    h1: "미국 교과과정 8~12학년,<br>과목은 이렇게 짜입니다",
    sub: "Common Core·NGSS 기준 · AP 15과목 이상 · 제2외국어 · 연 3회 MAP 진단",
    body,
    title: "세인트폴 대치 아카데미 커리큘럼 | 미국 교과과정·AP·MAP 진단",
    desc: "세인트폴 대치 아카데미 수업 구성 — Common Core·NGSS 기준의 영어·수학·과학·사회, 중국어·스페인어 제2외국어, AP 15과목 이상, TOEFL·SAT 방과후, 연 3회 MAP 진단까지 정리했습니다.",
  });
}

function buildStPaulTuition() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">학비 안내</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${STPAUL.tuition.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">${STPAUL.priceNote}</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">첫 해에 실제로 드는 돈</h2>
  <p class="lead">등록비는 신입생이 한 번만 냅니다. 그래서 1학년차와 2학년차의 금액이 다릅니다.</p>
  <div class="table-wrap" style="margin-top:20px"><table class="cmp">
    <thead><tr><th>구분</th><th>첫 해</th><th>다음 해부터</th></tr></thead>
    <tbody>
      <tr><th>등록비</th><td>450만원</td><td>없음</td></tr>
      <tr><th>연간 학비</th><td>2,540만원</td><td>2,540만원</td></tr>
      <tr><th>교재비</th><td>54만 6천원</td><td>54만 6천원</td></tr>
      <tr><th>테스트비</th><td>25만원</td><td>없음</td></tr>
      <tr><th>급식·현장학습</th><td>실비</td><td>실비</td></tr>
      <tr><th>TOEFL·SAT 방과후 (선택)</th><td>과목당 월 50만원</td><td>과목당 월 50만원</td></tr>
    </tbody>
  </table></div>
  <p class="sec-sub" style="margin-top:14px">학비는 학교 정책에 따라 변경될 수 있습니다. 납부 방법과 분납 가능 여부는 상담 시 확인해 드립니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">해외 유학과 비교하면</h2>
  <p>같은 1년을 두고 보면 <a href="study-newzealand.html">뉴질랜드 유학</a>은 연 3,200만원, <a href="study-canada.html">캐나다 관리형</a>은 연 4,250만원입니다.
  여기에 항공료·용돈·비자 진행비가 별도로 붙습니다. 세인트폴은 학비는 낮지만 집에서 통학하니 숙식비가 들지 않는다는 점이 가장 큰 차이입니다.</p>
  <p style="margin-top:14px">대신 대치동까지의 통학이나, 지방에서 오는 경우 학교 근처 학사 비용을 따로 보셔야 합니다.
  항목별 비교는 <a href="stpaul-vs-abroad.html">세인트폴과 해외 유학 비교</a>, 유학 쪽 비용은 <a href="study-cost.html">유학 비용 정리</a>에 있습니다.</p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-tuition.html",
    kicker: "💳 학비",
    h1: "세인트폴 대치 아카데미<br>학비 안내",
    sub: "연간 학비 2,540만원 · 등록비 450만원 · 첫 해와 다음 해의 차이까지",
    body,
    title: "세인트폴 대치 아카데미 학비 | 등록비·연간 학비·첫 해 총액 정리",
    desc: "세인트폴 대치 아카데미 학비 — 연간 2,540만원, 신입생 등록비 450만원, 교재비 54만 6천원, 테스트비 25만원, 급식·현장학습 실비. 첫 해와 다음 해 금액 차이, 해외 유학과의 비용 비교까지.",
  });
}

function buildStPaulCollege() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">진학 실적</h2>
  <ul class="check-list">${STPAUL.results.map((r) => `<li>${r}</li>`).join("")}</ul>
  <p class="sec-sub" style="margin-top:14px">학교 발표 기준이며 연도에 따라 달라집니다. 최신 합격자 명단은 상담 때 확인해 드립니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">진학 상담은 이렇게 이뤄집니다</h2>
  <p class="lead">${STPAUL.counseling}</p>
  <p style="margin-top:14px">한국 고등학교의 진학 상담과 다른 점은 <strong>학년마다 할 일이 정해져 있다</strong>는 것입니다.
  9학년부터 내신과 활동을 쌓고, 11학년에 시험과 과목 선택을 정리하고, 12학년에 원서를 씁니다.
  전담 카운슬러가 이 일정을 개별로 관리하기 때문에 마지막 1년에 몰아서 준비하는 상황이 잘 생기지 않습니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">학년별로 무엇을 하나</h2>
  <ul class="check-list">
    <li><strong>9~10학년</strong> — 내신(GPA) 관리와 영어 실력 끌어올리기, 클럽·봉사 활동 시작</li>
    <li><strong>11학년</strong> — SAT·ACT 준비, AP 과목 선택, 관심 전공 좁히기, 진학 상담 본격화</li>
    <li><strong>12학년 상반기</strong> — 원서·에세이·추천서, 얼리 지원 여부 결정</li>
    <li><strong>12학년 하반기</strong> — 합격 결과 정리, 장학금 협의, 비자·출국 준비</li>
  </ul>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">국내 대학으로 방향을 돌린다면</h2>
  <p>국내 학력이 인정되지 않으므로 검정고시로 고졸 학력을 취득해 일반 전형에 지원하거나,
  대학별 재외국민·외국인 특별전형 요건을 확인해 지원하게 됩니다. 특별전형은 대학마다 요건이 달라
  <strong>목표 대학의 모집요강을 직접 확인</strong>하셔야 합니다.</p>
  <p style="margin-top:14px">국내 진학을 진지하게 놓고 계신다면 11학년이 되기 전에 이 갈래를 정하시는 편이 좋습니다.
  더 자세한 내용은 <a href="guide-stpaul-college-path.html">미인가 과정에서 대학까지, 실제 경로</a>에 정리해 두었습니다.</p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-college.html",
    kicker: "🎓 진학",
    h1: "졸업 후 어디로 가나",
    sub: "미국 명문대 진학 실적과 전담 College Counselor의 학년별 상담 체계",
    body,
    title: "세인트폴 대치 아카데미 진학 실적 | 미국 대학 합격·College Counseling",
    desc: "세인트폴 대치 아카데미 진학 — 존스홉킨스·UC버클리·UCLA·NYU 등 합격 실적, UCLA 출신 전담 College Counselor 주 3회 상담, 학년별 준비 일정, 국내 대학으로 방향을 돌릴 때의 경로까지.",
  });
}

function buildStPaulLife() {
  const l = STPAUL_DETAIL.life;
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">하루 일과</h2>
  <p class="lead">${STPAUL.daily}</p>
  <p style="margin-top:14px">50분 수업 6교시가 끝나면 방과후 시간입니다. Study Hall에서 과제를 정리하는 학생도 있고,
  클럽 활동이나 TOEFL·SAT 반으로 이어지는 학생도 있습니다. 방과후는 선택이라 아이의 일정에 맞춰 조정할 수 있습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">클럽과 활동</h2>
  <p class="lead">${STPAUL.clubs}</p>
  <p style="margin-top:14px">미국 대학 지원에서 활동 기록은 성적만큼 봅니다. 다만 개수를 늘리는 것보다
  <strong>한두 개를 3~4년 끌고 가면서 역할이 커지는 쪽</strong>이 훨씬 좋게 읽힙니다. 클럽 선택도 진학 상담에서 함께 이야기합니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">통학과 생활</h2>
  <dl class="info-list">
    <div><dt>통학</dt><dd>${l.commute}</dd></div>
    <div><dt>급식·현장학습</dt><dd>${l.meal}</dd></div>
    <div><dt>학교 분위기</dt><dd>${l.culture}</dd></div>
  </dl>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">첫 학기에 흔히 겪는 일</h2>
  <ul class="check-list">
    <li>수업은 알아듣는데 발표에서 막힙니다. 대부분 한 학기면 풀립니다</li>
    <li>과제가 매주 나옵니다. 몰아서 하는 습관이 있으면 첫 성적표에서 드러납니다</li>
    <li>영어로 농담을 못 알아들어 서운해합니다. 이게 지나가면 학교가 편해집니다</li>
    <li>한국 친구들과 멀어질까 걱정합니다. 통학제라 주말 관계는 유지되는 편입니다</li>
  </ul>
</div></section>`;
  return stpaulPage({
    file: "stpaul-life.html",
    kicker: "🏫 학교생활",
    h1: "학교에서 하루를<br>어떻게 보내나",
    sub: "6교시 수업과 방과후, 20개 이상 클럽, 통학과 학사, 그리고 첫 학기의 현실",
    body,
    title: "세인트폴 대치 아카데미 학교생활 | 하루 일과·클럽·통학 안내",
    desc: "세인트폴 대치 아카데미 학교생활 — 8:45 조회부터 6교시 수업, 방과후 Study Hall과 클럽 20개 이상, 통학제 학교의 등하교와 학사 이용, 급식·현장학습 실비, 첫 학기 적응까지.",
  });
}

function buildStPaulVsAbroad() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">한 표로 보기</h2>
  <p class="sec-sub">왼쪽은 국내에서 미국 교과과정을 밟는 길, 오른쪽은 해외로 나가는 길입니다.</p>
  <div class="table-wrap" style="margin-top:18px"><table class="cmp">
    <thead><tr><th>비교 항목</th><th>세인트폴 대치 아카데미</th><th>뉴질랜드·캐나다 유학</th></tr></thead>
    <tbody>${STPAUL_DETAIL.vsAbroad.map(([k, a, b]) => `<tr><th>${k}</th><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
  </table></div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">같은 점부터 짚고 갑니다</h2>
  <p class="lead">두 경로 모두 <strong>국내 학력이 그대로 이어지지 않습니다.</strong></p>
  <p style="margin-top:14px">세인트폴은 미인가 과정이라 검정고시가 필요하고, 해외 유학은 귀국 시 편입학 학력 심의를 거칩니다.
  "안 되면 한국 학교로 돌아가면 되지"라는 계획은 생각만큼 매끄럽지 않습니다. 두 길 모두 <strong>돌아올 경로를 알고 나가는 것</strong>이 먼저입니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">이렇게 갈리는 편입니다</h2>
  <div class="fit-grid">
    <div><strong>독립심이 있고 새 환경을 즐기는 아이</strong><p>해외 유학 쪽이 얻는 게 많습니다. 영어보다 생활력이 먼저 늘어서 옵니다.</p></div>
    <div><strong>학업 의지는 있는데 혼자 살기는 이른 아이</strong><p>세인트폴처럼 집에서 다니는 미국 과정이 안전합니다.</p></div>
    <div><strong>사춘기를 곁에서 보고 싶은 가정</strong><p>통학제의 장점이 큽니다. 매일 얼굴을 보면서 진로만 바꾸는 구조입니다.</p></div>
    <div><strong>영어를 생활 언어로 만들고 싶다면</strong><p>해외 유학입니다. 국내 과정은 학교 밖이 한국어 환경이라 한계가 있습니다.</p></div>
  </div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">결정 전에 해볼 만한 것</h2>
  <p>겨울캠프 3주를 다녀오면 아이가 해외 생활을 감당할 수 있는 성향인지 대체로 드러납니다.
  캠프 후에도 "더 있고 싶다"고 하면 유학, "집이 낫다"고 하면 국내 과정 — 이렇게 정한 가정이 실제로 많습니다.
  <a href="compare.html">캠프 비교하기</a></p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-vs-abroad.html",
    kicker: "⚖️ 비교",
    h1: "국내 미국 과정 vs 해외 유학",
    sub: "비용·생활·졸업장·되돌릴 여지까지, 두 길을 같은 기준으로 놓고 봅니다",
    body,
    title: "세인트폴 대치 아카데미 vs 조기유학 | 비용·생활·졸업장 비교",
    desc: "국내 미국 교과과정과 해외 조기유학을 같은 기준으로 비교 — 보호자, 연간 비용, 졸업장, 국내 학력 인정, 영어 환경, 되돌릴 여지. 아이 성향별로 어느 쪽이 맞는지 정리했습니다.",
  });
}

function buildStPaulFaq() {
  const faq = STPAUL_DETAIL.faq;
  const body = `
<section class="section"><div class="wrap narrow">
  <div class="faq-list">
    ${faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n    ")}
  </div>
  <p class="sec-sub" style="margin-top:20px">여기 없는 질문은 상담 양식에 남겨 주시면 확인 후 답변드립니다.
  입학 절차는 <a href="stpaul-admission.html">입학 안내</a>, 비용은 <a href="stpaul-tuition.html">학비 안내</a>를 함께 보세요.</p>
</div></section>`;
  return stpaulPage({
    file: "stpaul-faq.html",
    kicker: "❓ 자주 묻는 질문",
    h1: "세인트폴 대치 아카데미<br>자주 묻는 질문",
    sub: "학적 처리, 국내 대학, 영어 수준, 학비까지 — 상담에서 가장 많이 받는 질문들",
    body,
    title: "세인트폴 대치 아카데미 FAQ | 학적·검정고시·영어 수준·학비 질문",
    desc: "세인트폴 대치 아카데미에 대해 가장 많이 받는 질문 — 한국 학교 학적 처리, 국내 대학 진학과 검정고시, 영어 수준, 해외 유학으로 전환, 실제 총비용, 고3 편입학 가능 여부까지.",
    jsonld: {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  });
}

// ------------------------------------------------------------
// 유학 상세 페이지
// ------------------------------------------------------------
function altAfter(body){
  const m=String(body).match(/<section class="section( alt)?"/g)||[];
  const last=m[m.length-1]||"";
  return last.includes("alt") ? "section" : "section alt";
}

function studyPage({ file, kicker, h1, sub, body, title, desc, jsonld = null }) {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${kicker}</p>
    <h1>${h1}</h1>
    <p class="hero-sub">${sub}</p>
  </div></section>`;
  return page({
    file, title, desc, hero, jsonld,
    body: `${body}
<section class="${altAfter(body)}"><div class="wrap narrow">
  ${studyNav(file)}
  <p class="sec-sub" style="margin-top:10px">해외로 나가기가 부담스럽다면: <a href="stpaul.html">세인트폴 대치 아카데미</a> · <a href="stpaul-vs-abroad.html">유학과 비교해 보기</a></p>
</div></section>
${studyConsult("")}`,
  });
}

function buildStudyCompare() {
  const nz = STUDY["study-newzealand"], ca = STUDY["study-canada"];
  const rows = [
    ["대상", nz.target.split("(")[0].trim(), ca.target.split("(")[0].trim()],
    ["학교", "Waiuku College (Year 9~13 남녀공학)", "나이아가라 가톨릭 교육청 소속 고교 8곳 중 배정"],
    ["시작 단위", "10주 한 텀부터 (연 4텀)", "학기 단위 (9월·2월 시작)"],
    ["연간 비용", nz.price, ca.price],
    ["포함 항목", nz.includes, ca.includes],
    ["졸업 자격", "NCEA Level 1~3", "온타리오 고교 졸업장(OSSD)"],
    ["영어 지원", "ESOL 수업", "ESL 무료 제공"],
    ["현지 관리", "학교 국제학생 담당 교사 + 홈스테이 관리자", "법적 가디언 역할의 현지 관리 선생님 + 월 1회 리포트"],
    ["환경", "오클랜드에서 차로 1시간, 유학생 비율 5% 미만 소도시", "나이아가라 지역, 학교 8곳이라 배정 폭이 넓음"],
    ["학사 일정", "1월 말 새 학년 시작 (남반구)", "9월 새 학년 시작 (북반구)"],
    ["연계 캠프", "뉴질랜드 겨울캠프와 같은 학교", "캐나다 3주 겨울캠프와 같은 교육청"],
  ];
  const body = `
<section class="section"><div class="wrap">
  <h2 class="sec-title">뉴질랜드 · 캐나다 한눈에 비교</h2>
  <p class="table-hint">표를 옆으로 밀어서 보실 수 있습니다.</p>
  <div class="table-wrap"><table class="cmp">
    <thead><tr><th>비교 항목</th><th>뉴질랜드 중·고등 유학</th><th>캐나다 관리형 유학</th></tr></thead>
    <tbody>${rows.map(([k, a, b]) => `<tr><th>${k}</th><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>
  </table></div>
  <p style="margin-top:22px"><a class="btn btn-navy" href="study-newzealand.html">뉴질랜드 유학 자세히 →</a>
  <a class="btn btn-navy" style="margin-left:8px" href="study-canada.html">캐나다 관리형 자세히 →</a></p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">실제로는 여기서 갈립니다</h2>
  <div class="fit-grid">
    <div><strong>아직 반신반의한다면</strong><p>뉴질랜드입니다. 10주 한 텀만 다녀보고 결정할 수 있어 진입 문턱이 낮습니다.</p></div>
    <div><strong>졸업까지 갈 생각이라면</strong><p>캐나다 쪽 계산이 깔끔합니다. 필수 19학점·봉사 40시간·문해력 시험으로 요건이 명확합니다.</p></div>
    <div><strong>한국말 쓸 일을 줄이고 싶다면</strong><p>와이우쿠는 유학생 비율을 5% 미만으로 유지합니다. 소도시라 자극은 적지만 영어 환경은 확실합니다.</p></div>
    <div><strong>학업 심화 과목이 필요하다면</strong><p>나이아가라 교육청은 AP·SHSM 프로그램을 갖춘 고교가 있어 선택지가 넓습니다.</p></div>
    <div><strong>1월 출국을 원한다면</strong><p>남반구인 뉴질랜드는 1월 말이 새 학년 시작이라 일정이 맞아떨어집니다.</p></div>
    <div><strong>예산 차이</strong><p>연 1,050만원 차이입니다. 다만 항공료는 캐나다가 더 들 수 있어 총액으로 보셔야 합니다.</p></div>
  </div>
  <p class="sec-sub" style="margin-top:18px">항목별 총비용은 <a href="study-cost.html">유학 비용 정리</a>에서 확인하세요.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title-sm">고르기 어렵다면</h2>
  <p>두 나라 모두 저희 겨울캠프가 같은 학교·같은 교육청에서 진행됩니다.
  <a href="newzealand.html">뉴질랜드 캠프</a>나 <a href="canada-3week.html">캐나다 3주 캠프</a>를 다녀오면 아이 입에서 답이 나옵니다.
  캠프를 유학 사전답사로 쓰시는 가정이 많은 이유입니다.</p>
</div></section>`;
  return studyPage({
    file: "study-compare.html",
    kicker: "📋 비교",
    h1: "뉴질랜드와 캐나다,<br>어디로 보낼까",
    sub: "학제·시작 단위·졸업장·비용·환경을 같은 기준으로 놓고 비교합니다",
    body,
    title: "뉴질랜드 유학 vs 캐나다 유학 비교 | 비용·학제·졸업장 한눈에",
    desc: "중·고등 조기유학 두 나라 비교 — 뉴질랜드 Waiuku College(연 3,200만원·10주 텀 시작·NCEA)와 캐나다 나이아가라 관리형(연 4,250만원·학기 시작·온타리오 졸업장)의 차이를 표로 정리했습니다.",
  });
}

function buildStudyCost() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">참가비에 들어 있는 것</h2>
  <div class="table-wrap"><table class="cmp">
    <thead><tr><th>구분</th><th>뉴질랜드 유학</th><th>캐나다 관리형</th></tr></thead>
    <tbody>
      <tr><th>연간 참가비</th><td><strong>${STUDY["study-newzealand"].price}</strong></td><td><strong>${STUDY["study-canada"].price}</strong></td></tr>
      <tr><th>포함 항목</th><td>${STUDY["study-newzealand"].includes}</td><td>${STUDY["study-canada"].includes}</td></tr>
    </tbody>
  </table></div>
  <p class="sec-sub" style="margin-top:14px">즉 학교와 숙식은 해결된 금액입니다. 여기에 따로 나가는 돈이 있습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">따로 나가는 비용</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${STUDY_INFO.extraCosts.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">다 더하면 뉴질랜드는 3,800만원 안팎, 캐나다는 4,700만원 안팎이 1년 현실적인 총액입니다. 환율이 움직이면 여기서 또 달라집니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">국내 미국 과정과 비교하면</h2>
  <div class="table-wrap"><table class="cmp">
    <thead><tr><th>구분</th><th>세인트폴 대치 아카데미</th><th>해외 유학</th></tr></thead>
    <tbody>
      <tr><th>연간 학비·참가비</th><td>2,540만원 (등록비 450만원 첫 해 1회)</td><td>3,200만~4,250만원</td></tr>
      <tr><th>숙식</th><td>집에서 통학 (숙식비 없음)</td><td>홈스테이비가 참가비에 포함</td></tr>
      <tr><th>항공·비자</th><td>없음</td><td>왕복 항공 + 비자 진행비</td></tr>
      <tr><th>그 외</th><td>교재비·테스트비, 급식·현장학습 실비</td><td>용돈, UM 서비스, 방학 귀국 항공</td></tr>
    </tbody>
  </table></div>
  <p class="sec-sub" style="margin-top:14px">자세한 학비는 <a href="stpaul-tuition.html">세인트폴 학비 안내</a>에 있습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">비용을 계산할 때 놓치기 쉬운 것</h2>
  <ul class="check-list">
    <li><strong>2년차·3년차를 함께 계산하세요.</strong> 1년치를 겨우 맞춰 시작하면 대부분 2년차에 무리가 옵니다</li>
    <li><strong>환율.</strong> 등록 시점 환율로 견적이 확정됩니다. 몇 달 사이에 수백만원이 움직이기도 합니다</li>
    <li><strong>방학 귀국.</strong> 뉴질랜드는 12~1월, 캐나다는 여름 약 2개월이 방학입니다. 귀국하면 항공이 한 번 더 붙습니다</li>
    <li><strong>중간에 부모가 방문하는 비용.</strong> 첫 해에 한 번은 다녀오시는 가정이 많습니다</li>
    <li><strong>현지 활동비.</strong> 교내 활동은 포함이지만, 친구들과의 개인 활동은 용돈에서 나갑니다</li>
  </ul>
  <p class="sec-sub" style="margin-top:16px">확정 견적은 상담 후 등록 시점 기준으로 다시 잡아 드립니다. 지금 예산 안에서 가능한 선택지를 함께 정리해 드릴 수 있습니다.</p>
</div></section>`;
  return studyPage({
    file: "study-cost.html",
    kicker: "💰 비용",
    h1: "유학 1년,<br>실제로 드는 돈",
    sub: "참가비에 포함된 것과 따로 나가는 것 — 항공·용돈·비자까지 펼쳐서 봅니다",
    body,
    title: "조기유학 비용 | 뉴질랜드·캐나다 1년 총비용과 별도 항목 정리",
    desc: "중·고등 조기유학 비용 정리 — 뉴질랜드 연 3,200만원, 캐나다 연 4,250만원에 포함된 항목과 항공료·수속비·비자·용돈 등 별도 비용, 1년 현실 총액, 국내 미국 교과과정과의 비교까지.",
  });
}

function buildStudyProcess() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">준비 타임라인</h2>
  <p class="sec-sub">출국까지 보통 6~8개월을 봅니다. 학교 자리와 비자 심사 때문에 앞당기기 어려운 구간이 있습니다.</p>
  <div class="table-wrap" style="margin-top:18px"><table class="cmp">
    <thead><tr><th>시점</th><th>할 일</th><th>내용</th></tr></thead>
    <tbody>${STUDY_INFO.timeline.map(([t, w, d]) => `<tr><th>${t}</th><td><strong>${w}</strong></td><td>${d}</td></tr>`).join("")}</tbody>
  </table></div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">진행 절차</h2>
  <ol class="step-list">${STUDY["study-newzealand"].procedure.map((p) => `<li>${p}</li>`).join("")}</ol>
  <p class="sec-sub" style="margin-top:14px">두 나라 모두 큰 흐름은 같습니다. 다만 뉴질랜드는 텀 시작일, 캐나다는 학기 시작일에 맞춰 역산하기 때문에
  출발 시점에 따라 준비를 시작해야 하는 달이 달라집니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">출국 전 학교 정리</h2>
  <p class="lead">재학 중인 학교와 상의해 유학 처리를 해두셔야 합니다.</p>
  <p style="margin-top:14px">학교와 교육청에 따라 절차가 조금씩 달라서, 담임 선생님과 먼저 이야기해 보시는 것이 순서입니다.
  여기서 어떻게 정리했느냐가 나중에 귀국해 복귀할 때 그대로 영향을 줍니다.
  귀국 시 절차는 <a href="study-after.html">졸업 후 진로와 귀국</a>에 정리해 두었습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">출국 전 체크리스트</h2>
  <ul class="check-list">
    <li>여권 유효기간 (체류 기간 + 6개월 이상 남아 있는지)</li>
    <li>비자 승인 서류와 입학허가서 사본 (원본은 기내 수하물로)</li>
    <li>영문 예방접종 기록과 복용 중인 약, 알레르기 정보</li>
    <li>현지 계좌 또는 해외 사용 가능한 체크카드</li>
    <li>홈스테이 주소·연락처, 현지 관리 담당자 연락처</li>
    <li>한국 휴대폰 정지·유심 처리와 연락 수단 (가족 대화방 준비)</li>
    <li>학교 제출용 여권 사진과 서류 사본 일체</li>
  </ul>
  <p class="sec-sub" style="margin-top:16px">비자와 서류는 <a href="study-visa.html">비자·서류 안내</a>에서 국가별로 정리해 두었습니다.</p>
</div></section>`;
  return studyPage({
    file: "study-process.html",
    kicker: "🗓 준비 절차",
    h1: "언제부터<br>무엇을 준비하나",
    sub: "출국 6~8개월 전부터의 준비 일정과 출국 전 체크리스트",
    body,
    title: "조기유학 준비 절차 | 출국까지 6~8개월 타임라인과 체크리스트",
    desc: "중·고등 유학 준비 일정 — 출국 6~8개월 전 방향 정하기부터 학교 선정, 지원서·성적표, 입학허가, 비자 신청, 항공·보험, 출국 오리엔테이션까지 월 단위로 정리했습니다.",
  });
}

function buildStudyVisa() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">국가별 비자</h2>
  <div class="table-wrap"><table class="cmp">
    <thead><tr><th>국가</th><th>비자 종류</th><th>기본 요건</th></tr></thead>
    <tbody>${STUDY_INFO.visa.map(([c, v, r]) => `<tr><th>${c}</th><td>${v}</td><td>${r}</td></tr>`).join("")}</tbody>
  </table></div>
  <p class="sec-sub" style="margin-top:14px">${STUDY_INFO.visaNote}</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">공통으로 필요한 서류</h2>
  <ul class="check-list">
    <li>여권 (체류 예정 기간 + 여유를 두고 유효기간 확인)</li>
    <li>학교 입학허가서 — 이게 나와야 비자 진행이 시작됩니다</li>
    <li>최근 2년 성적표·재학증명서 (영문 발급, 2~3주 소요되기도 합니다)</li>
    <li>재정 능력 증명 (잔고증명·재직증명 등, 국가별 기준 상이)</li>
    <li>숙소 확정 서류 (홈스테이 배정 확인서)</li>
    <li>미성년자 후견인·보호자 관련 서류</li>
    <li>건강검진 결과 (요구되는 경우)</li>
  </ul>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">진행할 때 자주 막히는 지점</h2>
  <div class="fit-grid">
    <div><strong>영문 서류 발급 기간</strong><p>학교 성적표 영문본은 바로 나오지 않는 경우가 많습니다. 미리 신청해 두세요.</p></div>
    <div><strong>입학허가 지연</strong><p>학교 자리가 확정돼야 허가서가 나옵니다. 인기 학년은 대기가 생기기도 합니다.</p></div>
    <div><strong>심사 기간</strong><p>시기에 따라 달라집니다. 출국일을 빠듯하게 잡으면 항공권을 다시 끊는 일이 생깁니다.</p></div>
    <div><strong>미성년자 후견인 서류</strong><p>캐나다는 공증이 필요한 서류가 있습니다. 절차를 미리 확인해야 일정이 밀리지 않습니다.</p></div>
  </div>
  <p class="sec-sub" style="margin-top:18px">비자 진행은 저희가 서류 준비부터 함께 챙깁니다. 다만 승인 여부는 각국 이민당국이 결정합니다.</p>
</div></section>`;
  return studyPage({
    file: "study-visa.html",
    kicker: "🛂 비자·서류",
    h1: "비자와 서류,<br>무엇을 준비하나",
    sub: "뉴질랜드 학생비자 · 캐나다 학습허가의 요건과 공통 준비 서류",
    body,
    title: "유학 비자·서류 안내 | 뉴질랜드 학생비자·캐나다 학습허가 준비",
    desc: "중·고등 유학 비자 안내 — 뉴질랜드 학생비자와 캐나다 학습허가(Study Permit)의 기본 요건, 입학허가서·재정 증명·숙소 확정·미성년자 후견인 서류 등 공통 준비물과 자주 막히는 지점.",
  });
}

function buildStudyGuardian() {
  const nz = STUDY["study-newzealand"], ca = STUDY["study-canada"];
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">현지에서 누가 아이를 봅니까</h2>
  <p class="lead">부모가 옆에 없는 1년 동안 이 자리가 비어 있으면, 아이는 모든 걸 혼자 감당해야 합니다.
  '관리형'이라는 말이 실제로 무엇을 하는지 나라별로 정리했습니다.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">🇳🇿 뉴질랜드 — 학교 중심 이중 관리</h2>
  <ul class="safe-list">${nz.manage.map((m) => `<li>${m}</li>`).join("")}</ul>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">🇨🇦 캐나다 — 법적 가디언 + 월간 리포트</h2>
  <ul class="safe-list">${ca.manage.map((m) => `<li>${m}</li>`).join("")}</ul>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">홈스테이는 배정보다 사후 관리</h2>
  <p>처음 배정보다 그다음이 중요합니다. 캐나다는 18세 이상 가족 전원 경찰 신원조회, 가정방문 실사, 성향 맞춤 매칭의
  3중 검증을 거치고, 그래도 맞지 않으면 가정을 바꾸고 이사까지 지원합니다. 뉴질랜드는 학교 국제학생 담당 교사와
  홈스테이 관리자가 이중으로 봅니다.</p>
  <p style="margin-top:14px">어느 유학원을 알아보시든 <strong>"안 맞으면 바꿔 줄 수 있느냐"</strong>를 꼭 물어보세요. 대답이 흐릿하면 그 부분이 약한 곳입니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">부모가 확인할 네 가지</h2>
  <ul class="check-list">
    <li>현지에 상주하는 한국인 담당자가 있는가, 몇 명이 몇 명을 보는가</li>
    <li>긴급 상황 연락 순서가 정해져 있는가 (호스트 → 현지 담당 → 한국)</li>
    <li>성적·출석이 정기적으로 오는가, 요청해야 오는가</li>
    <li>홈스테이 변경이 실제로 가능한가, 비용은 누가 부담하는가</li>
  </ul>
  <p class="sec-sub" style="margin-top:16px">캐나다 관리형은 네이버 밴드로 시간표와 활동 사진을 실시간 공유합니다.
  캠프에서 쓰던 방식 그대로라, 캠프를 다녀오신 학부모님들은 익숙하실 겁니다.</p>
</div></section>`;
  return studyPage({
    file: "study-guardian.html",
    kicker: "🤝 현지 관리",
    h1: "현지에서<br>누가 아이를 봅니까",
    sub: "법적 가디언, 홈스테이 검증과 변경, 월간 리포트 — 관리형이 실제로 하는 일",
    body,
    title: "관리형 유학 관리 체계 | 법적 가디언·홈스테이 관리·월간 리포트",
    desc: "조기유학 현지 관리 체계 — 캐나다 법적 가디언과 월 1회 정기 리포트, 뉴질랜드 학교 국제학생 담당 교사와 홈스테이 관리자의 이중 관리, 홈스테이 3중 검증과 변경 절차까지 정리했습니다.",
  });
}

function buildStudyAfter() {
  const body = `
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">졸업하면 어디로 가나</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${STUDY_INFO.paths.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title">1년 뒤에 정하게 되는 것</h2>
  <p class="lead">대부분의 가정이 첫 1년을 마치고 세 갈래 중 하나를 고릅니다.</p>
  <ol class="step-list" style="margin-top:16px">
    <li><strong>연장해서 졸업까지</strong> — 아이가 자리를 잡았고 진학 목표가 해외로 굳어진 경우</li>
    <li><strong>다른 나라·과정으로 이동</strong> — 예를 들어 캐나다에서 미국 고교로 옮기는 경로</li>
    <li><strong>한국 복귀</strong> — 국내 입시로 방향을 돌리거나, 경험만 얻고 돌아오는 경우</li>
  </ol>
  <p class="sec-sub" style="margin-top:16px">어느 쪽이든 <strong>학년 단위로 끊는 편</strong>이 깔끔합니다. 학기 중간 귀국은 양쪽 모두 애매해집니다.</p>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">한국으로 돌아올 때</h2>
  <p>해외에서 이수한 과정을 국내 학년으로 환산하는 편입학 학력 심의를 거칩니다.
  성적표·재학증명서·출입국 기록 같은 서류를 미리 갖춰 두셔야 하고, 현지 학교에서 발급받아야 하는 것들이 있어
  <strong>귀국을 결정하면 현지에서부터 챙기기 시작</strong>해야 합니다.</p>
  <p style="margin-top:14px">출국 전 학적 처리를 어떻게 해두었는지가 여기서 그대로 영향을 줍니다.
  준비 단계는 <a href="study-process.html">유학 준비 절차</a>를 참고하세요.</p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">진학 준비는 11학년부터</h2>
  <p>어느 경로든 SAT·에세이·활동 기록은 따로 준비해야 합니다. 마지막 1년에 몰아서 되는 일이 아니라,
  11학년이 되면 목표 대학군을 정하고 역산해 준비하시길 권합니다.
  국내에서 미국 과정을 밟는 경우의 진학 경로는 <a href="stpaul-college.html">세인트폴 진학 안내</a>에 정리해 두었습니다.</p>
</div></section>`;
  return studyPage({
    file: "study-after.html",
    kicker: "🎓 졸업 후",
    h1: "유학 다음은<br>어떻게 되나",
    sub: "NCEA·온타리오 졸업장으로 갈 수 있는 길, 그리고 한국으로 돌아올 때의 절차",
    body,
    title: "유학 후 진로 | NCEA·온타리오 졸업장 대학 진학과 귀국 절차",
    desc: "조기유학 이후 경로 — 뉴질랜드 NCEA와 캐나다 온타리오 졸업장(OSSD)으로 지원 가능한 대학, 미국 대학 준비, 1년 뒤 연장·이동·귀국의 세 갈래, 한국 복귀 시 편입학 학력 심의까지.",
  });
}

function buildStudyFaq() {
  const faq = STUDY_INFO.faq;
  const body = `
<section class="section"><div class="wrap narrow">
  <div class="faq-list">
    ${faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n    ")}
  </div>
  <p class="sec-sub" style="margin-top:20px">세인트폴 대치 아카데미 관련 질문은 <a href="stpaul-faq.html">세인트폴 자주 묻는 질문</a>에,
  캠프 관련 질문은 <a href="faq.html">캠프 FAQ</a>에 따로 정리해 두었습니다.</p>
</div></section>`;
  return studyPage({
    file: "study-faq.html",
    kicker: "❓ 자주 묻는 질문",
    h1: "유학, 이런 질문을<br>많이 받습니다",
    sub: "시작 단위, 관리, 비용, 적응 문제까지 — 상담에서 실제로 나오는 질문들",
    body,
    title: "조기유학 자주 묻는 질문 | 기간·비용·관리·적응 문제",
    desc: "중·고등 유학 FAQ — 캠프 없이 상담 가능한지, 현지 관리는 누가 하는지, 한 텀만 다녀와도 되는지, 영어가 부족해도 되는지, 적응하지 못하면 어떻게 되는지, 학비 납부 방식까지 답변했습니다.",
    jsonld: {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  });
}

function buildStudyGrade(g) {
  const picks = g.picks.map((k) => STUDY[k]);
  const others = STUDY_GRADES.filter((x) => x.slug !== g.slug);
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">${g.lead}</p>
  <h2 class="sec-title-sm" style="margin-top:26px">이 학년이라면 이렇게 시작합니다</h2>
  <p>${g.fit}</p>
  <h2 class="sec-title-sm" style="margin-top:26px">놓치기 쉬운 부분</h2>
  <p>${g.caution}</p>
</div></section>

<section class="section alt"><div class="wrap">
  <h2 class="sec-title">${g.label}에게 권하는 과정</h2>
  <div class="camp-grid">
    ${picks.map(studyCard).join("\n")}
    ${studyCard({ ...STPAUL, flag: "🏫", type: "대치동 미국 교과과정" })}
  </div>
</div></section>

<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">먼저 캠프로 확인해 보는 방법</h2>
  <p>${g.key} 학생이 참가할 수 있는 겨울캠프가 있습니다. 3~7주 동안 현지 학교와 홈스테이를 겪어보면
  유학을 감당할 수 있는 성향인지 대체로 드러납니다. 캠프와 같은 학교·교육청으로 이어지기 때문에
  사전답사 성격이 강합니다.</p>
  <p style="margin-top:14px"><a class="btn btn-navy" href="grade-${g.slug.replace("study-grade-", "")}.html">${g.label} 캠프 보기 →</a>
  <a class="btn btn-line" style="margin-left:8px" href="study-compare.html">두 나라 비교 →</a></p>
</div></section>

<section class="section alt"><div class="wrap narrow">
  <h2 class="sec-title-sm">준비 순서와 비용</h2>
  <p>출국까지 6~8개월을 봅니다. 월 단위 일정은 <a href="study-process.html">준비 절차</a>에,
  1년 총비용은 <a href="study-cost.html">비용 정리</a>에 있습니다. 현지 관리 체계가 궁금하시면
  <a href="study-guardian.html">관리 체계 안내</a>를 보세요.</p>
  <p class="sec-sub" style="margin-top:16px">다른 학년: ${others.map((x) => `<a href="${x.slug}.html">${x.label}</a>`).join(" · ")}</p>
</div></section>`;
  return studyPage({
    file: `${g.slug}.html`,
    kicker: `${g.key} 유학`,
    h1: `${g.label},<br>지금 유학을 시작한다면`,
    sub: g.lead,
    body,
    title: `${g.label} 유학 | ${g.key} 조기유학 시작 시점과 과정 선택`,
    desc: `${g.label} 조기유학 안내 — ${g.lead} ${g.fit}`,
  });
}

function buildStudyGuideIndex() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Study Guide</p>
    <h1>유학 가이드</h1>
    <p class="hero-sub">조기유학 시기, 1년 실제 비용, 관리형의 의미, 귀국 시 학적까지.<br>결정하기 전에 정리해 두면 좋은 글들입니다.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <div class="guide-grid">${STUDY_GUIDES.map(guideCard).join("\n")}</div>
  <p class="sec-sub" style="margin-top:24px">캠프 쪽 글은 <a href="guide.html">캠프 가이드</a>에 따로 모아 두었습니다.</p>
</div></section>
${studyConsult("")}`;
  return page({
    file: "study-guide.html",
    title: "유학 가이드 | 조기유학 시기·비용·관리형·귀국 학적 정리",
    desc: "중·고등 조기유학을 준비하는 학부모를 위한 글 모음 — 유학 적기, 1년 실제 총비용, 관리형 유학의 의미, 뉴질랜드와 캐나다 비교, 출국 전 영어 준비, 귀국 시 학적 처리, 국내 미국 과정과의 비교까지.",
    hero, body,
  });
}


function guideCard(g) {
  return `<a class="guide-card" href="${g.slug}.html"><h3>${g.title}</h3><p>${g.desc}</p><span class="guide-more">읽어보기 →</span></a>`;
}

function buildGuideIndex() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Camp Guide</p>
    <h1>캠프 가이드</h1>
    <p class="hero-sub">보내기 전에 읽어두면 좋은 글들 — 나이, 준비물, 홈스테이, 안전, 그리고 그 후까지.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  <div class="guide-grid">${GUIDES.map(guideCard).join("\n")}</div>
  <p class="sec-sub" style="margin-top:24px">유학을 고민 중이시라면 <a href="study-guide.html">유학 가이드</a>에 조기유학 시기·비용·관리 체계에 관한 글을 따로 모아 두었습니다.</p>
</div></section>
${consultSection()}`;
  return page({
    file: "guide.html",
    title: "해외캠프 가이드 | 첫 캠프 나이·준비물·홈스테이·안전 체크리스트",
    desc: "해외캠프를 준비하는 학부모를 위한 가이드 모음 — 적정 나이, 스쿨링과 어학연수 차이, 준비물, 용돈, 안전 체크리스트, 유학 연계까지.",
    hero, body,
  });
}

function buildGuideArticle(g) {
  const isStudy = g.cat === "study";
  const pool = isStudy ? STUDY_GUIDES : GUIDES;
  const others = pool.filter((x) => x.slug !== g.slug).slice(0, 3);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${isStudy ? "유학 가이드" : "캠프 가이드"}</p>
    <h1>${g.title}</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow guide-body">
  ${g.body}
  <div class="guide-cta">
    <span>${isStudy ? "우리 아이에게 맞는 유학 과정이 궁금하다면" : "우리 아이에게 맞는 캠프가 궁금하다면"}</span>
    <a class="btn btn-navy" href="${isStudy ? "study-compare.html" : "compare.html"}">${isStudy ? "유학 과정 비교해 보기 →" : "캠프 비교해 보기 →"}</a>
  </div>
  <p class="sec-sub" style="margin-top:26px">함께 읽으면 좋은 글: ${others.map((o) => `<a href="${o.slug}.html">${o.title}</a>`).join(" · ")} · <a href="${isStudy ? "study-guide.html" : "guide.html"}">전체 보기</a></p>
</div></section>
${isStudy ? studyConsult("") : consultSection()}`;
  return page({
    file: `${g.slug}.html`,
    title: g.metaTitle,
    desc: g.desc,
    hero, body,
    jsonld: { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, datePublished: g.date, author: { "@type": "Organization", name: "러닝트래블" } },
  });
}

// ------------------------------------------------------------
// CSS
// ------------------------------------------------------------
const CSS = `/* 러닝트래블 — 생성 파일 (build.js 재생성) */
:root{
  --navy:#16324f; --navy-2:#1d4067; --navy-dark:#0e2338;
  --sky:#2f7bd0; --sky-soft:#bcd7f2; --ice:#eef4fb;
  --coral:#e8734a; --coral-soft:#f9d9cc;
  --ink:#1c2530; --muted:#5d6b7a; --paper:#f8f9fb; --line:#e3e8ee; --white:#fff;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Malgun Gothic",sans-serif;color:var(--ink);background:var(--white);line-height:1.65;word-break:keep-all}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.wrap{max-width:1080px;margin:0 auto;padding:0 22px}
.narrow{max-width:860px}
.dim{color:var(--muted);font-size:13.5px}

/* header */
.site-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.header-inner{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.brand-word{font-size:21px;font-weight:900;letter-spacing:-.02em;color:var(--navy)}
.brand-word em{font-style:normal;color:var(--coral)}
.nav{display:flex;align-items:center;gap:20px;font-size:15px;font-weight:600}
@media(max-width:1080px){.nav{gap:13px;font-size:14px}}
.nav a:hover{color:var(--sky)}
.nav-cta{background:var(--navy);color:#fff!important;padding:9px 16px;border-radius:999px;font-size:14px}
.nav-cta:hover{background:var(--navy-2)}
.mnav{display:none;position:relative}
.mnav summary{list-style:none;cursor:pointer;font-size:22px;line-height:1;padding:6px 4px;color:var(--navy);user-select:none}
.mnav summary::-webkit-details-marker{display:none}
.mnav-list{position:absolute;right:0;top:calc(100% + 10px);background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 14px 40px rgba(22,50,79,.16);min-width:190px;padding:8px;display:grid;z-index:70}
.mnav-list a{padding:11px 16px;border-radius:9px;font-size:15px;font-weight:700}
.mnav-list a:hover{background:var(--paper);color:var(--sky)}
.mnav-list a:last-child{background:var(--navy);color:#fff;text-align:center;margin-top:4px}
@media(max-width:820px){
  .nav{gap:10px}
  .nav>a:not(.nav-cta){display:none}
  .nav-cta{font-size:13.5px;padding:8px 14px}
  .mnav{display:block}
}

/* hero */
.hero{background:linear-gradient(140deg,var(--navy-dark) 0%,var(--navy) 50%,var(--navy-2) 100%);color:#fff;position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-140px;top:-140px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(47,123,208,.35),transparent 65%)}
.hero::before{content:"";position:absolute;left:-80px;bottom:-180px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(232,115,74,.22),transparent 65%)}
.hero-inner{padding:88px 22px 84px;position:relative;z-index:1}
.hero-sm .hero-inner{padding:64px 22px 58px}
.hero-kicker{color:var(--sky-soft);font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:13px;margin-bottom:16px}
.hero h1{font-size:clamp(30px,5vw,52px);line-height:1.22;font-weight:800;letter-spacing:-.02em}
.hero-sub{margin-top:18px;font-size:clamp(15px,2vw,19px);color:#d9e5f2}
.hero-actions{margin-top:32px;display:flex;gap:12px;flex-wrap:wrap}

/* hero slider */
.hero-slider .hs-track{display:flex;transition:transform .55s ease}
.hero-slider .hs-slide{flex:0 0 100%;min-width:100%}
.hs-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(255,255,255,.4);background:rgba(10,26,46,.35);color:#fff;font-size:26px;line-height:1;cursor:pointer;transition:.15s;display:flex;align-items:center;justify-content:center;padding:0 0 4px}
.hs-arrow:hover{border-color:#fff;background:rgba(255,255,255,.12)}
.hs-prev{left:14px}
.hs-next{right:14px}
.hs-dots{position:absolute;left:50%;transform:translateX(-50%);bottom:22px;z-index:2;display:flex;gap:9px}
.hs-dots button{width:9px;height:9px;border-radius:50%;border:none;padding:0;background:rgba(255,255,255,.35);cursor:pointer;transition:.15s}
.hs-dots button.on{background:var(--coral);width:24px;border-radius:999px}
@media(max-width:640px){.hs-arrow{display:none}.hero-slider .hero-inner{padding-bottom:96px}}

/* buttons */
.btn{display:inline-block;padding:13px 26px;border-radius:999px;font-weight:700;font-size:15px;transition:.15s}
.btn-coral{background:var(--coral);color:#fff}
.btn-coral:hover{background:#d5623b}
.btn-line{border:1.5px solid rgba(255,255,255,.55);color:#fff}
.btn-line:hover{border-color:#fff;background:rgba(255,255,255,.08)}
.btn-navy{background:var(--navy);color:#fff}
.btn-navy:hover{background:var(--navy-2)}

/* stats */
.stats{background:var(--navy-dark);color:#fff;border-top:1px solid rgba(255,255,255,.08)}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:28px 22px}
.stats-grid div{text-align:center}
.stats-grid strong{display:block;font-size:clamp(19px,3vw,28px);color:var(--coral);font-weight:800}
.stats-grid span{font-size:13px;color:#b9c9d9}
@media(max-width:700px){.stats-grid{grid-template-columns:repeat(2,1fr)}}

/* sections */
.section{padding:72px 0}
.section.alt{background:var(--paper)}
.sec-title{font-size:clamp(23px,3.4vw,32px);font-weight:800;letter-spacing:-.01em;margin-bottom:14px}
.sec-title-sm{font-size:20px;font-weight:800;margin-bottom:16px}
.sec-sub{color:var(--muted);margin-bottom:28px;max-width:760px}
/* 접이식 섹션 (홈): 데스크톱·모바일 모두 기본 접힘, 앵커 진입 시에만 스크립트가 펼침 */
.sec-fold>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px}
.sec-fold>summary::-webkit-details-marker{display:none}
.sec-fold>summary .sec-title{margin-bottom:0;font-size:clamp(15px,1.8vw,17px);font-weight:700}
.sec-fold>summary::after{content:"";flex:0 0 auto;width:9px;height:9px;margin-right:4px;border-right:2px solid #8a97a5;border-bottom:2px solid #8a97a5;transform:rotate(45deg) translate(-2px,-2px);transition:transform .15s}
.sec-fold[open]>summary::after{transform:rotate(225deg) translate(-2px,-2px)}
.sec-fold[open]>summary{margin-bottom:14px}
.sec-fold>summary:hover::after{border-color:var(--coral)}
.section:has(.sec-fold:not([open])){padding:24px 0}
/* 버튼 행: 모바일에선 전체 폭으로 정렬 (margin-left 들여쓰기 어긋남 방지) */
.btn-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
@media(max-width:560px){.btn-row .btn{flex:1 1 100%;text-align:center}}
.sec-sub a{color:var(--sky);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.lead{font-size:17px;color:#33404d;margin-bottom:24px}
.lead a,.fit-grid a{color:var(--sky);font-weight:700;text-decoration:underline;text-underline-offset:3px}

/* camp cards */
.camp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
@media(max-width:760px){.camp-grid{grid-template-columns:1fr}}
.camp-card{display:flex;flex-direction:column;gap:10px;border:1px solid var(--line);border-radius:18px;padding:26px;background:#fff;transition:.15s}
.section.alt .camp-card{background:#fff}
.camp-card:hover{border-color:var(--sky);box-shadow:0 12px 32px rgba(22,50,79,.1);transform:translateY(-2px)}
.camp-flag{font-size:13px;font-weight:800;color:var(--sky);letter-spacing:.04em}
.camp-card h3{font-size:20px;font-weight:800}
.camp-tag{font-size:14px;color:var(--muted);flex:1}
.camp-meta{display:grid;gap:6px;border-top:1px solid var(--line);padding-top:14px}
.camp-meta div{display:grid;grid-template-columns:64px 1fr;font-size:14px}
.camp-meta dt{color:var(--muted);font-weight:700}
.camp-meta dd{font-weight:600}
.camp-more{font-size:14px;font-weight:700;color:var(--coral)}

/* compare table */
.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:#fff;-webkit-overflow-scrolling:touch}
table{width:100%;border-collapse:collapse;font-size:14.5px}
.cmp{min-width:680px}
.cmp thead th{background:var(--navy);color:#fff;padding:14px;text-align:center;font-weight:700}
.cmp thead th a{text-decoration:underline;text-underline-offset:3px}
.cmp tbody th{background:var(--ice);padding:12px 14px;text-align:left;white-space:nowrap;font-weight:800;color:var(--navy);border-top:1px solid var(--line)}
.cmp tbody td{padding:12px 14px;border-top:1px solid var(--line);vertical-align:top}
.table-hint{display:none;font-size:12px;color:var(--muted);margin:0 0 8px;text-align:right}
@media(max-width:680px){.table-hint{display:block}}

/* lists */
.check-list{list-style:none;display:grid;gap:10px}
.check-list li{padding-left:30px;position:relative;font-size:15px}
.check-list li::before{content:"✓";position:absolute;left:0;top:0;font-weight:800;color:var(--sky)}
.step-list{list-style:none;counter-reset:step;display:grid;gap:10px;max-width:760px}
.step-list li{counter-increment:step;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:16px 20px 16px 62px;position:relative}
.section.alt .step-list li{background:#fff}
.step-list li::before{content:counter(step);position:absolute;left:18px;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:var(--navy);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px}
.safe-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:720px){.safe-list{grid-template-columns:1fr}}
.safe-list li{background:#fff;border:1px solid var(--line);border-left:4px solid var(--sky);border-radius:12px;padding:16px 20px;font-size:14.5px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:44px}
@media(max-width:760px){.two-col{grid-template-columns:1fr}}

/* fit grid */
.fit-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:700px){.fit-grid{grid-template-columns:1fr}}
.fit-grid>div{background:var(--ice);border:1px solid var(--sky-soft);border-radius:14px;padding:22px}
.section.alt .fit-grid>div{background:#fff;border-color:var(--line)}
.fit-grid strong{display:block;font-size:16px;margin-bottom:8px;color:var(--navy)}
.fit-grid p{font-size:14.5px;color:#33404d}

/* info list */
.info-list{display:grid;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
.info-list>div{display:grid;grid-template-columns:120px 1fr;border-top:1px solid var(--line)}
.info-list>div:first-child{border-top:none}
.info-list dt{background:var(--ice);padding:15px 18px;font-weight:800;color:var(--navy);font-size:14.5px}
.info-list dd{padding:15px 18px;font-size:15px}
.info-list dd a{color:var(--sky);font-weight:800;text-decoration:underline;text-underline-offset:3px}
@media(max-width:560px){.info-list>div{grid-template-columns:1fr}.info-list dt{padding-bottom:4px}.info-list dd{padding-top:4px}}

/* faq */
.sch{list-style:none;display:grid;gap:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
.sch li{display:grid;grid-template-columns:132px 1fr;border-top:1px solid var(--line);align-items:start}
.sch li:first-child{border-top:none}
.sch li:nth-child(odd){background:var(--ice)}
.sch-d{padding:13px 16px;font-weight:800;color:var(--navy);font-size:14px;white-space:nowrap}
.sch-d i{font-style:normal;font-weight:600;color:var(--sky);margin-left:5px;font-size:13px}
.sch-t{padding:13px 16px;font-size:14.5px;line-height:1.65}
@media(max-width:600px){.sch li{grid-template-columns:1fr}.sch-d{padding-bottom:0}.sch-t{padding-top:6px}}
.faq-list{display:grid;gap:10px;max-width:860px}
.faq-item{background:#fff;border:1px solid var(--line);border-radius:12px;padding:0 20px}
.section:not(.alt) .faq-item{background:var(--paper)}
.faq-item summary{cursor:pointer;font-weight:800;padding:16px 0;list-style:none;position:relative;padding-right:28px}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";position:absolute;right:2px;top:50%;transform:translateY(-50%);font-size:20px;color:var(--sky);font-weight:700}
.faq-item[open] summary::after{content:"−"}
.faq-item p{padding:0 0 18px;color:#33404d;font-size:14.5px}

/* guide */
.guide-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media(max-width:720px){.guide-grid{grid-template-columns:1fr}}
.guide-card{display:flex;flex-direction:column;gap:8px;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:24px;transition:.15s}
.section.alt .guide-card{background:#fff}
.guide-card:hover{border-color:var(--sky);box-shadow:0 10px 26px rgba(22,50,79,.08);transform:translateY(-2px)}
.guide-card h3{font-size:17px;font-weight:800;color:var(--navy)}
.guide-card p{font-size:14px;color:var(--muted);flex:1}
.guide-more{font-size:13.5px;font-weight:700;color:var(--coral)}
.guide-body p{margin-bottom:16px;font-size:15.5px;color:#2b3642}
.guide-body .lead{font-size:17px}
.guide-body h2{margin-top:34px}
.guide-body .step-list,.guide-body .check-list{margin-bottom:18px}
.guide-body a{color:var(--sky);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.guide-cta{margin-top:30px;background:var(--ice);border:1px solid var(--sky-soft);border-radius:14px;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.guide-cta span{font-weight:800;font-size:16px}

/* consult */
.consult{background:linear-gradient(140deg,var(--navy-dark),var(--navy));color:#fff;padding:72px 0}
.consult-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:48px;align-items:start}
@media(max-width:820px){.consult-grid{grid-template-columns:1fr;gap:32px}}
.consult-ov{position:fixed;inset:0;z-index:200;background:rgba(10,16,26,.62);display:flex;align-items:center;justify-content:center;padding:16px}
.consult-ov[hidden]{display:none}
.consult-box{position:relative;width:100%;max-width:640px;max-height:92vh;overflow-y:auto;border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.4)}
.consult-x{position:absolute;top:10px;right:10px;z-index:2;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:16px;cursor:pointer;line-height:1}
.consult-x:hover{background:rgba(255,255,255,.32)}
.consult-ov .consult{padding:36px 0 30px;border-radius:20px}
.consult-ov .consult-grid{grid-template-columns:1fr;gap:24px}
.consult-copy h2{font-size:clamp(24px,3.4vw,32px);font-weight:800;margin-bottom:14px}
.consult-copy>p{color:#d9e5f2;margin-bottom:22px}
.consult-points{list-style:none;display:grid;gap:10px}
.consult-points li{padding-left:26px;position:relative;font-size:14.5px;color:#b9c9d9}
.consult-points li::before{content:"—";position:absolute;left:0;color:var(--coral)}
.consult-form{background:#fff;border-radius:18px;padding:28px;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.25)}
.form-row{display:grid;gap:14px;margin-bottom:14px}
.form-row.two{grid-template-columns:1fr 1fr}
@media(max-width:560px){.form-row.two{grid-template-columns:1fr}}
.consult-form label{display:grid;gap:6px;font-size:13.5px;font-weight:700;color:#3b4754}
.consult-form .req{color:#c0392b;font-weight:700}
.consult-form input,.consult-form select,.consult-form textarea{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:11px 13px;font-size:15px;font-family:inherit;background:#fafbfc;color:var(--ink)}
.consult-form input:focus,.consult-form select:focus,.consult-form textarea:focus{outline:none;border-color:var(--sky);background:#fff}
.consult-form textarea{resize:vertical}
.form-submit{width:100%;border:none;cursor:pointer;font-size:16px;padding:15px}
.form-submit:disabled{opacity:.6;cursor:default}
.form-fine{margin-top:12px;font-size:12.5px;color:#8a95a1;text-align:center}
body{-webkit-user-select:none;-moz-user-select:none;user-select:none}
input,textarea,select{-webkit-user-select:text;-moz-user-select:text;user-select:text}
img{-webkit-user-drag:none;user-drag:none}
.form-done{text-align:center;padding:34px 10px}
.form-done strong{display:block;font-size:19px;color:var(--navy);margin-bottom:8px}
.form-done p{color:var(--muted);font-size:14.5px}

/* floating cta */
.float-cta{position:fixed;right:16px;bottom:18px;z-index:60;background:var(--coral);color:#fff;font-weight:800;font-size:15px;padding:13px 22px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.28);transition:.2s}
.float-cta:hover{background:#d5623b}
.float-cta.hide{opacity:0;pointer-events:none;transform:translateY(8px)}

/* footer */
.site-footer{background:#0b1c2e;color:#aebccb;padding:56px 0 36px;font-size:14px}
.footer-grid{display:grid;grid-template-columns:1fr 1.3fr;gap:44px}
@media(max-width:820px){.footer-grid{grid-template-columns:1fr}}
.footer-word{font-size:20px;font-weight:900;letter-spacing:-.02em;color:#fff;margin-bottom:16px}
.footer-word em{font-style:normal;color:var(--coral)}
.footer-links h3{color:#fff;font-size:15px;margin-bottom:14px}
.footer-linkset{display:flex;flex-wrap:wrap;gap:8px 6px}
.footer-linkset a{border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:5px 13px;font-size:12.5px;color:#aebccb;transition:.15s}
.footer-linkset a:hover{border-color:var(--coral);color:var(--coral)}
.footer-cta{margin-top:6px;font-size:14px;padding:11px 22px}
.footer-fine{margin-top:34px;padding-top:18px;border-top:1px solid rgba(255,255,255,.1);color:#6b7d8f;font-size:12.5px}
`;

// ------------------------------------------------------------
// 생성
// ------------------------------------------------------------
const pages = [];
pages.push(buildIndex());
pages.push(buildCompare());
pages.push(buildAbout());
pages.push(buildFaq());
for (const k of Object.keys(CAMPS)) pages.push(buildCamp(k));
for (const ct of COUNTRIES) pages.push(buildCountry(ct));
for (const a of AGE_GROUPS) pages.push(buildAgeGroup(a));
for (const g of GRADES) pages.push(buildGrade(g));
for (const g of GRADES) for (const ct of COUNTRIES) pages.push(buildGradeCountry(g, ct));
pages.push(buildStudyHub());
for (const k of Object.keys(STUDY)) pages.push(buildStudy(k));
pages.push(buildStudyCompare());
pages.push(buildStudyCost());
pages.push(buildStudyProcess());
pages.push(buildStudyVisa());
pages.push(buildStudyGuardian());
pages.push(buildStudyAfter());
pages.push(buildStudyFaq());
for (const g of STUDY_GRADES) pages.push(buildStudyGrade(g));
pages.push(buildStudyGuideIndex());
pages.push(buildStPaul());
pages.push(buildStPaulAdmission());
pages.push(buildStPaulCurriculum());
pages.push(buildStPaulTuition());
pages.push(buildStPaulCollege());
pages.push(buildStPaulLife());
pages.push(buildStPaulVsAbroad());
pages.push(buildStPaulFaq());
pages.push(buildElc());
pages.push(buildSummerHub());
for (const s of SUMMER_COUNTRIES) pages.push(buildSummerCountry(s));
for (const ic of INFO_COUNTRIES) pages.push(buildInfoCountry(ic));
for (const k of Object.keys(SCHEDULES)) pages.push(buildSchedulePage(k));
for (const d of DURATIONS) pages.push(buildDuration(d));
for (const g of GRADES) for (const d of DURATIONS) pages.push(buildGradeDuration(g, d));
for (const dp of DEPARTURES) pages.push(buildDeparture(dp));
pages.push(buildCalendar());
for (const bd of BUDGETS) pages.push(buildBudget(bd));
pages.push(buildGuideIndex());
for (const g of ALL_GUIDES) pages.push(buildGuideArticle(g));

for (const p of pages) fs.writeFileSync(path.join(OUT, p.file), p.html);
fs.writeFileSync(path.join(OUT, "style.css"), CSS);
fs.writeFileSync(path.join(OUT, "CNAME"), BASE_URL.replace(/^https?:\/\//, ""));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

// IndexNow 키 (제출은 sangsang-workers 중앙 크론)
const INDEXNOW_KEY = "5e5ad86af25533efae3948773b676a6c";
fs.writeFileSync(path.join(OUT, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

// sitemap + robots + rss
const urls = pages.map((p) => `<url><loc>${BASE_URL}/${p.file === "index.html" ? "" : p.file}</loc></url>`).join("\n");
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\nSitemap: ${BASE_URL}/rss.xml`);

const rssItems = [
  { title: `${SEASON_LABEL} 해외캠프 4종 모집 안내 — 캐나다·뉴질랜드·일본`, link: `${BASE_URL}/`, date: "Tue, 21 Jul 2026 09:00:00 +0900", desc: "캐나다 스쿨링 3주·7주, 뉴질랜드 영어캠프, 일본 교토 어학연수 — 선착순 모집." },
  ...ALL_GUIDES.map((g) => ({ title: `[${g.cat === "study" ? "유학 가이드" : "캠프 가이드"}] ${g.title}`, link: `${BASE_URL}/${g.slug}.html`, date: new Date(g.date + "T09:00:00+09:00").toUTCString(), desc: g.desc })),
].map((it) => `  <item>\n    <title>${esc(it.title)}</title>\n    <link>${it.link}</link>\n    <guid isPermaLink="false">${it.link}#${esc(it.title)}</guid>\n    <pubDate>${it.date}</pubDate>\n    <description>${esc(it.desc)}</description>\n  </item>`).join("\n");
fs.writeFileSync(path.join(OUT, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>러닝트래블 — 해외캠프 안내</title>\n  <link>${BASE_URL}</link>\n  <description>캐나다·뉴질랜드·일본 해외캠프 모집 소식과 캠프 가이드</description>\n  <language>ko</language>\n${rssItems}\n</channel>\n</rss>`);

console.log(`생성 완료: ${pages.length}개 페이지 + style.css + sitemap/robots/rss/CNAME → docs/`);
if (!FORM_ENDPOINT) console.warn("⚠ FORM_ENDPOINT 미설정 — 상담 양식 데모 모드 (gas-form.gs 배포 후 data.js에 입력)");
