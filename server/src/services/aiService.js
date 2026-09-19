const DEFAULT_API_URL = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = 'gpt-4o-mini'

export function isAiConfigured() {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim())
}

export function buildHintPrompt(problem, hintLevel) {
  const levelInstructions = {
    1: 'Provide Level 1 Hint (Conceptual Direction): Guide the learner by highlighting the fundamental observation or pattern in the problem. Point towards the right type of data structure or problem category without naming the exact step-by-step algorithm or writing code.',
    2: 'Provide Level 2 Hint (Strategy Guidance): Guide the learner with a more specific high-level strategy and logical flow. Describe how the data structure or technique should be utilized step-by-step, but do not provide full pseudocode or a complete solution.',
    3: 'Provide Level 3 Hint (Implementation Guidance): Give detailed algorithmic direction or pseudocode-level guidance for the key operations and edge cases. Do NOT provide complete copy-paste working code.',
  }

  const instruction = levelInstructions[hintLevel] || levelInstructions[1]

  const systemMessage = `You are CodeMe's AI Learning Assistant for Data Structures & Algorithms.
Your goal is to guide learners to discover the solution on their own through progressive pedagogical hints.
Rules:
- Stay strictly focused on the provided DSA problem.
- Do NOT output full working source code or a complete solution.
- Adhere strictly to the requested hint level depth.
- Keep the explanation encouraging, concise, and clear (2 to 4 sentences).`

  const userMessage = `Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}
Topics: ${(problem.topics || []).join(', ')}
Concepts: ${(problem.concepts || []).join(', ')}
Description: ${problem.description}
Examples: ${(problem.examples || []).map((ex) => `Input: ${ex.input} -> Output: ${ex.output}`).join('; ')}

Requested Task:
${instruction}`

  return { systemMessage, userMessage }
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

async function callOpenAiCompatibleApi({ systemMessage, userMessage, fetchFn = globalThis.fetch }) {
  const apiKey = process.env.AI_API_KEY?.trim()
  if (!apiKey) {
    const error = new Error('AI assistance is not configured. Please set AI_API_KEY on the server.')
    error.status = 503
    error.code = 'AI_NOT_CONFIGURED'
    throw error
  }

  const apiUrl = process.env.AI_API_URL || DEFAULT_API_URL
  const model = process.env.AI_MODEL || DEFAULT_MODEL

  const response = await fetchFn(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 800,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData?.error?.message || `AI service responded with status ${response.status}`
    const error = new Error(`AI Provider Error: ${errorMessage}`)
    error.status = 502
    error.code = 'AI_PROVIDER_ERROR'
    throw error
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    const error = new Error('The AI service returned an empty response.')
    error.status = 502
    error.code = 'AI_EMPTY_RESPONSE'
    throw error
  }

  return content.trim()
}

export async function generateAiHint(problem, hintLevel, { fetchFn } = {}) {
  const level = Number.parseInt(hintLevel, 10)
  if (![1, 2, 3].includes(level)) {
    const error = new Error('hintLevel must be an integer between 1 and 3.')
    error.status = 400
    throw error
  }

  const { systemMessage, userMessage } = buildHintPrompt(problem, level)
  const hintText = await callOpenAiCompatibleApi({ systemMessage, userMessage, fetchFn })
  return {
    hint: hintText,
    level,
  }
}

export async function generateAiExplanation(problem, { fetchFn } = {}) {
  const { systemMessage, userMessage } = buildExplanationPrompt(problem)
  const explanationText = await callOpenAiCompatibleApi({ systemMessage, userMessage, fetchFn })
  return {
    explanation: explanationText,
  }
}
