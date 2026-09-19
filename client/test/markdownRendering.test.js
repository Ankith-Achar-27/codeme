import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AiMarkdown } from '../src/components/AiMarkdown.js'
import { prepareAiMarkdown } from '../src/utils/formatAiText.js'

function renderMarkdown(content) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(AiMarkdown, { content })
  )
}

test('Test 1 — Bold is rendered as <strong>', () => {
  const input = '**The key idea is to use a hash map.**'
  const html = renderMarkdown(input)
  assert.match(html, /<strong>The key idea is to use a hash map\.<\/strong>/)
})

test('Test 2 — Inline code is rendered as <code>', () => {
  const input = 'Use `nums[i]` to calculate the complement.'
  const html = renderMarkdown(input)
  assert.match(html, /<code>nums\[i\]<\/code>/)
})

test('Test 3 — Heading is rendered as <h2>', () => {
  const input = '## Key Idea'
  const html = renderMarkdown(input)
  assert.match(html, /<h2>Key Idea<\/h2>/)
})

test('Test 4 — Bullet list is rendered as <ul> with <li> items', () => {
  const input = `* Store previously seen values
* Calculate the complement
* Check whether it exists`
  const html = renderMarkdown(input)
  assert.match(html, /<ul>/)
  assert.match(html, /<li>Store previously seen values<\/li>/)
  assert.match(html, /<li>Calculate the complement<\/li>/)
  assert.match(html, /<li>Check whether it exists<\/li>/)
})

test('Test 5 — Numbered list is rendered as <ol> with <li> items', () => {
  const input = `1. Traverse the array
2. Calculate the complement
3. Return the answer`
  const html = renderMarkdown(input)
  assert.match(html, /<ol>/)
  assert.match(html, /<li>Traverse the array<\/li>/)
  assert.match(html, /<li>Calculate the complement<\/li>/)
  assert.match(html, /<li>Return the answer<\/li>/)
})

test('Test 6 — Code block is rendered as <pre><code class="language-java"> with preserved indentation', () => {
  const input = `\`\`\`java
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
}
\`\`\``
  const html = renderMarkdown(input)
  assert.match(html, /<pre><code class="language-java">/)
  assert.match(html, /int complement = target - nums\[i\];/)
})

test('Test 7 — DSA notation preserves bold and inline code', () => {
  const input = 'The time complexity is **O(n)** and the expression is `target - nums[i]`.'
  const html = renderMarkdown(input)
  assert.match(html, /<strong>O\(n\)<\/strong>/)
  assert.match(html, /<code>target - nums\[i\]<\/code>/)
})

test('Test 8 — LaTeX-style notation strips $$ and \\( \\) delimiters without displaying them literally', () => {
  const input = 'The complexity is \\(O(n^2)\\) and not $$O(n^3)$$.'
  const html = renderMarkdown(input)
  assert.ok(!html.includes('\\('))
  assert.ok(!html.includes('\\)'))
  assert.ok(!html.includes('$$'))
  assert.match(html, /O\(n²\)/)
  assert.match(html, /O\(n³\)/)
})

test('Test 9 — Single $ math delimiter strips delimiters for DSA expressions', () => {
  const input = 'Consider $O(n)$ time and $nums[i]$.'
  const html = renderMarkdown(input)
  assert.ok(!html.includes('$'))
  assert.match(html, /O\(n\)/)
  assert.match(html, /nums\[i\]/)
})

test('Test 10 — Legitimate currency symbols are preserved', () => {
  const input = 'The subscription costs $50 per year.'
  const html = renderMarkdown(input)
  assert.match(html, /\$50/)
})

test('Test 11 — prepareAiMarkdown protects code blocks and inline code containing dollar signs', () => {
  const input = `Here is code:
\`\`\`bash
echo $VAR
\`\`\`
and \`$VAR\`.`
  const prepared = prepareAiMarkdown(input)
  assert.match(prepared, /echo \$VAR/)
  assert.match(prepared, /`\$VAR`/)
})
