import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import MainPage from './pages/MainPage'
import AboutPage from './pages/AboutPage'
import WorkPage from './pages/WorkPage'
import WorkDetailPage from './pages/WorkDetailPage'
import TrendPage from './pages/TrendPage'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import PageTransition from './components/PageTransition'

function App() {
  const location = useLocation()

  useEffect(() => {
    // 페이지 이동 시 스크롤 최상단으로 초기화
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    document.body.classList.remove('scroll-locked', 'menu-open')
  }, [location.pathname])

  return (
    <>
      <CustomCursor />
      <Navigation />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition skipTransition>
              <MainPage />
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          } />
          <Route path="/work" element={
            <PageTransition>
              <WorkPage />
            </PageTransition>
          } />
          <Route path="/work/:id" element={
            <PageTransition>
              <WorkDetailPage />
            </PageTransition>
          } />
          <Route path="/trend" element={
            <PageTransition>
              <TrendPage />
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
