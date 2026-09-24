const labels = {
  ru: { back: 'Вернуться на сайт', title: 'О компании', description: 'Путешествия, партнёрство и внимание к каждому этапу поездки.', download: 'Скачать PDF ↓', previous: 'Предыдущая страница', next: 'Следующая страница', play: 'Автопоказ', pause: 'Пауза', fullscreen: 'На весь экран', exitFullscreen: 'Выйти из полноэкранного режима', hint: 'Листайте стрелками на клавиатуре или включите автопоказ.', slide: 'Страница', of: 'из', skip: 'К материалам' },
  en: { back: 'Back to website', title: 'About the company', description: 'Journeys, partnerships and care at every stage of the trip.', download: 'Download PDF ↓', previous: 'Previous page', next: 'Next page', play: 'Autoplay', pause: 'Pause', fullscreen: 'Full screen', exitFullscreen: 'Exit full screen', hint: 'Use the arrow keys or start autoplay.', slide: 'Page', of: 'of', skip: 'Skip to materials' },
}
const selected = new URLSearchParams(location.search).get('lang')
const locale = selected === 'en' ? 'en' : 'ru'
const copy = labels[locale]
const total = 10
const image = document.getElementById('slide-image')
const counter = document.getElementById('slide-counter')
const previous = document.getElementById('previous')
const next = document.getElementById('next')
const play = document.getElementById('play')
const fullscreen = document.getElementById('fullscreen')
const shell = document.getElementById('slide-viewer')
let current = 1
let timer = null
function showSlide(number) {
  current = (number + total - 1) % total + 1
  image.onload = () => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.animate([
        { opacity: 0.35, transform: 'scale(1.015)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: 480, easing: 'cubic-bezier(.23, 1, .32, 1)' })
    }
  }
  image.src = `/presentation/slides/slide-${String(current).padStart(2, '0')}.jpg`
  image.alt = `${copy.slide} ${current} ${copy.of} ${total}`
  counter.textContent = `${String(current).padStart(2, '0')} / ${total}`
}
function stopAutoplay() {
  clearInterval(timer)
  timer = null
  play.innerHTML = `▶ <span>${copy.play}</span>`
  play.setAttribute('aria-pressed', 'false')
}
previous.addEventListener('click', () => showSlide(current - 1))
next.addEventListener('click', () => showSlide(current + 1))
play.addEventListener('click', () => {
  if (timer) return stopAutoplay()
  timer = setInterval(() => showSlide(current + 1), 5000)
  play.innerHTML = `Ⅱ <span>${copy.pause}</span>`
  play.setAttribute('aria-pressed', 'true')
})
fullscreen.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen()
  else shell.requestFullscreen?.()
})
document.addEventListener('fullscreenchange', () => {
  fullscreen.querySelector('span').textContent = document.fullscreenElement ? copy.exitFullscreen : copy.fullscreen
})
document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLElement && ['BUTTON', 'A'].includes(event.target.tagName) && event.key === ' ') return
  if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1) }
  if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1) }
})
document.addEventListener('visibilitychange', () => { if (document.hidden && timer) stopAutoplay() })
const home = locale === 'ru' ? '/' : `/?lang=${locale}`
document.documentElement.lang = locale
document.title = `${copy.title} — SOFINTRAVEL`
document.querySelector('meta[name="description"]').content = copy.description
document.querySelector('meta[property="og:title"]').content = document.title
document.getElementById('brand-link').href = home
document.getElementById('back-link').href = `${home}#about`
for (const [id, value] of Object.entries({ 'back-label': copy.back, 'page-title': copy.title, 'page-description': copy.description, 'download-label': copy.download, 'slide-hint': copy.hint, 'skip-label': copy.skip })) document.getElementById(id).textContent = value
previous.setAttribute('aria-label', copy.previous)
next.setAttribute('aria-label', copy.next)
play.querySelector('span').textContent = copy.play
fullscreen.querySelector('span').textContent = copy.fullscreen
showSlide(1)
