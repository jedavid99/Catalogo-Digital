const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container transition-all"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`
            w-10 h-10 rounded-lg font-medium transition-all
            ${currentPage === page 
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
              : 'bg-surface-container-high border border-outline-variant text-on-surface hover:bg-surface-container'
            }
          `}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container transition-all"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  )
}

export default Pagination
