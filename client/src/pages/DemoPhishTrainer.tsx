import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cone, Mail, ShieldAlert, Wrench } from 'lucide-react'

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

function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

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
    const flakeCount = 95

    const rand = (min: number, max: number) => min + Math.random() * (max - min)
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

    const resetFlake = (f: Flake, y: number) => {
      f.x = rand(0, width)
      f.y = y
      f.r = rand(0.9, 2.6)
      f.vx = rand(-0.15, 0.2)
      f.vy = rand(0.55, 1.25)
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
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  )
}

export default function DemoPhishTrainer() {
  return (
    <div className="min-h-dvh bg-[#070B18] text-white">
      <SnowCanvas />

      <header className="relative z-10 border-b border-white/10 bg-[#070B18]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            포트폴리오로
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
            <Cone className="h-4 w-4" />
            공사중
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <p className="text-xs tracking-[0.22em] text-white/60">DEMO PREVIEW</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">PhishTrainer</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
              현재 데모는 <span className="font-semibold text-white/90">공사중</span>입니다.
              다만 ‘완성되면 어떤 경험이 될지’가 보이도록, 화면 컨셉/흐름/톤은 먼저 잡아두었습니다.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert className="h-4 w-4" />
                  목표
                </div>
                <p className="mt-2 text-sm text-white/70">실전형 피싱 시나리오로 보안 인식 훈련</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Wrench className="h-4 w-4" />
                  진행 상태
                </div>
                <p className="mt-2 text-sm text-white/70">UI/시나리오 보강 및 테스트 플로우 정리 중</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm font-semibold">이번 주 작업 체크리스트</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>메일 템플릿/발송 흐름 정리</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>훈련용 랜딩/경고 UX 개선</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>사용자 행동 로그 수집 설계(열람/클릭)</span>
                </li>
              </ul>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                홈으로 돌아가기
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="mailto:ysking1127@gmail.com"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                진행상황 문의
                <Mail className="ml-2 h-4 w-4" />
              </a>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5">
              <p className="text-sm font-semibold">공사중이지만, 분위기는 미리</p>
              <p className="mt-2 text-sm text-white/70">
                데모 페이지 자체도 ‘그럴듯하게’ 보이도록 톤앤매너를 맞췄습니다.
                출시 전까지는 이 페이지가 상태 페이지(스테이터스) 역할을 합니다.
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">Status</p>
                <p className="mt-1 text-sm font-semibold">Under Construction</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">Next</p>
                <p className="mt-1 text-sm font-semibold">플로우 데모 / 시나리오 강화</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
