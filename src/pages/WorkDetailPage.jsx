import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import './WorkDetailPage.css'

gsap.registerPlugin(ScrollTrigger)

// Featured Projects 데이터 (WorkPage와 동기화)
const featuredProjects = {
  1: {
    title: 'LG HelloVision',
    subtitle: 'Digital Platform Renewal',
    category: 'Web Development',
    client: 'LG헬로비전',
    year: '2024',
    duration: '6개월',
    role: 'UX/UI Design, Front-end Development',
    color: '#A50034',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
    overview: '국내 최대 케이블TV 사업자인 LG헬로비전의 웹사이트 전면 리뉴얼 프로젝트입니다. 사용자 중심의 정보 구조 재설계와 현대적인 UI/UX 디자인을 통해 브랜드 가치를 높이고 고객 경험을 개선했습니다.',
    challenge: '기존 웹사이트의 복잡한 정보 구조와 오래된 디자인으로 인해 사용자들의 이탈률이 높았습니다. 다양한 서비스(케이블TV, 인터넷, 모바일)를 효과적으로 전달하면서도 직관적인 사용자 경험을 제공해야 했습니다.',
    solution: '사용자 리서치를 기반으로 정보 구조를 전면 개편하고, 서비스별 특성을 살린 섹션 디자인을 적용했습니다. 모바일 퍼스트 접근법으로 반응형 디자인을 구현하고, 성능 최적화를 통해 페이지 로딩 속도를 50% 개선했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '이탈률 감소', value: '-35%' },
      { label: '페이지 로딩', value: '-50%' },
      { label: '전환율 증가', value: '+25%' },
      { label: '사용자 만족도', value: '4.5/5' }
    ],
    nextProject: { id: 2, title: 'Samsung SDS' }
  },
  2: {
    title: 'Samsung SDS',
    subtitle: 'Brand Experience Design',
    category: 'Brand Identity',
    client: '삼성SDS',
    year: '2024',
    duration: '4개월',
    role: 'Brand Strategy, Visual Design',
    color: '#1428A0',
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop',
    overview: '삼성SDS의 기업 브랜드 아이덴티티 리뉴얼 프로젝트입니다. IT 서비스 기업으로서의 전문성과 혁신성을 표현하는 새로운 비주얼 아이덴티티 시스템을 개발했습니다.',
    challenge: '글로벌 IT 기업으로서의 위상에 맞는 현대적인 브랜드 이미지가 필요했습니다. 기존 브랜드의 핵심 가치는 유지하면서 디지털 시대에 맞는 새로운 표현 방식을 찾아야 했습니다.',
    solution: '브랜드 핵심 가치를 재정의하고, 이를 기반으로 새로운 비주얼 시스템을 개발했습니다. 디지털 환경에 최적화된 로고 시스템과 일관된 디자인 언어를 구축하여 모든 접점에서 통일된 브랜드 경험을 제공합니다.',
    gallery: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '브랜드 인지도', value: '+40%' },
      { label: '긍정적 인식', value: '+55%' },
      { label: '임직원 만족도', value: '4.7/5' },
      { label: '미디어 노출', value: '+200%' }
    ],
    nextProject: { id: 3, title: 'Shinhan Bank' }
  },
  3: {
    title: 'Shinhan Bank',
    subtitle: 'Mobile Banking UX',
    category: 'Mobile App',
    client: '신한은행',
    year: '2023',
    duration: '8개월',
    role: 'UX Research, UI Design, Prototyping',
    color: '#0046FF',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=1080&fit=crop',
    overview: '신한은행 모바일 뱅킹 앱의 UX 전면 개선 프로젝트입니다. 복잡한 금융 서비스를 직관적으로 이용할 수 있도록 사용자 경험을 재설계했습니다.',
    challenge: '다양한 연령대의 사용자가 이용하는 금융 앱으로서, 복잡한 기능을 쉽게 사용할 수 있도록 해야 했습니다. 특히 시니어 사용자를 위한 접근성 개선이 중요한 과제였습니다.',
    solution: '사용자 세그먼트별 맞춤형 UI를 제공하고, 핵심 기능의 접근성을 높였습니다. 음성 안내, 큰 글씨 모드 등 다양한 접근성 기능을 추가하고, 일관된 인터랙션 패턴으로 학습 비용을 낮췄습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: 'MAU 증가', value: '+30%' },
      { label: '앱 평점', value: '4.8/5' },
      { label: '거래 완료율', value: '+45%' },
      { label: '고객 문의', value: '-40%' }
    ],
    nextProject: { id: 4, title: 'Leeum Museum' }
  },
  4: {
    title: 'Leeum Museum',
    subtitle: 'Online Reservation System',
    category: 'Web Platform',
    client: '삼성문화재단',
    year: '2023',
    duration: '5개월',
    role: 'UX/UI Design, System Design',
    color: '#2D2D2D',
    heroImage: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1920&h=1080&fit=crop',
    overview: '리움미술관의 온라인 예약 시스템을 새롭게 구축한 프로젝트입니다. 문화 예술 공간의 품격에 맞는 세련된 디자인과 직관적인 예약 프로세스를 제공합니다.',
    challenge: '미술관 방문 예약의 복잡한 절차를 단순화하면서도, 리움미술관의 프리미엄 브랜드 이미지를 유지해야 했습니다. 전시별 다양한 예약 조건과 정책을 유연하게 대응할 수 있는 시스템이 필요했습니다.',
    solution: '예약 프로세스를 3단계로 단순화하고, 실시간 잔여석 확인 기능을 구현했습니다. 미술관의 아이덴티티를 반영한 미니멀한 디자인으로 예술 작품의 감상을 방해하지 않는 UI를 설계했습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '예약 완료율', value: '+60%' },
      { label: '예약 소요시간', value: '-70%' },
      { label: '고객 만족도', value: '4.9/5' },
      { label: '문의 감소', value: '-50%' }
    ],
    nextProject: { id: 1, title: 'LG HelloVision' }
  }
}

const WorkDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const project = featuredProjects[id]

  // 프로젝트가 없으면 Work 페이지로 리다이렉트
  useEffect(() => {
    if (!project) {
      navigate('/work')
    }
  }, [project, navigate])

  useEffect(() => {
    if (!project) return

    window.scrollTo(0, 0)

    const ctx = gsap.context(() => {
      // Hero 애니메이션
      gsap.from('.detail-hero-content', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3
      })

      gsap.from('.detail-hero-meta .meta-item', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.8
      })

      // Section animations
      gsap.utils.toArray('.fade-up').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      })

      // Parallax hero image
      gsap.to('.detail-hero-bg', {
        scrollTrigger: {
          trigger: '.detail-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 150,
        ease: 'none'
      })

      // Gallery images
      gsap.utils.toArray('.gallery-item').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out'
        })
      })

      // Results counter
      gsap.utils.toArray('.result-card').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%'
          },
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [id, project])

  if (!project) {
    return null
  }

  return (
    <div ref={containerRef} className="work-detail-page-v2">
      {/* Hero Section */}
      <section className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url(${project.heroImage})` }}>
          <div className="hero-overlay" />
        </div>

        <div className="detail-hero-content">
          <motion.div
            className="hero-category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="category-label">{project.category}</span>
            <span className="category-year">{project.year}</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {project.subtitle}
          </motion.p>
        </div>

        <div className="detail-hero-meta">
          <div className="meta-item">
            <span className="meta-label">Client</span>
            <span className="meta-value">{project.client}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{project.duration}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Role</span>
            <span className="meta-value">{project.role}</span>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Overview Section */}
      <section className="detail-section overview-section">
        <div className="container">
          <div className="section-grid">
            <div className="section-label-wrapper fade-up">
              <span className="section-number">01</span>
              <span className="section-label">Overview</span>
            </div>
            <div className="section-content fade-up">
              <p className="overview-text">{project.overview}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="detail-section challenge-section">
        <div className="container">
          <div className="section-grid reverse">
            <div className="section-label-wrapper fade-up">
              <span className="section-number">02</span>
              <span className="section-label">Challenge</span>
            </div>
            <div className="section-content fade-up">
              <p className="challenge-text">{project.challenge}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="detail-section gallery-section">
        <div className="container-wide">
          <div className="gallery-grid">
            {project.gallery.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`${project.title} - Image ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="detail-section solution-section">
        <div className="container">
          <div className="section-grid">
            <div className="section-label-wrapper fade-up">
              <span className="section-number">03</span>
              <span className="section-label">Solution</span>
            </div>
            <div className="section-content fade-up">
              <p className="solution-text">{project.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="detail-section results-section">
        <div className="container">
          <div className="results-header fade-up">
            <span className="section-number">04</span>
            <h2 className="results-title">Results</h2>
          </div>

          <div className="results-grid">
            {project.results.map((result, index) => (
              <div key={index} className="result-card" style={{ '--accent': project.color }}>
                <span className="result-value">{result.value}</span>
                <span className="result-label">{result.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Project Section */}
      {project.nextProject && (
        <section className="next-project-section">
          <Link to={`/work/${project.nextProject.id}`} className="next-project-link">
            <div className="next-project-bg">
              <img
                src={featuredProjects[project.nextProject.id]?.heroImage}
                alt={project.nextProject.title}
              />
              <div className="next-overlay" />
            </div>
            <div className="next-project-content">
              <span className="next-label">Next Project</span>
              <h2 className="next-title">{project.nextProject.title}</h2>
              <span className="next-arrow">→</span>
            </div>
          </Link>
        </section>
      )}

      {/* Back to Work */}
      <section className="back-section">
        <div className="container">
          <Link to="/work" className="back-link">
            <span className="back-arrow">←</span>
            <span>Back to All Projects</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default WorkDetailPage
