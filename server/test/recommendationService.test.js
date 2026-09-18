import assert from 'node:assert/strict'
import test from 'node:test'
import { rankRecommendationCandidates } from '../src/services/recommendationService.js'

const now = new Date('2026-09-18T12:00:00.000Z')
const problem = (id, title, difficulty, topics, concepts = topics) => ({ _id: id, title, difficulty, topics, concepts })
const problems = [
  problem('easy-array', 'Array Basics', 'Easy', ['Arrays'], ['Traversal']),
  problem('easy-tree', 'Tree Basics', 'Easy', ['Trees'], ['Tree Traversal']),
  problem('medium-tree', 'Tree Paths', 'Medium', ['Trees'], ['Tree Traversal']),
  problem('medium-graph', 'Graph Search', 'Medium', ['Graphs'], ['Breadth-first search']),
  problem('hard-graph', 'Advanced Graphs', 'Hard', ['Graphs'], ['Shortest path']),
]

const attempt = (problemId, status, daysAgo = 20) => ({
  problemId: problems.find((item) => item._id === problemId),
  status,
  createdAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
})

test('new user receives a deterministic beginner recommendation with the required response fields', () => {
  const [recommendation] = rankRecommendationCandidates({ problems, attempts: [], now })
  assert.equal(recommendation.recommendedDifficulty, 'Easy')
  assert.equal(recommendation.problem.difficulty, 'Easy')
  assert.match(recommendation.explanation, /Start with this Easy problem/)
  assert.ok(recommendation.problem)
  assert.equal(typeof recommendation.score, 'number')
  assert.equal(typeof recommendation.targetTopic, 'string')
  assert.equal(typeof recommendation.recommendedDifficulty, 'string')
  assert.deepEqual(Object.keys(recommendation.factors), ['topicWeakness', 'difficultyFit', 'failureRelevance', 'conceptRelevance', 'recency'])
})

test('weak topic stats and a recent failure steer the recommendation to that topic', () => {
  const [recommendation] = rankRecommendationCandidates({
    problems,
    attempts: [attempt('medium-tree', 'failed', 2)],
    topicStats: [{ topic: 'Trees', attempted: 4, solved: 1, masteryScore: 25, successRate: 25, lastPracticed: new Date(now.getTime() - 2 * 86400000) }],
    now,
  })
  assert.equal(recommendation.targetTopic, 'Trees')
  assert.equal(recommendation.problem._id, 'easy-tree')
  assert.ok(recommendation.factors.failureRelevance > 0)
  assert.match(recommendation.explanation, /Trees is a priority area with a 25% mastery score/)
})

test('solved problems are excluded and recent attempts are avoided when alternatives exist', () => {
  const ranked = rankRecommendationCandidates({
    problems,
    attempts: [attempt('easy-array', 'solved', 30), attempt('easy-tree', 'failed', 1)],
    now,
  })
  assert.ok(!ranked.some((item) => item.problem._id === 'easy-array'))
  assert.notEqual(ranked[0].problem._id, 'easy-tree')
})

test('difficulty advances only after enough successful evidence and avoids premature Hard recommendations', () => {
  const mediumReady = [attempt('easy-array', 'solved'), attempt('easy-tree', 'solved')]
  assert.equal(rankRecommendationCandidates({ problems, attempts: mediumReady, now })[0].recommendedDifficulty, 'Medium')

  const hardReady = [
    ...mediumReady,
    attempt('medium-tree', 'solved', 15), attempt('medium-tree', 'solved', 25),
    attempt('medium-graph', 'solved', 35), attempt('medium-graph', 'solved', 45),
  ]
  assert.equal(rankRecommendationCandidates({ problems, attempts: hardReady, now })[0].recommendedDifficulty, 'Hard')
})

test('candidate fallback still returns a recommendation when every appropriate unsolved problem was attempted recently', () => {
  const [recommendation] = rankRecommendationCandidates({
    problems: problems.filter((item) => item.difficulty === 'Easy'),
    attempts: [attempt('easy-array', 'failed', 1), attempt('easy-tree', 'failed', 2)],
    now,
  })
  assert.ok(recommendation)
  assert.equal(recommendation.relaxed, true)
  assert.equal(recommendation.factors.recency, 0)
})
