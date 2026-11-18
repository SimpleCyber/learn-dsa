# DSA Roadmap in C++

Nov 17, 2026 · @1 CR

Twelve topics in learning order; each lists the patterns to recognize, LeetCode problems to solve in sequence, and a 5-problem mixed checkpoint before you move on.

## How to use this

Finish one topic fully before opening the next; the loop below takes about 1 to 2 weeks per topic at 1 to 2 problems a day.

1. Read or watch one short explainer for the topic (20 to 40 minutes, no playlists).
2. Solve the **Solve in this order** list top to bottom. Search each problem on LeetCode by its number.
3. Stuck for 20 minutes? Read the hint or solution, understand it, close it, and code it again from scratch in C++. Re-solve it the next day without help.
4. Finish with the **Checkpoint**: 5 mixed problems that combine this topic's patterns with classic questions. Cap each at 45 minutes.
5. Tick the topic off only when you can solve 4 of 5 checkpoint problems, using hints at most once.

C++ habits worth building from day one: use `vector`, `unordered_map`, `unordered_set`, `priority_queue`, `lower_bound` and `sort` from the STL, pass containers by reference, and compute mid as `lo + (hi - lo) / 2`.

Levels: E = Easy, M = Medium, H = Hard. Hards are optional on the first pass; return to them after topic 12.

## 1. Arrays and Strings

Learn in-place updates and prefix sums first; nearly every later topic builds on them. Start with a quick read on Big-O (the idea only), then begin.

**Patterns**

- **Traversal and running value**: one pass keeping a running min, max or count (buy/sell stock).
- **Write pointer (in-place edit)**: one index reads, another writes (remove duplicates, move zeroes).
- **Prefix and suffix arrays**: precompute cumulative sums or products so range queries are O(1).
- **Kadane's algorithm**: best subarray ending here = max(current element, previous best + current).
- **Reverse trick**: rotate by reversing the whole array, then the two parts.
- **Dutch national flag**: three-way partition with low, mid and high pointers.
- **Matrix layers**: process by rows, columns or rings (spiral, rotate image).
- **String parsing**: skip spaces, handle sign, guard against overflow.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 485 | Max Consecutive Ones | E | Running count |
| 26 | Remove Duplicates from Sorted Array | E | Write pointer |
| 283 | Move Zeroes | E | Write pointer |
| 121 | Best Time to Buy and Sell Stock | E | Running min |
| 303 | Range Sum Query - Immutable | E | Prefix sum |
| 53 | Maximum Subarray | M | Kadane |
| 238 | Product of Array Except Self | M | Prefix and suffix |
| 189 | Rotate Array | M | Reverse trick |
| 75 | Sort Colors | M | Dutch flag |
| 48 | Rotate Image | M | Matrix layers |
| 54 | Spiral Matrix | M | Matrix layers |
| 73 | Set Matrix Zeroes | M | Matrix, in-place markers |
| 14 | Longest Common Prefix | E | String scan |
| 125 | Valid Palindrome | E | String scan |
| 8 | String to Integer (atoi) | M | String parsing |

**Checkpoint: 5 mixed**

1. 169 Majority Element (E): classic, Boyer-Moore voting.
2. 152 Maximum Product Subarray (M): Kadane variant that tracks both max and min.
3. 31 Next Permutation (M): classic, find the pivot, swap, reverse the tail.
4. 442 Find All Duplicates in an Array (M): use the array itself as a marker.
5. 151 Reverse Words in a String (M): string parsing and reversing.

## 2. Hashing

Hashing turns a nested-loop O(n^2) search into one O(n) pass by remembering what you have seen. In C++ that means `unordered_map` and `unordered_set`.

**Patterns**

- **Complement lookup**: for each x, check whether target - x was already seen (Two Sum).
- **Frequency count**: count characters or values, then compare or pick by count.
- **Canonical key grouping**: sort the string or build a count signature as the map key (group anagrams).
- **Set membership**: dedupe, or ask "does x - 1 exist?" to find the start of a sequence.
- **Prefix sum + hashmap**: store the first index of each prefix sum; a repeated sum means a zero-sum subarray (or a target-sum one).
- **Prefix mod**: store prefix sum % k when the question is about divisibility.
- **Bucket by frequency**: for top-K, index buckets by count to avoid sorting.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 217 | Contains Duplicate | E | Set membership |
| 1 | Two Sum | E | Complement lookup |
| 242 | Valid Anagram | E | Frequency count |
| 387 | First Unique Character in a String | E | Frequency count |
| 205 | Isomorphic Strings | E | Two-way mapping |
| 49 | Group Anagrams | M | Canonical key |
| 347 | Top K Frequent Elements | M | Frequency + bucket |
| 36 | Valid Sudoku | M | Sets per row, column, box |
| 128 | Longest Consecutive Sequence | M | Set, sequence start |
| 560 | Subarray Sum Equals K | M | Prefix sum + hashmap |
| 523 | Continuous Subarray Sum | M | Prefix mod |
| 454 | 4Sum II | M | Split into two halves |

**Checkpoint: 5 mixed**

1. 380 Insert Delete GetRandom O(1) (M): classic design, vector + hashmap.
2. 525 Contiguous Array (M): map 0 to -1 and use prefix sum + hashmap.
3. 974 Subarray Sums Divisible by K (M): prefix mod pattern.
4. 953 Verifying an Alien Dictionary (E): map letters to their rank.
5. 41 First Missing Positive (H): index-as-hash trick from topic 1, hard but a classic.

## 3. Two Pointers and Sliding Window

Both patterns replace a nested loop with two indices that only move forward, giving O(n). Two pointers needs sorted or symmetric structure; a sliding window needs a contiguous range.

**Patterns**

- **Opposite ends**: left and right move inward on a sorted array (pair sum, container with most water).
- **Fix one, two-pointer the rest**: sort, fix i, then run opposite-end pointers on the remainder (3Sum, 4Sum). Skip duplicates.
- **Fast and slow / write pointer**: same direction, different speeds or roles.
- **Fixed-size window**: add the new element, drop the old one, update the answer.
- **Variable window (longest)**: expand right, shrink left while the window is invalid, record the best length.
- **Variable window (shortest)**: expand until valid, then shrink while it stays valid.
- **Window + count map**: track character or value counts (permutation in string, minimum window).
- **At most K trick**: exactly K = atMost(K) - atMost(K - 1).

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 167 | Two Sum II - Input Array Is Sorted | E | Opposite ends |
| 11 | Container With Most Water | M | Opposite ends |
| 15 | 3Sum | M | Fix one + two pointers |
| 42 | Trapping Rain Water | H | Opposite ends with max tracking |
| 643 | Maximum Average Subarray I | E | Fixed window |
| 3 | Longest Substring Without Repeating Characters | M | Variable window + set |
| 424 | Longest Repeating Character Replacement | M | Variable window + counts |
| 1004 | Max Consecutive Ones III | M | Variable window |
| 209 | Minimum Size Subarray Sum | M | Shortest window |
| 567 | Permutation in String | M | Fixed window + counts |
| 76 | Minimum Window Substring | H | Shortest window + counts |

**Checkpoint: 5 mixed**

1. 88 Merge Sorted Array (E): classic, merge from the back.
2. 16 3Sum Closest (M): classic variant of 3Sum.
3. 438 Find All Anagrams in a String (M): fixed window + counts.
4. 904 Fruit Into Baskets (M): variable window with at most 2 distinct values.
5. 713 Subarray Product Less Than K (M): variable window counting subarrays.

## 4. Stack and Queue

Use a stack when the most recent unfinished thing matters, and a queue when order of arrival matters. The monotonic stack is the pattern that shows up most often. In C++: `stack`, `queue`, `deque`.

**Patterns**

- **Matching and nesting**: push openers, pop on closers (parentheses, decode string).
- **Expression evaluation**: operand stack for postfix, or operator stack for infix with precedence.
- **Monotonic stack (next greater or smaller)**: keep the stack sorted; pop while the new element breaks the order, and the popped element's answer is the new one.
- **Monotonic stack for areas**: histogram and rain-water style problems use the popped bar's width.
- **Auxiliary stack**: store the running min alongside each value (min stack).
- **Two stacks as a queue** and **queues as a stack**: classic design questions.
- **Monotonic deque**: window maximum in O(n) by keeping candidates in decreasing order.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 20 | Valid Parentheses | E | Matching |
| 155 | Min Stack | M | Auxiliary stack |
| 232 | Implement Queue using Stacks | E | Two stacks |
| 225 | Implement Stack using Queues | E | Queue as stack |
| 150 | Evaluate Reverse Polish Notation | M | Expression evaluation |
| 71 | Simplify Path | M | Stack of path parts |
| 394 | Decode String | M | Nested stack |
| 496 | Next Greater Element I | E | Monotonic stack |
| 739 | Daily Temperatures | M | Monotonic stack |
| 503 | Next Greater Element II | M | Monotonic stack, circular |
| 853 | Car Fleet | M | Sort + stack |
| 84 | Largest Rectangle in Histogram | H | Monotonic stack for areas |
| 239 | Sliding Window Maximum | H | Monotonic deque |

**Checkpoint: 5 mixed**

1. 1047 Remove All Adjacent Duplicates in String (E): classic stack cleanup.
2. 901 Online Stock Span (M): monotonic stack with stored counts.
3. 402 Remove K Digits (M): monotonic stack with a budget of removals.
4. 622 Design Circular Queue (M): classic design with a fixed array.
5. 227 Basic Calculator II (M): expression evaluation with precedence.

## 5. Linked List

Linked list problems are about careful pointer handling, and four tools cover most of them: a dummy node, fast and slow pointers, in-place reversal, and merging. Draw the pointers on paper before coding, and in C++ watch for null dereferences and (in your own code) memory you allocate.

**Patterns**

- **Dummy head node**: removes special cases when the head can change (remove elements, merge, add numbers).
- **Fast and slow pointers**: finds the middle, detects a cycle, and finds the cycle start (Floyd's algorithm).
- **In-place reversal**: three pointers (prev, curr, next); reverse a sublist or groups of k.
- **Gap pointers**: move one pointer n steps ahead, then move both (nth node from the end).
- **Merge two sorted lists**: the base for sort list and merge k lists.
- **Split, reverse, merge**: reorder list and palindrome check combine the first three patterns.
- **Hashmap or interleaving**: copy a list with random pointers.
- **Doubly linked list + hashmap**: O(1) cache structures (LRU).

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 206 | Reverse Linked List | E | In-place reversal |
| 21 | Merge Two Sorted Lists | E | Merge, dummy node |
| 203 | Remove Linked List Elements | E | Dummy node |
| 83 | Remove Duplicates from Sorted List | E | Single pass |
| 876 | Middle of the Linked List | E | Fast and slow |
| 141 | Linked List Cycle | E | Fast and slow |
| 142 | Linked List Cycle II | M | Floyd's cycle start |
| 160 | Intersection of Two Linked Lists | E | Two pointers, swap heads |
| 19 | Remove Nth Node From End of List | M | Gap pointers |
| 234 | Palindrome Linked List | E | Middle + reverse |
| 2 | Add Two Numbers | M | Dummy node + carry |
| 143 | Reorder List | M | Split, reverse, merge |
| 138 | Copy List with Random Pointer | M | Hashmap or interleave |
| 148 | Sort List | M | Merge sort on lists |
| 25 | Reverse Nodes in k-Group | H | Group reversal |

**Checkpoint: 5 mixed**

1. 92 Reverse Linked List II (M): reverse a sublist in place.
2. 24 Swap Nodes in Pairs (M): dummy node and pointer rewiring.
3. 61 Rotate List (M): find the length, link the tail to the head, cut at the right spot.
4. 328 Odd Even Linked List (M): two chains built in one pass.
5. 146 LRU Cache (M): classic, doubly linked list + hashmap from topic 2.

## 6. Binary Search

Binary search works on any yes/no condition that flips once across an ordered range, not just on sorted arrays. Decide what `lo` and `hi` mean and what the loop keeps true before you write code. In C++, know `lower_bound` and `upper_bound`, and compute mid as `lo + (hi - lo) / 2` to avoid overflow.

**Patterns**

- **Classic search**: find an exact index in a sorted array.
- **Lower and upper bound**: first index with a value >= x, or first index > x (insert position, first and last occurrence).
- **Rotated sorted array**: one half is always sorted; check which half and whether the target lies in it.
- **Search on the answer**: binary search over the answer value with a feasibility function (Koko bananas, ship capacity, split array).
- **Peak or boundary finding**: compare mid with mid + 1 to decide which side to keep.
- **Search in a matrix**: treat a sorted 2D matrix as one flattened array, or walk from a corner.
- **Binary search on a time-stamped list**: find the latest entry at or before a given time.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 704 | Binary Search | E | Classic search |
| 35 | Search Insert Position | E | Lower bound |
| 69 | Sqrt(x) | E | Search on the answer |
| 34 | Find First and Last Position of Element in Sorted Array | M | Lower and upper bound |
| 33 | Search in Rotated Sorted Array | M | Rotated array |
| 153 | Find Minimum in Rotated Sorted Array | M | Rotated array |
| 74 | Search a 2D Matrix | M | Flattened search |
| 162 | Find Peak Element | M | Peak finding |
| 875 | Koko Eating Bananas | M | Search on the answer |
| 1011 | Capacity To Ship Packages Within D Days | M | Search on the answer |
| 981 | Time Based Key-Value Store | M | Upper bound on timestamps |
| 410 | Split Array Largest Sum | H | Search on the answer |
| 4 | Median of Two Sorted Arrays | H | Partition binary search |

**Checkpoint: 5 mixed**

1. 81 Search in Rotated Sorted Array II (M): rotated search with duplicates.
2. 540 Single Element in a Sorted Array (M): use index parity to pick a side.
3. 1482 Minimum Number of Days to Make m Bouquets (M): search on the answer.
4. 287 Find the Duplicate Number (M): classic, binary search on value or Floyd's cycle.
5. 240 Search a 2D Matrix II (M): classic corner walk.

## 7. Recursion and Backtracking

Backtracking is recursion that builds a candidate one choice at a time, undoes the choice, and tries the next. Every problem here fits one template: choose, recurse, un-choose. Draw the decision tree for a tiny input before coding.

**Patterns**

- **Include or exclude**: at each element decide to take it or skip it (subsets).
- **Permutations**: a `used` array, or swap elements in place.
- **Combinations with a start index**: only look forward from the current index so you never repeat a set (combinations, combination sum). Pass the same index to allow reuse.
- **Skip duplicates**: sort first, then skip an element equal to the previous one at the same level.
- **Partitioning a string**: try every prefix that is valid, then recurse on the rest (palindrome partitioning, IP addresses).
- **Grid or board search**: mark the cell visited, explore four directions, unmark (word search).
- **Constraint placement with pruning**: keep column and diagonal sets to cut invalid branches early (N-Queens, Sudoku).

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 509 | Fibonacci Number | E | Recursion warm-up |
| 50 | Pow(x, n) | M | Divide and conquer |
| 78 | Subsets | M | Include or exclude |
| 90 | Subsets II | M | Skip duplicates |
| 46 | Permutations | M | Used array |
| 47 | Permutations II | M | Skip duplicates |
| 77 | Combinations | M | Start index |
| 39 | Combination Sum | M | Start index, reuse |
| 40 | Combination Sum II | M | Start index, skip duplicates |
| 17 | Letter Combinations of a Phone Number | M | Choose per digit |
| 22 | Generate Parentheses | M | Count of open and close |
| 131 | Palindrome Partitioning | M | String partitioning |
| 79 | Word Search | M | Grid backtracking |
| 51 | N-Queens | H | Constraint pruning |

**Checkpoint: 5 mixed**

1. 216 Combination Sum III (M): start index with a fixed count.
2. 93 Restore IP Addresses (M): string partitioning with validity checks.
3. 784 Letter Case Permutation (M): choose per character.
4. 473 Matchsticks to Square (M): placement with pruning.
5. 37 Sudoku Solver (H): classic, constraint placement with pruning.

## 8. Trees and BST

A tree problem is almost always one recursive function; decide what each node returns to its parent and what it reports on the side. Do the easy depth and traversal problems until recursion feels natural, then move to BST rules and path problems.

**Patterns**

- **DFS traversals**: preorder, inorder and postorder differ only in where you process the node.
- **Bottom-up return value**: return height or a boolean from the children, then combine (depth, balanced tree, same tree).
- **Return one thing, update another**: return the best downward path but update a global answer using both children (diameter, max path sum).
- **Top-down state**: pass a running sum, min or max down the recursion (path sum, count good nodes).
- **BFS by levels**: queue plus the current level size (level order, zigzag, right side view).
- **Lowest common ancestor**: if both sides return non-null, the current node is the answer.
- **BST property**: inorder traversal is sorted; validate with min and max bounds; search by going left or right.
- **Build from traversals**: use the preorder root to split inorder (construct tree).
- **Serialization**: encode with null markers using preorder or level order.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 104 | Maximum Depth of Binary Tree | E | Bottom-up return |
| 226 | Invert Binary Tree | E | DFS |
| 100 | Same Tree | E | DFS, two trees |
| 101 | Symmetric Tree | E | DFS, mirrored |
| 94 | Binary Tree Inorder Traversal | E | Traversal |
| 112 | Path Sum | E | Top-down state |
| 110 | Balanced Binary Tree | E | Bottom-up return |
| 543 | Diameter of Binary Tree | E | Return one, update another |
| 102 | Binary Tree Level Order Traversal | M | BFS by levels |
| 199 | Binary Tree Right Side View | M | BFS by levels |
| 700 | Search in a Binary Search Tree | E | BST search |
| 98 | Validate Binary Search Tree | M | BST bounds |
| 230 | Kth Smallest Element in a BST | M | Inorder |
| 235 | Lowest Common Ancestor of a BST | M | BST property |
| 236 | Lowest Common Ancestor of a Binary Tree | M | LCA |
| 105 | Construct Binary Tree from Preorder and Inorder Traversal | M | Build from traversals |
| 450 | Delete Node in a BST | M | BST restructure |
| 124 | Binary Tree Maximum Path Sum | H | Return one, update another |

**Checkpoint: 5 mixed**

1. 103 Binary Tree Zigzag Level Order Traversal (M): BFS by levels with direction flipping.
2. 437 Path Sum III (M): top-down state plus prefix sums from topic 2.
3. 114 Flatten Binary Tree to Linked List (M): rewiring pointers, links to topic 5.
4. 1448 Count Good Nodes in Binary Tree (M): top-down state with a running max.
5. 297 Serialize and Deserialize Binary Tree (H): classic, preorder with null markers.

## 9. Heap and Priority Queue

Reach for a heap whenever you repeatedly need the smallest or largest item from a changing collection. In C++, `priority_queue<int>` is a max-heap by default; use `priority_queue<int, vector<int>, greater<int>>` for a min-heap, or a custom comparator for pairs and structs.

**Patterns**

- **Top K with a size-K min-heap**: keep K items, pop the smallest when the size exceeds K; the top is the Kth largest.
- **Kth element in a stream**: the same heap, updated on each insert.
- **Frequency + heap**: count with a hashmap, then heap by count (top K frequent, sort by frequency).
- **Merge K sorted sources**: push each list's head, pop the smallest, push its successor.
- **Two heaps**: a max-heap for the lower half and a min-heap for the upper half gives a running median.
- **Greedy with a heap**: always process the best available item (task scheduler, reorganize string, IPO).
- **Closest points or values**: heap keyed by distance.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 1046 | Last Stone Weight | E | Max-heap simulation |
| 703 | Kth Largest Element in a Stream | E | Size-K min-heap |
| 215 | Kth Largest Element in an Array | M | Size-K min-heap |
| 347 | Top K Frequent Elements | M | Frequency + heap |
| 973 | K Closest Points to Origin | M | Heap by distance |
| 378 | Kth Smallest Element in a Sorted Matrix | M | Heap over rows |
| 264 | Ugly Number II | M | Heap or three pointers |
| 621 | Task Scheduler | M | Greedy with heap |
| 767 | Reorganize String | M | Greedy with heap |
| 355 | Design Twitter | M | Merge K sorted + design |
| 23 | Merge k Sorted Lists | H | Merge K sorted |
| 295 | Find Median from Data Stream | H | Two heaps |
| 502 | IPO | H | Greedy with two heaps |

**Checkpoint: 5 mixed**

1. 1337 The K Weakest Rows in a Matrix (E): heap by (soldiers, row index).
2. 451 Sort Characters By Frequency (M): frequency + heap.
3. 692 Top K Frequent Words (M): heap with a tie-breaking comparator.
4. 658 Find K Closest Elements (M): classic, heap or binary search from topic 6.
5. 480 Sliding Window Median (H): two heaps with a sliding window.

## 10. Greedy and Intervals

A greedy solution makes the locally best choice at each step and never revisits it; most interval problems become greedy once you sort. The skill is justifying the choice, so for each problem ask why the local pick cannot hurt the final answer.

**Patterns**

- **Sort, then sweep**: sort by start (or by end) and walk once, keeping the last chosen interval.
- **Merge intervals**: sort by start; if the next start <= current end, extend the end, otherwise close the interval.
- **Interval scheduling**: sort by end time and keep the interval that ends earliest (non-overlapping intervals, arrows to burst balloons).
- **Farthest reach**: track the farthest index reachable (jump game I and II).
- **Running balance**: if a running total drops below zero, restart from the next position (gas station).
- **Two-pass greedy**: one pass left to right, one right to left, take the max (candy).
- **Sort by a custom key**: order items so the greedy choice becomes obvious (queue reconstruction, two city scheduling).
- **Two pointers after sorting**: pair the largest with the smallest (boats to save people).

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 455 | Assign Cookies | E | Sort + greedy match |
| 860 | Lemonade Change | E | Greedy with counts |
| 55 | Jump Game | M | Farthest reach |
| 45 | Jump Game II | M | Farthest reach, levels |
| 134 | Gas Station | M | Running balance |
| 56 | Merge Intervals | M | Sort + merge |
| 57 | Insert Interval | M | Merge intervals |
| 435 | Non-overlapping Intervals | M | Sort by end |
| 452 | Minimum Number of Arrows to Burst Balloons | M | Sort by end |
| 763 | Partition Labels | M | Last occurrence + sweep |
| 1029 | Two City Scheduling | M | Custom sort key |
| 406 | Queue Reconstruction by Height | M | Custom sort key |
| 135 | Candy | H | Two-pass greedy |

**Checkpoint: 5 mixed**

1. 986 Interval List Intersections (M): two pointers over sorted interval lists.
2. 1288 Remove Covered Intervals (M): sort by start, then by end descending.
3. 881 Boats to Save People (M): sort + two pointers from topic 3.
4. 738 Monotone Increasing Digits (M): greedy from the right.
5. 330 Patching Array (H): classic, track the smallest sum you cannot yet make.

## 11. Graphs

Most graph problems reduce to a handful of traversals; the real work is spotting the graph, such as a grid, a course list or a set of equations. In C++, store the graph as `vector<vector<int>>` adjacency lists and keep a `visited` array.

**Patterns**

- **DFS on components**: visit everything reachable from a node (number of provinces, clone graph).
- **Grid as a graph**: neighbors are the four adjacent cells; flood fill and island counting are DFS or BFS on a matrix.
- **BFS for shortest path (unweighted)**: queue plus distance or level; stop when you first reach the target.
- **Multi-source BFS**: push all starting cells at once (rotting oranges, 01 matrix).
- **Topological sort**: Kahn's algorithm with in-degrees, or DFS finishing order; a cycle means no valid order (course schedule).
- **Union-Find (DSU)**: merge components and detect a cycle when two nodes already share a root (redundant connection).
- **Cycle and bipartite checks**: two-color the graph with BFS or DFS.
- **Dijkstra (weighted shortest path)**: a min-heap from topic 9 over (distance, node).
- **Minimum spanning tree**: Kruskal with union-find, or Prim with a heap.
- **Graph from relations**: build edges from equations or word differences (evaluate division, word ladder).

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 733 | Flood Fill | E | Grid DFS |
| 200 | Number of Islands | M | Grid DFS or BFS |
| 695 | Max Area of Island | M | Grid DFS |
| 133 | Clone Graph | M | DFS with map |
| 547 | Number of Provinces | M | Components |
| 997 | Find the Town Judge | E | In-degree and out-degree |
| 994 | Rotting Oranges | M | Multi-source BFS |
| 1091 | Shortest Path in Binary Matrix | M | BFS shortest path |
| 130 | Surrounded Regions | M | Border DFS |
| 417 | Pacific Atlantic Water Flow | M | Reverse DFS from borders |
| 207 | Course Schedule | M | Topological sort |
| 210 | Course Schedule II | M | Topological sort |
| 785 | Is Graph Bipartite? | M | Two-coloring |
| 684 | Redundant Connection | M | Union-Find |
| 743 | Network Delay Time | M | Dijkstra |
| 787 | Cheapest Flights Within K Stops | M | Bellman-Ford or BFS with limit |
| 1584 | Min Cost to Connect All Points | M | Minimum spanning tree |
| 127 | Word Ladder | H | BFS on implicit graph |

**Checkpoint: 5 mixed**

1. 463 Island Perimeter (E): grid traversal, count edges next to water.
2. 542 01 Matrix (M): multi-source BFS.
3. 797 All Paths From Source to Target (M): DFS with backtracking from topic 7.
4. 1631 Path With Minimum Effort (M): Dijkstra or binary search on the answer from topic 6.
5. 399 Evaluate Division (M): build a weighted graph from equations.

## 12. Dynamic Programming

DP is recursion that remembers its answers; do not try to see the table first. For every problem work in four steps: define the state in words, write the recursion, add memoization, then convert to a table and shrink the space if possible.

**Patterns**

- **1D linear**: the answer at i depends on the previous one or two (climbing stairs, house robber).
- **0/1 knapsack**: take or skip each item with a capacity (partition equal subset sum, target sum).
- **Unbounded knapsack**: an item can be reused (coin change, coin change II). Loop order decides combinations versus permutations.
- **Longest increasing subsequence**: `dp[i]` = best ending at i; O(n log n) with binary search from topic 6.
- **Grid DP**: `dp[r][c]` from the cell above and the cell to the left (unique paths, minimum path sum).
- **Two-string DP**: `dp[i][j]` over prefixes of both strings (LCS, edit distance, interleaving string).
- **String or substring DP**: expand around centers, or `dp[i][j]` = is the substring valid (palindromes, word break, decode ways).
- **State machine**: a few named states per day, such as holding, sold and cooldown (stock with cooldown).
- **Interval DP**: split a range at every possible point (burst balloons).
- **DP on trees**: return two values per node, such as robbed or not robbed.

**Solve in this order**

| # | Problem | Level | Pattern |
| --- | --- | --- | --- |
| 70 | Climbing Stairs | E | 1D linear |
| 746 | Min Cost Climbing Stairs | E | 1D linear |
| 198 | House Robber | M | 1D linear |
| 213 | House Robber II | M | 1D linear, circular |
| 322 | Coin Change | M | Unbounded knapsack |
| 518 | Coin Change II | M | Unbounded knapsack, counting |
| 416 | Partition Equal Subset Sum | M | 0/1 knapsack |
| 494 | Target Sum | M | 0/1 knapsack |
| 300 | Longest Increasing Subsequence | M | LIS |
| 62 | Unique Paths | M | Grid DP |
| 64 | Minimum Path Sum | M | Grid DP |
| 1143 | Longest Common Subsequence | M | Two-string DP |
| 72 | Edit Distance | M | Two-string DP |
| 139 | Word Break | M | String DP |
| 91 | Decode Ways | M | String DP |
| 647 | Palindromic Substrings | M | Expand around center |
| 5 | Longest Palindromic Substring | M | Expand around center |
| 309 | Best Time to Buy and Sell Stock with Cooldown | M | State machine |
| 343 | Integer Break | M | 1D linear, choose a split |

**Checkpoint: 5 mixed**

1. 120 Triangle (M): grid-style DP from the bottom up.
2. 221 Maximal Square (M): classic, `dp[i][j]` from three neighbors.
3. 337 House Robber III (M): tree DP returning two values, links to topic 8.
4. 97 Interleaving String (M): two-string DP.
5. 312 Burst Balloons (H): classic interval DP.

**After topic 12**

Go back and redo the Hard problems you skipped, then solve a few random Medium problems per week without looking at the topic name. Identifying the pattern from the problem statement alone is the real interview skill, and the checkpoints have been training it.
