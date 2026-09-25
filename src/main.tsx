import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { content, type Locale } from './content'
import './styles.css'

const navSectionIds = ['home', 'about', 'services', 'samarkand', 'partners'] as const
const sectionIds = ['home', 'about', 'services', 'samarkand', 'process', 'partners', 'presentation'] as const
const serviceIcons = ['plan', 'plane', 'bed', 'camera', 'shield'] as const
const destinationIcons = ['landmark', 'book', 'bed', 'route', 'users'] as const
const partnerLogos = ['qanot', 'silk', 'local'] as const

function getInitialLocale(): Locale {
  const value = new URLSearchParams(window.location.search).get('lang')
  return value === 'en' ? 'en' : 'ru'
}

type IconName = 'plan' | 'plane' | 'bed' | 'camera' | 'shield' | 'users' | 'landmark' | 'book' | 'route'

function Icon({ name }: { name: IconName }) {
  const paths = {
    plan: <><rect x="5" y="5" width="18" height="21" rx="1" /><path d="M9 3v5m10-5v5M5 11h18M9 16h10m-10 4h10" /></>,
    plane: <><path d="M26 3 3 14l9 2 2 9L26 3Z" /><path d="m12 16 14-13M8 12l-3-5m12 12 5 3" /></>,
    bed: <><path d="M3 22V9m22 13V9M3 15h22v7H3zM6 15v-5h7v5m2 0v-5h7v5M3 22v3m22-3v3" /></>,
    camera: <><path d="M4 9h5l2-3h6l2 3h5v16H4z" /><circle cx="14" cy="17" r="5" /><path d="M21 12h1" /></>,
    shield: <><path d="M14 2 24 6v8c0 7-4 10-10 13C8 24 4 21 4 14V6z" /><path d="m9 14 4 4 7-8" /></>,
    users: <><circle cx="10" cy="8" r="3" /><circle cx="19" cy="8" r="3" /><path d="M3 24v-6c0-3 3-5 7-5s7 2 7 5v6M14 15c1.3-1.3 3-2 5-2 4 0 7 2 7 5v6" /></>,
    landmark: <><path d="m14 3 11 8H3zM5 12v12m6-12v12m6-12v12m6-12v12M3 25h22" /></>,
    book: <><path d="M14 6c-4-3-8-3-11-2v19c4-1 8-1 11 2 3-3 7-3 11-2V4c-3-1-7-1-11 2Zm0 0v19" /></>,
    route: <><path d="M4 6h7l3 4h10v14H4zM8 17h4l3-3 5 5" /><circle cx="9" cy="10" r="1" /><circle cx="20" cy="19" r="1" /></>,
  }
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>
}

function LanguageSwitcher({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  return (
    <details className="language-switcher" ref={detailsRef}>
      <summary aria-label={content[locale].languageLabel}>{locale.toUpperCase()}<span aria-hidden="true">⌄</span></summary>
      <div className="language-options">
        {(['ru', 'en'] as const).map((code) => (
          <button type="button" key={code} aria-label={code === 'ru' ? 'Русский' : 'English'} aria-current={locale === code ? 'true' : undefined} onClick={() => { detailsRef.current?.removeAttribute('open'); onChange(code) }}>{code.toUpperCase()}</button>
        ))}
      </div>
    </details>
  )
}

function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<(typeof sectionIds)[number]>('home')
  const t = content[locale]
  const navLabels = [t.nav[0], t.nav[1], t.nav[2], locale === 'ru' ? 'Самарканд' : 'Samarkand', t.nav[3]]
  const aboutUrl = `/presentation/index.html?lang=${locale}`

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `SOFINTRAVEL — ${locale === 'ru' ? 'паломнические и культурные поездки по Узбекистану' : 'pilgrimage and cultural journeys in Uzbekistan'}`
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
    const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]')
    const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    if (description) description.content = t.heroText
    if (ogTitle) ogTitle.content = document.title
    if (ogDescription) ogDescription.content = t.heroText
    if (ogLocale) ogLocale.content = locale === 'ru' ? 'ru_RU' : 'en_US'
    if (ogImage) ogImage.content = new URL('/images/journey-art.webp', window.location.origin).href
    const url = new URL(window.location.href)
    if (locale === 'ru') url.searchParams.delete('lang')
    else url.searchParams.set('lang', locale)
    window.history.replaceState(null, '', url)
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical) canonical.href = url.href.split('#')[0]
  }, [locale, t.heroText])

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 32)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const marker = Math.min(window.innerHeight * .35, 300)
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top > marker) break
        current = section
      }
      if (current) setActiveSection(current.id as (typeof sectionIds)[number])
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }
    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  useLayoutEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const canAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window
    document.documentElement.classList.toggle('motion-ready', canAnimate)
    if (!canAnimate) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [locale])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale)
    setMenuOpen(false)
  }

  return (
    <>
      <a className="skip-link" href="#main">{locale === 'ru' ? 'К содержимому' : 'Skip to content'}</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="#home" onClick={() => setMenuOpen(false)} aria-label="SOFINTRAVEL">
            <img src="/images/sofintravel-horizontal.png" alt="SOFINTRAVEL" width="610" height="140" />
          </a>
          <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} id="site-navigation" aria-label={locale === 'ru' ? 'Основная навигация' : 'Main navigation'}>
            {navSectionIds.map((id, index) => <a href={`#${id}`} key={id} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{navLabels[index]}</a>)}
            <a className="nav-presentation" href={aboutUrl} onClick={() => setMenuOpen(false)}>{t.presentationAction}</a>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher locale={locale} onChange={changeLocale} />
            <a className="header-presentation" href={aboutUrl}>{t.presentationAction}<span aria-hidden="true">↗</span></a>
          </div>
          <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? t.menuClose : t.menuOpen} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <picture className="hero-media">
            <img src="/images/journey-art.webp" alt={locale === 'ru' ? 'Путешествие по Узбекистану' : 'Journey across Uzbekistan'} fetchPriority="high" />
          </picture>
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">{t.heroEyebrow}</p>
              <h1 id="hero-title">{t.heroTitle}</h1>
              <p className="hero-intro">{t.heroText}</p>
              <div className="hero-links">
                <a className="button button-gold" href="#services">{t.heroPrimary}<Arrow /></a>
                <a className="button button-outline" href="#about">{t.heroSecondary}<Arrow /></a>
              </div>
            </div>
            <div className="hero-offer">{t.heroServices.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <span className="hero-caption">{t.heroCaption}</span>
          <a className="hero-scroll" href="#about">{t.scrollAction}<span aria-hidden="true">↓</span></a>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="container about-grid reveal">
            <div className="about-identity">
              <p className="eyebrow">01 / {t.aboutEyebrow}</p>
              <h2 id="about-title">{t.aboutTitle}</h2>
              <p className="about-tagline">{t.aboutTagline}</p>
            </div>
            <div className="about-story">
              <p className="about-description">{t.aboutText}</p>
              <a className="about-presentation" href={aboutUrl}>{t.presentationAction}<span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="container services-layout">
            <div className="services-heading">
              <p className="eyebrow">02 / {t.servicesEyebrow}</p><h2 id="services-title">{t.servicesTitle}</h2>
            </div>
            <div className="services-grid">
              {t.services.map((service, index) => (
                <article className="service-card reveal" key={service.title}>
                  <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{service.title}</h3><p>{service.text}</p></div>
                  <Icon name={serviceIcons[index]} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="destination-section" id="samarkand" aria-labelledby="destination-title">
          <picture className="destination-photo reveal image-reveal">
            <img src="/images/samarkand-portrait.webp" alt={locale === 'ru' ? 'Мечети и медресе Самарканда' : 'Mosques and madrasahs of Samarkand'} loading="lazy" />
          </picture>
          <div className="destination-copy reveal">
            <p className="eyebrow">03 / {t.destinationEyebrow}</p>
            <h2 id="destination-title">{t.destinationTitle}</h2>
            <p>{t.destinationText}</p>
            <ul className="destination-points">
              {t.destinationPoints.map((point, index) => <li key={point}><Icon name={destinationIcons[index]} /><span>{point}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-title">
          <div className="container process-layout">
            <div className="process-heading reveal"><p className="eyebrow">04 / {t.processEyebrow}</p><h2 id="process-title">{t.processTitle}</h2></div>
            <div className="process-list">
              {t.process.map((item, index) => <article className="process-item reveal" key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="partners-section" id="partners" aria-labelledby="partners-title">
          <div className="container partners-grid">
            <div className="partners-heading reveal"><p className="eyebrow">05 / {t.partnersEyebrow}</p><h2 id="partners-title">{t.partnersTitle}</h2></div>
            <div className="partners-cards">
              {t.partners.map((partner, index) => <article className="partner-card reveal" key={partner.name}><img src={`/images/partner-${partnerLogos[index]}.webp`} alt="" loading="lazy" /><div><h3>{partner.name}</h3><p>{partner.role}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="final-cta" id="presentation" aria-labelledby="cta-title">
          <div className="container cta-grid reveal">
            <h2 id="cta-title">{t.ctaTitle}</h2>
            <div className="cta-actions"><a className="button button-gold" href={aboutUrl}>{t.presentationAction}<span aria-hidden="true">↗</span></a></div>
          </div>
          <img className="cta-art reveal" src="/images/architecture-gold.png" alt="" loading="lazy" />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-identity"><a className="footer-brand" href="#home"><img src="/images/sofintravel-horizontal.png" alt="SOFINTRAVEL" width="610" height="140" /></a><span>© {new Date().getFullYear()} SOFINTRAVEL. {t.copyright}</span></div>
          <nav aria-label={locale === 'ru' ? 'Навигация в подвале' : 'Footer navigation'}>
            {navSectionIds.map((id, index) => <a href={`#${id}`} key={id}>{navLabels[index]}</a>)}
            <a href={aboutUrl}>{t.presentationAction}</a>
          </nav>
        </div>
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
