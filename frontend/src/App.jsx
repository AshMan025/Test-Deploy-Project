import { useCallback, useEffect, useState } from 'react'
import { createMemory, fetchMemories } from './api/memories'
import MemoryForm from './components/MemoryForm'
import MemoryWall from './components/MemoryWall'

export default function App() {
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const loadMemories = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const data = await fetchMemories()
      setMemories(data)
    } catch (error) {
      setLoadError(error.message || 'Failed to load memories.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMemories()
  }, [loadMemories])

  const handleSubmit = async (payload) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const created = await createMemory(payload)
      setMemories((current) => [created, ...current])
    } catch (error) {
      setSubmitError(error.message || 'Failed to post memory.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Memory Wall
          </h1>
          <p className="mt-2 text-slate-600">
            A simple shared space for notes and moments.
          </p>
        </header>

        <section className="mb-8">
          <MemoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          {submitError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent memories</h2>
            {!isLoading && !loadError && (
              <span className="text-sm text-slate-500">
                {memories.length} {memories.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>
          <MemoryWall memories={memories} isLoading={isLoading} error={loadError} />
        </section>
      </main>
    </div>
  )
}
