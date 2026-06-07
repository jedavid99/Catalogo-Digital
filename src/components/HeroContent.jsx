const HeroContent = ({ game, consultWhatsApp, config }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Badges promocionales */}
     
      {/* Badge de plataforma */}
      <div className="flex items-center gap-2 animate-slide-in-up delay-200">
        
        <span className="inline-flex items-center gap-2 bg-surface-container-high/80 backdrop-blur-sm text-on-surface border border-outline-variant/50 px-3 py-1.5 rounded-full text-sm font-medium">
          {game.platform}
        </span>
      </div>

      {/* Nombre del juego */}
      <h1 className="font-display-lg text-[40px] md:text-[56px] lg:text-[64px] text-white leading-[1.1] tracking-tight animate-slide-in-up delay-300">
        {game.name}
      </h1>

      {/* Tagline emocional */}
      

     


      

      
       

        
      </div>
    
  )
}

export default HeroContent
