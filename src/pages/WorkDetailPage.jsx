import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer'
import './WorkDetailPage.css'

// 이미지 import
import portfolio01Bg from '../assets/images/01_portfolio_bg.jpg'
import portfolio01View from '../assets/images/01_portfolio_view.jpg'
import portfolio03Bg from '../assets/images/03_portfolio_bg.jpg'
import portfolio03View from '../assets/images/03_portfolio_view.jpg'

gsap.registerPlugin(ScrollTrigger)

// Featured Projects 데이터 (WorkPage와 동기화) - 6개 프로젝트
const featuredProjects = {
  1: {
    title: 'LG헬로비전 모바일 직영몰 고도화',
    subtitle: 'Mobile Platform Enhancement',
    category: 'UX/UI Design',
    client: 'LG헬로비전',
    year: '2025',
    duration: '6개월',
    role: 'UX/UI Design, Front-end Development',
    color: '#A50034',
    heroImage: portfolio01Bg,
    overview: 'LG헬로비전의 모바일 직영몰 고도화 프로젝트는 기존 모바일 서비스의 사용자 경험을 전면적으로 개선하고, 최신 트렌드에 맞는 UI/UX를 적용하여 고객 만족도를 높이는 것을 목표로 진행되었습니다. 특히 모바일 환경에서의 직관적인 네비게이션과 간편한 결제 프로세스를 구현하여, 고객이 원하는 상품을 빠르게 찾고 구매할 수 있도록 최적화하였습니다.',
    challenge: '기존 결제 프로세스의 복잡성으로 인한 이탈률 증가, 정보 과다로 인한 사용자 혼란 및 핵심 정보 접근성 저하, 다양한 요금제와 옵션으로 인한 의사결정 지연, 재방문 유도 요소 부재로 인한 고객 유지율 하락 등의 문제가 있었습니다.',
    solution: '고객 니즈에 따라 직관적인 Dual Main 구조로 요금제 탐색과 가입을 동시에 진행할 수 있도록 개선하였습니다. 빠른 상단 인터페이스로 핵심 정보에 즉시 접근 가능하게 하고, 고객이 원하는 상품의 최적 옵션을 심플하게 구성하였습니다. 또한 고객 스스로 가입 여정을 완수할 수 있도록 가이드를 제공하였습니다.',
    gallery: [
      portfolio01Bg,
      portfolio01View,
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '이탈률 감소', value: '-35%' },
      { label: '결제 전환율', value: '+40%' },
      { label: '가입 증가', value: '+25%' },
      { label: '사용자 만족도', value: '4.5/5' }
    ],
    nextProject: { id: 2, title: '삼성닷컴 글로벌 백엔드 시스템 개선' }
  },
  2: {
    title: '삼성닷컴 글로벌 백엔드 시스템 개선',
    subtitle: 'Global Backend Optimization',
    category: 'System Development',
    client: '삼성전자 / 삼성SDS',
    year: '개선/운영중',
    duration: '개선/운영중',
    role: 'Backend Architecture, Performance Optimization',
    color: '#1428A0',
    heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop',
    overview: '삼성닷컴 글로벌 백엔드 시스템 개선 프로젝트는 전 세계 64개국에서 운영되는 삼성닷컴의 백엔드 아키텍처를 현대화하고, 시스템 성능을 극대화하는 것을 목표로 진행되었습니다. MSA(Microservices Architecture) 기반의 유연한 시스템 구조로 전환하여, 글로벌 트래픽 증가에 대응하고 각 국가별 맞춤 서비스 제공이 가능하도록 개선하였습니다.',
    challenge: '오래된 모놀리식 아키텍처로 인한 유지보수 어려움, 급증하는 글로벌 사용자 트래픽에 대한 확장성 부족, 64개국 각기 다른 요구사항에 대한 유연한 대응 필요, 빈번한 업데이트에 따른 배포 프로세스 복잡성 등의 과제가 있었습니다.',
    solution: '마이크로서비스 아키텍처 도입으로 서비스 간 독립성 확보 및 확장성 개선, 통합 API 게이트웨이 구축으로 트래픽 관리 및 보안 강화, Kubernetes 기반 컨테이너 오케스트레이션으로 배포 자동화, 글로벌 CDN 전략 수립으로 각 지역별 응답 속도 개선을 달성하였습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '응답속도 개선', value: '-60%' },
      { label: '배포 시간', value: '-70%' },
      { label: '시스템 안정성', value: '99.9%' },
      { label: '유지보수 비용', value: '-40%' }
    ],
    nextProject: { id: 3, title: 'LG헬로비전 방송/인터넷 서비스 개선' }
  },
  3: {
    title: 'LG헬로비전 방송/인터넷 서비스 개선',
    subtitle: 'Digital Transformation',
    category: 'UX/UI Consulting',
    client: 'LG헬로비전',
    year: '2025',
    duration: '6개월',
    role: 'UX Consulting, UI Design, Customer Research',
    color: '#E91E63',
    heroImage: portfolio03Bg,
    overview: '온라인으로 더 편리하고 더 빨라지는 세상, 저렴한 인터넷·방송을 온라인으로 가입하는 비율은 고객의 16%에 달합니다. 최근 한국의 케이블TV 시장은 점점 침체되고 있는 상황에서, 고객에게 더 나은 경험을 제공하기 위한 Customer-Centric Solution을 제시하였습니다.',
    challenge: '케이블TV 시장의 지속적인 침체와 경쟁 심화, 온라인 스트리밍 서비스로의 고객 이탈 증가, 가입/변경/해지 프로세스의 복잡성으로 인한 불만, 기존 시스템의 노후화로 인한 유지보수 비용 증가 등의 문제가 있었습니다.',
    solution: '고객 중심의 서비스 설계로 사용자 니즈 충족, 혁신적인 비주얼 디자인으로 브랜드 이미지 제고, 신뢰할 수 있는 정보 제공으로 의사결정 지원, 빠른 접근성으로 60초 내 원하는 정보 도달을 목표로 개선하였습니다.',
    gallery: [
      portfolio03Bg,
      portfolio03View,
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '매출 증가', value: '+167%' },
      { label: '가입 증가', value: '+120%' },
      { label: '이탈률 감소', value: '-20%' },
      { label: '고객 만족도', value: '4.6/5' }
    ],
    nextProject: { id: 4, title: '삼성 SDS SCP SingleID CX 개선' }
  },
  4: {
    title: '삼성 SDS SCP SingleID CX 개선',
    subtitle: 'Enterprise Security UX',
    category: 'B2B Solution',
    client: '삼성SDS',
    year: '개선/운영중',
    duration: '개선/운영중',
    role: 'UX/UI Design, B2B Consulting',
    color: '#2196F3',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
    overview: 'Samsung Cloud Platform(SCP)의 SaaS 솔루션 중 통합인증/보안 서비스인 SingleID의 고객 경험(CX) 개선 프로젝트입니다. B2B 고객을 위한 직관적인 인증 관리 대시보드와 보안 정책 설정 인터페이스를 구축하여, 기업 고객의 업무 효율성을 극대화하였습니다.',
    challenge: '다양한 인증 방식(SSO, MFA, SAML)의 통합 관리 어려움, 기업 관리자를 위한 직관적인 인터페이스 부재, 복잡한 보안 정책 설정으로 인한 설정 오류 빈발, 신규 기업 고객의 서비스 도입 시 높은 학습 비용 등의 과제가 있었습니다.',
    solution: '통합 대시보드로 모든 인증 현황을 한눈에 파악할 수 있도록 개선하고, 단계별 가이드(Wizard)로 복잡한 보안 정책도 쉽게 설정할 수 있도록 하였습니다. 실시간 모니터링으로 보안 위협 즉시 대응이 가능하게 하고, 셀프서비스 포털로 관리자 업무 부담을 경감하였습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '설정 오류', value: '-60%' },
      { label: '온보딩 시간', value: '-50%' },
      { label: '관리자 만족도', value: '4.7/5' },
      { label: '지원 문의', value: '-45%' }
    ],
    nextProject: { id: 5, title: 'LG헬로비전 통합 웹사이트 운영' }
  },
  5: {
    title: 'LG헬로비전 통합 웹사이트 운영',
    subtitle: 'Integrated Web Operations',
    category: 'Web Operations',
    client: 'LG헬로비전',
    year: '운영중',
    duration: '운영중',
    role: 'Web Operations, Continuous Improvement',
    color: '#4CAF50',
    heroImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1920&h=1080&fit=crop',
    overview: 'LG헬로비전의 모든 서비스(케이블TV, 인터넷, 모바일, 렌탈 등)를 아우르는 통합 웹사이트 운영 프로젝트입니다. 다양한 서비스를 하나의 플랫폼에서 일관된 사용자 경험으로 제공하며, 지속적인 개선과 최적화를 통해 고객 만족도를 높이고 있습니다.',
    challenge: '케이블TV, 인터넷, 모바일, 렌탈 등 다양한 서비스 통합 필요, 서비스별 상이한 UI/UX로 인한 고객 혼란, 24/7 서비스 운영에 따른 즉각적인 대응 체계 필요, 다양한 서비스의 성과를 통합적으로 분석하는 체계 부재 등의 과제가 있었습니다.',
    solution: '통합 디자인 시스템 구축으로 일관된 사용자 경험 제공, 애자일 방법론 기반 빠른 이슈 대응 및 지속적 개선, 통합 분석 대시보드로 서비스별 성과 모니터링, 지속적인 A/B 테스트로 사용자 경험 최적화를 달성하였습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '운영 효율성', value: '+35%' },
      { label: '이슈 대응 시간', value: '-50%' },
      { label: '고객 만족도', value: '4.4/5' },
      { label: '전환율 개선', value: '+20%' }
    ],
    nextProject: { id: 6, title: '국내외 기업 SRM 서비스 운영' }
  },
  6: {
    title: '국내외 기업 SRM 서비스 운영',
    subtitle: 'Enterprise SRM Solution',
    category: 'System Operations',
    client: '현대글로비스 / 아모레퍼시픽',
    year: '운영중',
    duration: '운영중',
    role: 'System Operations, Global Support',
    color: '#FF9800',
    heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop',
    overview: '현대글로비스 아태/미주/유럽 구매시스템, 아모레퍼시픽 간접구매시스템 등 대기업 SRM(Supplier Relationship Management) 서비스 운영 프로젝트입니다. 엠로(Emro)와 협력하여 글로벌 기업의 공급망 관리 시스템을 안정적으로 운영하고, 지속적인 기능 개선을 통해 업무 효율성을 높이고 있습니다.',
    challenge: '아태, 미주, 유럽 등 다양한 지역의 시스템 통합 운영, 기업별 상이한 구매 프로세스와 정책 대응, 글로벌 사용자를 위한 다국어 인터페이스 필요, 비즈니스 크리티컬 시스템의 무중단 운영 필수 등의 과제가 있었습니다.',
    solution: '글로벌 통합 플랫폼으로 지역별 특성을 반영한 운영, 베스트 프랙티스 기반 구매 프로세스 표준화, 국제화 프레임워크로 손쉬운 다국어 지원, 24시간 모니터링 체계로 시스템 안정성 확보를 달성하였습니다.',
    gallery: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&h=800&fit=crop'
    ],
    results: [
      { label: '시스템 가동률', value: '99.9%' },
      { label: '처리 속도', value: '+40%' },
      { label: '사용자 만족도', value: '4.5/5' },
      { label: '비용 절감', value: '-25%' }
    ],
    nextProject: { id: 1, title: 'LG헬로비전 모바일 직영몰 고도화' }
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
            <span className="category-year">{project.year}</span>
            <span className="hero-subtitle">{project.subtitle}</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            {project.title}
          </motion.h1>
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
