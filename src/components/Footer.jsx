import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-top">
          <motion.div
            className="footer-cta"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="footer-title">
              <span className="title-line">Let's Create</span>
              <span className="title-line accent">Something Great</span>
            </h2>
            <a href="mailto:info@irush.co.kr" className="footer-email">
              info@irush.co.kr
            </a>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="footer-col">
              <h3 className="footer-col-title">Navigate</h3>
              <ul className="footer-nav">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/work">Our Work</Link></li>
                <li><Link to="/trend">Trend Desk</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-title">Contact</h3>
              <address className="footer-address">
                <p>서울 영등포구 영신로 220</p>
                <p>KnK디지털타워 604호</p>
                <p className="footer-phone">02-323-9030</p>
              </address>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-title">Download</h3>
              <a
                href="/(주)아이러시 회사소개서.pdf"
                download
                className="brochure-btn"
              >
                Company Brochure
                <span className="btn-icon">↓</span>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <div className="footer-marquee">
            <div className="marquee-track">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="marquee-text">
                  iRUSH Digital Creative Agency
                </span>
              ))}
            </div>
          </div>

          <div className="footer-legal">
            <p>&copy; {currentYear} iRUSH. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
