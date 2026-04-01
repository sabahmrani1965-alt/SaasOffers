'use client'

import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/client'
import {
  Heading2, Bold, List, Link, ImagePlus, Eye, EyeOff, Loader2,
} from 'lucide-react'

const DEFAULT_TEMPLATE = `# Offer Overview

## Key Benefits

- Save money on your SaaS stack
- Easy to use and set up
- Perfect for early-stage startups

## What's Included

- Feature 1
- Feature 2
- Feature 3

## Who is this for?

Explain who benefits most from this tool — founders, developers, marketers, etc.

## How to Claim

1. Sign up at the provider's website
2. Apply the promo code or click the special link
3. Enjoy your credits

## Why Choose This Tool?

Explain the core value proposition and what makes this deal worth claiming.

👉 Get the deal here: [Insert link]
`

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Insert or wrap text at cursor position
  function insert(before: string, after = '', placeholder = '') {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end) || placeholder
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    // Restore focus + cursor after React re-render
    requestAnimationFrame(() => {
      ta.focus()
      const cursor = start + before.length + selected.length + after.length
      ta.setSelectionRange(cursor, cursor)
    })
  }

  function insertLine(prefix: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    // Find start of current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
    })
  }

  function handleLink() {
    const ta = textareaRef.current
    if (!ta) return
    const selected = value.slice(ta.selectionStart, ta.selectionEnd)
    const text = selected || 'link text'
    insert('[' + text + '](', ')', 'link text')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `offer-images/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('public-assets').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('public-assets').getPublicUrl(path)
      insert(`![${file.name}](${publicUrl})`)
    } catch (err: any) {
      alert('Image upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const toolbarBtn = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all'

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-white/10 bg-gray-900 flex-wrap">
        <button type="button" onClick={() => insertLine('## ')} className={toolbarBtn} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" /> H2
        </button>
        <button type="button" onClick={() => insert('**', '**', 'bold text')} className={toolbarBtn} title="Bold">
          <Bold className="w-3.5 h-3.5" /> Bold
        </button>
        <button type="button" onClick={() => insertLine('- ')} className={toolbarBtn} title="List item">
          <List className="w-3.5 h-3.5" /> List
        </button>
        <button type="button" onClick={handleLink} className={toolbarBtn} title="Link">
          <Link className="w-3.5 h-3.5" /> Link
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={toolbarBtn}
          title="Upload image"
        >
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <ImagePlus className="w-3.5 h-3.5" />}
          Image
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setPreview(p => !p)}
            className={`${toolbarBtn} ${preview ? 'text-violet-400 bg-violet-500/10' : ''}`}
          >
            {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'Hide preview' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor + optional preview */}
      <div className={`grid ${preview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write a detailed description of the offer…"
          className="w-full min-h-[420px] bg-gray-950 text-gray-200 placeholder-gray-600 text-sm leading-7 font-mono resize-y px-4 py-4 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-violet-500/40"
          style={{ caretColor: '#a78bfa' }}
        />

        {/* Preview */}
        {preview && (
          <div className="border-l border-white/10 min-h-[420px] overflow-y-auto bg-gray-900 px-5 py-4">
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-xl prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-300 prose-li:leading-relaxed
              prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-code:text-violet-300
              prose-hr:border-white/10">
              {value.trim()
                ? <ReactMarkdown>{value}</ReactMarkdown>
                : <p className="text-gray-600 italic text-xs">Preview will appear here…</p>
              }
            </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-white/5 bg-gray-900 flex items-center justify-between">
        <span className="text-xs text-gray-600">Markdown supported — **bold**, ## heading, - list, [text](url)</span>
        <span className="text-xs text-gray-700">{value.length} chars</span>
      </div>
    </div>
  )
}

export { DEFAULT_TEMPLATE }
