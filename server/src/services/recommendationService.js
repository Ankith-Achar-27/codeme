import Attempt from '../models/Attempt.js'
import Problem from '../models/Problem.js'
import UserTopicStats from '../models/UserTopicStats.js'

const WEIGHTS = {
  topicWeakness: 0.30,
  difficultyFit: 0.25,
  failureRelevance: 0.20,
  conceptRelevance: 0.15,
  recency: 0.10,
}

const SUCCESS_STATUSES = new Set(['solved', 'solved_with_hint'])
const RECENT_ATTEMPT_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

const clamp = (value) => Math.max(0, Math.min(1, value))
const daysSince = (date, now) => date ? Math.max(0, (now - new Date(date)) / DAY_MS) : null
const isSolved = (attempt) => SUCCESS_STATUSES.has(attempt.status)
const validProblem = (problem) => problem && problem._id && Array.isArray(problem.topics)

function problemId(problem) {
  return String(problem?._id || problem)
}

function average(values, fallback = 0) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : fallback
}

export function determineRecommendedDifficulty(attempts) {
  const byDifficulty = new Map(['Easy', 'Medium', 'Hard'].map((difficulty) => [difficulty, { attempted: 0, solved: 0 }]))

  for (const attempt of attempts) {
    const difficulty = attempt.problemId?.difficulty
    if (!byDifficulty.has(difficulty)) continue
    const entry = byDifficulty.get(difficulty)
    entry.attempted += 1
    if (isSolved(attempt)) entry.solved += 1
  }

  const easy = byDifficulty.get('Easy')
  const medium = byDifficulty.get('Medium')
  const mediumSuccessRate = medium.attempted ? medium.solved / medium.attempted : 0
  const easySuccessRate = easy.attempted ? easy.solved / easy.attempted : 0

  if (medium.attempted >= 4 && mediumSuccessRate >= 0.7) return 'Hard'
  if ((medium.attempted >= 2 && mediumSuccessRate >= 0.5) || (easy.attempted >= 2 && easySuccessRate >= 0.6)) return 'Medium'
  return 'Easy'
}

function difficultyFit(problemDifficulty, recommendedDifficulty) {
  if (problemDifficulty === recommendedDifficulty) return 1
  if (recommendedDifficulty === 'Easy') return problemDifficulty === 'Medium' ? 0.25 : 0
  if (recommendedDifficulty === 'Medium') return problemDifficulty === 'Easy' ? 0.6 : 0.2
  return problemDifficulty === 'Medium' ? 0.7 : problemDifficulty === 'Easy' ? 0.35 : 0
}

function buildTopicProfiles(topicStats, attempts, now) {
  const profiles = new Map()

  for (const stat of topicStats) {
    profiles.set(stat.topic, {
      topic: stat.topic,
      attempted: stat.attempted || 0,
      mastery: Number.isFinite(stat.masteryScore) ? stat.masteryScore : stat.successRate || 0,
      lastPracticed: stat.lastPracticed || null,
      failures: 0,
      failureRecency: 0,
      concepts: new Map(),
    })
  }

  for (const attempt of attempts) {
    const problem = attempt.problemId
    if (!validProblem(problem)) continue
    for (const topic of problem.topics) {
      if (!profiles.has(topic)) {
        profiles.set(topic, { topic, attempted: 0, solved: 0, mastery: null, lastPracticed: null, failures: 0, failureRecency: 0, concepts: new Map() })
      }
      const profile = profiles.get(topic)
      profile.attempted += 1
      profile.solved = (profile.solved || 0) + (isSolved(attempt) ? 1 : 0)
      if (!profile.lastPracticed || new Date(attempt.createdAt) > new Date(profile.lastPracticed)) profile.lastPracticed = attempt.createdAt

      if (!isSolved(attempt)) {
        profile.failures += 1
        const recencyWeight = clamp(1 - (daysSince(attempt.createdAt, now) ?? 90) / 60)
        profile.failureRecency = Math.max(profile.failureRecency, recencyWeight)
        for (const concept of problem.concepts || []) {
          profile.concepts.set(concept, (profile.concepts.get(concept) || 0) + recencyWeight + 0.25)
        }
      }
    }
  }

  for (const profile of profiles.values()) {
    if (!Number.isFinite(profile.mastery)) {
      const observedRate = profile.attempted ? ((profile.solved || 0) / profile.attempted) * 100 : 55
      const confidence = Math.min(profile.attempted / 4, 1)
      profile.mastery = observedRate * confidence + 55 * (1 - confidence)
    }
    profile.weakness = clamp(1 - profile.mastery / 100)
    profile.failureScore = clamp((profile.failures / 3) * 0.65 + profile.failureRecency * 0.35)
  }

  return profiles
}

function selectCandidates(problems, attempts, recommendedDifficulty, now) {
  const solvedIds = new Set(attempts.filter(isSolved).map((attempt) => problemId(attempt.problemId)))
  const recentAttemptIds = new Set(attempts.filter((attempt) => (daysSince(attempt.createdAt, now) ?? Infinity) < RECENT_ATTEMPT_DAYS).map((attempt) => problemId(attempt.problemId)))
  const appropriate = problems.filter((problem) => difficultyFit(problem.difficulty, recommendedDifficulty) > 0)
  const unsolved = appropriate.filter((problem) => !solvedIds.has(problemId(problem)))
  const notRecent = unsolved.filter((problem) => !recentAttemptIds.has(problemId(problem)))

  if (notRecent.length) return { candidates: notRecent, relaxed: false }
  if (unsolved.length) return { candidates: unsolved, relaxed: true }

  const anyUnsolved = problems.filter((problem) => !solvedIds.has(problemId(problem)))
  if (anyUnsolved.length) return { candidates: anyUnsolved, relaxed: true }
  return { candidates: problems, relaxed: true }
}

function buildExplanation(recommendation, profiles, attempts) {
  const { problem, targetTopic, recommendedDifficulty, factors } = recommendation
  const profile = profiles.get(targetTopic)
  if (!attempts.length) {
    return `Start with this ${recommendedDifficulty} problem to build a steady foundation in ${targetTopic}. As you record attempts, CodeMe will tailor the difficulty and topic focus further.`
  }

  const sentences = []
  if (profile) sentences.push(`${targetTopic} is a priority area with a ${Math.round(profile.mastery)}% mastery score.`)
  if (factors.failureRelevance >= 0.25) sentences.push(`Recent difficulty in this area makes targeted practice especially useful.`)
  if (factors.conceptRelevance >= 0.35) sentences.push(`${problem.concepts?.[0] || 'Its core concepts'} connects to the concepts from your previous attempts.`)
  sentences.push(`This ${problem.difficulty} problem fits your current ${recommendedDifficulty} recommendation level.`)
  if (factors.recency >= 0.65) sentences.push(`It also revisits an area you have not practiced recently.`)
  return sentences.join(' ')
}

export function rankRecommendationCandidates({ problems, attempts, topicStats = [], now = new Date() }) {
  const validProblems = problems.filter(validProblem)
  if (!validProblems.length) return []

  const profiles = buildTopicProfiles(topicStats, attempts, now)
  const recommendedDifficulty = determineRecommendedDifficulty(attempts)
  const { candidates, relaxed } = selectCandidates(validProblems, attempts, recommendedDifficulty, now)

  const ranked = candidates.map((problem) => {
    const topicProfiles = problem.topics.map((topic) => profiles.get(topic)).filter(Boolean)
    const targetProfile = [...topicProfiles].sort((left, right) => right.weakness - left.weakness)[0]
    const targetTopic = targetProfile?.topic || problem.topics[0] || 'fundamentals'
    const topicWeakness = average(topicProfiles.map((profile) => profile.weakness), 0.45)
    const failureRelevance = average(topicProfiles.map((profile) => profile.failureScore), 0)
    const conceptFailureValues = (problem.concepts || []).map((concept) => Math.max(...topicProfiles.map((profile) => clamp((profile.concepts.get(concept) || 0) / 2)), 0))
    const conceptRelevance = conceptFailureValues.length ? average(conceptFailureValues) : topicWeakness * 0.45
    const practiceGaps = topicProfiles.map((profile) => clamp((daysSince(profile.lastPracticed, now) ?? 40) / 60))
    const recentlyAttempted = attempts.some((attempt) => problemId(attempt.problemId) === problemId(problem) && (daysSince(attempt.createdAt, now) ?? Infinity) < RECENT_ATTEMPT_DAYS)
    const recency = recentlyAttempted ? 0 : average(practiceGaps, 0.65)
    const factors = {
      topicWeakness: Number(topicWeakness.toFixed(3)),
      difficultyFit: Number(difficultyFit(problem.difficulty, recommendedDifficulty).toFixed(3)),
      failureRelevance: Number(failureRelevance.toFixed(3)),
      conceptRelevance: Number(conceptRelevance.toFixed(3)),
      recency: Number(recency.toFixed(3)),
    }
    const score = Number(Object.entries(WEIGHTS).reduce((total, [factor, weight]) => total + factors[factor] * weight, 0).toFixed(3))
    return { problem, score, factors, targetTopic, recommendedDifficulty, relaxed }
  })

  ranked.sort((left, right) => right.score - left.score || left.problem.title.localeCompare(right.problem.title))
  return ranked.map((recommendation) => ({ ...recommendation, explanation: buildExplanation(recommendation, profiles, attempts) }))
}

export async function getRecommendationsForUser(userId, { limit = 1 } = {}) {
  const [problems, attempts, topicStats] = await Promise.all([
    Problem.find({}).lean(),
    Attempt.find({ userId }).sort({ createdAt: -1 }).populate('problemId').lean(),
    UserTopicStats.find({ userId }).lean(),
  ])
  return rankRecommendationCandidates({ problems, attempts, topicStats }).slice(0, limit)
}
