export const DET: Record<number, [string, string][]> = {
1: [
["Walk the array once, keeping one or two variables (min so far, best so far, count). Decide what the running value means before you write the loop.","prices = [7,1,5,3,6,4]|min = 7, best = 0|see 1: min = 1|see 5: best = max(0, 5-1) = 4|see 6: best = 5|answer 5"],
["`w` marks where the next valid element goes; `r` scans everything. Copy when the element qualifies, then `w++`. The array prefix before `w` is always the answer so far.","Move Zeroes [0,1,0,3]|r=1 (1): nums[0]=1, w=1|r=3 (3): nums[1]=3, w=2|fill from w with 0|[1,3,0,0]"],
["`pre[i]` = sum of the first i items. Any range sum is a subtraction: `sum(l..r) = pre[r+1] - pre[l]`.","nums = [2,4,1,3]|pre = [0,2,6,7,10]|sum(1..2) = pre[3] - pre[1]|= 7 - 2 = 5"],
["At each i you either extend the previous subarray or restart at i: `cur = max(x, cur + x)`, then `best = max(best, cur)`.","[-2,1,-3,4,-1,2]|cur goes -2, 1, -2, 4, 3, 5|best = 5|subarray is [4,-1,2]"],
["Rotating right by k = reverse everything, reverse the first k, reverse the rest. Always do `k %= n` first.","[1,2,3,4,5], k=2|reverse all: [5,4,3,2,1]|reverse first 2: [4,5,3,2,1]|reverse rest: [4,5,1,2,3]"],
["`lo` is the end of the 0s zone, `hi` is the start of the 2s zone, `mid` scans. 0: swap with lo, both ++. 2: swap with hi, hi-- only (the swapped-in value is unchecked). 1: mid++.","[2,0,1]|mid=0 is 2: swap with hi -> [1,0,2], hi=1|mid=0 is 1: mid=1|mid=1 is 0: swap with lo -> [0,1,2]"],
["Keep four borders (top, bottom, left, right) and shrink one after each side for spiral. Rotate image = transpose, then reverse each row.","[[1,2],[3,4]] rotate 90 degrees|transpose: [[1,3],[2,4]]|reverse each row: [[3,1],[4,2]]"],
["Do it in order: skip spaces, read the sign, read digits. Before `res = res*10 + d`, check it will not pass `INT_MAX`.","'  -42abc'|skip spaces|sign is '-'|digits 4, 2 -> 42|stop at 'a'|result -42"]],
2: [
["Store value -> index while scanning. For each x, look up `target - x` first, then insert x.","[2,7,11], target 9|x=2: need 7, not seen, store 2|x=7: need 2, found at index 0|answer [0,1]"],
["Use `int cnt[26]` or `unordered_map`. Count one side, subtract (or compare) the other.","'anagram' vs 'nagaram'|count first: a3 n1 g1 r1 m1|subtract second string|all zeros -> anagram"],
["Anagrams share the same sorted string. Use it as the map key and push the original string into that bucket.","['eat','tea','tan']|sorted keys: aet, aet, ant|aet -> [eat, tea]|ant -> [tan]"],
["Put everything in a set. Only start counting from x when `x-1` is NOT in the set, so each sequence is walked exactly once.","[100,4,200,1,3,2]|1 has no 0 -> start at 1|1,2,3,4 all present -> length 4|100 and 200 give length 1"],
["`mp[sum]` = how many times this prefix sum occurred. At each step add `mp[sum - k]` to the answer, then record `sum`. Seed with `mp[0] = 1`.","[1,1,1], k=2|mp = {0:1}|sum=1: mp[-1] = 0|sum=2: mp[0] = 1 -> ans 1|sum=3: mp[1] = 1 -> ans 2"],
["Two prefixes with the same `sum % k` mean the part between them is divisible by k. Normalise negatives: `((s % k) + k) % k`.","[4,5,0,-2], k=5|prefix mods: 4, 4, 4, 2|mod 4 appears 3 times|3 pairs -> 3 divisible subarrays"],
["Make `buckets[count]` (size n+1). Put each value in the bucket of its frequency, then read from the highest index down.","[1,1,1,2,2,3], k=2|counts: 1:3, 2:2, 3:1|buckets[3]=[1], [2]=[2], [1]=[3]|read from top -> [1,2]"]],
3: [
["On sorted data: sum too small -> `l++`, too big -> `r--`. Each move throws away candidates that cannot work.","[1,3,4,6], target 9|l=0,r=3: 7 < 9 -> l++|l=1,r=3: 3+6 = 9 found"],
["Sort. For each i, run opposite-end pointers on the rest for `-a[i]`. Skip equal neighbours for i, l and r to avoid duplicate triples.","sorted [-4,-1,-1,0,1,2]|i=1 (-1): l=2 (-1), r=5 (2) -> sum 0, record|l=3 (0), r=4 (1) -> sum 0, record|i=2 is -1 again -> skip"],
["Slow marks the answer region, fast explores. Same direction, so it is O(n).","Remove duplicates [1,1,2,2,3]|slow=0|fast sees 2 (new): slow=1, a[1]=2|fast sees 3: slow=2, a[2]=3|length = slow+1 = 3"],
["Keep a running sum. Each step add `a[i]` and subtract `a[i-k]`, then update the best.","[1,12,-5,-6,50,3], k=4|first window sum = 2|slide: +50 -1 = 51|slide: +3 -12 = 42|best 51 -> average 12.75"],
["Expand `r` every step. While the window is invalid, move `l`. After fixing, record `r - l + 1`.","'abcabcbb'|window 'abc' length 3|r meets 'a' again: move l past the old 'a'|window 'bca' ... best stays 3"],
["Expand until the window becomes valid, then shrink from the left as long as it stays valid, recording the length each time.","target 7, [2,3,1,2,4,3]|2+3+1+2 = 8, length 4, shrink -> 6 (invalid)|keep sliding|window [4,3] = 7, length 2 is the best"],
["Keep a `need` count map and a `have` counter of satisfied characters. When all needs are met, shrink from the left and record the best window.","s='ADOBECODEBANC', t='ABC'|expand until A, B, C all covered: 'ADOBEC'|shrink while still valid|best window 'BANC'"],
["Exactly K = atMost(K) - atMost(K-1). To count atMost, add `r - l + 1` (all windows ending at r) each step.","[1,2,1,2,3], exactly 2 distinct|atMost(2) = 12|atMost(1) = 5|exactly 2 = 12 - 5 = 7"]],
4: [
["Push openers. On a closer, the top must be its partner, otherwise invalid. Valid only if the stack is empty at the end.","'({[]})'|push ( { [|']' matches [ -> pop|'}' matches { -> pop|')' matches ( -> pop|empty -> valid"],
["RPN: numbers push; an operator pops two (b first, then a) and pushes `a op b`. Infix: remember the last operator and resolve `*` and `/` immediately.","['2','1','+','3','*']|push 2, 1|'+': pop 1 and 2, push 3|push 3|'*': pop 3 and 3, push 9"],
["Stack of indices with decreasing values. A new x pops every smaller top, and x is the answer for each popped item.","temps [73,74,75,71,69,72,76]|74 arrives, pops 73: answer 1 day|75 pops 74: answer 1|71, 69 stay (decreasing)|72 pops 69 and 71: answers 1 and 2"],
["Keep increasing heights. When a shorter bar arrives, pop: height = popped bar, width = gap between the new top and the current index.","[2,1,5,6,2,3]|push 2; 1 pops 2 (area 2)|push 5, 6|bar 2 pops 6: 1 x 6 = 6|then pops 5: 2 x 5 = 10|best 10"],
["Store the running minimum next to every value, so `getMin` is just the top's second field.","push 5 -> (5,5)|push 3 -> (3,3)|push 7 -> (7,3)|pop 7: min is 3|pop 3: min is 5"],
["`in` receives pushes. For pop or peek, if `out` is empty move everything from `in` to `out` (this reverses the order). Amortised O(1).","push 1, 2, 3 -> in = [1,2,3]|pop: out is empty, move -> out = [3,2,1]|top of out is 1|returns 1 (first in, first out)"],
["Deque holds indices with decreasing values. Pop the back while smaller than the new value, pop the front if it left the window. Front = max.","[1,3,-1,-3,5], k=3|add 1; add 3 pops 1 -> [3]|add -1 -> [3,-1], max 3|add -3 -> max 3|add 5 pops all smaller -> max 5"]],
5: [
["Make `ListNode dummy(0)` pointing at head, work with `cur`, return `dummy.next`. The head stops being a special case.","Remove 6 from 6 -> 1 -> 2|dummy -> 6 -> 1 -> 2|cur=dummy, cur.next is 6 -> skip it|return dummy.next = 1 -> 2"],
["Slow moves 1 step, fast moves 2. Fast at the end means slow is the middle. If they ever meet there is a cycle; put one pointer back at head and move both 1 step to find the cycle start.","1 -> 2 -> 3 -> 4 -> 5|slow: 1, 2, 3|fast: 1, 3, 5 (end)|slow = 3 is the middle"],
["Repeat: `next = cur->next; cur->next = prev; prev = cur; cur = next;`","1 -> 2 -> 3|cur=1: 1 -> null|cur=2: 2 -> 1|cur=3: 3 -> 2|head = prev = 3 -> 2 -> 1"],
["Move `fast` n steps ahead, then move both until fast is the last node. Slow now sits just before the target.","dummy -> 1 -> 2 -> 3 -> 4 -> 5, n=2|fast moves 2 steps (at 2)|move both until fast = 5, slow = 3|delete slow.next (4)"],
["Compare the two heads, attach the smaller to the tail, advance it. When one list ends, attach the rest of the other.","1 -> 3 and 2 -> 4|take 1, take 2, take 3, take 4|result 1 -> 2 -> 3 -> 4"],
["Reorder List: find the middle, reverse the second half, interleave. Palindrome: same first two steps, then compare node by node.","1 -> 2 -> 3 -> 4|split: 1 -> 2 and 3 -> 4|reverse second: 4 -> 3|interleave: 1 -> 4 -> 2 -> 3"],
["Map old node -> new node in a first pass, wire `next` and `random` through the map in a second. For O(1) space, insert each copy right after its original.","A -> B, A.random = B|pass 1: map[A]=A', map[B]=B'|pass 2: A'.next = B'|A'.random = map[B] = B'"],
["Map key -> node for O(1) lookup. Doubly linked list ordered by recency, so move-to-front and drop-tail are both O(1).","capacity 2|put(1), put(2): list 2, 1|get(1): move 1 to front -> 1, 2|put(3): evict tail 2 -> 3, 1"]],
6: [
["`mid = lo + (hi - lo) / 2`. Too small -> `lo = mid + 1`; too big -> `hi = mid - 1`. Loop while `lo <= hi`.","[1,3,5,7,9], target 7|mid=2 (5) < 7 -> lo=3|mid=3 (7) found"],
["Lower bound = first index with `a[i] >= x`. Use `while (lo < hi)`, `if (a[mid] >= x) hi = mid; else lo = mid + 1;`. Last occurrence = upper_bound - 1.","[5,7,7,8,8,10], x=8|lower_bound -> index 3|upper_bound -> index 5|range [3, 4]"],
["At mid, one half is always sorted. If the target lies inside the sorted half, go there; otherwise go the other way.","[4,5,6,7,0,1,2], target 0|mid=7: left half 4..7 is sorted, 0 not in it -> go right|[0,1,2]: mid=1 > 0 -> go left|found 0"],
["Write `ok(x)`: can we succeed with value x? It flips from false to true once. Binary search the smallest x where it is true.","Koko piles [3,6,7,11], h=8|speed 4: 1+2+2+3 = 8 hours, ok|speed 3: 1+2+3+4 = 10 hours, not ok|answer 4"],
["If `a[mid] < a[mid+1]` a peak lies to the right, otherwise to the left (mid may itself be the peak, so `hi = mid`).","[1,2,1,3,5,6,4]|mid=3 (3) < 5 -> lo=4|mid=5 (6) > 4 -> hi=5|mid=4 (5) < 6 -> lo=5|peak at index 5"],
["A row-sorted matrix is one sorted array of `m*n` items: `row = mid / n`, `col = mid % n`.","3 x 4 matrix, flat index 5|row = 5 / 4 = 1|col = 5 % 4 = 1|that is cell (1,1)"],
["Per key keep (time, value) sorted by time. Find the first time greater than t with upper_bound, then step back one.","key 'a': (1,'x'), (4,'y')|get at t=3|upper_bound finds time 4|step back -> 'x'"]],
7: [
["At index i there are two branches: skip it, or take it (push, recurse, pop). At the end record the path.","[1,2]|skip 1: skip 2 -> [], take 2 -> [2]|take 1: skip 2 -> [1], take 2 -> [1,2]|4 subsets"],
["Loop over all unused elements: mark used, push, recurse, unmark, pop. Record when the path has n items.","[1,2,3]|pick 1, pick 2, pick 3 -> [1,2,3]|backtrack, pick 3 then 2 -> [1,3,2]|6 permutations total"],
["The recursion takes `start`. Loop i from start; recurse with `i+1` (each item once) or `i` (reuse allowed).","Combination Sum [2,3], target 5|2 -> 2 -> 2 = 6, too big, back|2 -> 3 = 5 found [2,3]|nothing starts below 2 again"],
["Sort first. In the loop write `if (i > start && a[i] == a[i-1]) continue;`. Only the first copy is chosen at a given level.","[1,2,2]|level 0 picks 1 or the first 2|the second 2 is skipped at that level|[2,2] still works one level deeper"],
["Try every prefix `s[start..i]`; if it is valid, push it and recurse from `i+1`.","'aab' palindrome partitions|'a' then 'a' then 'b' -> [a,a,b]|'aa' then 'b' -> [aa,b]|'aab' is not a palindrome"],
["Mark the cell visited (set it to '#'), recurse in four directions, restore it on the way back.","Word Search for 'AB'|find A at (0,0)|set it to '#', look at neighbours for B|found -> true, else restore A and move on"],
["Track used columns and both diagonals (`r-c` and `r+c`). Skip any square that clashes, which prunes huge parts of the tree.","4-Queens: row 0 col 0, row 1 col 2|row 2: every square clashes (column or diagonal)|backtrack: row 1 tries col 3 instead"]],
8: [
["`dfs(node)`: preorder = process, left, right. Inorder = left, process, right. Postorder = left, right, process.","tree: 2 with children 1 and 3|preorder 2, 1, 3|inorder 1, 2, 3|postorder 1, 3, 2"],
["Ask both children for their answer, combine, return. Base case: null returns 0 or true.","`height(n) = 1 + max(height(L), height(R))`|leaf: 1 + max(0, 0) = 1|parent with leaves: 1 + 1 = 2"],
["The function returns the best path going DOWN one side (what the parent can extend), but updates a global `ans` using left + right through this node.","Diameter: left height 2, right height 1|ans = max(ans, 2 + 1) = 3|return 1 + max(2, 1) = 3 to the parent"],
["Pass information downward as parameters (remaining sum, max so far). Check at the node or leaf.","Path Sum 22: dfs(root, 22)|go left with 22 - 5 = 17|at a leaf, remaining equals the leaf value -> true"],
["Queue. Each round take `size = q.size()` and process exactly that many nodes: that is one level.","[3,9,20,null,null,15,7]|level 1: [3]|level 2: [9,20]|level 3: [15,7]"],
["dfs returns the node if it is p or q, otherwise combines children. If both children return non-null, this node is the LCA.","p=5, q=1 under root 3|left returns 5, right returns 1|both non-null -> 3 is the LCA"],
["Left < node < right. Validate with (lo, hi) bounds that tighten as you go down. Inorder traversal gives sorted values.","root 5, left 1, right 4|right subtree must be > 5|4 breaks the lower bound -> not a BST"],
["The first element of preorder is the root. Find it in inorder: everything to its left is the left subtree, so you know its size.","pre [3,9,20,15,7], in [9,3,15,20,7]|root 3|inorder left part [9] has size 1|left preorder [9], right preorder [20,15,7]"],
["Preorder with a marker like 'N' for null. To rebuild, read tokens recursively: node, then left, then right.","1 with left 2, right 3|string '1,2,N,N,3,N,N'|read 1, left reads 2 (N, N), right reads 3 (N, N)"]],
9: [
["Use `priority_queue<int, vector<int>, greater<int>>`. Push each value; if size > k, pop. The top is the kth largest.","[3,2,1,5,6,4], k=2|keep heap size 2|ends with {5, 6}|top = 5 = 2nd largest"],
["The same size-k min-heap lives in a class. `add(x)` pushes, trims to k, returns the top.","k=3, heap {4,5,8}|add 3: pushed then popped, top 4|add 10: heap {5,8,10}, top 5"],
["Count with a map, push (count, value) into a heap, pop k times.","[1,1,1,2,2,3], k=2|counts: 1->3, 2->2, 3->1|max-heap pops (3,1) then (2,2)|answer [1,2]"],
["Push each list's head. Pop the smallest, attach it to the result, push that node's next.","1 -> 4 and 2 -> 5|heap {1, 2}|pop 1, push 4|pop 2, push 5|pop 4, pop 5 -> 1,2,4,5"],
["`lo` = max-heap of the smaller half, `hi` = min-heap of the larger half; sizes differ by at most 1. The median is a top or the average of both tops.","add 5: lo{5}, median 5|add 2: lo{2}, hi{5}, median 3.5|add 8: lo{2,5}, hi{8}, median 5"],
["At every step take the best available option from a heap, update it, and put it back.","Reorganize 'aab'|heap by count: a:2, b:1|take a, take b, take a|result 'aba'"],
["A max-heap of size k keyed by distance. When it grows past k, pop the farthest.","points (1,1), (3,3), (0,2), k=2|squared distances 2, 18, 4|push all, pop 18|keep (1,1) and (0,2)"]],
10: [
["Sort by the key that makes the decision local, then make one pass remembering the last chosen item.","Meeting rooms [[0,30],[5,10],[15,20]]|sort by start|[5,10] starts before 30 ends -> overlap|conflict found in one pass"],
["Sort by start. If `next.start <= cur.end`, set `cur.end = max(cur.end, next.end)`; otherwise push cur and start a new one.","[1,3], [2,6], [8,10]|[1,3] + [2,6] -> [1,6]|8 > 6 -> close [1,6], start [8,10]|result [[1,6],[8,10]]"],
["Sort by END time. Keep an interval if it starts at or after the last kept end; otherwise skip it (it overlaps and ends later).","[1,2], [2,3], [3,4], [1,3]|sorted by end: [1,2], [2,3], [1,3], [3,4]|keep [1,2], keep [2,3]|skip [1,3], keep [3,4]|1 removal"],
["Scan with `reach = max(reach, i + a[i])`. If `i > reach` you are stuck. For Jump Game II, jump when you pass the end of the current range.","[2,3,1,1,4]|i=0: reach 2|i=1: reach 4|reach >= last index -> true"],
["Track `tank += gas[i] - cost[i]`. If it goes negative, no start up to i works, so `start = i + 1` and reset the tank.","gas [1,2,3], cost [2,2,2]|differences -1, 0, 1|tank is -1 at index 0 -> start = 1|total >= 0 -> answer 1"],
["One pass left to right (compare with left neighbour), one pass right to left (compare with right neighbour), then take the max.","Candy, ratings [1,0,2]|left pass: [1,1,2]|right pass: index 0 beats index 1 -> [2,1,2]|total 5"],
["Find an ordering where sorted order makes the greedy choice obvious, such as sorting by `a - b`.","Two City: [10,20], [30,200], [400,50], [30,20]|sort by a - b: [30,200], [10,20], [30,20], [400,50]|first half to city A: 30 + 10|second half to city B: 20 + 50|total 110"],
["Sort. Pair the heaviest with the lightest: if they fit, move both pointers; otherwise the heaviest goes alone.","weights [3,2,2,1], limit 3|sorted 1,2,2,3|3 goes alone (3+1 too heavy)|2 + 1 fit together|last 2 alone -> 3 boats"]],
11: [
["Loop over all nodes. Each unvisited node starts a DFS that marks its whole component. Count the starts.","edges 0-1, node 2 alone|dfs(0) marks 0 and 1|dfs(2) marks 2|2 components"],
["Neighbours are `(r+1,c)`, `(r-1,c)`, `(r,c+1)`, `(r,c-1)`. Check bounds and visited before recursing.","dirs = {1,0},{-1,0},{0,1},{0,-1}|from (0,0) try each direction|skip out of range or water|island count = number of fresh DFS starts"],
["Queue of (node, dist). The first time you pop the target, its dist is the shortest. Mark visited when you PUSH, not when you pop.","edges 0-1, 0-2, 1-3, 2-3|queue: 0 (0)|push 1 and 2 (1)|pop 1, push 3 (2)|pop 3 -> shortest = 2"],
["Push ALL sources into the queue first with distance 0, then run one BFS. The distance spreads outward like a wave.","rotten oranges at two cells|both enter the queue at minute 0|each round rots all neighbours|answer = number of rounds"],
["Compute in-degrees. Queue the nodes with 0, pop, add to the order, decrement neighbours. If the order has fewer than n nodes, there is a cycle.","1 -> 2, 2 -> 3|indegree: 1:0, 2:1, 3:1|pop 1, 2 becomes 0|pop 2, pop 3 -> order 1, 2, 3"],
["`find` with path compression, `unite` by rank. If `find(a) == find(b)` before merging, that edge closes a cycle.","edges 1-2, 2-3, 1-3|union(1,2), union(2,3)|edge 1-3: same root already|redundant edge found"],
["Colour the start 0, its neighbours 1, and so on. If a neighbour already has your colour, there is an odd cycle: not bipartite.","triangle 0-1-2|0 gets A|1 and 2 get B|edge 1-2 joins two B -> fail"],
["Min-heap of (dist, node). Pop the smallest; skip if stale. Relax every edge and push any improved distance.","A->B 4, A->C 1, C->B 2|pop A(0): B=4, C=1|pop C(1): B = min(4, 3) = 3|B settles at 3"],
["Kruskal: sort edges by weight, take an edge if its endpoints are in different DSU sets, stop at n-1 edges.","edges 1-2 (1), 2-3 (2), 1-3 (3)|take 1-2, take 2-3|1-3 would form a cycle, skip|total cost 3"],
["Make nodes out of words or variables and edges out of the relations, then BFS or DFS. In Word Ladder, words one letter apart are neighbours.","hit -> hot -> dot -> dog -> cog|each arrow changes one letter|BFS gives the shortest ladder length 5"]],
12: [
["Write `dp[i]` in words first, for example 'best loot using houses up to i'. Then `dp[i] = max(skip, take)`.","House Robber [2,7,9,3,1]|dp: 2, 7, 11, 11, 12|each step: max(dp[i-1], dp[i-2] + a[i])|answer 12"],
["`dp[s]` = can we make sum s. For each item loop s DOWNWARD so each item is used once: `dp[s] |= dp[s - x]`.","[1,5,11,5], target 11|dp[0] = true|item 1 -> 1 reachable|item 5 -> 5, 6|item 11 -> 11 reachable, partition exists"],
["Loop s UPWARD so an item can reuse itself. Min coins: `dp[s] = min(dp[s], dp[s-c] + 1)`. Counting combinations: coins in the outer loop, amount inner.","coins [1,2,5], amount 11|dp[5] = 1, dp[10] = 2|dp[11] = dp[10] + 1 = 3|5 + 5 + 1"],
["`dp[i] = 1 + max(dp[j])` for j < i with `a[j] < a[i]`. Faster: keep a `tails` array and `lower_bound` each x into it.","[10,9,2,5,3,7]|tails: [10] -> [9] -> [2] -> [2,5] -> [2,3] -> [2,3,7]|length 3"],
["`dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])` (or the sum for counting paths). Fill row by row.","Unique Paths 3 x 3|row 0 and column 0 are all 1|dp[1][1]=2, dp[1][2]=3, dp[2][1]=3|dp[2][2] = 6"],
["`dp[i][j]` covers the first i chars of A and first j chars of B. Equal chars: diagonal + 1 (LCS). Otherwise take the best of up or left (edit distance adds 1).","LCS 'abc' vs 'ac'|a = a -> 1|b vs c: carry 1|c = c -> 2"],
["Word Break: `dp[i]` is true if some j < i has `dp[j]` true and `s[j..i)` is in the dictionary. Palindromes: expand left and right while the chars match.","'leetcode', dict {leet, code}|dp[4] true ('leet')|dp[8]: dp[4] and 'code' in dict -> true"],
["Name the states (hold, sold, rest) and write how each day moves between them.","prices [1,2,3,0,2] with cooldown|hold = max(hold, rest - price)|sold = hold + price|rest = max(rest, prevSold)|answer 3"],
["`dp[l][r]` = best for the range. Try every split k (the LAST balloon to burst) and combine `dp[l][k-1]` and `dp[k+1][r]`.","[3,1,5]|pick k as the last balloon in range|score = best(left) + best(right) + nums[l-1] * nums[k] * nums[r+1]|try every k, keep the max"],
["Return a pair per node: (best if robbed, best if skipped). The parent combines its children's pairs.","node 3 with children 2 and 3|rob: 3 + skip(left) + skip(right)|skip: max(rob, skip) of each child|return both values upward"]]
};

export const X: Record<string, [string, string, string, string]> = {
"1:2": ["Many range-sum queries on a fixed array, or a question about 'sum between i and j'.", "Build O(n), each query O(1).", "Off-by-one: make `pre` size n+1 with `pre[0] = 0` so `l = 0` needs no special case.",
`vector<int> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i+1] = pre[i] + a[i];
int rangeSum = pre[r+1] - pre[l];   // a[l..r]`],
"1:3": ["Best contiguous subarray sum, or any 'best ending here' question on a 1D array.", "O(n) time, O(1) space.", "Start `cur` and `best` at `nums[0]`, not 0, or all-negative arrays give the wrong answer.",
`int cur = nums[0], best = nums[0];
for (int i = 1; i < n; i++) {
  cur = max(nums[i], cur + nums[i]);   // extend or restart
  best = max(best, cur);
}`],
"2:0": ["You need a pair that satisfies a condition and the array is NOT sorted.", "O(n) time, O(n) space.", "Look up the complement BEFORE inserting the current value, otherwise x can pair with itself.",
`unordered_map<int,int> seen;
for (int i = 0; i < n; i++) {
  if (seen.count(target - a[i])) return {seen[target - a[i]], i};
  seen[a[i]] = i;
}`],
"2:4": ["Count or find subarrays with a given sum, and negatives are allowed (so a sliding window will not work).", "O(n) time, O(n) space.", "Forgetting `mp[0] = 1` misses subarrays that start at index 0.",
`unordered_map<int,int> mp{{0, 1}};
int sum = 0, ans = 0;
for (int x : a) {
  sum += x;
  if (mp.count(sum - k)) ans += mp[sum - k];
  mp[sum]++;
}`],
"3:0": ["Sorted array and you want a pair or the best pair, or a symmetric structure like a palindrome.", "O(n) after sorting.", "It only works on sorted data. If the order matters and the array is unsorted, use hashing instead.",
`int l = 0, r = n - 1;
while (l < r) {
  int s = a[l] + a[r];
  if (s == target) return {l, r};
  if (s < target) l++; else r--;
}`],
"3:4": ["'Longest substring or subarray such that [condition]' where the condition breaks when you add too much.", "O(n): l and r each move at most n times.", "Update the answer AFTER the shrink loop, when the window is valid again.",
`unordered_set<char> in;
int l = 0, best = 0;
for (int r = 0; r < n; r++) {
  while (in.count(s[r])) in.erase(s[l++]);   // shrink until valid
  in.insert(s[r]);
  best = max(best, r - l + 1);
}`],
"4:2": ["'Next greater / smaller element', 'how many days until', or anything that asks about the nearest bigger value on one side.", "O(n): every index is pushed and popped once.", "Store INDICES, not values, so you can compute distances. Decide strict (>) vs non-strict (>=) for equal values.",
`stack<int> st;                  // indices, values decreasing
vector<int> ans(n, 0);
for (int i = 0; i < n; i++) {
  while (!st.empty() && t[i] > t[st.top()]) {
    ans[st.top()] = i - st.top();
    st.pop();
  }
  st.push(i);
}`],
"5:1": ["Middle of a list, cycle detection, or anything about 'the nth node from the end' without knowing the length.", "O(n) time, O(1) space.", "Always check `fast && fast->next` before moving fast two steps, or you dereference null.",
`ListNode *slow = head, *fast = head;
while (fast && fast->next) {
  slow = slow->next;
  fast = fast->next->next;
  if (slow == fast) return true;   // cycle
}
return false;`],
"5:2": ["Reverse a whole list or a part of it, and a building block for palindrome and reorder problems.", "O(n) time, O(1) space.", "Save `cur->next` BEFORE you overwrite it, or you lose the rest of the list.",
`ListNode *prev = nullptr, *cur = head;
while (cur) {
  ListNode* nxt = cur->next;   // save first
  cur->next = prev;            // flip
  prev = cur;
  cur = nxt;
}
return prev;                    // new head`],
"6:1": ["First or last position of a value, insert position, or 'smallest index where something becomes true'.", "O(log n).", "Use `hi = n` (not n-1) so 'not found, insert at the end' is a valid answer, and loop `while (lo < hi)`.",
`int lo = 0, hi = n;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] >= x) hi = mid;   // could be the answer, keep it
  else lo = mid + 1;
}
return lo;                      // first index with a[i] >= x`],
"6:3": ["'Minimum X such that it is possible' or 'maximum of the minimum'. The answer is a number and feasibility is monotonic.", "O(log(range) * cost of ok()).", "Get the range right: lo = smallest possible answer, hi = largest possible answer. Check that ok() really flips only once.",
`auto ok = [&](int x) { /* can we succeed with x? */ };
int lo = 1, hi = maxAnswer;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (ok(mid)) hi = mid;       // works, try smaller
  else lo = mid + 1;
}
return lo;`],
"7:0": ["Generate all subsets, or any problem where every element is simply in or out.", "O(2^n * n).", "Copy the path when recording (`res.push_back(path)` copies), and always undo with `pop_back()` after the recursive call.",
`void dfs(int i, vector<int>& path) {
  if (i == n) { res.push_back(path); return; }
  dfs(i + 1, path);            // skip a[i]
  path.push_back(a[i]);        // take a[i]
  dfs(i + 1, path);
  path.pop_back();             // undo
}`],
"7:3": ["The input has repeated values but the output must not repeat a combination or subset.", "Same as plain backtracking, but far fewer branches.", "You MUST sort first. The test is `i > start`, not `i > 0`, otherwise you block valid deeper picks.",
`sort(a.begin(), a.end());
void dfs(int start, vector<int>& path) {
  res.push_back(path);
  for (int i = start; i < n; i++) {
    if (i > start && a[i] == a[i-1]) continue;   // skip duplicate
    path.push_back(a[i]);
    dfs(i + 1, path);
    path.pop_back();
  }
}`],
"8:2": ["The answer is a path that can bend at a node (diameter, max path sum), so the parent can only continue one side.", "O(n) time, O(h) stack.", "Return and update are DIFFERENT values: update uses both children, return uses only the better one.",
`int best = 0;
int down(TreeNode* n) {
  if (!n) return 0;
  int L = max(0, down(n->left));     // ignore negative paths
  int R = max(0, down(n->right));
  best = max(best, L + R + n->val);  // path bending here
  return n->val + max(L, R);         // parent extends one side
}`],
"8:4": ["Anything 'by level', 'right side view', 'zigzag', or the minimum depth.", "O(n) time, O(width) space.", "Read `q.size()` into a variable BEFORE the inner loop, because the queue grows while you push children.",
`queue<TreeNode*> q; q.push(root);
while (!q.empty()) {
  int sz = q.size();             // freeze the level size
  vector<int> level;
  while (sz--) {
    auto* n = q.front(); q.pop();
    level.push_back(n->val);
    if (n->left) q.push(n->left);
    if (n->right) q.push(n->right);
  }
  res.push_back(level);
}`],
"9:0": ["'Kth largest/smallest', 'top K' where sorting everything is wasteful.", "O(n log k) time, O(k) space.", "For the Kth LARGEST use a MIN-heap (it keeps the K biggest and exposes the smallest of them).",
`priority_queue<int, vector<int>, greater<int>> pq;   // min-heap
for (int x : a) {
  pq.push(x);
  if ((int)pq.size() > k) pq.pop();
}
return pq.top();                // kth largest`],
"10:1": ["Overlapping intervals that need to be combined, counted or inserted.", "O(n log n) for the sort, then O(n).", "Sort by START first. Use `<=` if touching intervals like [1,2] and [2,3] should merge.",
`sort(v.begin(), v.end());
vector<vector<int>> res{v[0]};
for (auto& iv : v) {
  if (iv[0] <= res.back()[1])
    res.back()[1] = max(res.back()[1], iv[1]);   // overlap, extend
  else
    res.push_back(iv);                           // gap, new interval
}`],
"11:2": ["Shortest path or minimum steps when every edge costs the same (grid moves, word ladder).", "O(V + E).", "Mark visited when you PUSH to the queue, not when you pop, or nodes get queued many times.",
`queue<pair<int,int>> q; q.push({src, 0});
vector<bool> vis(n, false); vis[src] = true;
while (!q.empty()) {
  auto [u, d] = q.front(); q.pop();
  if (u == dst) return d;
  for (int v : adj[u])
    if (!vis[v]) { vis[v] = true; q.push({v, d + 1}); }
}
return -1;`],
"11:4": ["Tasks with prerequisites: 'can all be finished?' or 'give a valid order'.", "O(V + E).", "If the result has fewer than n nodes, there is a cycle. Do not forget this check.",
`vector<int> indeg(n, 0), order; queue<int> q;
for (auto& e : edges) { adj[e[0]].push_back(e[1]); indeg[e[1]]++; }
for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
while (!q.empty()) {
  int u = q.front(); q.pop(); order.push_back(u);
  for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
// order.size() < n  means a cycle`],
"11:5": ["Dynamic connectivity: 'are a and b connected', count components, find the edge that creates a cycle.", "Almost O(1) per operation (inverse Ackermann).", "Always compare roots with `find()`, never the raw parent array, and compress paths.",
`vector<int> p(n); iota(p.begin(), p.end(), 0);
function<int(int)> find = [&](int x) {
  return p[x] == x ? x : p[x] = find(p[x]);   // path compression
};
auto unite = [&](int a, int b) {
  a = find(a); b = find(b);
  if (a == b) return false;                    // same set: cycle
  p[a] = b; return true;
};`],
"11:7": ["Shortest path with NON-NEGATIVE edge weights (network delay, cheapest route, minimum effort).", "O((V + E) log V).", "Skip stale heap entries with `if (d > dist[u]) continue;`. Dijkstra breaks with negative edges: use Bellman-Ford there.",
`priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
vector<int> dist(n, INT_MAX); dist[s] = 0; pq.push({0, s});
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;                   // stale entry
  for (auto [v, w] : adj[u])
    if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
}`],
"12:1": ["Choose items with a limit (sum, weight) where each item can be used ONCE. Subset sum, partition, target sum.", "O(n * target) time, O(target) space.", "The inner loop MUST go downward. Going upward silently turns it into the unbounded version.",
`vector<bool> dp(target + 1, false); dp[0] = true;
for (int x : a)
  for (int s = target; s >= x; s--)   // downward: each item once
    dp[s] = dp[s] || dp[s - x];`],
"12:2": ["Items can be reused: coin change, ways to make an amount, rod cutting.", "O(amount * coins).", "Min coins: seed with a large value, not 0, and guard `INT_MAX + 1` overflow. Counting ways: coins in the OUTER loop for combinations.",
`vector<int> dp(amount + 1, INT_MAX); dp[0] = 0;
for (int s = 1; s <= amount; s++)
  for (int c : coins)
    if (s >= c && dp[s - c] != INT_MAX)
      dp[s] = min(dp[s], dp[s - c] + 1);
return dp[amount] == INT_MAX ? -1 : dp[amount];`],
"12:5": ["Two strings or sequences compared together: LCS, edit distance, interleaving, shortest common supersequence.", "O(n * m) time and space (can be reduced to two rows).", "Index shift: `dp[i][j]` is about the first i and j characters, so compare `A[i-1]` with `B[j-1]`.",
`vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
for (int i = 1; i <= n; i++)
  for (int j = 1; j <= m; j++)
    dp[i][j] = (A[i-1] == B[j-1]) ? dp[i-1][j-1] + 1
                                  : max(dp[i-1][j], dp[i][j-1]);`]
};


export const Y: Record<string, [string, string, string]> = {
/* ---------------- Topic 1: Arrays and Strings ---------------- */
"1:0": ["You never need to compare every pair. Keep just enough memory of the past (for stock: the lowest price so far) and each new element can be judged against it in O(1).",
"Decide the one fact about the past you need (minimum so far, best so far, count so far)|Initialise it from the first element, not from 0|For each element, first use the fact to update the answer|Then update the fact itself|Return the answer after one pass",
`int mn = prices[0], best = 0;
for (int p : prices) {
  best = max(best, p - mn);   // sell today
  mn = min(mn, p);            // cheapest buy so far
}
return best;`],
"1:1": ["Split the array into a finished prefix [0, w) and the unread rest. Because w is never ahead of r, you can overwrite the array without destroying anything you still need to read.",
"w = 0 is where the next kept value goes|Scan r over every index|If a[r] should be kept, write a[w++] = a[r]|After the loop the first w items are the answer|Fill or ignore the tail, as the problem asks",
`int w = 0;
for (int r = 0; r < n; r++)
  if (nums[r] != 0) nums[w++] = nums[r];
while (w < n) nums[w++] = 0;     // move zeroes`],
"1:4": ["Rotating right by k moves the last k items to the front. Reversing everything puts them in front but backwards; reversing each block afterwards fixes both orders.",
"k %= n, because k can be larger than n|Reverse the whole array|Reverse the first k items|Reverse the remaining n - k items",
`k %= n;
reverse(a.begin(), a.end());
reverse(a.begin(), a.begin() + k);
reverse(a.begin() + k, a.end());`],
"1:5": ["Keep three zones: [0, lo) are 0s, [lo, mid) are 1s, (hi, n) are 2s, and [mid, hi] is still unknown. Every step shrinks the unknown zone by one, so a single pass is enough.",
"lo = 0, mid = 0, hi = n - 1|While mid <= hi look at a[mid]|If 0: swap with lo, then lo++ and mid++|If 1: just mid++|If 2: swap with hi and only hi-- (the value swapped in has not been checked yet)",
`int lo = 0, mid = 0, hi = n - 1;
while (mid <= hi) {
  if (a[mid] == 0) swap(a[lo++], a[mid++]);
  else if (a[mid] == 1) mid++;
  else swap(a[mid], a[hi--]);
}`],
"1:6": ["Rotating 90 degrees is a mirror over the diagonal (transpose) followed by a mirror left to right. A spiral walk simply peels the four borders and pulls them inward.",
"Rotate: swap a[i][j] with a[j][i] for every j > i|Then reverse each row|Spiral: keep top, bottom, left, right borders|Walk the top row, right column, bottom row, left column, shrinking the border after each walk|Before the bottom and left walks check the borders have not crossed",
`for (int i = 0; i < n; i++)
  for (int j = i + 1; j < n; j++) swap(m[i][j], m[j][i]);   // transpose
for (auto& row : m) reverse(row.begin(), row.end());        // mirror`],
"1:7": ["Parsing is a tiny state machine: spaces, then an optional sign, then digits. The only real danger is overflow, so check while building the number, not after.",
"i = 0, skip leading spaces|Read '+' or '-' into sign|While s[i] is a digit, do res = res * 10 + digit|After each digit, clamp to INT_MAX or INT_MIN and stop if exceeded|Return sign * res",
`int i = 0, sign = 1; long long res = 0;
while (i < n && s[i] == ' ') i++;
if (i < n && (s[i] == '-' || s[i] == '+')) sign = (s[i++] == '-') ? -1 : 1;
while (i < n && isdigit(s[i])) {
  res = res * 10 + (s[i++] - '0');
  if (res * sign > INT_MAX) return INT_MAX;
  if (res * sign < INT_MIN) return INT_MIN;
}
return (int)(res * sign);`],

/* ---------------- Topic 2: Hashing ---------------- */
"2:1": ["Two collections are 'the same' when they hold the same items with the same counts. Counting turns that comparison into comparing numbers, so order stops mattering.",
"Choose a container: int cnt[26] for lowercase letters, unordered_map otherwise|Add 1 for each item of the first input|Subtract 1 for each item of the second|A negative count while subtracting, or any non-zero count at the end, means they differ",
`if (s.size() != t.size()) return false;
int cnt[26] = {0};
for (char c : s) cnt[c - 'a']++;
for (char c : t) if (--cnt[c - 'a'] < 0) return false;
return true;`],
"2:2": ["Items that should be grouped look different but share a property. Compute a signature that is identical for the whole group and use it as the map key.",
"Decide the signature (sorted string, or 26 letter counts)|For each item compute its signature|map[signature].push_back(item)|Output all the map's values",
`unordered_map<string, vector<string>> g;
for (auto& w : strs) {
  string key = w; sort(key.begin(), key.end());
  g[key].push_back(w);
}
vector<vector<string>> res;
for (auto& [k, v] : g) res.push_back(v);
return res;`],
"2:3": ["A set answers 'have I seen x?' in O(1). For the longest consecutive run, only start counting at numbers whose predecessor is missing, so each number is visited at most twice overall.",
"Insert all numbers into an unordered_set|For each x, skip it if x - 1 is in the set (it is not a start)|Otherwise count upward x + 1, x + 2 ... while they exist|Keep the longest count",
`unordered_set<int> st(a.begin(), a.end());
int best = 0;
for (int x : st) {
  if (st.count(x - 1)) continue;        // not the start
  int y = x, len = 1;
  while (st.count(y + 1)) { y++; len++; }
  best = max(best, len);
}
return best;`],
"2:5": ["If prefix[j] % k equals prefix[i] % k, the numbers between i and j add up to a multiple of k. So only the remainders matter, and a map from remainder to count finds all pairs.",
"mp[0] = 1 to represent the empty prefix|Keep a running sum and compute r = ((sum % k) + k) % k (fixes negatives)|Add mp[r] to the answer: each earlier equal remainder is one valid subarray|Then do mp[r]++",
`unordered_map<int,int> mp{{0, 1}};
int sum = 0, ans = 0;
for (int x : a) {
  sum += x;
  int r = ((sum % k) + k) % k;
  ans += mp[r]++;                 // use old count, then increment
}
return ans;`],
"2:6": ["A frequency can never exceed n, so instead of sorting by frequency you can index by it. That makes top-K O(n) instead of O(n log n).",
"Count each value with an unordered_map|Make vector<vector<int>> buckets(n + 1)|Put each value into buckets[its count]|Scan from the highest bucket downward and collect values until you have k",
`unordered_map<int,int> cnt;
for (int x : a) cnt[x]++;
vector<vector<int>> b(a.size() + 1);
for (auto& [v, c] : cnt) b[c].push_back(v);
vector<int> res;
for (int f = a.size(); f >= 1 && (int)res.size() < k; f--)
  for (int v : b[f]) res.push_back(v);
return res;`],

/* ---------------- Topic 3: Two Pointers and Sliding Window ---------------- */
"3:1": ["3Sum is Two Sum II repeated for every first element. Sorting makes the inner two-pointer scan valid and puts duplicates next to each other so they are easy to skip.",
"Sort the array|For each i, skip it if a[i] == a[i-1]|Set l = i + 1 and r = n - 1|If the sum is too small l++, if too big r--|On a hit record it, move both pointers, and skip equal values so no duplicate triple appears",
`sort(a.begin(), a.end());
for (int i = 0; i < n - 2; i++) {
  if (i && a[i] == a[i-1]) continue;
  int l = i + 1, r = n - 1;
  while (l < r) {
    int s = a[i] + a[l] + a[r];
    if (s < 0) l++;
    else if (s > 0) r--;
    else {
      res.push_back({a[i], a[l], a[r]});
      l++; r--;
      while (l < r && a[l] == a[l-1]) l++;
    }
  }
}`],
"3:2": ["Two indices move in the same direction: fast reads ahead, slow marks the boundary of what is already final. Slow can never pass fast, so overwriting in place is safe.",
"slow = 1 (the first item is always kept)|For fast from 1 to n - 1|Compare a[fast] with the last kept item a[slow - 1]|If different, a[slow++] = a[fast]|The answer length is slow",
`int slow = 1;
for (int fast = 1; fast < n; fast++)
  if (a[fast] != a[slow - 1]) a[slow++] = a[fast];
return slow;`],
"3:3": ["Consecutive windows of size k share k - 1 items. Instead of re-adding k items every time, add the one entering and remove the one leaving.",
"Sum the first k items and record that as the best|For i from k to n - 1 do sum += a[i] - a[i - k]|Update the best after every slide",
`int s = 0;
for (int i = 0; i < k; i++) s += a[i];
int best = s;
for (int i = k; i < n; i++) {
  s += a[i] - a[i - k];
  best = max(best, s);
}
return best;`],
"3:5": ["With positive numbers, adding makes the sum bigger and removing makes it smaller. So once the window is valid you can shrink it greedily to its shortest valid size.",
"Expand r and add a[r] to sum|While sum >= target: record r - l + 1, subtract a[l], l++|The answer is the smallest recorded length, or 0 if the window was never valid",
`int l = 0, sum = 0, best = INT_MAX;
for (int r = 0; r < n; r++) {
  sum += a[r];
  while (sum >= target) {
    best = min(best, r - l + 1);
    sum -= a[l++];
  }
}
return best == INT_MAX ? 0 : best;`],
"3:6": ["A window is valid when it contains every needed character often enough. Track how many distinct requirements are fully met; when all are met the window is valid and you can try to shrink it.",
"need[c] = how many of c you still need; missing = number of distinct characters in t|Expand r: decrement need[s[r]]; when it hits 0, missing--|While missing == 0: record the window, then give back s[l] (need++); if it becomes positive, missing++; l++|Return the best window",
`unordered_map<char,int> need;
for (char c : t) need[c]++;
int missing = need.size(), l = 0, bs = 0, bl = INT_MAX;
for (int r = 0; r < (int)s.size(); r++) {
  if (need.count(s[r]) && --need[s[r]] == 0) missing--;
  while (missing == 0) {
    if (r - l + 1 < bl) { bl = r - l + 1; bs = l; }
    if (need.count(s[l]) && ++need[s[l]] > 0) missing++;
    l++;
  }
}
return bl == INT_MAX ? "" : s.substr(bs, bl);`],
"3:7": ["Counting windows with exactly K of something is hard because validity is not monotonic, but 'at most K' is monotonic. Subtracting the two counts leaves exactly K.",
"Write atMost(k): a normal window that shrinks while it has more than k distinct values|For each r add r - l + 1 (every valid window that ends at r)|Answer = atMost(k) - atMost(k - 1)",
`auto atMost = [&](int k) {
  unordered_map<int,int> c; int l = 0, res = 0;
  for (int r = 0; r < n; r++) {
    c[a[r]]++;
    while ((int)c.size() > k) {
      if (--c[a[l]] == 0) c.erase(a[l]);
      l++;
    }
    res += r - l + 1;
  }
  return res;
};
return atMost(k) - atMost(k - 1);`],

/* ---------------- Topic 4: Stack and Queue ---------------- */
"4:0": ["The most recently opened bracket must be the first one closed. That is exactly last in, first out, which is what a stack does.",
"Push every opening bracket|On a closing bracket, if the stack is empty or its top is not the partner, return false|Otherwise pop|At the end the stack must be empty",
`stack<char> st;
unordered_map<char,char> m{{')','('}, {']','['}, {'}','{'}};
for (char c : s) {
  if (!m.count(c)) st.push(c);
  else {
    if (st.empty() || st.top() != m[c]) return false;
    st.pop();
  }
}
return st.empty();`],
"4:1": ["In postfix an operator always applies to the two most recent results, so a stack of operands is enough. For infix, finish * and / immediately and keep + and - terms to add up at the end.",
"Numbers: push them|Operator: pop b first, then a, and push a op b (order matters for - and /)|Infix version: remember the previous operator; when you meet a new one, apply the previous operator to the number you just read|+ pushes num, - pushes -num, * and / change the stack top|Sum the stack at the end",
`stack<int> st;
for (auto& t : tokens) {
  if (t == "+" || t == "-" || t == "*" || t == "/") {
    int b = st.top(); st.pop();
    int a = st.top(); st.pop();
    st.push(t == "+" ? a + b : t == "-" ? a - b : t == "*" ? a * b : a / b);
  } else st.push(stoi(t));
}
return st.top();`],
"4:3": ["For each bar, the biggest rectangle that uses it as the height stretches left and right until a shorter bar. A stack of increasing heights finds both limits: the bar below it in the stack is the left limit and the bar that pops it is the right limit.",
"Append a 0-height bar at the end so everything is flushed|For each i, while the top bar is taller than h[i], pop it as the height|width = i if the stack is now empty, else i - st.top() - 1|area = height * width, update the best|Push i",
`h.push_back(0);
stack<int> st; int best = 0;
for (int i = 0; i < (int)h.size(); i++) {
  while (!st.empty() && h[st.top()] > h[i]) {
    int height = h[st.top()]; st.pop();
    int width = st.empty() ? i : i - st.top() - 1;
    best = max(best, height * width);
  }
  st.push(i);
}
return best;`],
"4:4": ["The minimum only changes when you push or pop. If every element remembers the minimum up to itself, getMin is O(1) no matter what has been popped.",
"Store pairs (value, minimum up to here)|push: new min = stack empty ? x : min(x, top.second)|pop: simply pop the pair|getMin returns top.second",
`stack<pair<int,int>> st;
void push(int x) { st.push({x, st.empty() ? x : min(x, st.top().second)}); }
void pop()       { st.pop(); }
int top()        { return st.top().first; }
int getMin()     { return st.top().second; }`],
"4:5": ["Moving all items from one stack to another reverses their order, so the oldest item ends up on top. Do the move only when the output stack is empty and each item moves at most once (amortised O(1)).",
"push always goes onto the 'in' stack|pop or peek: if 'out' is empty, move everything from 'in' to 'out'|Then pop or peek from 'out'|The queue is empty when both stacks are empty",
`stack<int> in, out;
void push(int x) { in.push(x); }
int peek() {
  if (out.empty())
    while (!in.empty()) { out.push(in.top()); in.pop(); }
  return out.top();
}
int pop() { int v = peek(); out.pop(); return v; }`],
"4:6": ["In a sliding window, an older item that is smaller than a newer one can never be the maximum again, so throw it away. What remains is decreasing and its front is always the max.",
"The deque stores indices|Before adding i, pop from the back while a[back] <= a[i]|Push i|Pop the front if it is <= i - k (left the window)|Once i >= k - 1, a[front] is the window maximum",
`deque<int> dq; vector<int> res;
for (int i = 0; i < n; i++) {
  while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
  dq.push_back(i);
  if (dq.front() <= i - k) dq.pop_front();
  if (i >= k - 1) res.push_back(a[dq.front()]);
}
return res;`],

/* ---------------- Topic 5: Linked List ---------------- */
"5:0": ["Changing the head is awkward because nothing points to it. A fake node placed before the head gives every real node a predecessor, so one code path handles every case.",
"ListNode dummy(0); dummy.next = head|cur = &dummy|Look at cur->next (the candidate) and rewire cur->next to skip it or insert before it|Move cur only when you did not remove anything|Return dummy.next",
`ListNode dummy(0); dummy.next = head;
ListNode* cur = &dummy;
while (cur->next) {
  if (cur->next->val == val) cur->next = cur->next->next;   // skip it
  else cur = cur->next;
}
return dummy.next;`],
"5:3": ["To find the nth node from the end without knowing the length, keep two pointers n apart. When the front one falls off the end, the back one is exactly n from the end.",
"Dummy node before the head; fast = slow = &dummy|Move fast n + 1 steps ahead|Move both until fast is null|slow now sits just before the target|slow->next = slow->next->next",
`ListNode dummy(0); dummy.next = head;
ListNode *fast = &dummy, *slow = &dummy;
for (int i = 0; i <= n; i++) fast = fast->next;
while (fast) { fast = fast->next; slow = slow->next; }
slow->next = slow->next->next;
return dummy.next;`],
"5:4": ["The smallest remaining item is always at the front of one of the two lists. Repeatedly taking the smaller front builds the sorted result in a single pass.",
"Dummy node and a tail pointer|While both lists are non-empty, attach the smaller front node to tail and advance that list|Attach whichever list still has nodes|Return dummy.next",
`ListNode dummy(0), *t = &dummy;
while (a && b) {
  if (a->val <= b->val) { t->next = a; a = a->next; }
  else                  { t->next = b; b = b->next; }
  t = t->next;
}
t->next = a ? a : b;
return dummy.next;`],
"5:5": ["Hard list problems are usually easy pieces glued together: find the middle, reverse a half, then combine. Learn each piece alone and reuse it.",
"Find the middle with slow and fast pointers|Cut the list there (slow->next = nullptr)|Reverse the second half|Reorder List: interleave the two halves; Palindrome: compare the two halves node by node",
`// reverseList() is the in-place reversal from the earlier pattern
ListNode *slow = head, *fast = head;
while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
ListNode* b = reverseList(slow->next);
slow->next = nullptr;
ListNode* a = head;
while (b) {
  ListNode *an = a->next, *bn = b->next;
  a->next = b; b->next = an;
  a = an; b = bn;
}`],
"5:6": ["A random pointer points into the old list, but you need the matching node in the new list. A map old -> new translates instantly.",
"First pass: create a copy of every node and store map[old] = copy|Second pass: copy->next = map[old->next], copy->random = map[old->random]|Set map[nullptr] = nullptr so null pointers need no special case|Return map[head]",
`unordered_map<Node*, Node*> mp; mp[nullptr] = nullptr;
for (Node* p = head; p; p = p->next) mp[p] = new Node(p->val);
for (Node* p = head; p; p = p->next) {
  mp[p]->next   = mp[p->next];
  mp[p]->random = mp[p->random];
}
return mp[head];`],
"5:7": ["You need O(1) lookup (a hash map) and O(1) 'move to most recent' and 'drop least recent' (a linked list). Together they make an LRU cache.",
"A std::list keeps the order, front = most recently used|A map from key to list iterator finds any node instantly|get: if found, splice that node to the front and return its value|put: update and move to front, or insert at front; if size exceeds capacity erase the back item and its map entry",
`list<pair<int,int>> L;
unordered_map<int, list<pair<int,int>>::iterator> mp;
int cap;
int get(int k) {
  if (!mp.count(k)) return -1;
  L.splice(L.begin(), L, mp[k]);          // move to front
  return mp[k]->second;
}
void put(int k, int v) {
  if (mp.count(k)) { mp[k]->second = v; L.splice(L.begin(), L, mp[k]); return; }
  L.push_front({k, v}); mp[k] = L.begin();
  if ((int)L.size() > cap) { mp.erase(L.back().first); L.pop_back(); }
}`],

/* ---------------- Topic 6: Binary Search ---------------- */
"6:0": ["The array is sorted, so the middle element tells you which half cannot contain the target. Every comparison throws away half of the remaining range.",
"lo = 0, hi = n - 1|While lo <= hi compute mid = lo + (hi - lo) / 2|Equal: return mid|Smaller than target: lo = mid + 1; bigger: hi = mid - 1|If the loop ends, return -1",
`int lo = 0, hi = n - 1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == t) return mid;
  if (a[mid] < t) lo = mid + 1;
  else hi = mid - 1;
}
return -1;`],
"6:2": ["Cutting a rotated sorted array at mid always leaves at least one half fully sorted. Check whether the target lies inside that sorted half: if yes search it, otherwise search the other half.",
"Compute mid; if a[mid] == t return it|If a[lo] <= a[mid] the left half is sorted: if a[lo] <= t < a[mid] go left, else go right|Otherwise the right half is sorted: if a[mid] < t <= a[hi] go right, else go left",
`while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] == t) return mid;
  if (a[lo] <= a[mid]) {                       // left half sorted
    if (a[lo] <= t && t < a[mid]) hi = mid - 1; else lo = mid + 1;
  } else {                                     // right half sorted
    if (a[mid] < t && t <= a[hi]) lo = mid + 1; else hi = mid - 1;
  }
}
return -1;`],
"6:4": ["If a[mid] < a[mid + 1] you are walking uphill, so a peak must exist on the right because values cannot climb forever. Otherwise a peak exists at mid or on its left.",
"lo = 0, hi = n - 1|While lo < hi compute mid|If a[mid] < a[mid + 1] then lo = mid + 1, else hi = mid|When lo == hi that index is a peak",
`int lo = 0, hi = n - 1;
while (lo < hi) {
  int mid = lo + (hi - lo) / 2;
  if (a[mid] < a[mid + 1]) lo = mid + 1;
  else hi = mid;
}
return lo;`],
"6:5": ["If every row is sorted and each row starts after the previous one ends, the matrix is just a sorted array wrapped into rows. Convert a flat index into a row and a column.",
"Treat it as one array of m * n items: lo = 0, hi = m * n - 1|mid gives row = mid / n and col = mid % n|Compare mat[row][col] with the target and run an ordinary binary search",
`int lo = 0, hi = m * n - 1;
while (lo <= hi) {
  int mid = lo + (hi - lo) / 2;
  int v = mat[mid / n][mid % n];
  if (v == t) return true;
  if (v < t) lo = mid + 1; else hi = mid - 1;
}
return false;`],
"6:6": ["Timestamps for one key arrive in increasing order, so each key's list is already sorted. 'Latest entry at or before t' is the last element <= t, which is upper_bound minus one.",
"unordered_map<string, vector<pair<int,string>>> keeps (time, value) per key|set: push_back the pair|get: upper_bound on the time t|If the result is begin() nothing is old enough, return empty; otherwise return the previous element's value",
`unordered_map<string, vector<pair<int,string>>> m;
void set(string k, string v, int t) { m[k].push_back({t, v}); }
string get(string k, int t) {
  auto& v = m[k];
  auto it = upper_bound(v.begin(), v.end(), make_pair(t, string("~")));
  return it == v.begin() ? "" : prev(it)->second;
}`],

/* ---------------- Topic 7: Recursion and Backtracking ---------------- */
"7:1": ["A permutation is built by choosing, position by position, any item not used yet. Marking an item as used and un-marking it on return lets one array serve every branch of the search.",
"path holds the partial permutation and used[i] marks taken items|If path.size() == n, record a copy of path|Loop over every index i and skip used ones|Mark used, push, recurse|On return pop and unmark (this is the 'un-choose' step)",
`void dfs(vector<int>& path) {
  if (path.size() == a.size()) { res.push_back(path); return; }
  for (int i = 0; i < (int)a.size(); i++) {
    if (used[i]) continue;
    used[i] = true; path.push_back(a[i]);
    dfs(path);
    path.pop_back(); used[i] = false;
  }
}`],
"7:2": ["Order does not matter in a combination, so [1,2] and [2,1] are the same set. Forcing every next choice to come from an index at or after the current one removes the repeats.",
"dfs(start, remaining, path)|If remaining == 0 record the path; if it is below 0 stop|Loop i from start (sort the array first so you can stop early)|Push a[i] and recurse with i (reuse allowed) or i + 1 (each item once)|Pop after returning",
`void dfs(int start, int rem, vector<int>& path) {
  if (rem == 0) { res.push_back(path); return; }
  for (int i = start; i < (int)a.size() && a[i] <= rem; i++) {   // a is sorted
    path.push_back(a[i]);
    dfs(i, rem - a[i], path);          // i, not i + 1: reuse allowed
    path.pop_back();
  }
}`],
"7:4": ["Cutting a string into valid pieces means choosing where the first piece ends, then solving the same problem for the rest of the string.",
"dfs(start, path)|If start == n, record the path|For end from start to n - 1 check that s[start..end] is valid|If valid, push that piece and recurse from end + 1|Pop after returning",
`bool isPal(const string& s, int l, int r) {
  while (l < r) if (s[l++] != s[r--]) return false;
  return true;
}
void dfs(int start, vector<string>& path) {
  if (start == (int)s.size()) { res.push_back(path); return; }
  for (int e = start; e < (int)s.size(); e++) {
    if (!isPal(s, start, e)) continue;
    path.push_back(s.substr(start, e - start + 1));
    dfs(e + 1, path);
    path.pop_back();
  }
}`],
"7:5": ["A path in a grid must not reuse a cell. Mark a cell as used when you step on it and restore it when you leave, so other paths are free to use it again.",
"Try every cell as a starting point|dfs(r, c, k): fail if out of bounds or the cell is not word[k]|If k is the last character, return true|Mark the cell (for example '#'), try the 4 neighbours with k + 1, then restore the cell|Return true if any neighbour succeeded",
`bool dfs(int r, int c, int k) {
  if (r < 0 || c < 0 || r >= m || c >= n || b[r][c] != w[k]) return false;
  if (k == (int)w.size() - 1) return true;
  char ch = b[r][c]; b[r][c] = '#';
  bool ok = dfs(r+1, c, k+1) || dfs(r-1, c, k+1) || dfs(r, c+1, k+1) || dfs(r, c-1, k+1);
  b[r][c] = ch;                         // restore
  return ok;
}`],
"7:6": ["Place one queen per row, so rows can never clash. Only the column and the two diagonals need checking, and boolean arrays make that O(1), which prunes huge parts of the search.",
"dfs(row)|If row == n, record the board|For each column skip it if col[c], d1[r - c + n] or d2[r + c] is taken|Place the queen and mark all three, then recurse to row + 1|Unmark and remove the queen",
`vector<bool> col(n), d1(2 * n), d2(2 * n);
vector<string> board(n, string(n, '.'));
void dfs(int r) {
  if (r == n) { res.push_back(board); return; }
  for (int c = 0; c < n; c++) {
    if (col[c] || d1[r - c + n] || d2[r + c]) continue;
    col[c] = d1[r - c + n] = d2[r + c] = true; board[r][c] = 'Q';
    dfs(r + 1);
    col[c] = d1[r - c + n] = d2[r + c] = false; board[r][c] = '.';
  }
}`],

/* ---------------- Topic 8: Trees and BST ---------------- */
"8:0": ["A recursive tree function reaches each node three times: before its children, between them, after them. Preorder, inorder and postorder differ only in which moment you do the work.",
"Base case: a null node returns immediately|Preorder: use the node, then recurse left, then right|Inorder: left, use the node, right (gives sorted order in a BST)|Postorder: left, right, then use the node (children are finished first)",
`void dfs(TreeNode* n) {
  if (!n) return;
  // preorder: process n here
  dfs(n->left);
  // inorder: process n here
  dfs(n->right);
  // postorder: process n here
}`],
"8:1": ["If you know the answer for each child subtree, the parent's answer is a small combination of them. So the function trusts its children and only does the combining step.",
"Say in one sentence what the function returns (for example the height of this subtree)|Base case: null returns 0 (or true)|Call the function on left and right|Combine the two results into this node's answer|Check any condition on the way (balanced? equal?)",
`int h(TreeNode* n) {                       // -1 means "not balanced"
  if (!n) return 0;
  int L = h(n->left), R = h(n->right);
  if (L == -1 || R == -1 || abs(L - R) > 1) return -1;
  return 1 + max(L, R);
}
bool isBalanced(TreeNode* root) { return h(root) != -1; }`],
"8:3": ["Some facts depend on the path from the root, such as the remaining sum or the largest value so far. Pass that information down as parameters so each node receives exactly what it needs.",
"Decide what a node must know about its ancestors|Add it as a function parameter|At the node, check the condition using that parameter|Update the parameter and pass it to both children|Combine the children's results (use || when you only need one success)",
`bool hasPathSum(TreeNode* n, int rem) {
  if (!n) return false;
  rem -= n->val;
  if (!n->left && !n->right) return rem == 0;     // leaf
  return hasPathSum(n->left, rem) || hasPathSum(n->right, rem);
}`],
"8:5": ["Ask the left and right subtrees whether they contain p or q. If both sides say yes, this node is where the two paths split, so it is the lowest common ancestor.",
"If the node is null, p or q, return the node|Recurse into left and right|If both results are non-null, return the current node|Otherwise return whichever result is non-null",
`TreeNode* lca(TreeNode* n, TreeNode* p, TreeNode* q) {
  if (!n || n == p || n == q) return n;
  TreeNode* L = lca(n->left, p, q);
  TreeNode* R = lca(n->right, p, q);
  return (L && R) ? n : (L ? L : R);
}`],
"8:6": ["In a BST everything on the left is smaller and everything on the right is larger, so each node must lie inside an allowed range that narrows as you go down. An inorder walk also gives sorted values.",
"check(node, lo, hi): a null node is valid|The value must be strictly between lo and hi|The left child gets the range (lo, node) and the right child (node, hi)|Use long long bounds so values equal to INT_MIN or INT_MAX still work",
`bool ok(TreeNode* n, long long lo, long long hi) {
  if (!n) return true;
  if (n->val <= lo || n->val >= hi) return false;
  return ok(n->left, lo, n->val) && ok(n->right, n->val, hi);
}
bool isValidBST(TreeNode* r) { return ok(r, LLONG_MIN, LLONG_MAX); }`],
"8:7": ["The first preorder value is the root. In the inorder list everything left of the root is the left subtree, so its size tells you how to cut the preorder list too.",
"Map each inorder value to its index for O(1) lookup|build(preL, preR, inL, inR)|root = pre[preL]; find its inorder position k|leftSize = k - inL|Build the left subtree from the next leftSize preorder items and the right subtree from the rest",
`unordered_map<int,int> pos;               // inorder value -> index
TreeNode* build(int pl, int pr, int il, int ir) {
  if (pl > pr) return nullptr;
  TreeNode* root = new TreeNode(pre[pl]);
  int k = pos[pre[pl]], leftSize = k - il;
  root->left  = build(pl + 1, pl + leftSize, il, k - 1);
  root->right = build(pl + leftSize + 1, pr, k + 1, ir);
  return root;
}`],
"8:8": ["A preorder walk that writes an explicit marker for every null child contains enough information to rebuild the exact tree, because each node's two children are always accounted for.",
"Serialize: preorder, writing the value or 'N' for null, separated by commas|Deserialize: put the tokens in a queue|Read one token: 'N' returns null|Otherwise create a node, build its left subtree from the next tokens, then its right",
`void ser(TreeNode* n, string& s) {
  if (!n) { s += "N,"; return; }
  s += to_string(n->val) + ",";
  ser(n->left, s); ser(n->right, s);
}
TreeNode* des(queue<string>& q) {
  string t = q.front(); q.pop();
  if (t == "N") return nullptr;
  TreeNode* n = new TreeNode(stoi(t));
  n->left = des(q); n->right = des(q);
  return n;
}`],

/* ---------------- Topic 9: Heap and Priority Queue ---------------- */
"9:1": ["Keep only the k largest numbers seen so far. The smallest of those k is the kth largest overall, and a min-heap shows it instantly.",
"Constructor: add every initial number, trimming to size k|add(x): push x|If the size is above k, pop the smallest|Return the top",
`priority_queue<int, vector<int>, greater<int>> pq; int k;
KthLargest(int k, vector<int>& a) : k(k) { for (int x : a) add(x); }
int add(int x) {
  pq.push(x);
  if ((int)pq.size() > k) pq.pop();
  return pq.top();
}`],
"9:2": ["Counting gives (value, count) pairs, and a heap hands you the pair with the biggest count each time without sorting everything.",
"Count with an unordered_map|Push (count, value) pairs into a max-heap|Pop k times and collect the values",
`unordered_map<int,int> cnt;
for (int x : a) cnt[x]++;
priority_queue<pair<int,int>> pq;               // max-heap on count
for (auto& [v, c] : cnt) pq.push({c, v});
vector<int> res;
while (k--) { res.push_back(pq.top().second); pq.pop(); }
return res;`],
"9:3": ["The overall smallest item must be at the front of one of the K lists. A min-heap of the K fronts gives it in O(log K), and after taking it, its successor becomes the new front.",
"Push each list's head into a min-heap ordered by value|Pop the smallest and append it to the result|If it has a next node, push that node|Repeat until the heap is empty",
`auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
for (auto* l : lists) if (l) pq.push(l);
ListNode dummy(0), *t = &dummy;
while (!pq.empty()) {
  ListNode* n = pq.top(); pq.pop();
  t->next = n; t = n;
  if (n->next) pq.push(n->next);
}
return dummy.next;`],
"9:4": ["The median sits between the lower half and the upper half. A max-heap holds the lower half and a min-heap holds the upper half, so both middle candidates are always on top.",
"lo (max-heap) holds the smaller half, hi (min-heap) the larger half|add: push into lo, then move lo's top into hi|If hi now has more items than lo, move hi's top back into lo|Median: if lo is larger return lo.top(), otherwise the average of both tops",
`priority_queue<int> lo;
priority_queue<int, vector<int>, greater<int>> hi;
void add(int x) {
  lo.push(x); hi.push(lo.top()); lo.pop();
  if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
}
double median() {
  return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
}`],
"9:5": ["When every step needs 'the best option available right now' and the options keep changing, a heap gives you that option in O(log n). Use it, and push it back if anything is left.",
"Work out what 'best' means (largest remaining count, earliest end time...)|Push all options into a heap|Pop the best and use it|If it still has some left, push it back (sometimes after a cooldown)|Stop when the heap is empty or the rule is broken",
`unordered_map<char,int> cnt; for (char c : s) cnt[c]++;
priority_queue<pair<int,char>> pq;
for (auto& [c, k] : cnt) pq.push({k, c});
string res;
while (pq.size() >= 2) {
  auto [k1, c1] = pq.top(); pq.pop();
  auto [k2, c2] = pq.top(); pq.pop();
  res += c1; res += c2;                       // two different letters
  if (--k1) pq.push({k1, c1});
  if (--k2) pq.push({k2, c2});
}
if (!pq.empty()) { if (pq.top().first > 1) return ""; res += pq.top().second; }
return res;`],
"9:6": ["To keep the k closest items, evict the farthest whenever you hold too many. A max-heap keyed by distance puts the farthest on top, ready to be evicted.",
"Compute a distance (use squared distance, no square root needed)|Push (distance, index) into a max-heap|If the size is above k, pop the top|What remains are the k closest",
`priority_queue<pair<int,int>> pq;               // (dist^2, index)
for (int i = 0; i < (int)p.size(); i++) {
  pq.push({p[i][0] * p[i][0] + p[i][1] * p[i][1], i});
  if ((int)pq.size() > k) pq.pop();
}
vector<vector<int>> res;
while (!pq.empty()) { res.push_back(p[pq.top().second]); pq.pop(); }
return res;`],

/* ---------------- Topic 10: Greedy and Intervals ---------------- */
"10:0": ["Sorting puts related items next to each other, so a global decision becomes local: you only need to compare each item with the last chosen one.",
"Decide what to sort by (start, end, ratio...)|Sort|Walk once, remembering the last chosen item|At each item either take it, skip it, or merge it into the last one",
`sort(v.begin(), v.end());                    // meeting rooms: can one person attend all?
for (int i = 1; i < (int)v.size(); i++)
  if (v[i][0] < v[i - 1][1]) return false;    // overlaps the previous one
return true;`],
"10:2": ["To fit the most intervals, always keep the one that finishes earliest, because it leaves the most room for everything after it.",
"Sort by end time|Keep the first interval and remember its end|For each next interval: if start >= lastEnd, keep it and update lastEnd|Otherwise skip it and count one removal",
`sort(v.begin(), v.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
int end = v[0][1], removed = 0;
for (int i = 1; i < (int)v.size(); i++) {
  if (v[i][0] >= end) end = v[i][1];
  else removed++;
}
return removed;`],
"10:3": ["You do not need the exact path, only how far you could possibly get. If you ever stand beyond your reach, the end is unreachable.",
"Jump Game: reach = 0; for each i, if i > reach return false; reach = max(reach, i + a[i])|Jump Game II: track curEnd (end of the current jump's range) and far (farthest reach)|When i reaches curEnd, you must jump: jumps++ and curEnd = far|Return jumps",
`int jumps = 0, curEnd = 0, far = 0;            // Jump Game II
for (int i = 0; i < n - 1; i++) {
  far = max(far, i + a[i]);
  if (i == curEnd) { jumps++; curEnd = far; }
}
return jumps;`],
"10:4": ["If you cannot get from station i to station j starting at i, you cannot get there starting from any station in between either, since you would arrive with even less fuel. So the next candidate start is j + 1.",
"If total gas is less than total cost, return -1|tank = 0 and start = 0|For each i add gas[i] - cost[i] to tank|If tank drops below 0, set start = i + 1 and tank = 0|Return start",
`int total = 0, tank = 0, start = 0;
for (int i = 0; i < n; i++) {
  int d = gas[i] - cost[i];
  total += d; tank += d;
  if (tank < 0) { start = i + 1; tank = 0; }
}
return total >= 0 ? start : -1;`],
"10:5": ["Each child's candies depend on both neighbours. Handle the left neighbour in one pass and the right neighbour in another, then take the larger so both rules hold.",
"Give everyone 1 candy|Left to right: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1|Right to left: if rating[i] > rating[i+1], candy[i] = max(candy[i], candy[i+1] + 1)|Sum all candies",
`vector<int> c(n, 1);
for (int i = 1; i < n; i++)
  if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;
for (int i = n - 2; i >= 0; i--)
  if (r[i] > r[i + 1]) c[i] = max(c[i], c[i + 1] + 1);
return accumulate(c.begin(), c.end(), 0);`],
"10:6": ["If you can state 'which item should go first' as a rule between two items, sorting by that rule makes the greedy choice obvious. Look for a quantity like a - b (what you lose by choosing A instead of B).",
"Ask what changes if item X goes to option A instead of option B|Express it as a number, such as cost A - cost B|Sort by that number|Give the first half to A and the second half to B (or take the best prefix)|Add everything up",
`sort(c.begin(), c.end(), [](auto& x, auto& y) {
  return x[0] - x[1] < y[0] - y[1];          // cheapest to send to city A first
});
int total = 0, n = c.size() / 2;
for (int i = 0; i < n; i++) total += c[i][0] + c[i + n][1];
return total;`],
"10:7": ["The heaviest person either shares a boat with the lightest person or rides alone. If even the lightest cannot fit with them, nobody can.",
"Sort the weights|l = 0 and r = n - 1|If a[l] + a[r] <= limit, they share a boat: l++|The heaviest always leaves: r-- and boats++|Stop when l > r",
`sort(a.begin(), a.end());
int l = 0, r = n - 1, boats = 0;
while (l <= r) {
  if (a[l] + a[r] <= limit) l++;     // lightest shares the boat
  r--; boats++;
}
return boats;`],

/* ---------------- Topic 11: Graphs ---------------- */
"11:0": ["A DFS from any node reaches its whole connected group. So every time you start a fresh DFS from an unvisited node, you have found one new component.",
"Build adjacency lists and a visited array|For each node, if it is not visited: count++ and start a DFS|DFS marks the node and recurses into unvisited neighbours",
`void dfs(int u) {
  vis[u] = true;
  for (int v : adj[u]) if (!vis[v]) dfs(v);
}
int components = 0;
for (int i = 0; i < n; i++)
  if (!vis[i]) { components++; dfs(i); }`],
"11:1": ["A grid is a graph where each cell connects to its four neighbours. You never build the graph; you compute neighbours with direction offsets.",
"Think of directions as dr = {1,-1,0,0}, dc = {0,0,1,-1}|Write dfs(r, c): return if out of bounds, water or already visited|Mark it visited (or sink it by changing the cell)|Recurse in the four directions|Count how many times you start a fresh DFS",
`void dfs(int r, int c) {
  if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] != '1') return;
  g[r][c] = '0';                                // mark visited
  dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
}
int islands = 0;
for (int i = 0; i < m; i++)
  for (int j = 0; j < n; j++)
    if (g[i][j] == '1') { islands++; dfs(i, j); }`],
"11:3": ["BFS expands in waves of equal distance. If many sources start together at distance 0, the waves spread at the same time, and every cell is reached first by its nearest source.",
"Push every source into the queue at once|Process the queue one level at a time (use the queue size)|Visit unvisited neighbours and push them|Count the levels: that is the time or distance",
`queue<pair<int,int>> q; int fresh = 0, mins = 0;
for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
  if (g[i][j] == 2) q.push({i, j}); else if (g[i][j] == 1) fresh++;
}
int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
while (!q.empty() && fresh) {
  for (int s = q.size(); s--; ) {
    auto [r, c] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
      int x = r + dr[d], y = c + dc[d];
      if (x < 0 || y < 0 || x >= m || y >= n || g[x][y] != 1) continue;
      g[x][y] = 2; fresh--; q.push({x, y});
    }
  }
  mins++;
}
return fresh ? -1 : mins;`],
"11:6": ["A graph can be two-coloured exactly when it has no odd cycle. Colour one node, force all its neighbours to the opposite colour, and a conflict proves an odd cycle.",
"color[] = -1 for every node (uncoloured)|For each uncoloured node start a BFS with colour 0|Give each uncoloured neighbour the opposite colour and push it|If a neighbour already has the same colour as the current node, return false|Return true if no conflict appeared",
`vector<int> color(n, -1);
for (int s = 0; s < n; s++) {
  if (color[s] != -1) continue;
  queue<int> q; q.push(s); color[s] = 0;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) {
      if (color[v] == -1) { color[v] = color[u] ^ 1; q.push(v); }
      else if (color[v] == color[u]) return false;
    }
  }
}
return true;`],
"11:8": ["Taking the cheapest edge that does not form a cycle is always safe, so sort all edges and add them greedily. Union-Find checks for cycles in almost O(1).",
"List all edges as (weight, u, v) and sort by weight|Create a DSU (parent array with path compression)|For each edge, if find(u) != find(v): unite them, add the weight|Stop after n - 1 edges",
`sort(edges.begin(), edges.end());                 // (w, u, v)
vector<int> p(n); iota(p.begin(), p.end(), 0);
function<int(int)> find = [&](int x) { return p[x] == x ? x : p[x] = find(p[x]); };
int cost = 0, used = 0;
for (auto& [w, u, v] : edges) {
  int a = find(u), b = find(v);
  if (a == b) continue;                           // would form a cycle
  p[a] = b; cost += w;
  if (++used == n - 1) break;
}
return cost;`],
"11:9": ["Many problems hide a graph: words are nodes and one-letter differences are edges, or variables are nodes and ratios are weighted edges. Once the graph is built, an ordinary BFS or DFS does the rest.",
"Decide what a node is and when two nodes are connected|Build the adjacency map, or generate neighbours on the fly|Run BFS for the fewest steps or DFS for any path|Return the level count or the accumulated product",
`unordered_set<string> dict(words.begin(), words.end());
queue<pair<string,int>> q; q.push({begin, 1});
while (!q.empty()) {
  auto [w, d] = q.front(); q.pop();
  if (w == end) return d;
  for (int i = 0; i < (int)w.size(); i++) {
    string t = w;
    for (char c = 'a'; c <= 'z'; c++) {
      t[i] = c;
      if (dict.count(t)) { dict.erase(t); q.push({t, d + 1}); }
    }
  }
}
return 0;`],

/* ---------------- Topic 12: Dynamic Programming ---------------- */
"12:0": ["If the best answer up to position i can be built from the answers at i - 1 and i - 2, you only need to remember those two. Writing the state in plain words first prevents most DP mistakes.",
"State: dp[i] = best result using the first i items (say it in words)|Base cases: dp[0] and dp[1]|Transition: dp[i] = max(skip item i, take item i) using earlier values|Answer: dp[n]|Optimise: keep only the last two values",
`int prev2 = 0, prev1 = 0;                       // House Robber
for (int x : a) {
  int cur = max(prev1, prev2 + x);              // skip this house or rob it
  prev2 = prev1; prev1 = cur;
}
return prev1;`],
"12:3": ["For every length L, remember the smallest tail value an increasing subsequence of length L can end with. A smaller tail is always better and the tails stay sorted, so each new number can be placed with a binary search.",
"tails = empty list|For each x find the first tail >= x with lower_bound|If none exists, append x (a longer subsequence is possible)|Otherwise replace that tail with x|The answer is tails.size() (the list itself is not the real subsequence)",
`vector<int> tails;
for (int x : a) {
  auto it = lower_bound(tails.begin(), tails.end(), x);
  if (it == tails.end()) tails.push_back(x);
  else *it = x;
}
return tails.size();`],
"12:4": ["In a grid where you can only move right or down, every cell is reached from the cell above or the cell on its left, so its answer is built from those two.",
"dp[r][c] = answer for reaching cell (r, c)|The first row and first column have only one way to arrive|dp[r][c] = grid + min(up, left) for costs, or up + left for counting paths|The answer is the bottom-right cell",
`for (int r = 0; r < m; r++)                     // Minimum Path Sum
  for (int c = 0; c < n; c++) {
    if (r == 0 && c == 0) continue;
    int up   = r ? g[r - 1][c] : INT_MAX;
    int left = c ? g[r][c - 1] : INT_MAX;
    g[r][c] += min(up, left);                   // reuse the grid as the dp table
  }
return g[m - 1][n - 1];`],
"12:6": ["Ask 'can the first i characters be built?'. It is true if some earlier cut j is buildable and the piece between j and i is allowed. Palindrome problems instead grow outward from a centre.",
"dp[0] = true (the empty prefix)|For i from 1 to n, try every cut j < i|If dp[j] is true and s.substr(j, i - j) is in the dictionary, set dp[i] = true and stop|The answer is dp[n]",
`unordered_set<string> dict(words.begin(), words.end());
vector<bool> dp(n + 1, false); dp[0] = true;
for (int i = 1; i <= n; i++)
  for (int j = 0; j < i; j++)
    if (dp[j] && dict.count(s.substr(j, i - j))) { dp[i] = true; break; }
return dp[n];`],
"12:7": ["On every day you are in exactly one situation (holding stock, just sold, resting). Write one variable per situation and describe how a day moves you from one situation to another.",
"List the states (hold, sold, rest)|For each state write which states can lead to it today|Start hold at minus infinity, since you cannot hold before buying|Update all states from yesterday's values (use a temporary for the old one)|The answer is the best state that is not holding",
`int hold = INT_MIN, sold = 0, rest = 0;
for (int p : prices) {
  int prevSold = sold;
  sold = hold + p;                // sell today
  hold = max(hold, rest - p);     // keep holding, or buy today
  rest = max(rest, prevSold);     // do nothing (cooldown over)
}
return max(sold, rest);`],
"12:8": ["Think about the LAST balloon burst in a range instead of the first. Then the balloons on its left and right no longer affect each other, which splits the problem into two smaller ranges.",
"Pad the array with 1 on both ends|dp[l][r] = best coins from bursting everything strictly between l and r|For each range length, try every k between l and r as the last balloon|dp[l][r] = max(dp[l][k] + dp[k][r] + a[l] * a[k] * a[r])|The answer is dp[0][n - 1] of the padded array",
`vector<int> a = {1};
a.insert(a.end(), nums.begin(), nums.end()); a.push_back(1);
int n = a.size();
vector<vector<int>> dp(n, vector<int>(n, 0));
for (int len = 2; len < n; len++)
  for (int l = 0; l + len < n; l++) {
    int r = l + len;
    for (int k = l + 1; k < r; k++)
      dp[l][r] = max(dp[l][r], dp[l][k] + dp[k][r] + a[l] * a[k] * a[r]);
  }
return dp[0][n - 1];`],
"12:9": ["A node's best answer depends on a choice (take it or not) that changes what its children may do. Returning both outcomes from every child lets the parent combine them without recomputing anything.",
"Return a pair {rob, skip} for each node|A null node returns {0, 0}|rob = node value + left.skip + right.skip|skip = max(left.rob, left.skip) + max(right.rob, right.skip)|The answer is the larger value in the root's pair",
`pair<int,int> dfs(TreeNode* n) {                // {rob, skip}
  if (!n) return {0, 0};
  auto L = dfs(n->left), R = dfs(n->right);
  int rob  = n->val + L.second + R.second;
  int skip = max(L.first, L.second) + max(R.first, R.second);
  return {rob, skip};
}
int rob(TreeNode* root) { auto p = dfs(root); return max(p.first, p.second); }`]
};

