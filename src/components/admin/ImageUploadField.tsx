'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploadFieldProps {
  value: string
  onChange: (url: string) => void
  label?: string
  folder?: string
  hint?: string
  inline?: boolean
}

export function ImageUploadField({
  value,
  onChange,
  label,
  folder = 'uploads',
  hint,
  inline = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('public-assets')
        .upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(path)
      onChange(publicUrl)
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  // Inline mode: just a small upload button, no drag zone, no label
  if (inline) {
    return (
      <>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload logo image"
          className="flex items-center gap-1.5 flex-shrink-0 bg-gray-700 hover:bg-gray-600 border border-white/10 text-gray-300 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </>
    )
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
          {label}
        </label>
      )}

      {value ? (
        /* Preview */
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${dragOver
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-white/10 bg-gray-800/50 hover:border-violet-500/50 hover:bg-violet-500/5'
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              <span className="text-xs text-gray-500">Uploading…</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  <span className="text-violet-400 font-semibold">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-600 mt-0.5">PNG, JPG, WebP — max 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-gray-600 mt-1.5">{hint}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
