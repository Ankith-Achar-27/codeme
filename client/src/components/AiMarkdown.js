import React from 'react'
import Markdown from 'react-markdown'
import { prepareAiMarkdown } from '../utils/formatAiText.js'

/**
 * Safely renders AI-generated markdown using react-markdown.
 * Normalizes math and LaTeX delimiters before rendering to ensure
 * clean, readable DSA notation without breaking Markdown features like
 * bold, lists, headings, and code blocks.
 *
 * @param {{ content: string, className?: string }} props
 */
export function AiMarkdown({ content, className = '' }) {
  if (!content || typeof content !== 'string') return null

  const prepared = prepareAiMarkdown(content)

  return React.createElement(
    'div',
    { className: `ai-markdown ${className}`.trim() },
    React.createElement(Markdown, null, prepared)
  )
}

export default AiMarkdown
