import { Link } from 'react-router-dom'

const GuidesPage = () => {
  // Recursos de instalación por plataforma
  const platformGuides = [
    {
      platform: 'Steam',
      icon: 'steam',
      description: 'Plataforma de distribución digital de videojuegos desarrollada por Valve Corporation.',
      guide: '/guides/steam-installation.pdf',
      videos: [
        { title: 'Cómo activar un juego en Steam', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía completa de Steam', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'PC',
      icon: 'computer',
      description: 'Instalación de juegos en PC mediante diferentes plataformas y launchers.',
      guide: '/guides/pc-installation.pdf',
      videos: [
        { title: 'Instalación de juegos en PC', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Configuración óptima de PC', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'PlayStation',
      icon: 'videogame_asset',
      description: 'Consolas de videojuegos de Sony: PS4, PS5 y PS3.',
      guide: '/guides/playstation-installation.pdf',
      videos: [
        { title: 'Canjear código en PlayStation Store', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación en PS4/PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'PS4',
      icon: 'videogame_asset',
      description: 'Consola PlayStation 4 de Sony.',
      guide: '/guides/ps4-installation.pdf',
      videos: [
        { title: 'Canjear código en PS4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación de juegos en PS4', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'PS5',
      icon: 'videogame_asset',
      description: 'Consola PlayStation 5 de Sony.',
      guide: '/guides/ps5-installation.pdf',
      videos: [
        { title: 'Canjear código en PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación de juegos en PS5', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'PS3',
      icon: 'videogame_asset',
      description: 'Consola PlayStation 3 de Sony.',
      guide: '/guides/ps3-installation.pdf',
      videos: [
        { title: 'Canjear código en PS3', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación de juegos en PS3', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Xbox',
      icon: 'sports_esports',
      description: 'Consolas de videojuegos de Microsoft: Xbox One y Xbox Series X/S.',
      guide: '/guides/xbox-installation.pdf',
      videos: [
        { title: 'Redimir código en Xbox', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación en Xbox One/Series', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Xbox One',
      icon: 'sports_esports',
      description: 'Consola Xbox One de Microsoft.',
      guide: '/guides/xbox-one-installation.pdf',
      videos: [
        { title: 'Redimir código en Xbox One', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación en Xbox One', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Xbox Series',
      icon: 'sports_esports',
      description: 'Consolas Xbox Series X/S de Microsoft.',
      guide: '/guides/xbox-series-installation.pdf',
      videos: [
        { title: 'Redimir código en Xbox Series X/S', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación en Xbox Series', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Nintendo',
      icon: 'devices',
      description: 'Consolas de Nintendo: Switch, 3DS y Wii U.',
      guide: '/guides/nintendo-installation.pdf',
      videos: [
        { title: 'Canjear código en Nintendo eShop', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Nintendo Switch',
      icon: 'devices',
      description: 'Consola híbrida de Nintendo.',
      guide: '/guides/switch-installation.pdf',
      videos: [
        { title: 'Canjear código en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación de juegos en Switch', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Epic Games',
      icon: 'rocket_launch',
      description: 'Tienda de videojuegos de Epic Games.',
      guide: '/guides/epic-installation.pdf',
      videos: [
        { title: 'Activar juego en Epic Games', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de Epic Games Store', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Windows',
      icon: 'laptop_windows',
      description: 'Sistema operativo Microsoft Windows 10/11.',
      guide: '/guides/windows-activation.pdf',
      videos: [
        { title: 'Activar Windows 10/11', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación completa de Windows', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Office',
      icon: 'description',
      description: 'Suite de productividad Microsoft Office 365/2021.',
      guide: '/guides/office-activation.pdf',
      videos: [
        { title: 'Activar Microsoft Office', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Instalación de Office 365/2021', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Gift Cards',
      icon: 'card_giftcard',
      description: 'Tarjetas de regalo para diversas plataformas y servicios.',
      guide: '/guides/giftcard-redemption.pdf',
      videos: [
        { title: 'Canjear Gift Card', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de Gift Cards', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Game Coins',
      icon: 'monetization_on',
      description: 'Monedas virtuales para juegos online.',
      guide: '/guides/gamecoins-redemption.pdf',
      videos: [
        { title: 'Canjear monedas de juegos', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de monedas virtuales', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Steam Key',
      icon: 'key',
      description: 'Códigos de activación para Steam.',
      guide: '/guides/steam-key-installation.pdf',
      videos: [
        { title: 'Activar Steam Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de Steam Keys', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Steam Global Key',
      icon: 'public',
      description: 'Códigos de activación globales para Steam.',
      guide: '/guides/steam-global-key.pdf',
      videos: [
        { title: 'Activar Steam Global Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de Keys Globales', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    },
    {
      platform: 'Epic Games Key',
      icon: 'vpn_key',
      description: 'Códigos de activación para Epic Games.',
      guide: '/guides/epic-key-installation.pdf',
      videos: [
        { title: 'Activar Epic Games Key', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Guía de Epic Keys', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
      ]
    }
  ]

  return (
    <main className="pt-32 pb-24 px-gutter max-w-container-max mx-auto">
      <div className="glass-panel p-8 rounded-2xl">
        <h1 className="font-headline-md text-headline-md text-primary mb-4">Guías de Instalación</h1>
        <p className="text-body-md text-body-md text-onSurfaceVariant mb-8">
          Encuentra guías detalladas y videos de instalación para todas las plataformas y productos que ofrecemos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformGuides.map((guide, index) => (
            <div key={index} className="bg-surfaceContainer rounded-xl p-6 border border-outlineVariant/20 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">{guide.icon}</span>
                <h2 className="font-headline-sm text-headline-sm text-primary">{guide.platform}</h2>
              </div>
              
              <p className="text-sm text-onSurfaceVariant mb-4">{guide.description}</p>
              
              <div className="space-y-3">
                {/* Download Guide */}
                {guide.guide && (
                  <a
                    href={guide.guide}
                    download
                    className="flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                  >
                    <span className="material-symbols-outlined text-primary">download</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-onSurface group-hover:text-primary">Descargar Guía PDF</p>
                      <p className="text-xs text-onSurfaceVariant">Instrucciones paso a paso</p>
                    </div>
                  </a>
                )}
                
                {/* YouTube Videos */}
                {guide.videos && guide.videos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-onSurfaceVariant ml-1">Videos de instalación:</p>
                    {guide.videos.map((video, idx) => (
                      <a
                        key={idx}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-surfaceContainerHigh hover:bg-surfaceContainerHighest rounded-lg transition-colors group"
                      >
                        <span className="material-symbols-outlined text-[#FF0000]">play_circle</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-onSurface group-hover:text-primary">{video.title}</p>
                          <p className="text-xs text-onSurfaceVariant">YouTube</p>
                        </div>
                        <span className="material-symbols-outlined text-onSurfaceVariant text-sm">external_link</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-outlineVariant/30">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </main>
  )
}

export default GuidesPage
