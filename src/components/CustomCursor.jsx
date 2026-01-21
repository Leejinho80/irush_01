import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './CustomCursor.css'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  // ref를 사용하여 animation frame ID를 추적 (재귀 호출 포함)
  const rafIdRef = useRef(null)
  // 현재 등록된 리스너들을 추적하기 위한 ref
  const cleanupListenersRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })
    }

    // requestAnimationFrame을 ref로 관리하여 cleanup 시 확실히 취소
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15

      gsap.set(follower, {
        x: posRef.current.x,
        y: posRef.current.y
      })

      // 다음 frame ID를 ref에 저장
      rafIdRef.current = requestAnimationFrame(animate)
    }

    const onMouseEnterLink = () => {
      cursor.classList.add('is-active')
      follower.classList.add('is-active')
    }

    const onMouseLeaveLink = () => {
      cursor.classList.remove('is-active')
      follower.classList.remove('is-active')
    }

    const onMouseEnterMedia = () => {
      cursor.classList.add('is-media')
      follower.classList.add('is-media')
    }

    const onMouseLeaveMedia = () => {
      cursor.classList.remove('is-media')
      follower.classList.remove('is-media')
    }

    const addLinkListeners = () => {
      // 이전 리스너 정리
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current()
      }

      const links = document.querySelectorAll('a, button, .cursor-hover')
      const media = document.querySelectorAll('.cursor-media')

      links.forEach(link => {
        link.addEventListener('mouseenter', onMouseEnterLink)
        link.addEventListener('mouseleave', onMouseLeaveLink)
      })

      media.forEach(item => {
        item.addEventListener('mouseenter', onMouseEnterMedia)
        item.addEventListener('mouseleave', onMouseLeaveMedia)
      })

      // cleanup 함수를 ref에 저장
      cleanupListenersRef.current = () => {
        links.forEach(link => {
          link.removeEventListener('mouseenter', onMouseEnterLink)
          link.removeEventListener('mouseleave', onMouseLeaveLink)
        })
        media.forEach(item => {
          item.removeEventListener('mouseenter', onMouseEnterMedia)
          item.removeEventListener('mouseleave', onMouseLeaveMedia)
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    // 초기 animation frame 시작
    rafIdRef.current = requestAnimationFrame(animate)

    // Add listeners with delay to ensure DOM is ready
    const timeoutId = setTimeout(addLinkListeners, 100)

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      addLinkListeners()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // cleanup 함수: 모든 리소스 정리
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      // ref에 저장된 최신 frame ID 취소 (재귀 호출 포함)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      clearTimeout(timeoutId)
      observer.disconnect()
      // 등록된 모든 이벤트 리스너 정리
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current()
      }
    }
  }, [])

  return (
    <div className="custom-cursor">
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </div>
  )
}

export default CustomCursor
