function formatDate(isoString) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString))
}

export default function MemoryWall({ memories, isLoading, error }) {
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
    <div className="grid gap-4 sm:grid-cols-2">
      {memories.map((memory) => (
        <article
          key={memory.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="whitespace-pre-wrap text-slate-800">{memory.message}</p>
          <footer className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
            <span className="font-medium text-indigo-600">{memory.name}</span>
            <time className="text-slate-400" dateTime={memory.created_at}>
              {formatDate(memory.created_at)}
            </time>
          </footer>
        </article>
      ))}
    </div>
  )
}
