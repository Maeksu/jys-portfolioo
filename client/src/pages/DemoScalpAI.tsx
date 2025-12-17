import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Mail, Rocket, Sparkles, TrendingUp } from 'lucide-react'

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
      f.r = rand(0.8, 2.5)
      f.vx = rand(-0.18, 0.25)
      f.vy = rand(0.55, 1.35)
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

export default function DemoScalpAI() {
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
            <Rocket className="h-4 w-4" />
            오픈 준비중
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <p className="text-xs tracking-[0.22em] text-white/60">PRE-LAUNCH</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">ScalpAI</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
              현재 데모는 <span className="font-semibold text-white/90">오픈 준비중</span>입니다.
              제품의 핵심 컨셉(전략 생성 → 요약 → 시각화 → 알림)을 보여줄 수 있도록, 출시 전 페이지를
              ‘미니 랜딩’ 형태로 구성했습니다.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  핵심 가치
                </div>
                <p className="mt-2 text-sm text-white/70">초단기 매매 전략을 더 빠르게 이해·결정</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" />
                  출시 준비
                </div>
                <p className="mt-2 text-sm text-white/70">지표/모델 성능 검증 및 UI 시각화 고도화</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-sm font-semibold">출시 전 공개할 것</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>전략 결과 리포트(샘플) 템플릿 공개</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>차트 기반 시각화(시그널/손익) 개선</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>알림(메시지 포맷) UI 데모 추가</span>
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
                진행사항 문의
                <Mail className="ml-2 h-4 w-4" />
              </a>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Mini Landing
              </div>
              <p className="mt-2 text-sm text-white/70">
                ‘미완성’이어도 클릭했을 때 허전하지 않게,
                제품의 메시지와 다음 단계를 한 눈에 보여주는 페이지로 구성했습니다.
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">Status</p>
                <p className="mt-1 text-sm font-semibold">Preparing to Launch</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">ETA</p>
                <p className="mt-1 text-sm font-semibold">TBD</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
