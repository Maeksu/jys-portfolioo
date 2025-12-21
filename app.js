// Projects data
const projects = [
  {
    title: 'PhishTrainer',
    subtitle: '실전형 피싱 메일 시뮬레이션 & 보안 인식 교육',
    description: '실제 피싱 흐름을 모사한 훈련 시나리오로 클릭·행동 데이터를 기반으로 사용자의 보안 경각심을 끌어올리는 교육형 웹 서비스.',
    tags: ['React', 'Node.js', 'Express', 'Nodemailer', 'Tailwind', 'Firebase'],
    links: [
      { label: 'Demo (미완성)', href: 'demo/phishtrainer.html' },
    ],
  },
  {
    title: 'ScalpAI',
    subtitle: 'AI 기반 초단기 트레이딩 전략 추천',
    description: '딥러닝 기반 분석으로 초단기(1~5분) 전략을 생성·요약하고, 시각화와 메시지 형태의 리포트로 빠른 의사결정을 돕는 서비스.',
    tags: ['Python', 'Flask', 'React', 'Chart.js', 'ML/DL', 'API'],
    links: [
      { label: 'Demo (미완성)', href: 'demo/scalpai.html' },
    ],
  },
  {
    title: '오늘의 너에게',
    subtitle: 'AI 기반 맞춤형 심리 상담 & 감정 일기 서비스',
    description: '대화 및 감정 일기 데이터를 기반으로 감정 상태·스트레스 수준·사고 패턴을 분석해 맞춤형 상담/피드백을 제공하는 멘탈 케어 서비스입니다. 실시간 채팅형 상담 UI와 감정 그래프를 통해 감정 변화 흐름과 반복되는 고민을 시각화합니다.',
    tags: ['React', 'Node.js', 'Firebase', 'Firestore', 'Firebase Auth', 'Bootstrap', 'Cloudflare'],
    links: [{ label: 'Site', href: 'https://todaytoyou.pages.dev/' }],
  },
  {
    title: 'MbtiHub',
    subtitle: 'MBTI 기반 커뮤니티 & 성향 분석 풀스택 웹 서비스',
    description:
      'MbtiHub는 MBTI 성향을 바탕으로 자신의 고민을 나누고, 다른 사람들의 이야기를 통해 공감과 인사이트를 얻을 수 있는 커뮤니티 서비스입니다. 간단한 회원가입 후 글을 작성하고 댓글과 좋아요로 소통할 수 있으며, MBTI 유형별 정보를 함께 제공해 “나를 이해하는 과정”이 자연스럽게 커뮤니티 활동으로 이어지도록 설계했습니다.',
    tags: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Spring Boot',
      'JWT',
      'MySQL',
      'Vercel',
      'Render',
    ],
    links: [{ label: 'Site', href: 'https://mbti-hub.vercel.app/' }],
  },
  {
    title: 'BetweenDays',
    subtitle: '기록 및 통계 분석 일기 앱 (Mobile)',
    description: '일상을 기록하고 카테고리/시간대별로 자동 분류하여 감정 흐름을 파악할 수 있는 일기 앱입니다. 검색·필터·정렬과 통계 대시보드(원형 차트/막대 차트)로 패턴을 객관적으로 이해할 수 있도록 설계했습니다.',
    tags: ['Android', 'Kotlin', 'MVVM', 'Room DB', 'Coroutines', 'LiveData', 'MPAndroidChart', 'Material 3'],
    links: [
      { 
        label: '구현 영상', 
        href: 'videos/betweendays.mp4', 
        kind: 'video'
      }
    ],
  },
];

// Utility functions
function usePrefersReducedMotion() {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  return media.matches;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let selectedSkillKey = '';

const PROJECTS_WITH_INFO = new Set(['BetweenDays', '오늘의 너에게', 'MbtiHub']);

function normalizeSkill(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()\-_/\.]/g, '');
}

function applySkillHighlights() {
  const skillsRoot = document.getElementById('skillsBadges');
  const projectsContainer = document.getElementById('projectsContainer');
  if (!skillsRoot || !projectsContainer) return;

  const hasSelection = Boolean(selectedSkillKey);

  skillsRoot.querySelectorAll('.badge').forEach((el) => {
    const key = normalizeSkill(el.textContent);
    el.classList.toggle('is-selected', hasSelection && key === selectedSkillKey);
    el.classList.add('is-selectable');
  });

  projectsContainer.querySelectorAll('[data-project-title]').forEach((card) => {
    const tags = Array.from(card.querySelectorAll('[data-skill]'));
    const matches = hasSelection && tags.some((t) => t.getAttribute('data-skill') === selectedSkillKey);
    card.classList.toggle('project-highlight', matches);

    tags.forEach((t) => {
      const isMatch = hasSelection && t.getAttribute('data-skill') === selectedSkillKey;
      t.classList.toggle('is-selected', isMatch);
    });
  });
}

function initSkillFilterHighlight() {
  const skillsRoot = document.getElementById('skillsBadges');
  if (!skillsRoot) return;

  skillsRoot.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge');
    if (!badge) return;

    const key = normalizeSkill(badge.textContent);
    selectedSkillKey = selectedSkillKey === key ? '' : key;
    applySkillHighlights();
  });

  applySkillHighlights();
}

function initFigmaModal() {
  const modal = document.getElementById('figmaModal');
  const backdrop = document.getElementById('figmaModalBackdrop');
  const closeBtn = document.getElementById('figmaModalClose');
  const backBtn = document.getElementById('figmaModalBack');
  const openBtn = document.getElementById('openFigmaModal');
  const goProjectBtn = document.getElementById('figmaModalGoProject');

  if (!modal) return;

  const open = () => {
    modal.classList.remove('hidden');
  };

  const close = () => {
    modal.classList.add('hidden');
  };

  if (openBtn) openBtn.addEventListener('click', open);
  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backBtn) backBtn.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });

  if (goProjectBtn) {
    goProjectBtn.addEventListener('click', () => {
      close();
      scrollToId('projects');

      setTimeout(() => {
        const target = document.querySelector('[data-project-title="오늘의 너에게"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 450);
    });
  }
}

function initProjectInfoModal() {
  const modal = document.getElementById('projectInfoModal');
  const backdrop = document.getElementById('projectInfoModalBackdrop');
  const closeBtn = document.getElementById('projectInfoModalClose');
  const backBtn = document.getElementById('projectInfoModalBack');
  const titleEl = document.getElementById('projectInfoModalTitle');
  const bodyEl = document.getElementById('projectInfoModalBody');

  if (!modal || !titleEl || !bodyEl) return;

  const contentByProject = {
    BetweenDays: {
      title: 'BetweenDays',
      bodyHtml: `
        <div>
          <p class="text-xs tracking-[0.22em] text-white/60">주요 기능</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">일기 관리: 추가/수정/삭제, 즐겨찾기, 7개 카테고리 자동 색상 배정</li>
            <li class="leading-relaxed">검색 & 필터: 실시간 검색, 카테고리/날짜 범위/즐겨찾기 필터링</li>
            <li class="leading-relaxed">정렬: 최신순/오래된순/A-Z/Z-A 4가지 방식</li>
            <li class="leading-relaxed">통계 시각화: 카테고리별 원형 차트, 월별 막대 차트, 전체/월별 집계</li>
            <li class="leading-relaxed">UX 기능: 라이트/다크 모드, 스와이프 삭제, 애니메이션 효과</li>
          </ul>
        </div>
        <div>
          <p class="mt-6 text-xs tracking-[0.22em] text-white/60">본인 역할</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">기획 & 설계: MVVM 아키텍처 설계, 데이터 모델 정의, 사용자 시나리오 수립</li>
            <li class="leading-relaxed">Room DB + DAO + Repository 구현</li>
            <li class="leading-relaxed">CRUD, 검색, 필터, 정렬 기능 개발</li>
            <li class="leading-relaxed">MPAndroidChart 기반 통계 시각화</li>
            <li class="leading-relaxed">Coroutines + LiveData 비동기 처리</li>
            <li class="leading-relaxed">UI/UX: Material Design 3 기반 레이아웃, 애니메이션, 테마 시스템 구현</li>
          </ul>
        </div>
      `,
    },
    '오늘의 너에게': {
      title: '오늘의 너에게',
      bodyHtml: `
        <div>
          <p class="text-xs tracking-[0.22em] text-white/60">주요 기능</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">자연어 대화를 통한 실시간 AI 심리 상담</li>
            <li class="leading-relaxed">감정 일기 작성 및 자동 요약</li>
            <li class="leading-relaxed">일기·대화 기반 감정 분석 (스트레스/불안/우울 지표)</li>
            <li class="leading-relaxed">일·주·월 단위 감정 변화 시각화</li>
            <li class="leading-relaxed">반복되는 사고 패턴 및 감정 트리거 분석</li>
            <li class="leading-relaxed">상황별 맞춤 조언 및 행동 가이드 제공</li>
            <li class="leading-relaxed">상담·일기 통합 리포트 생성</li>
          </ul>
        </div>
        <div>
          <p class="mt-6 text-xs tracking-[0.22em] text-white/60">본인 역할</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">전체 서비스 기획 및 기능 흐름 설계</li>
            <li class="leading-relaxed">AI 상담 및 감정 일기 서비스의 핵심 기능 정의 및 사용자 시나리오 기획</li>
            <li class="leading-relaxed">프로젝트 스토리에 맞춘 발표 자료 기획 및 디자인</li>
            <li class="leading-relaxed">Figma를 활용한 UX/UI 흐름 설계 및 화면 포스터·도록 디자인 제작</li>
          </ul>
        </div>
      `,
    },
    MbtiHub: {
      title: 'MbtiHub',
      bodyHtml: `
        <div>
          <p class="text-xs tracking-[0.22em] text-white/60">주요 기능</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">MBTI 유형 콘텐츠</li>
            <li class="leading-relaxed">커뮤니티 게시글</li>
            <li class="leading-relaxed">댓글 & 좋아요</li>
            <li class="leading-relaxed">회원 시스템 (JWT 인증)</li>
            <li class="leading-relaxed">신고 및 관리자 기능</li>
            <li class="leading-relaxed">풀스택 배포 환경</li>
          </ul>
        </div>
        <div>
          <p class="mt-6 text-xs tracking-[0.22em] text-white/60">본인 역할</p>
          <ul class="mt-3 space-y-2">
            <li class="leading-relaxed">전체 서비스 기획 및 구조 설계</li>
            <li class="leading-relaxed">React 기반 화면 구성 및 라우팅</li>
            <li class="leading-relaxed">Spring Boot + JPA 기반 REST API 설계</li>
            <li class="leading-relaxed">DB 설계 및 연동</li>
            <li class="leading-relaxed">Vercel / Render 환경 변수 설정 및 배포</li>
          </ul>
        </div>
      `,
    },
  };

  const open = (projectTitle) => {
    const content = contentByProject[projectTitle];
    if (!content) return;
    titleEl.textContent = content.title;
    bodyEl.innerHTML = content.bodyHtml;
    modal.classList.remove('hidden');
  };

  const close = () => {
    modal.classList.add('hidden');
  };

  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backBtn) backBtn.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-project-info]');
    if (!btn) return;
    const projectTitle = btn.getAttribute('data-project-info');
    if (!projectTitle) return;
    open(projectTitle);
  });
}

// Snow Canvas
function initSnowCanvas() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;

  if (window.__snowCanvasController) {
    window.__snowCanvasController.start();
    return;
  }
  
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = false;

  let onResize = null;

  const flakes = [];
  const flakeCount = 110;

  const rand = (min, max) => min + Math.random() * (max - min);
  
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.floor(window.innerWidth);
    height = Math.floor(window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const resetFlake = (f, y) => {
    f.x = rand(0, width);
    f.y = y;
    f.r = rand(0.8, 2.8);
    f.vx = rand(-0.18, 0.25);
    f.vy = rand(0.5, 1.35);
    f.a = rand(0.25, 0.85);
  };

  resize();
  flakes.length = 0;
  for (let i = 0; i < flakeCount; i++) {
    const f = { x: 0, y: 0, r: 0, vx: 0, vy: 0, a: 0 };
    resetFlake(f, rand(-height, height));
    flakes.push(f);
  }

  const tick = () => {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      f.x += f.vx;
      f.y += f.vy;

      if (f.y > height + 10) resetFlake(f, -10);
      if (f.x < -10) f.x = width + 10;
      if (f.x > width + 10) f.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.a})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = window.requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    canvas.style.display = '';
    resize();
    onResize = () => resize();
    window.addEventListener('resize', onResize);
    raf = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    if (onResize) window.removeEventListener('resize', onResize);
    onResize = null;
    ctx.clearRect(0, 0, width, height);
    canvas.style.display = 'none';
  };

  window.__snowCanvasController = { start, stop };
  start();
}

function initPetalCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  if (window.__petalCanvasController) {
    window.__petalCanvasController.start();
    return;
  }

  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = false;

  let petalRgb = '255, 190, 210';
  let petalStrokeRgb = '255, 255, 255';

  let onResize = null;
  const petals = [];
  const petalCount = 52;
  const rand = (min, max) => min + Math.random() * (max - min);

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.floor(window.innerWidth);
    height = Math.floor(window.innerHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const resetPetal = (p, y) => {
    p.x = rand(-40, width + 40);
    p.y = y;
    p.r = rand(4.5, 8.5);
    p.vx = rand(0.25, 0.85);
    p.vy = rand(0.45, 1.25);
    p.rot = rand(0, Math.PI * 2);
    p.vrot = rand(-0.03, 0.03);
    p.wobble = rand(0, Math.PI * 2);
    p.vwobble = rand(0.012, 0.03);
    p.a = rand(0.35, 0.75);
  };

  const readThemeColors = () => {
    const styles = window.getComputedStyle(document.documentElement);
    const nextPetal = styles.getPropertyValue('--petal-rgb').trim();
    const nextStroke = styles.getPropertyValue('--petal-stroke-rgb').trim();
    if (nextPetal) petalRgb = nextPetal;
    if (nextStroke) petalStrokeRgb = nextStroke;
  };

  const drawPetal = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const wobbleX = Math.sin(p.wobble) * 3;
    const wobbleY = Math.cos(p.wobble * 0.9) * 1.2;
    ctx.translate(wobbleX, wobbleY);

    const w = p.r * 1.1;
    const h = p.r * 1.45;

    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w, -h * 0.55, w, h * 0.55, 0, h);
    ctx.bezierCurveTo(-w, h * 0.55, -w, -h * 0.55, 0, -h);
    ctx.closePath();

    ctx.fillStyle = `rgba(${petalRgb}, ${p.a})`;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -h * 0.85);
    ctx.lineTo(0, h * 0.85);
    ctx.strokeStyle = `rgba(${petalStrokeRgb}, ${p.a * 0.35})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of petals) {
      p.x += p.vx + Math.sin(p.wobble) * 0.35;
      p.y += p.vy;
      p.rot += p.vrot;
      p.wobble += p.vwobble;

      if (p.y > height + 30) resetPetal(p, -30);
      if (p.x > width + 60) p.x = -60;

      drawPetal(p);
    }

    raf = window.requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    canvas.style.display = '';
    readThemeColors();
    resize();

    petals.length = 0;
    for (let i = 0; i < petalCount; i++) {
      const p = { x: 0, y: 0, r: 0, vx: 0, vy: 0, rot: 0, vrot: 0, wobble: 0, vwobble: 0, a: 0 };
      resetPetal(p, rand(-height, height));
      petals.push(p);
    }

    onResize = () => resize();
    window.addEventListener('resize', onResize);
    raf = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    if (onResize) window.removeEventListener('resize', onResize);
    onResize = null;
    ctx.clearRect(0, 0, width, height);
    canvas.style.display = 'none';
  };

  window.__petalCanvasController = { start, stop };
  stop();
}

function updateHeroCopy(theme) {
  const heroTitleLead = document.getElementById('heroTitleLead');
  const heroTitleEmphasis = document.getElementById('heroTitleEmphasis');
  const heroDescription = document.getElementById('heroDescription');

  if (!heroTitleLead || !heroTitleEmphasis || !heroDescription) return;

  if (theme === 'spring') {
    heroTitleLead.textContent = '봄의 설렘과 함께,';
    heroTitleEmphasis.innerHTML = '완성도 있는 제품을<br /><span class="whitespace-nowrap">만드는 개발자</span>';
    heroDescription.textContent = '사용자 경험과 디테일(성능/접근성/반응형)을 끝까지 다듬는 것을 우선시합니다. 계절에 따라 분위기를 조율하듯, 조직과 서비스에 맞게 가장 적합한 형태로 스스로를 설계합니다.';
  } else {
    heroTitleLead.textContent = '연말의 분위기와 함께,';
    heroTitleEmphasis.innerHTML = '완성도 있는 제품을<br /><span class="whitespace-nowrap">만드는 개발자</span>';
    heroDescription.textContent = '사용자 경험과 디테일(성능/접근성/반응형)을 끝까지 다듬는 것을 우선시합니다. 하나의 정답보다, 상황에 맞는 최적해를 찾습니다. 계절이 바뀌듯, 환경에 맞게 진화하는 개발자입니다.';
  }
}

// Intro overlay
function initIntroOverlay() {
  const introOverlay = document.getElementById('introOverlay');
  const introSweep = document.getElementById('introSweep');
  const introEnterBtn = document.getElementById('introEnterBtn');
  
  if (!introOverlay || !introSweep) return;

  let introDone = false;
  let introDismissed = false;

  const dismissIntro = () => {
    if (introDismissed) return;
    introDismissed = true;
    introOverlay.classList.add('opacity-0', 'pointer-events-none');
  };

  // Auto dismiss after animations
  setTimeout(() => {
    introDone = true;
    introSweep.classList.add('intro-sweep-done');
  }, 900);

  setTimeout(() => {
    dismissIntro();
  }, 1250);

  if (introEnterBtn) {
    introEnterBtn.addEventListener('click', dismissIntro);
  }
}

// Video modal
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const videoModalBackdrop = document.getElementById('videoModalBackdrop');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalPlayer = document.getElementById('videoModalPlayer');

  if (!videoModal) return;

  const openModal = (title, src) => {
    if (videoModalTitle) videoModalTitle.textContent = title;
    if (videoModalPlayer) {
      videoModalPlayer.src = src;
      videoModalPlayer.load();
    }
    videoModal.classList.remove('hidden');
  };

  const closeModal = () => {
    videoModal.classList.add('hidden');
    if (videoModalPlayer) {
      videoModalPlayer.pause();
      videoModalPlayer.src = '';
    }
  };

  if (videoModalBackdrop) {
    videoModalBackdrop.addEventListener('click', closeModal);
  }
  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Expose openModal globally for project links
  window.openVideoModal = openModal;
}

// Projects rendering
function renderProjects(projectsToRender) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.innerHTML = projectsToRender.map(p => {
    const tagsHtml = p.tags.map(t => {
      const key = normalizeSkill(t);
      return `<span class="badge" data-skill="${key}">${t}</span>`;
    }).join('');
    
    const linksHtml = p.links.map(l => {
      if (l.kind === 'video') {
        return `<button type="button" onclick="window.openVideoModal('${p.title}', '${l.href}')" class="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
          ${l.label}
          <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>`;
      } else if (l.href.startsWith('demo/')) {
        return `<a href="${l.href}" class="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
          ${l.label}
          <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>`;
      } else {
        return `<a href="${l.href}" target="_blank" rel="noreferrer" class="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
          ${l.label}
          <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </a>`;
      }
    }).join('');

    return `
      <article class="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-white/[0.07]" data-project-title="${p.title}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="text-lg font-semibold tracking-tight">${p.title}</h4>
            <p class="mt-1 text-sm text-white/70">${p.subtitle}</p>
          </div>
          ${PROJECTS_WITH_INFO.has(p.title)
            ? `<button type="button" class="project-info-btn grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white/90 transition hover:bg-white/15" data-project-info="${p.title}" aria-label="프로젝트 상세 보기">
                <svg class="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>`
            : `<div class="h-10 w-10"></div>`}
        </div>
        <p class="mt-4 text-sm leading-relaxed text-white/75">${p.description}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          ${tagsHtml}
        </div>
        <div class="mt-5 flex flex-col gap-2 sm:flex-row">
          ${linksHtml}
        </div>
      </article>
    `;
  }).join('');

  applySkillHighlights();
}

// Projects filtering
function initProjectsFilter() {
  const featuredOnlyCheckbox = document.getElementById('featuredOnly');
  const container = document.getElementById('projectsContainer');
  
  if (!featuredOnlyCheckbox || !container) return;

  let featuredOnly = false;
  let projectsToggleBusy = false;

  const toggleFeaturedOnly = (next) => {
    if (projectsToggleBusy) return;
    projectsToggleBusy = true;
    container.style.opacity = '0';
    container.style.transform = 'translateY(-4px)';

    setTimeout(() => {
      requestAnimationFrame(() => {
        featuredOnly = next;
        const visibleProjects = featuredOnly
          ? projects.filter(p => p.title === '오늘의 너에게' || p.title === 'BetweenDays' || p.title === 'MbtiHub')
          : projects;
        renderProjects(visibleProjects);
        
        requestAnimationFrame(() => {
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
          setTimeout(() => {
            projectsToggleBusy = false;
          }, 260);
        });
      });
    }, 240);
  };

  featuredOnlyCheckbox.addEventListener('change', (e) => {
    toggleFeaturedOnly(e.target.checked);
  });
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '');
    const title = String(formData.get('title') || '');
    const message = String(formData.get('message') || '');

    const subject = encodeURIComponent(title || `Portfolio Contact - ${name || 'Anonymous'}`);
    const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`);
    window.location.href = `mailto:ysking1127@gmail.com?subject=${subject}&body=${body}`;
  });
}

// Smooth scroll handlers
function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll-to');
      scrollToId(targetId);
    });
  });
}

// Footer year
function initFooterYear() {
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()} 정영수. All rights reserved.`;
  }
}

function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  const prefersReducedMotion = usePrefersReducedMotion();
  const showThreshold = 320;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    if (y > showThreshold) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }

    if (prefersReducedMotion) {
      btn.style.transition = 'none';
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

function initThemeToggle() {
  const THEME_KEY = 'portfolioTheme';
  const html = document.documentElement;
  const buttons = Array.from(document.querySelectorAll('.theme-toggle-btn'));

  const updateButtons = (theme) => {
    buttons.forEach((b) => {
      const isActive = b.getAttribute('data-theme') === theme;
      b.classList.toggle('is-active', isActive);
    });
  };

  const updateSeasonEffects = (theme) => {
    if (theme === 'winter') {
      initSnowCanvas();
      if (window.__snowCanvasController) window.__snowCanvasController.start();

      if (window.__petalCanvasController) window.__petalCanvasController.stop();
      const petalCanvas = document.getElementById('petalCanvas');
      if (petalCanvas) petalCanvas.style.display = 'none';
    } else {
      if (window.__snowCanvasController) window.__snowCanvasController.stop();
      const canvas = document.getElementById('snowCanvas');
      if (canvas) canvas.style.display = 'none';

      initPetalCanvas();
      if (window.__petalCanvasController) window.__petalCanvasController.start();
    }
  };

  const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
    updateButtons(theme);
    updateHeroCopy(theme);
    updateSeasonEffects(theme);
  };

  let initialTheme = 'winter';
  try {
    initialTheme = window.localStorage.getItem(THEME_KEY) || 'winter';
  } catch (_) {}
  if (initialTheme !== 'winter' && initialTheme !== 'spring') initialTheme = 'winter';

  setTheme(initialTheme);

  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      const theme = b.getAttribute('data-theme');
      if (!theme) return;
      setTheme(theme);
    });
  });
}

// GitHub Pages SPA routing handler
function handleSPARouting() {
  // Check if we have a path in the URL (from 404.html redirect)
  var path = window.location.search.slice(1).toLowerCase();
  if (path && path.indexOf('&') !== -1) {
    path = path.slice(0, path.indexOf('&'));
  }
  path = path.replace(/~and~/g, '&');
  path = decodeURIComponent(path);
  
  if (path) {
    // Remove leading slash if present
    path = path.replace(/^\/+/, '');
    
    // Handle demo routes
    if (path.startsWith('demo/')) {
      const demoPath = path.replace('demo/', '');
      if (demoPath === 'phishtrainer' || demoPath === 'scalpai') {
        window.location.href = `demo/${demoPath}.html`;
        return;
      }
    }
    
    // Handle section anchors (e.g., #about, #projects)
    if (path.startsWith('#')) {
      const sectionId = path.slice(1);
      setTimeout(() => {
        scrollToId(sectionId);
      }, 100);
    } else {
      // Try to scroll to section if it exists
      const sectionId = path.split('/').pop();
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          scrollToId(sectionId);
        }
      }, 100);
    }
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initIntroOverlay();
  initVideoModal();
  renderProjects(projects);
  initSkillFilterHighlight();
  initProjectsFilter();
  initFigmaModal();
  initProjectInfoModal();
  initContactForm();
  initSmoothScroll();
  initFooterYear();
  initScrollTopButton();
  handleSPARouting();
});

