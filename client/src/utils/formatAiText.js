/**
 * Safely prepares AI-generated Markdown for rendering with react-markdown.
 * Normalizes raw LaTeX display/inline math delimiters ($$, \[\], \(\), $math$)
 * and converts common LaTeX math symbols without destroying Markdown elements
 * like bold (**), italic (*), headings (#), lists (-, 1.), inline code (`),
 * or fenced code blocks (```).
 *
 * @param {string} raw - The raw text from the AI service.
 * @returns {string} - Clean Markdown ready for ReactMarkdown.
 */
export function prepareAiMarkdown(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw

  // 1. Protect fenced code blocks (```...```) and inline code (`...`)
  // so that anything inside code remains completely untouched.
  const codeBlocks = []
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const token = `__AI_CODE_BLOCK_${codeBlocks.length}__`
    codeBlocks.push(match)
    return token
  })

  const inlineCodes = []
  text = text.replace(/`[^`\n]+`/g, (match) => {
    const token = `__AI_INLINE_CODE_${inlineCodes.length}__`
    inlineCodes.push(match)
    return token
  })

  // 2. Normalize LaTeX display math: \[ ... \] and $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$1')
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1')

  // 3. Normalize LaTeX inline math: \( ... \)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$1')

  // 4. Normalize paired $...$ math delimiters
  // Targets paired $ around typical math/code symbols (letters, digits, brackets, operators, etc.)
  // without capturing lone currency symbols like $50 or multi-line blocks.
  text = text.replace(/(^|[^$\w])\$([^$\n\r]+?)\$(?=[^$\w]|$)/g, '$1$2')

  // 5. Convert common LaTeX mathematical commands to clean DSA notation
  text = text.replace(/\\mathcal\{([A-Za-z])\}/g, '$1')
  text = text.replace(/\\text\{([^}]+)\}/g, '$1')
  text = text.replace(/\\mathrm\{([^}]+)\}/g, '$1')
  text = text.replace(/\\mathbf\{([^}]+)\}/g, '$1')
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2')
  text = text.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
  text = text.replace(/\\le(q)?\b/g, '<=')
  text = text.replace(/\\ge(q)?\b/g, '>=')
  text = text.replace(/\\neq\b/g, '!=')
  text = text.replace(/\\times\b/g, '*')
  text = text.replace(/\\cdot\b/g, '*')
  text = text.replace(/\\approx\b/g, '~')
  text = text.replace(/\\(?:c|l)?dots\b/g, '...')

  // 6. Convert O(n^2), O(n^3) or ^2, ^3 superscripts in math contexts
  text = text.replace(/\^2\b/g, '²')
  text = text.replace(/\^3\b/g, '³')

  // 7. Clean up unnecessary LaTeX escaping before parentheses or brackets: e.g. \( or \[
  text = text.replace(/\\([()[\]{}])/g, '$1')

  // 8. Restore inline code and code blocks exactly as they were
  text = text.replace(/__AI_INLINE_CODE_(\d+)__/g, (_, idx) => inlineCodes[Number(idx)])
  text = text.replace(/__AI_CODE_BLOCK_(\d+)__/g, (_, idx) => codeBlocks[Number(idx)])

  return text.trim()
}

/**
 * Normalizes AI-generated text (hints, explanations) into clean, readable plain text.
 * Preserved for backwards compatibility with existing backend unit tests.
 *
 * @param {string} raw - The raw text from the AI service.
 * @returns {string} - Clean, readable plain text.
 */
export function formatAiText(raw) {
  if (!raw || typeof raw !== 'string') return ''

  let text = raw

  // 1. Remove LaTeX display & inline math delimiters
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$1')
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$1')
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1')
  text = text.replace(/\$([^$\n]+)\$/g, '$1')

  // 2. Convert common LaTeX commands into plain text
  text = text.replace(/\\mathcal\{([A-Za-z])\}/g, '$1')
  text = text.replace(/\\text\{([^}]+)\}/g, '$1')
  text = text.replace(/\\mathrm\{([^}]+)\}/g, '$1')
  text = text.replace(/\\mathbf\{([^}]+)\}/g, '$1')
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2')
  text = text.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
  text = text.replace(/\\le(q)?\b/g, '<=')
  text = text.replace(/\\ge(q)?\b/g, '>=')
  text = text.replace(/\\neq\b/g, '!=')
  text = text.replace(/\\times\b/g, '*')
  text = text.replace(/\\cdot\b/g, '*')
  text = text.replace(/\\approx\b/g, '~')
  text = text.replace(/\\(?:c|l)?dots\b/g, '...')

  // 3. Remove Markdown headings (#, ##, ###) at the beginning of lines
  text = text.replace(/^#{1,6}\s+/gm, '')

  // 4. Remove bold and italic emphasis markers (**text**, __text__)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')

  // 5. Remove code backticks (`code` -> code)
  text = text.replace(/`([^`\n]+)`/g, '$1')

  // 6. Clean up any leftover escape slashes before brackets or parentheses
  text = text.replace(/\\([()[\]{}])/g, '$1')

  return text.trim()
}

/**
 * Splits normalized AI text into paragraphs for clean, structured rendering.
 *
 * @param {string} raw - The raw text from the AI service.
 * @returns {string[]} - Array of paragraph strings.
 */
export function formatAiParagraphs(raw) {
  const cleaned = formatAiText(raw)
  if (!cleaned) return []
  return cleaned.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

