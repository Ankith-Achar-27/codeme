import assert from 'node:assert/strict'
import test from 'node:test'

/**
 * Simulates the state transitions and request deduplication of the AI Tutor in ProblemDetailsPage
 */
class AiTutorSession {
  constructor(apiClient) {
    this.api = apiClient
    this.storedHints = null
    this.aiHints = []
    this.loading = false
    this.cooldownRemaining = 0
    this.isRequesting = false
    this.currentProblemId = null
    this.apiCallCount = 0
  }

  loadProblem(problemId) {
    this.currentProblemId = problemId
    this.storedHints = null
    this.aiHints = []
    this.loading = false
    this.cooldownRemaining = 0
    this.isRequesting = false
  }

  async requestHint() {
    if (this.aiHints.length >= 3 || this.loading) return

    // Progressive reveals from memory
    if (this.storedHints) {
      if (this.aiHints.length === 1 && this.storedHints.hint2) {
        this.aiHints.push({ level: 2, hint: this.storedHints.hint2 })
        return
      }
      if (this.aiHints.length === 2 && this.storedHints.hint3) {
        this.aiHints.push({ level: 3, hint: this.storedHints.hint3 })
        return
      }
    }

    // Cooldown & deduplication
    if (this.isRequesting || this.cooldownRemaining > 0) return

    this.isRequesting = true
    this.loading = true
    this.cooldownRemaining = 15

    try {
      this.apiCallCount++
      const res = await this.api.getAiHint(this.currentProblemId)
      this.storedHints = res.data
      this.aiHints.push({ level: 1, hint: res.data.hint1 })
    } finally {
      this.loading = false
      this.isRequesting = false
    }
  }

  tickCooldown(seconds = 1) {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - seconds)
  }
}

test('AI Tutor Flow — Initial generation makes exactly ONE API request and reveals Hint 1', async () => {
  let calls = 0
  const mockApi = {
    getAiHint: async () => {
      calls++
      return {
        data: {
          hint1: 'Consider tracking complements.',
          hint2: 'Use a hash map as you iterate.',
          hint3: 'Store nums[i] -> index in map.',
        },
      }
    },
  }

  const session = new AiTutorSession(mockApi)
  session.loadProblem('prob_1')

  await session.requestHint()
  assert.equal(session.apiCallCount, 1)
  assert.equal(calls, 1)
  assert.equal(session.aiHints.length, 1)
  assert.equal(session.aiHints[0].level, 1)
  assert.equal(session.aiHints[0].hint, 'Consider tracking complements.')
})

test('AI Tutor Flow — Revealing Hint 2 and Hint 3 does NOT make additional API requests', async () => {
  let calls = 0
  const mockApi = {
    getAiHint: async () => {
      calls++
      return {
        data: {
          hint1: 'Concept nudge',
          hint2: 'Strategy nudge',
          hint3: 'Implementation guidance',
        },
      }
    },
  }

  const session = new AiTutorSession(mockApi)
  session.loadProblem('prob_1')

  // Generate hints
  await session.requestHint()
  assert.equal(calls, 1)
  assert.equal(session.aiHints.length, 1)

  // Reveal Hint 2
  await session.requestHint()
  assert.equal(calls, 1, 'Revealing Hint 2 must not make another API call')
  assert.equal(session.aiHints.length, 2)
  assert.equal(session.aiHints[1].level, 2)
  assert.equal(session.aiHints[1].hint, 'Strategy nudge')

  // Reveal Hint 3
  await session.requestHint()
  assert.equal(calls, 1, 'Revealing Hint 3 must not make another API call')
  assert.equal(session.aiHints.length, 3)
  assert.equal(session.aiHints[2].level, 3)
  assert.equal(session.aiHints[2].hint, 'Implementation guidance')
})

test('AI Tutor Flow — Double-clicking the generate button does not create duplicate requests', async () => {
  let calls = 0
  let resolvePromise
  const mockApi = {
    getAiHint: async () => {
      calls++
      return new Promise((resolve) => {
        resolvePromise = () =>
          resolve({
            data: {
              hint1: 'H1',
              hint2: 'H2',
              hint3: 'H3',
            },
          })
      })
    },
  }

  const session = new AiTutorSession(mockApi)
  session.loadProblem('prob_1')

  // Trigger two requests concurrently (double click)
  const req1 = session.requestHint()
  const req2 = session.requestHint()

  // Resolve pending request
  resolvePromise()
  await Promise.all([req1, req2])

  assert.equal(calls, 1, 'Double click must only dispatch one request')
  assert.equal(session.aiHints.length, 1)
})

test('AI Tutor Flow — 15-second cooldown prevents another generation request during cooldown period', async () => {
  let calls = 0
  const mockApi = {
    getAiHint: async () => {
      calls++
      return {
        data: {
          hint1: 'H1',
          hint2: 'H2',
          hint3: 'H3',
        },
      }
    },
  }

  const session = new AiTutorSession(mockApi)
  session.loadProblem('prob_1')

  await session.requestHint()
  assert.equal(calls, 1)
  assert.equal(session.cooldownRemaining, 15)

  // Clear hints as if starting a fresh generation while cooldown is active
  session.storedHints = null
  session.aiHints = []

  // Attempting generation during cooldown must be blocked
  await session.requestHint()
  assert.equal(calls, 1, 'Request during cooldown must be blocked')

  // Advance cooldown to 0
  session.tickCooldown(15)
  assert.equal(session.cooldownRemaining, 0)

  // Generation is now allowed again
  await session.requestHint()
  assert.equal(calls, 2, 'Request after cooldown must succeed')
})

test('AI Tutor Flow — Moving to another problem clears previous hint set', async () => {
  let calls = 0
  const mockApi = {
    getAiHint: async (problemId) => {
      calls++
      return {
        data: {
          hint1: `Hint 1 for ${problemId}`,
          hint2: `Hint 2 for ${problemId}`,
          hint3: `Hint 3 for ${problemId}`,
        },
      }
    },
  }

  const session = new AiTutorSession(mockApi)
  session.loadProblem('prob_A')

  await session.requestHint()
  assert.equal(session.aiHints[0].hint, 'Hint 1 for prob_A')

  // Switch to another problem
  session.loadProblem('prob_B')
  assert.equal(session.storedHints, null)
  assert.equal(session.aiHints.length, 0)
  assert.equal(session.cooldownRemaining, 0)

  // Request hints for the new problem
  await session.requestHint()
  assert.equal(session.aiHints[0].hint, 'Hint 1 for prob_B')
  assert.equal(calls, 2)
})
