export const part4 = [
  {
    title: 'Course Schedule',
    slug: 'course-schedule',
    difficulty: 'Medium',
    topics: ['Graphs'],
    concepts: ['Topological sort', 'Cycle detection'],
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nFor example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.\n\nReturn true if you can finish all courses. Otherwise, return false.',
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'There are 2 courses to take. To take course 1 you should have finished course 0. So it is possible.',
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'There is a cycle between course 0 and 1, so it is impossible to finish all courses.',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.',
    ],
    hints: [
      'A directed cycle makes completion impossible.',
      'Start with the constraints and choose a topological sort approach before coding.',
    ],
  },
  {
    title: 'Course Schedule II',
    slug: 'course-schedule-ii',
    difficulty: 'Medium',
    topics: ['Graphs'],
    concepts: ['Topological sort', 'Indegree'],
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.',
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: '[0,1]',
        explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].',
      },
      {
        input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
        output: '[0,2,1,3]',
        explanation: 'There are 4 courses. Course 0 has no prerequisites, then 1 and 2, followed by 3. [0,1,2,3] is also valid.',
      },
      {
        input: 'numCourses = 1, prerequisites = []',
        output: '[0]',
        explanation: 'No prerequisites exist, taking course 0 completes all courses.',
      },
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= numCourses * (numCourses - 1)',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'ai != bi',
      'All the pairs [ai, bi] are distinct.',
    ],
    hints: [
      'Queue courses whose prerequisites are complete.',
      'Start with the constraints and choose a topological sort approach before coding.',
    ],
  },
  {
    title: 'Pacific Atlantic Water Flow',
    slug: 'pacific-atlantic-water-flow',
    difficulty: 'Medium',
    topics: ['Graphs'],
    concepts: ['Reverse DFS', 'Grid traversal'],
    description:
      'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island\'s left and top edges, and the Atlantic Ocean touches the island\'s right and bottom edges.\n\nYou are given an m x n integer matrix heights representing the height of each unit cell above sea level. Rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell\'s height is less than or equal to the current cell\'s height. Water can also flow into the ocean from any cell directly adjacent to the ocean.\n\nReturn a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.',
    examples: [
      {
        input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
        output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
        explanation: 'Water from the returned coordinates can reach both oceans via adjacent non-increasing heights.',
      },
      {
        input: 'heights = [[1]]',
        output: '[[0,0]]',
        explanation: 'The single cell borders both the Pacific and Atlantic oceans.',
      },
    ],
    constraints: [
      'm == heights.length',
      'n == heights[r].length',
      '1 <= m, n <= 200',
      '0 <= heights[r][c] <= 10^5',
    ],
    hints: [
      'Traverse uphill starting from both oceans.',
      'Start with the constraints and choose a reverse dfs approach before coding.',
    ],
  },
  {
    title: 'Network Delay Time',
    slug: 'network-delay-time',
    difficulty: 'Medium',
    topics: ['Graphs', 'Heap / Priority Queue'],
    concepts: ['Dijkstra shortest path'],
    description:
      'You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.',
    examples: [
      {
        input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2',
        output: '2',
        explanation: 'Signal starts at node 2. Reaches 1 and 3 in 1 time unit, and 4 in 2 time units. Max time to reach all nodes is 2.',
      },
      {
        input: 'times = [[1,2,1]], n = 2, k = 1',
        output: '1',
        explanation: 'Signal travels from node 1 to 2 in 1 unit.',
      },
      {
        input: 'times = [[1,2,1]], n = 2, k = 2',
        output: '-1',
        explanation: 'Node 1 is unreachable from node 2, so signal cannot reach all nodes.',
      },
    ],
    constraints: [
      '1 <= k <= n <= 100',
      '1 <= times.length <= 6000',
      'times[i].length == 3',
      '1 <= ui, vi <= n',
      'ui != vi',
      '0 <= wi <= 100',
      'All the pairs (ui, vi) are unique.',
    ],
    hints: [
      'Expand the next node with the smallest known travel time.',
      'Start with the constraints and choose a dijkstra shortest path approach before coding.',
    ],
  },
  {
    title: 'Word Ladder',
    slug: 'word-ladder',
    difficulty: 'Hard',
    topics: ['Graphs', 'Queue'],
    concepts: ['Breadth-first search', 'Word transformation'],
    description:
      'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n- Every adjacent pair of words differs by a single letter.\n- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.\n- sk == endWord\n\nGiven two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: '0',
        explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.',
      },
    ],
    constraints: [
      '1 <= beginWord.length <= 10',
      'endWord.length == beginWord.length',
      '1 <= wordList.length <= 5000',
      'wordList[i].length == beginWord.length',
      'beginWord, endWord, and wordList[i] consist of lowercase English letters.',
      'beginWord != endWord',
      'All the words in wordList are unique.',
    ],
    hints: [
      'Each BFS level represents one transformation step.',
      'Start with the constraints and choose a breadth-first search approach before coding.',
    ],
  },
  {
    title: 'Redundant Connection',
    slug: 'redundant-connection',
    difficulty: 'Medium',
    topics: ['Graphs'],
    concepts: ['Union find', 'Cycle detection'],
    description:
      'In this problem, a tree is an undirected graph that is connected and has no cycles.\n\nYou are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed. The graph is represented as an array edges of length n where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the graph.\n\nReturn an edge that can be removed so that the resulting graph is a tree of n nodes. If there are multiple answers, return the answer that occurs last in the input.',
    examples: [
      {
        input: 'edges = [[1,2],[1,3],[2,3]]',
        output: '[2,3]',
        explanation: 'The edge [2,3] introduces a cycle connecting 1, 2, and 3.',
      },
      {
        input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]',
        output: '[1,4]',
        explanation: 'Edge [1,4] creates a cycle among nodes 1, 2, 3, and 4.',
      },
    ],
    constraints: [
      'n == edges.length',
      '3 <= n <= 1000',
      'edges[i].length == 2',
      '1 <= ai < bi <= edges.length',
      'ai != bi',
      'There are no repeated edges.',
      'The given graph is connected.',
    ],
    hints: [
      'The first edge joining an existing component is redundant.',
      'Start with the constraints and choose a union find approach before coding.',
    ],
  },
  {
    title: 'Jump Game',
    slug: 'jump-game',
    difficulty: 'Medium',
    topics: ['Greedy', 'Arrays'],
    concepts: ['Reachability'],
    description:
      'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.',
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
        explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5',
    ],
    hints: [
      'Track the farthest reachable position.',
      'Start with the constraints and choose a reachability approach before coding.',
    ],
  },
  {
    title: 'Jump Game II',
    slug: 'jump-game-ii',
    difficulty: 'Medium',
    topics: ['Greedy', 'Arrays'],
    concepts: ['Greedy layers'],
    description:
      'You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0].\n\nEach element nums[i] represents the maximum length of a forward jump from index i. In other words, if you are at nums[i], you can jump to any nums[i + j] where:\n- 0 <= j <= nums[i] and\n- i + j < n\n\nReturn the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].',
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: '2',
        explanation: 'The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.',
      },
      {
        input: 'nums = [2,3,0,1,4]',
        output: '2',
        explanation: 'Jump to index 1, then jump 3 steps to index 4.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 1000',
      'It\'s guaranteed that you can reach nums[n - 1].',
    ],
    hints: [
      'Commit to a jump when the current range ends.',
      'Start with the constraints and choose a greedy layers approach before coding.',
    ],
  },
  {
    title: 'Gas Station',
    slug: 'gas-station',
    difficulty: 'Medium',
    topics: ['Greedy', 'Arrays'],
    concepts: ['Running balance'],
    description:
      'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].\n\nYou have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays gas and cost, return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.',
    examples: [
      {
        input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]',
        output: '3',
        explanation: 'Start at station 3 (index 3) and fill with 4 unit of gas. Complete circuit clockwise returning to 3 with remaining fuel.',
      },
      {
        input: 'gas = [2,3,4], cost = [3,4,3]',
        output: '-1',
        explanation: 'Total gas is 9, but total cost is 10. You cannot travel around the circuit no matter where you start.',
      },
    ],
    constraints: [
      'n == gas.length == cost.length',
      '1 <= n <= 10^5',
      '0 <= gas[i], cost[i] <= 10^4',
    ],
    hints: [
      'If the tank fails, every earlier start also fails.',
      'Start with the constraints and choose a running balance approach before coding.',
    ],
  },
  {
    title: 'Partition Labels',
    slug: 'partition-labels',
    difficulty: 'Medium',
    topics: ['Greedy', 'Strings'],
    concepts: ['Last occurrence'],
    description:
      'You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part.\n\nNote that the partition is done so that after concatenating all the parts in order, the resultant string should be s.\n\nReturn a list of integers representing the size of these parts.',
    examples: [
      {
        input: 's = "ababcbacadefegdehijhklij"',
        output: '[9,7,8]',
        explanation: 'The partition is "ababcbaca", "defegde", "hijhklij". Each letter appears in at most one part. A partition like "ababcbacadefegde", "hijhklij" is invalid because it has fewer parts.',
      },
      {
        input: 's = "eccbbbbdec"',
        output: '[10]',
        explanation: 'The letter \'e\' and \'c\' appear at both boundaries, so the whole string must remain one part.',
      },
    ],
    constraints: [
      '1 <= s.length <= 500',
      's consists of lowercase English letters.',
    ],
    hints: [
      'Extend each partition to its farthest last occurrence.',
      'Start with the constraints and choose a last occurrence approach before coding.',
    ],
  },
  {
    title: 'Valid Sudoku',
    slug: 'valid-sudoku',
    difficulty: 'Medium',
    topics: ['HashMap', 'Arrays'],
    concepts: ['Constraint tracking'],
    description:
      'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\n1. Each row must contain the digits 1-9 without repetition.\n2. Each column must contain the digits 1-9 without repetition.\n3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.\n\nNote: A Sudoku board (partially filled) could be valid but is not necessarily solvable.',
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: 'true',
        explanation: 'All filled digits obey row, column, and 3x3 block uniqueness rules.',
      },
      {
        input: 'board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: 'false',
        explanation: 'Top-left 3x3 block contains two 8s (at [0][0] and [3][0]).',
      },
    ],
    constraints: [
      'board.length == 9',
      'board[i].length == 9',
      'board[i][j] is a digit 1-9 or \'.\'.',
    ],
    hints: [
      'Track seen values for rows, columns, and boxes.',
      'Start with the constraints and choose a constraint tracking approach before coding.',
    ],
  },
  {
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    difficulty: 'Medium',
    topics: ['Recursion', 'Backtracking'],
    concepts: ['Constrained generation'],
    description:
      'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    examples: [
      {
        input: 'n = 3',
        output: '["((()))","(()())","(())()","()(())","()()()"]',
        explanation: 'There are 5 valid balanced combinations of 3 parenthesis pairs.',
      },
      {
        input: 'n = 1',
        output: '["()"]',
        explanation: 'Only 1 balanced combination exists for n = 1.',
      },
    ],
    constraints: [
      '1 <= n <= 8',
    ],
    hints: [
      'Never add more closing than opening brackets.',
      'Start with the constraints and choose a constrained generation approach before coding.',
    ],
  },
  {
    title: 'Subsets',
    slug: 'subsets',
    difficulty: 'Medium',
    topics: ['Recursion', 'Backtracking'],
    concepts: ['Decision tree'],
    description:
      'Given an integer array nums of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
        explanation: 'All 2^3 = 8 subsets are generated.',
      },
      {
        input: 'nums = [0]',
        output: '[[],[0]]',
        explanation: 'Subsets of [0] are the empty set and [0].',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique.',
    ],
    hints: [
      'At each value, branch into include or exclude.',
      'Start with the constraints and choose a decision tree approach before coding.',
    ],
  },
  {
    title: 'Permutations',
    slug: 'permutations',
    difficulty: 'Medium',
    topics: ['Recursion', 'Backtracking'],
    concepts: ['Used choices'],
    description:
      'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        explanation: 'All 3! = 6 distinct permutations are produced.',
      },
      {
        input: 'nums = [0,1]',
        output: '[[0,1],[1,0]]',
        explanation: 'The 2 permutations of two elements.',
      },
      {
        input: 'nums = [1]',
        output: '[[1]]',
        explanation: 'A single element has exactly 1 permutation.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10',
      'All the integers of nums are unique.',
    ],
    hints: [
      'Choose one unused value for each position.',
      'Start with the constraints and choose a used choices approach before coding.',
    ],
  },
  {
    title: 'Combination Sum',
    slug: 'combination-sum',
    difficulty: 'Medium',
    topics: ['Recursion', 'Backtracking'],
    concepts: ['Target search', 'Pruning'],
    description:
      'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.\n\nThe same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.\n\nThe test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.',
    examples: [
      {
        input: 'candidates = [2,3,6,7], target = 7',
        output: '[[2,2,3],[7]]',
        explanation: '2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations.',
      },
      {
        input: 'candidates = [2,3,5], target = 8',
        output: '[[2,2,2,2],[2,3,3],[3,5]]',
        explanation: 'Three combinations sum to 8.',
      },
      {
        input: 'candidates = [2], target = 1',
        output: '[]',
        explanation: 'No combination of 2 can sum to 1.',
      },
    ],
    constraints: [
      '1 <= candidates.length <= 30',
      '2 <= candidates[i] <= 40',
      'All elements of candidates are distinct.',
      '1 <= target <= 40',
    ],
    hints: [
      'Reuse a candidate only while the remaining target allows it.',
      'Start with the constraints and choose a target search approach before coding.',
    ],
  },
  {
    title: 'N Queens',
    slug: 'n-queens',
    difficulty: 'Hard',
    topics: ['Recursion', 'Backtracking'],
    concepts: ['Board constraints', 'Diagonal tracking'],
    description:
      'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\n\nGiven an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.\n\nEach solution contains a distinct board configuration of the n-queens\' placement, where \'Q\' and \'.\' both indicate a queen and an empty space, respectively.',
    examples: [
      {
        input: 'n = 4',
        output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
        explanation: 'There exist two distinct solutions to the 4-queens puzzle as shown above.',
      },
      {
        input: 'n = 1',
        output: '[["Q"]]',
        explanation: 'There is only 1 solution for a 1x1 board.',
      },
    ],
    constraints: [
      '1 <= n <= 9',
    ],
    hints: [
      'Track used columns and both diagonal directions.',
      'Start with the constraints and choose a board constraints approach before coding.',
    ],
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    topics: ['Recursion', 'Backtracking', 'Graphs'],
    concepts: ['Grid DFS', 'Backtracking'],
    description:
      'Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        explanation: 'The path A -> B -> C -> C -> E -> D traces the word successfully.',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
        explanation: 'S -> E -> E can be formed using adjacent cells.',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: 'false',
        explanation: 'The letter cell at index [0][1] cannot be reused in the same search.',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consists of only lowercase and uppercase English letters.',
    ],
    hints: [
      'Mark a cell while exploring, then restore it.',
      'Start with the constraints and choose a grid dfs approach before coding.',
    ],
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topics: ['Dynamic Programming'],
    concepts: ['Fibonacci recurrence'],
    description:
      'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1. 1+1+1 step, 2. 1+2 steps, 3. 2+1 steps.',
      },
      {
        input: 'n = 5',
        output: '8',
        explanation: 'Number of ways follows the Fibonacci sequence: 1, 2, 3, 5, 8.',
      },
    ],
    constraints: [
      '1 <= n <= 45',
    ],
    hints: [
      'Ways to reach a step come from the two previous steps.',
      'Start with the constraints and choose a fibonacci recurrence approach before coding.',
    ],
  },
  {
    title: 'House Robber',
    slug: 'house-robber',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Arrays'],
    concepts: ['Include/exclude DP'],
    description:
      'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.',
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: 'Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
    hints: [
      'Choose between robbing this house or keeping the prior best.',
      'Start with the constraints and choose a include/exclude dp approach before coding.',
    ],
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topics: ['Dynamic Programming'],
    concepts: ['Unbounded knapsack', 'Minimum DP'],
    description:
      'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).',
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Amount 3 cannot be formed using only coins of denomination 2.',
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0',
        explanation: 'Zero coins are needed to produce an amount of 0.',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    hints: [
      'Build the best answer for every smaller amount.',
      'Start with the constraints and choose a unbounded knapsack approach before coding.',
    ],
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Binary Search'],
    concepts: ['Patience sorting', 'Subsequence DP'],
    description:
      'Given an integer array nums, return the length of the longest strictly increasing subsequence.\n\nA subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements. For example, [3,6,2,7] is a subsequence of the array [0,3,1,6,2,2,7].\n\nAll elements in the chosen subsequence must satisfy nums[i] < nums[j] whenever i < j.',
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'The longest increasing subsequence is [2,3,7,101], therefore the length is 4. [2,3,7,18] is also a valid longest increasing subsequence.',
      },
      {
        input: 'nums = [0,1,0,3,2,3]',
        output: '4',
        explanation: 'One longest increasing subsequence is [0,1,2,3], with length 4.',
      },
      {
        input: 'nums = [7,7,7,7,7,7,7]',
        output: '1',
        explanation: 'Because the subsequence must be strictly increasing, any single element has length 1.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'Maintain the smallest possible tail for each length.',
      'Start with the constraints and choose a patience sorting approach before coding.',
    ],
  },
  {
    title: 'Word Break',
    slug: 'word-break',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Strings'],
    concepts: ['Prefix DP', 'Dictionary set'],
    description:
      'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.',
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: 'true',
        explanation: 'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: 'true',
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple". Note that you are allowed to reuse a dictionary word.',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: 'false',
        explanation: 'No segmentation can form "catsandog" completely.',
      },
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
      's and wordDict[i] consist of only lowercase English letters.',
      'All the strings of wordDict are unique.',
    ],
    hints: [
      'Mark a prefix reachable when a prior prefix plus a word works.',
      'Start with the constraints and choose a prefix dp approach before coding.',
    ],
  },
  {
    title: 'Edit Distance',
    slug: 'edit-distance',
    difficulty: 'Hard',
    topics: ['Dynamic Programming', 'Strings'],
    concepts: ['2D sequence DP'],
    description:
      'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (remove \'r\') -> ros (remove \'e\').',
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: '5',
        explanation: 'intention -> inention (remove \'t\') -> enention (replace \'i\' with \'e\') -> exention (replace \'n\' with \'x\') -> exection (replace \'n\' with \'c\') -> execution (insert \'u\').',
      },
    ],
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.',
    ],
    hints: [
      'Compare replace, delete, and insert transitions.',
      'Start with the constraints and choose a 2d sequence dp approach before coding.',
    ],
  },
  {
    title: 'Unique Paths',
    slug: 'unique-paths',
    difficulty: 'Medium',
    topics: ['Dynamic Programming'],
    concepts: ['Grid DP'],
    description:
      'There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.\n\nThe test cases are generated so that the answer will be less than or equal to 2 * 10^9.',
    examples: [
      {
        input: 'm = 3, n = 7',
        output: '28',
        explanation: 'There are 28 unique ways to traverse from (0, 0) to (2, 6) moving only right and down.',
      },
      {
        input: 'm = 3, n = 2',
        output: '3',
        explanation: 'From top-left, the 3 paths are: Right -> Down -> Down, Down -> Down -> Right, and Down -> Right -> Down.',
      },
    ],
    constraints: [
      '1 <= m, n <= 100',
    ],
    hints: [
      'Each cell receives paths from above and left.',
      'Start with the constraints and choose a grid dp approach before coding.',
    ],
  },
  {
    title: 'Decode Ways',
    slug: 'decode-ways',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Strings'],
    concepts: ['Decoding DP', 'String prefixes'],
    description:
      'A message containing letters from A-Z can be encoded into numbers using the following mapping:\n\'A\' -> "1", \'B\' -> "2", ..., \'Z\' -> "26".\n\nTo decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above. For example, "11106" can be mapped into "AAJF" with the grouping (1 1 10 6) or "KJF" with (11 10 6).\n\nNote that the grouping (1 11 06) is invalid because "06" cannot be mapped into \'F\' since "6" is different from "06".\n\nGiven a string s containing only digits, return the number of ways to decode it.',
    examples: [
      {
        input: 's = "12"',
        output: '2',
        explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).',
      },
      {
        input: 's = "226"',
        output: '3',
        explanation: '"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).',
      },
      {
        input: 's = "06"',
        output: '0',
        explanation: '"06" cannot be mapped to "F" because of the leading zero. No valid decodings exist.',
      },
    ],
    constraints: [
      '1 <= s.length <= 100',
      's contains only digits and may contain leading zero(s).',
    ],
    hints: [
      'Consider valid one-digit and two-digit decodings.',
      'Start with the constraints and choose a decoding dp approach before coding.',
    ],
  },
  {
    title: 'Partition Equal Subset Sum',
    slug: 'partition-equal-subset-sum',
    difficulty: 'Medium',
    topics: ['Dynamic Programming'],
    concepts: ['Subset sum', 'Boolean DP'],
    description:
      'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise.',
    examples: [
      {
        input: 'nums = [1,5,11,5]',
        output: 'true',
        explanation: 'The array can be partitioned as [1, 5, 5] and [11], each summing to 11.',
      },
      {
        input: 'nums = [1,2,3,5]',
        output: 'false',
        explanation: 'The array cannot be partitioned into equal sum subsets (total sum is 11, which is odd).',
      },
    ],
    constraints: [
      '1 <= nums.length <= 200',
      '1 <= nums[i] <= 100',
    ],
    hints: [
      'Reduce the goal to reaching half the total sum.',
      'Start with the constraints and choose a subset sum approach before coding.',
    ],
  },
  {
    title: 'Range Sum Query Immutable',
    slug: 'range-sum-query-immutable',
    difficulty: 'Easy',
    topics: ['Prefix Sum', 'Arrays'],
    concepts: ['Prefix sums'],
    description:
      'Given an integer array nums, handle multiple queries of the following type:\nCalculate the sum of the elements of nums between indices left and right inclusive where left <= right.\n\nImplement the NumArray class:\n- NumArray(int[] nums) Initializes the object with the integer array nums.\n- int sumRange(int left, int right) Returns the sum of the elements of nums between indices left and right inclusive (i.e. nums[left] + nums[left + 1] + ... + nums[right]).',
    examples: [
      {
        input: '["NumArray", "sumRange", "sumRange", "sumRange"]\n[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]',
        output: '[null, 1, -1, -3]',
        explanation: 'NumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]); numArray.sumRange(0, 2); // return (-2) + 0 + 3 = 1; numArray.sumRange(2, 5); // return 3 + (-5) + 2 + (-1) = -1; numArray.sumRange(0, 5); // return (-2) + 0 + 3 + (-5) + 2 + (-1) = -3.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^5 <= nums[i] <= 10^5',
      '0 <= left <= right < nums.length',
      'At most 10^4 calls will be made to sumRange.',
    ],
    hints: [
      'Store cumulative sums so a range is one subtraction.',
      'Start with the constraints and choose a prefix sums approach before coding.',
    ],
  },
  {
    title: 'Continuous Subarray Sum',
    slug: 'continuous-subarray-sum',
    difficulty: 'Medium',
    topics: ['Prefix Sum', 'HashMap'],
    concepts: ['Remainder map'],
    description:
      'Given an integer array nums and an integer k, return true if nums has a good subarray or false otherwise.\n\nA good subarray is defined as:\n- its length is at least two, and\n- the sum of the elements of the subarray is a multiple of k.\n\nNote that a multiple of k is an integer n such that n = x * k where x is an integer. 0 is always a multiple of k.',
    examples: [
      {
        input: 'nums = [23,2,4,6,7], k = 6',
        output: 'true',
        explanation: '[2, 4] is a continuous subarray of size 2 whose elements sum up to 6.',
      },
      {
        input: 'nums = [23,2,6,4,7], k = 6',
        output: 'true',
        explanation: '[23, 2, 6, 4, 7] is an alternating subarray of length 5 whose sum is 42, which is a multiple of 6.',
      },
      {
        input: 'nums = [23,2,6,4,7], k = 13',
        output: 'false',
        explanation: 'No subarray of length at least 2 sums to a multiple of 13.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '0 <= nums[i] <= 10^9',
      '0 <= sum(nums[i]) <= 2^31 - 1',
      '1 <= k <= 2^31 - 1',
    ],
    hints: [
      'Repeated prefix remainders reveal divisible subarrays.',
      'Start with the constraints and choose a remainder map approach before coding.',
    ],
  },
  {
    title: 'Count of Range Sum',
    slug: 'count-of-range-sum',
    difficulty: 'Hard',
    topics: ['Prefix Sum', 'Binary Search'],
    concepts: ['Prefix sums', 'Merge sort counting'],
    description:
      'Given an integer array nums and two integers lower and upper, return the number of range sums that lie in [lower, upper] inclusive.\n\nRange sum S(i, j) is defined as the sum of the elements in nums between indices i and j inclusive, where i <= j.',
    examples: [
      {
        input: 'nums = [-2,5,-1], lower = -2, upper = 2',
        output: '3',
        explanation: 'The three ranges are: [0,0] -> -2, [2,2] -> -1, and [0,2] -> 2, which all lie between -2 and 2.',
      },
      {
        input: 'nums = [0], lower = 0, upper = 0',
        output: '1',
        explanation: 'Single element 0 lies in [0, 0].',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '-10^5 <= lower <= upper <= 10^5',
      'The answer is guaranteed to fit in a 32-bit integer.',
    ],
    hints: [
      'Count valid prefix differences during merge sort.',
      'Start with the constraints and choose a prefix sums approach before coding.',
    ],
  },
]
