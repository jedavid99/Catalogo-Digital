const HeroIndicators = ({ games, currentSlide, onSlideChange }) => {
  return (
    <div className="absolute bottom-8 right-8 z-30 flex gap-2">
      {games.map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${index === currentSlide 
              ? 'bg-primary scale-125 shadow-[0_0_10px_rgba(190,198,224,0.6)]' 
              : 'bg-white/30 hover:bg-white/60'
            }
          `}
          aria-label={`Ver ${games[index].name}`}
        />
      ))}
    </div>
  )
}

export default HeroIndicators
