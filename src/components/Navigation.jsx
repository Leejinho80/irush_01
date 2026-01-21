import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Navigation.css'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.classList.remove('menu-open')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isMenuOpen])

  const menuItems = [
    { path: '/about', label: 'About Us', number: '01' },
    { path: '/work', label: 'Our Work', number: '02' },
    { path: '/trend', label: 'Trend Desk', number: '03' },
  ]

  const menuVariants = {
    closed: {
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 40,
        delay: 0.2
      }
    },
    open: {
      clipPath: 'circle(150% at calc(100% - 40px) 40px)',
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 20
      }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, x: 50 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1]
      }
    })
  }

  const handleContactClick = (e) => {
    e.preventDefault()

    // 먼저 body 스타일을 복원하고 스크롤 위치를 저장
    const scrollY = document.body.style.top
    document.body.classList.remove('menu-open')
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''

    // 스크롤 위치 복원
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }

    // 메뉴 닫기
    setIsMenuOpen(false)

    // 약간의 지연 후 footer로 스크롤 (body 스타일 복원 완료 후)
    setTimeout(() => {
      const footer = document.getElementById('contact')
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <header className={`nav-header ${isScrolled ? 'is-scrolled' : ''} ${isDark ? 'is-dark' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">iRUSH</span>
        </Link>

        <nav className="nav-desktop">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'is-active' : ''}`}
            >
              <span className="nav-link-text">{item.label}</span>
            </Link>
          ))}
          <a href="#contact" className="nav-link nav-link-contact" onClick={handleContactClick}>
            <span className="nav-link-text">Contact</span>
          </a>
        </nav>

        <button
          className={`nav-toggle ${isMenuOpen ? 'is-open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="toggle-line" />
          <span className="toggle-line" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="nav-mobile"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="nav-mobile-content">
              <div className="nav-mobile-links">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      to={item.path}
                      className="nav-mobile-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="link-number">{item.number}</span>
                      <span className="link-label">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                  className="nav-mobile-contact-wrapper"
                  custom={menuItems.length}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <a
                    href="#contact"
                    className="nav-mobile-contact-btn"
                    onClick={handleContactClick}
                  >
                    <span>Contact</span>
                  </a>
                </motion.div>

              <motion.div
                className="nav-mobile-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="nav-mobile-info">
                  <p>서울 영등포구 영신로 220</p>
                  <p>KnK디지털타워 604호</p>
                </div>
                <div className="nav-mobile-contact">
                  <a href="mailto:info@irush.co.kr">info@irush.co.kr</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navigation
