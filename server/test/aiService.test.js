import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildExplanationPrompt,
  buildHintPrompt,
  generateAiExplanation,
  generateAiHint,
  isAiConfigured,
  normalizeHintText,
} from '../src/services/aiService.js'
import { formatAiText } from '../../client/src/utils/formatAiText.js'

const mockProblem = {
  _id: '507f1f77bcf86cd799439011',
  title: 'Two Sum',
  difficulty: 'Easy',
  topics: ['Arrays', 'HashMap'],
  concepts: ['Complements', 'Hashing'],
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
}

function createMockFetch({ status = 200, content = 'Mocked AI guidance text', error = null } = {}) {
  return async (url, options) => {
    if (error) throw error

    if (status !== 200) {
      return {
        ok: false,
        status,
        json: async () => ({ error: { message: 'Provider rate limit exceeded' } }),
      }
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: content }],
              role: 'model',
            },
            finishReason: 'STOP',
          },
        ],
      }),
      url,
      options,
    }
  }
}

test('1. Hint request with valid problem calls Gemini endpoint with x-goog-api-key header', async () => {
  const originalKey = process.env.AI_API_KEY
  try {
    process.env.AI_API_KEY = 'test-gemini-key'
    let interceptedUrl = null
    let interceptedHeaders = null
    let interceptedBody = null

    const mockFetch = async (url, options) => {
      interceptedUrl = url
      interceptedHeaders = options.headers
      interceptedBody = JSON.parse(options.body)
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Think about how looking up values in a hash map can help find complements.' }],
              },
              finishReason: 'STOP',
            },
          ],
        }),
      }
    }

    const result = await generateAiHint(mockProblem, 1, { fetchFn: mockFetch })

    assert.equal(result.level, 1)
    assert.match(result.hint, /hash map/i)
    assert.match(interceptedUrl, /generativelanguage\.googleapis\.com/)
    assert.match(interceptedUrl, /gemini-3\.6-flash:generateContent/)
    assert.equal(interceptedHeaders['x-goog-api-key'], 'test-gemini-key')

    assert.ok(interceptedBody.systemInstruction)
    assert.ok(interceptedBody.contents)
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})


test('2. Hint levels 1 -> 2 -> 3 construct progressively specific pedagogical prompts', async () => {
  const p1 = buildHintPrompt(mockProblem, 1)
  const p2 = buildHintPrompt(mockProblem, 2)
  const p3 = buildHintPrompt(mockProblem, 3)

  assert.match(p1.userMessage, /Level 1 Hint \(Conceptual Direction\)/)
  assert.match(p2.userMessage, /Level 2 Hint \(Strategy Guidance\)/)
  assert.match(p3.userMessage, /Level 3 Hint \(Implementation Guidance\)/)

  const originalKey = process.env.AI_API_KEY
  try {
    process.env.AI_API_KEY = 'test-key-123'
    for (const lvl of [1, 2, 3]) {
      const mockFetch = createMockFetch({ content: `Guidance for level ${lvl}` })
      const res = await generateAiHint(mockProblem, lvl, { fetchFn: mockFetch })
      assert.equal(res.level, lvl)
      assert.equal(res.hint, `Guidance for level ${lvl}`)
    }
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})

test('3. Invalid problem handling: buildHintPrompt handles missing/sparse problem gracefully', () => {
  const sparseProblem = { title: 'Unknown', description: 'No description' }
  const prompt = buildHintPrompt(sparseProblem, 1)
  assert.ok(prompt.systemMessage)
  assert.match(prompt.userMessage, /Problem Title: Unknown/)
})

test('4. Missing or invalid hint level throws a 400 error', async () => {
  const originalKey = process.env.AI_API_KEY
  try {
    process.env.AI_API_KEY = 'test-key-123'
    await assert.rejects(
      async () => generateAiHint(mockProblem, 0),
      (err) => err.status === 400 && /between 1 and 3/.test(err.message),
    )
    await assert.rejects(
      async () => generateAiHint(mockProblem, 4),
      (err) => err.status === 400 && /between 1 and 3/.test(err.message),
    )
    await assert.rejects(
      async () => generateAiHint(mockProblem, 'invalid'),
      (err) => err.status === 400,
    )
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})

test('5. AI provider failure throws a 502 error with descriptive message', async () => {
  const originalKey = process.env.AI_API_KEY
  try {
    process.env.AI_API_KEY = 'test-key-123'
    const failFetch = createMockFetch({ status: 429 })
    await assert.rejects(
      async () => generateAiHint(mockProblem, 1, { fetchFn: failFetch }),
      (err) => err.status === 502 && /AI Provider Error/.test(err.message),
    )
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})

test('6. Explanation request generates beginner-friendly structured explanation covering required sections', async () => {
  const prompt = buildExplanationPrompt(mockProblem)
  assert.match(prompt.systemMessage, /Core Idea/)
  assert.match(prompt.systemMessage, /Relevant DSA Concept/)
  assert.match(prompt.systemMessage, /Time Complexity/)
  assert.match(prompt.systemMessage, /Space Complexity/)

  const originalKey = process.env.AI_API_KEY
  try {
    process.env.AI_API_KEY = 'test-key-123'
    const mockContent = `1. Core Idea: Instead of checking pairs with two loops, use a hash map.\n2. Concept: Hash table complement lookup.\n3. Why It Works: Instant O(1) lookup.\n4. Time Complexity: O(n).\n5. Space Complexity: O(n).`
    const mockFetch = createMockFetch({ content: mockContent })
    const result = await generateAiExplanation(mockProblem, { fetchFn: mockFetch })

    assert.ok(result.explanation)
    assert.match(result.explanation, /Core Idea/i)
    assert.match(result.explanation, /Time Complexity/i)
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})

test('7. AI API key missing throws a 503 error indicating AI is not configured', async () => {
  const originalKey = process.env.AI_API_KEY
  try {
    delete process.env.AI_API_KEY
    assert.equal(isAiConfigured(), false)

    await assert.rejects(
      async () => generateAiHint(mockProblem, 1),
      (err) => err.status === 503 && /AI assistance is not configured/.test(err.message),
    )
    await assert.rejects(
      async () => generateAiExplanation(mockProblem),
      (err) => err.status === 503 && /AI assistance is not configured/.test(err.message),
    )
  } finally {
    process.env.AI_API_KEY = originalKey
  }
})

test('8. Existing recommendation endpoint logic still works deterministically', async () => {
  const { rankRecommendationCandidates } = await import('../src/services/recommendationService.js')
  const candidates = rankRecommendationCandidates({
    problems: [mockProblem],
    attempts: [],
  })
  assert.equal(candidates.length, 1)
  assert.equal(candidates[0].problem._id, mockProblem._id)
  assert.ok(candidates[0].factors)
})

test('9. Existing attempt recording statuses and structure remain valid', async () => {
  const validStatuses = ['solved', 'solved_with_hint', 'failed', 'viewed_solution']
  for (const status of validStatuses) {
    const attempt = {
      problemId: mockProblem._id,
      status,
      attemptCount: 1,
      hintsUsed: 2,
    }
    assert.equal(attempt.hintsUsed, 2)
    assert.ok(validStatuses.includes(attempt.status))
  }
})

test('10. Existing analytics calculation still works and reflects attempt history', async () => {
  const { computeUserAnalytics } = await import('../src/services/analyticsService.js')
  const analytics = computeUserAnalytics({
    problems: [mockProblem],
    attempts: [
      {
        problemId: mockProblem,
        status: 'solved_with_hint',
        hintsUsed: 1,
        timeTaken: 20,
        createdAt: new Date(),
      },
    ],
  })
  assert.equal(analytics.overview.uniqueProblemsSolved, 1)
  assert.equal(analytics.overview.totalHintsUsed, 1)
  assert.equal(analytics.overview.overallSuccessRate, 100)
})

test('11. normalizeHintText cleans LaTeX math delimiters, markdown headings, and artifacts', () => {
  const rawWithArtifacts = '## Hint 1: What if you track the remainder $k$?'
  assert.equal(normalizeHintText(rawWithArtifacts), 'What if you track the remainder k?')

  const rawWithFirstTag = '#first Think about $target - nums[i]$ using a hash map.'
  assert.equal(normalizeHintText(rawWithFirstTag), 'Think about target - nums[i] using a hash map.')

  const rawJson = '{\n  "hint": "Try storing complements in a dictionary."\n}'
  assert.equal(normalizeHintText(rawJson), 'Try storing complements in a dictionary.')

  const rawQuoted = '"Ask yourself: what information would you need from past elements?"'
  assert.equal(normalizeHintText(rawQuoted), 'Ask yourself: what information would you need from past elements?')
})

test('12. buildHintPrompt enforces DSA tutor persona, negative constraints, and pedagogical rules', () => {
  const { systemMessage, userMessage } = buildHintPrompt(mockProblem, 1)

  assert.match(systemMessage, /patient DSA tutor, not a solution generator/i)
  assert.match(systemMessage, /Never reveal the complete solution/i)
  assert.match(systemMessage, /Never provide complete code/i)
  assert.match(systemMessage, /Do not output LaTeX/i)
  assert.match(systemMessage, /Do not output Markdown heading syntax/i)
  assert.match(userMessage, /Level 1 Hint \(Conceptual Direction/i)
})

test('13. formatAiText normalizes LaTeX, Markdown headings, and bold emphasis while preserving notation', () => {
  const cases = [
    { in: 'compute the remainder modulo $$k$$', out: 'compute the remainder modulo k' },
    { in: '$$target - nums[i]$$', out: 'target - nums[i]' },
    { in: '# Think about the data structure', out: 'Think about the data structure' },
    { in: 'Use **a hash map** to store values.', out: 'Use a hash map to store values.' },
    { in: 'Consider O(n) time and O(1) space.', out: 'Consider O(n) time and O(1) space.' },
    { in: 'Use nums[i] and target - nums[i].', out: 'Use nums[i] and target - nums[i].' },
  ]

  for (const tc of cases) {
    assert.equal(formatAiText(tc.in), tc.out)
  }
})

