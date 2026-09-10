import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { I18nProvider, storeLang, useT } from '@/i18n/I18nContext'
import { useLangParam } from '@/router/langRoute'
import { LANGS, type Lang } from '@/types/common'

const NAV_ITEMS: { to: string; key: string }[] = [
  { to: '', key: 'nav.home' },
  { to: 'attractions', key: 'nav.attractions' },
  { to: 'medical', key: 'nav.medical' },
  { to: 'kpop', key: 'nav.kpop' },
  { to: 'products', key: 'nav.products' },
  { to: 'consultation', key: 'nav.consultation' },
]

function LangSwitch({ lang, onSwitch }: { lang: Lang; onSwitch: (l: Lang) => void }) {
  return (
    <div className="lang-switch">
      {LANGS.map((l) => (
        <button key={l} className={l === lang ? 'active' : ''} onClick={() => onSwitch(l)}>
          {l === 'zh' ? '中文' : l === 'en' ? 'EN' : '한국어'}
        </button>
      ))}
    </div>
  )
}

function HeaderNav() {
  const t = useT()
  return (
    <nav className="nav-links">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.key} to={item.to || '.'} end={item.to === ''}>
          {t.t(item.key)}
        </NavLink>
      ))}
    </nav>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-mark" style={{ color: '#fff' }}>
              JUTour<span className="dot">.</span>
            </div>
            <p style={{ maxWidth: '46ch', marginTop: 10 }}>{t.t('brand.tagline')}</p>
          </div>
          <div>
            <strong>{t.t('footer.contactTitle')}</strong>
            <p style={{ marginTop: 8 }}>
              {t.t('footer.contactEmail')}
              <br />
              {t.t('footer.contactPhone')}
            </p>
          </div>
        </div>
        <div className="footer-notice">
          © {new Date().getFullYear()} JUTour · {t.t('footer.rights')}. {t.t('footer.demoNotice')}
        </div>
      </div>
    </footer>
  )
}

function LayoutInner() {
  const { lang, switchLang } = useLangParam()
  const t = useT()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <header className="site-header">
        <div className="site-header-in">
          <NavLink to={`/${lang}`} className="brand-mark">
            JUTour<span className="dot">.</span>
          </NavLink>
          <HeaderNav />
          <div className="header-actions">
            <LangSwitch lang={lang} onSwitch={(l) => { storeLang(l); switchLang(l) }} />
            <NavLink to="/admin" className="btn btn-ghost btn-sm">
              {t.t('nav.admin')}
            </NavLink>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function PublicLayout() {
  const { lang } = useLangParam()
  return (
    <I18nProvider lang={lang}>
      <LayoutInner />
    </I18nProvider>
  )
}
