import { part1 } from './problems/part1.js'
import { part2 } from './problems/part2.js'
import { part3 } from './problems/part3.js'
import { part4 } from './problems/part4.js'

export const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const problems = [...part1, ...part2, ...part3, ...part4]

export default problems
