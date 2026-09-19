import Attempt from '../models/Attempt.js'
import Problem from '../models/Problem.js'
import UserTopicStats from '../models/UserTopicStats.js'

const SUCCESS_STATUSES = new Set(['solved', 'solved_with_hint'])
const DAY_MS = 24 * 60 * 60 * 1000

export const isSolvedStatus = (status) => SUCCESS_STATUSES.has(status)

function calculateStreak(attempts, now = new Date()) {
  if (!attempts || !attempts.length) return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 }

  const activeDates = new Set()
  for (const attempt of attempts) {
    if (attempt.createdAt) {
      const dateStr = new Date(attempt.createdAt).toISOString().split('T')[0]
      activeDates.add(dateStr)
    }
  }

  const sortedDates = Array.from(activeDates).sort().reverse()
  if (!sortedDates.length) return { currentStreak: 0, longestStreak: 0, activeDaysCount: 0 }

  const todayStr = now.toISOString().split('T')[0]
  const yesterdayStr = new Date(now.getTime() - DAY_MS).toISOString().split('T')[0]

  let currentStreak = 0
  let checkDate = sortedDates[0] === todayStr ? todayStr : (sortedDates[0] === yesterdayStr ? yesterdayStr : null)

  if (checkDate) {
    let cursor = new Date(checkDate)
    while (true) {
      const cursorStr = cursor.toISOString().split('T')[0]
      if (activeDates.has(cursorStr)) {
        currentStreak += 1
        cursor = new Date(cursor.getTime() - DAY_MS)
      } else {
        break
      }
    }
  }

  // Longest streak
  const chronologicalDates = Array.from(activeDates).sort()
  let longestStreak = 0
  let runningStreak = 0
  let prevTime = null

  for (const dateStr of chronologicalDates) {
    const dateTime = new Date(dateStr).getTime()
    if (prevTime === null) {
      runningStreak = 1
    } else {
      const diffDays = Math.round((dateTime - prevTime) / DAY_MS)
      if (diffDays === 1) {
        runningStreak += 1
      } else if (diffDays > 1) {
        runningStreak = 1
      }
    }
    if (runningStreak > longestStreak) longestStreak = runningStreak
    prevTime = dateTime
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDaysCount: activeDates.size,
  }
}

export function computeUserAnalytics({ problems = [], attempts = [], topicStats = [], now = new Date() }) {
  const totalAttempts = attempts.length
  const catalogTotal = problems.length

  // Catalog difficulty counts
  const catalogByDifficulty = { Easy: 0, Medium: 0, Hard: 0 }
  for (const p of problems) {
    if (catalogByDifficulty[p.difficulty] !== undefined) {
      catalogByDifficulty[p.difficulty] += 1
    }
  }

  // Unique problems attempted & solved
  const problemAttemptMap = new Map()
  let totalTimeSpent = 0
  let totalHintsUsed = 0
  const statusDistribution = { solved: 0, solved_with_hint: 0, failed: 0, viewed_solution: 0 }

  for (const att of attempts) {
    const pId = String(att.problemId?._id || att.problemId)
    if (!problemAttemptMap.has(pId)) {
      problemAttemptMap.set(pId, {
        attempts: [],
        solved: false,
        problem: att.problemId && typeof att.problemId === 'object' ? att.problemId : null,
      })
    }
    const entry = problemAttemptMap.get(pId)
    entry.attempts.push(att)
    if (isSolvedStatus(att.status)) {
      entry.solved = true
    }

    if (statusDistribution[att.status] !== undefined) {
      statusDistribution[att.status] += 1
    }
    if (typeof att.timeTaken === 'number' && att.timeTaken > 0) {
      totalTimeSpent += att.timeTaken
    }
    if (typeof att.hintsUsed === 'number' && att.hintsUsed > 0) {
      totalHintsUsed += att.hintsUsed
    }
  }

  const uniqueProblemsAttempted = problemAttemptMap.size
  let uniqueProblemsSolved = 0
  for (const entry of problemAttemptMap.values()) {
    if (entry.solved) uniqueProblemsSolved += 1
  }

  const totalSolvedAttempts = (statusDistribution.solved || 0) + (statusDistribution.solved_with_hint || 0)
  const overallSuccessRate = totalAttempts > 0 ? Math.round((totalSolvedAttempts / totalAttempts) * 100) : 0
  const completionRate = catalogTotal > 0 ? Math.round((uniqueProblemsSolved / catalogTotal) * 100) : 0
  const averageTimePerAttempt = totalAttempts > 0 ? Math.round((totalTimeSpent / totalAttempts) * 10) / 10 : 0

  // Difficulty progression
  const difficultyStats = {
    Easy: { attempted: 0, solved: 0, total: catalogByDifficulty.Easy, successRate: 0, completionRate: 0 },
    Medium: { attempted: 0, solved: 0, total: catalogByDifficulty.Medium, successRate: 0, completionRate: 0 },
    Hard: { attempted: 0, solved: 0, total: catalogByDifficulty.Hard, successRate: 0, completionRate: 0 },
  }

  // Count unique solved per difficulty from problems catalog & attempts
  const difficultyUniqueSolved = { Easy: new Set(), Medium: new Set(), Hard: new Set() }
  const difficultyUniqueAttempted = { Easy: new Set(), Medium: new Set(), Hard: new Set() }

  for (const [pId, entry] of problemAttemptMap.entries()) {
    const diff = entry.problem?.difficulty || problems.find((p) => String(p._id) === pId)?.difficulty
    if (diff && difficultyStats[diff]) {
      difficultyUniqueAttempted[diff].add(pId)
      if (entry.solved) {
        difficultyUniqueSolved[diff].add(pId)
      }
    }
  }

  for (const diff of ['Easy', 'Medium', 'Hard']) {
    const attemptedCount = difficultyUniqueAttempted[diff].size
    const solvedCount = difficultyUniqueSolved[diff].size
    const total = difficultyStats[diff].total
    difficultyStats[diff].attempted = attemptedCount
    difficultyStats[diff].solved = solvedCount
    difficultyStats[diff].completionRate = total > 0 ? Math.round((solvedCount / total) * 100) : 0
    difficultyStats[diff].successRate = attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : 0
  }

  // Topic stats and mastery
  const topicMap = new Map()
  // First, index all known topics from catalog
  for (const prob of problems) {
    for (const topic of prob.topics || []) {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          topic,
          catalogCount: 0,
          attempted: 0,
          solved: 0,
          failures: 0,
          hintsUsed: 0,
          timeSpent: 0,
          lastPracticed: null,
          masteryScore: 0,
          status: 'unattempted', // 'unattempted' | 'needs_practice' | 'practicing' | 'proficient' | 'mastered'
        })
      }
      topicMap.get(topic).catalogCount += 1
    }
  }

  // Populate from pre-existing UserTopicStats records if any
  for (const stat of topicStats) {
    if (!topicMap.has(stat.topic)) {
      topicMap.set(stat.topic, {
        topic: stat.topic,
        catalogCount: 0,
        attempted: stat.attempted || 0,
        solved: stat.solved || 0,
        failures: Math.max(0, (stat.attempted || 0) - (stat.solved || 0)),
        hintsUsed: 0,
        timeSpent: 0,
        lastPracticed: stat.lastPracticed || null,
        masteryScore: stat.masteryScore || 0,
        status: 'practicing',
      })
    }
  }

  // Aggregate live attempts per topic
  for (const att of attempts) {
    const prob = att.problemId && typeof att.problemId === 'object'
      ? att.problemId
      : problems.find((p) => String(p._id) === String(att.problemId))

    if (!prob || !Array.isArray(prob.topics)) continue

    const isSolved = isSolvedStatus(att.status)

    for (const topic of prob.topics) {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          topic,
          catalogCount: 0,
          attempted: 0,
          solved: 0,
          failures: 0,
          hintsUsed: 0,
          timeSpent: 0,
          lastPracticed: null,
          masteryScore: 0,
          status: 'unattempted',
        })
      }
      const tStat = topicMap.get(topic)
      tStat.attempted += 1
      if (isSolved) {
        tStat.solved += 1
      } else {
        tStat.failures += 1
      }
      if (att.timeTaken) tStat.timeSpent += att.timeTaken
      if (att.hintsUsed) tStat.hintsUsed += att.hintsUsed
      if (!tStat.lastPracticed || new Date(att.createdAt) > new Date(tStat.lastPracticed)) {
        tStat.lastPracticed = att.createdAt
      }
    }
  }

  // Calculate mastery score and status per topic
  const topicList = Array.from(topicMap.values()).map((t) => {
    const successRate = t.attempted > 0 ? Math.round((t.solved / t.attempted) * 100) : 0
    let masteryScore = 0

    if (t.attempted === 0) {
      masteryScore = 0
      t.status = 'unattempted'
    } else {
      // Bayesian mastery weighting
      const confidence = Math.min(t.attempted / 4, 1)
      const rawMastery = successRate * confidence + 50 * (1 - confidence)
      // Small bonus for volume
      const volumeBonus = Math.min(t.solved * 2, 10)
      masteryScore = Math.min(100, Math.round(rawMastery * 0.9 + volumeBonus))

      if (masteryScore >= 80 && t.solved >= 3) {
        t.status = 'mastered'
      } else if (masteryScore >= 60 && t.solved >= 2) {
        t.status = 'proficient'
      } else if (t.failures > t.solved || (t.attempted >= 2 && successRate < 50)) {
        t.status = 'needs_practice'
      } else {
        t.status = 'practicing'
      }
    }

    return {
      ...t,
      successRate,
      masteryScore,
    }
  })

  // Identify Weak Areas & Strengths
  const practicedTopics = topicList.filter((t) => t.attempted > 0)
  const weakAreas = practicedTopics
    .filter((t) => t.status === 'needs_practice' || (t.failures > 0 && t.masteryScore < 65))
    .sort((a, b) => a.masteryScore - b.masteryScore || b.failures - a.failures)
    .slice(0, 5)
    .map((t) => ({
      topic: t.topic,
      masteryScore: t.masteryScore,
      successRate: t.successRate,
      attempted: t.attempted,
      solved: t.solved,
      failures: t.failures,
      reason: t.failures > t.solved
        ? `${t.failures} struggle${t.failures > 1 ? 's' : ''} out of ${t.attempted} attempt${t.attempted > 1 ? 's' : ''}`
        : `${t.masteryScore}% mastery with low accuracy (${t.successRate}%)`,
    }))

  const strongAreas = practicedTopics
    .filter((t) => t.status === 'mastered' || t.status === 'proficient' || t.masteryScore >= 70)
    .sort((a, b) => b.masteryScore - a.masteryScore || b.solved - a.solved)
    .slice(0, 5)

  // Recent Activity Timeline (grouped by day for the last 14 active days or recent attempts)
  const activityMap = new Map()
  for (const att of attempts) {
    if (!att.createdAt) continue
    const dayKey = new Date(att.createdAt).toISOString().split('T')[0]
    if (!activityMap.has(dayKey)) {
      activityMap.set(dayKey, { date: dayKey, attempts: 0, solved: 0, failed: 0, timeSpent: 0 })
    }
    const dayStat = activityMap.get(dayKey)
    dayStat.attempts += 1
    if (isSolvedStatus(att.status)) {
      dayStat.solved += 1
    } else {
      dayStat.failed += 1
    }
    if (att.timeTaken) dayStat.timeSpent += att.timeTaken
  }

  const recentActivity = Array.from(activityMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)

  const streak = calculateStreak(attempts, now)

  // Actionable Insights / Next Focus
  const insights = []
  if (totalAttempts === 0) {
    insights.push({
      type: 'info',
      title: 'Start your practice journey',
      description: 'Solve your first problem from the library or recommendation engine to begin building your mastery analytics.',
    })
  } else {
    if (weakAreas.length > 0) {
      insights.push({
        type: 'warning',
        title: `Focus needed in ${weakAreas[0].topic}`,
        description: `You have had some difficulty in ${weakAreas[0].topic} (${weakAreas[0].masteryScore}% mastery). Targeting easier problems in this area will reinforce fundamentals.`,
      })
    }
    if (difficultyStats.Easy.completionRate >= 60 && difficultyStats.Medium.attempted < 3) {
      insights.push({
        type: 'growth',
        title: 'Ready for Medium difficulty',
        description: `Great progress on Easy problems (${difficultyStats.Easy.solved} solved)! Step up to Medium challenges to expand your problem-solving depth.`,
      })
    }
    if (streak.currentStreak >= 3) {
      insights.push({
        type: 'streak',
        title: `${streak.currentStreak}-day practice streak!`,
        description: 'Consistency is the key to mastering DSA patterns. Keep up the momentum!',
      })
    }
    if (totalHintsUsed > 0 && totalAttempts > 0) {
      const avgHints = Math.round((totalHintsUsed / totalAttempts) * 10) / 10
      if (avgHints <= 0.5) {
        insights.push({
          type: 'strength',
          title: 'High independent solve rate',
          description: `You average only ${avgHints} hints per problem, showing strong independent reasoning.`,
        })
      }
    }
  }

  return {
    overview: {
      totalAttempts,
      uniqueProblemsAttempted,
      uniqueProblemsSolved,
      catalogTotal,
      completionRate,
      overallSuccessRate,
      totalTimeSpent,
      averageTimePerAttempt,
      totalHintsUsed,
      statusDistribution,
      streak,
    },
    difficultyProgression: difficultyStats,
    topicMastery: topicList.sort((a, b) => b.attempted - a.attempted || a.topic.localeCompare(b.topic)),
    weakAreas,
    strongAreas,
    recentActivity,
    insights,
  }
}

export async function getUserAnalyticsData(userId) {
  const [problems, attempts, topicStats] = await Promise.all([
    Problem.find({}).lean(),
    Attempt.find({ userId }).sort({ createdAt: 1 }).populate('problemId').lean(),
    UserTopicStats.find({ userId }).lean(),
  ])

  return computeUserAnalytics({ problems, attempts, topicStats })
}
