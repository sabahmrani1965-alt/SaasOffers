'use client'

import ReactMarkdown from 'react-markdown'

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold text-gray-900 mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 text-base leading-7 mb-3">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-4 pl-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 mb-4 pl-1 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-gray-700 text-base leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-2.5" />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        hr: () => <hr className="border-gray-100 my-6" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left text-xs font-semibold text-gray-700 uppercase tracking-wider px-4 py-2.5 border border-gray-100">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 border border-gray-100 text-gray-700 text-sm">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="even:bg-gray-50/50">{children}</tr>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-violet-200 pl-4 italic text-gray-600 mb-4">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-violet-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 text-violet-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
