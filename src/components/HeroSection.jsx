import { useState, useEffect } from 'react'
import HeroSlide from './HeroSlide'
import HeroContent from './HeroContent'
import HeroIndicators from './HeroIndicators'
import HeroProgressBar from './HeroProgressBar'

const HeroSection = ({ featuredGames, consultWhatsApp, config }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setCurrentSlide(0)
  }, [featuredGames.length])

  useEffect(() => {
    if (featuredGames.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [featuredGames.length])

  if (featuredGames.length === 0) return null

  return (
    <section className="relative h-[550px] md:h-[650px] w-full overflow-hidden mb-12 group">
      {/* Slides */}
      {featuredGames.map((game, index) => (
        <HeroSlide
          key={index}
          game={game}
          isActive={index === currentSlide}
        />
      ))}

      {/* Contenido del Slide Actual */}
      <div className="relative z-20 h-full max-w-container-max mx-auto px-gutter flex items-end pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end w-full">
          <HeroContent
            game={featuredGames[currentSlide]}
            consultWhatsApp={consultWhatsApp}
            config={config}
          />
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Indicadores de slide (dots) */}
      <HeroIndicators
        games={featuredGames}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
      />

      {/* Barra de progreso */}
      <HeroProgressBar
        currentSlide={currentSlide}
        totalSlides={featuredGames.length}
      />
    </section>
  )
}

export default HeroSection
