import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Initialise i18next before rendering (synchronous with initImmediate:false)
import './i18n/index'

import MarketingPage from './MarketingPage'
import BlogList from './blog/BlogList'
import BlogPost from './blog/BlogPost'
import Contact from './contact/Contact'
import About from './about/About'
import LangLayout from './components/LangLayout'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

/**
 * Scrolls to the top of the page on every route change.
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/**
 * Redirects /  →  /en/ or /es/ based on the persisted / detected language.
 * Also handles legacy routes (/blog, /blog/:slug, /contact).
 */
function LangRedirect({ suffix = '' }) {
  const lang = (() => {
    try {
      const stored = localStorage.getItem('i18nextLng')
      if (stored && ['en', 'es'].includes(stored.split('-')[0])) {
        return stored.split('-')[0]
      }
    } catch { /* localStorage unavailable */ }
    const browser = navigator.language?.split('-')[0]
    return browser === 'es' ? 'es' : 'en'
  })()
  return <Navigate to={`/${lang}${suffix}`} replace />
}

// Generate legacy redirect for /blog/:slug  →  /en/blog/:slug
function LegacyBlogPostRedirect() {
  const location = useLocation()
  return <LangRedirect suffix={location.pathname} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Language-prefixed routes — all real pages live here */}
          <Route path="/:lang" element={<LangLayout />}>
            <Route index element={<MarketingPage />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Root redirect: / → /en/ or /es/ */}
          <Route path="/" element={<LangRedirect suffix="/" />} />

          {/* Legacy redirects for old bookmarks / external links */}
          <Route path="/blog" element={<LangRedirect suffix="/blog" />} />
          <Route path="/blog/:slug" element={<LegacyBlogPostRedirect />} />
          <Route path="/contact" element={<LangRedirect suffix="/contact" />} />
          <Route path="/about" element={<LangRedirect suffix="/about" />} />

          {/* Catch-all: unknown paths → English home */}
          <Route path="*" element={<Navigate to="/en/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
