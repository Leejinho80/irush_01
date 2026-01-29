import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import './AboutPage.css'

gsap.registerPlugin(ScrollTrigger)

// 스크롤에 따라 reveal되는 텍스트 컴포넌트
const RevealWord = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [20, 0])

  return (
    <span className="reveal-word-wrapper">
      <motion.span
        className="reveal-word"
        style={{ opacity, y }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// 스크롤 기반 텍스트 reveal 섹션
const ScrollRevealText = ({ text, className = '' }) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.2']
  })

  const words = text.split(' ')

  return (
    <p ref={containerRef} className={`scroll-reveal-text ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <RevealWord key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </RevealWord>
        )
      })}
    </p>
  )
}

const AboutPage = () => {
  const containerRef = useRef(null)
  const heroRef = useRef(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(heroProgress, [0, 0.5], [0, 100])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero 대형 타이포 애니메이션
      gsap.from('.hero-mega-text .char', {
        y: 200,
        opacity: 0,
        rotateX: -90,
        stagger: 0.03,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3
      })

      gsap.from('.hero-sub-line', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1
      })

      // 숫자 카운터 애니메이션
      gsap.utils.toArray('.big-number').forEach((num) => {
        const target = parseInt(num.dataset.target)
        gsap.fromTo(num,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: num,
              start: 'top 85%'
            }
          }
        )
      })

      // 대형 텍스트 패럴랙스
      gsap.utils.toArray('.parallax-text').forEach((text) => {
        gsap.to(text, {
          x: () => -200,
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })

      // 역방향 패럴랙스
      gsap.utils.toArray('.parallax-text-reverse').forEach((text) => {
        gsap.to(text, {
          x: () => 200,
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      })

      // 섹션 fade in
      gsap.utils.toArray('.section-fade').forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%'
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // 글자 분리 함수
  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  const services = [
    { num: '01', title: 'Research & Strategy', desc: '데이터 기반 인사이트 도출' },
    { num: '02', title: 'UX/UI Design', desc: '사용자 중심 경험 설계' },
    { num: '03', title: 'Development', desc: '최신 기술 기반 개발' },
    { num: '04', title: 'Brand Identity', desc: '브랜드 아이덴티티 구축' }
  ]

  return (
    <div ref={containerRef} className="about-page-new">
      {/* Hero Section - 대형 타이포그래피 */}
      <motion.section
        ref={heroRef}
        className="hero-mega"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="hero-mega-content">
          <div className="hero-mega-text">
            {splitText('iRUSH')}
          </div>
          <div className="hero-sub-line">
            <span className="hero-year">Since 2002</span>
            <span className="hero-divider" />
            <span className="hero-tagline">Digital Creative Agency</span>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </motion.section>

      {/* Philosophy Section - 스크롤 reveal 텍스트 */}
      <section className="philosophy-section">
        <div className="philosophy-container">
          <span className="section-number">01</span>
          <ScrollRevealText
            text="우리는 디지털 경험의 본질을 탐구합니다. 24년간 축적된 경험과 열정으로 고객의 비즈니스를 새로운 차원으로 이끕니다."
            className="philosophy-text"
          />
        </div>
      </section>

      {/* Big Statement Section */}
      <section className="statement-section">
        <div className="statement-wrapper">
          <h2 className="statement-text parallax-text">
            FEVER TO CREATE •
          </h2>
          <h2 className="statement-text parallax-text-reverse">
            BLISS TO DELIVER •
          </h2>
          <h2 className="statement-text parallax-text">
            FAITH TO SUCCEED •
          </h2>
        </div>
      </section>

      {/* Stats Section - 대형 숫자 */}
      <section className="stats-mega section-fade">
        <div className="container">
          <div className="stats-mega-grid">
            <div className="stat-mega-item">
              <div className="stat-mega-number">
                <span className="big-number" data-target="24">0</span>
                <span className="stat-suffix">+</span>
              </div>
              <div className="stat-mega-label">Years of Excellence</div>
              <p className="stat-mega-desc">2002년부터 시작된 디지털 크리에이티브 여정</p>
            </div>
            <div className="stat-mega-item">
              <div className="stat-mega-number">
                <span className="big-number" data-target="500">0</span>
                <span className="stat-suffix">+</span>
              </div>
              <div className="stat-mega-label">Projects Delivered</div>
              <p className="stat-mega-desc">대기업부터 스타트업까지 다양한 프로젝트</p>
            </div>
            <div className="stat-mega-item">
              <div className="stat-mega-number">
                <span className="big-number" data-target="100">0</span>
                <span className="stat-suffix">%</span>
              </div>
              <div className="stat-mega-label">Client Satisfaction</div>
              <p className="stat-mega-desc">고객 만족을 최우선 가치로</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section - 풀스크린 텍스트 */}
      <section className="vision-mega">
        <div className="vision-mega-content">
          <span className="section-number">02</span>
          <h2 className="vision-mega-title">
            We Create<br />
            <span className="accent">Digital</span><br />
            Experiences
          </h2>
          <p className="vision-mega-desc">
            디지털 환경에서 브랜드가 사용자와 소통하는 모든 접점에서<br />
            최적의 경험을 설계하고 구현합니다.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-mega section-fade">
        <div className="container">
          <div className="services-header">
            <span className="section-number">03</span>
            <h2 className="services-title">What We Do</h2>
          </div>
          <div className="services-mega-list">
            {services.map((service, index) => (
              <div key={index} className="service-mega-item cursor-hover">
                <span className="service-num">{service.num}</span>
                <div className="service-content">
                  <h3 className="service-name">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>
                <div className="service-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Marquee */}
      <section className="clients-mega">
        <div className="clients-track-wrapper">
          <div className="clients-track">
            {['LG전자', 'LG헬로비전', '삼성SDS', '신한은행', 'SK텔레콤', '현대자동차', 'KB국민은행', '카카오', '네이버', 'CJ ENM', 'LG전자', 'LG헬로비전', '삼성SDS', '신한은행'].map((client, i) => (
              <span key={i} className="client-name">{client}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-mega section-fade">
        <div className="container">
          <div className="team-mega-content">
            <span className="section-number">04</span>
            <h2 className="team-mega-title">
              A Team of<br />
              <span className="accent">Creative</span><br />
              Minds
            </h2>
            <p className="team-mega-desc">
              전략, 디자인, 개발 분야의 전문가들이 모여<br />
              최고의 결과물을 만들어냅니다.
            </p>
            <div className="team-roles">
              {['Creative Director', 'UX Designer', 'UI Designer', 'Front-end Developer', 'Back-end Developer', 'Project Manager'].map((role, i) => (
                <span key={i} className="team-role">{role}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-mega">
        <div className="cta-mega-content">
          <h2 className="cta-mega-title">
            Let's Create<br />
            Something<br />
            <span className="accent">Amazing</span>
          </h2>
          <a href="mailto:info@irush.co.kr" className="cta-mega-btn">
            <span>Get In Touch</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
