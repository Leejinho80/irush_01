import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import trendsData from '../data/trends.json'
import './TrendPage.css'

gsap.registerPlugin(ScrollTrigger)

const TrendPage = () => {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [expandedTrend, setExpandedTrend] = useState(null)
  const [trends, setTrends] = useState([])
  const [lastUpdated, setLastUpdated] = useState('')
  const [displayDate, setDisplayDate] = useState('')
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  // JSON 데이터 로드
  useEffect(() => {
    if (trendsData && trendsData.trends) {
      setTrends(trendsData.trends)

      // 표시 날짜
      if (trendsData.displayDate) {
        setDisplayDate(trendsData.displayDate)
      }

      // 업데이트 시간 포맷팅
      if (trendsData.updatedAt) {
        const date = new Date(trendsData.updatedAt)
        const kstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000))
        setLastUpdated(
          `${kstDate.getFullYear()}.${String(kstDate.getMonth() + 1).padStart(2, '0')}.${String(kstDate.getDate()).padStart(2, '0')}`
        )
      }
    }
  }, [])

  // GSAP 애니메이션
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 히어로 타이틀 애니메이션
      gsap.from('.trend-hero-line', {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.2
      })

      // 히어로 서브텍스트 애니메이션
      gsap.from('.trend-hero-sub', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
      })

      // 스크롤 인디케이터 애니메이션
      gsap.from('.scroll-indicator', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.2
      })

      // 트렌드 아이템 스크롤 애니메이션
      if (trends.length > 0) {
        gsap.from('.trend-item', {
          scrollTrigger: {
            trigger: '.trend-list-section',
            start: 'top 80%'
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out'
        })
      }

      // 인트로 섹션 패럴랙스
      gsap.to('.trend-hero', {
        scrollTrigger: {
          trigger: '.trend-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 100,
        opacity: 0.5
      })

    }, containerRef)

    return () => ctx.revert()
  }, [trends])

  const toggleTrend = (id) => {
    setExpandedTrend(expandedTrend === id ? null : id)
  }

  // 파티클 캔버스 초기화 및 애니메이션
  const initParticles = useCallback((canvas) => {
    const particles = []
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000)

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.8 ? '#ff6b6b' : '#ffffff'
      })
    }
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      particlesRef.current = initParticles(canvas)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // 마우스 인터랙션
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.vx -= (dx / distance) * force * 0.02
          particle.vy -= (dy / distance) * force * 0.02
        }

        // 물리 업데이트
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.99
        particle.vy *= 0.99

        // 경계 처리
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // 그리기
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color === '#ffffff'
          ? `rgba(255, 255, 255, ${particle.alpha})`
          : `rgba(255, 107, 107, ${particle.alpha + 0.2})`
        ctx.fill()
      })

      // 연결선 그리기
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255, 107, 107, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles])

  return (
    <div ref={containerRef} className="trend-page">
      {/* Hero Section - 대형 타이포그래피 */}
      <section ref={heroRef} className="trend-hero">
        {/* 인터랙티브 파티클 캔버스 */}
        <canvas ref={canvasRef} className="trend-hero-canvas" />

        {/* 배경 그라디언트 효과 */}
        <div className="trend-hero-bg">
          <div className="trend-hero-gradient" />
          <div className="trend-hero-noise" />
          <div className="trend-hero-grid" />
        </div>

        <div className="container">
          <div className="trend-hero-content">
            {/* 상단 레이블 */}
            <div className="trend-hero-label">
              <span className="label-dot" />
              <span className="label-text">Daily IT News Digest</span>
            </div>

            {/* 대형 타이틀 */}
            <h1 className="trend-hero-title">
              <span className="trend-hero-line">
                <span className="line-text">TREND</span>
              </span>
              <span className="trend-hero-line">
                <span className="line-text accent">DESK</span>
              </span>
            </h1>

            {/* 서브 정보 */}
            <div className="trend-hero-sub">
              <div className="trend-hero-date">
                <span className="date-label">Updated</span>
                <span className="date-value">{displayDate || lastUpdated}</span>
              </div>
              <div className="trend-hero-count">
                <span className="count-number">{trends.length}</span>
                <span className="count-label">Articles</span>
              </div>
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line">
            <div className="scroll-dot" />
          </div>
        </div>

        {/* 장식 요소 */}
        <div className="trend-hero-deco">
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-line-v deco-line-v-1" />
          <div className="deco-line-v deco-line-v-2" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="trend-intro">
        <div className="container">
          {/* 상단 텍스트 영역 */}
          <div className="intro-header">
            <div className="intro-label">
              <span className="label-line" />
              <span>About This Page</span>
            </div>
            <h2 className="intro-title">
              매일 자동으로 수집되는<br />
              <span className="accent">IT 트렌드 뉴스</span>
            </h2>
            <p className="intro-desc">
              ZDNet Korea와 ITWorld Korea에서 엄선한 IT 업계 최신 소식을
              매일 오전 9시에 자동으로 업데이트합니다.
            </p>
          </div>

          {/* 통계 카드 영역 */}
          <div className="intro-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">09:00</span>
                <span className="stat-label">Daily Update</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">{trends.length}</span>
                <span className="stat-label">Articles Today</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">2</span>
                <span className="stat-label">News Sources</span>
              </div>
            </div>

            <div className="stat-card highlight">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-value">AUTO</span>
                <span className="stat-label">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trend List Section */}
      <section className="trend-list-section">
        <div className="container">
          {/* 섹션 헤더 */}
          <div className="section-header">
            <h2 className="section-title">Today's Headlines</h2>
            <span className="section-count">{String(trends.length).padStart(2, '0')} Articles</span>
          </div>

          {trends.length > 0 ? (
            <div className="trend-list">
              {trends.map((trend) => (
                <motion.article
                  key={trend.id}
                  className={`trend-item ${expandedTrend === trend.id ? 'is-expanded' : ''}`}
                  layout
                >
                  <button
                    className="trend-header"
                    onClick={() => toggleTrend(trend.id)}
                    aria-expanded={expandedTrend === trend.id}
                  >
                    <div className="trend-header-top">
                      <span className="trend-number">{trend.number}</span>
                      <div className="trend-tags">
                        <span className="trend-source">{trend.source}</span>
                        <span className="trend-date">{trend.date}</span>
                      </div>
                    </div>
                    <div className="trend-header-main">
                      <h3 className="trend-title">{trend.title}</h3>
                      <div className="trend-toggle">
                        <span className="toggle-icon">
                          {expandedTrend === trend.id ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedTrend === trend.id && (
                      <motion.div
                        className="trend-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      >
                        <div className="trend-content-inner">
                          <p className="trend-summary">{trend.summary}</p>
                          <a
                            href={trend.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trend-link"
                          >
                            <span className="link-text">원문 보기</span>
                            <span className="link-arrow">→</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="trend-empty">
              <div className="empty-icon">
                <span>📰</span>
              </div>
              <p className="empty-title">아직 수집된 기사가 없습니다</p>
              <p className="empty-desc">매일 오전 9시에 자동으로 업데이트됩니다</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="trend-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <span className="cta-label">Stay Updated</span>
              <h2 className="cta-title">최신 IT 트렌드를<br />놓치지 마세요</h2>
            </div>
            <div className="cta-action">
              <a href="/" className="cta-btn">
                <span>홈으로 돌아가기</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default TrendPage
