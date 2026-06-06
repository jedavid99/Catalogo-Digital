import { useApp } from '../contexts/AppContext'

const GoogleSheetsBanner = () => {
  const { loading, error, loadFromDatabase, products } = useApp()

  if (loading) {
    return (
      <div className="bg-primary/10 border-b border-primary/30 px-gutter py-3 flex items-center justify-center gap-3 text-sm text-on-surface">
        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
        Conectando con Google Sheets…
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error/10 border-b border-error/30 px-gutter py-3 flex flex-wrap items-center justify-center gap-3 text-sm text-error">
        <span className="material-symbols-outlined">cloud_off</span>
        <span>{error}</span>
        <button
          type="button"
          onClick={() => loadFromDatabase()}
          className="px-4 py-1.5 rounded-lg bg-error/20 hover:bg-error/30 font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (products.length > 0) {
    return (
      <div className="bg-neonGreen/5 border-b border-neonGreen/20 px-gutter py-2 flex items-center justify-center gap-2 text-xs text-neonGreen">
        <span className="material-symbols-outlined text-sm">cloud_done</span>
        {products.length} producto{products.length !== 1 ? 's' : ''} desde Google Sheets
      </div>
    )
  }

  return null
}

export default GoogleSheetsBanner
