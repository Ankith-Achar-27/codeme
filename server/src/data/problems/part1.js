export const part1 = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topics: ['Arrays', 'HashMap'],
    concepts: ['Complement lookup', 'Hash table'],
    description:
      'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.\n\nYou may assume that each input will have exactly one solution, and you cannot use the same element twice. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'Store each seen value and look for its complement.',
      'Start with the constraints and choose a complement lookup approach before coding.',
    ],
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    topics: ['Arrays'],
    concepts: ['Running minimum', 'One pass'],
    description:
      'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    hints: [
      'Track the lowest buy price seen so far.',
      'Start with the constraints and choose a running minimum approach before coding.',
    ],
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    topics: ['Arrays', 'HashMap'],
    concepts: ['Set membership'],
    description:
      'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
        explanation: 'The element 1 occurs at index 0 and index 3.',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
        explanation: 'All elements in the array are distinct.',
      },
      {
        input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
        explanation: 'Multiple elements appear more than once.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    hints: [
      'A set exposes the first repeated value.',
      'Start with the constraints and choose a set membership approach before coding.',
    ],
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    topics: ['Arrays', 'Prefix Sum'],
    concepts: ['Prefix product', 'Suffix product'],
    description:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: 'At index 0: 2*3*4=24. At index 1: 1*3*4=12. At index 2: 1*2*4=8. At index 3: 1*2*3=6.',
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]',
        explanation: 'The zero element causes all other positions to have product 0, while index 2 has product (-1)*1*(-3)*3=9.',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.',
    ],
    hints: [
      'Build left and right products without division.',
      'Start with the constraints and choose a prefix product approach before coding.',
    ],
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topics: ['Arrays', 'Dynamic Programming'],
    concepts: ['Kadane algorithm', 'Running best'],
    description:
      'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.',
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The contiguous subarray [4,-1,2,1] has the largest sum = 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The entire array [5,4,-1,7,8] has the largest sum 23.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'Either extend the current sum or start fresh.',
      'Start with the constraints and choose a kadane algorithm approach before coding.',
    ],
  },
  {
    title: 'Majority Element',
    slug: 'majority-element',
    difficulty: 'Easy',
    topics: ['Arrays'],
    concepts: ['Boyer-Moore voting'],
    description:
      'Given an array nums of size n, return the majority element.\n\nThe majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
    examples: [
      {
        input: 'nums = [3,2,3]',
        output: '3',
        explanation: '3 appears 2 times in an array of size 3, which is greater than ⌊3 / 2⌋ = 1.',
      },
      {
        input: 'nums = [2,2,1,1,1,2,2]',
        output: '2',
        explanation: '2 appears 4 times in an array of size 7, which is greater than ⌊7 / 2⌋ = 3.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5 * 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'The majority element always exists.',
    ],
    hints: [
      'A majority survives pairwise cancellation.',
      'Start with the constraints and choose a boyer-moore voting approach before coding.',
    ],
  },
  {
    title: 'Move Zeroes',
    slug: 'move-zeroes',
    difficulty: 'Easy',
    topics: ['Arrays', 'Two Pointers'],
    concepts: ['In-place partition'],
    description:
      'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.',
    examples: [
      {
        input: 'nums = [0,1,0,3,12]',
        output: '[1,3,12,0,0]',
        explanation: 'All non-zero elements (1, 3, 12) preserve order, and both zeros shift to the end.',
      },
      {
        input: 'nums = [0]',
        output: '[0]',
        explanation: 'Only one element zero exists, so array remains [0].',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
    ],
    hints: [
      'Write nonzero values forward, then fill the rest.',
      'Start with the constraints and choose a in-place partition approach before coding.',
    ],
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    difficulty: 'Medium',
    topics: ['Arrays'],
    concepts: ['Array reversal', 'Modular indexing'],
    description:
      'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.\n\nYou should modify the input array in-place with O(1) extra memory.',
    examples: [
      {
        input: 'nums = [1,2,3,4,5,6,7], k = 3',
        output: '[5,6,7,1,2,3,4]',
        explanation: 'Rotate 1 step right: [7,1,2,3,4,5,6]. 2 steps: [6,7,1,2,3,4,5]. 3 steps: [5,6,7,1,2,3,4].',
      },
      {
        input: 'nums = [-1,-100,3,99], k = 2',
        output: '[3,99,-1,-100]',
        explanation: 'Rotate 1 step right: [99,-1,-100,3]. 2 steps: [3,99,-1,-100].',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-2^31 <= nums[i] <= 2^31 - 1',
      '0 <= k <= 10^5',
    ],
    hints: [
      'Three reversals rotate in place.',
      'Start with the constraints and choose a array reversal approach before coding.',
    ],
  },
  {
    title: 'Set Matrix Zeroes',
    slug: 'set-matrix-zeroes',
    difficulty: 'Medium',
    topics: ['Arrays'],
    concepts: ['In-place markers'],
    description:
      'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0s.\n\nYou must do it in place without allocating another matrix.',
    examples: [
      {
        input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
        output: '[[1,0,1],[0,0,0],[1,0,1]]',
        explanation: 'The element at row 1, col 1 is 0, so entire row 1 and column 1 become 0.',
      },
      {
        input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]',
        output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]',
        explanation: 'Row 0 and columns 0 and 3 have zeros, so they are entirely zeroed.',
      },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[0].length',
      '1 <= m, n <= 200',
      '-2^31 <= matrix[i][j] <= 2^31 - 1',
    ],
    hints: [
      'Use the first row and column as markers.',
      'Start with the constraints and choose a in-place markers approach before coding.',
    ],
  },
  {
    title: 'Spiral Matrix',
    slug: 'spiral-matrix',
    difficulty: 'Medium',
    topics: ['Arrays'],
    concepts: ['Boundary traversal'],
    description:
      'Given an m x n matrix, return all elements of the matrix in spiral order, starting from the top-left corner and traversing clockwise.',
    examples: [
      {
        input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,6,9,8,7,4,5]',
        explanation: 'Traverse right along top row, down right column, left along bottom row, and up left column.',
      },
      {
        input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]',
        output: '[1,2,3,4,8,12,11,10,9,5,6,7]',
        explanation: 'Clockwise spiral unrolls all rows and columns layer by layer.',
      },
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100',
    ],
    hints: [
      'Shrink four boundaries after each direction.',
      'Start with the constraints and choose a boundary traversal approach before coding.',
    ],
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    topics: ['Strings', 'HashMap'],
    concepts: ['Frequency counting'],
    description:
      'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both strings contain three "a"s, one "n", one "g", one "r", and one "m".',
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: 'The characters and their counts do not match.',
      },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    hints: [
      'Compare character frequencies.',
      'Start with the constraints and choose a frequency counting approach before coding.',
    ],
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topics: ['Strings', 'Two Pointers'],
    concepts: ['Character filtering'],
    description:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" reads identically forward and backward.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters, which is a palindrome.',
      },
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.',
    ],
    hints: [
      'Skip non-alphanumeric characters from both ends.',
      'Start with the constraints and choose a character filtering approach before coding.',
    ],
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    topics: ['Strings'],
    concepts: ['Vertical scanning'],
    description:
      'Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string "".',
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: 'The longest prefix shared by all three strings is "fl".',
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: 'There is no common prefix among the input strings.',
      },
    ],
    constraints: [
      '1 <= strs.length <= 200',
      '0 <= strs[i].length <= 200',
      'strs[i] consists of only lowercase English letters.',
    ],
    hints: [
      'Compare each position until one string differs.',
      'Start with the constraints and choose a vertical scanning approach before coding.',
    ],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topics: ['Strings', 'Sliding Window', 'HashMap'],
    concepts: ['Moving window', 'Last seen index'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Note that "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    hints: [
      'Move the left boundary past duplicate characters.',
      'Start with the constraints and choose a moving window approach before coding.',
    ],
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'Medium',
    topics: ['Strings', 'HashMap'],
    concepts: ['Canonical key', 'Frequency signature'],
    description:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Words with identical letter frequencies form matching groups.',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: 'An empty string forms its own group.',
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: 'Single character string forms its own group.',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    hints: [
      'Use sorted letters or counts as the group key.',
      'Start with the constraints and choose a canonical key approach before coding.',
    ],
  },
  {
    title: 'String to Integer',
    slug: 'string-to-integer',
    difficulty: 'Medium',
    topics: ['Strings'],
    concepts: ['Parsing', 'Overflow handling'],
    description:
      'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.\n\nThe algorithm must discard leading whitespace, check for an optional sign ("+" or "-"), read continuous digits until a non-digit is encountered, and clamp the integer within [-2^31, 2^31 - 1] if overflow occurs.',
    examples: [
      {
        input: 's = "42"',
        output: '42',
        explanation: 'The integer 42 is parsed directly.',
      },
      {
        input: 's = "   -042"',
        output: '-42',
        explanation: 'Leading whitespace is ignored, sign is "-", and digits "042" parse to -42.',
      },
      {
        input: 's = "1337c0d3"',
        output: '1337',
        explanation: 'Parsing stops when the character "c" is encountered.',
      },
    ],
    constraints: [
      '0 <= s.length <= 200',
      's consists of English letters, digits, " ", "+", "-", and ".".',
    ],
    hints: [
      'Consume whitespace, sign, then digits carefully.',
      'Start with the constraints and choose a parsing approach before coding.',
    ],
  },
  {
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    topics: ['Strings', 'Dynamic Programming'],
    concepts: ['Expand around center'],
    description:
      'Given a string s, return the longest palindromic substring in s.\n\nA string is palindromic if it reads the same forward and backward.',
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: '"bb" is the longest palindromic substring.',
      },
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.',
    ],
    hints: [
      'Every palindrome has one or two centers.',
      'Start with the constraints and choose a expand around center approach before coding.',
    ],
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    topics: ['Strings', 'Sliding Window', 'HashMap'],
    concepts: ['Need window', 'Frequency counting'],
    description:
      'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".\n\nThe testcases will be generated such that the answer is unique.',
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes "A", "B", and "C" from string t.',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: 'The entire string s is the minimum window.',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: 'Both "a"s from t must be included, so no valid window exists.',
      },
    ],
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.',
    ],
    hints: [
      'Expand until valid, then shrink while it stays valid.',
      'Start with the constraints and choose a need window approach before coding.',
    ],
  },
  {
    title: 'Encode and Decode Strings',
    slug: 'encode-and-decode-strings',
    difficulty: 'Medium',
    topics: ['Strings'],
    concepts: ['Length prefix encoding'],
    description:
      'Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and decoded back to the original list of strings.\n\nPlease implement encode and decode functions that can handle any possible ASCII characters, including delimiters and spaces.',
    examples: [
      {
        input: 'dummy_input = ["lint","code","love","you"]',
        output: '["lint","code","love","you"]',
        explanation: 'One common encoding uses length prefixes such as "4#lint4#code4#love3#you", which decodes unambiguously.',
      },
      {
        input: 'dummy_input = ["we", "say", ":", "yes"]',
        output: '["we", "say", ":", "yes"]',
        explanation: 'Special characters and colons are preserved because the length specifies exactly how many characters to read.',
      },
    ],
    constraints: [
      '0 <= dummy_input.length <= 200',
      '0 <= dummy_input[i].length <= 200',
      'dummy_input[i] contains any possible character with 256 ASCII characters.',
    ],
    hints: [
      'Prefix each string with its length.',
      'Start with the constraints and choose a length prefix encoding approach before coding.',
    ],
  },
  {
    title: 'Find the Index of First Occurrence',
    slug: 'find-the-index-of-first-occurrence',
    difficulty: 'Easy',
    topics: ['Strings'],
    concepts: ['Substring matching'],
    description:
      'Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.',
    examples: [
      {
        input: 'haystack = "sadbutsad", needle = "sad"',
        output: '0',
        explanation: '"sad" occurs at index 0 and 6. The first occurrence is at index 0.',
      },
      {
        input: 'haystack = "leetcode", needle = "leeto"',
        output: '-1',
        explanation: '"leeto" did not occur in "leetcode", so we return -1.',
      },
    ],
    constraints: [
      '1 <= haystack.length, needle.length <= 10^4',
      'haystack and needle consist of only lowercase English characters.',
    ],
    hints: [
      'Compare each possible start position.',
      'Start with the constraints and choose a substring matching approach before coding.',
    ],
  },
  {
    title: 'Ransom Note',
    slug: 'ransom-note',
    difficulty: 'Easy',
    topics: ['HashMap', 'Strings'],
    concepts: ['Frequency counting'],
    description:
      'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.\n\nEach letter in magazine can only be used once in ransomNote.',
    examples: [
      {
        input: 'ransomNote = "a", magazine = "b"',
        output: 'false',
        explanation: 'The magazine does not contain the letter "a".',
      },
      {
        input: 'ransomNote = "aa", magazine = "ab"',
        output: 'false',
        explanation: 'The magazine only contains one "a", but ransomNote needs two.',
      },
      {
        input: 'ransomNote = "aa", magazine = "aab"',
        output: 'true',
        explanation: 'Both "a"s can be supplied from the magazine.',
      },
    ],
    constraints: [
      '1 <= ransomNote.length, magazine.length <= 10^5',
      'ransomNote and magazine consist of lowercase English letters.',
    ],
    hints: [
      'Count available letters, then spend them.',
      'Start with the constraints and choose a frequency counting approach before coding.',
    ],
  },
  {
    title: 'Isomorphic Strings',
    slug: 'isomorphic-strings',
    difficulty: 'Easy',
    topics: ['HashMap', 'Strings'],
    concepts: ['Bidirectional mapping'],
    description:
      'Given two strings s and t, determine if they are isomorphic.\n\nTwo strings s and t are isomorphic if the characters in s can be replaced to get t. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.',
    examples: [
      {
        input: 's = "egg", t = "add"',
        output: 'true',
        explanation: '"e" maps to "a" and "g" maps to "d".',
      },
      {
        input: 's = "foo", t = "bar"',
        output: 'false',
        explanation: '"o" cannot map to both "a" and "r".',
      },
      {
        input: 's = "paper", t = "title"',
        output: 'true',
        explanation: '"p"->"t", "a"->"i", "e"->"l", "r"->"e" is a valid bijection.',
      },
    ],
    constraints: [
      '1 <= s.length <= 5 * 10^4',
      't.length == s.length',
      's and t consist of any valid ascii character.',
    ],
    hints: [
      'Ensure mappings work in both directions.',
      'Start with the constraints and choose a bidirectional mapping approach before coding.',
    ],
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    topics: ['HashMap', 'Heap / Priority Queue'],
    concepts: ['Frequency map', 'Bucket sort'],
    description:
      'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 appears 3 times and 2 appears 2 times, which are the 2 most frequent numbers.',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: 'The only element 1 is the most frequent.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
      'It is guaranteed that the answer is unique.',
    ],
    hints: [
      'Count first; then use buckets or a heap.',
      'Start with the constraints and choose a frequency map approach before coding.',
    ],
  },
  {
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    difficulty: 'Medium',
    topics: ['HashMap', 'Arrays'],
    concepts: ['Set expansion'],
    description:
      'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.',
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.',
      },
      {
        input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        output: '9',
        explanation: 'The consecutive sequence runs from 0 through 8, length 9.',
      },
    ],
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    hints: [
      'Only begin counting at numbers without a predecessor.',
      'Start with the constraints and choose a set expansion approach before coding.',
    ],
  },
  {
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    topics: ['HashMap', 'Prefix Sum'],
    concepts: ['Prefix sum frequency'],
    description:
      'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    examples: [
      {
        input: 'nums = [1,1,1], k = 2',
        output: '2',
        explanation: 'The subarrays [nums[0], nums[1]] and [nums[1], nums[2]] each sum to 2.',
      },
      {
        input: 'nums = [1,2,3], k = 3',
        output: '2',
        explanation: 'Subarrays [1,2] and [3] each sum to 3.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7',
    ],
    hints: [
      'Count previous prefix sums equal to current minus k.',
      'Start with the constraints and choose a prefix sum frequency approach before coding.',
    ],
  },
]
