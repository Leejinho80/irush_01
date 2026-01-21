import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import './WorkPage.css'

gsap.registerPlugin(ScrollTrigger)

// 스와이프 임계값
const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY_THRESHOLD = 500

// 최근 프로젝트 (Featured) - 상세 페이지 있음
const featuredProjects = [
  {
    id: 1,
    title: 'LG HelloVision',
    subtitle: 'Digital Platform Renewal',
    category: 'Web Development',
    client: 'LG헬로비전',
    year: '2024',
    description: '국내 최대 케이블TV 사업자의 디지털 플랫폼 전면 리뉴얼. 사용자 중심의 정보 구조 재설계와 현대적인 UI/UX 디자인으로 브랜드 가치 상승.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
    color: '#A50034'
  },
  {
    id: 2,
    title: 'Samsung SDS',
    subtitle: 'Brand Experience Design',
    category: 'Brand Identity',
    client: '삼성SDS',
    year: '2024',
    description: 'IT 서비스 기업으로서의 전문성과 혁신성을 표현하는 새로운 비주얼 아이덴티티 시스템 개발.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop',
    color: '#1428A0'
  },
  {
    id: 3,
    title: 'Shinhan Bank',
    subtitle: 'Mobile Banking UX',
    category: 'Mobile App',
    client: '신한은행',
    year: '2023',
    description: '복잡한 금융 서비스를 직관적으로 이용할 수 있도록 모바일 뱅킹 앱의 사용자 경험 전면 개선.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=1080&fit=crop',
    color: '#0046FF'
  },
  {
    id: 4,
    title: 'Leeum Museum',
    subtitle: 'Online Reservation System',
    category: 'Web Platform',
    client: '삼성문화재단',
    year: '2023',
    description: '리움미술관 온라인 예약 시스템 구축. 문화 예술 공간에 어울리는 세련된 디자인과 직관적인 예약 프로세스.',
    image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1920&h=1080&fit=crop',
    color: '#2D2D2D'
  }
]

// 지난 프로젝트 아카이브 (상세 페이지 없음)
const archiveProjects = [
  { title: 'LG헬로비전 MYLGID 회원 통합', client: 'LG헬로비전', year: '2021' },
  { title: '삼성 리움미술관 온라인 예약시스템 구축', client: '삼성문화재단 / 삼성SDS', year: '2021' },
  { title: '신한 SOL 캄보디아 UI/UX 컨설팅', client: '신한은행 캄보디아', year: '2021' },
  { title: 'LG헬로비전 온라인 신청 시스템 개선', client: 'LG헬로비전', year: '2021' },
  { title: '국립암센터 국가 암검진 정보시스템 개선', client: '국립암센터', year: '2021' },
  { title: 'LG헬로비전 멀티호스팅 웹통합', client: 'LG헬로비전', year: '2020' },
  { title: '삼성전자 BESPOKE 서비스 개선', client: '삼성전자 / 삼성SDS', year: '2020' },
  { title: 'CJ헬로 사명변경에 따른 CI/BI 교체', client: 'CJ헬로', year: '2020' },
  { title: '삼성닷컴 B-PJT', client: '삼성전자 / 삼성SDS', year: '2019' },
  { title: 'CJ헬로 렌탈 서비스 고도화', client: 'CJ헬로', year: '2019' },
  { title: '삼성닷컴 EMC Buying_Conf 과제 개발', client: '삼성전자 / 삼성SDS', year: '2019' },
  { title: 'CJ헬로 렌탈 임직원 복지몬 구축', client: 'CJ헬로 / CJ올리브네트웍스', year: '2018' },
  { title: '삼성닷컴 글로벌 Shop 통합', client: '삼성전자 / 삼성SDS', year: '2018' },
  { title: '하나제약 홈페이지 개편', client: '하나제약', year: '2018' },
  { title: '삼성닷컴 한국 사이트 운영', client: '삼성전자 / 삼성네트웍스', year: '2008-2017' },
  { title: '신한은행 글로벌 포털 웹사이트 개편', client: '신한은행', year: '2017' },
  { title: '삼성전자 LED/반도체 웹사이트 개편', client: '삼성전자 / 삼성SDS', year: '2017' },
  { title: '삼성전자 갤럭시 재팬 사이트 구축', client: '삼성전자 / 삼성SDS', year: '2017' },
  { title: '국립암센터 호스피스완화의료 질평가시스템', client: '국립암센터', year: '2016' },
  { title: '삼성닷컴 P5 한총 차세대', client: '삼성전자 / 삼성SDS', year: '2016' },
  { title: '신한은행 글로벌 포털&인터넷 뱅킹', client: '신한은행', year: '2015' },
  { title: '신한금융지주 사회책임경영 개편', client: '신한금융지주', year: '2015' },
  { title: '삼성닷컴 한국사이트 개편', client: '삼성전자 / 삼성SDS', year: '2015' },
  { title: '삼성C&S포털 글로벌 콘텐츠관리시스템 구축', client: '삼성전자 / 삼성SDS', year: '2014' },
  { title: '신한금융지주 홈페이지 개편', client: '신한금융지주회사', year: '2013' },
  { title: '삼성전자 C&S 포털 사이트 구축', client: '삼성전자 / 삼성SDS', year: '2013' },
  { title: '두산 브랜드샵 구축', client: '두산', year: '2013' },
  { title: '삼성닷컴 이벤트 관리 시스템 구축', client: '삼성그룹 / 삼성SDS', year: '2012' },
  { title: '신한금융지주 홈페이지 리뉴얼', client: '신한금융지주', year: '2011' },
  { title: '한국 삼성닷컴 통합', client: '삼성전자 / 삼성SDS', year: '2011' },
]

const ITEMS_PER_PAGE = 10

const WorkPage = () => {
  const containerRef = useRef(null)
  const showcaseRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // 슬라이드 변경
  const goToSlide = useCallback((newIndex, newDirection) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(newDirection)
    setCurrentIndex(newIndex)
    setTimeout(() => setIsAnimating(false), 800)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    const newIndex = (currentIndex + 1) % featuredProjects.length
    goToSlide(newIndex, 1)
  }, [currentIndex, goToSlide])

  const prevSlide = useCallback(() => {
    const newIndex = (currentIndex - 1 + featuredProjects.length) % featuredProjects.length
    goToSlide(newIndex, -1)
  }, [currentIndex, goToSlide])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // 자동 슬라이드 (8초 간격)
  useEffect(() => {
    const interval = setInterval(nextSlide, 8000)
    return () => clearInterval(interval)
  }, [nextSlide])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 히어로 텍스트 애니메이션
      gsap.from('.showcase-header .line', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.3
      })

      // 아카이브 섹션 애니메이션
      gsap.from('.archive-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.archive-section',
          start: 'top 80%'
        }
      })

      gsap.utils.toArray('.archive-item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%'
          },
          delay: i * 0.03
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [visibleCount])

  const currentProject = featuredProjects[currentIndex]

  // 슬라이드 애니메이션 variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  }

  const contentVariants = {
    enter: (direction) => ({
      y: 60,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    exit: {
      y: -30,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div ref={containerRef} className="work-page-v2">
      {/* Featured Projects Showcase */}
      <section ref={showcaseRef} className="project-showcase">
        {/* 스와이프 영역 */}
        <motion.div
          className="showcase-swipe-area"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const { offset, velocity } = info
            // 스와이프 거리 또는 속도가 임계값을 넘으면 슬라이드 전환
            if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY_THRESHOLD) {
              nextSlide()
            } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
              prevSlide()
            }
          }}
        >
          {/* 배경 이미지 슬라이드 */}
          <div className="showcase-bg">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                className="showcase-bg-image"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 }
                }}
                style={{
                  backgroundImage: `url(${currentProject.image})`
                }}
              />
            </AnimatePresence>
            <div className="showcase-overlay" />
          </div>
        </motion.div>

        {/* 헤더 */}
        <div className="showcase-header">
          <span className="line section-label">Featured Work</span>
          <h1 className="line showcase-title">Our Projects</h1>
        </div>

        {/* 프로젝트 콘텐츠 */}
        <div className="showcase-content">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              className="project-content"
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="project-meta">
                <span className="project-category">{currentProject.category}</span>
                <span className="project-divider">/</span>
                <span className="project-client">{currentProject.client}</span>
                <span className="project-divider">/</span>
                <span className="project-year">{currentProject.year}</span>
              </div>

              <h2 className="project-title">{currentProject.title}</h2>
              <p className="project-subtitle">{currentProject.subtitle}</p>
              <p className="project-description">{currentProject.description}</p>

              <Link to={`/work/${currentProject.id}`} className="project-cta">
                <span>View Project</span>
                <span className="cta-arrow">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 네비게이션 */}
        <div className="showcase-nav">
          <div className="nav-counter">
            <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="separator">/</span>
            <span className="total">{String(featuredProjects.length).padStart(2, '0')}</span>
          </div>

          <div className="nav-controls">
            <button
              className="nav-btn prev"
              onClick={prevSlide}
              disabled={isAnimating}
              aria-label="Previous project"
            >
              <span className="btn-line" />
              <span className="btn-text">PREV</span>
            </button>
            <button
              className="nav-btn next"
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Next project"
            >
              <span className="btn-text">NEXT</span>
              <span className="btn-line" />
            </button>
          </div>

          {/* 프로그레스 인디케이터 */}
          <div className="nav-progress">
            {featuredProjects.map((_, i) => (
              <button
                key={i}
                className={`progress-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(i, i > currentIndex ? 1 : -1)}
                aria-label={`Go to project ${i + 1}`}
              >
                <span className="dot-inner" />
                {i === currentIndex && (
                  <motion.span
                    className="dot-progress"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 8, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 스크롤 힌트 */}
        <div className="showcase-scroll-hint">
          <span>Scroll for Archive</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Archive Section */}
      <section className="archive-section">
        <div className="container">
          <div className="archive-header">
            <div className="archive-header-left">
              <span className="section-label">Project Archive</span>
              <h2 className="archive-title">Past Projects</h2>
            </div>
            <p className="archive-desc">
              2002년부터 현재까지<br />
              500+ 프로젝트의 여정
            </p>
          </div>

          <div className="archive-table">
            <div className="archive-table-header">
              <span className="col-year">Year</span>
              <span className="col-project">Project</span>
              <span className="col-client">Client</span>
            </div>

            <div className="archive-list">
              {archiveProjects.slice(0, visibleCount).map((project, index) => (
                <div
                  key={index}
                  className="archive-item"
                >
                  <span className="col-year">{project.year}</span>
                  <span className="col-project">{project.title}</span>
                  <span className="col-client">{project.client}</span>
                </div>
              ))}
            </div>
          </div>

          {visibleCount < archiveProjects.length && (
            <div className="archive-more">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, archiveProjects.length))}
              >
                <span>Load More</span>
                <span className="more-count">+{Math.min(ITEMS_PER_PAGE, archiveProjects.length - visibleCount)}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="work-cta-section">
        <div className="cta-bg-text">
          <span>WORK</span>
          <span>WITH US</span>
        </div>
        <div className="container">
          <div className="work-cta-content">
            <h2 className="work-cta-title">
              Ready to Start<br />
              <span className="accent">Your Project?</span>
            </h2>
            <p className="work-cta-desc">
              열정과 기쁨, 신념으로 함께하겠습니다.
            </p>
            <a href="mailto:contact@irush.co.kr" className="work-cta-btn">
              <span>Contact Us</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default WorkPage
