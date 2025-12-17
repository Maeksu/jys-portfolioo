import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Calendar,
  Code2,
  Cpu,
  Github,
  Layers,
  Mail,
  MapPin,
  Palette,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react'

type Project = {
  title: string
  subtitle: string
  description: string
  tags: string[]
  links: { label: string; href: string; kind?: 'video' }[]
}

const GITHUB_URL = 'https://github.com/Maeksu/git00.git'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function SnowCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    type Flake = {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      a: number
    }

    const flakes: Flake[] = []
    const flakeCount = 110

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.floor(window.innerWidth)
      height = Math.floor(window.innerHeight)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const rand = (min: number, max: number) => min + Math.random() * (max - min)
    const resetFlake = (f: Flake, y: number) => {
      f.x = rand(0, width)
      f.y = y
      f.r = rand(0.8, 2.8)
      f.vx = rand(-0.18, 0.25)
      f.vy = rand(0.5, 1.35)
      f.a = rand(0.25, 0.85)
    }

    resize()
    flakes.length = 0
    for (let i = 0; i < flakeCount; i++) {
      const f = { x: 0, y: 0, r: 0, vx: 0, vy: 0, a: 0 }
      resetFlake(f, rand(-height, height))
      flakes.push(f)
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)

      for (const f of flakes) {
        f.x += f.vx
        f.y += f.vy

        if (f.y > height + 10) resetFlake(f, -10)
        if (f.x < -10) f.x = width + 10
        if (f.x > width + 10) f.x = -10

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${f.a})`
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = window.requestAnimationFrame(tick)
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    raf = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(raf)
    }
  }, [enabled, prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90">
      {children}
    </span>
  )
}

function Card({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white">
          {icon}
        </div>
        <h3 className="text-sm font-semibold tracking-wide text-white/90">{title}</h3>
      </div>
      <div className="text-sm text-white/75">{children}</div>
    </div>
  )
}

function App() {
  const [introDone, setIntroDone] = useState(false)
  const [introDismissed, setIntroDismissed] = useState(false)
  const [videoModal, setVideoModal] = useState<null | { title: string; src: string }>(null)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [projectsFolding, setProjectsFolding] = useState(false)
  const [projectsToggleBusy, setProjectsToggleBusy] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setIntroDone(true), 900)
    const t2 = window.setTimeout(() => setIntroDismissed(true), 1250)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (!videoModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoModal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [videoModal])

  const projects: Project[] = useMemo(
    () => [
      {
        title: 'PhishTrainer',
        subtitle: '실전형 피싱 메일 시뮬레이션 & 보안 인식 교육',
        description:
          '실제 피싱 흐름을 모사한 훈련 시나리오로 클릭·행동 데이터를 기반으로 사용자의 보안 경각심을 끌어올리는 교육형 웹 서비스.',
        tags: ['React', 'Node.js', 'Express', 'Nodemailer', 'Tailwind', 'Firebase'],
        links: [
          { label: 'Demo (미완성)', href: '/demo/phishtrainer' },
        ],
      },
      {
        title: 'ScalpAI',
        subtitle: 'AI 기반 초단기 트레이딩 전략 추천',
        description:
          '딥러닝 기반 분석으로 초단기(1~5분) 전략을 생성·요약하고, 시각화와 메시지 형태의 리포트로 빠른 의사결정을 돕는 서비스.',
        tags: ['Python', 'Flask', 'React', 'Chart.js', 'ML/DL', 'API'],
        links: [
          { label: 'Demo (미완성)', href: '/demo/scalpai' },
        ],
      },
      {
        title: '오늘의 너에게',
        subtitle: 'AI 기반 맞춤형 심리 상담 & 감정 일기 서비스',
        description:
          '대화 및 감정 일기 데이터를 기반으로 감정 상태·스트레스 수준·사고 패턴을 분석해 맞춤형 상담/피드백을 제공하는 멘탈 케어 서비스입니다. 실시간 채팅형 상담 UI와 감정 그래프를 통해 감정 변화 흐름과 반복되는 고민을 시각화합니다.',
        tags: [
          'React',
          'Node.js',
          'Firebase',
          'Firestore',
          'Firebase Auth',
          'Bootstrap',
          'Cloudflare',
        ],
        links: [{ label: 'Site', href: 'https://todaytoyou.pages.dev/' }],
      },
      {
        title: 'BetweenDays',
        subtitle: '기록 및 통계 분석 일기 앱 (Mobile)',
        description:
          '일상을 기록하고 카테고리/시간대별로 자동 분류하여 감정 흐름을 파악할 수 있는 일기 앱입니다. 검색·필터·정렬과 통계 대시보드(원형 차트/막대 차트)로 패턴을 객관적으로 이해할 수 있도록 설계했습니다.',
        tags: ['Android', 'Kotlin', 'MVVM', 'Room DB', 'Coroutines', 'LiveData', 'MPAndroidChart', 'Material 3'],
        links: [{ label: '구현 영상', href: '/videos/betweendays.mp4', kind: 'video' }],
      },
    ],
    []
  )

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleFeaturedOnly = (next: boolean) => {
    if (projectsToggleBusy) return
    setProjectsToggleBusy(true)
    setProjectsFolding(true)

    window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        setFeaturedOnly(next)
        window.requestAnimationFrame(() => {
          setProjectsFolding(false)
          window.setTimeout(() => setProjectsToggleBusy(false), 260)
        })
      })
    }, 240)
  }

  const visibleProjects = featuredOnly
    ? projects.filter((p) => p.title === '오늘의 너에게' || p.title === 'BetweenDays')
    : projects

  return (
    <div className="min-h-dvh bg-[#070B18] text-white">
      <SnowCanvas enabled />

      {videoModal ? (
        <div
          className="fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label={`${videoModal.title} 구현 영상`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setVideoModal(null)}
          />
          <div className="relative z-10 mx-auto mt-16 w-[min(980px,94vw)] overflow-hidden rounded-3xl border border-white/10 bg-[#070B18] shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <div>
                <p className="text-xs tracking-[0.22em] text-white/60">IMPLEMENTATION VIDEO</p>
                <p className="mt-1 text-sm font-semibold">{videoModal.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setVideoModal(null)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black/30 p-3">
              <video
                key={videoModal.src}
                className="aspect-video w-full rounded-2xl"
                src={videoModal.src}
                controls
                preload="metadata"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={
          `fixed inset-0 z-50 grid place-items-center bg-[#070B18] transition-opacity duration-500 ` +
          (introDismissed ? 'pointer-events-none opacity-0' : 'opacity-100')
        }
        aria-hidden={introDismissed}
      >
        <div className="relative mx-auto w-[min(520px,92vw)] rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div
              className={
                `absolute -left-1/3 top-0 h-full w-2/3 bg-gradient-to-r from-transparent via-white/12 to-transparent ` +
                (introDone ? 'intro-sweep-done' : 'intro-sweep')
              }
            />
          </div>

          <div className="relative">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs tracking-[0.22em] text-white/60">YEAR-END PORTFOLIO</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">정영수</h1>
            <p className="mt-2 text-sm text-white/70">
              기획부터 배포까지 책임지는 실전형 풀스택 개발자
            </p>

            <button
              type="button"
              onClick={() => setIntroDismissed(true)}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Enter
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </button>

            <p className="mt-3 text-xs text-white/50">자동으로 전환됩니다 (약 1초)</p>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070B18]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => scrollToId('top')}
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-left text-sm font-semibold tracking-tight hover:bg-white/5"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>YS Portfolio</span>
          </button>

          <nav className="hidden items-center gap-1 sm:flex">
            <button className="nav-btn" onClick={() => scrollToId('about')} type="button">
              About
            </button>
            <button className="nav-btn" onClick={() => scrollToId('stack')} type="button">
              Stack
            </button>
            <button className="nav-btn" onClick={() => scrollToId('projects')} type="button">
              Projects
            </button>
            <button className="nav-btn" onClick={() => scrollToId('contact')} type="button">
              Contact
            </button>
          </nav>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:pb-16 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Open to work
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                연말의 분위기와 함께,
                <span className="block text-white/80">완성도 있는 제품을 만드는<br /> 개발자</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                사용자 경험과 디테일(성능/접근성/반응형)을 끝까지 다듬는 것을 우선시합니다.
                올해의 결과물을 더 매력적으로 보여주기 위해 크리스마스 무드의 인터랙션을 더했습니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToId('projects')}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  프로젝트 보기
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  GitHub 방문
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <Badge>빠른 프로토타이핑</Badge>
                <Badge>사용자 중심 사고</Badge>
                <Badge>꼼꼼한 코드 리뷰</Badge>
                <Badge>호기심 많은 학습자</Badge>
                <div className="w-full" />
                <Badge>열린 소통</Badge>
                <Badge>끈기 있는 문제 해결</Badge>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="grid gap-3">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                    <img
                      src="/assets/KakaoTalk_20250312_014606759.jpg"
                      alt="프로필"
                      className="h-[260px] w-full object-contain bg-black/20 sm:h-[320px]"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B18]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-sm font-semibold">정영수</p>
                      <p className="mt-1 text-xs text-white/70">Full-stack developer · Product-minded</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Focus</p>
                      <p className="mt-1 text-sm font-semibold">UI · 안정성 · 최적화</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Status</p>
                      <p className="mt-1 text-sm font-semibold">시니어로 성장 중</p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="About" icon={<Sparkles className="h-4 w-4" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">이름</p>
                    <p className="mt-1 text-sm font-semibold">정영수</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">생년월일</p>
                    <p className="mt-1 text-sm font-semibold">04.11.27</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">위치</p>
                    <p className="mt-1 text-sm font-semibold">인천광역시 부평구</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">연락처</p>
                    <p className="mt-1 text-sm font-semibold">010-8236-2243</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">이메일</p>
                    <p className="mt-1 text-sm font-semibold">ysking1127@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">학력</p>
                    <p className="mt-1 text-sm font-semibold">재능대학교 컴퓨터소프트웨어학과</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Skills" icon={<Code2 className="h-4 w-4" />}>
              <div className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-start">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60">LANGUAGE</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>TypeScript</Badge>
                    <Badge>JavaScript</Badge>
                    <Badge>Python</Badge>
                    <Badge>Java</Badge>
                    <Badge>Kotlin</Badge>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-start">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60">FRONTEND</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>Tailwind CSS</Badge>
                    <Badge>Vite</Badge>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-start">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60">BACKEND</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Spring (Boot)</Badge>
                    <Badge>Gradle</Badge>
                    <Badge>Firebase</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>Express</Badge>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-start">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/60">DEVOPS</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Docker</Badge>
                    <Badge>AWS</Badge>
                    <Badge>Cloudflare</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="stack" className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold tracking-tight">How I Work</h3>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              구현을 넘어 일정/품질/협업까지 챙기며 완성도를 올립니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Planning & Delivery" icon={<Sparkles className="h-4 w-4" />}>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">목표 정리</span>: 우선순위 설정
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">완성 기준</span>: 배포 가능한 품질
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">리스크 관리</span>: 어려운 것 먼저
                  </span>
                </li>
              </ul>
            </Card>

            <Card title="Collaboration" icon={<Github className="h-4 w-4" />}>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">Git 기반</span>: PR 단위
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">문서화</span>: 변경 이유 기록
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">합의</span>: 규칙 맞추기
                  </span>
                </li>
              </ul>
            </Card>

            <Card title="UI & Maintainability" icon={<Layers className="h-4 w-4" />}>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">컴포넌트화</span>: 재사용
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">상태 관리</span>: 전역/로컬 분리
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">디테일</span>: UX 마감
                  </span>
                </li>
              </ul>
            </Card>

            <Card title="Tools & AI" icon={<Palette className="h-4 w-4" />}>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">시안/탐색</span>: 빠른 비교
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">반복 자동화</span>: 시간 절약
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>
                    <span className="font-semibold text-white/90">품질 점검</span>: 오류 정리
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section id="projects" className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Projects</h3>
              <p className="mt-2 text-sm text-white/70">학습과 실험을 통해 완성한 프로젝트들을 정리했습니다.</p>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <span className="font-semibold text-white/90">주요 프로젝트만 보기</span>
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => toggleFeaturedOnly(e.target.checked)}
                disabled={projectsToggleBusy}
                className="h-5 w-5 rounded border-white/20 bg-transparent accent-white"
                aria-label="주요 프로젝트만 보기"
              />
            </label>
          </div>

          <div
            className={
              `grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-in-out ` +
              (projectsFolding ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0')
            }
            style={{ gridTemplateRows: projectsFolding ? '0fr' : '1fr' }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="grid gap-6 lg:grid-cols-2">
                {visibleProjects.map((p) => (
                  <article
                    key={p.title}
                    className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold tracking-tight">{p.title}</h4>
                        <p className="mt-1 text-sm text-white/70">{p.subtitle}</p>
                      </div>
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white/90">
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-white/75">{p.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      {p.links.map((l) =>
                        l.kind === 'video' ? (
                          <button
                            key={l.label}
                            type="button"
                            onClick={() => setVideoModal({ title: p.title, src: l.href })}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                          >
                            {l.label}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </button>
                        ) : l.href.startsWith('/demo/') ? (
                          <Link
                            key={l.label}
                            to={l.href}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                          >
                            {l.label}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        ) : (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                          >
                            {l.label}
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </a>
                        )
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid gap-6 py-1 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <div className="mb-2 flex items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
                <span>CONTACT</span>
                <Mail className="h-6 w-6" />
              </div>
              <p className="text-sm text-white/70">Thank you :)</p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <img
                  src="/assets/H858ea39e55434184a93cd8ada561245bL.avif"
                  alt="Contact"
                  className="mx-auto aspect-square w-[min(340px,100%)] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <form
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const data = new FormData(form)
                const name = String(data.get('name') ?? '')
                const title = String(data.get('title') ?? '')
                const message = String(data.get('message') ?? '')

                const subject = encodeURIComponent(title || `Portfolio Contact - ${name || 'Anonymous'}`)
                const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`)
                window.location.href = `mailto:ysking1127@gmail.com?subject=${subject}&body=${body}`
              }}
            >
              <div className="grid gap-3 py-1">
                <input
                  name="name"
                  placeholder="Name"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                <input
                  name="title"
                  placeholder="Title"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={10}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                <button
                  type="submit"
                  className="relative mt-2 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  이메일 바로 보내기
                  <ArrowUpRight className="absolute right-4 top-3 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} 정영수. All rights reserved.</p>
            <div className="flex flex-wrap gap-3">
              <a className="footer-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
                GitHub
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
              <button className="footer-link" type="button" onClick={() => scrollToId('top')}>
                Back to top
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
