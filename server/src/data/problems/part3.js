export const part3 = [
  {
    title: 'Reorder List',
    slug: 'reorder-list',
    difficulty: 'Medium',
    topics: ['Linked List'],
    concepts: ['Middle split', 'Reverse', 'Merge'],
    description:
      'You are given the head of a singly linked-list. The list can be represented as:\nL0 → L1 → … → Ln - 1 → Ln\n\nReorder the list to be on the following form:\nL0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …\n\nYou may not modify the values in the list\'s nodes. Only nodes themselves may be changed.',
    examples: [
      {
        input: 'head = [1,2,3,4]',
        output: '[1,4,2,3]',
        explanation: 'The list is reordered by alternating nodes from the front and back.',
      },
      {
        input: 'head = [1,2,3,4,5]',
        output: '[1,5,2,4,3]',
        explanation: 'Weave front and end nodes: 1 -> 5 -> 2 -> 4 -> 3.',
      },
    ],
    constraints: [
      'The number of nodes in the list is in the range [1, 5 * 10^4].',
      '1 <= Node.val <= 1000',
    ],
    hints: [
      'Find the middle, reverse the second half, then weave.',
      'Start with the constraints and choose a middle split approach before coding.',
    ],
  },
  {
    title: 'Copy List With Random Pointer',
    slug: 'copy-list-with-random-pointer',
    difficulty: 'Medium',
    topics: ['Linked List', 'HashMap'],
    concepts: ['Node mapping'],
    description:
      'A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.\n\nConstruct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state.\n\nReturn the head of the copied linked list.',
    examples: [
      {
        input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]',
        output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
        explanation: 'Every copied node has the same values and matching next/random connections referencing cloned nodes.',
      },
      {
        input: 'head = [[1,1],[2,1]]',
        output: '[[1,1],[2,1]]',
        explanation: 'Node 1 points to node 2, random points to node 2. Cloned structure mirrors this faithfully.',
      },
    ],
    constraints: [
      '0 <= n <= 1000',
      '-10^4 <= Node.val <= 10^4',
      'Node.random is null or is pointing to some node in the linked list.',
    ],
    hints: [
      'Map every original node to its copy.',
      'Start with the constraints and choose a node mapping approach before coding.',
    ],
  },
  {
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'Medium',
    topics: ['Linked List'],
    concepts: ['Digit carry'],
    description:
      'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.',
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807, represented in reverse as [7, 0, 8].',
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]',
        explanation: '0 + 0 = 0.',
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]',
        explanation: 'Carry propagates across all digits, creating an additional node at the end.',
      },
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.',
    ],
    hints: [
      'Advance both lists and carry overflow.',
      'Start with the constraints and choose a digit carry approach before coding.',
    ],
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topics: ['Binary Search', 'Arrays'],
    concepts: ['Search interval'],
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    hints: [
      'Discard half the search interval each comparison.',
      'Start with the constraints and choose a search interval approach before coding.',
    ],
  },
  {
    title: 'Search Insert Position',
    slug: 'search-insert-position',
    difficulty: 'Easy',
    topics: ['Binary Search', 'Arrays'],
    concepts: ['Lower bound'],
    description:
      'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      {
        input: 'nums = [1,3,5,6], target = 5',
        output: '2',
        explanation: '5 exists at index 2.',
      },
      {
        input: 'nums = [1,3,5,6], target = 2',
        output: '1',
        explanation: '2 would be inserted between 1 and 3, at index 1.',
      },
      {
        input: 'nums = [1,3,5,6], target = 7',
        output: '4',
        explanation: '7 is larger than all elements, so it belongs at index 4.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 <= nums[i] <= 10^4',
      'nums contains distinct values sorted in ascending order.',
      '-10^4 <= target <= 10^4',
    ],
    hints: [
      'The final left boundary is the insertion point.',
      'Start with the constraints and choose a lower bound approach before coding.',
    ],
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    topics: ['Binary Search', 'Arrays'],
    concepts: ['Sorted half detection'],
    description:
      'There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: '0 is found at index 4.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: '3 is not present in the array, so -1 is returned.',
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1',
        explanation: '0 does not exist in nums.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is an ascending array that is possibly rotated.',
      '-10^4 <= target <= 10^4',
    ],
    hints: [
      'One half is always normally sorted.',
      'Start with the constraints and choose a sorted half detection approach before coding.',
    ],
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'find-minimum-in-rotated-sorted-array',
    difficulty: 'Medium',
    topics: ['Binary Search', 'Arrays'],
    concepts: ['Rotation pivot'],
    description:
      'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].\n\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.',
    examples: [
      {
        input: 'nums = [3,4,5,1,2]',
        output: '1',
        explanation: 'The original array was [1,2,3,4,5] rotated 3 times.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2]',
        output: '0',
        explanation: 'The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.',
      },
      {
        input: 'nums = [11,13,15,17]',
        output: '11',
        explanation: 'The original array was [11,13,15,17] and it was rotated 4 times.',
      },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 5000',
      '-5000 <= nums[i] <= 5000',
      'All the integers of nums are unique.',
      'nums is sorted and rotated between 1 and n times.',
    ],
    hints: [
      'Compare the midpoint with the right endpoint.',
      'Start with the constraints and choose a rotation pivot approach before coding.',
    ],
  },
  {
    title: 'Koko Eating Bananas',
    slug: 'koko-eating-bananas',
    difficulty: 'Medium',
    topics: ['Binary Search'],
    concepts: ['Answer-space search'],
    description:
      'Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.\n\nKoko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn the minimum integer k such that she can eat all the bananas within h hours.',
    examples: [
      {
        input: 'piles = [3,6,7,11], h = 8',
        output: '4',
        explanation: 'At eating speed 4, Koko takes 1 + 2 + 2 + 3 = 8 hours to consume all piles.',
      },
      {
        input: 'piles = [30,11,23,4,20], h = 5',
        output: '30',
        explanation: 'To finish in 5 hours, she must eat at least 30 bananas/hr because the largest pile is 30.',
      },
      {
        input: 'piles = [30,11,23,4,20], h = 6',
        output: '23',
        explanation: 'At speed 23, Koko finishes all piles within 6 hours.',
      },
    ],
    constraints: [
      '1 <= piles.length <= 10^4',
      'piles.length <= h <= 10^9',
      '1 <= piles[i] <= 10^9',
    ],
    hints: [
      'Binary-search a feasible eating speed.',
      'Start with the constraints and choose a answer-space search approach before coding.',
    ],
  },
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    topics: ['Binary Search', 'Arrays'],
    concepts: ['Partition search'],
    description:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.0',
        explanation: 'merged array = [1,2,3] and median is 2.',
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.5',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.',
      },
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
    hints: [
      'Partition the shorter array so both left halves align.',
      'Start with the constraints and choose a partition search approach before coding.',
    ],
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: 'Easy',
    topics: ['Trees', 'Recursion'],
    concepts: ['DFS depth'],
    description:
      'Given the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: 'The deepest path is 3 -> 20 -> 15 (or 7), which has length 3.',
      },
      {
        input: 'root = [1,null,2]',
        output: '2',
        explanation: 'Path 1 -> 2 has length 2.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      'Depth is one plus the deeper child.',
      'Start with the constraints and choose a dfs depth approach before coding.',
    ],
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    topics: ['Trees', 'Recursion'],
    concepts: ['Tree traversal'],
    description:
      'Given the root of a binary tree, invert the tree, and return its root.\n\nInverting a tree means swapping every left and right child of every node across the entire tree.',
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
        explanation: 'Every level\'s children are horizontally flipped.',
      },
      {
        input: 'root = [2,1,3]',
        output: '[2,3,1]',
        explanation: 'Left child 1 and right child 3 swap places.',
      },
      {
        input: 'root = []',
        output: '[]',
        explanation: 'An empty tree inverted remains empty.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      'Swap children at every node.',
      'Start with the constraints and choose a tree traversal approach before coding.',
    ],
  },
  {
    title: 'Same Tree',
    slug: 'same-tree',
    difficulty: 'Easy',
    topics: ['Trees', 'Recursion'],
    concepts: ['Structural recursion'],
    description:
      'Given the roots of two binary trees p and q, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
    examples: [
      {
        input: 'p = [1,2,3], q = [1,2,3]',
        output: 'true',
        explanation: 'Both trees have identical values and topology.',
      },
      {
        input: 'p = [1,2], q = [1,null,2]',
        output: 'false',
        explanation: 'Structural mismatch: node 2 is a left child in p but a right child in q.',
      },
      {
        input: 'p = [1,2,1], q = [1,1,2]',
        output: 'false',
        explanation: 'Values at the leaf level differ.',
      },
    ],
    constraints: [
      'The number of nodes in both trees is in the range [0, 100].',
      '-10^4 <= Node.val <= 10^4',
    ],
    hints: [
      'Both values and child structure must match.',
      'Start with the constraints and choose a structural recursion approach before coding.',
    ],
  },
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    topics: ['Trees', 'Queue'],
    concepts: ['Breadth-first search'],
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]',
        explanation: 'Level 0 is [3], level 1 is [9, 20], level 2 is [15, 7].',
      },
      {
        input: 'root = [1]',
        output: '[[1]]',
        explanation: 'Single node tree produces [[1]].',
      },
      {
        input: 'root = []',
        output: '[]',
        explanation: 'Empty tree returns an empty array [].',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'Process one queue level at a time.',
      'Start with the constraints and choose a breadth-first search approach before coding.',
    ],
  },
  {
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    difficulty: 'Medium',
    topics: ['Trees', 'BST'],
    concepts: ['Range constraints'],
    description:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys strictly less than the node\'s key.\n- The right subtree of a node contains only nodes with keys strictly greater than the node\'s key.\n- Both the left and right subtrees must also be binary search trees.',
    examples: [
      {
        input: 'root = [2,1,3]',
        output: 'true',
        explanation: 'Left child 1 < root 2, and right child 3 > root 2, satisfying BST rules.',
      },
      {
        input: 'root = [5,1,4,null,null,3,6]',
        output: 'false',
        explanation: 'The root node\'s value is 5 but its right child\'s value is 4.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    hints: [
      'Each node must stay within ancestor bounds.',
      'Start with the constraints and choose a range constraints approach before coding.',
    ],
  },
  {
    title: 'Kth Smallest Element in BST',
    slug: 'kth-smallest-element-in-bst',
    difficulty: 'Medium',
    topics: ['Trees', 'BST'],
    concepts: ['Inorder traversal'],
    description:
      'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    examples: [
      {
        input: 'root = [3,1,4,null,2], k = 1',
        output: '1',
        explanation: 'The sorted order of values is [1, 2, 3, 4]. The 1st smallest is 1.',
      },
      {
        input: 'root = [5,3,6,2,4,null,null,1], k = 3',
        output: '3',
        explanation: 'Inorder sorted sequence is [1, 2, 3, 4, 5, 6]. The 3rd smallest is 3.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is n.',
      '1 <= k <= n <= 10^4',
      '0 <= Node.val <= 10^4',
    ],
    hints: [
      'Inorder traversal visits BST values in order.',
      'Start with the constraints and choose a inorder traversal approach before coding.',
    ],
  },
  {
    title: 'Lowest Common Ancestor of BST',
    slug: 'lowest-common-ancestor-of-bst',
    difficulty: 'Medium',
    topics: ['Trees', 'BST'],
    concepts: ['BST ordering'],
    description:
      'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."',
    examples: [
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        output: '6',
        explanation: 'The LCA of nodes 2 and 8 is 6.',
      },
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        output: '2',
        explanation: 'The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q',
      'p and q will exist in the BST.',
    ],
    hints: [
      'Walk left or right until the values split.',
      'Start with the constraints and choose a bst ordering approach before coding.',
    ],
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    slug: 'serialize-and-deserialize-binary-tree',
    difficulty: 'Hard',
    topics: ['Trees'],
    concepts: ['Preorder traversal', 'Null markers'],
    description:
      'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.\n\nDesign an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
    examples: [
      {
        input: 'root = [1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'Serializing via preorder traversal with null markers produces a reversible string representation.',
      },
      {
        input: 'root = []',
        output: '[]',
        explanation: 'Empty tree serializes and deserializes back into null/empty tree.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'Include markers for missing children.',
      'Start with the constraints and choose a preorder traversal approach before coding.',
    ],
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    topics: ['Trees', 'Dynamic Programming'],
    concepts: ['Tree DP', 'Postorder'],
    description:
      'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe path sum of a path is the sum of the node\'s values in the path.\n\nGiven the root of a binary tree, return the maximum path sum of any non-empty path.',
    examples: [
      {
        input: 'root = [1,2,3]',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.',
      },
      {
        input: 'root = [-10,9,20,null,null,15,7]',
        output: '42',
        explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'Return one branch upward but evaluate both branches locally.',
      'Start with the constraints and choose a tree dp approach before coding.',
    ],
  },
  {
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    topics: ['Linked List', 'Heap / Priority Queue'],
    concepts: ['Min heap', 'K-way merge'],
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are merged in ascending order into one combined list.',
      },
      {
        input: 'lists = []',
        output: '[]',
        explanation: 'Merging an empty array of lists produces an empty list.',
      },
      {
        input: 'lists = [[]]',
        output: '[]',
        explanation: 'An array of one empty list yields an empty list.',
      },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.',
      'The sum of lists[i].length will not exceed 10^4.',
    ],
    hints: [
      'Keep the smallest current list node in a heap.',
      'Start with the constraints and choose a min heap approach before coding.',
    ],
  },
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    topics: ['Heap / Priority Queue', 'Arrays'],
    concepts: ['Min heap'],
    description:
      'Given an integer array nums and an integer k, return the kth largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.\n\nCan you solve it without sorting?',
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
        explanation: 'The sorted order is [1,2,3,4,5,6], so the 2nd largest element is 5.',
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
        explanation: 'The sorted order is [1,2,2,3,3,4,5,5,6], the 4th largest is 4.',
      },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'Keep a min heap of size k.',
      'Start with the constraints and choose a min heap approach before coding.',
    ],
  },
  {
    title: 'Find Median from Data Stream',
    slug: 'find-median-from-data-stream',
    difficulty: 'Hard',
    topics: ['Heap / Priority Queue'],
    concepts: ['Two heaps', 'Rebalancing'],
    description:
      'The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nImplement the MedianFinder class:\n- MedianFinder() initializes the MedianFinder object.\n- void addNum(int num) adds the integer num from the data stream to the data structure.\n- double findMedian() returns the median of all elements so far.',
    examples: [
      {
        input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]',
        output: '[null, null, null, 1.5, null, 2.0]',
        explanation: 'MedianFinder mf = new MedianFinder(); mf.addNum(1); mf.addNum(2); mf.findMedian(); // return 1.5; mf.addNum(3); mf.findMedian(); // return 2.0.',
      },
    ],
    constraints: [
      '-10^5 <= num <= 10^5',
      'There will be at least one element in the data structure before calling findMedian.',
      'At most 5 * 10^4 calls will be made to addNum and findMedian.',
    ],
    hints: [
      'Balance a max heap for lower values and min heap for upper values.',
      'Start with the constraints and choose a two heaps approach before coding.',
    ],
  },
  {
    title: 'Task Scheduler',
    slug: 'task-scheduler',
    difficulty: 'Medium',
    topics: ['Heap / Priority Queue', 'Greedy'],
    concepts: ['Frequency scheduling'],
    description:
      'You are given an array of CPU tasks, each represented by letters A to Z, and a cooling interval n. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there\'s a constraint that identical tasks must be separated by at least n intervals because of cooling time.\n\nReturn the minimum number of intervals the CPU will take to finish all the given tasks.',
    examples: [
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 2',
        output: '8',
        explanation: 'A possible sequence is A -> B -> idle -> A -> B -> idle -> A -> B, taking 8 cycles.',
      },
      {
        input: 'tasks = ["A","C","A","B","D","B"], n = 1',
        output: '6',
        explanation: 'A possible sequence is A -> B -> C -> D -> A -> B, which takes 6 cycles with 0 idle slots.',
      },
      {
        input: 'tasks = ["A","A","A","B","B","B"], n = 3',
        output: '10',
        explanation: 'A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.',
      },
    ],
    constraints: [
      '1 <= tasks.length <= 10^4',
      'tasks[i] is an uppercase English letter.',
      '0 <= n <= 100',
    ],
    hints: [
      'Schedule frequent tasks first and account for idle gaps.',
      'Start with the constraints and choose a frequency scheduling approach before coding.',
    ],
  },
  {
    title: 'Last Stone Weight',
    slug: 'last-stone-weight',
    difficulty: 'Easy',
    topics: ['Heap / Priority Queue'],
    concepts: ['Max heap'],
    description:
      'You are given an array of integers stones where stones[i] is the weight of the ith stone.\n\nWe are playing a game with the stones. On each turn, we choose the heaviest two stones with weights x and y with x <= y. The result of this smash is:\n- If x == y, both stones are destroyed.\n- If x != y, the stone of weight x is destroyed, and the stone of weight y has new weight y - x.\n\nAt the end of the game, there is at most one stone left. Return the weight of the last remaining stone. If there are no stones left, return 0.',
    examples: [
      {
        input: 'stones = [2,7,4,1,8,1]',
        output: '1',
        explanation: 'Smash 7 and 8 -> leaves 1: [2,4,1,1,1]. Smash 2 and 4 -> leaves 2: [2,1,1,1]. Smash 2 and 1 -> leaves 1: [1,1,1]. Smash 1 and 1 -> leaves 0: [1]. Final stone is 1.',
      },
      {
        input: 'stones = [1]',
        output: '1',
        explanation: 'With only one stone, the remaining weight is 1.',
      },
    ],
    constraints: [
      '1 <= stones.length <= 30',
      '1 <= stones[i] <= 1000',
    ],
    hints: [
      'Repeatedly remove the two heaviest stones.',
      'Start with the constraints and choose a max heap approach before coding.',
    ],
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topics: ['Graphs'],
    concepts: ['Grid DFS', 'Connected components'],
    description:
      'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
        explanation: 'All connected "1"s form a single contiguous island.',
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: 'There are three separate connected land components.',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.',
    ],
    hints: [
      'Flood-fill every unvisited land cell.',
      'Start with the constraints and choose a grid dfs approach before coding.',
    ],
  },
  {
    title: 'Clone Graph',
    slug: 'clone-graph',
    difficulty: 'Medium',
    topics: ['Graphs', 'HashMap'],
    concepts: ['Graph DFS', 'Visited map'],
    description:
      'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (int) and a list (List[Node]) of its neighbors.\n\nTest cases are generated such that the graph is connected and contains no self-loops or repeated edges.',
    examples: [
      {
        input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
        output: '[[2,4],[1,3],[2,4],[1,3]]',
        explanation: 'There are 4 nodes in the graph. The cloned graph has identical structure with entirely new node instances.',
      },
      {
        input: 'adjList = [[]]',
        output: '[[]]',
        explanation: 'Graph consists of a single node with no neighbors.',
      },
      {
        input: 'adjList = []',
        output: '[]',
        explanation: 'An empty graph returns null / empty clone.',
      },
    ],
    constraints: [
      'The number of nodes in the graph is in the range [0, 100].',
      '1 <= Node.val <= 100',
      'Node.val is unique for each node.',
      'There are no repeated edges and no self-loops in the graph.',
      'The Graph is connected and all nodes can be visited starting from the given node.',
    ],
    hints: [
      'Map each original node before visiting neighbors.',
      'Start with the constraints and choose a graph dfs approach before coding.',
    ],
  },
]
