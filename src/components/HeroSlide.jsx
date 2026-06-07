const HeroSlide = ({ game, isActive }) => {
  return (
    <div
      className={`
        absolute inset-0 transition-all duration-[1.5s] ease-in-out
        ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}
      `}
    >
      {/* Imagen de fondo */}
      <img
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s]"
        src={game.image}
        alt={game.name}
        style={{
          transform: isActive ? 'scale(1)' : 'scale(1.1)',
        }}
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.7)_100%)]"></div>
    </div>
  )
}

export default HeroSlide
