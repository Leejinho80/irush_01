import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import './MainPage.css'

gsap.registerPlugin(ScrollTrigger)

// 핵심 가치 데이터
const coreValues = [
  {
    id: 'fever',
    title: 'FEVER',
    subtitle: 'to Create',
    description: '창작에 대한 뜨거운 열정. 우리는 매 프로젝트에 혼신의 열정을 쏟아붓습니다.',
    color: '#FF6B6B'
  },
  {
    id: 'bliss',
    title: 'BLISS',
    subtitle: 'to Deliver',
    description: '전달하는 기쁨. 완벽한 결과물을 전달할 때 느끼는 충만한 행복입니다.',
    color: '#4ECDC4'
  },
  {
    id: 'faith',
    title: 'FAITH',
    subtitle: 'to Succeed',
    description: '성공에 대한 믿음. 고객과 함께 성공할 수 있다는 굳건한 신념입니다.',
    color: '#FFE66D'
  }
]

const MainPage = () => {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeValue, setActiveValue] = useState(0)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 0.8], [1, 1.1])
  const textY = useTransform(heroProgress, [0, 0.5], [0, 100])

  // 핵심 가치 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading) return

    const ctx = gsap.context(() => {
      // 히어로 텍스트 애니메이션
      gsap.from('.hero-main-text .word', {
        y: 120,
        opacity: 0,
        rotateX: -40,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.5
      })

      gsap.from('.hero-value-display', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
      })

      // 섹션 애니메이션
      gsap.utils.toArray('.fade-section').forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 80,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%'
          }
        })
      })

      // 핵심 가치 카드 애니메이션
      gsap.utils.toArray('.value-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 100,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [isLoading])

  return (
    <div ref={containerRef} className="main-page-v2">
      {/* 인트로 오버레이 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="intro-overlay-v2"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="intro-content-v2">
              <motion.div
                className="intro-values"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {coreValues.map((value, i) => (
                  <motion.span
                    key={value.id}
                    className="intro-value-word"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.3, duration: 0.6 }}
                    style={{ color: value.color }}
                  >
                    {value.title}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                className="intro-loader-v2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 히어로 섹션 - 비디오 배경 */}
      <motion.section
        ref={heroRef}
        className="hero-video-section"
        style={{ scale: heroScale }}
      >
        {/* 비디오 배경 */}
        <div className="hero-video-bg">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-video-overlay" />
        </div>

        {/* 히어로 콘텐츠 */}
        <motion.div
          className="hero-content-v2"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <div className="hero-main-text">
            <span className="word">DIGITAL</span>
            <span className="word">CREATIVE</span>
            <span className="word accent">AGENCY</span>
          </div>

          {/* 핵심 가치 디스플레이 */}
          <div className="hero-value-display">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeValue}
                className="value-showcase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="value-title"
                  style={{ color: coreValues[activeValue].color }}
                >
                  {coreValues[activeValue].title}
                </span>
                <span className="value-subtitle">
                  {coreValues[activeValue].subtitle}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* 가치 인디케이터 */}
            <div className="value-indicators">
              {coreValues.map((value, i) => (
                <button
                  key={value.id}
                  className={`value-indicator ${i === activeValue ? 'active' : ''}`}
                  onClick={() => setActiveValue(i)}
                  style={{
                    '--indicator-color': value.color
                  }}
                />
              ))}
            </div>
          </div>

          <div className="hero-scroll-hint">
            <span>Scroll to explore</span>
            <div className="scroll-line" />
          </div>
        </motion.div>
      </motion.section>

      {/* 핵심 가치 섹션 */}
      <section className="values-section">
        <div className="container">
          <div className="values-header fade-section">
            <span className="section-label">Our Core Values</span>
            <h2 className="values-title">
              What Drives Us<br />
              <span className="accent">Every Single Day</span>
            </h2>
          </div>

          <div className="values-grid">
            {coreValues.map((value, index) => (
              <div
                key={value.id}
                className="value-card"
                style={{ '--card-accent': value.color }}
              >
                <div className="value-card-number">0{index + 1}</div>
                <h3 className="value-card-title" style={{ color: value.color }}>
                  {value.title}
                </h3>
                <p className="value-card-subtitle">{value.subtitle}</p>
                <p className="value-card-desc">{value.description}</p>
                <div className="value-card-line" style={{ backgroundColor: value.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="intro-section fade-section">
        <div className="container">
          <div className="intro-content-wrapper">
            <div className="intro-text">
              <span className="section-label">Since 2002</span>
              <h2 className="intro-title">
                24년간의 열정,<br />
                <span className="accent">500+</span> 프로젝트의 신뢰
              </h2>
              <p className="intro-desc">
                iRUSH는 대한민국을 대표하는 디지털 크리에이티브 에이전시입니다.
                LG전자, 삼성SDS, 신한은행 등 국내 주요 기업들과 함께
                디지털 혁신을 이끌어왔습니다.
              </p>
              <Link to="/about" className="btn-link">
                <span>회사 소개</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
            <div className="intro-stats">
              <div className="stat-box">
                <span className="stat-value">24<sup>+</sup></span>
                <span className="stat-label">Years</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">500<sup>+</sup></span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">100<sup>%</sup></span>
                <span className="stat-label">Passion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 섹션 */}
      <section className="services-section-v2 fade-section">
        <div className="container">
          <div className="services-header">
            <span className="section-label">What We Do</span>
            <h2 className="services-title">Our Expertise</h2>
          </div>

          <div className="services-grid-v2">
            {[
              { num: '01', title: 'Strategy', desc: '브랜드 전략 및 디지털 전환 컨설팅', icon: '◇' },
              { num: '02', title: 'Design', desc: 'UX/UI 디자인 및 브랜드 아이덴티티', icon: '○' },
              { num: '03', title: 'Development', desc: '웹/앱 개발 및 시스템 구축', icon: '□' },
              { num: '04', title: 'Marketing', desc: '디지털 마케팅 및 콘텐츠 제작', icon: '△' }
            ].map((service) => (
              <div key={service.num} className="service-card-v2 cursor-hover">
                <div className="service-icon">{service.icon}</div>
                <span className="service-num">{service.num}</span>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 프로젝트 프리뷰 */}
      <section className="projects-preview fade-section">
        <div className="container">
          <div className="projects-header">
            <span className="section-label">Featured Work</span>
            <h2 className="projects-title">Recent Projects</h2>
          </div>

          <div className="projects-showcase">
            {[
              { id: 1, title: 'LG HelloVision', category: 'Web Platform', color: '#A50034', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop' },
              { id: 2, title: 'Samsung SDS', category: 'Brand Experience', color: '#1428A0', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop' },
              { id: 3, title: 'Shinhan Bank', category: 'Digital Banking', color: '#0046FF', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop' }
            ].map((project) => (
              <Link
                key={project.id}
                to={`/work/${project.id}`}
                className="project-card cursor-hover"
              >
                <div className="project-bg">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay" style={{ '--overlay-color': project.color }} />
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                </div>
                <span className="project-arrow">→</span>
              </Link>
            ))}
          </div>

          <div className="projects-cta">
            <Link to="/work" className="btn-link large">
              <span>View All Projects</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section-v2">
        <div className="cta-bg-text">
          <span>FEVER</span>
          <span>BLISS</span>
          <span>FAITH</span>
        </div>
        <div className="cta-content-v2">
          <h2 className="cta-title-v2">
            Ready to Create<br />
            <span className="accent">Something Amazing?</span>
          </h2>
          <p className="cta-desc-v2">
            열정과 기쁨, 그리고 신념으로 함께하겠습니다.
          </p>
          <a href="mailto:info@irush.co.kr" className="cta-btn-v2">
            <span>Start a Project</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MainPage
