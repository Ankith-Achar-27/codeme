import assert from 'node:assert/strict'
import test from 'node:test'
import { computeUserAnalytics } from '../src/services/analyticsService.js'

const now = new Date('2026-09-19T12:00:00.000Z')
const problem = (id, title, difficulty, topics, concepts = topics) => ({ _id: id, title, difficulty, topics, concepts })

const problems = [
  problem('p-easy-1', 'Two Sum', 'Easy', ['Arrays', 'HashMap']),
  problem('p-easy-2', 'Valid Anagram', 'Easy', ['Strings', 'HashMap']),
  problem('p-medium-1', 'Group Anagrams', 'Medium', ['Strings', 'HashMap']),
  problem('p-medium-2', 'Number of Islands', 'Medium', ['Graphs']),
  problem('p-hard-1', 'Word Ladder II', 'Hard', ['Graphs', 'Strings']),
]

const makeAttempt = (problemId, status, daysAgo = 0, timeTaken = 15, hintsUsed = 0) => ({
  problemId: problems.find((p) => p._id === problemId) || problemId,
  status,
  timeTaken,
  hintsUsed,
  createdAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
})

test('empty attempts returns clean baseline analytics structure with actionable onboarding insight', () => {
  const result = computeUserAnalytics({ problems, attempts: [], topicStats: [], now })

  assert.equal(result.overview.totalAttempts, 0)
  assert.equal(result.overview.uniqueProblemsAttempted, 0)
  assert.equal(result.overview.uniqueProblemsSolved, 0)
  assert.equal(result.overview.catalogTotal, 5)
  assert.equal(result.overview.completionRate, 0)
  assert.equal(result.overview.overallSuccessRate, 0)
  assert.equal(result.overview.streak.currentStreak, 0)

  assert.equal(result.difficultyProgression.Easy.total, 2)
  assert.equal(result.difficultyProgression.Medium.total, 2)
  assert.equal(result.difficultyProgression.Hard.total, 1)

  assert.equal(result.weakAreas.length, 0)
  assert.equal(result.recentActivity.length, 0)
  assert.ok(result.insights.length > 0)
  assert.equal(result.insights[0].type, 'info')
})

test('mixed attempts accurately compute overview KPIs and time/hint metrics', () => {
  const attempts = [
    makeAttempt('p-easy-1', 'solved', 2, 10, 0),
    makeAttempt('p-easy-2', 'solved_with_hint', 1, 20, 1),
    makeAttempt('p-medium-1', 'failed', 0, 30, 2),
    makeAttempt('p-medium-1', 'viewed_solution', 0, 15, 0),
  ]

  const result = computeUserAnalytics({ problems, attempts, topicStats: [], now })

  assert.equal(result.overview.totalAttempts, 4)
  assert.equal(result.overview.uniqueProblemsAttempted, 3)
  assert.equal(result.overview.uniqueProblemsSolved, 2) // p-easy-1 and p-easy-2
  assert.equal(result.overview.catalogTotal, 5)
  assert.equal(result.overview.completionRate, 40) // 2 / 5 = 40%
  assert.equal(result.overview.overallSuccessRate, 50) // 2 solved out of 4 attempts = 50%
  assert.equal(result.overview.totalTimeSpent, 75) // 10 + 20 + 30 + 15
  assert.equal(result.overview.averageTimePerAttempt, 18.8) // 75 / 4 = 18.75 -> 18.8
  assert.equal(result.overview.totalHintsUsed, 3)
  assert.equal(result.overview.statusDistribution.solved, 1)
  assert.equal(result.overview.statusDistribution.solved_with_hint, 1)
  assert.equal(result.overview.statusDistribution.failed, 1)
  assert.equal(result.overview.statusDistribution.viewed_solution, 1)
})

test('difficulty progression accurately calculates attempted, solved, and completion percentages', () => {
  const attempts = [
    makeAttempt('p-easy-1', 'solved', 2),
    makeAttempt('p-easy-2', 'solved', 1),
    makeAttempt('p-medium-1', 'failed', 0),
  ]

  const result = computeUserAnalytics({ problems, attempts, topicStats: [], now })

  assert.equal(result.difficultyProgression.Easy.attempted, 2)
  assert.equal(result.difficultyProgression.Easy.solved, 2)
  assert.equal(result.difficultyProgression.Easy.completionRate, 100) // 2/2 = 100%
  assert.equal(result.difficultyProgression.Easy.successRate, 100)

  assert.equal(result.difficultyProgression.Medium.attempted, 1)
  assert.equal(result.difficultyProgression.Medium.solved, 0)
  assert.equal(result.difficultyProgression.Medium.completionRate, 0)
  assert.equal(result.difficultyProgression.Medium.successRate, 0)

  assert.equal(result.difficultyProgression.Hard.attempted, 0)
  assert.equal(result.difficultyProgression.Hard.solved, 0)
})

test('topic mastery computes mastery score and identifies weak areas needing attention', () => {
  const attempts = [
    makeAttempt('p-easy-1', 'solved', 3), // Arrays, HashMap
    makeAttempt('p-easy-2', 'solved', 2), // Strings, HashMap
    makeAttempt('p-medium-1', 'failed', 1), // Strings, HashMap
    makeAttempt('p-medium-1', 'failed', 0), // Strings, HashMap
    makeAttempt('p-medium-2', 'failed', 0), // Graphs
  ]

  const result = computeUserAnalytics({ problems, attempts, topicStats: [], now })

  const arraysTopic = result.topicMastery.find((t) => t.topic === 'Arrays')
  const graphsTopic = result.topicMastery.find((t) => t.topic === 'Graphs')
  const hashmapTopic = result.topicMastery.find((t) => t.topic === 'HashMap')

  assert.ok(arraysTopic)
  assert.equal(arraysTopic.attempted, 1)
  assert.equal(arraysTopic.solved, 1)
  assert.equal(arraysTopic.successRate, 100)

  assert.ok(graphsTopic)
  assert.equal(graphsTopic.attempted, 1)
  assert.equal(graphsTopic.solved, 0)
  assert.equal(graphsTopic.failures, 1)
  assert.equal(graphsTopic.status, 'needs_practice')

  assert.ok(hashmapTopic)
  assert.equal(hashmapTopic.attempted, 4)
  assert.equal(hashmapTopic.solved, 2)
  assert.equal(hashmapTopic.failures, 2)

  // Weak areas should contain Graphs and/or Strings/HashMap
  assert.ok(result.weakAreas.length > 0)
  assert.ok(result.weakAreas.some((w) => w.topic === 'Graphs' || w.topic === 'Strings' || w.topic === 'HashMap'))
})

test('streak and activity timeline correctly group dates and calculate consecutive days', () => {
  const attempts = [
    makeAttempt('p-easy-1', 'solved', 2), // 2 days ago
    makeAttempt('p-easy-2', 'solved', 1), // 1 day ago
    makeAttempt('p-medium-1', 'solved', 0), // today
  ]

  const result = computeUserAnalytics({ problems, attempts, topicStats: [], now })

  assert.equal(result.overview.streak.currentStreak, 3)
  assert.equal(result.overview.streak.longestStreak, 3)
  assert.equal(result.overview.streak.activeDaysCount, 3)
  assert.equal(result.recentActivity.length, 3)
  assert.equal(result.recentActivity[2].solved, 1)
})
