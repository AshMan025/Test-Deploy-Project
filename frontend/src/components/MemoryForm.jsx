import { useState } from 'react'

export default function MemoryForm({ onSubmit, isSubmitting }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault() 

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedMessage) {
      setValidationError('Name and message are required.')
      return
    }

    setValidationError('')
    await onSubmit({ name: trimmedName, message: trimmedMessage })
    setName('')
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Leave a memory</h2>
      <p className="mt-1 text-sm text-slate-500">
        Share a note on the wall for everyone to see.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Bob"
            maxLength={100}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write something memorable..."
            rows={4}
            disabled={isSubmitting}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>
      </div>

      {validationError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isSubmitting ? 'Posting...' : 'Post to wall'}
      </button>
    </form>
  )
}
