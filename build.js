// ============================================================
// 에듀저니 해외캠프 사이트 생성기 — 실행: node build.js → docs/
// ============================================================
const fs = require("fs");
const path = require("path");
const { BASE_URL, SEASON_LABEL, FORM_ENDPOINT, CAMPS, COMMON, GRADES, AGE_GROUPS, COUNTRIES } = require("./data.js");
const GUIDES = require("./guides.js");

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
    <a class="brand" href="index.html"><span class="brand-word">에듀<em>저니</em></span></a>
    <nav class="nav">
      <a href="index.html#camps">캠프 안내</a>
      <a href="compare.html">캠프 비교</a>
      <a href="about.html">운영·안전</a>
      <a href="faq.html">자주 묻는 질문</a>
      <a href="guide.html">캠프 가이드</a>
      <a class="nav-cta" href="#consult">상담 신청</a>
      <details class="mnav">
        <summary aria-label="메뉴 열기">☰</summary>
        <div class="mnav-list">
          <a href="index.html#camps">캠프 안내</a>
          <a href="compare.html">캠프 비교</a>
          <a href="about.html">운영·안전</a>
          <a href="faq.html">자주 묻는 질문</a>
          <a href="guide.html">캠프 가이드</a>
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
        <div class="footer-word">에듀<em>저니</em></div>
        <p>캐나다·뉴질랜드·일본 해외캠프를 운영합니다.<br>지금까지 16,000명 넘는 학생들과 다녀왔고,<br>그 경험이 저희가 가진 전부이자 자랑입니다.</p>
        <a class="btn btn-coral footer-cta" href="#consult">상담 신청하기</a>
      </div>
      <div class="footer-links">
        <h3>캠프 안내</h3>
        <div class="footer-linkset">${campLinks}\n${ageLinks}\n<a href="guide.html">캠프 가이드</a>\n<a href="faq.html">자주 묻는 질문</a></div>
      </div>
    </div>
    <p class="footer-fine">에듀저니 해외캠프 안내 페이지 · 일정과 비용은 항공·현지 사정에 따라 변경될 수 있습니다. 문의는 상담 신청 양식을 이용해 주세요.</p>
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
  return `<div class="table-wrap"><table class="cmp">
    <thead><tr><th></th>${cs.map((c) => `<th><a href="${c.slug}.html">${c.flag}<br>${c.name}</a></th>`).join("")}</tr></thead>
    <tbody>
      ${row("형태", (c) => c.type)}
      ${row("기간", (c) => c.periodShort)}
      ${row("대상", (c) => c.target)}
      ${row("정원", (c) => c.capacity)}
      ${row("참가비", (c) => `<strong>${c.price}</strong>`)}
      ${row("숙소", (c) => c.stay)}
      ${row("모집 마감", (c) => c.deadline)}
    </tbody>
  </table></div>`;
}

function safetySection() {
  return `<section class="section alt">
  <div class="wrap">
    <h2 class="sec-title">안전 관리는 이렇게 하고 있습니다</h2>
    <p class="sec-sub">16,000명 넘는 학생들과 캠프를 다니며 하나씩 자리잡은 규칙들입니다.</p>
    <ul class="safe-list">
      ${COMMON.safety.map((s) => `<li>${s}</li>`).join("\n")}
    </ul>
  </div>
</section>`;
}

function applySection() {
  return `<section class="section">
  <div class="wrap narrow">
    <h2 class="sec-title">참가 신청 절차</h2>
    <ol class="step-list">${COMMON.applySteps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <p class="sec-sub" style="margin-top:14px">모집은 선착순이며 정원이 차면 조기 마감됩니다. 환불 규정은 <a href="faq.html#refund">여기</a>에서 확인하세요.</p>
  </div>
</section>`;
}

function consultSection(preset = {}) {
  const campOpts = Object.values(CAMPS)
    .map((c) => `<option value="${c.name}"${preset.camp === c.slug ? " selected" : ""}>${c.name}</option>`)
    .join("");
  const gradeOpts = GRADES.map((g) => `<option value="${g.label}"${preset.grade === g.key ? " selected" : ""}>${g.label}</option>`).join("");
  return `<section class="consult" id="consult">
  <div class="wrap consult-grid">
    <div class="consult-copy">
      <h2>캠프 상담 신청</h2>
      <p>아이 학년과 궁금한 점을 남겨 주세요.<br>확인 후 맞는 캠프와 일정을 안내해 드립니다.</p>
      <ul class="consult-points">
        <li>모집은 선착순 — 정원 마감 전 상담을 권합니다</li>
        <li>영어 실력·성향에 맞는 캠프 추천</li>
        <li>유학 연계, 형제 동반 참가 문의 환영</li>
      </ul>
    </div>
    <form class="consult-form" id="consultForm" autocomplete="off">
      <div class="form-row two">
        <label>보호자 성함 <span>*</span><input type="text" name="이름" required placeholder="성함"></label>
        <label>연락처 <span>*</span><input type="tel" name="연락처" required placeholder="010-0000-0000"></label>
      </div>
      <div class="form-row two">
        <label>자녀 학년<select name="학년"><option value="">선택해 주세요</option>${gradeOpts}<option value="기타">기타</option></select></label>
        <label>관심 캠프<select name="관심캠프"><option value="">선택해 주세요</option>${campOpts}<option value="추천 받고 싶어요">추천 받고 싶어요</option></select></label>
      </div>
      <div class="form-row two">
        <label>연락 희망 시간<select name="연락희망시간"><option value="아무 때나">아무 때나</option><option>오전 (9시~12시)</option><option>오후 (12시~18시)</option><option>저녁 (18시 이후)</option></select></label>
      </div>
      <div class="form-row">
        <label>문의 내용<textarea name="문의내용" rows="5" placeholder="아이의 영어 수준, 해외 경험 여부, 궁금한 점을 자유롭게 남겨 주세요"></textarea></label>
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
      var name = (f.get('이름')||'').trim(), tel = (f.get('연락처')||'').trim();
      if(!name || !tel){ alert('성함과 연락처를 입력해 주세요.'); return; }
      var btn = form.querySelector('.form-submit');
      btn.disabled = true; btn.textContent = '접수 중...';
      var data = {
        '이름': name, '연락처': tel,
        '학년': f.get('학년')||'', '관심캠프': f.get('관심캠프')||'',
        '연락희망시간': f.get('연락희망시간')||'', '문의내용': f.get('문의내용')||'',
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
  </script>
</section>`;
}

// ------------------------------------------------------------
// 홈
// ------------------------------------------------------------
function buildIndex() {
  const hero = `<section class="hero">
  <div class="wrap hero-inner">
    <p class="hero-kicker">${SEASON_LABEL} 해외캠프 모집</p>
    <h1>겨울방학 3주,<br>캐나다 학교에 다녀보면 어떨까요</h1>
    <p class="hero-sub">현지 학교 수업에 직접 들어가는 스쿨링 캠프입니다. 캐나다·뉴질랜드·일본 4개 과정,<br>신청부터 귀국까지 한국인 인솔자가 붙어 있습니다.</p>
    <div class="hero-actions">
      <a class="btn btn-coral" href="#camps">${SEASON_LABEL} 캠프 보기</a>
      <a class="btn btn-line" href="compare.html">한눈에 비교하기</a>
    </div>
  </div>
</section>
<section class="stats">
  <div class="wrap stats-grid">
    <div><strong>16,000+</strong><span>누적 참가 학생</span></div>
    <div><strong>4개 캠프</strong><span>${SEASON_LABEL} 시즌 운영</span></div>
    <div><strong>전 일정</strong><span>한국인 인솔자 동행</span></div>
    <div><strong>실시간</strong><span>학부모 밴드 공유</span></div>
  </div>
</section>`;

  const body = `
<section class="section" id="camps">
  <div class="wrap">
    <h2 class="sec-title">${SEASON_LABEL} 캠프 라인업</h2>
    <p class="sec-sub">스쿨링·영어캠프·어학연수 — 아이의 나이와 목적에 맞는 캠프를 고르세요. 모두 인솔자 동행, 선착순 마감입니다.</p>
    <div class="camp-grid">${Object.values(CAMPS).map(campCard).join("\n")}</div>
    <p style="margin-top:22px"><a class="btn btn-navy" href="compare.html">4개 캠프 한눈에 비교하기 →</a></p>
  </div>
</section>

${safetySection()}

<section class="section">
  <div class="wrap">
    <h2 class="sec-title">어떤 캠프를 골라야 할지 모르겠다면</h2>
    <div class="fit-grid">
      <div><strong>처음 나가는 초등학생이라면</strong><p>3주짜리가 무난합니다. 학교에서 버디 친구를 붙여주는 <a href="canada-3week.html">캐나다 3주</a>나, 1월이 여름이라 지내기 좋은 <a href="newzealand.html">뉴질랜드</a>로 시작하는 집이 많습니다.</p></div>
      <div><strong>유학을 진지하게 고민 중이라면</strong><p>바로 보내지 마시고 <a href="canada-7week.html">캐나다 7주</a>부터 겪어보게 하세요. 사립학교 수업을 그대로 다녀보고 결정해도 늦지 않습니다.</p></div>
      <div><strong>영어가 아직 자신 없다면</strong><p><a href="newzealand.html">뉴질랜드 캠프</a>가 부담이 덜합니다. 1월엔 캠프생끼리 영어수업으로 몸을 풀고, 2월에 현지 수업에 들어가는 순서라서요.</p></div>
      <div><strong>일본어에 빠진 중고생이라면</strong><p><a href="japan.html">교토 2주</a> 다녀오면 일본어 진로를 계속 갈지 본인 입으로 답이 나옵니다.</p></div>
    </div>
  </div>
</section>

${applySection()}

<section class="section alt">
  <div class="wrap">
    <h2 class="sec-title">학부모님들이 가장 많이 묻는 질문</h2>
    <div class="faq-list">
      ${COMMON.faq.slice(0, 4).map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
    </div>
    <p style="margin-top:20px"><a class="btn btn-navy" href="faq.html">전체 질문·환불 규정 보기 →</a></p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="sec-title">캠프 가이드</h2>
    <p class="sec-sub">첫 캠프 나이부터 홈스테이 적응, 준비물까지 — 보내기 전에 읽어두면 좋은 글들.</p>
    <div class="guide-grid">${GUIDES.slice(0, 6).map(guideCard).join("\n")}</div>
    <p style="margin-top:22px"><a class="btn btn-navy" href="guide.html">가이드 전체 보기 →</a></p>
  </div>
</section>

${consultSection()}`;

  return page({
    file: "index.html",
    title: `에듀저니 | ${SEASON_LABEL} 해외캠프 — 캐나다·뉴질랜드·일본 스쿨링 캠프`,
    desc: `초등·중등·고등 해외 겨울캠프. 캐나다 학교 스쿨링, 뉴질랜드 영어캠프, 일본 교토 어학연수 — 인솔자 동행, 홈스테이, 학부모 실시간 공유. ${SEASON_LABEL} 시즌 선착순 모집.`,
    hero,
    body,
    jsonld: { "@context": "https://schema.org", "@type": "Organization", name: "에듀저니", url: BASE_URL },
  });
}

// ------------------------------------------------------------
// 캠프 상세
// ------------------------------------------------------------
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

${safetySection()}
${applySection()}

<section class="section alt">
  <div class="wrap narrow">
    <h2 class="sec-title-sm">캠프가 끝난 뒤에도</h2>
    <p>${c.extend}. 자세한 내용은 상담 시 안내해 드립니다.</p>
    <p class="sec-sub" style="margin-top:16px">다른 캠프와 비교하기: <a href="compare.html">4개 캠프 비교표</a> ·
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
      organizer: { "@type": "Organization", name: "에듀저니" },
    },
  });
}

// ------------------------------------------------------------
// 비교 / 소개 / FAQ
// ------------------------------------------------------------
function buildCompare() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">${SEASON_LABEL} Camp Comparison</p>
    <h1>4개 캠프, 한눈에 비교</h1>
    <p class="hero-sub">기간·대상·비용·형태를 나란히 놓고 우리 아이에게 맞는 캠프를 찾아보세요.</p>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap">
  ${compareTable()}
  <p class="sec-sub" style="margin-top:18px">항공료는 별도이며 단체 예약으로 진행합니다 (개별 발권 가능). 어떤 캠프가 맞을지 고민되시면 아이 학년·영어 수준을 적어 상담을 남겨 주세요.</p>
</div></section>
<section class="section alt"><div class="wrap">
  <h2 class="sec-title">고르기 어려울 때 참고하세요</h2>
  <div class="fit-grid">
    <div><strong>첫 해외 경험이라면</strong><p>3주면 충분합니다. 첫 주에 적응하고, 둘째 주부터 재미를 붙이고, 셋째 주엔 아쉬워하면서 돌아옵니다.</p></div>
    <div><strong>유학 보내기 전 점검이라면</strong><p>7주를 권합니다. 한 달을 넘겨야 손님 대접이 끝나고 진짜 생활이 시작되거든요.</p></div>
    <div><strong>영어 기초가 걱정이라면</strong><p>뉴질랜드로 보내세요. 영어수업으로 시작해서 현지 수업으로 넘어가는 순서라 덜 힘들어합니다.</p></div>
    <div><strong>일본어 진로를 알아보는 중이라면</strong><p>교토 2주가 맞습니다. 중2~고2만 받는 소수 정예 과정입니다.</p></div>
  </div>
</div></section>
${consultSection()}`;
  return page({
    file: "compare.html",
    title: `해외 겨울캠프 비교 | 캐나다 3주·7주, 뉴질랜드, 일본 교토 — 기간·비용·대상 총정리`,
    desc: `${SEASON_LABEL} 해외캠프 4종 비교표 — 캐나다 스쿨링 3주(890만원)·7주(1,290만원), 뉴질랜드 3~7주(690만원~), 일본 교토 2주(594만원). 기간·대상·숙소·마감일 한눈에.`,
    hero, body,
  });
}

function buildAbout() {
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">Why EduJourney</p>
    <h1>16,000명을 데리고<br>다녀온 팀이 만드는 캠프</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow">
  <p class="lead">캠프를 고를 때 일정표는 사실 큰 차이가 없습니다. 차이가 나는 건 사고가 났을 때입니다.
  아이가 한밤중에 아프면 누가 몇 분 안에 오는지, 홈스테이와 갈등이 생기면 누가 중간에서 풀어주는지 —
  저희는 여기에 답할 수 있느냐를 기준으로 프로그램을 짜 왔습니다. 아래가 그 답입니다.</p>
</div></section>
<section class="section alt"><div class="wrap">
  <h2 class="sec-title">에듀저니 캠프의 운영 원칙</h2>
  <div class="fit-grid">
    <div><strong>교육기관과 직접 연결</strong><p>학교·교육청과 직접 연계된 프로그램만 운영합니다. 홈스테이도 교육기관이 검증한 가정만 배정됩니다.</p></div>
    <div><strong>인솔자 + 현지 관리자 이중 체계</strong><p>한국에서 함께 출국한 인솔자와, 현지에 상주하는 관리자가 학교와 홈스테이 양쪽을 살핍니다.</p></div>
    <div><strong>학부모 실시간 공유</strong><p>네이버 밴드에 전체 공지방과 학생별 개인방을 운영합니다. 아이의 하루가 매일 사진과 글로 도착합니다.</p></div>
    <div><strong>명문화된 원칙</strong><p>규정 위반 3단계 원칙, 단계별 환불 규정 — 모든 원칙이 계약서에 문서로 존재합니다.</p></div>
  </div>
</div></section>
${safetySection()}
<section class="section"><div class="wrap narrow">
  <h2 class="sec-title">환불 규정</h2>
  <div class="table-wrap"><table class="cmp"><tbody>
    ${COMMON.refund.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
  </tbody></table></div>
  <p class="sec-sub" style="margin-top:14px">천재지변·항공 지연 등 주관사가 통제할 수 없는 사유는 별도 기준이 적용됩니다. 계약 전 상담에서 전문을 안내해 드립니다.</p>
</div></section>
${consultSection()}`;
  return page({
    file: "about.html",
    title: "에듀저니 운영·안전 시스템 | 해외캠프, 무엇이 달라야 하는가",
    desc: "16,000명 이상과 함께해 온 해외캠프 운영 체계 — 교육기관 직접 연계, 인솔자·현지 관리자 이중 체계, 학부모 실시간 공유, 명문화된 환불 규정.",
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
    <li>한국의 겨울이 현지의 여름 — 야외활동에 최적의 계절</li>
    <li>유학생 비율이 낮은 학교에서 현지 학생들과 깊게 어울리는 환경</li>
    <li>1월 영어캠프 + 2월 정규과정으로 기초부터 실전까지 단계적 구성</li>
    <li>3주·4주·7주 선택 + 주 단위 연장 가능한 유연함</li>` : ""}
    ${ct.slug === "japan" ? `
    <li>비행 2시간 — 첫 단독 해외 경험의 부담이 가장 적은 나라</li>
    <li>천년 고도 교토에서 어학과 전통문화를 동시에</li>
    <li>일본어 전공·유학 진로를 실제로 확인해 보는 기회</li>
    <li>중2~고2 또래 소수 정예 + 인솔자 전 일정 동행</li>` : ""}
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
// 가이드(칼럼)
// ------------------------------------------------------------
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
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);
  const hero = `<section class="hero hero-sm"><div class="wrap hero-inner">
    <p class="hero-kicker">캠프 가이드</p>
    <h1>${g.title}</h1>
  </div></section>`;
  const body = `
<section class="section"><div class="wrap narrow guide-body">
  ${g.body}
  <div class="guide-cta">
    <span>우리 아이에게 맞는 캠프가 궁금하다면</span>
    <a class="btn btn-navy" href="compare.html">캠프 비교해 보기 →</a>
  </div>
  <p class="sec-sub" style="margin-top:26px">함께 읽으면 좋은 글: ${others.map((o) => `<a href="${o.slug}.html">${o.title}</a>`).join(" · ")} · <a href="guide.html">전체 보기</a></p>
</div></section>
${consultSection()}`;
  return page({
    file: `${g.slug}.html`,
    title: g.metaTitle,
    desc: g.desc,
    hero, body,
    jsonld: { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.desc, datePublished: g.date, author: { "@type": "Organization", name: "에듀저니" } },
  });
}

// ------------------------------------------------------------
// CSS
// ------------------------------------------------------------
const CSS = `/* 에듀저니 — 생성 파일 (build.js 재생성) */
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
.consult-form label span{color:#c0392b}
.consult-form input,.consult-form select,.consult-form textarea{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:11px 13px;font-size:15px;font-family:inherit;background:#fafbfc;color:var(--ink)}
.consult-form input:focus,.consult-form select:focus,.consult-form textarea:focus{outline:none;border-color:var(--sky);background:#fff}
.consult-form textarea{resize:vertical}
.form-submit{width:100%;border:none;cursor:pointer;font-size:16px;padding:15px}
.form-submit:disabled{opacity:.6;cursor:default}
.form-fine{margin-top:12px;font-size:12.5px;color:#8a95a1;text-align:center}
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
pages.push(buildGuideIndex());
for (const g of GUIDES) pages.push(buildGuideArticle(g));

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
  ...GUIDES.map((g) => ({ title: `[캠프 가이드] ${g.title}`, link: `${BASE_URL}/${g.slug}.html`, date: new Date(g.date + "T09:00:00+09:00").toUTCString(), desc: g.desc })),
].map((it) => `  <item>\n    <title>${esc(it.title)}</title>\n    <link>${it.link}</link>\n    <guid isPermaLink="false">${it.link}#${esc(it.title)}</guid>\n    <pubDate>${it.date}</pubDate>\n    <description>${esc(it.desc)}</description>\n  </item>`).join("\n");
fs.writeFileSync(path.join(OUT, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>에듀저니 — 해외캠프 안내</title>\n  <link>${BASE_URL}</link>\n  <description>캐나다·뉴질랜드·일본 해외캠프 모집 소식과 캠프 가이드</description>\n  <language>ko</language>\n${rssItems}\n</channel>\n</rss>`);

console.log(`생성 완료: ${pages.length}개 페이지 + style.css + sitemap/robots/rss/CNAME → docs/`);
if (!FORM_ENDPOINT) console.warn("⚠ FORM_ENDPOINT 미설정 — 상담 양식 데모 모드 (gas-form.gs 배포 후 data.js에 입력)");
