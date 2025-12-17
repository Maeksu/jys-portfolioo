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

// Snow Canvas
function initSnowCanvas() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;
  
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

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

  const onResize = () => resize();
  window.addEventListener('resize', onResize);
  raf = window.requestAnimationFrame(tick);
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
    const tagsHtml = p.tags.map(t => `<span class="badge">${t}</span>`).join('');
    
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
      <article class="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-white/[0.07]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="text-lg font-semibold tracking-tight">${p.title}</h4>
            <p class="mt-1 text-sm text-white/70">${p.subtitle}</p>
          </div>
          <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white/90">
            <svg class="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
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
          ? projects.filter(p => p.title === '오늘의 너에게' || p.title === 'BetweenDays')
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
  initSnowCanvas();
  initIntroOverlay();
  initVideoModal();
  renderProjects(projects);
  initProjectsFilter();
  initContactForm();
  initSmoothScroll();
  initFooterYear();
  handleSPARouting();
});

