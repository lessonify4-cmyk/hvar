'use client'

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { MAX_UPLOAD_SIZE, ALLOWED_IMAGE_TYPES } from '@/lib/constants'
import type { UploadResponse } from '@/types'

interface ImageUploadProps {
  value?: string
  publicId?: string
  onChange: (url: string, publicId: string) => void
  onRemove?: () => void
  label?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Event Image',
  className,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed.')
        return
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        setError('Image must be smaller than 5MB.')
        return
      }

      setUploading(true)
      setProgress(10)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const interval = setInterval(() => {
          setProgress((p) => Math.min(p + 15, 85))
        }, 300)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        clearInterval(interval)
        setProgress(100)

        if (!res.ok) throw new Error('Upload failed')
        const data: UploadResponse = await res.json()
        onChange(data.url, data.publicId)
      } catch (err) {
        setError('Upload failed. Please try again.')
        console.error(err)
      } finally {
        setUploading(false)
        setTimeout(() => setProgress(0), 500)
      }
    },
    [onChange]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-semibold text-ink">{label}</span>

      {value ? (
        <div className="relative rounded-card overflow-hidden border border-border">
          <img src={value} alt="Event preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn btn-secondary btn-sm bg-white/90"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn('upload-zone', dragging && 'dragging')}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Click or drag to upload image"
          onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
        >
          <div className="text-4xl mb-3" aria-hidden="true">📸</div>
          <p className="text-sm font-semibold text-ink mb-1">
            {dragging ? 'Drop to upload' : 'Click or drag image here'}
          </p>
          <p className="text-xs text-muted">JPG, PNG, WebP — max 5MB</p>
        </div>
      )}

      {uploading && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="text-xs text-coral font-medium" role="alert">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
        aria-label="Upload image file"
      />
    </div>
  )
}
