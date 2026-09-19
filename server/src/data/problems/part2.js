export const part2 = [
  {
    title: 'Happy Number',
    slug: 'happy-number',
    difficulty: 'Easy',
    topics: ['HashMap'],
    concepts: ['Cycle detection', 'Set membership'],
    description:
      'Write an algorithm to determine if a number n is happy.\n\nA happy number is a number defined by the following process:\n1. Starting with any positive integer, replace the number by the sum of the squares of its digits.\n2. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\n3. Those numbers for which this process ends in 1 are happy.\n\nReturn true if n is a happy number, and false if not.',
    examples: [
      {
        input: 'n = 19',
        output: 'true',
        explanation: '1^2 + 9^2 = 82 -> 8^2 + 2^2 = 68 -> 6^2 + 8^2 = 100 -> 1^2 + 0^2 + 0^2 = 1.',
      },
      {
        input: 'n = 2',
        output: 'false',
        explanation: 'Repeated sum of squares of digits enters an infinite repeating loop (4, 16, 37, 58, 89, 145, 42, 20, 4) without reaching 1.',
      },
    ],
    constraints: [
      '1 <= n <= 2^31 - 1',
    ],
    hints: [
      'Remember intermediate values to detect a loop.',
      'Start with the constraints and choose a cycle detection approach before coding.',
    ],
  },
  {
    title: 'Intersection of Two Arrays',
    slug: 'intersection-of-two-arrays',
    difficulty: 'Easy',
    topics: ['HashMap', 'Arrays'],
    concepts: ['Set intersection'],
    description:
      'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.',
    examples: [
      {
        input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
        output: '[2]',
        explanation: 'The only value common to both arrays is 2.',
      },
      {
        input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]',
        output: '[9,4]',
        explanation: '[4,9] is also accepted as elements can be in any order.',
      },
    ],
    constraints: [
      '1 <= nums1.length, nums2.length <= 1000',
      '0 <= nums1[i], nums2[i] <= 1000',
    ],
    hints: [
      'Put one array in a set.',
      'Start with the constraints and choose a set intersection approach before coding.',
    ],
  },
  {
    title: 'First Unique Character',
    slug: 'first-unique-character',
    difficulty: 'Easy',
    topics: ['HashMap', 'Strings'],
    concepts: ['Frequency counting'],
    description:
      'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
    examples: [
      {
        input: 's = "leetcode"',
        output: '0',
        explanation: 'The character "l" at index 0 is the first character that does not occur again in the string.',
      },
      {
        input: 's = "loveleetcode"',
        output: '2',
        explanation: 'The character "v" at index 2 is the first unique character.',
      },
      {
        input: 's = "aabb"',
        output: '-1',
        explanation: 'All characters repeat, so no non-repeating character exists.',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of only lowercase English letters.',
    ],
    hints: [
      'Count all characters, then scan again.',
      'Start with the constraints and choose a frequency counting approach before coding.',
    ],
  },
  {
    title: '3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Sorting', 'Duplicate skipping'],
    description:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'The distinct triplets that sum to 0 are [-1,0,1] and [-1,-1,2].',
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'The only possible triplet does not sum up to 0.',
      },
      {
        input: 'nums = [0,0,0]',
        output: '[[0,0,0]]',
        explanation: 'The only possible triplet sums up to 0.',
      },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    hints: [
      'Sort first, then fix one number and sweep two pointers.',
      'Start with the constraints and choose a sorting approach before coding.',
    ],
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Greedy pointer movement'],
    description:
      'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store. Notice that you may not slant the container.',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The vertical lines at index 1 (height 8) and index 8 (height 7) define a width of 7 and height of min(8,7)=7, resulting in area 7 * 7 = 49.',
      },
      {
        input: 'height = [1,1]',
        output: '1',
        explanation: 'Width is 1 and minimum height is 1, so maximum area is 1.',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    hints: [
      'Move the pointer at the shorter line.',
      'Start with the constraints and choose a greedy pointer movement approach before coding.',
    ],
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Left/right maxima'],
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water across the various valleys.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: 'Between the boundary heights of 4 and 5, a total of 9 units of water are trapped.',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    hints: [
      'The smaller side determines trapped water.',
      'Start with the constraints and choose a left/right maxima approach before coding.',
    ],
  },
  {
    title: 'Two Sum II',
    slug: 'two-sum-ii',
    difficulty: 'Medium',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Sorted search'],
    description:
      'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.\n\nReturn the indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2.\n\nThe tests are generated such that there is exactly one solution. You may not use the same element twice.',
    examples: [
      {
        input: 'numbers = [2,7,11,15], target = 9',
        output: '[1,2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].',
      },
      {
        input: 'numbers = [2,3,4], target = 6',
        output: '[1,3]',
        explanation: 'The sum of 2 and 4 is 6. index1 = 1, index2 = 3. We return [1, 3].',
      },
      {
        input: 'numbers = [-1,0], target = -1',
        output: '[1,2]',
        explanation: 'The sum of -1 and 0 is -1. index1 = 1, index2 = 2. We return [1, 2].',
      },
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.',
    ],
    hints: [
      'Compare the sum at both ends of the sorted array.',
      'Start with the constraints and choose a sorted search approach before coding.',
    ],
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    difficulty: 'Easy',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Read/write pointers'],
    description:
      'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.\n\nConsider the number of unique elements of nums to be k. To get accepted, you need to change the array nums such that the first k elements of nums contain the unique elements in the order they were present in nums initially.',
    examples: [
      {
        input: 'nums = [1,1,2]',
        output: '2',
        explanation: 'Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.',
      },
      {
        input: 'nums = [0,0,1,1,1,2,2,3,3,4]',
        output: '5',
        explanation: 'Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '-100 <= nums[i] <= 100',
      'nums is sorted in non-decreasing order.',
    ],
    hints: [
      'Write each newly seen value once.',
      'Start with the constraints and choose a read/write pointers approach before coding.',
    ],
  },
  {
    title: 'Sort Colors',
    slug: 'sort-colors',
    difficulty: 'Medium',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['Dutch national flag'],
    description:
      'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively. You must solve this problem without using the library\'s sort function.',
    examples: [
      {
        input: 'nums = [2,0,2,1,1,0]',
        output: '[0,0,1,1,2,2]',
        explanation: 'Elements are rearranged in-place so all 0s precede 1s, which precede 2s.',
      },
      {
        input: 'nums = [2,0,1]',
        output: '[0,1,2]',
        explanation: 'Sorting in-place yields [0, 1, 2].',
      },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 300',
      'nums[i] is either 0, 1, or 2.',
    ],
    hints: [
      'Maintain low, current, and high regions.',
      'Start with the constraints and choose a dutch national flag approach before coding.',
    ],
  },
  {
    title: 'Minimum Size Subarray Sum',
    slug: 'minimum-size-subarray-sum',
    difficulty: 'Medium',
    topics: ['Arrays', 'Sliding Window'],
    concepts: ['Positive sum window'],
    description:
      'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.',
    examples: [
      {
        input: 'target = 7, nums = [2,3,1,2,4,3]',
        output: '2',
        explanation: 'The subarray [4,3] has the minimal length under the problem constraint.',
      },
      {
        input: 'target = 4, nums = [1,4,4]',
        output: '1',
        explanation: 'The single element [4] satisfies the target >= 4.',
      },
      {
        input: 'target = 11, nums = [1,1,1,1,1,1,1,1]',
        output: '0',
        explanation: 'The total sum of all elements is 8, which is less than 11.',
      },
    ],
    constraints: [
      '1 <= target <= 10^9',
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^4',
    ],
    hints: [
      'Shrink the window whenever its sum is enough.',
      'Start with the constraints and choose a positive sum window approach before coding.',
    ],
  },
  {
    title: 'Permutation in String',
    slug: 'permutation-in-string',
    difficulty: 'Medium',
    topics: ['Strings', 'Sliding Window'],
    concepts: ['Fixed-size frequency window'],
    description:
      'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.\n\nIn other words, return true if one of s1\'s permutations is the substring of s2.',
    examples: [
      {
        input: 's1 = "ab", s2 = "eidbaooo"',
        output: 'true',
        explanation: 's2 contains one permutation of s1 ("ba").',
      },
      {
        input: 's1 = "ab", s2 = "eidboaoo"',
        output: 'false',
        explanation: 'Neither "ab" nor "ba" occurs as a substring in s2.',
      },
    ],
    constraints: [
      '1 <= s1.length, s2.length <= 10^4',
      's1 and s2 consist of lowercase English letters.',
    ],
    hints: [
      'Keep a window exactly as long as the pattern.',
      'Start with the constraints and choose a fixed-size frequency window approach before coding.',
    ],
  },
  {
    title: 'Find All Anagrams in a String',
    slug: 'find-all-anagrams-in-a-string',
    difficulty: 'Medium',
    topics: ['Strings', 'Sliding Window'],
    concepts: ['Fixed-size frequency window'],
    description:
      'Given two strings s and p, return an array of all the start indices of p\'s anagrams in s. You may return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 's = "cbaebabacd", p = "abc"',
        output: '[0,6]',
        explanation: 'The substring with start index = 0 is "cba", which is an anagram of "abc". The substring with start index = 6 is "bac", which is an anagram of "abc".',
      },
      {
        input: 's = "abab", p = "ab"',
        output: '[0,1,2]',
        explanation: 'The substrings with start indices 0, 1, and 2 are "ab", "ba", and "ab", all anagrams of "ab".',
      },
    ],
    constraints: [
      '1 <= s.length, p.length <= 3 * 10^4',
      's and p consist of lowercase English letters.',
    ],
    hints: [
      'Slide a frequency-matched window.',
      'Start with the constraints and choose a fixed-size frequency window approach before coding.',
    ],
  },
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    topics: ['Arrays', 'Sliding Window', 'Queue'],
    concepts: ['Monotonic deque'],
    description:
      'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.',
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Window positions produce maximums: [1 3 -1]->3, [3 -1 -3]->3, [-1 -3 5]->5, [-3 5 3]->5, [5 3 6]->6, [3 6 7]->7.',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: 'Single element window returns [1].',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length',
    ],
    hints: [
      'Keep candidate indices in decreasing value order.',
      'Start with the constraints and choose a monotonic deque approach before coding.',
    ],
  },
  {
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    difficulty: 'Medium',
    topics: ['Stack', 'Arrays'],
    concepts: ['Monotonic stack'],
    description:
      'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.',
    examples: [
      {
        input: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]',
        explanation: 'At index 0 (73), day 1 (74) is warmer (1 day wait). At index 2 (75), day 6 (76) is warmer (4 days wait).',
      },
      {
        input: 'temperatures = [30,40,50,60]',
        output: '[1,1,1,0]',
        explanation: 'Each day is warmer than the previous day except the last day.',
      },
      {
        input: 'temperatures = [30,60,90]',
        output: '[1,1,0]',
        explanation: 'Waits are 1 day, 1 day, and 0 for the final day.',
      },
    ],
    constraints: [
      '1 <= temperatures.length <= 10^5',
      '30 <= temperatures[i] <= 100',
    ],
    hints: [
      'Store unresolved indices in decreasing temperature order.',
      'Start with the constraints and choose a monotonic stack approach before coding.',
    ],
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topics: ['Stack', 'Strings'],
    concepts: ['Matching delimiters'],
    description:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The opening parenthesis matches its corresponding closing parenthesis.',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All bracket pairs are properly closed in valid order.',
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatched bracket types: "(" cannot be closed by "]".',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    hints: [
      'Push opening brackets and match closers.',
      'Start with the constraints and choose a matching delimiters approach before coding.',
    ],
  },
  {
    title: 'Min Stack',
    slug: 'min-stack',
    difficulty: 'Medium',
    topics: ['Stack'],
    concepts: ['Auxiliary minimum stack'],
    description:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- void push(int val) pushes the element val onto the stack.\n- void pop() removes the element on the top of the stack.\n- int top() gets the top element of the stack.\n- int getMin() retrieves the minimum element in the stack.\n\nYou must implement a solution with O(1) time complexity for each function.',
    examples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
        output: '[null,null,null,null,-3,null,0,-2]',
        explanation: 'MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); // return -3; minStack.pop(); minStack.top(); // return 0; minStack.getMin(); // return -2.',
      },
    ],
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top and getMin operations will always be called on non-empty stacks.',
      'At most 3 * 10^4 calls will be made to push, pop, top, and getMin.',
    ],
    hints: [
      'Store the minimum alongside each value.',
      'Start with the constraints and choose a auxiliary minimum stack approach before coding.',
    ],
  },
  {
    title: 'Evaluate Reverse Polish Notation',
    slug: 'evaluate-reverse-polish-notation',
    difficulty: 'Medium',
    topics: ['Stack'],
    concepts: ['Expression evaluation'],
    description:
      'You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation (postfix notation).\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n- The valid operators are \'+\', \'-\', \'*\', and \'/\'.\n- Each operand may be an integer or another expression.\n- The division between two integers always truncates toward zero.\n- There will not be any division by zero.',
    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: '9',
        explanation: '((2 + 1) * 3) = 9.',
      },
      {
        input: 'tokens = ["4","13","5","/","+"]',
        output: '6',
        explanation: '(4 + (13 / 5)) = 4 + 2 = 6.',
      },
      {
        input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',
        output: '22',
        explanation: 'Evaluates step by step following operator precedence to 22.',
      },
    ],
    constraints: [
      '1 <= tokens.length <= 10^4',
      'tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].',
    ],
    hints: [
      'Pop two operands whenever you see an operator.',
      'Start with the constraints and choose a expression evaluation approach before coding.',
    ],
  },
  {
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    difficulty: 'Hard',
    topics: ['Stack', 'Arrays'],
    concepts: ['Monotonic stack', 'Boundaries'],
    description:
      'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    examples: [
      {
        input: 'heights = [2,1,5,6,2,3]',
        output: '10',
        explanation: 'The largest rectangle is formed by the two bars at indices 2 and 3 with heights 5 and 6, spanning width 2 with minimum height 5, area = 10.',
      },
      {
        input: 'heights = [2,4]',
        output: '4',
        explanation: 'Bar 4 alone yields area 4, or both bars together give width 2 * height 2 = 4.',
      },
    ],
    constraints: [
      '1 <= heights.length <= 10^5',
      '0 <= heights[i] <= 10^4',
    ],
    hints: [
      'Resolve bars when a smaller height arrives.',
      'Start with the constraints and choose a monotonic stack approach before coding.',
    ],
  },
  {
    title: 'Simplify Path',
    slug: 'simplify-path',
    difficulty: 'Medium',
    topics: ['Stack', 'Strings'],
    concepts: ['Path normalization'],
    description:
      'Given an absolute path for a Unix-style file system, which begins with a slash \'/\', transform this path into its simplified canonical path.\n\nIn Unix-style file system:\n- A period \'.\' refers to the current directory.\n- A double period \'..\' refers to the directory up a level.\n- Multiple consecutive slashes are treated as a single slash \'/\'.\n\nThe canonical path must start with a single slash, not end with a trailing slash (unless it is the root), and contain only valid directory names separated by single slashes.',
    examples: [
      {
        input: 'path = "/home/"',
        output: '"/home"',
        explanation: 'Trailing slash is removed in the canonical path.',
      },
      {
        input: 'path = "/home//foo/"',
        output: '"/home/foo"',
        explanation: 'Multiple consecutive slashes are replaced by a single slash.',
      },
      {
        input: 'path = "/home/user/Documents/../Pictures"',
        output: '"/home/user/Pictures"',
        explanation: '".." moves up one directory level from Documents to user.',
      },
    ],
    constraints: [
      '1 <= path.length <= 3000',
      'path consists of English letters, digits, period \'.\', slash \'/\' or \'_\'.',
      'path is a valid absolute Unix path.',
    ],
    hints: [
      'Treat directory names as stack entries.',
      'Start with the constraints and choose a path normalization approach before coding.',
    ],
  },
  {
    title: 'Implement Queue Using Stacks',
    slug: 'implement-queue-using-stacks',
    difficulty: 'Easy',
    topics: ['Queue', 'Stack'],
    concepts: ['Amortized transfer'],
    description:
      'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).\n\nImplement the MyQueue class:\n- void push(int x) Pushes element x to the back of the queue.\n- int pop() Removes the element from the front of the queue and returns it.\n- int peek() Returns the element at the front of the queue.\n- boolean empty() Returns true if the queue is empty, false otherwise.',
    examples: [
      {
        input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
        output: '[null, null, null, 1, 1, false]',
        explanation: 'MyQueue myQueue = new MyQueue(); myQueue.push(1); myQueue.push(2); myQueue.peek(); // return 1; myQueue.pop(); // return 1; myQueue.empty(); // return false.',
      },
    ],
    constraints: [
      '1 <= x <= 9',
      'At most 100 calls will be made to push, pop, peek, and empty.',
      'All the calls to pop and peek are valid.',
    ],
    hints: [
      'Transfer only when the output stack is empty.',
      'Start with the constraints and choose a amortized transfer approach before coding.',
    ],
  },
  {
    title: 'Design Circular Queue',
    slug: 'design-circular-queue',
    difficulty: 'Medium',
    topics: ['Queue'],
    concepts: ['Circular buffer'],
    description:
      'Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".\n\nImplement the MyCircularQueue class:\n- MyCircularQueue(k) Initializes the object with the size of the queue to be k.\n- int Front() Gets the front item from the queue. If the queue is empty, return -1.\n- int Rear() Gets the last item from the queue. If the queue is empty, return -1.\n- boolean enQueue(int value) Inserts an element into the circular queue. Return true if the operation is successful.\n- boolean deQueue() Deletes an element from the circular queue. Return true if the operation is successful.\n- boolean isEmpty() Checks whether the circular queue is empty or not.\n- boolean isFull() Checks whether the circular queue is full or not.',
    examples: [
      {
        input: '["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]\n[[3], [1], [2], [3], [4], [], [], [], [4], []]',
        output: '[null, true, true, true, false, 3, true, true, true, 4]',
        explanation: 'Queue with capacity 3 accepts 1, 2, 3. Adding 4 fails because it is full. Dequeuing enables enqueueing 4, rear becomes 4.',
      },
    ],
    constraints: [
      '1 <= k <= 1000',
      '0 <= value <= 1000',
      'At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull.',
    ],
    hints: [
      'Use modular arithmetic for front and rear.',
      'Start with the constraints and choose a circular buffer approach before coding.',
    ],
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    topics: ['Linked List'],
    concepts: ['Pointer reversal'],
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'The pointers of all consecutive nodes are inverted to point backwards.',
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
        explanation: '1 -> 2 is reversed to 2 -> 1.',
      },
      {
        input: 'head = []',
        output: '[]',
        explanation: 'Reversing an empty list returns an empty list.',
      },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    hints: [
      'Keep previous, current, and next pointers.',
      'Start with the constraints and choose a pointer reversal approach before coding.',
    ],
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    topics: ['Linked List'],
    concepts: ['Dummy head', 'Merge'],
    description:
      'You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Nodes from both sorted lists are woven together in non-decreasing order.',
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
        explanation: 'Merging two empty lists results in an empty list.',
      },
      {
        input: 'list1 = [], list2 = [0]',
        output: '[0]',
        explanation: 'Merging an empty list with [0] yields [0].',
      },
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    hints: [
      'Attach the smaller current node each time.',
      'Start with the constraints and choose a dummy head approach before coding.',
    ],
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    difficulty: 'Easy',
    topics: ['Linked List'],
    concepts: ['Fast and slow pointers'],
    description:
      'Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail\'s next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.',
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).',
      },
      {
        input: 'head = [1,2], pos = 0',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 0th node.',
      },
      {
        input: 'head = [1], pos = -1',
        output: 'false',
        explanation: 'There is no cycle in the linked list.',
      },
    ],
    constraints: [
      'The number of the nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5',
      'pos is -1 or a valid index in the linked-list.',
    ],
    hints: [
      'A faster pointer catches a slower one in a cycle.',
      'Start with the constraints and choose a fast and slow pointers approach before coding.',
    ],
  },
  {
    title: 'Remove Nth Node From End',
    slug: 'remove-nth-node-from-end',
    difficulty: 'Medium',
    topics: ['Linked List', 'Two Pointers'],
    concepts: ['Fixed gap pointers'],
    description:
      'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    examples: [
      {
        input: 'head = [1,2,3,4,5], n = 2',
        output: '[1,2,3,5]',
        explanation: 'The 2nd node from the end is node 4. After removing it, list becomes 1 -> 2 -> 3 -> 5.',
      },
      {
        input: 'head = [1], n = 1',
        output: '[]',
        explanation: 'Removing the single node leaves an empty list.',
      },
      {
        input: 'head = [1,2], n = 1',
        output: '[1]',
        explanation: 'Removing the last node (2) leaves [1].',
      },
    ],
    constraints: [
      'The number of nodes in the list is sz.',
      '1 <= sz <= 30',
      '0 <= Node.val <= 100',
      '1 <= n <= sz',
    ],
    hints: [
      'Create an n-node gap with two pointers.',
      'Start with the constraints and choose a fixed gap pointers approach before coding.',
    ],
  },
]
