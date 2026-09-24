import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { content, type Locale } from './content'
import './styles.css'

const editorial = {
  ru: { hero: ['Паломнические', 'поездки по', 'Узбекистану'], intro: 'Планируем маршрут', accent: 'и программу.', introText: 'SOFINTRAVEL организует паломнические поездки по Узбекистану для групп.', explore: 'О нас', collection: 'Маршруты в Узбекистане', collectionTitle: 'Узбекистан.\nМаршруты. Сопровождение.', gallery: ['Маршруты по Узбекистану', 'Silk Road Samarkand', 'Размещение и комфорт'], gallerySub: ['Паломнические и культурные поездки', 'Современная туристическая инфраструктура', 'Гостиничная инфраструктура'], serviceNote: 'Программа, размещение, транспорт\nи сопровождение группы.', philosophy: 'Планирование\nи сопровождение.', processNote: 'Планирование и координация поездки для группы.', partnerNote: 'Авиация, размещение и местные услуги.', final: 'Маршрут', finalAccent: 'и программа.', finalText: 'Подробнее о SOFINTRAVEL — в разделе «О нас».', step: 'Этап', menu: 'Меню', close: 'Закрыть', back: 'Наверх' },
  en: { hero: ['Pilgrimage', 'journeys across', 'Uzbekistan'], intro: 'We plan the route', accent: 'and program.', introText: 'SOFINTRAVEL organizes pilgrimage journeys across Uzbekistan for groups.', explore: 'About us', collection: 'Routes in Uzbekistan', collectionTitle: 'Uzbekistan.\nRoutes. Support.', gallery: ['Routes across Uzbekistan', 'Silk Road Samarkand', 'Accommodation and comfort'], gallerySub: ['Pilgrimage and cultural journeys', 'Modern tourism infrastructure', 'Hotel infrastructure'], serviceNote: 'Programs, accommodation, transport\nand group support.', philosophy: 'Planning\nand support.', processNote: 'Planning and coordinating the journey for each group.', partnerNote: 'Aviation, accommodation and local services.', final: 'Route', finalAccent: 'and program.', finalText: 'Learn more about SOFINTRAVEL in the About us section.', step: 'Stage', menu: 'Menu', close: 'Close', back: 'Back to top' },
}
const servicePhotos = ['registan-1200.webp', 'service-transfer.webp', 'service-hospitality.webp', 'service-excursion.webp', 'service-care.webp']
const galleryPhotos = ['silk-road-aerial.webp', 'silk-road-evening.webp', 'hotel.webp']

function ArrowIcon() {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M9 5h10v10" /></svg>
}

function ArrowDownIcon() {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 7 7 7-7" /></svg>
}

function ArrowUpIcon() {
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 19 7-7 7 7" /></svg>
}

function App() {
  const [locale, setLocale] = useState<Locale>(() => { const lang = new URLSearchParams(location.search).get('lang'); return lang === 'en' ? 'en' : 'ru' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [service, setService] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const t = content[locale], e = editorial[locale]
  const aboutUrl = `/presentation/index.html?lang=${locale}`
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = 'SOFINTRAVEL — ' + t.heroTitle.replace('\n', ' ')
    const url = new URL(location.href); locale === 'ru' ? url.searchParams.delete('lang') : url.searchParams.set('lang', locale); history.replaceState(null, '', url)
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.heroText)
  }, [locale, t.heroText, t.heroTitle])
  useEffect(() => {
    let frame = 0
    const paint = () => {
      frame = 0
      setScrolled(scrollY > 45)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint) }
    paint(); addEventListener('scroll', schedule, { passive: true })
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule) }
  }, [])
  useEffect(() => { const close = (ev: KeyboardEvent) => { if (ev.key === 'Escape') setMenuOpen(false) }; addEventListener('keydown', close); return () => removeEventListener('keydown', close) }, [])
  return <div className="site">
    <a className="skip-link" href="#main">{t.heroPrimary}</a>
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <a className="brand" href="#home" aria-label="SOFINTRAVEL"><img src="/images/sofintravel-horizontal.png" alt="SOFINTRAVEL" width="610" height="140" /></a>
      <nav className={menuOpen ? 'navigation open' : 'navigation'} id="navigation" aria-label={e.menu}>
        <a href="#about" onClick={() => setMenuOpen(false)}>{t.nav[1]}</a><a href="#services" onClick={() => setMenuOpen(false)}>{t.nav[2]}</a><a href="#partners" onClick={() => setMenuOpen(false)}>{t.nav[3]}</a>
      </nav>
      <div className="header-tools"><div className="language-switch" role="group" aria-label={t.languageLabel}><button type="button" aria-pressed={locale === 'ru'} onClick={() => { setLocale('ru'); setMenuOpen(false) }}>RU</button><button type="button" aria-pressed={locale === 'en'} onClick={() => { setLocale('en'); setMenuOpen(false) }}>EN</button></div><a className="header-about" href={aboutUrl}>{t.presentationAction}<ArrowIcon /></a><button className="menu-toggle" aria-label={menuOpen ? e.close : e.menu} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}><span className={`menu-icon ${menuOpen ? 'open' : ''}`} aria-hidden="true" /></button></div>
    </header>
    <main id="main">
      <section className="hero" id="home">
        <div className="hero-photo"><img src="/images/journey-art.webp" alt={locale === 'ru' ? 'Караван в пустыне у Регистана в Самарканде' : 'Caravan in the desert by Registan in Samarkand'} fetchPriority="high" /></div>
        <div className="hero-shade" />
        <div className="hero-topline"><span>SOFINTRAVEL / AVIATION & TOURISM</span></div>
        <div className="hero-content"><p className="eyebrow light">{t.heroEyebrow}</p><h1>{e.hero.map((line,i) => <span className="title-mask" key={line}><span className={i === 2 ? 'hero-italic' : ''}>{line}</span></span>)}</h1><div className="hero-bottom-copy"><p>{t.heroText}</p><a href="#about" className="round-link" aria-label={t.heroSecondary}><ArrowDownIcon /></a></div></div>
        <div className="hero-footer"><a href="#about">{t.scrollAction}<span className="scroll-line" /></a></div>
      </section>
      <section className="manifesto section-pad" id="about">
        <div className="section-label" data-reveal><span>01 / {t.aboutEyebrow}</span></div>
        <div className="manifesto-heading" data-reveal><h2>{e.intro}<br/><em>{e.accent}</em></h2></div>
        <div className="manifesto-bottom"><div className="arch-photo" data-reveal><img src="/images/samarkand-portrait.webp" alt={locale === 'ru' ? 'Посетители на площади Регистан в Самарканде' : 'Visitors at Registan Square in Samarkand'} loading="lazy"/></div><div className="manifesto-copy" data-reveal><p className="large-copy">{e.introText}</p><p>{t.aboutText}</p><a className="text-link" href={aboutUrl}>{e.explore}<ArrowIcon /></a></div></div>
      </section>
      <section className="services section-pad" id="services">
        <div className="section-label" data-reveal><span>02 / {t.servicesEyebrow}</span></div>
        <div className="services-title" data-reveal><h2>{t.servicesTitle}</h2><p>{e.serviceNote}</p></div>
        <div className="services-layout"><div className="service-visual" data-reveal><img key={service} src={`/images/${servicePhotos[service]}`} alt={t.services[service].title} loading="lazy"/></div><div className="service-list">{t.services.map((item,i) => <article className={`service-item ${service===i ? 'active' : ''}`} key={item.title}><button onClick={() => setService(i)} aria-expanded={service===i} aria-controls={`service-${i}`}><span className="service-num">0{i+1}</span><h3>{item.title}</h3><span className="service-symbol" aria-hidden="true" /></button><div className="service-detail" id={`service-${i}`} hidden={service!==i}><p>{item.text}</p></div></article>)}</div></div>
      </section>
      <section className="journey-gallery" aria-label={e.collection}>
        <div className="gallery-sticky"><div className="gallery-heading"><div><p className="eyebrow light">03 / {e.collection}</p><h2>{e.collectionTitle}</h2></div></div><div className="gallery-track">{galleryPhotos.map((photo,i)=><figure key={photo}><div className="gallery-photo"><img src={`/images/${photo}`} alt={e.gallery[i]} loading="lazy"/></div><figcaption><h3>{e.gallery[i]}</h3><p>{e.gallerySub[i]}</p></figcaption></figure>)}</div></div>
      </section>
      <section className="care section-pad" id="process"><div className="section-label" data-reveal><span>04 / {t.processEyebrow}</span></div><div className="care-heading" data-reveal><h2>{e.philosophy}</h2><p>{e.processNote}</p></div><div className="care-grid">{t.process.map((item,i)=><article data-reveal key={item.title}><span className="care-number">0{i+1}<small>/{e.step}</small></span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="partners section-pad" id="partners"><div className="section-label" data-reveal><span>05 / {t.partnersEyebrow}</span></div><div className="partner-heading" data-reveal><h2>{t.partnersTitle}</h2><p>{e.partnerNote}</p></div><div className="partner-list">{t.partners.map((partner,i)=><article data-reveal key={partner.name}><span className="partner-number">0{i+1}</span><div className="partner-logo"><img src={`/images/partner-${['qanot-new', 'silk-new', 'local'][i]}.webp`} alt={partner.name} loading="lazy" /></div><div><h3>{partner.name}</h3><p>{partner.role}</p></div></article>)}</div></section>
      <section className="finale"><p className="eyebrow light" data-reveal>SOFINTRAVEL / AVIATION / TOURISM</p><h2 data-reveal>{e.final}<br/><em>{e.finalAccent}</em></h2><div className="finale-action" data-reveal><p>{e.finalText}</p><a className="round-link" href={aboutUrl} aria-label={t.presentationAction}><ArrowIcon /><small>{t.presentationAction}</small></a></div><img className="architecture" src="/images/architecture-gold.png" alt="" loading="lazy" /></section>
    </main>
    <footer className="footer"><div className="footer-top"><a href="#home"><img src="/images/sofintravel-horizontal.png" alt="SOFINTRAVEL" width="610" height="140"/></a><a href="#home" className="text-link">{e.back}<ArrowUpIcon /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SOFINTRAVEL. {t.copyright}</span><a href={aboutUrl}>{t.presentationAction}<ArrowIcon /></a></div></footer>
  </div>
}
createRoot(document.getElementById('root')!).render(<App />)
