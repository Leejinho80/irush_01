import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import './PageTransition.css'

const PageTransition = ({ children, skipTransition = false }) => {
  // skipTransition이 변경되지 않는 한 초기값 유지
  const [isTransitioning, setIsTransitioning] = useState(!skipTransition)
  const [showContent, setShowContent] = useState(skipTransition)
  // 컴포넌트가 마운트되었는지 추적 (초기 렌더링 구분)
  const isMountedRef = useRef(false)

  useEffect(() => {
    // skipTransition이 true면 트랜지션 없이 바로 콘텐츠 표시
    if (skipTransition) {
      setIsTransitioning(false)
      setShowContent(true)
      return
    }

    // 마운트 후 skipTransition이 false로 변경된 경우에만 트랜지션 실행
    // 초기 마운트 시에도 트랜지션 실행
    if (!isMountedRef.current) {
      isMountedRef.current = true
    }

    setIsTransitioning(true)
    setShowContent(false)

    // 전환 효과 중간에 콘텐츠 표시 (오버레이가 완전히 덮은 후)
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 600)

    // 전환 효과 종료
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1200)

    // cleanup: 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => {
      clearTimeout(contentTimer)
      clearTimeout(transitionTimer)
    }
  }, [skipTransition])

  const overlayVariants = {
    initial: {
      y: '100%'
    },
    animate: {
      y: '0%',
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1]
      }
    },
    exit: {
      y: '-100%',
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1]
      }
    }
  }

  const marqueeVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  const marqueeText = 'iRUSH • DIGITAL CREATIVE AGENCY • FEVER TO CREATE • BLISS TO DELIVER • FAITH TO SUCCEED • '

  if (skipTransition) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="page-transition-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="transition-marquee"
              variants={marqueeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="transition-marquee-track">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="transition-marquee-text">
                    {marqueeText}
                  </span>
                ))}
              </div>
              <div className="transition-marquee-track reverse">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="transition-marquee-text">
                    {marqueeText}
                  </span>
                ))}
              </div>
              <div className="transition-marquee-track">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="transition-marquee-text">
                    {marqueeText}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    </>
  )
}

export default PageTransition
