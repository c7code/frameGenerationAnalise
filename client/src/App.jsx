import React, { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [intervalSec, setIntervalSec] = useState(1)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setImages([])
    if (!file) {
      setError('Selecione um vídeo')
      return
    }
    const form = new FormData()
    form.append('video', file)
    form.append('intervalSec', String(intervalSec))
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Falha ao processar vídeo')
      const data = await res.json()
      setImages(data.frames || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Extrair fotos de frames</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block text-sm font-medium mb-1">Vídeo</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Intervalo (segundos)</label>
            <input
              type="number"
              min="1"
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              className="w-32 rounded border px-2 py-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Enviar'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        {!!images.length && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`frame-${i}`} className="w-full h-auto rounded border" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App