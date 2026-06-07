const HeroProgressBar = ({ currentSlide, totalSlides }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
      <div 
        className="h-full bg-gradient-to-r from-primary to-neonBlue transition-all duration-[6s] linear"
        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
      ></div>
    </div>
  )
}

export default HeroProgressBar
