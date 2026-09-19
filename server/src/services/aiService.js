const DEFAULT_MODEL = 'gemini-3.6-flash'
const DEFAULT_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'


export function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim())
}

export function buildAllHintsPrompt(problem) {
  const systemMessage = `You are a patient DSA tutor, not a solution generator.
Your job is to generate three progressive hints that guide the learner step-by-step through solving the problem without revealing the complete solution.

Hint Progression Rules:
- Hint 1 (Conceptual Nudge): Give only a small conceptual clue or ask a thoughtful guiding question to prompt their intuition about the relevant pattern or idea. Do NOT name the complete algorithm. Do NOT provide implementation details, code, or pseudocode.
- Hint 2 (Strategy Guidance): Provide a stronger directional strategy. Explain what state, property, or data structure to keep track of, but do not provide a full algorithm. No complete code or pseudocode.
- Hint 3 (Implementation Direction): Provide implementation-level guidance (key steps, transformations, or data structure mechanics). Do NOT provide complete executable code. Do NOT dump the final algorithm.

Pedagogical Rules:
- Never reveal the complete solution.
- Never provide complete executable code.
- Do not repeat the problem statement.
- Keep each hint concise (one or two short paragraphs or a few bullet points).
- Do not use markdown heading syntax (# or ##) inside hints.
- Do not output LaTeX ($ or $$). Use readable notation such as k, target, nums[i], O(n), etc.
- Do not include introductory preamble, filler, or closing pleasantries (e.g. do NOT say "Here are your hints").
- You MUST respond with a single, valid JSON object containing exactly three string keys: "hint1", "hint2", and "hint3".

Expected JSON format:
{
  "hint1": "Conceptual hint text...",
  "hint2": "Strategy hint text...",
  "hint3": "Implementation direction hint text..."
}`

  const userMessage = `Problem Title: ${problem.title || 'Unknown'}
Difficulty: ${problem.difficulty || 'Unspecified'}
Topics: ${(problem.topics || []).join(', ')}
Concepts: ${(problem.concepts || []).join(', ')}
Description: ${problem.description || ''}
Examples: ${(problem.examples || []).map((ex) => `Input: ${ex.input} -> Output: ${ex.output}`).join('; ')}

Generate all three progressive hints as strict JSON with keys "hint1", "hint2", and "hint3".`

  return { systemMessage, userMessage }
}

export function buildHintPrompt(problem, hintLevel) {
  const levelInstructions = {
    1: `Provide Level 1 Hint (Conceptual Direction) - Conceptual Nudge:
- Help the learner identify the relevant pattern, observation, or core idea.
- Ask a thoughtful guiding question when appropriate to prompt their intuition.
- Do NOT name the complete algorithm if doing so gives away the solution.
- Do NOT provide implementation details.
- Do NOT give pseudocode or code.`,
    2: `Provide Level 2 Hint (Strategy Guidance) - Strategic Guidance:
- Narrow the possible approach.
- Explain what kind of state, information, or data structure the learner should consider keeping track of.
- The learner should still need to figure out the exact algorithm themselves.
- Do NOT provide a complete step-by-step implementation.
- Do NOT provide pseudocode or code.`,
    3: `Provide Level 3 Hint (Implementation Guidance) - Implementation Direction:
- Give stronger guidance toward the intended approach.
- It is acceptable to mention the relevant data structure or algorithm.
- Explain the key operations or transformations the learner needs to perform.
- Still do NOT provide complete code.
- Do NOT provide copy-paste pseudocode that essentially solves the problem.
- Leave meaningful implementation decisions for the learner to construct.`,
  }

  const instruction = levelInstructions[hintLevel] || levelInstructions[1]

  const systemMessage = `You are a patient DSA tutor, not a solution generator.
Your job is to help the learner make the next reasoning step themselves.

Pedagogical Rules:
- Never reveal the complete solution.
- Never provide complete code.
- Do not give pseudocode unless the requested hint level explicitly allows a tiny structural outline, and even then do not make it directly implementable.
- Do not repeat the problem statement.
- Keep the hint concise: prefer one or two short paragraphs or a few short bullet points.
- Use natural language suitable for a student.
- Do not use unnecessary headings inside the hint.
- Do not output Markdown heading syntax such as # or ##.
- Never produce raw formatting artifacts such as "#first", "###", or stray labels.
- Do not output LaTeX ($ or $$). Use plain text notation such as k, target, nums[i], O(n), etc.
- Do not use phrases like "Here is the solution" or "The answer is".
- Do not include conversational preamble or filler (do NOT say "Here is the hint" or "Here is the guidance for..."). Jump straight into the pedagogical guidance.
- The hints must become progressively more specific, but each level should still require thinking from the learner.`

  const userMessage = `Problem Title: ${problem.title || 'Unknown'}
Difficulty: ${problem.difficulty || 'Unspecified'}
Topics: ${(problem.topics || []).join(', ')}
Concepts: ${(problem.concepts || []).join(', ')}
Description: ${problem.description || ''}
Examples: ${(problem.examples || []).map((ex) => `Input: ${ex.input} -> Output: ${ex.output}`).join('; ')}

Requested Task:
${instruction}

Respond with the pedagogical hint directly. Keep it natural, clean, and concise without introductory filler, markdown headings, or LaTeX.`

  return { systemMessage, userMessage }
}

export function normalizeHintText(rawText) {
  if (!rawText || typeof rawText !== 'string') return ''

  let text = rawText.trim()

  // 1. If wrapped in JSON format { "hint": "..." }, extract the hint value
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text)
      if (parsed.hint && typeof parsed.hint === 'string') {
        text = parsed.hint.trim()
      }
    } catch {
      // Continue with text normalization if not valid JSON
    }
  }

  // 2. Remove surrounding quotation marks if the entire text is quoted
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1).trim()
  }

  // 3. Remove conversational preamble like "Here is your Level 3 Implementation Guidance for 3Sum:"
  text = text.replace(/^(?:here\s+(?:is|are)\s+(?:the|a|an|your)?\s*[\w\s\*\-\.\(\)]*?(?:guidance|hint|direction|nudge|advice|breakdown|outline)[^:\n]*[:\n]+)/i, '')
  text = text.replace(/^(?:(?:level|hint)\s*\d+[^:\n]*[:\n]+)/i, '')

  // 4. Remove markdown heading artifacts like "#first", "## Hint 1", "### Level 1", etc.
  text = text.replace(/^#{1,6}\s*(?:first|second|third|level\s*\d*[:\-]?|hint\s*\d*[:\-]?\s*)?/gim, '')
  text = text.replace(/^#{1,6}\s+/gm, '')

  // 5. Remove LaTeX math delimiters $...$ or $$...$$
  text = text.replace(/\$\$([^$]+)\$\$/g, '$1')
  text = text.replace(/\$([^$\n]+)\$/g, '$1')

  // 5. Clean up stray escapes before brackets or parentheses
  text = text.replace(/\\([()[\]{}])/g, '$1')

  // 6. Normalize multiple blank lines to clean double newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim()

  return text
}

export function buildExplanationPrompt(problem) {
  const systemMessage = `You are CodeMe's AI Learning Assistant for Data Structures & Algorithms.
Your goal is to teach the conceptual solution to a problem in a beginner-friendly, structured way.
Rules:
- Teach the concept clearly without assuming advanced prerequisite jargon.
- Explain WHY the approach works and HOW the core data structures help.
- Do not just dump executable code; focus on understanding the approach.
- Include structured sections:
  1. Core Idea
  2. Relevant DSA Concept
  3. Why This Approach Works
  4. Time Complexity (with plain-language rationale)
  5. Space Complexity (with plain-language rationale)`

  const userMessage = `Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}
Topics: ${(problem.topics || []).join(', ')}
Concepts: ${(problem.concepts || []).join(', ')}
Description: ${problem.description}
Examples: ${(problem.examples || []).map((ex) => `Input: ${ex.input} -> Output: ${ex.output}`).join('; ')}

Provide a beginner-friendly, pedagogical concept explanation for this problem following the requested sections.`

  return { systemMessage, userMessage }
}

function getGeminiEndpoint(model) {
  const customUrl = process.env.AI_API_URL?.trim()
  if (customUrl) {
    return customUrl.includes('{model}') ? customUrl.replace('{model}', model) : customUrl
  }
  const baseUrl = process.env.GEMINI_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  return `${baseUrl}/models/${model}:generateContent`
}

async function callGeminiApi({ systemMessage, userMessage, fetchFn = globalThis.fetch }) {
  const apiKey = process.env.AI_API_KEY?.trim()
  if (!apiKey) {
    const error = new Error('AI assistance is not configured. Please set AI_API_KEY on the server.')
    error.status = 503
    error.code = 'AI_NOT_CONFIGURED'
    throw error
  }

  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODEL
  const endpoint = getGeminiEndpoint(model)

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  }

  if (systemMessage) {
    payload.systemInstruction = {
      parts: [{ text: systemMessage }],
    }
  }

  const response = await fetchFn(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData?.error?.message || `AI service responded with status ${response.status}`
    const error = new Error(`AI Provider Error: ${errorMessage}`)
    error.status = 502
    error.code = 'AI_PROVIDER_ERROR'
    throw error
  }

  const data = await response.json().catch(() => ({}))
  const candidate = data?.candidates?.[0]
  const content = candidate?.content?.parts?.map((p) => p.text).filter(Boolean).join('')

  if (!content) {
    const finishReason = candidate?.finishReason
    const error = new Error(finishReason ? `AI response stopped (${finishReason}).` : 'The AI service returned an empty response.')
    error.status = 502
    error.code = 'AI_EMPTY_RESPONSE'
    throw error
  }

  return content.trim()
}

export function parseAiHintsResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    const error = new Error('The AI service returned an empty response.')
    error.status = 502
    error.code = 'AI_EMPTY_RESPONSE'
    throw error
  }

  let text = rawText.trim()

  // 1. Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  }

  // 2. Locate the outermost JSON object if there is preamble or suffix text
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    text = jsonMatch[0]
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    const error = new Error('The AI service returned an invalid response format.')
    error.status = 502
    error.code = 'AI_INVALID_FORMAT'
    throw error
  }

  const hint1 = parsed.hint1 || parsed.hint_1 || parsed['Hint 1']
  const hint2 = parsed.hint2 || parsed.hint_2 || parsed['Hint 2']
  const hint3 = parsed.hint3 || parsed.hint_3 || parsed['Hint 3']

  if (!hint1 || !hint2 || !hint3 || typeof hint1 !== 'string' || typeof hint2 !== 'string' || typeof hint3 !== 'string') {
    const error = new Error('The AI service response was incomplete.')
    error.status = 502
    error.code = 'AI_INCOMPLETE_RESPONSE'
    throw error
  }

  return {
    hint1: normalizeHintText(hint1),
    hint2: normalizeHintText(hint2),
    hint3: normalizeHintText(hint3),
  }
}

export async function generateAiHints(problem, { fetchFn } = {}) {
  const { systemMessage, userMessage } = buildAllHintsPrompt(problem)
  const rawText = await callGeminiApi({ systemMessage, userMessage, fetchFn })
  return parseAiHintsResponse(rawText)
}

export async function generateAiHint(problem, hintLevel = 1, { fetchFn } = {}) {
  const level = Number.parseInt(hintLevel, 10)
  if (![1, 2, 3].includes(level)) {
    const error = new Error('hintLevel must be an integer between 1 and 3.')
    error.status = 400
    throw error
  }

  const hints = await generateAiHints(problem, { fetchFn })
  return {
    ...hints,
    hint: hints[`hint${level}`],
    level,
  }
}

export async function generateAiExplanation(problem, { fetchFn } = {}) {
  const { systemMessage, userMessage } = buildExplanationPrompt(problem)
  const explanationText = await callGeminiApi({ systemMessage, userMessage, fetchFn })
  return {
    explanation: explanationText,
  }
}
