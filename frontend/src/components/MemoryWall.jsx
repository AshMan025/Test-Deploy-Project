import { useState, useRef, useEffect } from 'react'

function formatDate(isoString) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString))
}

function getGlimpse(text, maxLength = 180) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function MemoryWall({ memories, isLoading, error }) {
  const [selectedMemory, setSelectedMemory] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (selectedMemory) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [selectedMemory])

  const handleClose = () => {
    setSelectedMemory(null)
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">Loading memories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm"
        role="alert"
      >
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-base font-medium text-slate-700">The wall is empty</p>
        <p className="mt-1 text-sm text-slate-500">
          Be the first to leave a memory.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {memories.map((memory) => {
          const hasGlimpse = memory.message.length > 180
          return (
            <article
              key={memory.id}
              onClick={() => setSelectedMemory(memory)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedMemory(memory)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View full details of memory: ${memory.title}`}
              className="w-full text-left rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <h3 className="text-lg font-bold text-slate-900">{memory.title || 'Untitled'}</h3>
              <p className="mt-2 text-slate-600 whitespace-pre-wrap">
                {getGlimpse(memory.message)}
              </p>
              <footer className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-indigo-600">{memory.name}</span>
                  {hasGlimpse && (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Click to read more
                    </span>
                  )}
                </div>
                <time className="text-slate-400" dateTime={memory.created_at}>
                  {formatDate(memory.created_at)}
                </time>
              </footer>
            </article>
          )
        })}
      </div>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        className="fixed inset-0 m-auto max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm overflow-hidden"
      >
        {selectedMemory && (
          <div className="flex flex-col h-full max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900 pr-8">
                {selectedMemory.title || 'Untitled'}
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-800">
                {selectedMemory.message}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm">
              <div>
                <span className="text-slate-500">Left by </span>
                <span className="font-semibold text-indigo-600">
                  {selectedMemory.name}
                </span>
              </div>
              <time className="text-slate-400" dateTime={selectedMemory.created_at}>
                {formatDate(selectedMemory.created_at)}
              </time>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
