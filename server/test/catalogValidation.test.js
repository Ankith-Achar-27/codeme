import test from 'node:test'
import assert from 'node:assert/strict'
import problems, { slugify } from '../src/data/problems.js'

test('Catalog has exactly 104 unique and valid problems', () => {
  assert.equal(problems.length, 104, 'Must have exactly 104 problems')

  const seenSlugs = new Set()
  const seenTitles = new Set()

  for (const [index, problem] of problems.entries()) {
    const pNum = index + 1

    // 1. Title
    assert.ok(problem.title && typeof problem.title === 'string' && problem.title.trim().length > 0, `Problem #${pNum} must have a non-empty title`)
    assert.ok(!seenTitles.has(problem.title), `Problem #${pNum} title "${problem.title}" must be unique`)
    seenTitles.add(problem.title)

    // 2. Slug
    const expectedSlug = slugify(problem.title)
    assert.equal(problem.slug, expectedSlug, `Problem #${pNum} slug must match slugify(title)`)
    assert.ok(!seenSlugs.has(problem.slug), `Problem #${pNum} slug "${problem.slug}" must be unique`)
    seenSlugs.add(problem.slug)

    // 3. Difficulty
    assert.ok(['Easy', 'Medium', 'Hard'].includes(problem.difficulty), `Problem #${pNum} (${problem.title}) has invalid difficulty "${problem.difficulty}"`)

    // 4. Topics
    assert.ok(Array.isArray(problem.topics) && problem.topics.length > 0, `Problem #${pNum} (${problem.title}) must have at least one topic`)
    for (const topic of problem.topics) {
      assert.ok(typeof topic === 'string' && topic.trim().length > 0, `Problem #${pNum} topic must be a non-empty string`)
    }

    // 5. Concepts
    assert.ok(Array.isArray(problem.concepts) && problem.concepts.length > 0, `Problem #${pNum} (${problem.title}) must have at least one concept`)
    for (const concept of problem.concepts) {
      assert.ok(typeof concept === 'string' && concept.trim().length > 0, `Problem #${pNum} concept must be a non-empty string`)
    }

    // 6. Description
    assert.ok(problem.description && typeof problem.description === 'string', `Problem #${pNum} (${problem.title}) must have a description`)
    assert.ok(problem.description.length >= 40, `Problem #${pNum} (${problem.title}) description must be comprehensive (>= 40 chars, got ${problem.description.length})`)
    assert.ok(!problem.description.startsWith('Practice '), `Problem #${pNum} (${problem.title}) description must not be the generated template`)

    // 7. Examples
    assert.ok(Array.isArray(problem.examples) && problem.examples.length >= 1, `Problem #${pNum} (${problem.title}) must have examples`)
    for (const [exIdx, example] of problem.examples.entries()) {
      assert.ok(example.input && typeof example.input === 'string' && example.input.trim().length > 0, `Problem #${pNum} example #${exIdx + 1} must have input`)
      assert.ok(example.output && typeof example.output === 'string' && example.output.trim().length > 0, `Problem #${pNum} example #${exIdx + 1} must have output`)
      assert.ok(example.explanation && typeof example.explanation === 'string' && example.explanation.trim().length > 0, `Problem #${pNum} example #${exIdx + 1} must have explanation`)
    }

    // 8. Constraints
    assert.ok(Array.isArray(problem.constraints) && problem.constraints.length >= 1, `Problem #${pNum} (${problem.title}) must have constraints`)
    for (const [cIdx, constraint] of problem.constraints.entries()) {
      assert.ok(typeof constraint === 'string' && constraint.trim().length > 0, `Problem #${pNum} constraint #${cIdx + 1} must be a non-empty string`)
    }

    // 9. Hints
    assert.ok(Array.isArray(problem.hints) && problem.hints.length >= 1, `Problem #${pNum} (${problem.title}) must have hints`)
    for (const hint of problem.hints) {
      assert.ok(typeof hint === 'string' && hint.trim().length > 0, `Problem #${pNum} hint must be a non-empty string`)
    }
  }
})

test('Benchmark problem: Longest Increasing Subsequence has required fields', () => {
  const lis = problems.find((p) => p.slug === 'longest-increasing-subsequence')
  assert.ok(lis, 'Longest Increasing Subsequence must be present')
  assert.equal(lis.difficulty, 'Medium')
  assert.deepEqual(lis.topics, ['Dynamic Programming', 'Binary Search'])
  assert.deepEqual(lis.concepts, ['Patience sorting', 'Subsequence DP'])
  assert.ok(lis.description.includes('subsequence'), 'Description must explain subsequence')
  assert.ok(lis.description.includes('strictly increasing'), 'Description must mention strictly increasing')
  assert.ok(lis.examples.length >= 2, 'Must have at least 2 examples')
  assert.ok(lis.constraints.length >= 2, 'Must have constraints')
})
