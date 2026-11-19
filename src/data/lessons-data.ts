export interface VizFrame {
  note: string;
  cells?: any[];
  next?: any[];
  ptrs?: Record<string, number | string>;
  vars?: Record<string, any>;
  hl?: Record<string, string>;
  stack?: any[];
  out?: string;
  [key: string]: any;
}

export interface VizData {
  kind?: 'array' | 'grid' | 'linked' | 'tree' | 'graph' | string;
  cells?: any[];
  next?: any[];
  nodes?: any[];
  edges?: any[];
  rows?: any[];
  frames: VizFrame[];
  [key: string]: any;
}

export interface LessonExample {
  problem: string;
  walk: string;
  viz?: VizData;
}

export interface PatternLesson {
  name: string;
  when: string;
  idea: string;
  steps: string[];
  example: LessonExample;
  code: string;
  complexity: string;
  mistakes: string[];
  practice?: number[];
}

export type LessonsData = Record<string, Record<string, PatternLesson>>;

export const LESSONS_DATA: LessonsData = {
  "1": {
    "0": {
      "name": "Traversal and running value",
      "when": "You scan an array once and the answer depends on a running summary of what you saw so far: the smallest so far, the largest so far, a count of the current streak, or a total. Words like \"maximum profit\" or \"longest run of 1s\" are hints.",
      "idea": "You do not need to compare every pair. As you walk left to right, keep one or two small variables that summarise the past, such as the minimum price seen so far. At each new element, use that summary to answer \"what is the best result if I end right here?\", then update the summary. Because the past is squeezed into a couple of numbers, one pass is enough.",
      "steps": [
        "Decide what the running value is (min so far, current streak, running total).",
        "Start it with a safe value, such as INT_MAX for a minimum or 0 for a count.",
        "For each element, first use the running value to update the answer.",
        "Then update the running value with the current element.",
        "Return the answer after the loop ends."
      ],
      "example": {
        "problem": "Best Time to Buy and Sell Stock: prices[i] is the price on day i. Buy once, then sell on a later day for maximum profit. Input: [7, 1, 5, 3, 6, 4]. Output: 5 (buy at 1, sell at 6).",
        "walk": "Watch the min chip. It only ever goes down, and it always holds the best day to buy among the days already seen. Every day we ask one question: if I sell today, what is the profit against that min? The best answer over all days is 5, reached on the day with price 6. No nested loop is needed.",
        "viz": {
          "kind": "array",
          "cells": [
            7,
            1,
            5,
            3,
            6,
            4
          ],
          "frames": [
            {
              "note": "Prices by day. Walk left to right, keeping the lowest price so far and the best profit so far.",
              "ptrs": {
                "i": 0
              },
              "vars": {
                "min": "-",
                "best": 0
              }
            },
            {
              "note": "7 is a new lowest price, so it becomes the best day to buy. No profit from selling on the buy day itself.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "b"
              },
              "vars": {
                "min": 7,
                "best": 0
              }
            },
            {
              "note": "1 is a new lowest price, so it becomes the best day to buy. No profit from selling on the buy day itself.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "1": "b"
              },
              "vars": {
                "min": 1,
                "best": 0
              }
            },
            {
              "note": "Selling today gives 5 - 1 = 4, a new best profit.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "1": "b",
                "2": "ok"
              },
              "vars": {
                "min": 1,
                "best": 4
              }
            },
            {
              "note": "Selling today gives 3 - 1 = 2, not better than 4.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "1": "b",
                "3": "a"
              },
              "vars": {
                "min": 1,
                "best": 4
              }
            },
            {
              "note": "Selling today gives 6 - 1 = 5, a new best profit.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "1": "b",
                "4": "ok"
              },
              "vars": {
                "min": 1,
                "best": 5
              }
            },
            {
              "note": "Selling today gives 4 - 1 = 3, not better than 5.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "1": "b",
                "5": "a"
              },
              "vars": {
                "min": 1,
                "best": 5
              }
            },
            {
              "note": "Done. Best deal: buy at 1 on day 1, sell at 6 on day 4, profit 5.",
              "hl": {
                "1": "ok",
                "4": "ok"
              },
              "vars": {
                "min": 1,
                "best": 5
              },
              "out": "Answer: 5"
            }
          ]
        }
      },
      "code": "// Max profit from one buy and one later sell\nint maxProfit(vector<int>& prices) {\n    int minPrice = INT_MAX;   // cheapest price seen so far\n    int best = 0;             // best profit so far\n    for (int p : prices) {\n        minPrice = min(minPrice, p);        // update the running min\n        best = max(best, p - minPrice);     // sell today?\n    }\n    return best;\n}",
      "complexity": "Time O(n), one pass. Space O(1), only two variables.",
      "mistakes": [
        "Starting min at 0. A min of 0 makes every profit equal to the price itself. Start at INT_MAX or at prices[0].",
        "Selling before buying: always compute the profit against a min taken from earlier days (or the same day), never from later ones.",
        "Returning a negative number when prices only fall. Start best at 0 so \"do nothing\" is allowed."
      ],
      "practice": [
        121,
        485,
        53
      ]
    },
    "1": {
      "name": "Write pointer (in-place edit)",
      "when": "The problem says \"in place\", \"without extra space\" or \"return the new length\". You must remove, filter or move elements inside the same array, keeping the order of the ones you keep.",
      "idea": "Use two indexes that both move left to right. The read pointer r looks at every element. The write pointer w marks where the next kept element should go. If the element at r should be kept, copy it to w and move w forward. Otherwise skip it. Since w never gets ahead of r, you never overwrite a value you still need. At the end, the first w cells are your answer.",
      "steps": [
        "Set w to the first free slot (0, or 1 if the first element is always kept).",
        "Loop r over the array from the start.",
        "Decide whether a[r] is a keeper, for example a[r] != a[w - 1] for sorted duplicates, or a[r] != 0 for zeroes.",
        "If it is a keeper, do a[w] = a[r] and w++.",
        "Return w, the new length. Fill the rest with zeroes only if the problem asks for it."
      ],
      "example": {
        "problem": "Remove Duplicates from Sorted Array: remove duplicates in place so each value appears once, and return the new length k. Input: [1, 1, 2, 2, 3, 3, 3]. Output: k = 3, and the array starts with 1, 2, 3.",
        "walk": "Notice that w only moves when r finds a value different from the last kept one. Because the array is sorted, duplicates sit side by side, so comparing with a[w - 1] is enough. The cells after w keep old values, but they are ignored.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            1,
            2,
            2,
            3,
            3,
            3
          ],
          "frames": [
            {
              "note": "Sorted array. r reads every element, w marks where the next kept value is written. The first value is always kept.",
              "cells": [
                1,
                1,
                2,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 1,
                "w": 1
              },
              "hl": {
                "0": "ok",
                "1": "a"
              }
            },
            {
              "note": "a[r] = 1 equals the last kept value. It is a duplicate, so skip it and leave w where it is.",
              "cells": [
                1,
                1,
                2,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 1,
                "w": 1
              },
              "hl": {
                "0": "ok",
                "1": "bad"
              }
            },
            {
              "note": "a[r] = 2 differs from the last kept value 1. Write it at w and move w.",
              "cells": [
                1,
                2,
                2,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 2,
                "w": 2
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a"
              }
            },
            {
              "note": "a[r] = 2 equals the last kept value. It is a duplicate, so skip it and leave w where it is.",
              "cells": [
                1,
                2,
                2,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 3,
                "w": 2
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "3": "bad"
              }
            },
            {
              "note": "a[r] = 3 differs from the last kept value 2. Write it at w and move w.",
              "cells": [
                1,
                2,
                3,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 4,
                "w": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "4": "a"
              }
            },
            {
              "note": "a[r] = 3 equals the last kept value. It is a duplicate, so skip it and leave w where it is.",
              "cells": [
                1,
                2,
                3,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 5,
                "w": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "5": "bad"
              }
            },
            {
              "note": "a[r] = 3 equals the last kept value. It is a duplicate, so skip it and leave w where it is.",
              "cells": [
                1,
                2,
                3,
                2,
                3,
                3,
                3
              ],
              "ptrs": {
                "r": 6,
                "w": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "6": "bad"
              }
            },
            {
              "note": "Done. The first w = 3 cells hold the unique values 1, 2, 3. Whatever is after w no longer matters.",
              "ptrs": {
                "r": 7,
                "w": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "dim",
                "4": "dim",
                "5": "dim",
                "6": "dim"
              },
              "out": "Answer: k = 3, array starts 1 2 3"
            }
          ]
        }
      },
      "code": "// Keeps one copy of each value, returns the new length\nint removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int w = 1;                         // next slot to write\n    for (int r = 1; r < (int)nums.size(); r++) {\n        if (nums[r] != nums[w - 1]) {  // new value\n            nums[w++] = nums[r];\n        }\n    }\n    return w;\n}",
      "complexity": "Time O(n), one pass. Space O(1), the array is edited in place.",
      "mistakes": [
        "Comparing nums[r] with nums[r - 1] after you have started overwriting. Compare with nums[w - 1], the last value you kept.",
        "Forgetting the empty array case, which makes nums[w - 1] invalid when w starts at 1.",
        "Returning the last index instead of the count. The answer is w, not w - 1."
      ],
      "practice": [
        26,
        283,
        485
      ]
    },
    "2": {
      "name": "Prefix and suffix arrays",
      "when": "You need, for each position, a value that depends on everything to its left and/or everything to its right (sum, product, max), or you must answer many range-sum queries fast. Often the problem forbids division.",
      "idea": "A prefix array stores the running total of everything before each position. A suffix array does the same from the right. Once you have both, the answer for position i is just prefix[i] combined with suffix[i], in O(1). For range sums, prefix[r + 1] - prefix[l] gives the sum of any slice with one subtraction. You pay O(n) once to build the table, then every query is cheap. You can often reuse the output array and a single variable to avoid extra space.",
      "steps": [
        "Make the answer array res and fill it with the identity (1 for products, 0 for sums).",
        "Go left to right keeping a running value left. Set res[i] = left, then update left with a[i].",
        "Go right to left keeping a running value right. Multiply (or add) it into res[i], then update right with a[i].",
        "For range sum queries, build prefix[i + 1] = prefix[i] + a[i] and answer with prefix[r + 1] - prefix[l]."
      ],
      "example": {
        "problem": "Product of Array Except Self: return an array where res[i] is the product of all elements except nums[i], with no division. Input: [2, 3, 4, 5]. Output: [60, 40, 30, 24].",
        "walk": "The first pass fills each cell with the product of everything to its left (1, 2, 6, 24). The second pass multiplies in everything to the right. Watch that each cell gets \"left part\" first and \"right part\" second, so it never includes itself.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            1,
            1,
            1
          ],
          "frames": [
            {
              "note": "We want res[i] = product of all numbers except a[i], without dividing. Idea: left product times right product.",
              "cells": [
                1,
                1,
                1,
                1
              ],
              "vars": {
                "nums": "[2,3,4,5]"
              }
            },
            {
              "note": "Forward pass. res[0] = product of everything left of it = 1. Then left grows to 2.",
              "cells": [
                1,
                1,
                1,
                1
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "left": 2
              }
            },
            {
              "note": "Forward pass. res[1] = product of everything left of it = 2. Then left grows to 6.",
              "cells": [
                1,
                2,
                1,
                1
              ],
              "hl": {
                "0": "ok",
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "left": 6
              }
            },
            {
              "note": "Forward pass. res[2] = product of everything left of it = 6. Then left grows to 24.",
              "cells": [
                1,
                2,
                6,
                1
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "left": 24
              }
            },
            {
              "note": "Forward pass. res[3] = product of everything left of it = 24. Then left grows to 120.",
              "cells": [
                1,
                2,
                6,
                24
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "left": 120
              }
            },
            {
              "note": "Backward pass. Multiply res[3] by the product of everything right of it = 1. Then right becomes 5.",
              "cells": [
                1,
                2,
                6,
                24
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "right": 5
              }
            },
            {
              "note": "Backward pass. Multiply res[2] by the product of everything right of it = 5. Then right becomes 20.",
              "cells": [
                1,
                2,
                30,
                24
              ],
              "hl": {
                "2": "a",
                "3": "ok"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "right": 20
              }
            },
            {
              "note": "Backward pass. Multiply res[1] by the product of everything right of it = 20. Then right becomes 60.",
              "cells": [
                1,
                40,
                30,
                24
              ],
              "hl": {
                "1": "a",
                "2": "ok",
                "3": "ok"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "right": 60
              }
            },
            {
              "note": "Backward pass. Multiply res[0] by the product of everything right of it = 60. Then right becomes 120.",
              "cells": [
                60,
                40,
                30,
                24
              ],
              "hl": {
                "0": "a",
                "1": "ok",
                "2": "ok",
                "3": "ok"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "nums": "[2,3,4,5]",
                "right": 120
              },
              "out": "Answer: [60, 40, 30, 24]"
            }
          ]
        }
      },
      "code": "// res[i] = product of all elements except nums[i], no division\nvector<int> productExceptSelf(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, 1);\n    int left = 1;\n    for (int i = 0; i < n; i++) {   // product of everything left of i\n        res[i] = left;\n        left *= nums[i];\n    }\n    int right = 1;\n    for (int i = n - 1; i >= 0; i--) {  // times product of everything right of i\n        res[i] *= right;\n        right *= nums[i];\n    }\n    return res;\n}",
      "complexity": "Time O(n) with two passes. Extra space O(1) besides the output array.",
      "mistakes": [
        "Dividing the total product by nums[i]. It breaks when the array contains zeroes, and the problem forbids it.",
        "Off-by-one in range sums: with prefix of size n + 1, the sum of l..r is prefix[r + 1] - prefix[l], not prefix[r] - prefix[l].",
        "Updating the running value before writing it to res[i], which would include the element itself."
      ],
      "practice": [
        238,
        303,
        53
      ]
    },
    "3": {
      "name": "Kadane's algorithm",
      "when": "You need the maximum (or minimum) sum of a contiguous subarray, or any \"best run ending here\" quantity. Look for \"contiguous\", \"subarray\" and \"maximum sum\".",
      "idea": "At each index, ask: what is the best subarray that ends exactly here? There are only two choices. Either start fresh with just this element, or extend the best subarray that ended at the previous index. So cur = max(a[i], cur + a[i]). A negative running sum can never help a later subarray, so it is better to throw it away. The overall answer is the biggest cur you ever saw.",
      "steps": [
        "Set cur = best = nums[0] (this handles all-negative arrays).",
        "For each next element x, set cur = max(x, cur + x).",
        "Set best = max(best, cur).",
        "Return best. To also get the indexes, remember where cur restarted."
      ],
      "example": {
        "problem": "Maximum Subarray: find the contiguous subarray with the largest sum. Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Output: 6 (the subarray 4, -1, 2, 1).",
        "walk": "Watch the dashed window. At index 1 and again at index 3 the old sum is negative, so the window restarts. From index 3 on the sum stays positive and keeps growing until it reaches 6. After that, -5 shrinks cur but best remembers 6.",
        "viz": {
          "kind": "array",
          "cells": [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ],
          "frames": [
            {
              "note": "Find the subarray with the largest sum. Track cur, the best sum of a subarray that ends at the current index.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "a"
              },
              "win": [
                0,
                0
              ],
              "vars": {
                "cur": -2,
                "best": -2
              }
            },
            {
              "note": "cur was negative, so it only drags us down. Restart at 1: cur = 1. New best.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "1": "a"
              },
              "win": [
                1,
                1
              ],
              "vars": {
                "cur": 1,
                "best": 1
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = -2.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "2": "a"
              },
              "win": [
                1,
                2
              ],
              "vars": {
                "cur": -2,
                "best": 1
              }
            },
            {
              "note": "cur was negative, so it only drags us down. Restart at 4: cur = 4. New best.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "3": "a"
              },
              "win": [
                3,
                3
              ],
              "vars": {
                "cur": 4,
                "best": 4
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = 3.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "4": "a"
              },
              "win": [
                3,
                4
              ],
              "vars": {
                "cur": 3,
                "best": 4
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = 5. New best.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "5": "a"
              },
              "win": [
                3,
                5
              ],
              "vars": {
                "cur": 5,
                "best": 5
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = 6. New best.",
              "ptrs": {
                "i": 6
              },
              "hl": {
                "6": "a"
              },
              "win": [
                3,
                6
              ],
              "vars": {
                "cur": 6,
                "best": 6
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = 1.",
              "ptrs": {
                "i": 7
              },
              "hl": {
                "7": "a"
              },
              "win": [
                3,
                7
              ],
              "vars": {
                "cur": 1,
                "best": 6
              }
            },
            {
              "note": "cur was not negative, so keep extending: cur = 5.",
              "ptrs": {
                "i": 8
              },
              "hl": {
                "8": "a"
              },
              "win": [
                3,
                8
              ],
              "vars": {
                "cur": 5,
                "best": 6
              }
            },
            {
              "note": "Done. The best subarray is 4, -1, 2, 1 with sum 6.",
              "hl": {
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok"
              },
              "win": [
                3,
                6
              ],
              "vars": {
                "best": 6
              },
              "out": "Answer: 6"
            }
          ]
        }
      },
      "code": "// Largest sum of a non-empty contiguous subarray\nint maxSubArray(vector<int>& nums) {\n    int cur = nums[0], best = nums[0];\n    for (int i = 1; i < (int)nums.size(); i++) {\n        cur = max(nums[i], cur + nums[i]);  // restart or extend\n        best = max(best, cur);\n    }\n    return best;\n}",
      "complexity": "Time O(n), one pass. Space O(1).",
      "mistakes": [
        "Starting best at 0. If every number is negative the answer is the largest single negative number, not 0.",
        "Mixing up cur and best. cur must be reset or extended, best only ever grows.",
        "For maximum product, a negative number can flip the biggest to the smallest, so you must track both max and min."
      ],
      "practice": [
        53,
        152,
        121
      ]
    },
    "4": {
      "name": "Reverse trick",
      "when": "You must rotate an array or reorder a string by shifting a block of elements, in place, with O(1) extra space. Phrases like \"rotate by k steps\" or \"reverse words\" are the signal.",
      "idea": "Reversing a segment is a simple in-place operation that you can repeat. A rotation moves a block of k elements from the back to the front. If you reverse everything, that block lands at the front but backwards, and the rest lands at the back but backwards. Reversing each part separately puts both pieces back in their right order. Three reversals give a rotation without any extra array.",
      "steps": [
        "Reduce k with k %= n, because rotating n times changes nothing.",
        "Reverse the whole array.",
        "Reverse the first k elements.",
        "Reverse the remaining n - k elements.",
        "The same idea reverses the words of a string: reverse everything, then reverse each word."
      ],
      "example": {
        "problem": "Rotate Array: rotate the array to the right by k steps. Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3. Output: [5, 6, 7, 1, 2, 3, 4].",
        "walk": "Follow the group 5, 6, 7. After the full reverse it sits in front as 7, 6, 5. Reversing just those three cells restores its order, and reversing the other four restores theirs. Three simple reverses, no extra array.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            3,
            4,
            5,
            6,
            7
          ],
          "frames": [
            {
              "note": "Rotate right by k = 3. The last 3 values (5, 6, 7) must jump to the front, keeping their order.",
              "cells": [
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ],
              "hl": {
                "0": "b",
                "1": "b",
                "2": "b",
                "3": "b",
                "4": "a",
                "5": "a",
                "6": "a"
              }
            },
            {
              "note": "Step 1: reverse the whole array. The block 5, 6, 7 is now at the front, but backwards.",
              "cells": [
                7,
                6,
                5,
                4,
                3,
                2,
                1
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "b",
                "4": "b",
                "5": "b",
                "6": "b"
              }
            },
            {
              "note": "Cut the array after the first k = 3 cells. Each part will be fixed on its own.",
              "cells": [
                7,
                6,
                5,
                4,
                3,
                2,
                1
              ],
              "ptrs": {
                "k": 3
              },
              "win": [
                0,
                2
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "b",
                "4": "b",
                "5": "b",
                "6": "b"
              }
            },
            {
              "note": "Step 2: reverse the first k cells. 5, 6, 7 are back in their original order.",
              "cells": [
                5,
                6,
                7,
                4,
                3,
                2,
                1
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "b",
                "4": "b",
                "5": "b",
                "6": "b"
              },
              "ptrs": {
                "k": 3
              }
            },
            {
              "note": "Step 3: reverse the remaining n - k cells. 1, 2, 3, 4 are back in order too. Rotation done.",
              "cells": [
                5,
                6,
                7,
                1,
                2,
                3,
                4
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok"
              },
              "out": "Answer: [5, 6, 7, 1, 2, 3, 4]"
            }
          ]
        }
      },
      "code": "// Rotate nums to the right by k steps, in place\nvoid rotate(vector<int>& nums, int k) {\n    int n = nums.size();\n    k %= n;                                   // k may be larger than n\n    reverse(nums.begin(), nums.end());        // 1. whole array\n    reverse(nums.begin(), nums.begin() + k);  // 2. first k\n    reverse(nums.begin() + k, nums.end());    // 3. the rest\n}",
      "complexity": "Time O(n), each element is swapped about twice. Space O(1).",
      "mistakes": [
        "Forgetting k %= n. With k larger than n the iterators go out of range.",
        "Reversing the wrong parts for a left rotation. For a left rotation by k, reverse the first k and the rest first, then the whole array.",
        "Using an extra array \"just to be safe\" when the problem asks for O(1) extra space."
      ],
      "practice": [
        189,
        151,
        31
      ]
    },
    "5": {
      "name": "Dutch national flag",
      "when": "The array holds only three kinds of values (0, 1, 2, or three colours) and you must sort or partition it in one pass, in place. Also useful when you split values into smaller, equal and bigger than a pivot.",
      "idea": "Keep three zones: everything before lo is 0, everything from lo to mid - 1 is 1, everything after hi is 2. The cells from mid to hi are still unknown. Look at a[mid]. A 0 goes to the front zone by swapping with a[lo]. A 1 is already in the right place. A 2 goes to the back zone by swapping with a[hi]. The unknown zone shrinks every step, so one pass is enough.",
      "steps": [
        "Set lo = 0, mid = 0, hi = n - 1.",
        "While mid <= hi, look at nums[mid].",
        "If it is 0, swap nums[lo] and nums[mid], then lo++ and mid++.",
        "If it is 1, just mid++.",
        "If it is 2, swap nums[mid] and nums[hi], then hi-- and do NOT move mid."
      ],
      "example": {
        "problem": "Sort Colors: sort an array of 0s, 1s and 2s in place without a library sort. Input: [2, 0, 2, 1, 1, 0]. Output: [0, 0, 1, 1, 2, 2].",
        "walk": "Watch the three pointers squeeze the unknown middle. When mid meets a 2, it swaps with hi and mid stays put, because the value that came from hi has not been looked at yet. When mid meets a 0, the value swapped in from lo is always a 1, so mid can move on.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            0,
            2,
            1,
            1,
            0
          ],
          "frames": [
            {
              "note": "Sort 0s, 1s and 2s in one pass. Left of lo: all 0. Between lo and mid: all 1. Right of hi: all 2. mid is the unknown part.",
              "cells": [
                2,
                0,
                2,
                1,
                1,
                0
              ],
              "ptrs": {
                "lo": 0,
                "mid": 0,
                "hi": 5
              },
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "mid sees 2. Swap it to the hi side and move hi. Do not move mid, the swapped-in value is not checked yet.",
              "cells": [
                0,
                0,
                2,
                1,
                1,
                2
              ],
              "ptrs": {
                "lo": 0,
                "mid": 0,
                "hi": 4
              },
              "hl": {
                "0": "a",
                "5": "ok"
              }
            },
            {
              "note": "mid sees 0. Swap it to the lo side, then move both lo and mid.",
              "cells": [
                0,
                0,
                2,
                1,
                1,
                2
              ],
              "ptrs": {
                "lo": 1,
                "mid": 1,
                "hi": 4
              },
              "hl": {
                "0": "ok",
                "1": "a",
                "5": "ok"
              }
            },
            {
              "note": "mid sees 0. Swap it to the lo side, then move both lo and mid.",
              "cells": [
                0,
                0,
                2,
                1,
                1,
                2
              ],
              "ptrs": {
                "lo": 2,
                "mid": 2,
                "hi": 4
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "5": "ok"
              }
            },
            {
              "note": "mid sees 2. Swap it to the hi side and move hi. Do not move mid, the swapped-in value is not checked yet.",
              "cells": [
                0,
                0,
                1,
                1,
                2,
                2
              ],
              "ptrs": {
                "lo": 2,
                "mid": 2,
                "hi": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "4": "ok",
                "5": "ok"
              }
            },
            {
              "note": "mid sees 1. It is already in the middle zone, so just move mid.",
              "cells": [
                0,
                0,
                1,
                1,
                2,
                2
              ],
              "ptrs": {
                "lo": 2,
                "mid": 3,
                "hi": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "b",
                "3": "a",
                "4": "ok",
                "5": "ok"
              }
            },
            {
              "note": "mid sees 1. It is already in the middle zone, so just move mid.",
              "cells": [
                0,
                0,
                1,
                1,
                2,
                2
              ],
              "ptrs": {
                "lo": 2,
                "mid": 4,
                "hi": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "b",
                "3": "b",
                "4": "ok",
                "5": "ok"
              }
            },
            {
              "note": "mid passed hi, so nothing is unknown any more. The array is sorted: 0 0 1 1 2 2.",
              "cells": [
                0,
                0,
                1,
                1,
                2,
                2
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "out": "Answer: [0, 0, 1, 1, 2, 2]"
            }
          ]
        }
      },
      "code": "// Sort an array of 0, 1 and 2 in place in one pass\nvoid sortColors(vector<int>& nums) {\n    int lo = 0, mid = 0, hi = (int)nums.size() - 1;\n    while (mid <= hi) {\n        if (nums[mid] == 0) {\n            swap(nums[lo++], nums[mid++]);\n        } else if (nums[mid] == 1) {\n            mid++;\n        } else {\n            swap(nums[mid], nums[hi--]);   // mid stays: new value unchecked\n        }\n    }\n}",
      "complexity": "Time O(n), every step shrinks the unknown zone. Space O(1).",
      "mistakes": [
        "Moving mid after swapping with hi. The value you just got from hi is unchecked.",
        "Using while (mid < hi). The cell at mid == hi still needs to be checked.",
        "Counting 0s, 1s and 2s and refilling works, but it needs two passes. The interviewer may ask for one."
      ],
      "practice": [
        75,
        283,
        26
      ]
    },
    "6": {
      "name": "Matrix layers",
      "when": "You process a 2D grid by rings, borders or whole rows and columns: spiral order, rotating an image, or marking whole rows and columns. The words \"spiral\", \"rotate\" and \"layer\" are hints.",
      "idea": "Think of the matrix as onion layers. Keep four border variables, top, bottom, left and right. Walk one side of the outer ring, then shrink that border inward. After the four sides, the borders point at the next smaller ring. Always check that the borders have not crossed before walking a side, otherwise a single leftover row or column gets visited twice. Rotating an image uses the same idea: transpose, then reverse each row.",
      "steps": [
        "Set top = 0, bot = rows - 1, left = 0, right = cols - 1.",
        "While top <= bot and left <= right, walk the top row left to right, then top++.",
        "Walk the right column top to bottom, then right--.",
        "If top <= bot, walk the bottom row right to left, then bot--.",
        "If left <= right, walk the left column bottom to top, then left++."
      ],
      "example": {
        "problem": "Spiral Matrix: return all elements of the matrix in spiral order. Input: [[1,2,3,4],[5,6,7,8],[9,10,11,12]]. Output: [1,2,3,4,8,12,11,10,9,5,6,7].",
        "walk": "Each frame is one side of a ring. After every side a border moves inward, and the numbers in the output list show the order. In the last ring only one row is left (6, 7), so the checks before the bottom row and left column are what stop us from repeating it.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ],
          "frames": [
            {
              "note": "Walk a matrix in a spiral. Four borders (top, bot, left, right) mark the ring that is still unvisited.",
              "vars": {
                "top": 0,
                "bot": 2,
                "left": 0,
                "right": 3
              },
              "queue": []
            },
            {
              "note": "Go along the top row from left to right. Then the top border moves down.",
              "hl": {
                "0,0": "a",
                "0,1": "a",
                "0,2": "a",
                "0,3": "a"
              },
              "vars": {
                "top": 1,
                "bot": 2,
                "left": 0,
                "right": 3
              },
              "queue": [
                1,
                2,
                3,
                4
              ]
            },
            {
              "note": "Go down the right column. Then the right border moves in.",
              "hl": {
                "0,1": "ok",
                "0,2": "ok",
                "0,3": "ok",
                "0,0": "ok",
                "1,3": "a",
                "2,3": "a"
              },
              "vars": {
                "top": 1,
                "bot": 2,
                "left": 0,
                "right": 2
              },
              "queue": [
                1,
                2,
                3,
                4,
                8,
                12
              ]
            },
            {
              "note": "Go along the bottom row from right to left. Then the bottom border moves up.",
              "hl": {
                "0,1": "ok",
                "0,0": "ok",
                "0,3": "ok",
                "2,3": "ok",
                "0,2": "ok",
                "1,3": "ok",
                "2,2": "a",
                "2,1": "a",
                "2,0": "a"
              },
              "vars": {
                "top": 1,
                "bot": 1,
                "left": 0,
                "right": 2
              },
              "queue": [
                1,
                2,
                3,
                4,
                8,
                12,
                11,
                10,
                9
              ]
            },
            {
              "note": "Go up the left column. Then the left border moves in. One ring is done.",
              "hl": {
                "0,1": "ok",
                "2,1": "ok",
                "0,0": "ok",
                "0,3": "ok",
                "2,0": "ok",
                "2,3": "ok",
                "0,2": "ok",
                "2,2": "ok",
                "1,3": "ok",
                "1,0": "a"
              },
              "vars": {
                "top": 1,
                "bot": 1,
                "left": 1,
                "right": 2
              },
              "queue": [
                1,
                2,
                3,
                4,
                8,
                12,
                11,
                10,
                9,
                5
              ]
            },
            {
              "note": "Start the inner ring: top row again, from left to right.",
              "hl": {
                "0,1": "ok",
                "2,1": "ok",
                "0,0": "ok",
                "0,3": "ok",
                "2,0": "ok",
                "2,3": "ok",
                "0,2": "ok",
                "2,2": "ok",
                "1,0": "ok",
                "1,3": "ok",
                "1,1": "a",
                "1,2": "a"
              },
              "vars": {
                "top": 2,
                "bot": 1,
                "left": 1,
                "right": 2
              },
              "queue": [
                1,
                2,
                3,
                4,
                8,
                12,
                11,
                10,
                9,
                5,
                6,
                7
              ]
            },
            {
              "note": "top is now below bot, so no more rows. The borders have crossed and the loop stops.",
              "hl": {
                "0,1": "ok",
                "1,2": "ok",
                "2,1": "ok",
                "0,0": "ok",
                "1,1": "ok",
                "0,3": "ok",
                "2,0": "ok",
                "2,3": "ok",
                "0,2": "ok",
                "2,2": "ok",
                "1,0": "ok",
                "1,3": "ok"
              },
              "vars": {
                "top": 2,
                "bot": 1,
                "left": 1,
                "right": 1
              },
              "queue": [
                1,
                2,
                3,
                4,
                8,
                12,
                11,
                10,
                9,
                5,
                6,
                7
              ],
              "out": "Answer: 1 2 3 4 8 12 11 10 9 5 6 7"
            }
          ]
        }
      },
      "code": "// All matrix elements in spiral order\nvector<int> spiralOrder(vector<vector<int>>& m) {\n    vector<int> res;\n    int top = 0, bot = (int)m.size() - 1;\n    int left = 0, right = (int)m[0].size() - 1;\n    while (top <= bot && left <= right) {\n        for (int j = left; j <= right; j++) res.push_back(m[top][j]);\n        top++;\n        for (int i = top; i <= bot; i++) res.push_back(m[i][right]);\n        right--;\n        if (top <= bot) {\n            for (int j = right; j >= left; j--) res.push_back(m[bot][j]);\n            bot--;\n        }\n        if (left <= right) {\n            for (int i = bot; i >= top; i--) res.push_back(m[i][left]);\n            left++;\n        }\n    }\n    return res;\n}",
      "complexity": "Time O(rows * cols), each cell is visited once. Space O(1) besides the output.",
      "mistakes": [
        "Skipping the top <= bot and left <= right checks. A matrix with a single row or column then repeats cells.",
        "Mixing up row and column indexes in the loops. Row is m[i][..], column is m[..][j].",
        "Rotate Image in place: do not try to move four cells by hand without a temp variable. Transpose then reverse each row is simpler."
      ],
      "practice": [
        54,
        48,
        73
      ]
    },
    "7": {
      "name": "String parsing",
      "when": "You must turn text into a value by following rules: skip spaces, read an optional sign, read digits, stop at the first bad character. Look for \"convert\", \"parse\" or \"valid number\" and for overflow limits.",
      "idea": "Parse with one index i that only moves forward, and handle the phases in a fixed order: whitespace, sign, digits. Each phase is a small while loop or if. Build the number digit by digit with num = num * 10 + digit. The one real trap is overflow. Before multiplying, check whether the next step would pass INT_MAX, and if so return the clamped value right away. Never build the answer in a type that can already have overflowed.",
      "steps": [
        "Skip spaces: while s[i] == space, i++.",
        "If s[i] is + or -, remember the sign and i++.",
        "While s[i] is a digit, get d = s[i] - 48 (the character 0).",
        "Before num = num * 10 + d, check overflow: num > INT_MAX / 10, or equal with d > 7. If so return INT_MAX or INT_MIN by sign.",
        "Return sign * num."
      ],
      "example": {
        "problem": "String to Integer (atoi): parse the string \"  -42ab\" (two leading spaces, then -42ab) into an integer. Stop at the first character that is not a digit. Output: -42.",
        "walk": "Watch the pointer i pass through four phases. Spaces are skipped, the sign is stored, digits grow num as 4 then 42, and the letter a stops everything. The characters after the stop point are never looked at.",
        "viz": {
          "kind": "array",
          "cells": [
            "_",
            "_",
            "-",
            "4",
            "2",
            "a",
            "b"
          ],
          "frames": [
            {
              "note": "Parse \"  -42ab\" into an integer. An underscore marks a space. Read in order: spaces, sign, digits.",
              "cells": [
                "_",
                "_",
                "-",
                "4",
                "2",
                "a",
                "b"
              ],
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "Step 1: skip the leading spaces. i moves to the first non-space character.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "a"
              }
            },
            {
              "note": "Step 2: read the sign. It is a minus, so sign = -1, then i moves past it.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "ok",
                "3": "a"
              },
              "vars": {
                "sign": -1,
                "num": 0
              }
            },
            {
              "note": "Step 3: digit 4. num = num * 10 + 4 = 4.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "vars": {
                "sign": -1,
                "num": 4
              }
            },
            {
              "note": "Step 3: digit 2. num = num * 10 + 2 = 42.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "2": "ok",
                "3": "ok",
                "4": "ok"
              },
              "vars": {
                "sign": -1,
                "num": 42
              }
            },
            {
              "note": "Step 4: a is not a digit, so stop. Everything after this is ignored.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "bad",
                "6": "dim"
              },
              "vars": {
                "sign": -1,
                "num": 42
              }
            },
            {
              "note": "Result = sign * num = -42. A real solution also checks overflow before each multiply.",
              "hl": {
                "2": "ok",
                "3": "ok",
                "4": "ok"
              },
              "vars": {
                "sign": -1,
                "num": 42
              },
              "out": "Answer: -42"
            }
          ]
        }
      },
      "code": "// Convert a string to a 32-bit integer (LeetCode atoi rules)\nint myAtoi(string s) {\n    int i = 0, n = s.size();\n    while (i < n && s[i] == ' ') i++;            // 1. spaces\n    int sign = 1;\n    if (i < n && (s[i] == '+' || s[i] == '-')) { // 2. sign\n        sign = (s[i] == '-') ? -1 : 1;\n        i++;\n    }\n    int num = 0;\n    while (i < n && isdigit(s[i])) {             // 3. digits\n        int d = s[i] - '0';\n        if (num > INT_MAX / 10 || (num == INT_MAX / 10 && d > 7))\n            return sign == 1 ? INT_MAX : INT_MIN; // overflow guard\n        num = num * 10 + d;\n        i++;\n    }\n    return sign * num;\n}",
      "complexity": "Time O(n), one pass. Space O(1).",
      "mistakes": [
        "Checking overflow after multiplying. By then the int has already overflowed. Check before, or use long long.",
        "Forgetting that the sign can appear only once and only after the spaces.",
        "Reading past the end of the string. Put i < n in every while condition."
      ],
      "practice": [
        8,
        125,
        14
      ]
    }
  },
  "2": {
    "0": {
      "name": "Complement lookup",
      "when": "You need a pair (or two items) that combine to a target, such as a sum or a difference, and the array is not sorted. Words like \"two numbers that add up to\" are the signal.",
      "idea": "For each number x, the partner you need is target - x. That is its complement. Instead of searching the rest of the array for it, keep a hash map of the numbers you have already passed, with their indexes. A lookup in the map takes about O(1). So at each x you ask the map: have I already seen target - x? If yes, you are done. If no, save x and continue. Checking before saving also stops a number from pairing with itself.",
      "steps": [
        "Make an empty unordered_map from value to index.",
        "For each index i, compute need = target - nums[i].",
        "If need is in the map, return the stored index and i.",
        "Otherwise store nums[i] with index i in the map.",
        "If the loop ends, no pair exists (return an empty vector)."
      ],
      "example": {
        "problem": "Two Sum: return the indexes of the two numbers that add up to the target. Input: nums = [11, 3, 8, 2, 6, 5], target = 10. Output: [2, 3] (8 + 2 = 10).",
        "walk": "Watch the map grow from left to right. Each new number only looks backwards into the map, never forwards. At index 3 the value 2 needs 8, and 8 was stored at index 2, so the pair appears without trying any other combination.",
        "viz": {
          "kind": "array",
          "cells": [
            11,
            3,
            8,
            2,
            6,
            5
          ],
          "frames": [
            {
              "note": "Find two numbers that add up to 10. The map remembers each value we have passed, with its index.",
              "cells": [
                11,
                3,
                8,
                2,
                6,
                5
              ],
              "vars": {
                "target": 10
              },
              "map": {}
            },
            {
              "note": "Need -1 to pair with 11. It is not in the map, so store 11 at index 0 and move on.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "target": 10,
                "need": -1
              },
              "map": {
                "11": 0
              }
            },
            {
              "note": "Need 7 to pair with 3. It is not in the map, so store 3 at index 1 and move on.",
              "hl": {
                "0": "dim",
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "target": 10,
                "need": 7
              },
              "map": {
                "3": 1,
                "11": 0
              }
            },
            {
              "note": "Need 2 to pair with 8. It is not in the map, so store 8 at index 2 and move on.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "target": 10,
                "need": 2
              },
              "map": {
                "3": 1,
                "8": 2,
                "11": 0
              }
            },
            {
              "note": "Need 8 to pair with 2. 8 is in the map at index 2. Found the pair!",
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "ptrs": {
                "i": 3
              },
              "vars": {
                "target": 10,
                "need": 8
              },
              "map": {
                "3": 1,
                "8": 2,
                "11": 0
              }
            },
            {
              "note": "Done. nums[2] + nums[3] = 8 + 2 = 10, so the answer is indexes [2, 3]. One pass, no nested loop.",
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "map": {
                "3": 1,
                "8": 2,
                "11": 0
              },
              "out": "Answer: [2, 3]"
            }
          ]
        }
      },
      "code": "// Indexes of two numbers that add up to target\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;          // value -> index\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int need = target - nums[i];\n        auto it = seen.find(need);\n        if (it != seen.end()) return {it->second, i};  // partner found\n        seen[nums[i]] = i;                 // remember this value\n    }\n    return {};\n}",
      "complexity": "Time O(n), one pass with O(1) average lookups. Space O(n) for the map.",
      "mistakes": [
        "Storing the number before checking for its complement. With target 10 and value 5, the number would pair with itself.",
        "Storing the value in the map as a key but forgetting the index, so you cannot return positions.",
        "Sorting first and then returning positions. Sorting destroys the original indexes."
      ],
      "practice": [
        1,
        454,
        217
      ]
    },
    "1": {
      "name": "Frequency count",
      "when": "The question depends on how many times each value appears: anagrams, first unique character, most common value, or \"does every item appear exactly twice\".",
      "idea": "Count first, decide later. Walk the data once and store how often each value occurs in a map (or in an array of 26 slots for lowercase letters). After that, any question about counts is a quick lookup. To check for an anagram, compare two count tables. To find the first unique item, scan again in the original order and stop at the first count of 1. Two simple passes are easier and faster than comparing every pair.",
      "steps": [
        "Build the count table: counts[x]++ for every item.",
        "For a lowercase string, an array int cnt[26] is faster than a map.",
        "Scan the items again in their original order when order matters.",
        "Return the first item whose count meets the rule (for example equals 1).",
        "For anagrams, add counts for one string and subtract for the other, then check all zeros."
      ],
      "example": {
        "problem": "First Unique Character in a String: return the index of the first character that appears only once, or -1. Input: s = \"aabcbd\". Output: 3 (the character c).",
        "walk": "The first pass only fills the map: a is 2, b is 2, c is 1, d is 1. The second pass goes in string order, because the question asks for the first one. The two a cells and the b cell are rejected by their counts, and c is accepted. Notice that d also has count 1 but comes later.",
        "viz": {
          "kind": "array",
          "cells": [
            "a",
            "a",
            "b",
            "c",
            "b",
            "d"
          ],
          "frames": [
            {
              "note": "Find the first character that appears exactly once. Pass 1 counts every character. Pass 2 finds the first one with count 1.",
              "cells": [
                "a",
                "a",
                "b",
                "c",
                "b",
                "d"
              ],
              "map": {}
            },
            {
              "note": "Pass 1: count \"a\". Its count is now 1.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "map": {
                "a": 1
              }
            },
            {
              "note": "Pass 1: count \"a\". Its count is now 2.",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "map": {
                "a": 2
              }
            },
            {
              "note": "Pass 1: count \"b\". Its count is now 1.",
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "map": {
                "a": 2,
                "b": 1
              }
            },
            {
              "note": "Pass 1: count \"c\". Its count is now 1.",
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "map": {
                "a": 2,
                "b": 1,
                "c": 1
              }
            },
            {
              "note": "Pass 1: count \"b\". Its count is now 2.",
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "i": 4
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1
              }
            },
            {
              "note": "Pass 1: count \"d\". Its count is now 1.",
              "hl": {
                "5": "a"
              },
              "ptrs": {
                "i": 5
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              }
            },
            {
              "note": "Pass 2: \"a\" has count 2, so it repeats. Skip it.",
              "hl": {
                "0": "bad"
              },
              "ptrs": {
                "i": 0
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              }
            },
            {
              "note": "Pass 2: \"a\" has count 2, so it repeats. Skip it.",
              "hl": {
                "1": "bad"
              },
              "ptrs": {
                "i": 1
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              }
            },
            {
              "note": "Pass 2: \"b\" has count 2, so it repeats. Skip it.",
              "hl": {
                "2": "bad"
              },
              "ptrs": {
                "i": 2
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              }
            },
            {
              "note": "Pass 2: \"c\" has count 1. It is the first unique character, at index 3.",
              "hl": {
                "3": "ok"
              },
              "ptrs": {
                "i": 3
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              }
            },
            {
              "note": "Done. The counts told us the answer without comparing characters pairwise.",
              "hl": {
                "3": "ok"
              },
              "map": {
                "a": 2,
                "b": 2,
                "c": 1,
                "d": 1
              },
              "out": "Answer: 3"
            }
          ]
        }
      },
      "code": "// Index of the first non-repeating character, or -1\nint firstUniqChar(string s) {\n    int cnt[26] = {0};\n    for (char c : s) cnt[c - 'a']++;        // pass 1: count\n    for (int i = 0; i < (int)s.size(); i++)\n        if (cnt[s[i] - 'a'] == 1) return i;  // pass 2: first with count 1\n    return -1;\n}",
      "complexity": "Time O(n) for two passes. Space O(1), the table has a fixed 26 slots.",
      "mistakes": [
        "Looping over the map to find the answer. A hash map has no order, so the first unique index can be lost. Scan the string instead.",
        "Forgetting c - 'a' and indexing the array with the raw character code, which is out of range.",
        "For anagrams, forgetting to check that both strings have the same length first."
      ],
      "practice": [
        387,
        242,
        205
      ]
    },
    "2": {
      "name": "Canonical key grouping",
      "when": "You must group items that are \"the same\" in some way that is not plain equality: anagrams, strings that are shifts of each other, or items with the same counts. The word \"group\" is the hint.",
      "idea": "Give every item a canonical key: one fixed form that is identical for all items in the same group. For anagrams, sorting the letters works, so \"eat\", \"tea\" and \"ate\" all become \"aet\". Then a hash map from key to list of items does the grouping by itself. You never compare two words with each other. Each word is turned into a key and dropped into the matching bucket. If sorting is too slow, a 26-number count signature is a faster key.",
      "steps": [
        "Decide what makes two items equal, and how to write that as one key.",
        "Make an unordered_map from key to vector of items.",
        "For each item, build its key (for example sort a copy of the string).",
        "Push the original item into map[key].",
        "Copy the map values into the answer list."
      ],
      "example": {
        "problem": "Group Anagrams: group the words that are anagrams of each other. Input: [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]. Output: [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]] (any order).",
        "walk": "Watch the map keys. The key aet appears three times, and every time the word joins the same group. Words with other letters get other keys. The green cells show the earlier words that share the current key. Nothing was compared word to word.",
        "viz": {
          "kind": "array",
          "cells": [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ],
          "frames": [
            {
              "note": "Group words that are anagrams. Two anagrams have the same letters, so sorting the letters gives the same key.",
              "cells": [
                "eat",
                "tea",
                "tan",
                "ate",
                "nat",
                "bat"
              ],
              "map": {}
            },
            {
              "note": "Sort \"eat\" to get key \"aet\". New key, so start a new group.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "map": {
                "aet": "eat"
              }
            },
            {
              "note": "Sort \"tea\" to get key \"aet\". The key already exists, so join that group.",
              "hl": {
                "0": "ok",
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "map": {
                "aet": "eat,tea"
              }
            },
            {
              "note": "Sort \"tan\" to get key \"ant\". New key, so start a new group.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "map": {
                "aet": "eat,tea",
                "ant": "tan"
              }
            },
            {
              "note": "Sort \"ate\" to get key \"aet\". The key already exists, so join that group.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "dim",
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "map": {
                "aet": "eat,tea,ate",
                "ant": "tan"
              }
            },
            {
              "note": "Sort \"nat\" to get key \"ant\". The key already exists, so join that group.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "ok",
                "3": "dim",
                "4": "a"
              },
              "ptrs": {
                "i": 4
              },
              "map": {
                "aet": "eat,tea,ate",
                "ant": "tan,nat"
              }
            },
            {
              "note": "Sort \"bat\" to get key \"abt\". New key, so start a new group.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "a"
              },
              "ptrs": {
                "i": 5
              },
              "map": {
                "aet": "eat,tea,ate",
                "ant": "tan,nat",
                "abt": "bat"
              }
            },
            {
              "note": "Done. The map values are the groups: [eat, tea, ate], [tan, nat] and [bat].",
              "map": {
                "aet": "eat,tea,ate",
                "ant": "tan,nat",
                "abt": "bat"
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "out": "Answer: 3 groups"
            }
          ]
        }
      },
      "code": "// Group words that are anagrams of each other\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> groups;\n    for (const string& s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());   // canonical key\n        groups[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& kv : groups) res.push_back(kv.second);\n    return res;\n}",
      "complexity": "Time O(n * L log L) for n words of length L, because each word is sorted. Space O(n * L) for the map.",
      "mistakes": [
        "Pushing the sorted key into the group instead of the original word.",
        "Using a key that is not canonical enough. Two different groups must never share a key, and one group must never have two keys.",
        "Expecting the groups in a fixed order. An unordered_map gives them in any order, which the problem allows."
      ],
      "practice": [
        49,
        242,
        205
      ]
    },
    "3": {
      "name": "Set membership",
      "when": "You need to remove duplicates, test \"have I seen this value\", or find runs of consecutive values in unsorted data without sorting. A question like \"does x - 1 exist\" is the clue.",
      "idea": "An unordered_set answers \"is this value present?\" in about O(1). That makes duplicates easy: insert and check. It also finds consecutive runs without sorting. Put all numbers in the set. A number x is the start of a run only if x - 1 is NOT in the set. From each start, count upward while x + 1, x + 2 and so on are in the set. Numbers in the middle of a run are skipped, so every number is walked over at most once.",
      "steps": [
        "Insert all numbers into an unordered_set.",
        "For each x in the set, check whether x - 1 is in the set.",
        "If x - 1 exists, skip x. It is in the middle of a run.",
        "Otherwise x is a start. Count y = x, x + 1, ... while y is in the set.",
        "Keep the largest count and return it."
      ],
      "example": {
        "problem": "Longest Consecutive Sequence: find the length of the longest run of consecutive integers in an unsorted array, in O(n). Input: [100, 4, 200, 1, 3, 2]. Output: 4 (the run 1, 2, 3, 4).",
        "walk": "Look at which numbers count as starts: 100, 200 and 1. The numbers 4, 3 and 2 are skipped because their predecessor exists, so the run is not recounted from the middle. The green cells in the 1 frame show the whole run found by counting up.",
        "viz": {
          "kind": "array",
          "cells": [
            100,
            4,
            200,
            1,
            3,
            2
          ],
          "frames": [
            {
              "note": "Find the longest run of consecutive numbers, such as 1, 2, 3, 4. First put every number in a set for O(1) lookups.",
              "cells": [
                100,
                4,
                200,
                1,
                3,
                2
              ],
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "best": 0
              }
            },
            {
              "note": "100 - 1 = 99 is not in the set, so 100 starts a run. Count up while x + 1 is present: the run length is 1.",
              "hl": {
                "0": "ok"
              },
              "ptrs": {
                "i": 0
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "start": 100,
                "len": 1,
                "best": 1
              }
            },
            {
              "note": "4 - 1 = 3 is in the set, so 4 is not the start of a run. Skip it.",
              "hl": {
                "1": "bad",
                "4": "b"
              },
              "ptrs": {
                "i": 1
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "best": 1
              }
            },
            {
              "note": "200 - 1 = 199 is not in the set, so 200 starts a run. Count up while x + 1 is present: the run length is 1.",
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "i": 2
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "start": 200,
                "len": 1,
                "best": 1
              }
            },
            {
              "note": "1 - 1 = 0 is not in the set, so 1 starts a run. Count up while x + 1 is present: the run length is 4.",
              "hl": {
                "1": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "ptrs": {
                "i": 3
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "start": 1,
                "len": 4,
                "best": 4
              }
            },
            {
              "note": "3 - 1 = 2 is in the set, so 3 is not the start of a run. Skip it.",
              "hl": {
                "4": "bad",
                "5": "b"
              },
              "ptrs": {
                "i": 4
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "best": 4
              }
            },
            {
              "note": "2 - 1 = 1 is in the set, so 2 is not the start of a run. Skip it.",
              "hl": {
                "3": "b",
                "5": "bad"
              },
              "ptrs": {
                "i": 5
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "best": 4
              }
            },
            {
              "note": "Done. The longest run is 1, 2, 3, 4. Each number was counted inside at most one run, so total work stays linear.",
              "hl": {
                "1": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "map": {
                "1": "in",
                "2": "in",
                "3": "in",
                "4": "in",
                "100": "in",
                "200": "in"
              },
              "vars": {
                "best": 4
              },
              "out": "Answer: 4"
            }
          ]
        }
      },
      "code": "// Length of the longest run of consecutive integers\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> st(nums.begin(), nums.end());\n    int best = 0;\n    for (int x : st) {\n        if (st.count(x - 1)) continue;   // not a start of a run\n        int len = 1;\n        while (st.count(x + len)) len++; // walk up the run\n        best = max(best, len);\n    }\n    return best;\n}",
      "complexity": "Time O(n), each run is walked once from its start. Space O(n) for the set.",
      "mistakes": [
        "Skipping the \"x - 1 is absent\" check. Counting from every number makes it O(n^2) on a long run.",
        "Looping over nums with duplicates and recounting. Looping over the set avoids repeated work.",
        "Sorting the array. It works but costs O(n log n), and the problem asks for O(n)."
      ],
      "practice": [
        128,
        217,
        41
      ]
    },
    "4": {
      "name": "Prefix sum + hashmap",
      "when": "You count or find subarrays with a given sum (or a zero sum), and the array can have negative numbers, so a sliding window does not work. \"Subarray sum equals k\" is the classic form.",
      "idea": "The sum of a[j+1..i] equals prefix[i] - prefix[j]. We want that to be k, so we want an earlier prefix equal to prefix[i] - k. Keep a map from each prefix value to how many times it has occurred. At each i, look up prefix[i] - k in the map and add that count to the answer. Then add the current prefix to the map. Put prefix 0 in the map at the start, so subarrays that begin at index 0 are counted. Negative numbers are no problem.",
      "steps": [
        "Create a map with {0: 1} and set prefix = 0, count = 0.",
        "For each x, add it to prefix.",
        "Add map[prefix - k] to count (use find so missing keys are not created).",
        "Then do map[prefix]++.",
        "Return count. To get the longest subarray instead, store the first index of each prefix."
      ],
      "example": {
        "problem": "Subarray Sum Equals K: count the contiguous subarrays whose sum is k. Input: nums = [3, 4, 7, 2, -3, 1, 4, 2], k = 7. Output: 4.",
        "walk": "At each step the map holds the prefix sums that came before. Green cells mark an end index with at least one matching start. At index 1 the prefix 7 needs 0, which is in the map from the start, so [3, 4] counts. At index 5 the prefix 14 needs 7, seen once, so one more subarray ends there.",
        "viz": {
          "kind": "array",
          "cells": [
            3,
            4,
            7,
            2,
            -3,
            1,
            4,
            2
          ],
          "frames": [
            {
              "note": "Count subarrays whose sum is 7. Keep a running prefix sum, and a map of how many times each prefix sum has occurred. Start with prefix 0 seen once.",
              "cells": [
                3,
                4,
                7,
                2,
                -3,
                1,
                4,
                2
              ],
              "vars": {
                "k": 7,
                "pre": 0,
                "count": 0
              },
              "map": {
                "0": 1
              }
            },
            {
              "note": "prefix = 3. Need an earlier prefix of 3 - 7 = -4. It was never seen, so no subarray ends here.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "k": 7,
                "pre": 3,
                "need": -4,
                "count": 0
              },
              "map": {
                "0": 1,
                "3": 1
              }
            },
            {
              "note": "prefix = 7. Need an earlier prefix of 7 - 7 = 0. It was seen 1 time(s), so 1 subarray(s) end here. Count = 1.",
              "hl": {
                "1": "ok"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "k": 7,
                "pre": 7,
                "need": 0,
                "count": 1
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1
              }
            },
            {
              "note": "prefix = 14. Need an earlier prefix of 14 - 7 = 7. It was seen 1 time(s), so 1 subarray(s) end here. Count = 2.",
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "k": 7,
                "pre": 14,
                "need": 7,
                "count": 2
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "14": 1
              }
            },
            {
              "note": "prefix = 16. Need an earlier prefix of 16 - 7 = 9. It was never seen, so no subarray ends here.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "vars": {
                "k": 7,
                "pre": 16,
                "need": 9,
                "count": 2
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "14": 1,
                "16": 1
              }
            },
            {
              "note": "prefix = 13. Need an earlier prefix of 13 - 7 = 6. It was never seen, so no subarray ends here.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "a"
              },
              "ptrs": {
                "i": 4
              },
              "vars": {
                "k": 7,
                "pre": 13,
                "need": 6,
                "count": 2
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "13": 1,
                "14": 1,
                "16": 1
              }
            },
            {
              "note": "prefix = 14. Need an earlier prefix of 14 - 7 = 7. It was seen 1 time(s), so 1 subarray(s) end here. Count = 3.",
              "hl": {
                "5": "ok"
              },
              "ptrs": {
                "i": 5
              },
              "vars": {
                "k": 7,
                "pre": 14,
                "need": 7,
                "count": 3
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "13": 1,
                "14": 2,
                "16": 1
              }
            },
            {
              "note": "prefix = 18. Need an earlier prefix of 18 - 7 = 11. It was never seen, so no subarray ends here.",
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "dim",
                "6": "a"
              },
              "ptrs": {
                "i": 6
              },
              "vars": {
                "k": 7,
                "pre": 18,
                "need": 11,
                "count": 3
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "13": 1,
                "14": 2,
                "16": 1,
                "18": 1
              }
            },
            {
              "note": "prefix = 20. Need an earlier prefix of 20 - 7 = 13. It was seen 1 time(s), so 1 subarray(s) end here. Count = 4.",
              "hl": {
                "7": "ok"
              },
              "ptrs": {
                "i": 7
              },
              "vars": {
                "k": 7,
                "pre": 20,
                "need": 13,
                "count": 4
              },
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "13": 1,
                "14": 2,
                "16": 1,
                "18": 1,
                "20": 1
              }
            },
            {
              "note": "Done. Four subarrays sum to 7: [3,4], [7], [7,2,-3,1] and [1,4,2].",
              "map": {
                "0": 1,
                "3": 1,
                "7": 1,
                "13": 1,
                "14": 2,
                "16": 1,
                "18": 1,
                "20": 1
              },
              "vars": {
                "count": 4
              },
              "out": "Answer: 4"
            }
          ]
        }
      },
      "code": "// Number of subarrays with sum exactly k\nint subarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> seen;   // prefix sum -> times seen\n    seen[0] = 1;                    // empty prefix\n    int pre = 0, count = 0;\n    for (int x : nums) {\n        pre += x;\n        auto it = seen.find(pre - k);\n        if (it != seen.end()) count += it->second;\n        seen[pre]++;                // add after the lookup\n    }\n    return count;\n}",
      "complexity": "Time O(n), one pass. Space O(n) for the prefix sums in the map.",
      "mistakes": [
        "Forgetting seen[0] = 1. Subarrays that start at index 0 are then missed.",
        "Updating the map before the lookup. With k = 0 a subarray of length zero would be counted.",
        "Using a sliding window. It fails when the array has negative numbers."
      ],
      "practice": [
        560,
        525,
        974
      ]
    },
    "5": {
      "name": "Prefix mod",
      "when": "The problem asks for a subarray whose sum is divisible by k, or a multiple of k. The words \"multiple of k\" or \"divisible by k\" with \"subarray\" are the clue.",
      "idea": "If two prefix sums leave the same remainder when divided by k, their difference is a multiple of k. That difference is exactly the sum of the cells between them. So instead of storing whole prefix sums, store prefix % k in a map with the first index where it appeared. When the same remainder shows up again, the cells in between form a subarray divisible by k. Store the first index only, because the earliest one gives the longest subarray. Start with remainder 0 at index -1.",
      "steps": [
        "Create a map {0: -1} from remainder to first index.",
        "Keep a running prefix, and compute r = prefix % k for each element.",
        "If r is already in the map, check that the length i - map[r] is at least 2 (when the problem asks for it).",
        "If r is new, store map[r] = i. Do not overwrite an older index.",
        "If the loop ends with nothing found, return false."
      ],
      "example": {
        "problem": "Continuous Subarray Sum: is there a subarray of length at least 2 whose sum is a multiple of k? Input: nums = [3, 5, 2, 4, 7], k = 6. Output: true (the subarray [2, 4] sums to 6).",
        "walk": "The remainders go 3, 2, 4, and then 2 again at index 3. The map says remainder 2 first appeared at index 1, so the cells after index 1, which are 2 and 4, sum to a multiple of 6. The dashed window shows exactly that part.",
        "viz": {
          "kind": "array",
          "cells": [
            3,
            5,
            2,
            4,
            7
          ],
          "frames": [
            {
              "note": "Is there a subarray of length 2 or more whose sum is a multiple of 6? Store prefix sum % 6, with the first index where each remainder appeared.",
              "cells": [
                3,
                5,
                2,
                4,
                7
              ],
              "vars": {
                "k": 6,
                "pre%k": 0
              },
              "map": {
                "0": -1
              }
            },
            {
              "note": "prefix = 3, remainder 3. New remainder, so store it with index 0.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "k": 6,
                "pre": 3,
                "pre%k": 3
              },
              "map": {
                "0": -1,
                "3": 0
              }
            },
            {
              "note": "prefix = 8, remainder 2. New remainder, so store it with index 1.",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "k": 6,
                "pre": 8,
                "pre%k": 2
              },
              "map": {
                "0": -1,
                "2": 1,
                "3": 0
              }
            },
            {
              "note": "prefix = 10, remainder 4. New remainder, so store it with index 2.",
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "k": 6,
                "pre": 10,
                "pre%k": 4
              },
              "map": {
                "0": -1,
                "2": 1,
                "3": 0,
                "4": 2
              }
            },
            {
              "note": "prefix = 14, remainder 2. Remainder 2 was seen at index 1, so the cells after it up to here add up to a multiple of 6.",
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "win": [
                2,
                3
              ],
              "ptrs": {
                "i": 3
              },
              "vars": {
                "k": 6,
                "pre": 14,
                "pre%k": 2
              },
              "map": {
                "0": -1,
                "2": 1,
                "3": 0,
                "4": 2
              }
            },
            {
              "note": "Done. The subarray [2, 4] sums to 6. Equal remainders mean the part between them is divisible by 6.",
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "win": [
                2,
                3
              ],
              "map": {
                "0": -1,
                "2": 1,
                "3": 0,
                "4": 2
              },
              "out": "Answer: true"
            }
          ]
        }
      },
      "code": "// Is there a subarray of length >= 2 with sum divisible by k?\nbool checkSubarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> first;   // remainder -> first index\n    first[0] = -1;                   // empty prefix\n    int pre = 0;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        pre = (pre + nums[i]) % k;\n        auto it = first.find(pre);\n        if (it != first.end()) {\n            if (i - it->second >= 2) return true;  // long enough\n        } else {\n            first[pre] = i;          // keep the earliest index\n        }\n    }\n    return false;\n}",
      "complexity": "Time O(n), one pass. Space O(min(n, k)), one entry per remainder.",
      "mistakes": [
        "Overwriting the stored index when a remainder repeats. Keep the first one.",
        "Forgetting the length rule: i - first[r] must be at least 2, or a single element could count.",
        "Negative numbers in other problems give negative remainders in C++. Use ((r % k) + k) % k there."
      ],
      "practice": [
        523,
        974,
        525
      ]
    },
    "6": {
      "name": "Bucket by frequency",
      "when": "You need the top K most frequent items, or the K items with the biggest counts, and you want better than sorting by count. The words \"top K frequent\" are the clue.",
      "idea": "First count each value with a hash map. A count can never be bigger than n, the number of items. So make n + 1 buckets, where bucket c holds every value that appears exactly c times. Then walk the buckets from the highest count down and collect values until you have K of them. This replaces the O(n log n) sort with a plain O(n) scan. A heap of size K is another option, with O(n log K) time.",
      "steps": [
        "Count every value with an unordered_map.",
        "Make a vector of n + 1 empty vectors, called buckets.",
        "For each (value, count) pair, push the value into buckets[count].",
        "Scan counts from n down to 1, appending values to the answer.",
        "Stop as soon as the answer has K values."
      ],
      "example": {
        "problem": "Top K Frequent Elements: return the k most frequent elements. Input: nums = [5, 3, 5, 1, 3, 5, 2, 3, 5], k = 2. Output: [5, 3].",
        "walk": "In the bucket frame, the cell index is the count. Index 4 holds 5, index 3 holds 3, and index 1 holds 1 and 2. Reading from the right, the first two filled buckets give the answer. The long empty stretch costs almost nothing to skip.",
        "viz": {
          "kind": "array",
          "cells": [
            5,
            3,
            5,
            1,
            3,
            5,
            2,
            3,
            5
          ],
          "frames": [
            {
              "note": "Find the 2 most frequent numbers without sorting. Step 1: count each number with a map.",
              "cells": [
                5,
                3,
                5,
                1,
                3,
                5,
                2,
                3,
                5
              ],
              "map": {},
              "vars": {
                "k": 2
              }
            },
            {
              "note": "After one pass the counts are 5: four times, 3: three times, 1: once, 2: once.",
              "cells": [
                5,
                3,
                5,
                1,
                3,
                5,
                2,
                3,
                5
              ],
              "map": {
                "1": 1,
                "2": 1,
                "3": 3,
                "5": 4
              },
              "vars": {
                "k": 2
              }
            },
            {
              "note": "Step 2: make buckets. Cell c holds the numbers that appear exactly c times. The index is the count, so no sorting is needed.",
              "cells": [
                null,
                "[1,2]",
                null,
                "[3]",
                "[5]",
                null,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "1": "b",
                "3": "b",
                "4": "b"
              },
              "map": {
                "1": 1,
                "2": 1,
                "3": 3,
                "5": 4
              },
              "vars": {
                "k": 2
              }
            },
            {
              "note": "Scan from the high counts down. Bucket 4 holds [5], so take it. We have 1 of 2.",
              "hl": {
                "4": "ok",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim",
                "9": "dim"
              },
              "ptrs": {
                "c": 4
              },
              "vars": {
                "k": 2,
                "got": 1
              }
            },
            {
              "note": "Scan from the high counts down. Bucket 3 holds [3], so take it. We have 2 of 2.",
              "hl": {
                "3": "ok",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim",
                "9": "dim"
              },
              "ptrs": {
                "c": 3
              },
              "vars": {
                "k": 2,
                "got": 2
              }
            },
            {
              "note": "Done. We stopped as soon as we had k numbers. The top 2 are 5 and 3.",
              "cells": [
                null,
                "[1,2]",
                null,
                "[3]",
                "[5]",
                null,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "3": "ok",
                "4": "ok"
              },
              "vars": {
                "k": 2,
                "got": 2
              },
              "out": "Answer: [5, 3]"
            }
          ]
        }
      },
      "code": "// k most frequent elements, using buckets indexed by count\nvector<int> topKFrequent(vector<int>& nums, int k) {\n    int n = nums.size();\n    unordered_map<int, int> cnt;\n    for (int x : nums) cnt[x]++;\n    vector<vector<int>> bucket(n + 1);   // bucket[c] = values with count c\n    for (auto& kv : cnt) bucket[kv.second].push_back(kv.first);\n    vector<int> res;\n    for (int c = n; c >= 1 && (int)res.size() < k; c--)\n        for (int x : bucket[c]) {\n            if ((int)res.size() == k) break;\n            res.push_back(x);\n        }\n    return res;\n}",
      "complexity": "Time O(n) to count, fill buckets and scan. Space O(n) for the map and buckets.",
      "mistakes": [
        "Making only n buckets. Counts go up to n, so you need n + 1 slots.",
        "Sorting the map entries by count. It works, but is O(n log n) and misses the point of buckets.",
        "Not stopping at K when one bucket holds several values and the answer would go over K."
      ],
      "practice": [
        347,
        242,
        387
      ]
    }
  },
  "3": {
    "0": {
      "name": "Opposite ends",
      "when": "The array is sorted (or you can sort it) and you need a pair that hits a target, or you want to maximise something that depends on the gap between two ends, such as container with most water.",
      "idea": "Put one pointer at the left end and one at the right end, then look at the pair they point to. In a sorted array, if the sum is too big, the right value is too big for every partner that is left, so you throw it away by moving r left. If the sum is too small, throw away the left value by moving l right. Every step discards one index for good, so you never need a nested loop.",
      "steps": [
        "Sort the array first if it is not already sorted (skip this when the problem gives you sorted input).",
        "Set l = 0 and r = n - 1.",
        "While l < r, compute the value of the pair (a[l], a[r]), for example their sum.",
        "If the pair is the answer, return it. If the value is too small, do l++. If it is too big, do r--.",
        "Stop when the pointers meet. Each pointer only moves inward, so the whole loop is O(n)."
      ],
      "example": {
        "problem": "Two Sum II: the array is sorted. Find two numbers that add up to 10. Input: [1, 3, 4, 6, 8, 11], target = 10. Output: the pair 4 and 6 (indices 2 and 3).",
        "walk": "Every move removes candidates for good. The first sum, 12, is too big, and since the array is sorted every pair that contains 11 is at least 1 + 11 = 12, so 11 can never be part of the answer and r moves left. The same logic discards 1 and 8 later. Only six numbers are looked at in about five steps, with no nested loop.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            3,
            4,
            6,
            8,
            11
          ],
          "frames": [
            {
              "note": "Sorted array, target 10. Put l on the smallest value and r on the largest.",
              "ptrs": {
                "l": 0,
                "r": 5
              },
              "hl": {
                "0": "a",
                "5": "a"
              },
              "vars": {
                "target": 10
              }
            },
            {
              "note": "1 + 11 = 12, too big. Even the smallest partner is too big for 11, so r moves left.",
              "ptrs": {
                "l": 0,
                "r": 5
              },
              "hl": {
                "0": "a",
                "5": "bad"
              },
              "vars": {
                "target": 10,
                "sum": 12
              }
            },
            {
              "note": "1 + 8 = 9, too small. Even the biggest partner is too small for 1, so l moves right.",
              "ptrs": {
                "l": 0,
                "r": 4
              },
              "hl": {
                "0": "bad",
                "4": "a"
              },
              "vars": {
                "target": 10,
                "sum": 9
              }
            },
            {
              "note": "3 + 8 = 11, too big. Even the smallest partner is too big for 8, so r moves left.",
              "ptrs": {
                "l": 1,
                "r": 4
              },
              "hl": {
                "1": "a",
                "4": "bad"
              },
              "vars": {
                "target": 10,
                "sum": 11
              }
            },
            {
              "note": "3 + 6 = 9, too small. Even the biggest partner is too small for 3, so l moves right.",
              "ptrs": {
                "l": 1,
                "r": 3
              },
              "hl": {
                "1": "bad",
                "3": "a"
              },
              "vars": {
                "target": 10,
                "sum": 9
              }
            },
            {
              "note": "4 + 6 = 10. That equals the target, so we found the pair.",
              "ptrs": {
                "l": 2,
                "r": 3
              },
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "vars": {
                "target": 10,
                "sum": 10
              },
              "out": "Answer: indices 2 and 3 (4 + 6 = 10)"
            }
          ]
        }
      },
      "code": "// Returns the 0-based indices of two numbers in a sorted array that add up to target\nvector<int> twoSumSorted(const vector<int>& a, int target) {\n    int l = 0, r = (int)a.size() - 1;\n    while (l < r) {\n        int sum = a[l] + a[r];\n        if (sum == target) return {l, r};\n        if (sum < target) l++;      // need a bigger sum\n        else r--;                   // need a smaller sum\n    }\n    return {};                      // no pair exists\n}",
      "complexity": "Time O(n) because each pointer only moves inward. Space O(1). Add O(n log n) if you have to sort first.",
      "mistakes": [
        "Using l <= r when the two elements must be different. The loop has to stop when l == r.",
        "Using this on unsorted data. Sort first, or use a hash map instead if you must keep the original indices.",
        "Moving both pointers after a match when the problem asks for all pairs. Then you must also skip duplicate values."
      ],
      "practice": [
        167,
        11,
        15,
        42
      ]
    },
    "1": {
      "name": "Fix one, two-pointer the rest",
      "when": "You must find triples or quadruples that add up to a target, and the answer must not contain duplicate combinations. Brute force is O(n^3). Sorting first makes a two-pointer scan possible.",
      "idea": "Sort the array. Pick the first number a[i] and walk it from left to right. For the other numbers you now only need a pair that sums to -a[i], and a pair on a sorted array is exactly the opposite-ends problem: l starts at i + 1, r starts at the end, and each step discards one index. That turns O(n^3) into O(n^2). Because the array is sorted, equal numbers sit next to each other, so you can skip repeated values for i, l and r and never output the same triple twice.",
      "steps": [
        "Sort the array.",
        "Loop i from 0 to n - 3. Stop early if a[i] > 0, because three positive numbers can never sum to 0.",
        "If a[i] equals a[i - 1], continue. This value was already used as the first number.",
        "Set l = i + 1 and r = n - 1. While l < r, look at s = a[i] + a[l] + a[r]. If s < 0 do l++, if s > 0 do r--.",
        "If s == 0, store the triple, move l and r inward, and keep moving them while they point at a value equal to the one just used."
      ],
      "example": {
        "problem": "3Sum: find all unique triples that add up to 0. Input: [-1, 2, -2, 0, -1, 1]. After sorting it is [-2, -1, -1, 0, 1, 2]. Output: [[-2,0,2], [-1,-1,2], [-1,0,1]].",
        "walk": "Watch the pointer i (fixed first number) stay put while l and r squeeze the rest, exactly like opposite ends. Notice how a hit moves both pointers, and how the second -1 is skipped when it is used as i, because the first -1 already found every triple that starts with -1.",
        "viz": {
          "kind": "array",
          "cells": [
            -2,
            -1,
            -1,
            0,
            1,
            2
          ],
          "frames": [
            {
              "note": "-2 + -1 + 2 = -1, too small. Move l right to get a bigger sum.",
              "ptrs": {
                "i": 0,
                "l": 1,
                "r": 5
              },
              "hl": {
                "0": "b",
                "1": "bad",
                "5": "a"
              },
              "vars": {
                "sum": -1,
                "found": 0
              }
            },
            {
              "note": "-2 + -1 + 2 = -1, too small. Move l right to get a bigger sum.",
              "ptrs": {
                "i": 0,
                "l": 2,
                "r": 5
              },
              "hl": {
                "0": "b",
                "2": "bad",
                "5": "a"
              },
              "vars": {
                "sum": -1,
                "found": 0
              }
            },
            {
              "note": "-2 + 0 + 2 = 0. Record the triple, then move both pointers inward.",
              "ptrs": {
                "i": 0,
                "l": 3,
                "r": 5
              },
              "hl": {
                "0": "ok",
                "3": "ok",
                "5": "ok"
              },
              "vars": {
                "sum": 0,
                "found": 1
              }
            },
            {
              "note": "-1 + -1 + 2 = 0. Record the triple, then move both pointers inward.",
              "ptrs": {
                "i": 1,
                "l": 2,
                "r": 5
              },
              "hl": {
                "1": "ok",
                "2": "ok",
                "5": "ok"
              },
              "vars": {
                "sum": 0,
                "found": 2
              }
            },
            {
              "note": "-1 + 0 + 1 = 0. Record the triple, then move both pointers inward.",
              "ptrs": {
                "i": 1,
                "l": 3,
                "r": 4
              },
              "hl": {
                "1": "ok",
                "3": "ok",
                "4": "ok"
              },
              "vars": {
                "sum": 0,
                "found": 3
              }
            },
            {
              "note": "a[2] = -1 is the same as the previous fixed value, so every triple from it was already found. Skip it.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "1": "dim",
                "2": "bad"
              },
              "vars": {
                "found": 3
              }
            },
            {
              "note": "0 + 1 + 2 = 3, too big. Move r left to get a smaller sum.",
              "ptrs": {
                "i": 3,
                "l": 4,
                "r": 5
              },
              "hl": {
                "3": "b",
                "4": "a",
                "5": "bad"
              },
              "vars": {
                "sum": 3,
                "found": 3
              },
              "out": "Answer: [[-2,0,2],[-1,-1,2],[-1,0,1]]"
            }
          ]
        }
      },
      "code": "// Returns all unique triples that sum to 0\nvector<vector<int>> threeSum(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    int n = nums.size();\n    vector<vector<int>> res;\n    for (int i = 0; i + 2 < n; i++) {\n        if (nums[i] > 0) break;                          // no way to reach 0\n        if (i > 0 && nums[i] == nums[i - 1]) continue;   // skip repeated first number\n        int l = i + 1, r = n - 1;\n        while (l < r) {\n            int s = nums[i] + nums[l] + nums[r];\n            if (s < 0) l++;\n            else if (s > 0) r--;\n            else {\n                res.push_back({nums[i], nums[l], nums[r]});\n                l++; r--;\n                while (l < r && nums[l] == nums[l - 1]) l++;   // skip repeats of l\n                while (l < r && nums[r] == nums[r + 1]) r--;   // skip repeats of r\n            }\n        }\n    }\n    return res;\n}",
      "complexity": "Time O(n^2): the sort is O(n log n), then n fixed values times an O(n) pointer scan. Space O(1) extra, not counting the output.",
      "mistakes": [
        "Skipping duplicates with nums[i] == nums[i + 1] instead of nums[i - 1]. That throws away triples like [-1,-1,2] where the repeat is needed.",
        "Forgetting to skip repeated l and r values after a hit, which puts the same triple in the answer twice.",
        "Using a set of triples to remove duplicates. It works but is slower and hides the sort-and-skip idea that interviewers want to see."
      ],
      "practice": [
        15,
        16
      ]
    },
    "2": {
      "name": "Fast and slow / write pointer",
      "when": "You must change an array in place with O(1) extra space: remove duplicates, remove a value, move zeroes, partition. Or you walk a list or sequence with two pointers at different speeds.",
      "idea": "Use two pointers that both move left to right but have different jobs. The fast pointer r reads every element. The slow pointer w marks where the next good element must be written. Everything before w is the finished answer. When r finds an element worth keeping, copy it to w and move w forward. Because w can never get ahead of r, you never overwrite something you still need to read. The same two-speed idea also finds the middle of a linked list or a cycle.",
      "steps": [
        "Decide what the finished part looks like. For unique values: a[0..w-1] has no repeats.",
        "Start w at the first free slot (1 if the first element is always kept) and r right after it.",
        "Move r across the array. Test a[r] against the rule, for example a[r] != a[w - 1].",
        "If a[r] is worth keeping, write a[w] = a[r] and do w++. Otherwise do nothing.",
        "When r reaches the end, w is the length of the answer."
      ],
      "example": {
        "problem": "Remove duplicates from a sorted array in place and return the new length. Input: [1, 1, 2, 2, 2, 3, 4, 4]. Output: 4, and the first 4 slots are [1, 2, 3, 4].",
        "walk": "The dashed box is the finished part, a[0..w-1]. The reader r runs ahead through every cell. A repeat is skipped and only r moves. A new value is copied into slot w and the box grows by one. Notice that the cells after the box still hold old data, and that is fine because the answer is only the first 4.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            1,
            2,
            2,
            2,
            3,
            4,
            4
          ],
          "frames": [
            {
              "note": "Sorted array. w is the write pointer: the next slot to fill. r is the read pointer. The first value is always kept, so w starts at 1.",
              "cells": [
                1,
                1,
                2,
                2,
                2,
                3,
                4,
                4
              ],
              "ptrs": {
                "w": 1,
                "r": 1
              },
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "ok"
              },
              "vars": {
                "kept": 1
              }
            },
            {
              "note": "a[r] = 1 equals the last kept value 1, so it is a repeat. Skip it. w stays.",
              "ptrs": {
                "w": 1,
                "r": 1
              },
              "win": [
                0,
                0
              ],
              "hl": {
                "1": "bad"
              },
              "vars": {
                "kept": 1
              }
            },
            {
              "note": "a[r] = 2 is a new value, so copy it into slot 1. Then w moves to 2.",
              "cells": [
                1,
                2,
                2,
                2,
                2,
                3,
                4,
                4
              ],
              "ptrs": {
                "w": 1,
                "r": 2
              },
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "ok",
                "2": "a"
              },
              "vars": {
                "kept": 2
              }
            },
            {
              "note": "a[r] = 2 equals the last kept value 2, so it is a repeat. Skip it. w stays.",
              "ptrs": {
                "w": 2,
                "r": 3
              },
              "win": [
                0,
                1
              ],
              "hl": {
                "3": "bad"
              },
              "vars": {
                "kept": 2
              }
            },
            {
              "note": "a[r] = 2 equals the last kept value 2, so it is a repeat. Skip it. w stays.",
              "ptrs": {
                "w": 2,
                "r": 4
              },
              "win": [
                0,
                1
              ],
              "hl": {
                "4": "bad"
              },
              "vars": {
                "kept": 2
              }
            },
            {
              "note": "a[r] = 3 is a new value, so copy it into slot 2. Then w moves to 3.",
              "cells": [
                1,
                2,
                3,
                2,
                2,
                3,
                4,
                4
              ],
              "ptrs": {
                "w": 2,
                "r": 5
              },
              "win": [
                0,
                2
              ],
              "hl": {
                "2": "ok",
                "5": "a"
              },
              "vars": {
                "kept": 3
              }
            },
            {
              "note": "a[r] = 4 is a new value, so copy it into slot 3. Then w moves to 4.",
              "cells": [
                1,
                2,
                3,
                4,
                2,
                3,
                4,
                4
              ],
              "ptrs": {
                "w": 3,
                "r": 6
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "3": "ok",
                "6": "a"
              },
              "vars": {
                "kept": 4
              }
            },
            {
              "note": "a[r] = 4 equals the last kept value 4, so it is a repeat. Skip it. w stays.",
              "ptrs": {
                "w": 4,
                "r": 7
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "7": "bad"
              },
              "vars": {
                "kept": 4
              }
            },
            {
              "note": "r reached the end. The first w = 4 slots hold the unique values 1, 2, 3, 4. Anything after them is ignored.",
              "ptrs": {
                "w": 4,
                "r": 8
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok"
              },
              "vars": {
                "kept": 4
              },
              "out": "Answer: k = 4, array starts [1, 2, 3, 4]"
            }
          ]
        }
      },
      "code": "// Removes duplicates from a sorted array in place, returns the new length\nint removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int w = 1;                              // next slot to write; nums[0] is always kept\n    for (int r = 1; r < (int)nums.size(); r++) {\n        if (nums[r] != nums[w - 1]) {       // new value compared with last kept one\n            nums[w] = nums[r];\n            w++;\n        }\n    }\n    return w;\n}",
      "complexity": "Time O(n), one pass. Space O(1) because the array is changed in place.",
      "mistakes": [
        "Comparing nums[r] with nums[r - 1] after you have already overwritten cells. Compare with the last kept value nums[w - 1] to stay safe.",
        "Starting w at 0 and forgetting that the first element is always kept, which drops it.",
        "Returning the array size instead of w, or reading past w. Only the first w cells are meaningful."
      ],
      "practice": [
        88,
        167
      ]
    },
    "3": {
      "name": "Fixed-size window",
      "when": "The problem asks about every subarray or substring of one exact length k: maximum sum of k numbers, average of k numbers, or whether any window of length k has a property.",
      "idea": "A window is a block of k neighbouring cells. When it slides one step right, only two things change: one new element enters on the right and one old element leaves on the left. So you do not need to re-add all k numbers. Keep a running value, add the new element, subtract the old one, and update the answer. Each element enters once and leaves once, so the work is O(n) instead of O(n * k).",
      "steps": [
        "Compute the value of the first window (indexes 0 to k - 1) with a simple loop.",
        "Store it as the best answer so far.",
        "For i from k to n - 1, add a[i] (new element) to the running value.",
        "Subtract a[i - k] (the element that just left the window).",
        "Update the best answer with the new running value, then return it at the end."
      ],
      "example": {
        "problem": "Find the largest sum of any 3 neighbouring numbers. Input: [1, 4, 2, 9, 5, 1, 3], k = 3. Output: 16 (the window 2, 9, 5).",
        "walk": "The dashed box always holds exactly 3 cells. Each slide is one addition and one subtraction: the green cell enters, the red cell leaves. Compare this with re-adding 3 numbers every time. The best value rises to 16 at the window [2, 9, 5] and the later windows cannot beat it.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            4,
            2,
            9,
            5,
            1,
            3
          ],
          "frames": [
            {
              "note": "Window size is k = 3. Add up the first 3 numbers once: 1 + 4 + 2 = 7. This is the best so far.",
              "cells": [
                1,
                4,
                2,
                9,
                5,
                1,
                3
              ],
              "win": [
                0,
                2
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a"
              },
              "vars": {
                "sum": 7,
                "best": 7
              }
            },
            {
              "note": "Slide: add a[3] = 9, drop a[0] = 1. Sum is now 15. Best is 15.",
              "win": [
                1,
                3
              ],
              "hl": {
                "0": "bad",
                "3": "ok"
              },
              "vars": {
                "sum": 15,
                "best": 15
              }
            },
            {
              "note": "Slide: add a[4] = 5, drop a[1] = 4. Sum is now 16. Best is 16.",
              "win": [
                2,
                4
              ],
              "hl": {
                "1": "bad",
                "4": "ok"
              },
              "vars": {
                "sum": 16,
                "best": 16
              }
            },
            {
              "note": "Slide: add a[5] = 1, drop a[2] = 2. Sum is now 15. Best is 16.",
              "win": [
                3,
                5
              ],
              "hl": {
                "2": "bad",
                "5": "ok"
              },
              "vars": {
                "sum": 15,
                "best": 16
              }
            },
            {
              "note": "Slide: add a[6] = 3, drop a[3] = 9. Sum is now 9. Best is 16.",
              "win": [
                4,
                6
              ],
              "hl": {
                "3": "bad",
                "6": "ok"
              },
              "vars": {
                "sum": 9,
                "best": 16
              },
              "out": "Answer: 16"
            }
          ]
        }
      },
      "code": "// Largest sum of any k neighbouring numbers (assumes 1 <= k <= nums.size())\nint maxWindowSum(vector<int>& nums, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += nums[i];      // first window\n    int best = sum;\n    for (int i = k; i < (int)nums.size(); i++) {\n        sum += nums[i];                              // element enters\n        sum -= nums[i - k];                          // element leaves\n        best = max(best, sum);\n    }\n    return best;\n}",
      "complexity": "Time O(n), each element is added once and removed once. Space O(1).",
      "mistakes": [
        "Re-summing the whole window inside the loop. That makes it O(n * k) and times out.",
        "Subtracting nums[i - k + 1] or nums[i - k - 1] instead of nums[i - k]. Check with a tiny array by hand.",
        "Starting best at 0 when all numbers can be negative. Initialise it with the first window sum."
      ],
      "practice": [
        643,
        567,
        438
      ]
    },
    "4": {
      "name": "Variable window (longest)",
      "when": "You want the longest subarray or substring that satisfies a condition, such as no repeated characters, at most k zeroes, or sum at most a limit. The window size is not fixed, and the condition breaks when the window gets too big.",
      "idea": "Keep a window [l, r] that is always valid. Move r to the right to take in one new element. If that makes the window invalid, move l to the right, dropping elements, until the window is valid again. After each step the window is valid, so its length is a candidate for the answer. Neither pointer ever moves left, so each element is added once and removed once. This only works when removing elements from the left can fix the problem.",
      "steps": [
        "Set l = 0 and make an empty tracker (a count array, set, or running sum) and best = 0.",
        "For each r from 0 to n - 1, add a[r] to the tracker.",
        "While the window is invalid, remove a[l] from the tracker and do l++.",
        "Now the window [l, r] is valid. Update best = max(best, r - l + 1).",
        "Return best after the loop."
      ],
      "example": {
        "problem": "Longest substring without repeating characters. Input: \"pwwkew\". Output: 3, because \"wke\" is the longest piece where every letter is different.",
        "walk": "The map holds letter counts inside the window. When the second 'w' arrives, a count hits 2, so the window is invalid and l moves right dropping 'p' and then the first 'w'. The window never has to restart from scratch. Later it grows to \"wke\", length 3, and stays that size when the next 'w' forces another drop.",
        "viz": {
          "kind": "array",
          "cells": [
            "p",
            "w",
            "w",
            "k",
            "e",
            "w"
          ],
          "frames": [
            {
              "note": "Add 'p'. All letters in the window are different, so it is valid. Length 1, a new best.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 0
              },
              "map": {
                "p": 1
              },
              "vars": {
                "best": 1
              }
            },
            {
              "note": "Add 'w'. All letters in the window are different, so it is valid. Length 2, a new best.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 1
              },
              "map": {
                "p": 1,
                "w": 1
              },
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Add 'w'. Its count is now 2, so the window has a repeat and is invalid. Shrink from the left.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                0,
                2
              ],
              "hl": {
                "2": "bad"
              },
              "ptrs": {
                "l": 0,
                "r": 2
              },
              "map": {
                "p": 1,
                "w": 2
              },
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Drop 'p' from the left. 'w' still appears twice, keep shrinking.",
              "win": [
                1,
                2
              ],
              "hl": {
                "0": "dim",
                "2": "bad"
              },
              "ptrs": {
                "l": 1,
                "r": 2
              },
              "map": {
                "w": 2
              },
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Drop 'w' from the left. The repeat is gone, the window is valid again.",
              "win": [
                2,
                2
              ],
              "hl": {
                "1": "dim",
                "2": "a"
              },
              "ptrs": {
                "l": 2,
                "r": 2
              },
              "map": {
                "w": 1
              },
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Add 'k'. All letters in the window are different, so it is valid. Length 2, not better than best.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                2,
                3
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "l": 2,
                "r": 3
              },
              "map": {
                "k": 1,
                "w": 1
              },
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Add 'e'. All letters in the window are different, so it is valid. Length 3, a new best.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                2,
                4
              ],
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "l": 2,
                "r": 4
              },
              "map": {
                "e": 1,
                "k": 1,
                "w": 1
              },
              "vars": {
                "best": 3
              }
            },
            {
              "note": "Add 'w'. Its count is now 2, so the window has a repeat and is invalid. Shrink from the left.",
              "cells": [
                "p",
                "w",
                "w",
                "k",
                "e",
                "w"
              ],
              "win": [
                2,
                5
              ],
              "hl": {
                "5": "bad"
              },
              "ptrs": {
                "l": 2,
                "r": 5
              },
              "map": {
                "e": 1,
                "k": 1,
                "w": 2
              },
              "vars": {
                "best": 3
              }
            },
            {
              "note": "Drop 'w' from the left. The repeat is gone, the window is valid again.",
              "win": [
                3,
                5
              ],
              "hl": {
                "2": "dim",
                "5": "a"
              },
              "ptrs": {
                "l": 3,
                "r": 5
              },
              "map": {
                "e": 1,
                "k": 1,
                "w": 1
              },
              "vars": {
                "best": 3
              }
            },
            {
              "note": "The loop is over. The longest window without repeats was 'wke' with length 3.",
              "win": [
                2,
                4
              ],
              "hl": {
                "2": "ok",
                "3": "ok",
                "4": "ok"
              },
              "map": {
                "e": 1,
                "k": 1,
                "w": 1
              },
              "vars": {
                "best": 3
              },
              "out": "Answer: 3"
            }
          ]
        }
      },
      "code": "// Length of the longest substring with all different characters\nint lengthOfLongestSubstring(string s) {\n    int cnt[256] = {0};\n    int l = 0, best = 0;\n    for (int r = 0; r < (int)s.size(); r++) {\n        cnt[(unsigned char)s[r]]++;                       // take in s[r]\n        while (cnt[(unsigned char)s[r]] > 1) {            // repeat found, shrink\n            cnt[(unsigned char)s[l]]--;\n            l++;\n        }\n        best = max(best, r - l + 1);                      // window is valid here\n    }\n    return best;\n}",
      "complexity": "Time O(n): l and r each move at most n steps in total. Space O(1) because the count array has a fixed size of 256.",
      "mistakes": [
        "Using if instead of while when shrinking. One removal is often not enough to fix the window.",
        "Updating best before the window is valid again. Record the length only after the shrink loop.",
        "Using this when the condition does not get better by dropping elements from the left, for example sums with negative numbers."
      ],
      "practice": [
        3,
        424,
        1004,
        904
      ]
    },
    "5": {
      "name": "Variable window (shortest)",
      "when": "You need the shortest subarray or substring that is big enough or covers enough: sum at least a target, contains all required letters. Adding elements makes the window more valid, removing elements makes it less valid.",
      "idea": "This is the mirror image of the longest-window pattern. Move r right until the window becomes valid. Now the window is a candidate, so record its length. Then try to make it shorter: move l right as long as the window stays valid, recording a new length each time. When it turns invalid, go back to expanding r. The key difference is that you record the answer inside the shrink loop, while the window is valid.",
      "steps": [
        "Set l = 0, sum = 0 and best = a huge value (like INT_MAX).",
        "For each r, add a[r] to the window (sum += a[r]).",
        "While the window is valid (sum >= target), record best = min(best, r - l + 1).",
        "Still inside that loop, remove a[l] (sum -= a[l]) and do l++ to try for a shorter window.",
        "At the end, if best was never updated return 0, otherwise return best."
      ],
      "example": {
        "problem": "Smallest length of a subarray with sum at least 7. Input: target = 7, nums = [2, 3, 1, 2, 4, 3]. Output: 2 (the subarray [4, 3]).",
        "walk": "Two phases repeat. When the sum is below 7 only r moves. The moment the sum reaches 7 or more, l starts moving and every frame that is still valid gives a new, shorter length. Watch best fall from 4 to 3 to 2 as the window is squeezed around [4, 3]. All numbers are positive, which is why shrinking can only lower the sum.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            3,
            1,
            2,
            4,
            3
          ],
          "frames": [
            {
              "note": "Expand: add a[0] = 2, sum = 2. Still below 7, keep expanding.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 0
              },
              "vars": {
                "sum": 2,
                "best": "none"
              }
            },
            {
              "note": "Expand: add a[1] = 3, sum = 5. Still below 7, keep expanding.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 1
              },
              "vars": {
                "sum": 5,
                "best": "none"
              }
            },
            {
              "note": "Expand: add a[2] = 1, sum = 6. Still below 7, keep expanding.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                0,
                2
              ],
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 2
              },
              "vars": {
                "sum": 6,
                "best": "none"
              }
            },
            {
              "note": "Expand: add a[3] = 2, sum = 8. Sum is at least 7, so the window is valid with length 4. Best = 4.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                0,
                3
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 3
              },
              "vars": {
                "sum": 8,
                "best": 4
              }
            },
            {
              "note": "Shrink: drop 2 from the left, sum = 6. Now the sum is too small, so stop shrinking and expand again.",
              "win": [
                1,
                3
              ],
              "hl": {
                "0": "dim",
                "3": "a"
              },
              "ptrs": {
                "l": 1,
                "r": 3
              },
              "vars": {
                "sum": 6,
                "best": 4
              }
            },
            {
              "note": "Expand: add a[4] = 4, sum = 10. Sum is at least 7, so the window is valid with length 4. Best = 4.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                1,
                4
              ],
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "l": 1,
                "r": 4
              },
              "vars": {
                "sum": 10,
                "best": 4
              }
            },
            {
              "note": "Shrink: drop 3 from the left, sum = 7. Still valid with length 3. Best = 3.",
              "win": [
                2,
                4
              ],
              "hl": {
                "1": "dim",
                "4": "a"
              },
              "ptrs": {
                "l": 2,
                "r": 4
              },
              "vars": {
                "sum": 7,
                "best": 3
              }
            },
            {
              "note": "Shrink: drop 1 from the left, sum = 6. Now the sum is too small, so stop shrinking and expand again.",
              "win": [
                3,
                4
              ],
              "hl": {
                "2": "dim",
                "4": "a"
              },
              "ptrs": {
                "l": 3,
                "r": 4
              },
              "vars": {
                "sum": 6,
                "best": 3
              }
            },
            {
              "note": "Expand: add a[5] = 3, sum = 9. Sum is at least 7, so the window is valid with length 3. Best = 3.",
              "cells": [
                2,
                3,
                1,
                2,
                4,
                3
              ],
              "win": [
                3,
                5
              ],
              "hl": {
                "5": "a"
              },
              "ptrs": {
                "l": 3,
                "r": 5
              },
              "vars": {
                "sum": 9,
                "best": 3
              }
            },
            {
              "note": "Shrink: drop 2 from the left, sum = 7. Still valid with length 2. Best = 2.",
              "win": [
                4,
                5
              ],
              "hl": {
                "3": "dim",
                "5": "a"
              },
              "ptrs": {
                "l": 4,
                "r": 5
              },
              "vars": {
                "sum": 7,
                "best": 2
              }
            },
            {
              "note": "Shrink: drop 4 from the left, sum = 3. Now the sum is too small, so stop shrinking and expand again.",
              "win": [
                5,
                5
              ],
              "hl": {
                "4": "dim",
                "5": "a"
              },
              "ptrs": {
                "l": 5,
                "r": 5
              },
              "vars": {
                "sum": 3,
                "best": 2
              },
              "out": "Answer: 2"
            }
          ]
        }
      },
      "code": "// Smallest length of a subarray with sum >= target, or 0 if none exists\nint minSubArrayLen(int target, vector<int>& nums) {\n    int l = 0, sum = 0, best = INT_MAX;\n    for (int r = 0; r < (int)nums.size(); r++) {\n        sum += nums[r];                         // expand\n        while (sum >= target) {                 // valid: try to shrink\n            best = min(best, r - l + 1);\n            sum -= nums[l];\n            l++;\n        }\n    }\n    return best == INT_MAX ? 0 : best;\n}",
      "complexity": "Time O(n), each pointer moves right at most n times. Space O(1).",
      "mistakes": [
        "Recording the length after the shrink loop. By then the window is invalid, so the length is too short to be real.",
        "Forgetting to return 0 when no window ever reaches the target.",
        "Using it with negative numbers. Then dropping an element can raise the sum, and the sliding logic breaks (use prefix sums and a deque instead)."
      ],
      "practice": [
        209,
        76
      ]
    },
    "6": {
      "name": "Window + count map",
      "when": "The window must contain certain letters or values with certain counts: permutation of a string, all anagrams, or the smallest window that covers all required characters. You compare what is inside the window with what you need.",
      "idea": "Count what you need once (a map or an array of 26 counters). Then keep a second set of counters for the current window and update them as the window slides: add one for the new letter, subtract one for the letter that leaves. Comparing the two counters tells you if the window is good. For a fixed-length window, a permutation means the counters are exactly equal. For a variable window, you track how many required letters are already satisfied and shrink while everything is covered.",
      "steps": [
        "Count the letters you need (need[c]) from the pattern string.",
        "Keep window counts (have[c]) for the current window.",
        "For each i, add s2[i] to have. Once the window is longer than k, subtract the letter that left, s2[i - k].",
        "When the window has length k, compare have with need. Equal means a match, so return true or record the start.",
        "Use an array of size 26 for lowercase letters. Comparing two arrays costs only 26 steps."
      ],
      "example": {
        "problem": "Permutation in string: does s2 contain a permutation of s1? Input: s1 = \"abc\", s2 = \"ebdaoacb\". Output: true, because \"acb\" at the end uses the same letters as s1.",
        "walk": "The map shows the letter counts inside the window. Orange-violet cells are letters that belong to s1, red cells are letters that do not. The counter 'letters ok' climbs only when the window gets closer to a b c. Early windows hold a stray 'e', 'd' or 'o', so they fail. Only \"acb\" has each of a, b and c exactly once.",
        "viz": {
          "kind": "array",
          "cells": [
            "e",
            "b",
            "d",
            "a",
            "o",
            "a",
            "c",
            "b"
          ],
          "frames": [
            {
              "note": "s1 = \"abc\" needs one a, one b and one c. A permutation of s1 is any window of length 3 with exactly those counts. We slide a window of size 3 over s2.",
              "cells": [
                "e",
                "b",
                "d",
                "a",
                "o",
                "a",
                "c",
                "b"
              ],
              "map": {
                "need a": 1,
                "need b": 1,
                "need c": 1
              },
              "vars": {
                "k": 3
              }
            },
            {
              "note": "First window \"ebd\": count its letters. Only 1 of the 3 needed letters have the right count.",
              "win": [
                0,
                2
              ],
              "hl": {
                "0": "bad",
                "1": "b",
                "2": "bad"
              },
              "map": {
                "b": 1,
                "d": 1,
                "e": 1
              },
              "vars": {
                "letters ok": 1
              }
            },
            {
              "note": "Window \"bda\": counts do not match s1 (letters that are right: 2 of 3).",
              "win": [
                1,
                3
              ],
              "hl": {
                "1": "b",
                "2": "bad",
                "3": "b"
              },
              "map": {
                "a": 1,
                "b": 1,
                "d": 1
              },
              "vars": {
                "letters ok": 2
              }
            },
            {
              "note": "Window \"dao\": counts do not match s1 (letters that are right: 1 of 3).",
              "win": [
                2,
                4
              ],
              "hl": {
                "2": "bad",
                "3": "b",
                "4": "bad"
              },
              "map": {
                "a": 1,
                "d": 1,
                "o": 1
              },
              "vars": {
                "letters ok": 1
              }
            },
            {
              "note": "Window \"aoa\": counts do not match s1 (letters that are right: 0 of 3).",
              "win": [
                3,
                5
              ],
              "hl": {
                "3": "b",
                "4": "bad",
                "5": "b"
              },
              "map": {
                "a": 2,
                "o": 1
              },
              "vars": {
                "letters ok": 0
              }
            },
            {
              "note": "Window \"oac\": counts do not match s1 (letters that are right: 2 of 3).",
              "win": [
                4,
                6
              ],
              "hl": {
                "4": "bad",
                "5": "b",
                "6": "b"
              },
              "map": {
                "a": 1,
                "c": 1,
                "o": 1
              },
              "vars": {
                "letters ok": 2
              }
            },
            {
              "note": "Counts match s1 exactly, so this window is a permutation of s1.",
              "win": [
                5,
                7
              ],
              "hl": {
                "5": "ok",
                "6": "ok",
                "7": "ok"
              },
              "map": {
                "a": 1,
                "b": 1,
                "c": 1
              },
              "vars": {
                "letters ok": 3
              },
              "out": "Answer: true"
            }
          ]
        }
      },
      "code": "// Does s2 contain a permutation of s1?\nbool checkInclusion(string s1, string s2) {\n    int k = s1.size();\n    if (k > (int)s2.size()) return false;\n    vector<int> need(26, 0), have(26, 0);\n    for (char c : s1) need[c - 'a']++;\n    for (int i = 0; i < (int)s2.size(); i++) {\n        have[s2[i] - 'a']++;                       // letter enters\n        if (i >= k) have[s2[i - k] - 'a']--;       // letter leaves\n        if (i >= k - 1 && have == need) return true;   // window of size k matches\n    }\n    return false;\n}",
      "complexity": "Time O(26 * n), which is O(n) for a fixed alphabet. Space O(26) = O(1).",
      "mistakes": [
        "Forgetting to remove the letter that leaves, so the counts keep growing and never match.",
        "Comparing the counters before the first full window exists (when i < k - 1).",
        "Using a plain set instead of counts. A set cannot tell that \"aab\" and \"abb\" are different."
      ],
      "practice": [
        567,
        438,
        76
      ]
    },
    "7": {
      "name": "At most K trick",
      "when": "The problem counts subarrays with exactly k of something (k distinct values, k odd numbers, sum exactly k), and the plain window cannot handle it because shrinking does not give you a single clean window.",
      "idea": "Counting subarrays with at most k distinct values is easy with a variable window. For every right end r, the smallest valid left end is l, and all starts from l to r also work, so r - l + 1 subarrays end at r. Add that up. To get exactly k, count at most k and subtract at most k - 1. What is left must have exactly k. You write one helper and call it twice.",
      "steps": [
        "Write a helper atMost(k) with a normal variable window and a counter for distinct values.",
        "For each r, add a[r]. While the window has more than k distinct values, shrink from the left.",
        "Add r - l + 1 to the total. That counts every valid subarray ending at r.",
        "The answer for exactly k is atMost(k) - atMost(k - 1).",
        "Remember that atMost(0) is 0 for k = 1 problems, the helper handles it naturally."
      ],
      "example": {
        "problem": "Subarrays with exactly 2 distinct integers. Input: [1, 2, 1, 2, 3], k = 2. Output: 7 (for example [1,2], [2,1], [1,2,1], [1,2,1,2], [2,1,2], [1,2], [2,3]).",
        "walk": "Run one: atMost(2) adds r - l + 1 at every step and reaches 12. When 3 arrives, three distinct values do not fit, so l jumps forward to 3. Run two: atMost(1) reaches 5, which is just the 5 single elements. The difference, 12 - 5 = 7, is exactly the subarrays with two distinct values.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            1,
            2,
            3
          ],
          "frames": [
            {
              "note": "Count subarrays with exactly 2 different values. Trick: exactly 2 = atMost(2) - atMost(1). First pass: atMost(2).",
              "cells": [
                1,
                2,
                1,
                2,
                3
              ],
              "vars": {
                "k": 2
              }
            },
            {
              "note": "atMost(2): add 1. Still within the limit. 1 subarrays end here. Total 1.",
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 0
              },
              "map": {
                "1": 1
              },
              "vars": {
                "calls": "atMost(2)",
                "total": 1
              }
            },
            {
              "note": "atMost(2): add 2. Still within the limit. 2 subarrays end here. Total 3.",
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 1
              },
              "map": {
                "1": 1,
                "2": 1
              },
              "vars": {
                "calls": "atMost(2)",
                "total": 3
              }
            },
            {
              "note": "atMost(2): add 1. Still within the limit. 3 subarrays end here. Total 6.",
              "win": [
                0,
                2
              ],
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 2
              },
              "map": {
                "1": 2,
                "2": 1
              },
              "vars": {
                "calls": "atMost(2)",
                "total": 6
              }
            },
            {
              "note": "atMost(2): add 2. Still within the limit. 4 subarrays end here. Total 10.",
              "win": [
                0,
                3
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 3
              },
              "map": {
                "1": 2,
                "2": 2
              },
              "vars": {
                "calls": "atMost(2)",
                "total": 10
              }
            },
            {
              "note": "atMost(2): add 3. Too many distinct values, so l slid 3 steps to 3. 2 subarrays end here. Total 12.",
              "win": [
                3,
                4
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "4": "a"
              },
              "ptrs": {
                "l": 3,
                "r": 4
              },
              "map": {
                "2": 1,
                "3": 1
              },
              "vars": {
                "calls": "atMost(2)",
                "total": 12
              }
            },
            {
              "note": "atMost(2) = 12 subarrays use 2 or fewer distinct values. Now run the same code with k = 1.",
              "vars": {
                "atMost(2)": 12
              }
            },
            {
              "note": "atMost(1): add 1. Still within the limit. 1 subarrays end here. Total 1.",
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "l": 0,
                "r": 0
              },
              "map": {
                "1": 1
              },
              "vars": {
                "calls": "atMost(1)",
                "total": 1
              }
            },
            {
              "note": "atMost(1): add 2. Too many distinct values, so l slid 1 step to 1. 1 subarrays end here. Total 2.",
              "win": [
                1,
                1
              ],
              "hl": {
                "0": "dim",
                "1": "a"
              },
              "ptrs": {
                "l": 1,
                "r": 1
              },
              "map": {
                "2": 1
              },
              "vars": {
                "calls": "atMost(1)",
                "total": 2
              }
            },
            {
              "note": "atMost(1): add 1. Too many distinct values, so l slid 1 step to 2. 1 subarrays end here. Total 3.",
              "win": [
                2,
                2
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "a"
              },
              "ptrs": {
                "l": 2,
                "r": 2
              },
              "map": {
                "1": 1
              },
              "vars": {
                "calls": "atMost(1)",
                "total": 3
              }
            },
            {
              "note": "atMost(1): add 2. Too many distinct values, so l slid 1 step to 3. 1 subarrays end here. Total 4.",
              "win": [
                3,
                3
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "a"
              },
              "ptrs": {
                "l": 3,
                "r": 3
              },
              "map": {
                "2": 1
              },
              "vars": {
                "calls": "atMost(1)",
                "total": 4
              }
            },
            {
              "note": "atMost(1): add 3. Too many distinct values, so l slid 1 step to 4. 1 subarrays end here. Total 5.",
              "win": [
                4,
                4
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "a"
              },
              "ptrs": {
                "l": 4,
                "r": 4
              },
              "map": {
                "3": 1
              },
              "vars": {
                "calls": "atMost(1)",
                "total": 5
              }
            },
            {
              "note": "atMost(1) = 5. Exactly 2 = 12 - 5 = 7. The subarrays counted in both passes had 1 distinct value and are removed.",
              "vars": {
                "atMost(2)": 12,
                "atMost(1)": 5
              },
              "out": "Answer: 12 - 5 = 7"
            }
          ]
        }
      },
      "code": "// Number of subarrays with at most k distinct values\nint atMost(vector<int>& nums, int k) {\n    unordered_map<int, int> cnt;\n    int l = 0, total = 0;\n    for (int r = 0; r < (int)nums.size(); r++) {\n        cnt[nums[r]]++;\n        while ((int)cnt.size() > k) {                 // too many distinct values\n            if (--cnt[nums[l]] == 0) cnt.erase(nums[l]);\n            l++;\n        }\n        total += r - l + 1;                           // all starts l..r work\n    }\n    return total;\n}\n\n// Number of subarrays with exactly k distinct values\nint subarraysWithKDistinct(vector<int>& nums, int k) {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}",
      "complexity": "Time O(n), two linear passes. Space O(k) for the count map.",
      "mistakes": [
        "Forgetting to erase a key when its count reaches 0. Then cnt.size() overstates the distinct values.",
        "Adding 1 instead of r - l + 1 per step. You would count only windows, not every subarray ending at r.",
        "Trying to count exactly k with one window. The subtraction is what makes it simple."
      ],
      "practice": [
        904,
        713
      ]
    }
  },
  "4": {
    "0": {
      "name": "Matching and nesting",
      "when": "The input has brackets, tags or nested pieces that must close in the right order: valid parentheses, decode string, simplify path, remove adjacent duplicates. The last thing opened must be the first thing closed.",
      "idea": "A stack gives you last in, first out, which is exactly how nesting works. When you see something that opens a group, push it. When you see something that closes a group, look at the top of the stack. If the top is the matching opener, pop it. If it is not (or the stack is empty), the nesting is broken. At the very end the stack must be empty, otherwise some opener was never closed. In harder versions you push more than a char, such as a number and the string built so far.",
      "steps": [
        "Create an empty stack and loop over the characters.",
        "If the character is an opener ( [ {, push it.",
        "If it is a closer, first check that the stack is not empty and that the top is the matching opener. If not, return false.",
        "If it matches, pop the top.",
        "After the loop, return true only if the stack is empty."
      ],
      "example": {
        "problem": "Valid Parentheses. Input: \"([]{)}\". Output: false. The pair [ ] closes fine, but the ) arrives while { is on top.",
        "walk": "The stack lane shows the currently open brackets, newest on the right. The pair [ ] is popped cleanly because the closer meets its own opener on top. At the fifth character, the ) wants a ( but the top is {. A stack will always reveal this because the ( is buried under the {, so it cannot be closed yet.",
        "viz": {
          "kind": "array",
          "cells": [
            "(",
            "[",
            "]",
            "{",
            ")",
            "}"
          ],
          "frames": [
            {
              "note": "Scan left to right. Push every opener. At a closer, the top of the stack must be its matching opener.",
              "cells": [
                "(",
                "[",
                "]",
                "{",
                ")",
                "}"
              ],
              "stack": []
            },
            {
              "note": "'(' is an opener. Push it. The most recent opener must be closed first.",
              "stack": [
                "("
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              }
            },
            {
              "note": "'[' is an opener. Push it. The most recent opener must be closed first.",
              "stack": [
                "(",
                "["
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              }
            },
            {
              "note": "']' closes the top '['. They match, so pop.",
              "stack": [
                "("
              ],
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "i": 2
              }
            },
            {
              "note": "'{' is an opener. Push it. The most recent opener must be closed first.",
              "stack": [
                "(",
                "{"
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              }
            },
            {
              "note": "')' needs '(' on top, but the top is '{'. Mismatch, so the string is not valid.",
              "stack": [
                "(",
                "{"
              ],
              "hl": {
                "4": "bad"
              },
              "ptrs": {
                "i": 4
              },
              "out": "Answer: false"
            }
          ]
        }
      },
      "code": "// Are all brackets closed in the right order?\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push(c);                              // opener: remember it\n        } else {\n            if (st.empty()) return false;            // closer with nothing to close\n            char open = st.top();\n            if ((c == ')' && open != '(') ||\n                (c == ']' && open != '[') ||\n                (c == '}' && open != '{')) return false;   // wrong type\n            st.pop();                                // matched\n        }\n    }\n    return st.empty();                               // leftover openers are invalid\n}",
      "complexity": "Time O(n), each character is pushed and popped at most once. Space O(n) in the worst case, for example a string of only openers.",
      "mistakes": [
        "Calling st.top() or st.pop() on an empty stack, for inputs like \")\". Always check st.empty() first.",
        "Returning true without checking that the stack is empty, which accepts \"((\".",
        "Only counting brackets instead of using a stack. A counter cannot tell that \"([)]\" is invalid."
      ],
      "practice": [
        20,
        394,
        71,
        1047
      ]
    },
    "1": {
      "name": "Expression evaluation",
      "when": "You have to compute an arithmetic expression: postfix (Reverse Polish Notation), or infix text with + - * / and maybe brackets, as in basic calculator problems.",
      "idea": "For postfix, a single stack of numbers is enough. Read tokens left to right. A number is pushed. An operator takes the top two numbers, applies itself and pushes the result back. When all tokens are read, the one value left is the answer. For normal infix text like 3+2*2, you handle precedence: keep the last number and sign, push numbers to the stack, and when you see * or / combine with the top of the stack right away. At the end, add up the stack.",
      "steps": [
        "Make a stack of integers.",
        "Read the next token. If it is a number, push it.",
        "If it is an operator, pop b first (the right side), then pop a (the left side).",
        "Compute a op b and push the result. Be careful that - and / are not symmetric.",
        "After the last token, the answer is the only element left in the stack."
      ],
      "example": {
        "problem": "Evaluate this postfix expression: [\"5\",\"1\",\"2\",\"+\",\"4\",\"*\",\"+\",\"3\",\"-\"]. In normal notation this is 5 + ((1 + 2) * 4) - 3. Output: 14.",
        "walk": "Each operator collapses the top two stack items into one. First 1 and 2 become 3, then 3 and 4 become 12, then 5 and 12 become 17. For the last - the numbers are 17 and 3, so the result is 17 - 3 = 14, not 3 - 17. The stack never holds more than 3 items here, no brackets are needed in postfix.",
        "viz": {
          "kind": "array",
          "cells": [
            "5",
            "1",
            "2",
            "+",
            "4",
            "*",
            "+",
            "3",
            "-"
          ],
          "frames": [
            {
              "note": "Reverse Polish Notation: operators come after their numbers. Numbers go on the stack. An operator uses the top two numbers.",
              "cells": [
                "5",
                "1",
                "2",
                "+",
                "4",
                "*",
                "+",
                "3",
                "-"
              ],
              "stack": []
            },
            {
              "note": "5 is a number. Push it.",
              "stack": [
                5
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              }
            },
            {
              "note": "1 is a number. Push it.",
              "stack": [
                5,
                1
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              }
            },
            {
              "note": "2 is a number. Push it.",
              "stack": [
                5,
                1,
                2
              ],
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "i": 2
              }
            },
            {
              "note": "'+': pop 2 (right) and 1 (left), compute 1 + 2 = 3, push 3.",
              "stack": [
                5,
                3
              ],
              "hl": {
                "3": "ok"
              },
              "ptrs": {
                "i": 3
              }
            },
            {
              "note": "4 is a number. Push it.",
              "stack": [
                5,
                3,
                4
              ],
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "i": 4
              }
            },
            {
              "note": "'*': pop 4 (right) and 3 (left), compute 3 * 4 = 12, push 12.",
              "stack": [
                5,
                12
              ],
              "hl": {
                "5": "ok"
              },
              "ptrs": {
                "i": 5
              }
            },
            {
              "note": "'+': pop 12 (right) and 5 (left), compute 5 + 12 = 17, push 17.",
              "stack": [
                17
              ],
              "hl": {
                "6": "ok"
              },
              "ptrs": {
                "i": 6
              }
            },
            {
              "note": "3 is a number. Push it.",
              "stack": [
                17,
                3
              ],
              "hl": {
                "7": "a"
              },
              "ptrs": {
                "i": 7
              }
            },
            {
              "note": "'-': pop 3 (right) and 17 (left), compute 17 - 3 = 14, push 14. Order matters: the first pop is the right operand.",
              "stack": [
                14
              ],
              "hl": {
                "8": "ok"
              },
              "ptrs": {
                "i": 8
              },
              "out": "Answer: 14"
            }
          ]
        }
      },
      "code": "// Evaluates a Reverse Polish Notation expression\nint evalRPN(vector<string>& tokens) {\n    stack<int> st;\n    for (const string& t : tokens) {\n        if (t == \"+\" || t == \"-\" || t == \"*\" || t == \"/\") {\n            int b = st.top(); st.pop();        // right operand comes off first\n            int a = st.top(); st.pop();        // then the left operand\n            int v = 0;\n            if (t == \"+\") v = a + b;\n            else if (t == \"-\") v = a - b;\n            else if (t == \"*\") v = a * b;\n            else v = a / b;                    // C++ truncates toward zero\n            st.push(v);\n        } else {\n            st.push(stoi(t));                  // number token\n        }\n    }\n    return st.top();\n}",
      "complexity": "Time O(n), one step per token. Space O(n) for the stack.",
      "mistakes": [
        "Swapping the operands. For - and / the first value popped is the right-hand side b, so compute a - b, not b - a.",
        "Checking only t.size() == 1 to detect operators. A token like \"-3\" is a number.",
        "In infix calculators, applying + and - immediately. Defer them, because a later * or / may bind tighter."
      ],
      "practice": [
        150,
        227
      ]
    },
    "2": {
      "name": "Monotonic stack (next greater or smaller)",
      "when": "For each element you need the next bigger (or smaller) element to its right or left, or the distance to it: next greater element, daily temperatures, stock span, remove k digits.",
      "idea": "Keep a stack of elements that are still waiting for their answer, in decreasing order from bottom to top (for next greater). When a new value x arrives, any waiting value smaller than x has just found its answer: x. Pop them and record x for each. Then push x, which now waits for something bigger. Each element is pushed once and popped once, so the whole scan is O(n). In practice you store indexes on the stack, so you can fill answer[index] or compute distances.",
      "steps": [
        "Make an answer array filled with -1 (or 0) and an empty stack of indexes.",
        "For each i from left to right, while the stack is not empty and a[top] < a[i]: pop j and set ans[j] = a[i] (or i - j for distances).",
        "Push i onto the stack.",
        "Indexes left in the stack at the end have no greater element, so they keep the default.",
        "Flip the comparison for next smaller. For previous greater, scan the other way or read the stack top before pushing."
      ],
      "example": {
        "problem": "Next greater element to the right. Input: [6, 2, 5, 1, 3, 8, 4]. Output: [8, 5, 8, 3, 8, -1, -1].",
        "walk": "The stack lane always stays in decreasing order, which is why it is called monotonic. Green cells are the ones just popped: they have found their answer. Watch 8 arrive at index 5. In one go it pops 3, 5 and 6, because all three were waiting for something bigger. Each element is popped only once, so this stays linear.",
        "viz": {
          "kind": "array",
          "cells": [
            6,
            2,
            5,
            1,
            3,
            8,
            4
          ],
          "frames": [
            {
              "note": "6 is not bigger than the top of the stack. Nothing to pop. Push 6; the stack stays in decreasing order.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                6
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              }
            },
            {
              "note": "2 is not bigger than the top of the stack. Nothing to pop. Push 2; the stack stays in decreasing order.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                6,
                2
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              }
            },
            {
              "note": "5 arrives and is bigger than 2. Pop them: their next greater value is 5. Then push 5.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                6,
                5
              ],
              "hl": {
                "1": "ok",
                "2": "a"
              },
              "ptrs": {
                "i": 2
              }
            },
            {
              "note": "1 is not bigger than the top of the stack. Nothing to pop. Push 1; the stack stays in decreasing order.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                6,
                5,
                1
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              }
            },
            {
              "note": "3 arrives and is bigger than 1. Pop them: their next greater value is 3. Then push 3.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                6,
                5,
                3
              ],
              "hl": {
                "3": "ok",
                "4": "a"
              },
              "ptrs": {
                "i": 4
              }
            },
            {
              "note": "8 arrives and is bigger than 3, 5, 6. Pop them: their next greater value is 8. Then push 8.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                8
              ],
              "hl": {
                "0": "ok",
                "2": "ok",
                "4": "ok",
                "5": "a"
              },
              "ptrs": {
                "i": 5
              }
            },
            {
              "note": "4 is not bigger than the top of the stack. Nothing to pop. Push 4; the stack stays in decreasing order.",
              "cells": [
                6,
                2,
                5,
                1,
                3,
                8,
                4
              ],
              "stack": [
                8,
                4
              ],
              "hl": {
                "6": "a"
              },
              "ptrs": {
                "i": 6
              }
            },
            {
              "note": "The end. The values still on the stack (8 and 4) never met a bigger one to their right, so their answer is -1.",
              "stack": [
                8,
                4
              ],
              "hl": {
                "5": "bad",
                "6": "bad"
              },
              "out": "Answer: [8,5,8,3,8,-1,-1]"
            }
          ]
        }
      },
      "code": "// ans[i] = next value to the right that is bigger than a[i], or -1\nvector<int> nextGreater(vector<int>& a) {\n    int n = a.size();\n    vector<int> ans(n, -1);\n    stack<int> st;                           // indexes still waiting for an answer\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && a[st.top()] < a[i]) {\n            ans[st.top()] = a[i];            // a[i] is the answer for the popped index\n            st.pop();\n        }\n        st.push(i);\n    }\n    return ans;\n}",
      "complexity": "Time O(n) because every index is pushed once and popped once. Space O(n) for the stack and the answer.",
      "mistakes": [
        "Using a nested loop for each element. That is O(n^2) and the stack removes the need.",
        "Mixing up < and <=. With duplicates, decide if an equal value counts as greater (usually it does not, so use <).",
        "Pushing values instead of indexes when the problem needs a distance, like Daily Temperatures."
      ],
      "practice": [
        496,
        739,
        503,
        901
      ]
    },
    "3": {
      "name": "Monotonic stack for areas",
      "when": "You need the largest rectangle under a histogram, the largest rectangle of ones in a matrix, or the water trapped between bars, where each bar's reach to the left and right depends on the next shorter or taller bar.",
      "idea": "For each bar, the widest rectangle that uses its full height stretches left and right until it meets a shorter bar. A stack of increasing heights finds those borders in one pass. When a shorter bar arrives, the bar on top of the stack has just found its right border (the current index) and its left border (the new top below it, which is the nearest shorter bar to the left). The width is the space strictly between those borders. Add a height 0 at the end so every bar gets popped.",
      "steps": [
        "Keep a stack of indexes whose heights are increasing.",
        "For each i (and a final i = n with height 0), while the top is taller than the current height, pop it as the bar to measure.",
        "After the pop, the left border is the new top (or -1 if the stack is empty). The right border is i.",
        "Width = i - left - 1, area = height * width. Update the best area.",
        "Push i (not needed for the final sentinel) and continue."
      ],
      "example": {
        "problem": "Largest rectangle in a histogram. Heights: [2, 1, 5, 6, 2, 3]. Output: 10 (height 5 across the two bars of height 5 and 6).",
        "walk": "The stack holds ever-taller bars. The dashed box shows the rectangle measured at each pop. When the 2 arrives, the 6 pops with width 1, then the 5 pops and reaches back across the 6, width 2, area 10. The stack top then is bar 1, shorter than 2, so the popping stops. The final sentinel flushes out the remaining bars.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            1,
            5,
            6,
            2,
            3
          ],
          "frames": [
            {
              "note": "Bar 2 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "stack": [
                "2@0"
              ],
              "vars": {
                "best": 0
              }
            },
            {
              "note": "Bar 1 at i = 1 is shorter than top 2. Pop 2: it can stretch from 0 to 0, width 1, area 2 * 1 = 2.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "ok"
              },
              "ptrs": {
                "i": 1
              },
              "stack": [],
              "vars": {
                "width": 1,
                "area": 2,
                "best": 2
              }
            },
            {
              "note": "Bar 1 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "stack": [
                "1@1"
              ],
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Bar 5 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "stack": [
                "1@1",
                "5@2"
              ],
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Bar 6 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "stack": [
                "1@1",
                "5@2",
                "6@3"
              ],
              "vars": {
                "best": 2
              }
            },
            {
              "note": "Bar 2 at i = 4 is shorter than top 6. Pop 6: it can stretch from 3 to 3, width 1, area 6 * 1 = 6.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                3,
                3
              ],
              "hl": {
                "3": "ok"
              },
              "ptrs": {
                "i": 4
              },
              "stack": [
                "1@1",
                "5@2"
              ],
              "vars": {
                "width": 1,
                "area": 6,
                "best": 6
              }
            },
            {
              "note": "Bar 2 at i = 4 is shorter than top 5. Pop 5: it can stretch from 2 to 3, width 2, area 5 * 2 = 10.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                2,
                3
              ],
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "i": 4
              },
              "stack": [
                "1@1"
              ],
              "vars": {
                "width": 2,
                "area": 10,
                "best": 10
              }
            },
            {
              "note": "Bar 2 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "i": 4
              },
              "stack": [
                "1@1",
                "2@4"
              ],
              "vars": {
                "best": 10
              }
            },
            {
              "note": "Bar 3 is not shorter than the top, so push it. Heights on the stack keep rising.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "hl": {
                "5": "a"
              },
              "ptrs": {
                "i": 5
              },
              "stack": [
                "1@1",
                "2@4",
                "3@5"
              ],
              "vars": {
                "best": 10
              }
            },
            {
              "note": "End of bars (height 0 sentinel). Pop 3: it can stretch from 5 to 5, width 1, area 3 * 1 = 3.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                5,
                5
              ],
              "hl": {
                "5": "ok"
              },
              "ptrs": {
                "i": 6
              },
              "stack": [
                "1@1",
                "2@4"
              ],
              "vars": {
                "width": 1,
                "area": 3,
                "best": 10
              }
            },
            {
              "note": "End of bars (height 0 sentinel). Pop 2: it can stretch from 2 to 5, width 4, area 2 * 4 = 8.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                2,
                5
              ],
              "hl": {
                "4": "ok"
              },
              "ptrs": {
                "i": 6
              },
              "stack": [
                "1@1"
              ],
              "vars": {
                "width": 4,
                "area": 8,
                "best": 10
              }
            },
            {
              "note": "End of bars (height 0 sentinel). Pop 1: it can stretch from 0 to 5, width 6, area 1 * 6 = 6.",
              "cells": [
                2,
                1,
                5,
                6,
                2,
                3
              ],
              "win": [
                0,
                5
              ],
              "hl": {
                "1": "ok"
              },
              "ptrs": {
                "i": 6
              },
              "stack": [],
              "vars": {
                "width": 6,
                "area": 6,
                "best": 10
              }
            },
            {
              "note": "All bars are done. The best rectangle uses heights 5 and 6, limited by height 5 across width 2, area 10.",
              "win": [
                2,
                3
              ],
              "hl": {
                "2": "ok",
                "3": "ok"
              },
              "stack": [],
              "vars": {
                "best": 10
              },
              "out": "Answer: 10"
            }
          ]
        }
      },
      "code": "// Largest rectangle area in a histogram\nint largestRectangleArea(vector<int>& h) {\n    int n = h.size(), best = 0;\n    stack<int> st;                                   // indexes, heights increasing\n    for (int i = 0; i <= n; i++) {\n        int cur = (i == n) ? 0 : h[i];               // height 0 at the end flushes the stack\n        while (!st.empty() && h[st.top()] > cur) {\n            int height = h[st.top()];\n            st.pop();\n            int left = st.empty() ? -1 : st.top();   // nearest shorter bar on the left\n            best = max(best, height * (i - left - 1));\n        }\n        if (i < n) st.push(i);\n    }\n    return best;\n}",
      "complexity": "Time O(n), every bar is pushed and popped once. Space O(n) for the stack.",
      "mistakes": [
        "Computing width as i - top after the pop instead of i - left - 1. Check with a stack that becomes empty.",
        "Forgetting the final flush with height 0, so bars still on the stack are never measured.",
        "Using >= when popping and then messing up duplicates. With > the result is still correct because the last equal bar gets the full width."
      ],
      "practice": [
        84,
        901
      ]
    },
    "4": {
      "name": "Auxiliary stack",
      "when": "A stack must also answer a question about everything inside it in O(1), such as the current minimum or maximum, while still doing push and pop in O(1).",
      "idea": "Searching the stack for the minimum on every call costs O(n). Instead, remember the answer at the time each value was pushed. Next to every value store the minimum of the stack up to and including it. The top pair then always describes the whole stack. When you pop, the stored minimum goes with it, and the previous pair shows the old minimum again. You can use a second stack for the minimums or one stack of pairs, as below. The same trick works for max, gcd or any value that can be combined one element at a time.",
      "steps": [
        "Store pairs (value, minSoFar) on one stack, or keep two parallel stacks.",
        "push(x): minSoFar = x if the stack is empty, otherwise min(x, top's minSoFar). Push (x, minSoFar).",
        "pop(): just pop the top pair. The older pair underneath already has the right minimum.",
        "top(): return the value of the top pair.",
        "getMin(): return the minSoFar of the top pair."
      ],
      "example": {
        "problem": "Min Stack. Operations: push 5, push 3, push 7, push 2, getMin, pop, getMin, pop, pop, getMin. In the animation + means push. Output of the getMin calls: 2, 3, 5.",
        "walk": "Each stack box shows value|min. The min column goes 5, 3, 3, 2 as values are pushed, because it only changes when a smaller value arrives. After popping the 2, the min falls back to 3 automatically, with no re-scan, because the pair below already stored 3. Every operation touches only the top, so all are O(1).",
        "viz": {
          "kind": "array",
          "cells": [
            "+5",
            "+3",
            "+7",
            "+2",
            "min",
            "pop",
            "min",
            "pop",
            "pop",
            "min"
          ],
          "frames": [
            {
              "note": "push(5). The running min with 5 on top is min(5, previous min) = 5. Store the pair 5|5.",
              "cells": [
                "+5",
                "+3",
                "+7",
                "+2",
                "min",
                "pop",
                "min",
                "pop",
                "pop",
                "min"
              ],
              "stack": [
                "5|5"
              ],
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "op": 0
              },
              "vars": {
                "min": 5
              }
            },
            {
              "note": "push(3). The running min with 3 on top is min(3, previous min) = 3. Store the pair 3|3.",
              "cells": [
                "+5",
                "+3",
                "+7",
                "+2",
                "min",
                "pop",
                "min",
                "pop",
                "pop",
                "min"
              ],
              "stack": [
                "5|5",
                "3|3"
              ],
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "op": 1
              },
              "vars": {
                "min": 3
              }
            },
            {
              "note": "push(7). The running min with 7 on top is min(7, previous min) = 3. Store the pair 7|3.",
              "cells": [
                "+5",
                "+3",
                "+7",
                "+2",
                "min",
                "pop",
                "min",
                "pop",
                "pop",
                "min"
              ],
              "stack": [
                "5|5",
                "3|3",
                "7|3"
              ],
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "op": 2
              },
              "vars": {
                "min": 3
              }
            },
            {
              "note": "push(2). The running min with 2 on top is min(2, previous min) = 2. Store the pair 2|2.",
              "cells": [
                "+5",
                "+3",
                "+7",
                "+2",
                "min",
                "pop",
                "min",
                "pop",
                "pop",
                "min"
              ],
              "stack": [
                "5|5",
                "3|3",
                "7|3",
                "2|2"
              ],
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "op": 3
              },
              "vars": {
                "min": 2
              }
            },
            {
              "note": "getMin() just reads the min stored on the top pair: 2. No scanning needed.",
              "stack": [
                "5|5",
                "3|3",
                "7|3",
                "2|2"
              ],
              "hl": {
                "4": "ok"
              },
              "ptrs": {
                "op": 4
              },
              "vars": {
                "min": 2
              }
            },
            {
              "note": "pop() removes 2|2. Its min goes away with it, so the old min is back for free.",
              "stack": [
                "5|5",
                "3|3",
                "7|3"
              ],
              "hl": {
                "5": "bad"
              },
              "ptrs": {
                "op": 5
              },
              "vars": {
                "min": 3
              }
            },
            {
              "note": "getMin() just reads the min stored on the top pair: 3. No scanning needed.",
              "stack": [
                "5|5",
                "3|3",
                "7|3"
              ],
              "hl": {
                "6": "ok"
              },
              "ptrs": {
                "op": 6
              },
              "vars": {
                "min": 3
              }
            },
            {
              "note": "pop() removes 7|3. Its min goes away with it, so the old min is back for free.",
              "stack": [
                "5|5",
                "3|3"
              ],
              "hl": {
                "7": "bad"
              },
              "ptrs": {
                "op": 7
              },
              "vars": {
                "min": 3
              }
            },
            {
              "note": "pop() removes 3|3. Its min goes away with it, so the old min is back for free.",
              "stack": [
                "5|5"
              ],
              "hl": {
                "8": "bad"
              },
              "ptrs": {
                "op": 8
              },
              "vars": {
                "min": 5
              }
            },
            {
              "note": "getMin() just reads the min stored on the top pair: 5. No scanning needed.",
              "stack": [
                "5|5"
              ],
              "hl": {
                "9": "ok"
              },
              "ptrs": {
                "op": 9
              },
              "vars": {
                "min": 5
              },
              "out": "getMin results: 2, 3, 5"
            }
          ]
        }
      },
      "code": "class MinStack {\n    vector<pair<int,int>> st;      // (value, min of the stack up to this value)\npublic:\n    void push(int x) {\n        int m = st.empty() ? x : min(x, st.back().second);\n        st.push_back({x, m});\n    }\n    void pop() { st.pop_back(); }\n    int top() { return st.back().first; }\n    int getMin() { return st.back().second; }\n};",
      "complexity": "Every operation is O(1) time. Space O(n), one extra int per stored value.",
      "mistakes": [
        "Keeping a single min variable. After you pop the minimum you cannot know the next smallest.",
        "Pushing to the min stack only when x is smaller. If equal values can repeat, use <= or store pairs, otherwise a pop removes the min too early.",
        "Calling getMin or top on an empty stack. LeetCode guarantees valid calls, but guard it in real code."
      ],
      "practice": [
        155,
        901
      ]
    },
    "5": {
      "name": "Two stacks as a queue / queues as a stack",
      "when": "A design question asks you to build a queue from stacks (or a stack from queues) using only the basic operations of the other structure. Also useful when you need first in, first out behaviour with a plain stack.",
      "idea": "A stack hands back the newest item first and a queue hands back the oldest. Pouring one stack into another reverses the order, which fixes the mismatch. Use an in stack for pushes and an out stack for pops. Only when the out stack is empty do you pour everything from in into out. The oldest item is then on top. Items already in out are older than anything in in, so the order stays correct. Each item moves at most once, so the cost is O(1) on average. The other direction is simpler: with one queue, after each push rotate the older items behind the new one.",
      "steps": [
        "Keep two stacks: in (for push) and out (for pop and peek).",
        "push(x): in.push(x).",
        "To pop or peek, first check if out is empty. If it is, move every item from in to out.",
        "Then pop or read the top of out. It is the oldest item.",
        "empty() is true only when both stacks are empty. For a stack built from one queue: push x, then rotate the other n - 1 items from the front to the back."
      ],
      "example": {
        "problem": "Implement a queue with two stacks. Operations: push 1, push 2, pop, peek, push 3, pop, pop. In the animation + means push. Results: 1, 2, 2, 3.",
        "walk": "Pushes only touch the in stack. The first pop finds out empty, so everything is poured over and 1 ends up on top. Notice that later pops do not pour again until out runs dry. The 3 waits in the in stack while 2 is served first, and is only poured when out is empty. That keeps the queue order.",
        "viz": {
          "kind": "array",
          "cells": [
            "+1",
            "+2",
            "pop",
            "peek",
            "+3",
            "pop",
            "pop"
          ],
          "frames": [
            {
              "note": "push(1): just push onto the in stack. This is O(1).",
              "cells": [
                "+1",
                "+2",
                "pop",
                "peek",
                "+3",
                "pop",
                "pop"
              ],
              "map": {
                "in stack": "[1]",
                "out stack": "[]"
              },
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "op": 0
              }
            },
            {
              "note": "push(2): just push onto the in stack. This is O(1).",
              "cells": [
                "+1",
                "+2",
                "pop",
                "peek",
                "+3",
                "pop",
                "pop"
              ],
              "map": {
                "in stack": "[1, 2]",
                "out stack": "[]"
              },
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "op": 1
              }
            },
            {
              "note": "The out stack is empty, so pour the in stack into it one by one. The order reverses: oldest item is now on top.",
              "cells": [
                "+1",
                "+2",
                "pop",
                "peek",
                "+3",
                "pop",
                "pop"
              ],
              "map": {
                "in stack": "[]",
                "out stack": "[2, 1]"
              },
              "hl": {
                "2": "b"
              },
              "ptrs": {
                "op": 2
              }
            },
            {
              "note": "pop(): take the top of the out stack. That is 1, the oldest item, as a queue demands.",
              "map": {
                "in stack": "[]",
                "out stack": "[2]"
              },
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "op": 2
              },
              "vars": {
                "returned": 1
              }
            },
            {
              "note": "peek(): read the top of the out stack without removing it. The front of the queue is 2.",
              "map": {
                "in stack": "[]",
                "out stack": "[2]"
              },
              "hl": {
                "3": "ok"
              },
              "ptrs": {
                "op": 3
              },
              "vars": {
                "returned": 2
              }
            },
            {
              "note": "push(3): just push onto the in stack. This is O(1).",
              "cells": [
                "+1",
                "+2",
                "pop",
                "peek",
                "+3",
                "pop",
                "pop"
              ],
              "map": {
                "in stack": "[3]",
                "out stack": "[2]"
              },
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "op": 4
              }
            },
            {
              "note": "pop(): take the top of the out stack. That is 2, the oldest item, as a queue demands.",
              "map": {
                "in stack": "[3]",
                "out stack": "[]"
              },
              "hl": {
                "5": "ok"
              },
              "ptrs": {
                "op": 5
              },
              "vars": {
                "returned": 2
              }
            },
            {
              "note": "The out stack is empty, so pour the in stack into it one by one. The order reverses: oldest item is now on top.",
              "cells": [
                "+1",
                "+2",
                "pop",
                "peek",
                "+3",
                "pop",
                "pop"
              ],
              "map": {
                "in stack": "[]",
                "out stack": "[3]"
              },
              "hl": {
                "6": "b"
              },
              "ptrs": {
                "op": 6
              }
            },
            {
              "note": "pop(): take the top of the out stack. That is 3, the oldest item, as a queue demands.",
              "map": {
                "in stack": "[]",
                "out stack": "[]"
              },
              "hl": {
                "6": "ok"
              },
              "ptrs": {
                "op": 6
              },
              "vars": {
                "returned": 3
              },
              "out": "pop/peek results: 1, 2, 2, 3"
            }
          ]
        }
      },
      "code": "class MyQueue {\n    stack<int> in, out;\n    void move() {                               // refill out only when it is empty\n        if (out.empty())\n            while (!in.empty()) { out.push(in.top()); in.pop(); }\n    }\npublic:\n    void push(int x) { in.push(x); }\n    int pop() { move(); int v = out.top(); out.pop(); return v; }\n    int peek() { move(); return out.top(); }\n    bool empty() { return in.empty() && out.empty(); }\n};",
      "complexity": "Amortised O(1) per operation: every item is pushed and popped at most twice in total. Space O(n).",
      "mistakes": [
        "Pouring in into out on every pop, even when out still has items. That breaks the order.",
        "Checking only one stack in empty(). Items can sit in either stack.",
        "Forgetting that a single pop can cost O(n) in the worst case. The O(1) is the average over many operations."
      ],
      "practice": [
        232,
        225,
        622
      ]
    },
    "6": {
      "name": "Monotonic deque",
      "when": "You need the maximum or minimum of every window of size k as it slides, or the best value inside a moving range. A heap would work but is slower than needed.",
      "idea": "A deque (double-ended queue) lets you add and remove at both ends. Keep indexes in it so that their values are decreasing from front to back. The front is always the maximum of the window. When a new value arrives, pop from the back every value that is smaller: they are older and smaller, so they can never be the maximum while the new one is in the window. Then push the new index. Also drop the front if its index has slid out of the window. Each index goes in once and out once, giving O(n) overall.",
      "steps": [
        "Make a deque of indexes and an empty result vector.",
        "For each i, if the front index is at most i - k, pop it from the front. It has left the window.",
        "While the back value is smaller than a[i], pop from the back.",
        "Push i to the back.",
        "Once i >= k - 1 the first window is complete, so push a[front] into the result."
      ],
      "example": {
        "problem": "Sliding window maximum. Input: [5, 3, 4, 1, 2, 6, 0], k = 3. Output: [5, 4, 4, 6, 6].",
        "walk": "The queue lane shows the candidates, biggest at the front. When 4 arrives it pops 3 from the back, since 3 is older and smaller. At i = 3 the front 5 has slid out of the window, so it leaves from the front. The 6 clears out everything. The answer for each window is just the front, read in O(1).",
        "viz": {
          "kind": "array",
          "cells": [
            5,
            3,
            4,
            1,
            2,
            6,
            0
          ],
          "frames": [
            {
              "note": "Push 5 onto the back of the queue.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                5
              ],
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "a"
              },
              "vars": {
                "i": 0
              }
            },
            {
              "note": "Push 3 onto the back of the queue.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                5,
                3
              ],
              "ptrs": {
                "i": 1
              },
              "hl": {
                "1": "a"
              },
              "vars": {
                "i": 1
              }
            },
            {
              "note": "Pop 3 from the back: smaller than 4 and older, they can never be the max. Push 4. Front is the max: 5.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                5,
                4
              ],
              "ptrs": {
                "i": 2
              },
              "hl": {
                "0": "ok",
                "2": "a"
              },
              "vars": {
                "max": 5
              },
              "win": [
                0,
                2
              ]
            },
            {
              "note": "Front value 5 (index 0) left the window, drop it. Push 1. Front is the max: 4.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                4,
                1
              ],
              "ptrs": {
                "i": 3
              },
              "hl": {
                "2": "ok",
                "3": "a"
              },
              "vars": {
                "max": 4
              },
              "win": [
                1,
                3
              ]
            },
            {
              "note": "Pop 1 from the back: smaller than 2 and older, they can never be the max. Push 2. Front is the max: 4.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                4,
                2
              ],
              "ptrs": {
                "i": 4
              },
              "hl": {
                "2": "ok",
                "4": "a"
              },
              "vars": {
                "max": 4
              },
              "win": [
                2,
                4
              ]
            },
            {
              "note": "Front value 4 (index 2) left the window, drop it. Pop 2 from the back: smaller than 6 and older, they can never be the max. Push 6. Front is the max: 6.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                6
              ],
              "ptrs": {
                "i": 5
              },
              "hl": {
                "5": "a"
              },
              "vars": {
                "max": 6
              },
              "win": [
                3,
                5
              ]
            },
            {
              "note": "Push 0. Front is the max: 6.",
              "cells": [
                5,
                3,
                4,
                1,
                2,
                6,
                0
              ],
              "queue": [
                6,
                0
              ],
              "ptrs": {
                "i": 6
              },
              "hl": {
                "5": "ok",
                "6": "a"
              },
              "vars": {
                "max": 6
              },
              "win": [
                4,
                6
              ],
              "out": "Answer: [5,4,4,6,6]"
            }
          ]
        }
      },
      "code": "// Maximum of every window of size k\nvector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;                                   // indexes, values decreasing\n    vector<int> res;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();   // left the window\n        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();  // weaker values\n        dq.push_back(i);\n        if (i >= k - 1) res.push_back(nums[dq.front()]);          // front is the max\n    }\n    return res;\n}",
      "complexity": "Time O(n), each index is pushed and popped at most once. Space O(k) for the deque.",
      "mistakes": [
        "Storing values instead of indexes. You then cannot tell when the front has left the window.",
        "Forgetting to drop the front when its index is out of the window, so an old maximum stays forever.",
        "Reading the result before the first full window (i < k - 1)."
      ],
      "practice": [
        239,
        739
      ]
    }
  },
  "5": {
    "0": {
      "name": "Dummy head node",
      "when": "You build or edit a list and the head itself might be removed, replaced or inserted before. Typical signs: remove all nodes with a value, merge two lists, add two numbers digit by digit.",
      "idea": "The head of a list is special: it has no node in front of it, so deleting it needs different code from deleting a middle node. A dummy node fixes that. Create a fake node, make it point to the real head, and do all your work through a prev pointer that starts on the dummy. Now every real node has a node in front of it, so one rule works for all of them. At the end the real head is simply dummy.next, even if the old head was deleted.",
      "steps": [
        "Create a dummy node and set dummy.next = head.",
        "Set prev = &dummy and curr = head.",
        "At each node decide: delete it (prev->next = curr->next) or keep it (prev = curr).",
        "Always move curr = curr->next at the end of the loop.",
        "Return dummy.next, never the old head."
      ],
      "example": {
        "problem": "Remove all nodes with value 6 from 6 -> 6 -> 1 -> 6 -> 2. Output: 1 -> 2. Note that the head itself is deleted.",
        "walk": "Watch prev. It only moves when we keep a node, and it never moves when we delete. The two 6s at the front are removed by exactly the same line as the 6 in the middle, because D stands in front of the head. The answer is read from D.next.",
        "viz": {
          "kind": "linked",
          "cells": [
            "D",
            6,
            6,
            1,
            6,
            2
          ],
          "next": [
            1,
            2,
            3,
            4,
            5,
            -1
          ],
          "frames": [
            {
              "note": "D is a dummy node placed in front of the real head. prev starts on D, curr on the head. We remove every 6.",
              "ptrs": {
                "prev": 0,
                "curr": 1
              },
              "hl": {
                "0": "b",
                "1": "a"
              },
              "next": [
                1,
                2,
                3,
                4,
                5,
                -1
              ]
            },
            {
              "note": "curr is 6, so unlink it: prev.next now skips to curr.next. prev stays put. Even the head can go: D.next just jumps ahead, no special case.",
              "next": [
                2,
                2,
                3,
                4,
                5,
                -1
              ],
              "ptrs": {
                "prev": 0,
                "curr": 1
              },
              "hl": {
                "0": "b",
                "1": "bad"
              },
              "ehl": {
                "0": "ok"
              }
            },
            {
              "note": "curr is 6, so unlink it: prev.next now skips to curr.next. prev stays put. Even the head can go: D.next just jumps ahead, no special case.",
              "next": [
                3,
                2,
                3,
                4,
                5,
                -1
              ],
              "ptrs": {
                "prev": 0,
                "curr": 2
              },
              "hl": {
                "0": "b",
                "1": "dim",
                "2": "bad"
              },
              "ehl": {
                "0": "ok"
              }
            },
            {
              "note": "curr is 1, which we keep. prev moves up to curr.",
              "ptrs": {
                "prev": 0,
                "curr": 3
              },
              "hl": {
                "0": "b",
                "1": "dim",
                "2": "dim",
                "3": "ok"
              }
            },
            {
              "note": "curr is 6, so unlink it: prev.next now skips to curr.next. prev stays put.",
              "next": [
                3,
                2,
                3,
                5,
                5,
                -1
              ],
              "ptrs": {
                "prev": 3,
                "curr": 4
              },
              "hl": {
                "0": "b",
                "1": "dim",
                "2": "dim",
                "4": "bad"
              },
              "ehl": {
                "3": "ok"
              }
            },
            {
              "note": "curr is 2, which we keep. prev moves up to curr.",
              "ptrs": {
                "prev": 3,
                "curr": 5
              },
              "hl": {
                "0": "b",
                "1": "dim",
                "2": "dim",
                "4": "dim",
                "5": "ok"
              }
            },
            {
              "note": "curr fell off the end. The answer is D.next, which is the list 1 -> 2.",
              "ptrs": {
                "prev": 5,
                "curr": -1
              },
              "hl": {
                "0": "b",
                "1": "dim",
                "2": "dim",
                "3": "ok",
                "4": "dim",
                "5": "ok"
              },
              "out": "Answer: 1 -> 2",
              "next": [
                3,
                2,
                3,
                5,
                5,
                -1
              ]
            }
          ]
        }
      },
      "code": "ListNode* removeElements(ListNode* head, int val) {\n    ListNode dummy(0);           // fake node in front of the head\n    dummy.next = head;\n    ListNode* prev = &dummy;\n    ListNode* curr = head;\n    while (curr) {\n        if (curr->val == val) prev->next = curr->next;  // unlink curr\n        else prev = curr;                               // keep it, prev follows\n        curr = curr->next;\n    }\n    return dummy.next;           // real head, even if the old one was removed\n}",
      "complexity": "Time O(n), one pass. Space O(1), the dummy is a single extra node.",
      "mistakes": [
        "Returning head instead of dummy.next. If the old head was deleted you return a removed node.",
        "Moving prev after a deletion. prev must stay still so that the next node is checked against the same prev.",
        "Forgetting dummy.next = head, so the dummy points to nothing and the whole list is lost."
      ],
      "practice": [
        203,
        21,
        2,
        83
      ]
    },
    "1": {
      "name": "Fast and slow pointers",
      "when": "You are asked whether a linked list has a cycle, where the cycle starts, or where the middle is. You cannot use extra memory, or the list has no end to count to.",
      "idea": "Run two pointers down the list. slow takes one step at a time, fast takes two. If the list ends, there is no cycle. If there is a cycle, fast laps around inside it and eventually lands on slow, like a faster runner catching a slower one on a track. For the cycle start there is a neat fact: after they meet, a pointer from the head and a pointer from the meeting point, each moving one step at a time, meet exactly at the cycle start. The same two pointers also find the middle: when fast reaches the end, slow is halfway.",
      "steps": [
        "Set slow = fast = head.",
        "While fast and fast->next exist: move slow one step and fast two steps.",
        "If slow == fast, a cycle exists. If fast hits null, there is none.",
        "To find the start, set p = head and move p and slow one step at a time until they are equal.",
        "That shared node is the start of the cycle."
      ],
      "example": {
        "problem": "Find the cycle start. The list is 4 -> 8 -> 2 -> 9 -> 5 -> 7 and the tail (7) points back to the node 2. Output: the node with value 2.",
        "walk": "First phase: fast gains one node on slow each round, so inside the cycle it must catch slow. They meet on node 5. Second phase: p from the head and slow from the meeting node both walk one step at a time. After two steps they stand on the same node, the one with value 2, which is the cycle start.",
        "viz": {
          "kind": "linked",
          "cells": [
            4,
            8,
            2,
            9,
            5,
            7
          ],
          "next": [
            1,
            2,
            3,
            4,
            5,
            2
          ],
          "frames": [
            {
              "note": "The tail points back to node 2, so there is a cycle. slow and fast both start at the head.",
              "ptrs": {
                "slow": 0,
                "fast": 0
              },
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "slow moves 1 step, fast moves 2 steps. Not on the same node yet.",
              "ptrs": {
                "slow": 1,
                "fast": 2
              },
              "hl": {
                "1": "a",
                "2": "b"
              }
            },
            {
              "note": "slow moves 1 step, fast moves 2 steps. Not on the same node yet.",
              "ptrs": {
                "slow": 2,
                "fast": 4
              },
              "hl": {
                "2": "a",
                "4": "b"
              }
            },
            {
              "note": "slow moves 1 step, fast moves 2 steps. Not on the same node yet.",
              "ptrs": {
                "slow": 3,
                "fast": 2
              },
              "hl": {
                "2": "b",
                "3": "a"
              }
            },
            {
              "note": "slow moves 1, fast moves 2. They land on the same node (5), so a cycle exists.",
              "ptrs": {
                "slow": 4,
                "fast": 4
              },
              "hl": {
                "4": "ok"
              }
            },
            {
              "note": "Now find where the cycle starts. Put a new pointer p on the head and keep slow where they met.",
              "ptrs": {
                "p": 0,
                "slow": 4
              },
              "hl": {
                "0": "a",
                "4": "b"
              }
            },
            {
              "note": "Move p and slow one step each.",
              "ptrs": {
                "p": 1,
                "slow": 5
              },
              "hl": {
                "1": "a",
                "5": "b"
              }
            },
            {
              "note": "Move p and slow one step each. They are on the same node.",
              "ptrs": {
                "p": 2,
                "slow": 2
              },
              "hl": {
                "2": "ok"
              }
            },
            {
              "note": "They meet at node 2. That node is where the cycle begins.",
              "ptrs": {
                "p": 2,
                "slow": 2
              },
              "hl": {
                "2": "ok"
              },
              "out": "Answer: cycle starts at node 2"
            }
          ]
        }
      },
      "code": "ListNode* detectCycle(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;            // 1 step\n        fast = fast->next->next;      // 2 steps\n        if (slow == fast) {           // phase 1: met inside the cycle\n            ListNode* p = head;\n            while (p != slow) {       // phase 2: walk together to the start\n                p = p->next;\n                slow = slow->next;\n            }\n            return p;\n        }\n    }\n    return nullptr;                   // fast fell off the end: no cycle\n}",
      "complexity": "Time O(n), because fast meets slow within one lap of the cycle. Space O(1).",
      "mistakes": [
        "Checking fast->next->next without first checking fast->next. That dereferences a null pointer on odd-length lists.",
        "Comparing values instead of node addresses. Two different nodes can hold the same value.",
        "Starting phase 2 with both pointers on the head. One must start at the meeting node."
      ],
      "practice": [
        141,
        142,
        876,
        160
      ]
    },
    "2": {
      "name": "In-place reversal",
      "when": "You have to reverse a whole linked list, a sub-range of it, or every group of k nodes. It also shows up inside palindrome-list and reorder-list, where you reverse one half.",
      "idea": "Walk down the list once and flip every arrow to point backwards. You need three pointers: prev (the part you have already reversed), curr (the node you are working on) and nxt (a saved copy of curr's next node, so that flipping the arrow does not cut you off from the rest of the list). When curr falls off the end, prev is the new head.",
      "steps": [
        "Start with prev = nullptr and curr = head.",
        "Save nxt = curr->next before you change anything, otherwise the rest of the list is lost.",
        "Flip the arrow: curr->next = prev.",
        "Advance both pointers: prev = curr, then curr = nxt.",
        "Repeat until curr is nullptr, then return prev as the new head."
      ],
      "example": {
        "problem": "Reverse the list 1 -> 2 -> 3 -> 4 -> null. Expected result: 4 -> 3 -> 2 -> 1 -> null.",
        "walk": "Each trip around the loop has three moments: save nxt, flip the arrow, advance the pointers. The nodes never move on screen, only their arrows change direction. After four flips every arrow points left and prev sits on node 4, which is the new head. The old head (node 1) now points to null because prev started as null.",
        "viz": {
          "kind": "linked",
          "cells": [
            1,
            2,
            3,
            4
          ],
          "next": [
            1,
            2,
            3,
            -1
          ],
          "frames": [
            {
              "note": "prev starts as null and curr starts at the head. The arrows currently point right.",
              "ptrs": {
                "prev": -1,
                "curr": 0
              },
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "Save curr.next in nxt (node 2) so we do not lose the rest of the list.",
              "ptrs": {
                "prev": -1,
                "curr": 0,
                "nxt": 1
              },
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "Flip the arrow: node 1 now points back to null.",
              "next": [
                -1,
                2,
                3,
                -1
              ],
              "ptrs": {
                "prev": -1,
                "curr": 0,
                "nxt": 1
              },
              "hl": {
                "0": "ok"
              },
              "ehl": {
                "0": "ok"
              }
            },
            {
              "note": "Advance: prev moves to curr, curr moves to nxt.",
              "ptrs": {
                "prev": 0,
                "curr": 1
              },
              "hl": {
                "0": "ok",
                "1": "a"
              }
            },
            {
              "note": "Save curr.next in nxt (node 3) so we do not lose the rest of the list.",
              "ptrs": {
                "prev": 0,
                "curr": 1,
                "nxt": 2
              },
              "hl": {
                "1": "a"
              }
            },
            {
              "note": "Flip the arrow: node 2 now points back to node 1.",
              "next": [
                -1,
                0,
                3,
                -1
              ],
              "ptrs": {
                "prev": 0,
                "curr": 1,
                "nxt": 2
              },
              "hl": {
                "1": "ok"
              },
              "ehl": {
                "1": "ok"
              }
            },
            {
              "note": "Advance: prev moves to curr, curr moves to nxt.",
              "ptrs": {
                "prev": 1,
                "curr": 2
              },
              "hl": {
                "1": "ok",
                "2": "a"
              }
            },
            {
              "note": "Save curr.next in nxt (node 4) so we do not lose the rest of the list.",
              "ptrs": {
                "prev": 1,
                "curr": 2,
                "nxt": 3
              },
              "hl": {
                "2": "a"
              }
            },
            {
              "note": "Flip the arrow: node 3 now points back to node 2.",
              "next": [
                -1,
                0,
                1,
                -1
              ],
              "ptrs": {
                "prev": 1,
                "curr": 2,
                "nxt": 3
              },
              "hl": {
                "2": "ok"
              },
              "ehl": {
                "2": "ok"
              }
            },
            {
              "note": "Advance: prev moves to curr, curr moves to nxt.",
              "ptrs": {
                "prev": 2,
                "curr": 3
              },
              "hl": {
                "2": "ok",
                "3": "a"
              }
            },
            {
              "note": "Save curr.next in nxt (node null) so we do not lose the rest of the list.",
              "ptrs": {
                "prev": 2,
                "curr": 3,
                "nxt": -1
              },
              "hl": {
                "3": "a"
              }
            },
            {
              "note": "Flip the arrow: node 4 now points back to node 3.",
              "next": [
                -1,
                0,
                1,
                2
              ],
              "ptrs": {
                "prev": 2,
                "curr": 3,
                "nxt": -1
              },
              "hl": {
                "3": "ok"
              },
              "ehl": {
                "3": "ok"
              }
            },
            {
              "note": "curr fell off the end. prev is the new head: 4 -> 3 -> 2 -> 1 -> null.",
              "ptrs": {
                "prev": 3,
                "curr": -1
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok"
              },
              "out": "New head = node 4"
            }
          ]
        }
      },
      "code": "ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* nxt = curr->next;   // 1. remember the rest of the list\n        curr->next = prev;            // 2. flip the arrow\n        prev = curr;                  // 3. advance prev ...\n        curr = nxt;                   //    ... and curr\n    }\n    return prev;                      // prev is the new head\n}",
      "complexity": "Time O(n) with a single pass. Space O(1), only three pointers.",
      "mistakes": [
        "Flipping curr->next before saving it in nxt, which loses the rest of the list.",
        "Returning curr instead of prev at the end. By then curr is nullptr.",
        "Forgetting to handle an empty list or a list with one node. The loop above handles both, but hand-written versions often crash on head == nullptr."
      ],
      "practice": [
        206,
        92,
        25,
        234
      ]
    },
    "3": {
      "name": "Gap pointers",
      "when": "The problem counts from the END of a singly linked list (nth from the end), but you can only walk forward, and you want one pass without first computing the length.",
      "idea": "You cannot walk backwards, but you can keep two pointers a fixed distance apart. Move fast n steps ahead first. Now fast is n nodes in front of slow. Move both one step at a time. When fast reaches the last node, slow is exactly n nodes behind it, which means slow is standing just before the node we want. Starting both on a dummy node makes this work even when the node to delete is the head.",
      "steps": [
        "Add a dummy node in front of the head and put slow and fast on it.",
        "Move fast forward n steps to create the gap.",
        "While fast->next exists, move both fast and slow one step.",
        "Now slow->next is the node to delete. Set slow->next = slow->next->next.",
        "Return dummy.next."
      ],
      "example": {
        "problem": "Remove the 2nd node from the end of 1 -> 2 -> 3 -> 4 -> 5 -> 6. Output: 1 -> 2 -> 3 -> 4 -> 6.",
        "walk": "The gap is made once, in the first two frames, and then never changes. That is the whole trick: when fast has nothing after it, slow is two nodes behind, so it stops on node 4, the node BEFORE the one we delete. Standing on the node before is what lets us rewire the arrow.",
        "viz": {
          "kind": "linked",
          "cells": [
            "D",
            1,
            2,
            3,
            4,
            5,
            6
          ],
          "next": [
            1,
            2,
            3,
            4,
            5,
            6,
            -1
          ],
          "frames": [
            {
              "note": "Remove the 2nd node from the end. D is a dummy in front of the head. slow and fast both start on D.",
              "ptrs": {
                "slow": 0,
                "fast": 0
              },
              "hl": {
                "0": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Open the gap: fast takes step 1 of 2 on its own. slow waits.",
              "ptrs": {
                "slow": 0,
                "fast": 1
              },
              "hl": {
                "0": "b",
                "1": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Open the gap: fast takes step 2 of 2 on its own. slow waits.",
              "ptrs": {
                "slow": 0,
                "fast": 2
              },
              "hl": {
                "0": "b",
                "2": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Move both one step. The gap between them stays 2.",
              "ptrs": {
                "slow": 1,
                "fast": 3
              },
              "hl": {
                "1": "b",
                "3": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Move both one step. The gap between them stays 2.",
              "ptrs": {
                "slow": 2,
                "fast": 4
              },
              "hl": {
                "2": "b",
                "4": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Move both one step. The gap between them stays 2.",
              "ptrs": {
                "slow": 3,
                "fast": 5
              },
              "hl": {
                "3": "b",
                "5": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Move both one step. The gap between them stays 2.",
              "ptrs": {
                "slow": 4,
                "fast": 6
              },
              "hl": {
                "4": "b",
                "6": "a"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "fast is on the last node. slow is just before the target (5). Set slow.next = slow.next.next.",
              "ptrs": {
                "slow": 4,
                "fast": 6
              },
              "hl": {
                "4": "ok",
                "5": "bad"
              },
              "vars": {
                "n": 2
              }
            },
            {
              "note": "Node 5 is unlinked. The answer is D.next: 1 -> 2 -> 3 -> 4 -> 6.",
              "next": [
                1,
                2,
                3,
                4,
                6,
                6,
                -1
              ],
              "ptrs": {
                "slow": 4,
                "fast": 6
              },
              "hl": {
                "0": "b",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "dim",
                "6": "ok"
              },
              "ehl": {
                "4": "ok"
              },
              "out": "Answer: 1 -> 2 -> 3 -> 4 -> 6",
              "vars": {
                "n": 2
              }
            }
          ]
        }
      },
      "code": "ListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0);\n    dummy.next = head;\n    ListNode *fast = &dummy, *slow = &dummy;\n    for (int i = 0; i < n; i++) fast = fast->next;   // open a gap of n nodes\n    while (fast->next) {                             // slide the gap to the end\n        fast = fast->next;\n        slow = slow->next;\n    }\n    slow->next = slow->next->next;                   // slow is just before the target\n    return dummy.next;\n}",
      "complexity": "Time O(n) in one pass. Space O(1).",
      "mistakes": [
        "Starting on the head instead of a dummy. Removing the first node (n equals the length) then breaks.",
        "Off by one in the gap: stopping when fast is null leaves slow ON the target instead of before it.",
        "Forgetting that n is guaranteed valid. If it might not be, check fast for null while opening the gap."
      ],
      "practice": [
        19,
        876,
        141
      ]
    },
    "4": {
      "name": "Merge two sorted lists",
      "when": "You have two lists that are already sorted and need one sorted list. It also appears as a building block inside sort list (merge sort) and merge k sorted lists.",
      "idea": "Think of zipping two sorted lines of people into one. Look at the front of each list and take the smaller one. A tail pointer marks the end of the merged list so far. Hook the smaller node onto tail, move that list forward, and move tail onto the new node. When one list runs out, the other list is already sorted, so attach it whole. A dummy node gives tail somewhere to start, so the first node needs no special code.",
      "steps": [
        "Make a dummy node and set tail = &dummy.",
        "While both a and b exist, compare their values.",
        "Hook the smaller node: tail->next = it. Advance that list, then advance tail.",
        "When one list is empty, set tail->next to the other list.",
        "Return dummy.next."
      ],
      "example": {
        "problem": "Merge the sorted lists 1 -> 4 -> 6 and 2 -> 3 -> 7. Output: 1 -> 2 -> 3 -> 4 -> 6 -> 7.",
        "walk": "The nodes stay where they are. Only arrows change: each time we pick the smaller front node, tail's arrow jumps to it. Notice the last step: list a is empty after 6, and the leftover 7 is attached in one move, because a leftover tail of a sorted list is already in order.",
        "viz": {
          "kind": "linked",
          "cells": [
            "D",
            1,
            4,
            6,
            2,
            3,
            7
          ],
          "next": [
            -1,
            2,
            3,
            -1,
            5,
            6,
            -1
          ],
          "frames": [
            {
              "note": "Two sorted lists: 1 -> 4 -> 6 and 2 -> 3 -> 7. D is a dummy, tail starts on D. a and b point to the two heads.",
              "ptrs": {
                "a": 1,
                "b": 4,
                "tail": 0
              },
              "hl": {
                "0": "b",
                "1": "a",
                "4": "a"
              },
              "next": [
                -1,
                2,
                3,
                -1,
                5,
                6,
                -1
              ]
            },
            {
              "note": "Compare 1 with 2. 1 is smaller, so tail.next = 1 and that list steps forward.",
              "next": [
                1,
                2,
                3,
                -1,
                5,
                6,
                -1
              ],
              "ptrs": {
                "a": 2,
                "b": 4,
                "tail": 1
              },
              "hl": {
                "1": "ok"
              },
              "ehl": {
                "0": "ok"
              }
            },
            {
              "note": "Compare 2 with 4. 2 is smaller, so tail.next = 2 and that list steps forward.",
              "next": [
                1,
                4,
                3,
                -1,
                5,
                6,
                -1
              ],
              "ptrs": {
                "a": 2,
                "b": 5,
                "tail": 4
              },
              "hl": {
                "4": "ok"
              },
              "ehl": {
                "1": "ok"
              }
            },
            {
              "note": "Compare 3 with 4. 3 is smaller, so tail.next = 3 and that list steps forward.",
              "next": [
                1,
                4,
                3,
                -1,
                5,
                6,
                -1
              ],
              "ptrs": {
                "a": 2,
                "b": 6,
                "tail": 5
              },
              "hl": {
                "5": "ok"
              },
              "ehl": {
                "4": "ok"
              }
            },
            {
              "note": "Compare 4 with 7. 4 is smaller, so tail.next = 4 and that list steps forward.",
              "next": [
                1,
                4,
                3,
                -1,
                5,
                2,
                -1
              ],
              "ptrs": {
                "a": 3,
                "b": 6,
                "tail": 2
              },
              "hl": {
                "2": "ok"
              },
              "ehl": {
                "5": "ok"
              }
            },
            {
              "note": "Compare 6 with 7. 6 is smaller, so tail.next = 6 and that list steps forward.",
              "next": [
                1,
                4,
                3,
                -1,
                5,
                2,
                -1
              ],
              "ptrs": {
                "a": -1,
                "b": 6,
                "tail": 3
              },
              "hl": {
                "3": "ok"
              },
              "ehl": {
                "2": "ok"
              }
            },
            {
              "note": "List a ran out. Attach the rest of b in one move: tail.next = b. No need to copy node by node.",
              "next": [
                1,
                4,
                3,
                6,
                5,
                2,
                -1
              ],
              "ptrs": {
                "a": -1,
                "b": 6,
                "tail": 3
              },
              "hl": {
                "3": "b",
                "6": "ok"
              },
              "ehl": {
                "3": "ok"
              }
            },
            {
              "note": "The merged list is D.next onward: 1 -> 2 -> 3 -> 4 -> 6 -> 7. We only rewired arrows, no new nodes.",
              "next": [
                1,
                4,
                3,
                6,
                5,
                2,
                -1
              ],
              "hl": {
                "0": "b",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok"
              },
              "out": "Answer: 1 -> 2 -> 3 -> 4 -> 6 -> 7"
            }
          ]
        }
      },
      "code": "ListNode* mergeTwoLists(ListNode* a, ListNode* b) {\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while (a && b) {\n        if (a->val <= b->val) { tail->next = a; a = a->next; }\n        else                  { tail->next = b; b = b->next; }\n        tail = tail->next;\n    }\n    tail->next = a ? a : b;      // attach whatever is left\n    return dummy.next;\n}",
      "complexity": "Time O(m + n), each node is visited once. Space O(1), nodes are reused.",
      "mistakes": [
        "Forgetting to attach the leftover list, which silently drops the rest of the nodes.",
        "Using < instead of <= and then thinking equal values are lost. Either works, but the comparison must be consistent.",
        "Advancing tail before setting tail->next, so the new node is never linked."
      ],
      "practice": [
        21,
        148,
        83
      ]
    },
    "5": {
      "name": "Split, reverse, merge",
      "when": "The new order mixes the front and the back of a list (reorder list), or you must compare the list with its own reverse (palindrome list) but cannot use extra memory.",
      "idea": "These problems are three small tricks glued together. First find the middle with fast and slow pointers. Then cut the list in two and reverse the second half in place, so its last node comes first. Now you have two lists that you can walk at the same time: one from the front, one from the back. For a palindrome check, compare them value by value. For reorder list, weave them together by alternating one node from each.",
      "steps": [
        "Find the middle: slow and fast pointers. Stop when fast->next->next is null.",
        "Cut the list: second = slow->next, then slow->next = nullptr.",
        "Reverse the second half with the prev/curr/next loop.",
        "Walk both halves together: weave them for reorder list, or compare values for a palindrome.",
        "The first half is never longer than the second by more than one node, so loop while the second half has nodes."
      ],
      "example": {
        "problem": "Reorder 1 -> 2 -> 3 -> 4 -> 5 -> 6 so that it reads 1 -> 6 -> 2 -> 5 -> 3 -> 4. Do it in place, no new nodes.",
        "walk": "Follow the four phases: middle (slow stops on 3), cut, reverse (6 -> 5 -> 4), weave. In the weave, each round hooks one node from the back half in after one node from the front half. Because the back half was reversed, the nodes arrive in exactly the order we need.",
        "viz": {
          "kind": "linked",
          "cells": [
            1,
            2,
            3,
            4,
            5,
            6
          ],
          "next": [
            1,
            2,
            3,
            4,
            5,
            -1
          ],
          "frames": [
            {
              "note": "Reorder 1 -> 2 -> 3 -> 4 -> 5 -> 6 into 1 -> 6 -> 2 -> 5 -> 3 -> 4. Step 1: find the middle with slow and fast.",
              "ptrs": {
                "slow": 0,
                "fast": 0
              },
              "hl": {
                "0": "a"
              },
              "next": [
                1,
                2,
                3,
                4,
                5,
                -1
              ]
            },
            {
              "note": "slow moves 1, fast moves 2.",
              "ptrs": {
                "slow": 1,
                "fast": 2
              },
              "hl": {
                "1": "a",
                "2": "b"
              }
            },
            {
              "note": "slow moves 1, fast moves 2.",
              "ptrs": {
                "slow": 2,
                "fast": 4
              },
              "hl": {
                "2": "a",
                "4": "b"
              }
            },
            {
              "note": "fast cannot jump again, so slow (node 3) ends the first half. Step 2: cut the list after slow. The second half starts at 4.",
              "next": [
                1,
                2,
                -1,
                4,
                5,
                -1
              ],
              "ptrs": {
                "slow": 2,
                "h2": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "b",
                "4": "b",
                "5": "b"
              }
            },
            {
              "note": "Reverse the second half: flip the arrow of node 4.",
              "next": [
                1,
                2,
                -1,
                -1,
                5,
                -1
              ],
              "ptrs": {
                "prev": 3,
                "curr": 4
              },
              "hl": {
                "3": "a",
                "4": "b",
                "5": "b"
              }
            },
            {
              "note": "Reverse the second half: flip the arrow of node 5.",
              "next": [
                1,
                2,
                -1,
                -1,
                3,
                -1
              ],
              "ptrs": {
                "prev": 4,
                "curr": 5
              },
              "hl": {
                "3": "b",
                "4": "a",
                "5": "b"
              }
            },
            {
              "note": "Step 3: the second half is reversed in place (4 -> 5 -> 6 became 6 -> 5 -> 4). Its head is now node 6.",
              "next": [
                1,
                2,
                -1,
                -1,
                3,
                4
              ],
              "ptrs": {
                "h1": 0,
                "h2": 5
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "b",
                "4": "b",
                "5": "b"
              }
            },
            {
              "note": "Step 4: weave. 1 points to 6, then 6 points back to 2.",
              "next": [
                5,
                2,
                -1,
                -1,
                3,
                1
              ],
              "ptrs": {
                "a": 0,
                "b": 5
              },
              "hl": {
                "0": "a",
                "5": "b"
              },
              "ehl": {
                "0": "ok",
                "5": "ok"
              }
            },
            {
              "note": "Step 4: weave. 2 points to 5, then 5 points back to 3.",
              "next": [
                5,
                4,
                -1,
                -1,
                2,
                1
              ],
              "ptrs": {
                "a": 1,
                "b": 4
              },
              "hl": {
                "1": "a",
                "4": "b"
              },
              "ehl": {
                "1": "ok",
                "4": "ok"
              }
            },
            {
              "note": "Last weave: 3 points to 4, and 4 ends the list. The list is now 1 -> 6 -> 2 -> 5 -> 3 -> 4.",
              "next": [
                5,
                4,
                3,
                -1,
                2,
                1
              ],
              "ptrs": {
                "a": 2,
                "b": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "ehl": {
                "2": "ok"
              },
              "out": "Answer: 1 -> 6 -> 2 -> 5 -> 3 -> 4"
            }
          ]
        }
      },
      "code": "void reorderList(ListNode* head) {\n    if (!head || !head->next) return;\n    // 1. find the middle\n    ListNode *slow = head, *fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    // 2. cut after the middle\n    ListNode* second = slow->next;\n    slow->next = nullptr;\n    // 3. reverse the second half\n    ListNode* prev = nullptr;\n    while (second) {\n        ListNode* nxt = second->next;\n        second->next = prev;\n        prev = second;\n        second = nxt;\n    }\n    // 4. weave: one node from each half\n    ListNode *l1 = head, *l2 = prev;\n    while (l2) {\n        ListNode *n1 = l1->next, *n2 = l2->next;\n        l1->next = l2;\n        l2->next = n1;\n        l1 = n1;\n        l2 = n2;\n    }\n}",
      "complexity": "Time O(n), three passes. Space O(1), everything is done by rewiring arrows.",
      "mistakes": [
        "Forgetting to cut the list (slow->next = nullptr). The first half then still points into the second half and creates a cycle after weaving.",
        "Stopping the middle search at the wrong place. For an even length, slow must end on the LAST node of the first half.",
        "Looping while l1 instead of while l2 in the weave. The second half is the shorter or equal one, so it decides when to stop."
      ],
      "practice": [
        143,
        234,
        148,
        24
      ]
    },
    "6": {
      "name": "Hashmap or interleaving",
      "when": "You must make a deep copy of a list whose nodes have an extra pointer (random) to some other node. Copying node by node does not work because random may point to a node that is not copied yet.",
      "idea": "The hard part is that a copied node needs to point at the COPY of another node. One way is a hashmap from each original node to its copy. The O(1) space way is interleaving. Put each copy right after its original (7, 7', 13, 13' ...). Then the copy of any node x is simply x->next. So copy->random = original->random->next. Finally pull the two lists apart again, restoring the original.",
      "steps": [
        "Pass 1: for each original node p, create a copy and insert it after p (p -> p' -> old next).",
        "Pass 2: for each original p with a random pointer, set p->next->random = p->random->next.",
        "Pass 3: unweave. Set p->next to the next original and copy->next to the next copy.",
        "Return the head of the copy list, which is head->next saved before pass 3.",
        "Alternative: one pass with unordered_map<Node*, Node*> from original to copy, then a second pass to fill in next and random."
      ],
      "example": {
        "problem": "Deep copy a 3-node list 7 -> 13 -> 11 whose random pointers are 7 to 11, 13 to 7, 11 to 13. Output: a new list 7' -> 13' -> 11' with the same random links, sharing no nodes with the original.",
        "walk": "Look at pass 1: after interleaving, every copy sits directly behind its original. That is what makes pass 2 a one-liner, because original.random.next is the copy of the random target. The vars chips show each copy's random pointer being filled in. Pass 3 splits the list in two again.",
        "viz": {
          "kind": "linked",
          "cells": [
            7,
            13,
            11,
            "7'",
            "13'",
            "11'"
          ],
          "next": [
            1,
            2,
            -1,
            -1,
            -1,
            -1
          ],
          "frames": [
            {
              "note": "Original list 7 -> 13 -> 11. Random pointers: 7 to 11, 13 to 7, 11 to 13. The three faded nodes are the copies we are about to make.",
              "next": [
                1,
                2,
                -1,
                -1,
                -1,
                -1
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "dim",
                "4": "dim",
                "5": "dim"
              }
            },
            {
              "note": "Pass 1: make a copy 7' and slot it right after 7.",
              "next": [
                3,
                2,
                -1,
                1,
                -1,
                -1
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "b",
                "4": "dim",
                "5": "dim"
              },
              "ehl": {
                "0": "ok"
              }
            },
            {
              "note": "Pass 1: make a copy 13' and slot it right after 13.",
              "next": [
                3,
                4,
                -1,
                1,
                2,
                -1
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "b",
                "4": "b",
                "5": "dim"
              },
              "ehl": {
                "1": "ok"
              }
            },
            {
              "note": "Pass 1: make a copy 11' and slot it right after 11.",
              "next": [
                3,
                4,
                5,
                1,
                2,
                -1
              ],
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "b",
                "4": "b",
                "5": "b"
              },
              "ehl": {
                "2": "ok"
              }
            },
            {
              "note": "Pass 2: 7 has random 11, so 7'.random = 11.next = 11'. The copy sits right next to its original.",
              "next": [
                3,
                4,
                5,
                1,
                2,
                -1
              ],
              "hl": {
                "0": "a",
                "3": "b",
                "5": "ok"
              },
              "vars": {
                "7'.random": "11'"
              }
            },
            {
              "note": "Pass 2: 13 has random 7, so 13'.random = 7.next = 7'. The copy sits right next to its original.",
              "next": [
                3,
                4,
                5,
                1,
                2,
                -1
              ],
              "hl": {
                "1": "a",
                "3": "ok",
                "4": "b"
              },
              "vars": {
                "7'.random": "11'",
                "13'.random": "7'"
              }
            },
            {
              "note": "Pass 2: 11 has random 13, so 11'.random = 13.next = 13'. The copy sits right next to its original.",
              "next": [
                3,
                4,
                5,
                1,
                2,
                -1
              ],
              "hl": {
                "2": "a",
                "4": "ok",
                "5": "b"
              },
              "vars": {
                "7'.random": "11'",
                "13'.random": "7'",
                "11'.random": "13'"
              }
            },
            {
              "note": "Pass 3: unweave. 7 points to the next original and 7' points to the next copy.",
              "next": [
                1,
                4,
                5,
                4,
                2,
                -1
              ],
              "hl": {
                "0": "a",
                "3": "b"
              },
              "vars": {
                "7'.random": "11'",
                "13'.random": "7'",
                "11'.random": "13'"
              }
            },
            {
              "note": "Pass 3: unweave. 13 points to the next original and 13' points to the next copy.",
              "next": [
                1,
                2,
                5,
                4,
                5,
                -1
              ],
              "hl": {
                "1": "a",
                "4": "b"
              },
              "vars": {
                "7'.random": "11'",
                "13'.random": "7'",
                "11'.random": "13'"
              }
            },
            {
              "note": "Pass 3: both lists end here. The originals are untouched and the copy list 7' -> 13' -> 11' is separate.",
              "next": [
                1,
                2,
                -1,
                4,
                5,
                -1
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "7'.random": "11'",
                "13'.random": "7'",
                "11'.random": "13'"
              },
              "out": "Answer: copy list 7' -> 13' -> 11'"
            }
          ]
        }
      },
      "code": "struct Node {\n    int val;\n    Node *next, *random;\n    Node(int x) : val(x), next(nullptr), random(nullptr) {}\n};\n\nNode* copyRandomList(Node* head) {\n    if (!head) return nullptr;\n    // pass 1: put each copy right after its original\n    for (Node* p = head; p; p = p->next->next) {\n        Node* c = new Node(p->val);\n        c->next = p->next;\n        p->next = c;\n    }\n    // pass 2: copy's random is the node right after original's random\n    for (Node* p = head; p; p = p->next->next)\n        if (p->random) p->next->random = p->random->next;\n    // pass 3: unweave the two lists\n    Node* copyHead = head->next;\n    for (Node* p = head; p; p = p->next) {\n        Node* c = p->next;\n        p->next = c->next;\n        c->next = c->next ? c->next->next : nullptr;\n    }\n    return copyHead;\n}",
      "complexity": "Time O(n), three passes. Space O(1) extra (the hashmap version is O(n)).",
      "mistakes": [
        "Setting random pointers in the same pass that creates copies. The target of random may not be copied yet.",
        "Skipping the unweave step, or doing it wrong, so the original list is left damaged.",
        "Dereferencing p->random when it is null in pass 2. Always check for null first."
      ],
      "practice": [
        138,
        148,
        146
      ]
    },
    "7": {
      "name": "Doubly linked list + hashmap",
      "when": "You must design a structure where lookup, insert, delete and 'move to front' are all O(1). The classic case is an LRU cache: keep the most recently used items and evict the least recently used when full.",
      "idea": "A hashmap alone finds a key in O(1) but knows nothing about order. A linked list alone keeps order but needs O(n) to find a key. Combine them. The list keeps items from most recently used (front) to least recently used (back). The map stores, for each key, a direct pointer to its node in the list. Because the list is doubly linked, a node can be removed from the middle in O(1) and pushed to the front. Evicting is just removing the back node.",
      "steps": [
        "Keep a doubly linked list of (key, value) pairs, most recent at the front.",
        "Keep a hashmap from key to the node (or list iterator) in that list.",
        "get(key): if it is missing return -1. Otherwise move its node to the front and return the value.",
        "put(key, value): if the key exists, update it and move it to the front.",
        "Otherwise, if the cache is full, remove the back node and erase its key from the map. Then add the new node at the front and store it in the map."
      ],
      "example": {
        "problem": "LRU cache with capacity 3. Run put(1,10), put(2,20), put(3,30), get(1), put(4,40), get(2), get(3). Results: get(1) is 10, get(2) is -1 because key 2 was evicted, get(3) is 30.",
        "walk": "The row of cells is the list, front on the left. get(1) pulls key 1 to the front, which leaves key 2 at the back. When put(4,40) arrives the cache is full, so the back node (2:20) is evicted and key 2 vanishes from the map. That is why get(2) later returns -1.",
        "viz": {
          "kind": "array",
          "cells": [
            null,
            null,
            null
          ],
          "frames": [
            {
              "note": "LRU cache with capacity 3. The row is the doubly linked list: front is the most recently used, back is the least. The map finds any key in O(1).",
              "cells": [
                null,
                null,
                null
              ]
            },
            {
              "note": "put(1,10): insert the new node at the front and add key 1 to the map.",
              "cells": [
                "1:10",
                null,
                null
              ],
              "ptrs": {
                "front": 0,
                "back": 0
              },
              "hl": {
                "0": "ok"
              },
              "map": {
                "1": 10
              },
              "vars": {
                "op": "put(1,10)"
              }
            },
            {
              "note": "put(2,20): insert the new node at the front and add key 2 to the map.",
              "cells": [
                "2:20",
                "1:10",
                null
              ],
              "ptrs": {
                "front": 0,
                "back": 1
              },
              "hl": {
                "0": "ok"
              },
              "map": {
                "1": 10,
                "2": 20
              },
              "vars": {
                "op": "put(2,20)"
              }
            },
            {
              "note": "put(3,30): insert the new node at the front and add key 3 to the map.",
              "cells": [
                "3:30",
                "2:20",
                "1:10"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "hl": {
                "0": "ok"
              },
              "map": {
                "1": 10,
                "2": 20,
                "3": 30
              },
              "vars": {
                "op": "put(3,30)"
              }
            },
            {
              "note": "get(1): found through the map. Move its node to the front, because it was just used. Return 10.",
              "cells": [
                "1:10",
                "3:30",
                "2:20"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "hl": {
                "0": "a"
              },
              "map": {
                "1": 10,
                "2": 20,
                "3": 30
              },
              "vars": {
                "op": "get(1)",
                "returns": 10
              }
            },
            {
              "note": "put(4,40): the cache is full. Evict the back node 2:20, the least recently used, and delete key 2 from the map.",
              "cells": [
                "1:10",
                "3:30",
                "2:20"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "hl": {
                "2": "bad"
              },
              "map": {
                "1": 10,
                "2": 20,
                "3": 30
              },
              "vars": {
                "op": "put(4,40)"
              }
            },
            {
              "note": "put(4,40): insert the new node at the front and add key 4 to the map.",
              "cells": [
                "4:40",
                "1:10",
                "3:30"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "hl": {
                "0": "ok"
              },
              "map": {
                "1": 10,
                "3": 30,
                "4": 40
              },
              "vars": {
                "op": "put(4,40)"
              }
            },
            {
              "note": "get(2): key 2 is not in the map, so it was evicted. Return -1 and change nothing.",
              "cells": [
                "4:40",
                "1:10",
                "3:30"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "map": {
                "1": 10,
                "3": 30,
                "4": 40
              },
              "vars": {
                "op": "get(2)",
                "returns": -1
              }
            },
            {
              "note": "get(3): found through the map. Move its node to the front, because it was just used. Return 30.",
              "cells": [
                "3:30",
                "4:40",
                "1:10"
              ],
              "ptrs": {
                "front": 0,
                "back": 2
              },
              "hl": {
                "0": "a"
              },
              "map": {
                "1": 10,
                "3": 30,
                "4": 40
              },
              "vars": {
                "op": "get(3)",
                "returns": 30
              },
              "out": "Order now: 3, 4, 1. Key 2 was evicted."
            }
          ]
        }
      },
      "code": "class LRUCache {\n    int cap;\n    list<pair<int,int>> order;                                  // front = most recently used\n    unordered_map<int, list<pair<int,int>>::iterator> pos;      // key -> node in the list\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n\n    int get(int key) {\n        auto it = pos.find(key);\n        if (it == pos.end()) return -1;\n        order.splice(order.begin(), order, it->second);         // move node to front in O(1)\n        return it->second->second;\n    }\n\n    void put(int key, int value) {\n        auto it = pos.find(key);\n        if (it != pos.end()) {                                  // update an existing key\n            it->second->second = value;\n            order.splice(order.begin(), order, it->second);\n            return;\n        }\n        if ((int)order.size() == cap) {                         // full: evict the back node\n            pos.erase(order.back().first);\n            order.pop_back();\n        }\n        order.emplace_front(key, value);\n        pos[key] = order.begin();\n    }\n};",
      "complexity": "Time O(1) per get and put. Space O(capacity) for the list and the map.",
      "mistakes": [
        "Evicting from the list but forgetting to erase the key from the map. The map then points to a dead node.",
        "Forgetting that get also counts as a use. It must move the node to the front.",
        "Using a singly linked list. Removing a node from the middle then needs the previous node, which costs O(n)."
      ],
      "practice": [
        146,
        25,
        138
      ]
    }
  },
  "6": {
    "0": {
      "name": "Classic search",
      "when": "The array is sorted and you must find an exact value or say it is missing. Any time you see sorted input and an O(log n) hint, think binary search.",
      "idea": "Do not scan from the left. Look at the middle element instead. If it equals the target, you are done. If it is too small, then everything to its left is even smaller, so the target can only be on the right. If it is too big, the target can only be on the left. Each check throws away half of what is left, so 1,000,000 items need only about 20 checks. The two ends lo and hi mark the part that could still hold the answer.",
      "steps": [
        "Set lo = 0 and hi = n - 1. The answer, if it exists, is inside lo..hi.",
        "While lo <= hi, compute mid = lo + (hi - lo) / 2.",
        "If a[mid] == target, return mid.",
        "If a[mid] < target, set lo = mid + 1. Otherwise set hi = mid - 1.",
        "If the loop ends, the window is empty. Return -1."
      ],
      "example": {
        "problem": "Find 57 in the sorted array [3, 8, 12, 19, 25, 31, 42, 57, 63]. Output: index 7.",
        "walk": "The dashed window is the part that could still contain 57. It shrinks every round: nine cells, then four, then two. Faded cells are already ruled out. We find the target after three looks, instead of eight with a plain scan. The move is always mid + 1 or mid - 1, because mid itself has just been checked.",
        "viz": {
          "kind": "array",
          "cells": [
            3,
            8,
            12,
            19,
            25,
            31,
            42,
            57,
            63
          ],
          "frames": [
            {
              "note": "Sorted array, target 57. The answer can be anywhere between lo and hi, so the window is the whole array.",
              "ptrs": {
                "lo": 0,
                "hi": 8
              },
              "win": [
                0,
                8
              ],
              "hl": {},
              "vars": {
                "target": 57
              }
            },
            {
              "note": "mid = 4, a[mid] = 25 is smaller than 57. The target cannot be at or left of mid.",
              "ptrs": {
                "lo": 0,
                "mid": 4,
                "hi": 8
              },
              "win": [
                0,
                8
              ],
              "hl": {
                "4": "bad"
              },
              "vars": {
                "target": 57
              }
            },
            {
              "note": "Throw away the left half: lo = mid + 1 = 5. The window is now half as big.",
              "ptrs": {
                "lo": 5,
                "hi": 8
              },
              "win": [
                5,
                8
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim"
              },
              "vars": {
                "target": 57
              }
            },
            {
              "note": "mid = 6, a[mid] = 42 is smaller than 57. The target cannot be at or left of mid.",
              "ptrs": {
                "lo": 5,
                "mid": 6,
                "hi": 8
              },
              "win": [
                5,
                8
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "6": "bad"
              },
              "vars": {
                "target": 57
              }
            },
            {
              "note": "Throw away the left half: lo = mid + 1 = 7. The window is now half as big.",
              "ptrs": {
                "lo": 7,
                "hi": 8
              },
              "win": [
                7,
                8
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "dim",
                "6": "dim"
              },
              "vars": {
                "target": 57
              }
            },
            {
              "note": "mid = 7, a[mid] = 57. That equals the target. Return index 7.",
              "ptrs": {
                "lo": 7,
                "mid": 7,
                "hi": 8
              },
              "win": [
                7,
                8
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "ok"
              },
              "vars": {
                "target": 57
              },
              "out": "Answer: index 7"
            }
          ]
        }
      },
      "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo <= hi) {                    // window lo..hi is not empty\n        int mid = lo + (hi - lo) / 2;     // avoids overflow of lo + hi\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;   // target is on the right\n        else hi = mid - 1;                      // target is on the left\n    }\n    return -1;                            // not found\n}",
      "complexity": "Time O(log n), the window halves each round. Space O(1).",
      "mistakes": [
        "Writing mid = (lo + hi) / 2. It can overflow for large indices. Use lo + (hi - lo) / 2.",
        "Setting lo = mid or hi = mid in this version. The window may then never shrink and the loop runs forever.",
        "Using while (lo < hi) here, which skips the case where one cell is left."
      ],
      "practice": [
        704,
        35,
        69
      ]
    },
    "1": {
      "name": "Lower and upper bound",
      "when": "The array is sorted with repeated values, and you need the first or last position of a value, or the spot where a value would be inserted. 'First index that is >= x' is the key phrase.",
      "idea": "Plain binary search stops at ANY copy of the value. Often you want a boundary instead. Lower bound asks: what is the first index whose value is >= x? Keep a half-open window lo..hi where hi is one past the end. If a[mid] >= x, mid might be the answer, so keep it with hi = mid. Otherwise skip it with lo = mid + 1. When lo meets hi, that is the first index. The upper bound (first index > x) is just lowerBound(x + 1). The last copy of x is upper bound minus one.",
      "steps": [
        "Set lo = 0 and hi = n (one past the last index).",
        "While lo < hi, take mid = lo + (hi - lo) / 2.",
        "If a[mid] >= x, set hi = mid. Else set lo = mid + 1.",
        "When the loop ends, lo is the first index with a[lo] >= x (it can be n).",
        "First occurrence = lowerBound(x), if a[lo] == x. Last occurrence = lowerBound(x + 1) - 1."
      ],
      "example": {
        "problem": "Find the first and last position of 5 in [1, 3, 5, 5, 5, 8, 9, 12]. Output: [2, 4].",
        "walk": "The same search is run twice. With x = 5 it settles on index 2, the first 5. With x = 6 it settles on index 5, the first value that is bigger than 5, so the last 5 is the cell right before it. Notice we never stop early when we see a 5. We keep shrinking until lo and hi meet.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            3,
            5,
            5,
            5,
            8,
            9,
            12
          ],
          "frames": [
            {
              "note": "Find the first and last position of 5. Phase 1: lowerBound(5), the first index with a value >= 5. hi starts at n, one past the end.",
              "ptrs": {
                "lo": 0,
                "hi": 8
              },
              "win": [
                0,
                7
              ],
              "vars": {
                "x": 5
              }
            },
            {
              "note": "mid = 4, a[mid] = 5 is >= 5. It could be the answer, so keep it: hi = mid.",
              "ptrs": {
                "lo": 0,
                "mid": 4,
                "hi": 8
              },
              "win": [
                0,
                7
              ],
              "hl": {
                "4": "ok"
              },
              "vars": {
                "x": 5
              }
            },
            {
              "note": "mid = 2, a[mid] = 5 is >= 5. It could be the answer, so keep it: hi = mid.",
              "ptrs": {
                "lo": 0,
                "mid": 2,
                "hi": 4
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "2": "ok",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim"
              },
              "vars": {
                "x": 5
              }
            },
            {
              "note": "mid = 1, a[mid] = 3 is < 5. Too small, so skip it: lo = mid + 1.",
              "ptrs": {
                "lo": 0,
                "mid": 1,
                "hi": 2
              },
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "bad",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim"
              },
              "vars": {
                "x": 5
              }
            },
            {
              "note": "lo meets hi at index 2. That is the first index whose value is >= 5, and it holds a 5, so first = 2.",
              "ptrs": {
                "lo": 2,
                "hi": 2
              },
              "hl": {
                "2": "ok"
              },
              "vars": {
                "x": 5,
                "first": 2
              }
            },
            {
              "note": "Phase 2: the last 5 sits just before the first index with value >= 6. So run the same search with x = 6.",
              "ptrs": {
                "lo": 0,
                "hi": 8
              },
              "win": [
                0,
                7
              ],
              "hl": {
                "2": "dim"
              },
              "vars": {
                "x": 6,
                "first": 2
              }
            },
            {
              "note": "mid = 4, a[mid] = 5 is < 6. Too small, so skip it: lo = mid + 1.",
              "ptrs": {
                "lo": 0,
                "mid": 4,
                "hi": 8
              },
              "win": [
                0,
                7
              ],
              "hl": {
                "4": "bad"
              },
              "vars": {
                "x": 6,
                "first": 2
              }
            },
            {
              "note": "mid = 6, a[mid] = 9 is >= 6. It could be the answer, so keep it: hi = mid.",
              "ptrs": {
                "lo": 5,
                "mid": 6,
                "hi": 8
              },
              "win": [
                5,
                7
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "6": "ok"
              },
              "vars": {
                "x": 6,
                "first": 2
              }
            },
            {
              "note": "mid = 5, a[mid] = 8 is >= 6. It could be the answer, so keep it: hi = mid.",
              "ptrs": {
                "lo": 5,
                "mid": 5,
                "hi": 6
              },
              "win": [
                5,
                5
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "dim",
                "5": "ok",
                "6": "dim",
                "7": "dim"
              },
              "vars": {
                "x": 6,
                "first": 2
              }
            },
            {
              "note": "lowerBound(6) = 5. The last 5 is one step to the left, at index 4. Answer [2, 4].",
              "ptrs": {
                "lo": 5,
                "hi": 5
              },
              "hl": {
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "b"
              },
              "vars": {
                "x": 6,
                "first": 2,
                "last": 4
              },
              "out": "Answer: [2, 4]"
            }
          ]
        }
      },
      "code": "int lowerBound(const vector<int>& a, int x) {   // first index with a[i] >= x\n    int lo = 0, hi = a.size();                  // hi is one past the end\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] >= x) hi = mid;              // mid may be the answer, keep it\n        else lo = mid + 1;\n    }\n    return lo;\n}\n\nvector<int> searchRange(vector<int>& nums, int target) {\n    int first = lowerBound(nums, target);\n    if (first == (int)nums.size() || nums[first] != target) return {-1, -1};\n    int last = lowerBound(nums, target + 1) - 1;   // upper bound minus one\n    return {first, last};\n}",
      "complexity": "Time O(log n) for each search, so O(log n) overall. Space O(1).",
      "mistakes": [
        "Using hi = n - 1 with the hi = mid rule. The answer can be n (insert at the end), so hi must start at n.",
        "Forgetting to check that nums[first] == target. lowerBound only gives where the value would go.",
        "Using lo = mid instead of mid + 1, which loops forever when the window has two cells."
      ],
      "practice": [
        34,
        35,
        704
      ]
    },
    "2": {
      "name": "Rotated sorted array",
      "when": "A sorted array was cut and rotated, for example [4,5,6,7,0,1,2], and you must search it or find its minimum in O(log n).",
      "idea": "After rotation the array is not sorted as a whole, but one half around mid is ALWAYS sorted. Compare a[lo] with a[mid]. If a[lo] <= a[mid], the left half is sorted. Otherwise the right half is. A sorted half is easy to test: check if the target lies between its two ends. If yes, search that half. If no, the target must be in the other half. So every round still throws away half of the window.",
      "steps": [
        "Set lo = 0, hi = n - 1 and loop while lo <= hi.",
        "Compute mid. If a[mid] == target, return mid.",
        "If a[lo] <= a[mid], the left half is sorted. If a[lo] <= target < a[mid], set hi = mid - 1, else lo = mid + 1.",
        "Otherwise the right half is sorted. If a[mid] < target <= a[hi], set lo = mid + 1, else hi = mid - 1.",
        "If the loop ends, return -1."
      ],
      "example": {
        "problem": "Search for 8 in the rotated array [6, 7, 8, 9, 1, 2, 3, 4, 5]. Output: index 2.",
        "walk": "Each round the violet cells show the half that is sorted. We only ask one question about that half: could the target be inside its range? In round one the right half 1..5 is sorted and 8 is not in it, so we go left. In round two the left half 6..7 is sorted and 8 is not in it, so we go right. Then mid lands on 8.",
        "viz": {
          "kind": "array",
          "cells": [
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5
          ],
          "frames": [
            {
              "note": "This sorted array was rotated, so it is two sorted runs. Find 8. The window is the whole array.",
              "ptrs": {
                "lo": 0,
                "hi": 8
              },
              "win": [
                0,
                8
              ],
              "vars": {
                "target": 8
              }
            },
            {
              "note": "a[lo] = 6 > a[mid] = 1, so the right half 1..5 is sorted. Is 8 inside it? No.",
              "ptrs": {
                "lo": 0,
                "mid": 4,
                "hi": 8
              },
              "win": [
                0,
                8
              ],
              "hl": {
                "4": "a",
                "5": "b",
                "6": "b",
                "7": "b",
                "8": "b"
              },
              "vars": {
                "target": 8
              }
            },
            {
              "note": "Not in the sorted half, so it must be in the other half. Move to it. The window is now 0..3.",
              "ptrs": {
                "lo": 0,
                "hi": 3
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim"
              },
              "vars": {
                "target": 8
              }
            },
            {
              "note": "a[lo] = 6 <= a[mid] = 7, so the left half 6..7 is sorted. Is 8 inside it? No.",
              "ptrs": {
                "lo": 0,
                "mid": 1,
                "hi": 3
              },
              "win": [
                0,
                3
              ],
              "hl": {
                "0": "b",
                "1": "a",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim"
              },
              "vars": {
                "target": 8
              }
            },
            {
              "note": "Not in the sorted half, so it must be in the other half. Move to it. The window is now 2..3.",
              "ptrs": {
                "lo": 2,
                "hi": 3
              },
              "win": [
                2,
                3
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim"
              },
              "vars": {
                "target": 8
              }
            },
            {
              "note": "mid = 2, a[mid] = 8. Found the target at index 2.",
              "ptrs": {
                "lo": 2,
                "mid": 2,
                "hi": 3
              },
              "win": [
                2,
                3
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "ok",
                "4": "dim",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim"
              },
              "vars": {
                "target": 8
              },
              "out": "Answer: index 2"
            }
          ]
        }
      },
      "code": "int search(vector<int>& nums, int target) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[lo] <= nums[mid]) {               // left half is sorted\n            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;\n            else lo = mid + 1;\n        } else {                                   // right half is sorted\n            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return -1;\n}",
      "complexity": "Time O(log n). Space O(1). With duplicate values the worst case degrades to O(n).",
      "mistakes": [
        "Using < instead of <= in a[lo] <= a[mid]. When lo == mid the left half has one cell and is sorted.",
        "Writing target <= a[mid] when mid was already checked. Use strict < on the mid side.",
        "Assuming this works with duplicates. When a[lo] == a[mid] == a[hi] you cannot tell which half is sorted, so shrink lo and hi by one."
      ],
      "practice": [
        33,
        153,
        81
      ]
    },
    "3": {
      "name": "Search on the answer",
      "when": "The question asks for the minimum (or maximum) value of something so that a condition still holds: smallest speed, least capacity, largest minimum gap. You can test one candidate value quickly even if you cannot compute the best directly.",
      "idea": "Here the thing you search is not an array of input data. It is the range of possible answers. Write a function feasible(x) that says whether a candidate answer x works. If feasible is monotonic (all small values fail and all big values work, or the reverse), the answers look like FFFFTTTT. Then binary search finds the first T just like a lower bound. Pick lo and hi as the smallest and biggest sensible answers, test mid, and keep the half that holds the boundary.",
      "steps": [
        "Decide the answer range: lo is the smallest possible answer, hi is a value that surely works.",
        "Write feasible(x), usually one pass over the input, O(n).",
        "While lo < hi, take mid. If feasible(mid), set hi = mid. Otherwise set lo = mid + 1.",
        "When lo == hi, that is the smallest feasible value. Return it.",
        "For a maximum answer, flip the logic: if feasible(mid), set lo = mid + 1 style (with mid rounded up)."
      ],
      "example": {
        "problem": "Koko eating bananas: piles [3, 6, 7, 11] and h = 8 hours. Find the smallest eating speed k so she finishes in time. Output: 4.",
        "walk": "The cells are the candidate speeds 1 to 11. A speed is green if she finishes in time, red if not. Speeds that are too slow all fail and faster ones all pass, so the line looks like red, red, red, green, green. Each probe computes the hours with a quick loop over the piles, then halves the range. Four probes find k = 4 among 11 candidates.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11
          ],
          "frames": [
            {
              "note": "Koko eats at speed k bananas per hour. Piles [3,6,7,11], 8 hours. We search over the speed k = 1..11, not over the piles.",
              "ptrs": {
                "lo": 0,
                "hi": 10
              },
              "win": [
                0,
                10
              ],
              "vars": {
                "h": 8
              }
            },
            {
              "note": "Try k = 6: hours = 6, which is <= 8. Fast enough, so 6 works. A smaller k may work too: hi = 6.",
              "ptrs": {
                "lo": 0,
                "mid": 5,
                "hi": 10
              },
              "win": [
                0,
                10
              ],
              "hl": {
                "5": "ok"
              },
              "vars": {
                "k": 6,
                "hours": 6,
                "h": 8
              }
            },
            {
              "note": "Try k = 3: hours = 10, which is more than 8. Too slow, and anything slower fails too: lo = 4.",
              "ptrs": {
                "lo": 0,
                "mid": 2,
                "hi": 5
              },
              "win": [
                0,
                5
              ],
              "hl": {
                "2": "bad",
                "6": "dim",
                "7": "dim",
                "8": "dim",
                "9": "dim",
                "10": "dim"
              },
              "vars": {
                "k": 3,
                "hours": 10,
                "h": 8
              }
            },
            {
              "note": "Try k = 5: hours = 8, which is <= 8. Fast enough, so 5 works. A smaller k may work too: hi = 5.",
              "ptrs": {
                "lo": 3,
                "mid": 4,
                "hi": 5
              },
              "win": [
                3,
                5
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "4": "ok",
                "6": "dim",
                "7": "dim",
                "8": "dim",
                "9": "dim",
                "10": "dim"
              },
              "vars": {
                "k": 5,
                "hours": 8,
                "h": 8
              }
            },
            {
              "note": "Try k = 4: hours = 8, which is <= 8. Fast enough, so 4 works. A smaller k may work too: hi = 4.",
              "ptrs": {
                "lo": 3,
                "mid": 3,
                "hi": 4
              },
              "win": [
                3,
                4
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "ok",
                "5": "dim",
                "6": "dim",
                "7": "dim",
                "8": "dim",
                "9": "dim",
                "10": "dim"
              },
              "vars": {
                "k": 4,
                "hours": 8,
                "h": 8
              }
            },
            {
              "note": "lo meets hi at k = 4. Slower fails, 4 works, so the minimum speed is 4. Speeds are shown as cells, cell i holds speed i + 1.",
              "ptrs": {
                "lo": 3,
                "hi": 3
              },
              "hl": {
                "3": "ok"
              },
              "vars": {
                "hours": 8,
                "h": 8
              },
              "out": "Answer: k = 4"
            }
          ]
        }
      },
      "code": "int minEatingSpeed(vector<int>& piles, int h) {\n    int lo = 1, hi = *max_element(piles.begin(), piles.end());   // hi always works\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        long long hours = 0;\n        for (int p : piles) hours += (p + mid - 1) / mid;        // ceil(p / mid)\n        if (hours <= h) hi = mid;      // speed mid is enough, try slower\n        else lo = mid + 1;             // too slow, need faster\n    }\n    return lo;\n}",
      "complexity": "Time O(n log M), where M is the largest pile (the answer range). Space O(1).",
      "mistakes": [
        "Choosing a wrong range, such as lo = 0, which causes division by zero in the check.",
        "Using floor division instead of ceiling for the hours of a pile. Use (p + k - 1) / k.",
        "Using hours < h instead of hours <= h, which gives an answer that is too large."
      ],
      "practice": [
        875,
        1011,
        410,
        1482,
        69
      ]
    },
    "4": {
      "name": "Peak or boundary finding",
      "when": "The array is not fully sorted, but neighbours differ, and you need a peak, a valley or the point where a pattern flips (for example where a sorted array turns from big to small).",
      "idea": "You do not need the array to be sorted. You only need a rule that tells you which side surely holds an answer. For a peak, compare a[mid] with a[mid + 1]. If a[mid] is smaller, you are walking uphill to the right. Going on uphill you must end at a peak (or at the last cell, which counts, since outside is minus infinity), so keep the right side. If a[mid] is bigger, the left side up to mid holds a peak. Keep that side and keep mid itself.",
      "steps": [
        "Set lo = 0 and hi = n - 1.",
        "While lo < hi, take mid and compare a[mid] with a[mid + 1].",
        "If a[mid] < a[mid + 1], uphill is on the right: lo = mid + 1.",
        "Otherwise the peak is at mid or to its left: hi = mid.",
        "When lo == hi, that index is a peak. Return it."
      ],
      "example": {
        "problem": "Find a peak in [1, 2, 1, 3, 5, 6, 4, 2]. A peak is bigger than both neighbours. Output: index 5 (value 6). Index 1 is also a valid peak, any one is accepted.",
        "walk": "The orange cell is mid and the violet cell is mid + 1. We never look for the peak itself, we only ask which way is uphill. First look: 3 < 5, so go right. Next: 6 > 4, so keep mid on the right edge of the window. Then 5 < 6, so go right again. The window collapses on the peak.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            1,
            3,
            5,
            6,
            4,
            2
          ],
          "frames": [
            {
              "note": "Find any peak: a value bigger than both neighbours. Compare a[mid] with a[mid + 1] to see which way is uphill.",
              "ptrs": {
                "lo": 0,
                "hi": 7
              },
              "win": [
                0,
                7
              ]
            },
            {
              "note": "a[3] = 3 < a[4] = 5. The slope goes up to the right, so a peak must exist on the right: lo = mid + 1.",
              "ptrs": {
                "lo": 0,
                "mid": 3,
                "hi": 7
              },
              "win": [
                0,
                7
              ],
              "hl": {
                "3": "a",
                "4": "b"
              }
            },
            {
              "note": "a[5] = 6 > a[6] = 4. The slope goes down to the right, so mid or something on its left is a peak: hi = mid.",
              "ptrs": {
                "lo": 4,
                "mid": 5,
                "hi": 7
              },
              "win": [
                4,
                7
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "5": "a",
                "6": "b"
              }
            },
            {
              "note": "a[4] = 5 < a[5] = 6. The slope goes up to the right, so a peak must exist on the right: lo = mid + 1.",
              "ptrs": {
                "lo": 4,
                "mid": 4,
                "hi": 5
              },
              "win": [
                4,
                5
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "a",
                "5": "b",
                "6": "dim",
                "7": "dim"
              }
            },
            {
              "note": "lo meets hi at index 5. The value 6 is bigger than both neighbours (5 and 4), so it is a peak.",
              "ptrs": {
                "lo": 5,
                "hi": 5
              },
              "hl": {
                "4": "b",
                "5": "ok",
                "6": "b"
              },
              "out": "Answer: index 5 (value 6)"
            }
          ]
        }
      },
      "code": "int findPeakElement(vector<int>& nums) {\n    int lo = 0, hi = (int)nums.size() - 1;\n    while (lo < hi) {                          // stop when one cell is left\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] < nums[mid + 1]) lo = mid + 1;   // uphill: peak on the right\n        else hi = mid;                                 // downhill: peak at mid or left\n    }\n    return lo;\n}",
      "complexity": "Time O(log n). Space O(1).",
      "mistakes": [
        "Comparing a[mid] with a[mid - 1] and using hi = mid - 1. That can discard a peak. The mid, mid + 1 comparison with hi = mid is the safe form.",
        "Using while (lo <= hi) with hi = mid. The loop then never ends when lo == hi.",
        "Assuming the answer is unique. Several peaks may exist, any one is valid."
      ],
      "practice": [
        162,
        153,
        540
      ]
    },
    "5": {
      "name": "Search in a matrix",
      "when": "A 2D matrix is sorted in a clear way and you must find a value. If each row is sorted and every row starts after the previous row ends, treat it as one long sorted array. If only rows and columns are sorted, walk from a corner.",
      "idea": "When the rows chain together in sorted order, reading the matrix row by row gives one sorted list of rows * cols numbers. You do not need to build that list. Just binary search over the positions 0 to rows * cols - 1. Position mid lives in row mid / cols and column mid % cols. The rest is plain binary search. If the matrix is only sorted along rows and columns separately, start in the top-right corner instead: if the value is too big, move left, and if too small, move down.",
      "steps": [
        "Let rows and cols be the matrix size. Set lo = 0 and hi = rows * cols - 1.",
        "While lo <= hi, take mid and convert it: r = mid / cols, c = mid % cols.",
        "Compare m[r][c] with the target. If equal, return true.",
        "If it is smaller, set lo = mid + 1. If it is bigger, set hi = mid - 1.",
        "If the loop ends, return false. For the 'rows and columns sorted' version, use the corner walk (start top-right, move left or down)."
      ],
      "example": {
        "problem": "Is 16 in the matrix [[1,3,5,7],[10,11,16,20],[23,30,34,60]]? Every row is sorted and each row begins above the last value of the previous row. Output: true.",
        "walk": "The picture is a 2D grid, but the search runs on a single number mid from 0 to 11. The vars chips show lo, mid, hi as flat positions. Mid = 5 is the cell 11 at row 1, col 1. Then the window drops to positions 6 to 11, and after two more probes mid = 6 lands on 16. Faded cells are ruled out.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          "frames": [
            {
              "note": "Each row is sorted and each row starts above the last value of the row before. So the matrix is one sorted line of 12 numbers. Find 16.",
              "cells": [
                [
                  1,
                  3,
                  5,
                  7
                ],
                [
                  10,
                  11,
                  16,
                  20
                ],
                [
                  23,
                  30,
                  34,
                  60
                ]
              ],
              "hl": {},
              "vars": {
                "lo": 0,
                "hi": 11,
                "target": 16
              }
            },
            {
              "note": "mid = 5 maps to row 1, col 1. 11 is smaller than 16, so drop mid and everything before it: lo = 6.",
              "hl": {
                "1,1": "bad"
              },
              "vars": {
                "lo": 0,
                "mid": 5,
                "hi": 11
              }
            },
            {
              "note": "The faded cells are out. The window is flat positions 6 to 11.",
              "hl": {
                "0,0": "dim",
                "0,1": "dim",
                "0,2": "dim",
                "0,3": "dim",
                "1,0": "dim",
                "1,1": "dim"
              },
              "vars": {
                "lo": 6,
                "hi": 11,
                "target": 16
              }
            },
            {
              "note": "mid = 8 maps to row 2, col 0. 23 is bigger than 16, so drop mid and everything after it: hi = 7.",
              "hl": {
                "0,0": "dim",
                "0,1": "dim",
                "0,2": "dim",
                "0,3": "dim",
                "1,0": "dim",
                "1,1": "dim",
                "2,0": "bad"
              },
              "vars": {
                "lo": 6,
                "mid": 8,
                "hi": 11
              }
            },
            {
              "note": "The faded cells are out. The window is flat positions 6 to 7.",
              "hl": {
                "0,0": "dim",
                "0,1": "dim",
                "0,2": "dim",
                "0,3": "dim",
                "1,0": "dim",
                "1,1": "dim",
                "2,0": "dim",
                "2,1": "dim",
                "2,2": "dim",
                "2,3": "dim"
              },
              "vars": {
                "lo": 6,
                "hi": 7,
                "target": 16
              }
            },
            {
              "note": "mid = 6 maps to row 6/4 = 1, col 6%4 = 2. The value is 16. That is the target.",
              "hl": {
                "0,0": "dim",
                "0,1": "dim",
                "0,2": "dim",
                "0,3": "dim",
                "1,0": "dim",
                "1,1": "dim",
                "2,0": "dim",
                "2,1": "dim",
                "2,2": "dim",
                "2,3": "dim",
                "1,2": "ok"
              },
              "vars": {
                "lo": 6,
                "mid": 6,
                "hi": 7
              },
              "out": "Answer: true"
            }
          ]
        }
      },
      "code": "bool searchMatrix(vector<vector<int>>& m, int target) {\n    int rows = m.size(), cols = m[0].size();\n    int lo = 0, hi = rows * cols - 1;            // flat positions\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        int v = m[mid / cols][mid % cols];       // flat position -> row, col\n        if (v == target) return true;\n        if (v < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return false;\n}",
      "complexity": "Time O(log(rows * cols)). Space O(1). The corner walk version is O(rows + cols).",
      "mistakes": [
        "Mixing up the divisor: row = mid / cols and col = mid % cols (cols, not rows).",
        "Applying this flat trick to a matrix whose rows are not chained in order. Then you need the corner walk.",
        "Forgetting to check for an empty matrix when it can be empty."
      ],
      "practice": [
        74,
        240,
        704
      ]
    },
    "6": {
      "name": "Time-stamped lookup",
      "when": "You store values with increasing timestamps (or versions) and must answer 'what was the value at time t', meaning the latest entry at or before t. Also: the largest value <= x in a sorted list.",
      "idea": "Entries arrive in increasing time, so each key's list is already sorted by timestamp. For a query t you want the last entry whose time is <= t. That is an upper bound search: find the first entry whose time is greater than t, then step one index back. If that first greater entry is index 0, nothing existed yet, so return an empty answer. The same idea answers any 'floor' question: the biggest stored value that does not exceed x.",
      "steps": [
        "Store values per key in a vector of (timestamp, value), appended in time order.",
        "On get(key, t), binary search that vector with lo = 0 and hi = size.",
        "If entry[mid].time <= t, set lo = mid + 1. Otherwise set hi = mid.",
        "When the loop ends, lo is the first entry with time > t.",
        "If lo == 0 return the empty string, otherwise return the value at lo - 1."
      ],
      "example": {
        "problem": "Key k holds (2,a) (5,b) (8,c) (12,d) (15,e) (20,f). Run get(k, 13). Output: d, the value stored at time 12.",
        "walk": "The search looks for the first timestamp that is greater than 13, not for 13 itself. 13 is not stored, so an exact search would fail. Green cells are allowed (time <= 13) and red cells are in the future. The window closes on index 4 (time 15), and the entry just before it, time 12, is the answer.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            5,
            8,
            12,
            15,
            20
          ],
          "frames": [
            {
              "note": "One key stores values by timestamp, always in increasing time. get(key, 13) wants the latest value at or before time 13. Search for the first timestamp > 13.",
              "ptrs": {
                "lo": 0,
                "hi": 6
              },
              "win": [
                0,
                5
              ],
              "map": {
                "2": "a",
                "5": "b",
                "8": "c",
                "12": "d",
                "15": "e",
                "20": "f"
              },
              "vars": {
                "query": 13
              }
            },
            {
              "note": "mid = 3, time 12 <= 13. This entry is allowed, but a later one might be too: lo = mid + 1.",
              "ptrs": {
                "lo": 0,
                "mid": 3,
                "hi": 6
              },
              "win": [
                0,
                5
              ],
              "hl": {
                "3": "ok"
              },
              "map": {
                "2": "a",
                "5": "b",
                "8": "c",
                "12": "d",
                "15": "e",
                "20": "f"
              },
              "vars": {
                "query": 13
              }
            },
            {
              "note": "mid = 5, time 20 > 13. That is in the future, so it cannot be the answer: hi = mid.",
              "ptrs": {
                "lo": 4,
                "mid": 5,
                "hi": 6
              },
              "win": [
                4,
                5
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "5": "bad"
              },
              "map": {
                "2": "a",
                "5": "b",
                "8": "c",
                "12": "d",
                "15": "e",
                "20": "f"
              },
              "vars": {
                "query": 13
              }
            },
            {
              "note": "mid = 4, time 15 > 13. That is in the future, so it cannot be the answer: hi = mid.",
              "ptrs": {
                "lo": 4,
                "mid": 4,
                "hi": 5
              },
              "win": [
                4,
                4
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "bad",
                "5": "dim"
              },
              "map": {
                "2": "a",
                "5": "b",
                "8": "c",
                "12": "d",
                "15": "e",
                "20": "f"
              },
              "vars": {
                "query": 13
              }
            },
            {
              "note": "lo = 4 is the first timestamp after 13. The entry just before it, index 3 (time 12), is the latest one at or before 13. Its value is d.",
              "ptrs": {
                "lo": 4,
                "hi": 4
              },
              "hl": {
                "3": "ok",
                "4": "b"
              },
              "map": {
                "2": "a",
                "5": "b",
                "8": "c",
                "12": "d",
                "15": "e",
                "20": "f"
              },
              "vars": {
                "query": 13
              },
              "out": "Answer: d"
            }
          ]
        }
      },
      "code": "class TimeMap {\n    unordered_map<string, vector<pair<int, string>>> data;   // key -> (time, value), time increasing\npublic:\n    void set(string key, string value, int timestamp) {\n        data[key].push_back({timestamp, value});\n    }\n    string get(string key, int timestamp) {\n        auto it = data.find(key);\n        if (it == data.end()) return \"\";\n        auto& v = it->second;\n        int lo = 0, hi = v.size();             // find first entry with time > timestamp\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (v[mid].first <= timestamp) lo = mid + 1;\n            else hi = mid;\n        }\n        return lo == 0 ? \"\" : v[lo - 1].second;   // step back one entry\n    }\n};",
      "complexity": "set is O(1). get is O(log n) for n entries of that key. Space O(total entries).",
      "mistakes": [
        "Returning v[lo] instead of v[lo - 1]. lo is the first entry that is too new.",
        "Forgetting lo == 0, where every stored time is later than the query. Then index -1 is out of range.",
        "Searching for an exact timestamp. Queries rarely match a stored time exactly."
      ],
      "practice": [
        981,
        34,
        35
      ]
    }
  },
  "7": {
    "0": {
      "name": "Include or exclude",
      "when": "You must list or count every subset, or every way to pick some items from a list, and each item is either in the answer or not. Words like 'all subsets', 'power set' or 'every combination of choices' are the clue.",
      "idea": "Walk through the items one by one. For each item you face a yes or no question: put it in the current answer, or leave it out. Try yes first, explore everything that follows, then undo the yes (pop it) and try no. This is called backtracking: make a choice, recurse, undo the choice. The calls form a tree where each level is one item and each leaf is one finished subset. With n items there are 2^n leaves, and that is exactly how many subsets exist.",
      "steps": [
        "Keep a shared list cur that holds your choices so far, and a result list res.",
        "Write dfs(i), where i is the item you are deciding about.",
        "Base case: if i == n, every item is decided, so push a copy of cur into res and return.",
        "Include branch: push nums[i] onto cur, call dfs(i + 1), then pop it off again.",
        "Exclude branch: call dfs(i + 1) without touching cur."
      ],
      "example": {
        "problem": "Subsets of [1, 2, 3]. Return all 8 subsets (any order is fine): [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3].",
        "walk": "Each node is labelled with the numbers chosen so far, and the highlighted path is the current call chain. The stack on the side is cur. Notice that after saving a leaf, the code does not start over: it only pops back as far as the last include and flips that one decision. All 8 leaves appear, each exactly once.",
        "viz": {
          "kind": "tree",
          "cells": [
            "{}",
            "1",
            "{}",
            "12",
            "1",
            "2",
            "{}",
            "123",
            "12",
            "13",
            "1",
            "23",
            "2",
            "3",
            "{}"
          ],
          "frames": [
            {
              "note": "Each level decides one number. Left branch = include it, right branch = exclude it. At the root, cur is empty.",
              "hl": {
                "0": "a"
              },
              "stack": [],
              "vars": {
                "saved": 0
              }
            },
            {
              "note": "Go left (include) at every level: 1, 2, 3. All numbers are decided, so save a copy of cur = [1, 2, 3].",
              "hl": {
                "0": "b",
                "1": "b",
                "3": "b",
                "7": "a"
              },
              "stack": [
                1,
                2,
                3
              ],
              "vars": {
                "saved": 1
              }
            },
            {
              "note": "Pop back up to the choice for 3 and take its other branch: exclude it. cur = [1, 2]. Save it.",
              "hl": {
                "0": "b",
                "1": "b",
                "3": "b",
                "7": "ok",
                "8": "a"
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "saved": 2
              }
            },
            {
              "note": "Pop back up to the choice for 2 and take its other branch: exclude it. The numbers after it are included again. cur = [1, 3]. Save it.",
              "hl": {
                "0": "b",
                "1": "b",
                "4": "b",
                "7": "ok",
                "8": "ok",
                "9": "a"
              },
              "stack": [
                1,
                3
              ],
              "vars": {
                "saved": 3
              }
            },
            {
              "note": "Pop back up to the choice for 3 and take its other branch: exclude it. cur = [1]. Save it.",
              "hl": {
                "0": "b",
                "1": "b",
                "4": "b",
                "7": "ok",
                "8": "ok",
                "9": "ok",
                "10": "a"
              },
              "stack": [
                1
              ],
              "vars": {
                "saved": 4
              }
            },
            {
              "note": "Pop back up to the choice for 1 and take its other branch: exclude it. The numbers after it are included again. cur = [2, 3]. Save it.",
              "hl": {
                "0": "b",
                "2": "b",
                "5": "b",
                "7": "ok",
                "8": "ok",
                "9": "ok",
                "10": "ok",
                "11": "a"
              },
              "stack": [
                2,
                3
              ],
              "vars": {
                "saved": 5
              }
            },
            {
              "note": "Pop back up to the choice for 3 and take its other branch: exclude it. cur = [2]. Save it.",
              "hl": {
                "0": "b",
                "2": "b",
                "5": "b",
                "7": "ok",
                "8": "ok",
                "9": "ok",
                "10": "ok",
                "11": "ok",
                "12": "a"
              },
              "stack": [
                2
              ],
              "vars": {
                "saved": 6
              }
            },
            {
              "note": "Pop back up to the choice for 2 and take its other branch: exclude it. The numbers after it are included again. cur = [3]. Save it.",
              "hl": {
                "0": "b",
                "2": "b",
                "6": "b",
                "7": "ok",
                "8": "ok",
                "9": "ok",
                "10": "ok",
                "11": "ok",
                "12": "ok",
                "13": "a"
              },
              "stack": [
                3
              ],
              "vars": {
                "saved": 7
              }
            },
            {
              "note": "Pop back up to the choice for 3 and take its other branch: exclude it. cur = []. Save it.",
              "hl": {
                "0": "b",
                "2": "b",
                "6": "b",
                "7": "ok",
                "8": "ok",
                "9": "ok",
                "10": "ok",
                "11": "ok",
                "12": "ok",
                "13": "ok",
                "14": "a"
              },
              "stack": [],
              "vars": {
                "saved": 8
              },
              "out": "8 subsets saved"
            }
          ]
        }
      },
      "code": "vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> res;\n    vector<int> cur;                              // the choices made so far\n    function<void(int)> dfs = [&](int i) {\n        if (i == (int)nums.size()) {              // every item is decided\n            res.push_back(cur);                   // save a COPY of cur\n            return;\n        }\n        cur.push_back(nums[i]);                   // choice 1: include nums[i]\n        dfs(i + 1);\n        cur.pop_back();                           // undo the choice\n        dfs(i + 1);                               // choice 2: exclude nums[i]\n    };\n    dfs(0);\n    return res;\n}",
      "complexity": "Time O(n * 2^n): there are 2^n leaves and copying one subset costs up to n. Space O(n) for the recursion and cur, not counting the output.",
      "mistakes": [
        "Forgetting the pop_back after the include branch. Then cur keeps growing and later answers are wrong.",
        "Storing a reference to cur instead of a copy. Here push_back(cur) copies, but in other languages you must copy on purpose.",
        "Writing the base case as i > n or checking it too late, which saves the same subset more than once."
      ],
      "practice": [
        78,
        22,
        784
      ]
    },
    "1": {
      "name": "Permutations",
      "when": "You need every ordering of a list: 'return all permutations', 'all arrangements', or each item is used exactly once but the order matters. With duplicates the same idea works with an extra skip rule.",
      "idea": "Build the answer one slot at a time. For each slot, loop over all numbers and pick any that has not been used yet. A boolean array used[] remembers what is taken. Push the number, mark it used, recurse to fill the next slot, then undo both (pop and unmark) so the next loop step starts clean. When cur is as long as the input, you have one full ordering. For n numbers the tree has n! leaves.",
      "steps": [
        "Keep cur (the arrangement so far), a used[] array of n booleans, and a result list.",
        "Write dfs(). If cur.size() == n, save a copy of cur and return.",
        "Loop i from 0 to n - 1. Skip the index if used[i] is true.",
        "Otherwise mark used[i] = true, push nums[i], and call dfs().",
        "After the call, undo both: pop the number and set used[i] = false."
      ],
      "example": {
        "problem": "Permutations of [1, 2, 3]. Output: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] (6 in total).",
        "walk": "The array shows the input numbers. Blue-violet cells are used, orange is the newest pick, green means the arrangement is complete. The stack is cur. Watch the backtrack frame: undoing two picks makes 2 and 3 free again, which is why the next arrangement can start with 1 and then 3.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            3
          ],
          "frames": [
            {
              "note": "Three empty slots. At each slot we pick any number that is not used yet. 'used' numbers are shown faded.",
              "hl": {},
              "stack": [],
              "vars": {
                "found": 0
              }
            },
            {
              "note": "Slot 1: the first unused number is 1. Mark it used and push it onto cur.",
              "hl": {
                "0": "a"
              },
              "stack": [
                1
              ],
              "vars": {
                "found": 0
              }
            },
            {
              "note": "Slot 2: 1 is used, so the first free number is 2. Push it.",
              "hl": {
                "0": "b",
                "1": "a"
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "found": 0
              }
            },
            {
              "note": "Slot 3: only 3 is free. Push it. cur has 3 numbers, so save [1, 2, 3].",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                1,
                2,
                3
              ],
              "vars": {
                "found": 1
              }
            },
            {
              "note": "Backtrack: pop 3 and unmark it, pop 2 and unmark it. Slot 2 is open again and 3 is free, so we try 3 there.",
              "hl": {
                "0": "b"
              },
              "stack": [
                1
              ],
              "vars": {
                "found": 1
              }
            },
            {
              "note": "Slot 2 now takes 3 instead of 2; the remaining free number fills the last slot. cur = [1, 3, 2]. Save it.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                1,
                3,
                2
              ],
              "vars": {
                "found": 2
              }
            },
            {
              "note": "Slot 1 now takes 2 instead of 1; the free numbers fill the other slots in order. cur = [2, 1, 3]. Save it.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                2,
                1,
                3
              ],
              "vars": {
                "found": 3
              }
            },
            {
              "note": "Slot 2 now takes 3 instead of 1; the remaining free number fills the last slot. cur = [2, 3, 1]. Save it.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                2,
                3,
                1
              ],
              "vars": {
                "found": 4
              }
            },
            {
              "note": "Slot 1 now takes 3 instead of 2; the free numbers fill the other slots in order. cur = [3, 1, 2]. Save it.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                3,
                1,
                2
              ],
              "vars": {
                "found": 5
              }
            },
            {
              "note": "Slot 2 now takes 2 instead of 1; the remaining free number fills the last slot. cur = [3, 2, 1]. Save it.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "stack": [
                3,
                2,
                1
              ],
              "vars": {
                "found": 6
              },
              "out": "6 permutations found"
            }
          ]
        }
      },
      "code": "vector<vector<int>> permute(vector<int>& nums) {\n    int n = nums.size();\n    vector<vector<int>> res;\n    vector<int> cur;\n    vector<bool> used(n, false);              // used[i]: is nums[i] already in cur?\n    function<void()> dfs = [&]() {\n        if ((int)cur.size() == n) {           // one full arrangement\n            res.push_back(cur);\n            return;\n        }\n        for (int i = 0; i < n; i++) {\n            if (used[i]) continue;            // each number only once\n            used[i] = true;                   // choose\n            cur.push_back(nums[i]);\n            dfs();\n            cur.pop_back();                   // un-choose\n            used[i] = false;\n        }\n    };\n    dfs();\n    return res;\n}",
      "complexity": "Time O(n * n!) because there are n! results and each is built and copied in O(n). Space O(n) for the recursion, used[] and cur.",
      "mistakes": [
        "Forgetting to reset used[i] = false after the recursive call, so later branches think the number is still taken.",
        "Starting the loop at the current depth, as combinations do. Permutations must always scan every index from 0.",
        "With duplicate values and no skip rule you get repeated permutations. Sort first and skip a value equal to the previous unused one."
      ],
      "practice": [
        46,
        47
      ]
    },
    "2": {
      "name": "Combinations with a start index",
      "when": "You must pick numbers where order does not matter ('combinations', 'all sets that sum to target', 'choose k of n'). [2,3] and [3,2] count as the same answer, and sometimes an item may be reused.",
      "idea": "A combination is an unordered set, so you must build it in one fixed order: always move forward through the array. Pass a start index to dfs and let the loop begin at start. Once you pick index i, later picks can only come from i or beyond, so the same set can never be built in two orders. To allow reuse, recurse with i. To forbid reuse, recurse with i + 1. Sorting the array lets you stop the loop with break as soon as one candidate is too big, because all the later ones are bigger too.",
      "steps": [
        "Sort the candidates (it makes pruning easy) and keep cur and res.",
        "Write dfs(start, rem), where rem is what is still needed.",
        "If rem == 0, save a copy of cur and return.",
        "Loop i from start. If candidates[i] > rem, break (sorted, so the rest are too big).",
        "Push candidates[i], call dfs(i, rem - candidates[i]) for reuse (use i + 1 for no reuse), then pop."
      ],
      "example": {
        "problem": "Combination Sum: candidates [2, 3, 5], target 8, each number may be reused. Output: [2,2,2,2], [2,3,3], [3,5].",
        "walk": "The pointer i marks the index we just took and the stack is cur. Green means rem hit 0 and the set is saved, red means a dead end. Watch [2,2,3]: rem is 1 and nothing from index 1 onward fits, so we give up. Also notice that [3,2,3] is never tried, because after 3 we can never go back to 2.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            3,
            5
          ],
          "frames": [
            {
              "note": "Candidates 2, 3, 5 can be reused. dfs(start, rem) may only pick indexes from start onward, so [2,3] and [3,2] never both appear.",
              "vars": {
                "rem": 8
              },
              "stack": []
            },
            {
              "note": "Take 2 (index 0). rem = 6. We recurse with the same start 0, so 2 can be taken again.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "rem": 6
              },
              "stack": [
                2
              ]
            },
            {
              "note": "Take 2 (index 0). rem = 4. We recurse with the same start 0, so 2 can be taken again.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "rem": 4
              },
              "stack": [
                2,
                2
              ]
            },
            {
              "note": "Take 2 (index 0). rem = 2. We recurse with the same start 0, so 2 can be taken again.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "rem": 2
              },
              "stack": [
                2,
                2,
                2
              ]
            },
            {
              "note": "Take 2: rem = 0. The picks add up to 8, so save [2, 2, 2, 2].",
              "hl": {
                "0": "ok"
              },
              "ptrs": {
                "i": 0
              },
              "vars": {
                "rem": 0
              },
              "stack": [
                2,
                2,
                2,
                2
              ]
            },
            {
              "note": "Take 3: rem = 1, but no candidate from index 1 on is small enough. Dead end, pop 3.",
              "hl": {
                "1": "bad"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "rem": 1
              },
              "stack": [
                2,
                2,
                3
              ]
            },
            {
              "note": "Take 3 (index 1). rem = 3. We recurse with the same start 1, so 3 can be taken again.",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "rem": 3
              },
              "stack": [
                2,
                3
              ]
            },
            {
              "note": "Take 3: rem = 0. The picks add up to 8, so save [2, 3, 3].",
              "hl": {
                "1": "ok"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "rem": 0
              },
              "stack": [
                2,
                3,
                3
              ]
            },
            {
              "note": "Take 5: rem = 1, but no candidate from index 2 on is small enough. Dead end, pop 5.",
              "hl": {
                "2": "bad"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "rem": 1
              },
              "stack": [
                2,
                5
              ]
            },
            {
              "note": "Take 3 (index 1). rem = 5. We recurse with the same start 1, so 3 can be taken again.",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "rem": 5
              },
              "stack": [
                3
              ]
            },
            {
              "note": "Take 3: rem = 2, but no candidate from index 1 on is small enough. Dead end, pop 3.",
              "hl": {
                "1": "bad"
              },
              "ptrs": {
                "i": 1
              },
              "vars": {
                "rem": 2
              },
              "stack": [
                3,
                3
              ]
            },
            {
              "note": "Take 5: rem = 0. The picks add up to 8, so save [3, 5].",
              "hl": {
                "2": "ok"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "rem": 0
              },
              "stack": [
                3,
                5
              ]
            },
            {
              "note": "Take 5: rem = 3, but no candidate from index 2 on is small enough. Dead end, pop 5.",
              "hl": {
                "2": "bad"
              },
              "ptrs": {
                "i": 2
              },
              "vars": {
                "rem": 3
              },
              "stack": [
                5
              ],
              "out": "Answer: [2,2,2,2] [2,3,3] [3,5]"
            }
          ]
        }
      },
      "code": "vector<vector<int>> combinationSum(vector<int>& c, int target) {\n    sort(c.begin(), c.end());\n    vector<vector<int>> res;\n    vector<int> cur;\n    function<void(int, int)> dfs = [&](int start, int rem) {\n        if (rem == 0) { res.push_back(cur); return; }\n        for (int i = start; i < (int)c.size(); i++) {\n            if (c[i] > rem) break;            // sorted: the rest are too big too\n            cur.push_back(c[i]);\n            dfs(i, rem - c[i]);               // pass i (not i + 1): reuse allowed\n            cur.pop_back();\n        }\n    };\n    dfs(0, target);\n    return res;\n}",
      "complexity": "Time is exponential, roughly O(2^target) in the worst case, since the tree can be that deep and wide. Space O(target / min candidate) for the recursion depth.",
      "mistakes": [
        "Starting the loop at 0 every time. You then get the same set in every order, for example [2,3,3] and [3,2,3].",
        "Passing i + 1 when reuse is allowed (or i when it is not). That one character changes the whole problem.",
        "Not sorting before using break. Without sorting, use continue instead of break or you will cut valid branches."
      ],
      "practice": [
        77,
        39,
        40,
        216
      ]
    },
    "3": {
      "name": "Skip duplicates",
      "when": "The input has repeated values but the answer must not contain the same set twice: Subsets II, Permutations II, Combination Sum II. Look for 'the solution set must not contain duplicates'.",
      "idea": "Duplicates make two different branches build identical answers. The fix is to sort first, so equal values sit side by side, and then apply one rule: inside one loop, if nums[i] equals nums[i - 1] and i is not the first index of this loop, skip it. Why does that work? At one level of the tree, the first 2 already explores every answer that starts with a 2 from there. A second 2 at the same level would only rebuild those answers. But a 2 that comes after a deeper pick (i == start) is fine, because it is the first 2 at its own level.",
      "steps": [
        "Sort the array so equal values are neighbours.",
        "Write dfs(start) and save cur right away (for subsets, every path is an answer).",
        "Loop i from start. If i > start and nums[i] == nums[i - 1], continue.",
        "Otherwise push nums[i], call dfs(i + 1), and pop.",
        "The condition is i > start, not i > 0. Using i > 0 would also block the valid [1,2,2]."
      ],
      "example": {
        "problem": "Subsets II: nums = [1, 2, 2]. Return all distinct subsets. Output: [], [1], [1,2], [1,2,2], [2], [2,2] (6 subsets, not 8).",
        "walk": "The pointers show i (the candidate) and start (where this loop began). Look at the two red frames: the second 2 is skipped when it would be a sibling of a 2 we just explored. But in [1,2,2] the last 2 is taken, because there i equals start, so it is not a sibling duplicate.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            2
          ],
          "frames": [
            {
              "note": "Sorted input [1, 2, 2]. Every call saves cur first, because every path is a subset. The empty set is saved now.",
              "stack": [],
              "vars": {
                "saved": 1
              }
            },
            {
              "note": "Take nums[0] = 1. cur = [1] is a valid subset, so save it (2 saved).",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0,
                "start": 0
              },
              "stack": [
                1
              ],
              "vars": {
                "saved": 2
              }
            },
            {
              "note": "Take nums[1] = 2. cur = [1, 2] is a valid subset, so save it (3 saved).",
              "hl": {
                "0": "b",
                "1": "a"
              },
              "ptrs": {
                "i": 1,
                "start": 1
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "saved": 3
              }
            },
            {
              "note": "Take nums[2] = 2. cur = [1, 2, 2] is a valid subset, so save it (4 saved). Here i == start, so this is the first pick at this level and it is allowed.",
              "hl": {
                "0": "b",
                "1": "b",
                "2": "a"
              },
              "ptrs": {
                "i": 2,
                "start": 2
              },
              "stack": [
                1,
                2,
                2
              ],
              "vars": {
                "saved": 4
              }
            },
            {
              "note": "i = 2 is later than start = 1, and nums[2] equals nums[1]. Taking this 2 would repeat a subset we already built, so skip it.",
              "hl": {
                "0": "b",
                "2": "bad"
              },
              "ptrs": {
                "i": 2,
                "start": 1
              },
              "stack": [
                1
              ],
              "vars": {
                "saved": 4
              }
            },
            {
              "note": "Take nums[1] = 2. cur = [2] is a valid subset, so save it (5 saved).",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1,
                "start": 0
              },
              "stack": [
                2
              ],
              "vars": {
                "saved": 5
              }
            },
            {
              "note": "Take nums[2] = 2. cur = [2, 2] is a valid subset, so save it (6 saved). Here i == start, so this is the first pick at this level and it is allowed.",
              "hl": {
                "1": "b",
                "2": "a"
              },
              "ptrs": {
                "i": 2,
                "start": 2
              },
              "stack": [
                2,
                2
              ],
              "vars": {
                "saved": 6
              }
            },
            {
              "note": "i = 2 is later than start = 0, and nums[2] equals nums[1]. Taking this 2 would repeat a subset we already built, so skip it.",
              "hl": {
                "2": "bad"
              },
              "ptrs": {
                "i": 2,
                "start": 0
              },
              "stack": [],
              "vars": {
                "saved": 6
              },
              "out": "6 distinct subsets"
            }
          ]
        }
      },
      "code": "vector<vector<int>> subsetsWithDup(vector<int>& nums) {\n    sort(nums.begin(), nums.end());           // equal values become neighbours\n    vector<vector<int>> res;\n    vector<int> cur;\n    function<void(int)> dfs = [&](int start) {\n        res.push_back(cur);                   // every path is a subset\n        for (int i = start; i < (int)nums.size(); i++) {\n            if (i > start && nums[i] == nums[i - 1]) continue;   // same value at this level\n            cur.push_back(nums[i]);\n            dfs(i + 1);\n            cur.pop_back();\n        }\n    };\n    dfs(0);\n    return res;\n}",
      "complexity": "Time O(n * 2^n) in the worst case, plus O(n log n) to sort. Space O(n) for recursion and cur, not counting the output.",
      "mistakes": [
        "Forgetting to sort. The neighbour check only works when equal values are next to each other.",
        "Writing i > 0 instead of i > start. That also skips legal picks such as the second 2 in [1,2,2].",
        "Using a set of vectors to remove duplicates afterwards. It passes but wastes time; prune during the search instead."
      ],
      "practice": [
        90,
        47,
        40
      ]
    },
    "4": {
      "name": "Partitioning a string",
      "when": "You must cut a string into pieces so that every piece obeys a rule: palindrome partitioning, restore IP addresses, word break with all answers. The answer is a list of ways to cut.",
      "idea": "Stand at index start, the first character not yet cut. Try every possible first piece s[start..end], from one character up to the whole rest. If the piece is valid (a palindrome, a number from 0 to 255, a dictionary word), push it and recurse from end + 1 to partition what is left. If it is not valid, skip it and try a longer piece. When start reaches the end of the string, the pieces in cur are a complete valid partition, so save them.",
      "steps": [
        "Keep cur (the pieces so far) and res. Write dfs(start).",
        "If start == s.size(), the whole string is cut: save a copy of cur and return.",
        "Loop end from start to the last index. The candidate piece is s[start..end].",
        "If the piece is valid, push it, call dfs(end + 1), then pop it.",
        "If it is invalid, just continue; a longer piece may still be valid."
      ],
      "example": {
        "problem": "Palindrome Partitioning: s = \"abba\". Return every way to cut it into palindromes. Output: [a,b,b,a], [a,bb,a], [abba].",
        "walk": "The dashed window is the piece we are testing. Red means it is not a palindrome and is rejected at once, which prunes the whole branch below it. Green means a full valid partition. See how 'ab' and 'abb' fail instantly, while 'bb' opens a second answer.",
        "viz": {
          "kind": "array",
          "cells": [
            "a",
            "b",
            "b",
            "a"
          ],
          "frames": [
            {
              "note": "Cut 'abba' into pieces that are all palindromes. At each start index we try every prefix: one letter, two letters, and so on.",
              "vars": {
                "start": 0,
                "found": 0
              },
              "stack": []
            },
            {
              "note": "start = 0: try 'a'. It is a palindrome, so keep it and recurse from index 1.",
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "stack": [
                "a"
              ],
              "vars": {
                "start": 0,
                "found": 0
              }
            },
            {
              "note": "start = 1: try 'b'. It is a palindrome, so keep it and recurse from index 2.",
              "win": [
                1,
                1
              ],
              "hl": {
                "1": "a"
              },
              "stack": [
                "a",
                "b"
              ],
              "vars": {
                "start": 1,
                "found": 0
              }
            },
            {
              "note": "start = 2: try 'b'. It is a palindrome, so keep it and recurse from index 3.",
              "win": [
                2,
                2
              ],
              "hl": {
                "2": "a"
              },
              "stack": [
                "a",
                "b",
                "b"
              ],
              "vars": {
                "start": 2,
                "found": 0
              }
            },
            {
              "note": "start = 3: 'a' is a palindrome and it reaches the end. Save [\"a\", \"b\", \"b\", \"a\"].",
              "win": [
                3,
                3
              ],
              "hl": {
                "3": "ok"
              },
              "stack": [
                "a",
                "b",
                "b",
                "a"
              ],
              "vars": {
                "start": 3,
                "found": 1
              }
            },
            {
              "note": "start = 2: try 'ba'. It is not a palindrome, so this prefix is rejected and we try a longer one.",
              "win": [
                2,
                3
              ],
              "hl": {
                "2": "bad",
                "3": "bad"
              },
              "stack": [
                "a",
                "b"
              ],
              "vars": {
                "start": 2,
                "found": 1
              }
            },
            {
              "note": "start = 1: try 'bb'. It is a palindrome, so keep it and recurse from index 3.",
              "win": [
                1,
                2
              ],
              "hl": {
                "1": "a",
                "2": "a"
              },
              "stack": [
                "a",
                "bb"
              ],
              "vars": {
                "start": 1,
                "found": 1
              }
            },
            {
              "note": "start = 3: 'a' is a palindrome and it reaches the end. Save [\"a\", \"bb\", \"a\"].",
              "win": [
                3,
                3
              ],
              "hl": {
                "3": "ok"
              },
              "stack": [
                "a",
                "bb",
                "a"
              ],
              "vars": {
                "start": 3,
                "found": 2
              }
            },
            {
              "note": "start = 1: try 'bba'. It is not a palindrome, so this prefix is rejected and we try a longer one.",
              "win": [
                1,
                3
              ],
              "hl": {
                "1": "bad",
                "2": "bad",
                "3": "bad"
              },
              "stack": [
                "a"
              ],
              "vars": {
                "start": 1,
                "found": 2
              }
            },
            {
              "note": "start = 0: try 'ab'. It is not a palindrome, so this prefix is rejected and we try a longer one.",
              "win": [
                0,
                1
              ],
              "hl": {
                "0": "bad",
                "1": "bad"
              },
              "stack": [],
              "vars": {
                "start": 0,
                "found": 2
              }
            },
            {
              "note": "start = 0: try 'abb'. It is not a palindrome, so this prefix is rejected and we try a longer one.",
              "win": [
                0,
                2
              ],
              "hl": {
                "0": "bad",
                "1": "bad",
                "2": "bad"
              },
              "stack": [],
              "vars": {
                "start": 0,
                "found": 2
              }
            },
            {
              "note": "start = 0: 'abba' is a palindrome and it reaches the end. Save [\"abba\"].",
              "win": [
                0,
                3
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok"
              },
              "stack": [
                "abba"
              ],
              "vars": {
                "start": 0,
                "found": 3
              },
              "out": "3 partitions"
            }
          ]
        }
      },
      "code": "vector<vector<string>> partition(string s) {\n    vector<vector<string>> res;\n    vector<string> cur;\n    auto isPal = [&](int l, int r) {          // is s[l..r] a palindrome?\n        while (l < r) if (s[l++] != s[r--]) return false;\n        return true;\n    };\n    function<void(int)> dfs = [&](int start) {\n        if (start == (int)s.size()) {         // the whole string is cut\n            res.push_back(cur);\n            return;\n        }\n        for (int end = start; end < (int)s.size(); end++) {\n            if (!isPal(start, end)) continue; // invalid piece: try a longer one\n            cur.push_back(s.substr(start, end - start + 1));\n            dfs(end + 1);                     // cut the rest\n            cur.pop_back();\n        }\n    };\n    dfs(0);\n    return res;\n}",
      "complexity": "Time O(n * 2^n): up to 2^(n-1) ways to cut, and each palindrome check and copy costs O(n). Space O(n) for recursion and cur.",
      "mistakes": [
        "Recursing with dfs(end) or dfs(start + 1) instead of dfs(end + 1). Pieces then overlap or repeat characters.",
        "Forgetting to pop the piece after the recursive call.",
        "Using substr with the wrong length. s.substr(start, end - start + 1) has length end - start + 1."
      ],
      "practice": [
        131,
        93
      ]
    },
    "5": {
      "name": "Grid or board search",
      "when": "You must find a path, word or arrangement inside a 2D grid by stepping to neighbouring cells, and a cell may not be used twice in one path. Typical words: 'exists', 'adjacent cells', 'the same cell may not be used more than once'.",
      "idea": "Start a depth-first search from every cell that could begin the answer. At a cell, first check that it is inside the grid, not visited, and matches what you need. Then mark it visited (many people overwrite it with '#'), try all four directions, and finally unmark it. Unmarking is the backtracking step: it frees the cell so a different path, started elsewhere, can use it. If any direction returns true, stop at once and pass true all the way up.",
      "steps": [
        "Loop over every cell and call dfs(r, c, k) where k is how many letters are already matched.",
        "If k equals the word length, return true: everything matched.",
        "Return false if the cell is out of bounds, already visited, or does not equal word[k].",
        "Mark the cell visited, then try the four neighbours with k + 1 and stop on the first true.",
        "Unmark the cell before returning, so other paths can use it again."
      ],
      "example": {
        "problem": "Word Search: board rows CAB, BAB, BAA, word \"BABB\". Neighbours are tried in the order down, up, right, left. Output: true.",
        "walk": "Violet cells are the current path and orange is the cell being extended. The red cell is a dead end: the path matched so far but no neighbour continues it, so we unmark it (it turns back to normal) and the search tries the next direction from the cell before it. The green path at the end is the answer.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              "C",
              "A",
              "B"
            ],
            [
              "B",
              "A",
              "B"
            ],
            [
              "B",
              "A",
              "A"
            ]
          ],
          "frames": [
            {
              "note": "Find the word BABB by moving up, down, left or right, never reusing a cell. Scan for a cell that matches the first letter, then explore from it.",
              "stack": [],
              "vars": {
                "matched": 0
              }
            },
            {
              "note": "Cell (0,2) is 'B', matching letter 1. Mark it visited and look around for 'A'.",
              "hl": {
                "0,2": "a"
              },
              "stack": [
                "B"
              ],
              "vars": {
                "matched": 1
              }
            },
            {
              "note": "Cell (0,1) is 'A', matching letter 2. Mark it visited and look around for 'B'.",
              "hl": {
                "0,2": "b",
                "0,1": "a"
              },
              "stack": [
                "B",
                "A"
              ],
              "vars": {
                "matched": 2
              }
            },
            {
              "note": "Dead end: no unused neighbour of (0,1) holds 'B'. Unmark this cell and step back to try another direction.",
              "hl": {
                "0,2": "b",
                "0,1": "bad"
              },
              "stack": [
                "B"
              ],
              "vars": {
                "matched": 1
              }
            },
            {
              "note": "Dead end: no unused neighbour of (0,2) holds 'A'. Unmark this cell and step back to try another direction.",
              "hl": {
                "0,2": "bad"
              },
              "stack": [],
              "vars": {
                "matched": 0
              }
            },
            {
              "note": "Cell (1,0) is 'B', matching letter 1. Mark it visited and look around for 'A'.",
              "hl": {
                "1,0": "a"
              },
              "stack": [
                "B"
              ],
              "vars": {
                "matched": 1
              }
            },
            {
              "note": "Cell (1,1) is 'A', matching letter 2. Mark it visited and look around for 'B'.",
              "hl": {
                "1,0": "b",
                "1,1": "a"
              },
              "stack": [
                "B",
                "A"
              ],
              "vars": {
                "matched": 2
              }
            },
            {
              "note": "Cell (1,2) is 'B', matching letter 3. Mark it visited and look around for 'B'.",
              "hl": {
                "1,0": "b",
                "1,1": "b",
                "1,2": "a"
              },
              "stack": [
                "B",
                "A",
                "B"
              ],
              "vars": {
                "matched": 3
              }
            },
            {
              "note": "Cell (0,2) is 'B', the last letter. Every letter matched along a path of unused cells, so the word exists.",
              "hl": {
                "1,0": "ok",
                "1,1": "ok",
                "1,2": "ok",
                "0,2": "ok"
              },
              "stack": [
                "B",
                "A",
                "B",
                "B"
              ],
              "vars": {
                "matched": 4
              },
              "out": "Word found"
            }
          ]
        }
      },
      "code": "bool exist(vector<vector<char>>& b, string w) {\n    int R = b.size(), C = b[0].size();\n    int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};\n    function<bool(int, int, int)> dfs = [&](int r, int c, int k) {\n        if (k == (int)w.size()) return true;               // every letter matched\n        if (r < 0 || c < 0 || r >= R || c >= C || b[r][c] != w[k]) return false;\n        char keep = b[r][c];\n        b[r][c] = '#';                                     // mark visited\n        bool found = false;\n        for (int d = 0; d < 4 && !found; d++)\n            found = dfs(r + dr[d], c + dc[d], k + 1);\n        b[r][c] = keep;                                    // unmark (backtrack)\n        return found;\n    };\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++)\n            if (dfs(r, c, 0)) return true;\n    return false;\n}",
      "complexity": "Time O(R * C * 3^L) where L is the word length: each step has at most 3 new directions. Space O(L) for the recursion; the grid itself is reused as the visited marker.",
      "mistakes": [
        "Forgetting to restore the cell after the search. The board is then damaged and later start cells fail wrongly.",
        "Checking the bounds after reading b[r][c]. Always test r and c first, or you read outside the grid.",
        "Not stopping once a path is found. Use the found flag so you do not keep exploring and unmarking needlessly."
      ],
      "practice": [
        79,
        51
      ]
    },
    "6": {
      "name": "Constraint placement with pruning",
      "when": "You place items one by one under rules that earlier placements break: N-Queens, Sudoku, matchsticks into sides. The word 'valid' on a partial state is the clue, and brute force would be hopeless.",
      "idea": "Place things row by row (or cell by cell). For each row, try every column, but before placing, check the rules. If the spot is attacked or illegal, skip it immediately instead of exploring below it. That skip is pruning, and it cuts away huge parts of the tree. Make the checks O(1) by storing what is taken: a set for columns, one for diagonals (row - col is constant on one) and one for anti-diagonals (row + col is constant on the other). If a row has no legal spot at all, return and let the earlier row move its piece.",
      "steps": [
        "Keep boolean arrays for columns, diagonals (r - c) and anti-diagonals (r + c), and the board.",
        "Write dfs(r). If r == n, the board is complete: save it.",
        "For each column c, skip it if col[c], diag[r - c] or anti[r + c] is already taken.",
        "Otherwise place the queen, set the three flags, and call dfs(r + 1).",
        "After the call, remove the queen and clear the three flags."
      ],
      "example": {
        "problem": "N-Queens with n = 4: place 4 queens so none attack each other. The full answer has 2 boards; the animation follows the search until it finds the first, columns 1, 3, 0, 2.",
        "walk": "Green queens are fixed, the orange one is the newest, red cells in the current row are attacked. Watch row 2 in the third frame: all four cells are red, so the search backs up without trying anything deeper. That early stop is the pruning. A good first queen at column 1 finally leads to a full board.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ]
          ],
          "rows": [
            "r0",
            "r1",
            "r2",
            "r3"
          ],
          "cols": [
            "c0",
            "c1",
            "c2",
            "c3"
          ],
          "frames": [
            {
              "note": "Place one queen per row on a 4 by 4 board. A queen attacks its column and both diagonals. We track those in sets, so each check is O(1).",
              "vars": {
                "row": 0,
                "cols": "-"
              }
            },
            {
              "note": "Row 0: place a queen at column 0.",
              "hl": {
                "0,0": "a"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 0,
                "cols": "0"
              }
            },
            {
              "note": "Row 1: place a queen at column 2. Columns 0, 1 are attacked (red).",
              "hl": {
                "0,0": "ok",
                "1,2": "a",
                "1,0": "bad",
                "1,1": "bad"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Q",
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 1,
                "cols": "0,2"
              }
            },
            {
              "note": "Row 2: every column is attacked (red). Dead end. Undo the last queen and try its next column.",
              "hl": {
                "0,0": "ok",
                "1,2": "ok",
                "2,0": "bad",
                "2,1": "bad",
                "2,2": "bad",
                "2,3": "bad"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Q",
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 2,
                "cols": "0,2"
              }
            },
            {
              "note": "Back at row 1, the next safe column is 3. Place a queen at (1,3) and move on.",
              "hl": {
                "0,0": "ok",
                "1,3": "a",
                "1,0": "bad",
                "1,1": "bad"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 1,
                "cols": "0,3"
              }
            },
            {
              "note": "Row 2: place a queen at column 1. Columns 0, 2, 3 are attacked (red).",
              "hl": {
                "0,0": "ok",
                "1,3": "ok",
                "2,1": "a",
                "2,0": "bad",
                "2,2": "bad",
                "2,3": "bad"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 2,
                "cols": "0,3,1"
              }
            },
            {
              "note": "Row 3: every column is attacked (red). Dead end. Undo the last queen and try its next column.",
              "hl": {
                "0,0": "ok",
                "1,3": "ok",
                "2,1": "ok",
                "3,0": "bad",
                "3,1": "bad",
                "3,2": "bad",
                "3,3": "bad"
              },
              "cells": [
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 3,
                "cols": "0,3,1"
              }
            },
            {
              "note": "Back at row 0, the next safe column is 1. Place a queen at (0,1) and move on.",
              "hl": {
                "0,1": "a"
              },
              "cells": [
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 0,
                "cols": "1"
              }
            },
            {
              "note": "Row 1: place a queen at column 3. Columns 0, 1, 2 are attacked (red).",
              "hl": {
                "0,1": "ok",
                "1,3": "a",
                "1,0": "bad",
                "1,1": "bad",
                "1,2": "bad"
              },
              "cells": [
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 1,
                "cols": "1,3"
              }
            },
            {
              "note": "Row 2: place a queen at column 0. Columns 1, 2, 3 are attacked (red).",
              "hl": {
                "0,1": "ok",
                "1,3": "ok",
                "2,0": "a",
                "2,1": "bad",
                "2,2": "bad",
                "2,3": "bad"
              },
              "cells": [
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "vars": {
                "row": 2,
                "cols": "1,3,0"
              }
            },
            {
              "note": "Row 3: column 2 is the only safe cell. All 4 queens are placed with no conflicts. First solution found.",
              "hl": {
                "0,1": "ok",
                "1,3": "ok",
                "2,0": "ok",
                "3,2": "a",
                "3,0": "bad",
                "3,1": "bad",
                "3,3": "bad"
              },
              "cells": [
                [
                  null,
                  "Q",
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  "Q"
                ],
                [
                  "Q",
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  "Q",
                  null
                ]
              ],
              "vars": {
                "row": 3,
                "cols": "1,3,0,2"
              },
              "out": "Solution: columns 1, 3, 0, 2"
            }
          ]
        }
      },
      "code": "vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> res;\n    vector<string> board(n, string(n, '.'));\n    vector<bool> col(n), diag(2 * n), anti(2 * n);    // taken columns and diagonals\n    function<void(int)> dfs = [&](int r) {\n        if (r == n) { res.push_back(board); return; } // all rows have a queen\n        for (int c = 0; c < n; c++) {\n            if (col[c] || diag[r - c + n] || anti[r + c]) continue;   // attacked: prune\n            col[c] = diag[r - c + n] = anti[r + c] = true;\n            board[r][c] = 'Q';\n            dfs(r + 1);\n            board[r][c] = '.';                        // undo\n            col[c] = diag[r - c + n] = anti[r + c] = false;\n        }\n    };\n    dfs(0);\n    return res;\n}",
      "complexity": "Time is exponential but far below n^n thanks to pruning (roughly O(n!)). Space O(n) for the flags and recursion, plus the output boards.",
      "mistakes": [
        "Using r - c as an index without adding n. It can be negative and crashes the array.",
        "Forgetting to clear all three flags when undoing, which leaves phantom attacks behind.",
        "Checking the whole board for conflicts at every placement. That is O(n) per check; the flags make it O(1)."
      ],
      "practice": [
        51,
        37,
        473
      ]
    }
  },
  "8": {
    "0": {
      "name": "DFS traversals",
      "when": "You must visit every node and either list values in a particular order (preorder, inorder, postorder) or do simple work on each node, such as inverting the tree, comparing two trees or collecting values.",
      "idea": "Depth-first search goes all the way down one side before coming back. The recursive function is tiny: handle null, recurse left, recurse right. The only thing that changes between the three famous orders is where you touch the node. Preorder: before the two recursive calls (root, left, right). Inorder: between them (left, root, right). Postorder: after both (left, right, root). On a binary search tree, inorder gives the values in sorted order.",
      "steps": [
        "Base case: if the node is null, return.",
        "Preorder: process the node here, before the recursive calls.",
        "Call the function on node->left.",
        "Inorder: process the node here, between the two calls.",
        "Call the function on node->right.",
        "Postorder: process the node here, after both calls."
      ],
      "example": {
        "problem": "Binary tree [1, 2, 3, 4, 5] (node 1 has children 2 and 3, node 2 has children 4 and 5). Output: preorder 1 2 4 5 3, inorder 4 2 5 1 3, postorder 4 5 2 3 1.",
        "walk": "The stack panel is the call stack, the three chips are the lists being built. Follow node 2: it writes to pre when entered, to in after its left child 4 returns, and to post after 5 returns. Same walk, three moments. Leaves write to all three at once.",
        "viz": {
          "kind": "tree",
          "cells": [
            1,
            2,
            3,
            4,
            5
          ],
          "frames": [
            {
              "note": "Tree [1,2,3,4,5]. One recursive walk will build all three orders. Watch where the node's value is written: before, between or after the children.",
              "hl": {
                "0": "a"
              },
              "stack": [],
              "vars": {
                "pre": "-",
                "in": "-",
                "post": "-"
              }
            },
            {
              "note": "Enter node 1. Preorder writes it now, before visiting any child.",
              "hl": {
                "0": "a"
              },
              "stack": [
                1
              ],
              "vars": {
                "pre": "1",
                "in": "-",
                "post": "-"
              }
            },
            {
              "note": "Enter node 2. Preorder writes it now, before visiting any child.",
              "hl": {
                "0": "b",
                "1": "a"
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "pre": "1 2",
                "in": "-",
                "post": "-"
              }
            },
            {
              "note": "Node 4 is a leaf. Preorder, inorder and postorder all write it now, because it has no children to go around.",
              "hl": {
                "0": "b",
                "1": "b",
                "3": "a"
              },
              "stack": [
                1,
                2,
                4
              ],
              "vars": {
                "pre": "1 2 4",
                "in": "4",
                "post": "4"
              }
            },
            {
              "note": "Left subtree of 2 is finished. Inorder writes 2 now, between the two children.",
              "hl": {
                "0": "b",
                "1": "a",
                "3": "ok"
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "pre": "1 2 4",
                "in": "4 2",
                "post": "4"
              }
            },
            {
              "note": "Node 5 is a leaf. Preorder, inorder and postorder all write it now, because it has no children to go around.",
              "hl": {
                "0": "b",
                "1": "b",
                "3": "ok",
                "4": "a"
              },
              "stack": [
                1,
                2,
                5
              ],
              "vars": {
                "pre": "1 2 4 5",
                "in": "4 2 5",
                "post": "4 5"
              }
            },
            {
              "note": "Both subtrees of 2 are finished. Postorder writes it now, after the children, and the call returns.",
              "hl": {
                "0": "b",
                "1": "a",
                "3": "ok",
                "4": "ok"
              },
              "stack": [
                1,
                2
              ],
              "vars": {
                "pre": "1 2 4 5",
                "in": "4 2 5",
                "post": "4 5 2"
              }
            },
            {
              "note": "Left subtree of 1 is finished. Inorder writes 1 now, between the two children.",
              "hl": {
                "0": "a",
                "1": "ok",
                "3": "ok",
                "4": "ok"
              },
              "stack": [
                1
              ],
              "vars": {
                "pre": "1 2 4 5",
                "in": "4 2 5 1",
                "post": "4 5 2"
              }
            },
            {
              "note": "Node 3 is a leaf. Preorder, inorder and postorder all write it now, because it has no children to go around.",
              "hl": {
                "0": "b",
                "1": "ok",
                "2": "a",
                "3": "ok",
                "4": "ok"
              },
              "stack": [
                1,
                3
              ],
              "vars": {
                "pre": "1 2 4 5 3",
                "in": "4 2 5 1 3",
                "post": "4 5 2 3"
              }
            },
            {
              "note": "Both subtrees of 1 are finished. Postorder writes it now, after the children, and the call returns.",
              "hl": {
                "0": "a",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok"
              },
              "stack": [
                1
              ],
              "vars": {
                "pre": "1 2 4 5 3",
                "in": "4 2 5 1 3",
                "post": "4 5 2 3 1"
              },
              "out": "Inorder: 4 2 5 1 3"
            }
          ]
        }
      },
      "code": "void dfs(TreeNode* n, vector<int>& pre, vector<int>& in, vector<int>& post) {\n    if (!n) return;                       // empty subtree: nothing to do\n    pre.push_back(n->val);                // preorder: before the children\n    dfs(n->left, pre, in, post);\n    in.push_back(n->val);                 // inorder: between the children\n    dfs(n->right, pre, in, post);\n    post.push_back(n->val);               // postorder: after the children\n}\n\nvector<int> inorderTraversal(TreeNode* root) {\n    vector<int> pre, in, post;\n    dfs(root, pre, in, post);\n    return in;                            // return pre or post for the other orders\n}",
      "complexity": "Time O(n), every node is visited once. Space O(h) for the call stack, where h is the height (up to n for a chain-shaped tree).",
      "mistakes": [
        "Mixing up the three orders. Remember the name tells where the root goes: pre = first, in = middle, post = last.",
        "Forgetting the null check, which dereferences a null pointer at every leaf.",
        "Passing the result vectors by value instead of by reference, so the caller sees nothing."
      ],
      "practice": [
        94,
        226,
        100,
        101
      ]
    },
    "1": {
      "name": "Bottom-up return value",
      "when": "The answer for a node can be built from the answers of its children: height, depth, size, is-balanced, same tree, symmetric tree, count of something.",
      "idea": "Write the function for one node and trust it for the children. Ask each child a question, get its answer back, combine the two answers with the current node, and return the result upward. Because the answers are produced after the children are done, this is postorder. For height: a missing node returns 0, and any other node returns 1 + max(left height, right height).",
      "steps": [
        "Decide what the function returns for a node. Here it is the height of that subtree.",
        "Write the base case: if the node is null, return the value for 'nothing' (0 for height).",
        "Recurse into left and right and keep both returned answers.",
        "Combine them with the current node, for example 1 + max(left, right).",
        "Return that value. The caller will use it in its own combine step."
      ],
      "example": {
        "problem": "Maximum depth of the binary tree [3, 9, 20, null, null, 15, 7]. Expected answer: 3.",
        "walk": "The orange number beside each node is the value its call returns. Leaves return 1, node 20 combines two 1s into 2, and the root combines 1 and 2 into 3. Every node is visited exactly once, so there is no repeated work.",
        "viz": {
          "kind": "tree",
          "cells": [
            3,
            9,
            20,
            null,
            null,
            15,
            7
          ],
          "frames": [
            {
              "note": "Goal: max depth of the tree. Each call returns the height of its subtree. Calls go down first, answers come back up.",
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "Node 9 is a leaf. Both children are null and return 0, so it returns 1 + max(0, 0) = 1.",
              "hl": {
                "1": "a"
              },
              "tags": {
                "1": 1
              }
            },
            {
              "note": "Node 15 is a leaf too, so it returns 1.",
              "hl": {
                "1": "ok",
                "5": "a"
              },
              "tags": {
                "1": 1,
                "5": 1
              }
            },
            {
              "note": "Node 7 is a leaf, so it returns 1.",
              "hl": {
                "1": "ok",
                "5": "ok",
                "6": "a"
              },
              "tags": {
                "1": 1,
                "5": 1,
                "6": 1
              }
            },
            {
              "note": "Node 20 gets 1 from the left and 1 from the right, and returns 1 + max(1, 1) = 2.",
              "hl": {
                "1": "ok",
                "2": "a",
                "5": "b",
                "6": "b"
              },
              "tags": {
                "1": 1,
                "2": 2,
                "5": 1,
                "6": 1
              }
            },
            {
              "note": "The root gets 1 from node 9 and 2 from node 20, and returns 1 + max(1, 2) = 3.",
              "hl": {
                "0": "ok",
                "1": "b",
                "2": "b"
              },
              "tags": {
                "0": 3,
                "1": 1,
                "2": 2,
                "5": 1,
                "6": 1
              },
              "out": "Max depth = 3"
            }
          ]
        }
      },
      "code": "int maxDepth(TreeNode* root) {\n    if (!root) return 0;                // empty subtree has height 0\n    int left  = maxDepth(root->left);   // answer from the left child\n    int right = maxDepth(root->right);  // answer from the right child\n    return 1 + max(left, right);        // combine, then return upward\n}",
      "complexity": "Time O(n) since each node is visited once. Space O(h) for the recursion stack, where h is the tree height (O(n) for a completely skewed tree).",
      "mistakes": [
        "Forgetting the null base case, which crashes when you reach the children of a leaf.",
        "Storing the answer in a global variable when return values alone would do. It makes the code harder to reason about.",
        "Mixing up depth (counted from the root down) and height (counted from the leaves up)."
      ],
      "practice": [
        104,
        110,
        100,
        101
      ]
    },
    "2": {
      "name": "Return one thing, update another",
      "when": "The answer is a path that can bend at any node, but a parent can only continue one downward branch: diameter, maximum path sum, longest univalue path. The returned value and the answer are different things.",
      "idea": "A path that turns at a node uses both children. But the parent above can only extend one downward chain, so what you return upward must be single-sided. That is why you need two things. Return the best straight-down value (like the height). Use a separate variable (a reference or a captured variable) to record the best bent path, computed at each node from both children: left + right. After the recursion ends, that variable holds the answer, not the return value.",
      "steps": [
        "Declare best (the global answer) before the recursion starts.",
        "Write a function that returns the best straight-down value from a node, and returns 0 for null.",
        "Get left and right from the two recursive calls.",
        "Update the answer with the path that bends here, for example best = max(best, left + right).",
        "Return the one-sided value to the parent, for example 1 + max(left, right).",
        "Return best after the top-level call finishes."
      ],
      "example": {
        "problem": "Diameter of a binary tree with level-order [1, 2, null, 3, 4, null, null, 5, null, null, 6]. The diameter is the number of edges on the longest path. Output: 4 (path 5-3-2-4-6).",
        "walk": "The orange number on each node is what it RETURNS (its height). The chip best is what it UPDATES. At node 2 the two child heights are 2 and 2, so a bent path through 2 has 4 edges and best jumps to 4. The root returns 4 but only finds a path of 3 edges, so it does not change best. The answer is best, never the root's return.",
        "viz": {
          "kind": "tree",
          "cells": [
            1,
            2,
            null,
            3,
            4,
            null,
            null,
            5,
            null,
            null,
            6
          ],
          "frames": [
            {
              "note": "Find the longest path (in edges) between any two nodes. The best path may not pass through the root. Each call returns a height and also updates best.",
              "hl": {
                "0": "a"
              },
              "vars": {
                "best": 0
              }
            },
            {
              "note": "Node 5: left height 0, right height 0. Bending here gives 0 edges, no better than 0. It returns 1 upward.",
              "hl": {
                "7": "a"
              },
              "tags": {
                "7": 1
              },
              "vars": {
                "left": 0,
                "right": 0,
                "best": 0
              }
            },
            {
              "note": "Node 3: left height 1, right height 0. A path bending here has 1+0 = 1 edges, a new best. It returns 2 upward (one side only).",
              "hl": {
                "3": "a",
                "7": "b"
              },
              "tags": {
                "3": 2,
                "7": 1
              },
              "vars": {
                "left": 1,
                "right": 0,
                "best": 1
              }
            },
            {
              "note": "Node 6: left height 0, right height 0. Bending here gives 0 edges, no better than 1. It returns 1 upward.",
              "hl": {
                "3": "ok",
                "7": "ok",
                "10": "a"
              },
              "tags": {
                "3": 2,
                "7": 1,
                "10": 1
              },
              "vars": {
                "left": 0,
                "right": 0,
                "best": 1
              }
            },
            {
              "note": "Node 4: left height 0, right height 1. Bending here gives 1 edges, no better than 1. It returns 2 upward.",
              "hl": {
                "3": "ok",
                "4": "a",
                "7": "ok",
                "10": "b"
              },
              "tags": {
                "3": 2,
                "4": 2,
                "7": 1,
                "10": 1
              },
              "vars": {
                "left": 0,
                "right": 1,
                "best": 1
              }
            },
            {
              "note": "Node 2: left height 2, right height 2. A path bending here has 2+2 = 4 edges, a new best. It returns 3 upward (one side only).",
              "hl": {
                "1": "a",
                "3": "b",
                "4": "b",
                "7": "ok",
                "10": "ok"
              },
              "tags": {
                "1": 3,
                "3": 2,
                "4": 2,
                "7": 1,
                "10": 1
              },
              "vars": {
                "left": 2,
                "right": 2,
                "best": 4
              }
            },
            {
              "note": "Node 1: left height 3, right height 0. Bending here gives 3 edges, no better than 4. It returns 4 upward.",
              "hl": {
                "0": "a",
                "1": "b",
                "3": "ok",
                "4": "ok",
                "7": "ok",
                "10": "ok"
              },
              "tags": {
                "0": 4,
                "1": 3,
                "3": 2,
                "4": 2,
                "7": 1,
                "10": 1
              },
              "vars": {
                "left": 3,
                "right": 0,
                "best": 4
              },
              "out": "Diameter = 4 edges"
            }
          ]
        }
      },
      "code": "int diameterOfBinaryTree(TreeNode* root) {\n    int best = 0;                                 // longest bent path seen so far\n    function<int(TreeNode*)> height = [&](TreeNode* n) {\n        if (!n) return 0;\n        int l = height(n->left);\n        int r = height(n->right);\n        best = max(best, l + r);                  // path that bends at n (both sides)\n        return 1 + max(l, r);                     // parent can use only one side\n    };\n    height(root);\n    return best;                                  // answer is best, not the return value\n}",
      "complexity": "Time O(n), each node is handled once. Space O(h) for the recursion stack.",
      "mistakes": [
        "Returning the bent path (l + r) to the parent. A parent cannot extend a path that already forks.",
        "Returning best from the recursive function and forgetting the separate variable, so the answer is lost.",
        "Initialising best to 0 for max path sum. Node values can be negative, so start from INT_MIN there."
      ],
      "practice": [
        543,
        124
      ]
    },
    "3": {
      "name": "Top-down state",
      "when": "Whether a node counts depends on what lies above it on its path: a running sum (path sum), a running max or min (good nodes), the depth or a bound. The information flows from the root down.",
      "idea": "Instead of waiting for answers to come back up, carry what you already know down as function parameters. Each call receives the state from its parent (for instance the largest value so far), uses it to decide something about itself, makes a new updated state for its children, and passes that down. Because each call gets its own copy of the parameter, you never have to undo anything when the call returns. Preorder is the natural fit: handle the node first, then recurse.",
      "steps": [
        "Decide what state travels down: a sum, a max, a depth. Add it as a parameter.",
        "Pick the starting state for the root (INT_MIN for a max, 0 for a sum).",
        "At each node, use the incoming state to decide about this node (count it, compare it).",
        "Build the new state for the children, for example mx = max(mx, node->val).",
        "Recurse on both children with the new state and add up the results."
      ],
      "example": {
        "problem": "Count Good Nodes in the tree [3, 1, 4, 3, null, 1, 5]. Node X is good if no node on the path from the root to X has a bigger value. Output: 4 (the nodes 3, 3, 4 and 5).",
        "walk": "The orange label is the max value that was passed DOWN into each node. Green nodes are good, red are not. Node 1 is red because the 3 above it is bigger, and the 1 under 4 is red for the same reason. Node 3 on the left is green: it ties with the max 3, and the rule is greater than or equal.",
        "viz": {
          "kind": "tree",
          "cells": [
            3,
            1,
            4,
            3,
            null,
            1,
            5
          ],
          "frames": [
            {
              "note": "Count good nodes: a node is good if no node above it on its path is bigger. We pass the biggest value seen so far down as a parameter.",
              "hl": {},
              "vars": {
                "count": 0
              }
            },
            {
              "note": "Node 3 arrives with max -. 3 >= that, so it is good. The max passed down becomes 3.",
              "hl": {
                "0": "ok"
              },
              "tags": {
                "0": "max -"
              },
              "vars": {
                "count": 1
              }
            },
            {
              "note": "Node 1 arrives with max 3. 3 is bigger, so this node is not good. The max stays 3.",
              "hl": {
                "0": "ok",
                "1": "bad"
              },
              "tags": {
                "0": "max -",
                "1": "max 3"
              },
              "vars": {
                "count": 1
              }
            },
            {
              "note": "Node 3 arrives with max 3. 3 >= that, so it is good. The max passed down becomes 3.",
              "hl": {
                "0": "ok",
                "1": "bad",
                "3": "ok"
              },
              "tags": {
                "0": "max -",
                "1": "max 3",
                "3": "max 3"
              },
              "vars": {
                "count": 2
              }
            },
            {
              "note": "Node 4 arrives with max 3. 4 >= that, so it is good. The max passed down becomes 4.",
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "ok"
              },
              "tags": {
                "0": "max -",
                "1": "max 3",
                "2": "max 3",
                "3": "max 3"
              },
              "vars": {
                "count": 3
              }
            },
            {
              "note": "Node 1 arrives with max 4. 4 is bigger, so this node is not good. The max stays 4.",
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "ok",
                "5": "bad"
              },
              "tags": {
                "0": "max -",
                "1": "max 3",
                "2": "max 3",
                "3": "max 3",
                "5": "max 4"
              },
              "vars": {
                "count": 3
              }
            },
            {
              "note": "Node 5 arrives with max 4. 5 >= that, so it is good. The max passed down becomes 5.",
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "ok",
                "5": "bad",
                "6": "ok"
              },
              "tags": {
                "0": "max -",
                "1": "max 3",
                "2": "max 3",
                "3": "max 3",
                "5": "max 4",
                "6": "max 4"
              },
              "vars": {
                "count": 4
              },
              "out": "Good nodes = 4"
            }
          ]
        }
      },
      "code": "int goodNodes(TreeNode* root) {\n    function<int(TreeNode*, int)> dfs = [&](TreeNode* n, int mx) {\n        if (!n) return 0;\n        int good = (n->val >= mx) ? 1 : 0;        // nothing bigger above it\n        mx = max(mx, n->val);                     // new state for the children\n        return good + dfs(n->left, mx) + dfs(n->right, mx);\n    };\n    return dfs(root, INT_MIN);\n}",
      "complexity": "Time O(n), one visit per node. Space O(h) for the recursion stack.",
      "mistakes": [
        "Using a global running max. Siblings would see each other's values; a parameter keeps each path separate.",
        "Using > instead of >= when equal values count as good.",
        "Starting the max at 0 when node values can be negative. Use INT_MIN."
      ],
      "practice": [
        1448,
        112,
        437
      ]
    },
    "4": {
      "name": "BFS by levels",
      "when": "You need the tree level by level: level order, zigzag order, right side view, largest value per row, minimum depth, or anything about the 'nearest' nodes to the root first.",
      "idea": "Breadth-first search uses a queue, which is first in, first out. Put the root in, then repeat: take the node at the front, record it, and push its children at the back. The queue always holds nodes in level order. To know where one level ends and the next begins, read the queue size at the start of each round. That count is the number of nodes in the current level, so you pop exactly that many, and everything pushed meanwhile belongs to the next level.",
      "steps": [
        "If the root is null, return an empty result. Otherwise push the root into a queue.",
        "While the queue is not empty, read sz = q.size(). This freezes the current level.",
        "Repeat sz times: pop the front node, record its value in the level list.",
        "Push the node's non-null left and right children.",
        "When the sz pops are done, add the level list to the result."
      ],
      "example": {
        "problem": "Level order traversal of the tree [5, 3, 8, 1, 4, null, 9]. Output: [[5], [3, 8], [1, 4, 9]].",
        "walk": "The queue panel shows the front on the left. The size chip is frozen at the start of each level, and it tells us when to cut the level: size 2 means exactly the next two pops are level 2, even though their children are already waiting behind them. Green nodes are finished, violet nodes are waiting in the queue.",
        "viz": {
          "kind": "tree",
          "cells": [
            5,
            3,
            8,
            1,
            4,
            null,
            9
          ],
          "frames": [
            {
              "note": "BFS visits the tree level by level using a queue. Start by putting the root in the queue.",
              "hl": {
                "0": "b"
              },
              "queue": [
                5
              ],
              "vars": {
                "size": "-",
                "result": "[]"
              }
            },
            {
              "note": "Pop 5 from the front (level has 1 node, 0 left to pop). Push its children [3, 8]. Level done: [5].",
              "hl": {
                "0": "a",
                "1": "b",
                "2": "b"
              },
              "queue": [
                3,
                8
              ],
              "vars": {
                "size": 1,
                "level": "[5]",
                "result": "[[5]]"
              }
            },
            {
              "note": "Pop 3 from the front (level has 2 nodes, 1 left to pop). Push its children [1, 4].",
              "hl": {
                "0": "ok",
                "1": "a",
                "2": "b",
                "3": "b",
                "4": "b"
              },
              "queue": [
                8,
                1,
                4
              ],
              "vars": {
                "size": 2,
                "level": "[3]",
                "result": "[[5]]"
              }
            },
            {
              "note": "Pop 8 from the front (level has 2 nodes, 0 left to pop). Push its children [9]. Level done: [3, 8].",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "3": "b",
                "4": "b",
                "6": "b"
              },
              "queue": [
                1,
                4,
                9
              ],
              "vars": {
                "size": 2,
                "level": "[3, 8]",
                "result": "[[5],[3,8]]"
              }
            },
            {
              "note": "Pop 1 from the front (level has 3 nodes, 2 left to pop). It has no children to push.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "a",
                "4": "b",
                "6": "b"
              },
              "queue": [
                4,
                9
              ],
              "vars": {
                "size": 3,
                "level": "[1]",
                "result": "[[5],[3,8]]"
              }
            },
            {
              "note": "Pop 4 from the front (level has 3 nodes, 1 left to pop). It has no children to push.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "a",
                "6": "b"
              },
              "queue": [
                9
              ],
              "vars": {
                "size": 3,
                "level": "[1, 4]",
                "result": "[[5],[3,8]]"
              }
            },
            {
              "note": "Pop 9 from the front (level has 3 nodes, 0 left to pop). It has no children to push. Level done: [1, 4, 9].",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "6": "a"
              },
              "queue": [],
              "vars": {
                "size": 3,
                "level": "[1, 4, 9]",
                "result": "[[5],[3,8],[1,4,9]]"
              },
              "out": "[[5],[3,8],[1,4,9]]"
            }
          ]
        }
      },
      "code": "vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> res;\n    if (!root) return res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int sz = q.size();                    // nodes on THIS level only\n        vector<int> level;\n        for (int i = 0; i < sz; i++) {\n            TreeNode* n = q.front(); q.pop();\n            level.push_back(n->val);\n            if (n->left) q.push(n->left);     // children belong to the next level\n            if (n->right) q.push(n->right);\n        }\n        res.push_back(level);\n    }\n    return res;\n}",
      "complexity": "Time O(n), every node enters and leaves the queue once. Space O(w) where w is the widest level (up to about n / 2).",
      "mistakes": [
        "Reading q.size() inside the for-loop condition. The size changes as you push children, so save it in a variable first.",
        "Pushing null children into the queue and then dereferencing them. Check before pushing.",
        "Using DFS and a global list when the problem needs level grouping. BFS makes the grouping natural."
      ],
      "practice": [
        102,
        199,
        103
      ]
    },
    "5": {
      "name": "Lowest common ancestor",
      "when": "You are given two nodes of a binary tree and must find the deepest node that has both of them in its subtree. Also useful for the distance between two nodes. For a BST there is an even simpler rule using the values.",
      "idea": "Ask every subtree one question: do you contain p or q? A call returns the target node if it finds one, null if it finds nothing, and otherwise whatever its children return. The magic moment comes at a node where BOTH children return something non-null. That means p is on one side and q on the other, so this node is the lowest point that sees both, which makes it the answer. If only one child returns something, pass it up unchanged: either it is a single target or an answer that was already found lower down.",
      "steps": [
        "If the node is null, or equals p or q, return the node itself.",
        "Recurse into the left child and the right child and keep both answers.",
        "If both answers are non-null, the current node is the LCA: return it.",
        "Otherwise return whichever answer is non-null (or null if both are).",
        "The value that returns from the root is the LCA."
      ],
      "example": {
        "problem": "Tree [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 6, q = 4. Return their lowest common ancestor. Output: node 5.",
        "walk": "The orange tags are the return values. Node 6 returns itself (a target), and node 4 does too. At node 2 only the right side has something, so it passes 4 up. At node 5 the left returns 6 and the right returns 4, both non-null, so 5 is the answer. After that, every call above just passes 5 along; the right subtree finds nothing.",
        "viz": {
          "kind": "tree",
          "cells": [
            3,
            5,
            1,
            6,
            2,
            0,
            8,
            null,
            null,
            7,
            4
          ],
          "frames": [
            {
              "note": "Find the lowest common ancestor of p = 6 and q = 4. Each call returns what it found in its subtree: p, q, the answer, or null.",
              "hl": {
                "0": "a"
              }
            },
            {
              "note": "Node 6 is one of the targets. Return it right away; nothing below it matters to this branch.",
              "hl": {
                "3": "a"
              },
              "tags": {
                "3": 6
              }
            },
            {
              "note": "Node 7 is a leaf and not a target. Both children are null, so it returns null.",
              "hl": {
                "3": "b",
                "9": "a"
              },
              "tags": {
                "3": 6,
                "9": "null"
              }
            },
            {
              "note": "Node 4 is one of the targets. Return it right away; nothing below it matters to this branch.",
              "hl": {
                "3": "b",
                "9": "dim",
                "10": "a"
              },
              "tags": {
                "3": 6,
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 2 got null from the left and 4 from the right. Only one side is useful, so it returns 4 upward.",
              "hl": {
                "3": "b",
                "4": "a",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "3": 6,
                "4": 4,
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 5 got a non-null answer from BOTH sides: 6 on the left, 4 on the right. One target on each side, so 5 is the LCA.",
              "hl": {
                "1": "ok",
                "3": "b",
                "4": "b",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "1": 5,
                "3": 6,
                "4": 4,
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 0 is a leaf and not a target. Both children are null, so it returns null.",
              "hl": {
                "1": "ok",
                "3": "b",
                "4": "b",
                "5": "a",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "1": 5,
                "3": 6,
                "4": 4,
                "5": "null",
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 8 is a leaf and not a target. Both children are null, so it returns null.",
              "hl": {
                "1": "ok",
                "3": "b",
                "4": "b",
                "5": "dim",
                "6": "a",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "1": 5,
                "3": 6,
                "4": 4,
                "5": "null",
                "6": "null",
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 1 got null from the left and null from the right. Only one side is useful, so it returns null upward.",
              "hl": {
                "1": "ok",
                "2": "a",
                "3": "b",
                "4": "b",
                "5": "dim",
                "6": "dim",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "1": 5,
                "2": "null",
                "3": 6,
                "4": 4,
                "5": "null",
                "6": "null",
                "9": "null",
                "10": 4
              }
            },
            {
              "note": "Node 3 got 5 from the left and null from the right. Only one side is useful, so it returns 5 upward.",
              "hl": {
                "0": "b",
                "1": "ok",
                "2": "dim",
                "3": "b",
                "4": "b",
                "5": "dim",
                "6": "dim",
                "9": "dim",
                "10": "b"
              },
              "tags": {
                "0": 5,
                "1": 5,
                "2": "null",
                "3": 6,
                "4": 4,
                "5": "null",
                "6": "null",
                "9": "null",
                "10": 4
              },
              "out": "LCA = 5"
            }
          ]
        }
      },
      "code": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;   // null, or found a target\n    TreeNode* left  = lowestCommonAncestor(root->left, p, q);\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\n    if (left && right) return root;       // one target on each side: root is the LCA\n    return left ? left : right;           // pass up whichever side found something\n}",
      "complexity": "Time O(n) in the worst case, each node is visited once. Space O(h) for the recursion stack.",
      "mistakes": [
        "Comparing values instead of node pointers. The code receives p and q as nodes, so compare the pointers.",
        "Continuing to search below a target. Once you meet p or q, return at once; the other target is either under it (then it is the LCA) or elsewhere.",
        "Using this plain version on a BST and missing the O(h) shortcut: if both values are smaller go left, if both are bigger go right, else you are at the LCA."
      ],
      "practice": [
        236,
        235
      ]
    },
    "6": {
      "name": "BST property",
      "when": "The tree is a binary search tree: every left value is smaller and every right value is bigger. Typical asks: validate it, search it, find the kth smallest, find a lowest common ancestor, insert or delete.",
      "idea": "In a BST everything in the left subtree is smaller than the node, and everything in the right subtree is bigger, not just the direct children. Three consequences. Searching: compare with the node and go left or right, throwing away half the tree each time. Sorted order: an inorder walk visits the values in increasing order, so the kth smallest is the kth node of an inorder walk. Validating: pass down an open range (lo, hi); going left makes hi the node's value, going right makes lo the node's value. A node outside its range breaks the rule.",
      "steps": [
        "For search: if node is null return null; if the value is equal return the node; go left if target is smaller, right if bigger.",
        "For kth smallest: walk inorder and count visited nodes. Stop at the kth.",
        "For validation: write check(node, lo, hi) and start with no bounds.",
        "In check, return false if the value is not strictly between lo and hi.",
        "Recurse left with (lo, node->val) and right with (node->val, hi). Use long long bounds so INT_MIN and INT_MAX values work."
      ],
      "example": {
        "problem": "Validate the tree [5, 3, 8, 1, 6, 7, 9]. Node 6 is the right child of 3, so 6 > 3 looks fine locally, but 6 sits in the left subtree of 5. Output: false.",
        "walk": "The orange labels are the allowed ranges. Going left from 5 gives 3 the range (-,5); going right from 3 narrows the range to (3,5). The value 6 is above its parent 3, yet outside (3,5), because the root 5 also constrains it. That is why we pass bounds from all ancestors, not just compare with the parent.",
        "viz": {
          "kind": "tree",
          "cells": [
            5,
            3,
            8,
            1,
            6,
            7,
            9
          ],
          "frames": [
            {
              "note": "Is this a valid BST? Every node must lie strictly between a low and a high bound, set by ALL its ancestors. The root may be anything: (-inf, +inf).",
              "hl": {
                "0": "a"
              },
              "tags": {
                "0": "(-,+)"
              }
            },
            {
              "note": "Node 5 is inside (-,+). Left child must be below 5; right child must be above 5.",
              "hl": {
                "0": "a"
              },
              "tags": {
                "0": "(-,+)"
              },
              "vars": {
                "low": "-inf",
                "high": "inf"
              }
            },
            {
              "note": "Node 3 is inside (-,5). Left child must be below 3; right child must be above 3.",
              "hl": {
                "0": "ok",
                "1": "a"
              },
              "tags": {
                "0": "(-,+)",
                "1": "(-,5)"
              },
              "vars": {
                "low": "-inf",
                "high": 5
              }
            },
            {
              "note": "Node 1 is inside (-,3). Left child must be below 1; right child must be above 1.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "3": "a"
              },
              "tags": {
                "0": "(-,+)",
                "1": "(-,5)",
                "3": "(-,3)"
              },
              "vars": {
                "low": "-inf",
                "high": 3
              }
            },
            {
              "note": "Node 6 must be inside (3,5), but 6 is not smaller than the high bound 5. Comparing with its parent 3 alone would have missed this. Return false.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "3": "ok",
                "4": "bad"
              },
              "tags": {
                "0": "(-,+)",
                "1": "(-,5)",
                "3": "(-,3)",
                "4": "(3,5)"
              },
              "vars": {
                "low": 3,
                "high": 5
              }
            },
            {
              "note": "The false travels up through every parent, so the whole answer is false. The right subtree is never even checked.",
              "hl": {
                "0": "bad",
                "1": "bad",
                "4": "bad"
              },
              "tags": {
                "0": "(-,+)",
                "1": "(-,5)",
                "3": "(-,3)",
                "4": "(3,5)"
              },
              "out": "isValidBST = false"
            }
          ]
        }
      },
      "code": "bool isValidBST(TreeNode* root) {\n    function<bool(TreeNode*, long long, long long)> ok =\n        [&](TreeNode* n, long long lo, long long hi) {\n        if (!n) return true;                              // empty tree is valid\n        if (n->val <= lo || n->val >= hi) return false;   // outside the allowed range\n        return ok(n->left, lo, n->val)                    // left: must stay below n\n            && ok(n->right, n->val, hi);                  // right: must stay above n\n    };\n    return ok(root, LLONG_MIN, LLONG_MAX);\n}",
      "complexity": "Time O(n) for validation (O(h) for a single search). Space O(h) for the recursion stack, where h is the height.",
      "mistakes": [
        "Only comparing each node with its direct children. A deep node can break the rule against a far ancestor, as 6 does here.",
        "Using <= for the check in the wrong direction. A BST has no duplicates, so equal values are invalid.",
        "Using int bounds with INT_MIN or INT_MAX as limits. A node holding INT_MAX would be rejected wrongly, so use long long."
      ],
      "practice": [
        98,
        230,
        700,
        450
      ]
    },
    "7": {
      "name": "Build from traversals",
      "when": "You are given two traversal lists, usually preorder (or postorder) plus inorder, and must rebuild the unique tree. Values must be distinct for the answer to be unique.",
      "idea": "Preorder always starts with the root of the tree. Inorder puts the root exactly between its left subtree and its right subtree. So: take the next preorder value, it is the root. Find it in the inorder list. Everything to its left in inorder belongs to the left subtree, everything to its right belongs to the right subtree. Because preorder visits the left subtree first, the next values in preorder are the left subtree, then the right. A pointer p that only moves forward through preorder, plus a hash map from value to inorder index, gives O(n) in total.",
      "steps": [
        "Build a map from each value to its index in inorder.",
        "Keep one shared pointer p into preorder, starting at 0.",
        "Write build(l, r) for the inorder range l..r. If l > r, return null.",
        "Create the root from preorder[p++], and look up its inorder index m.",
        "Set root->left = build(l, m - 1) first, then root->right = build(m + 1, r). The order matters, because preorder is consumed left subtree first."
      ],
      "example": {
        "problem": "Preorder [1, 2, 4, 5, 3, 6], inorder [4, 2, 5, 1, 6, 3]. Rebuild the tree. Output: [1, 2, 3, 4, 5, 6] in level order (node 1 has children 2 and 3, node 2 has 4 and 5, node 3 has left child 6).",
        "walk": "Question marks are nodes not yet known. Each frame creates the next preorder value as a root, and the chips show the inorder range [l..r] it owns and the split index m. Notice the order of creation: 1, 2, 4, 5, 3, 6. Left subtrees are completely built before any right sibling, exactly as preorder lists them.",
        "viz": {
          "kind": "tree",
          "cells": [
            "?",
            "?",
            "?",
            "?",
            "?",
            "?",
            null
          ],
          "frames": [
            {
              "note": "Preorder [1,2,4,5,3,6], inorder [4,2,5,1,6,3]. First, a map from value to inorder index so we can find any root in O(1).",
              "hl": {
                "0": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 0
              }
            },
            {
              "note": "preorder[0] = 1 is the root of inorder range [0..5]. Its index in inorder is 3, so 3 nodes go left and 2 go right.",
              "cells": [
                1,
                "?",
                "?",
                "?",
                "?",
                "?",
                null
              ],
              "hl": {
                "0": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 0,
                "l": 0,
                "r": 5,
                "m": 3
              }
            },
            {
              "note": "preorder[1] = 2 is the root of inorder range [0..2]. Its index in inorder is 1, so 1 node go left and 1 go right.",
              "cells": [
                1,
                2,
                "?",
                "?",
                "?",
                "?",
                null
              ],
              "hl": {
                "0": "ok",
                "1": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 1,
                "l": 0,
                "r": 2,
                "m": 1
              }
            },
            {
              "note": "preorder[2] = 4 is the root of inorder range [0..0]. Its index in inorder is 0, so 0 nodes go left and 0 go right.",
              "cells": [
                1,
                2,
                "?",
                4,
                "?",
                "?",
                null
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "3": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 2,
                "l": 0,
                "r": 0,
                "m": 0
              }
            },
            {
              "note": "preorder[3] = 5 is the root of inorder range [2..2]. Its index in inorder is 2, so 0 nodes go left and 0 go right.",
              "cells": [
                1,
                2,
                "?",
                4,
                5,
                "?",
                null
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "3": "ok",
                "4": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 3,
                "l": 2,
                "r": 2,
                "m": 2
              }
            },
            {
              "note": "preorder[4] = 3 is the root of inorder range [4..5]. Its index in inorder is 5, so 1 node go left and 0 go right.",
              "cells": [
                1,
                2,
                3,
                4,
                5,
                "?",
                null
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "3": "ok",
                "4": "ok"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 4,
                "l": 4,
                "r": 5,
                "m": 5
              }
            },
            {
              "note": "preorder[5] = 6 is the root of inorder range [4..4]. Its index in inorder is 4, so 0 nodes go left and 0 go right.",
              "cells": [
                1,
                2,
                3,
                4,
                5,
                6,
                null
              ],
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "a"
              },
              "map": {
                "1": 3,
                "2": 1,
                "3": 5,
                "4": 0,
                "5": 2,
                "6": 4
              },
              "vars": {
                "p": 5,
                "l": 4,
                "r": 4,
                "m": 4
              }
            },
            {
              "note": "All six preorder values are used. Empty ranges (l > r) became null children. The tree is rebuilt.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "out": "Tree = [1,2,3,4,5,6]"
            }
          ]
        }
      },
      "code": "TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n    unordered_map<int, int> pos;                      // value -> index in inorder\n    for (int i = 0; i < (int)inorder.size(); i++) pos[inorder[i]] = i;\n    int p = 0;                                        // next root in preorder\n    function<TreeNode*(int, int)> build = [&](int l, int r) -> TreeNode* {\n        if (l > r) return nullptr;                    // empty inorder range\n        TreeNode* root = new TreeNode(preorder[p++]);\n        int m = pos[root->val];                       // split point in inorder\n        root->left  = build(l, m - 1);                // must come first\n        root->right = build(m + 1, r);\n        return root;\n    };\n    return build(0, (int)inorder.size() - 1);\n}",
      "complexity": "Time O(n): each node is created once and the map lookup is O(1). Space O(n) for the map and O(h) for the recursion.",
      "mistakes": [
        "Building the right subtree before the left. Preorder lists the left subtree first, so p would point at the wrong values.",
        "Searching for the root in inorder with a loop each time. That makes it O(n^2); use the hash map.",
        "Passing preorder ranges and inorder ranges separately and getting the sizes wrong. A single pointer p avoids it."
      ],
      "practice": [
        105,
        297
      ]
    },
    "8": {
      "name": "Serialization",
      "when": "You must convert a tree into a string or list and rebuild exactly the same tree from it later: serialize and deserialize, or compare tree shapes through a canonical string.",
      "idea": "A list of values alone does not identify a tree, because many shapes share the same values. The fix is to also record the empty spots. Walk the tree in preorder and write the value of each node, and a marker such as '#' for each null child. Now the string is unambiguous. To read it back, use the same preorder recursion: read one token; if it is '#' return null, otherwise make a node and build its left subtree and then its right subtree from the following tokens. The tokens are consumed in exactly the order they were written.",
      "steps": [
        "Serialize: write the node's value, then recurse left, then recurse right.",
        "For a null node write the marker '#' and return.",
        "Separate tokens with a comma so multi-digit and negative numbers stay readable.",
        "Deserialize: put the string in a stream and read one token at a time.",
        "If the token is '#', return null. Otherwise build a node, then set its left and then its right child by recursing."
      ],
      "example": {
        "problem": "Serialize the tree [1, 2, 3, null, 4, null, 5] (node 2 has only a right child 4, node 3 has only a right child 5). Output: \"1,2,#,4,#,#,3,#,5,#,#\".",
        "walk": "Tokens appear in the queue panel in the order they are written. The marker after 2 shows it has no left child. Leaves write two markers, one for each missing child. Each token is written at one exact moment of the preorder walk, and reading back in the same order recreates the tree.",
        "viz": {
          "kind": "tree",
          "cells": [
            1,
            2,
            3,
            null,
            4,
            null,
            5
          ],
          "frames": [
            {
              "note": "Turn the tree [1,2,3,null,4,null,5] into a string. Walk in preorder and write '#' for every missing child. The queue panel shows the string being built.",
              "hl": {
                "0": "a"
              },
              "queue": [],
              "vars": {
                "tokens": 0
              }
            },
            {
              "note": "Visit node 1: write 1 first (preorder), then go to its left child.",
              "hl": {
                "0": "a"
              },
              "queue": [
                "1"
              ],
              "vars": {
                "tokens": 1
              }
            },
            {
              "note": "Visit node 2: write 2 first (preorder), then go to its left child.",
              "hl": {
                "0": "ok",
                "1": "a"
              },
              "queue": [
                "1",
                "2"
              ],
              "vars": {
                "tokens": 2
              }
            },
            {
              "note": "Node 2 has no left child, so write '#'. The marker keeps the shape recoverable.",
              "hl": {
                "0": "ok",
                "1": "b"
              },
              "queue": [
                "1",
                "2",
                "#"
              ],
              "vars": {
                "tokens": 3
              }
            },
            {
              "note": "Node 4 is a leaf: write 4, then '#' for its left child and '#' for its right child.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "4": "a"
              },
              "queue": [
                "1",
                "2",
                "#",
                "4",
                "#",
                "#"
              ],
              "vars": {
                "tokens": 6
              }
            },
            {
              "note": "Visit node 3: write 3 first (preorder), then go to its left child.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "4": "ok"
              },
              "queue": [
                "1",
                "2",
                "#",
                "4",
                "#",
                "#",
                "3"
              ],
              "vars": {
                "tokens": 7
              }
            },
            {
              "note": "Node 3 has no left child, so write '#'. The marker keeps the shape recoverable.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "b",
                "4": "ok"
              },
              "queue": [
                "1",
                "2",
                "#",
                "4",
                "#",
                "#",
                "3",
                "#"
              ],
              "vars": {
                "tokens": 8
              }
            },
            {
              "note": "Node 5 is a leaf: write 5, then '#' for its left child and '#' for its right child.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "4": "ok",
                "6": "a"
              },
              "queue": [
                "1",
                "2",
                "#",
                "4",
                "#",
                "#",
                "3",
                "#",
                "5",
                "#",
                "#"
              ],
              "vars": {
                "tokens": 11
              }
            },
            {
              "note": "Done: 11 tokens. To rebuild, read them in the same order: a number makes a node and recurses left then right, '#' returns null.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "4": "ok",
                "6": "ok"
              },
              "queue": [
                "1",
                "2",
                "#",
                "4",
                "#",
                "#",
                "3",
                "#",
                "5",
                "#",
                "#"
              ],
              "vars": {
                "tokens": 11
              },
              "out": "1,2,#,4,#,#,3,#,5,#,#"
            }
          ]
        }
      },
      "code": "class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        string out;\n        function<void(TreeNode*)> go = [&](TreeNode* n) {\n            if (!n) { out += \"#,\"; return; }          // marker for a missing child\n            out += to_string(n->val) + \",\";\n            go(n->left);\n            go(n->right);\n        };\n        go(root);\n        if (!out.empty()) out.pop_back();             // drop the last comma\n        return out;\n    }\n    TreeNode* deserialize(string data) {\n        stringstream ss(data);\n        function<TreeNode*()> build = [&]() -> TreeNode* {\n            string tok;\n            if (!getline(ss, tok, ',')) return nullptr;\n            if (tok == \"#\") return nullptr;\n            TreeNode* n = new TreeNode(stoi(tok));\n            n->left = build();                        // tokens come in the same order\n            n->right = build();\n            return n;\n        };\n        return build();\n    }\n};",
      "complexity": "Time O(n) for both directions, each node and marker is handled once. Space O(n) for the string and O(h) for the recursion.",
      "mistakes": [
        "Leaving out the null markers. Then [1,2] and [1,null,2] produce the same string and cannot be told apart.",
        "Forgetting a separator, so 1 and 23 cannot be told from 12 and 3. Also remember negative numbers.",
        "Building the right child before the left in deserialize. The order must match the order used when writing."
      ],
      "practice": [
        297,
        105
      ]
    }
  },
  "9": {
    "0": {
      "name": "Top K with a size-K min-heap",
      "when": "You are asked for the Kth largest or the K largest items, and sorting everything feels like too much work. Words like top K, Kth largest, or keep only the best K are the signal.",
      "idea": "A min-heap is a bag that always lets you grab its smallest item in O(log n). If you keep exactly K items in it, the smallest one in the bag is the weakest of your current top K. When a new number arrives, push it. If the bag now has K + 1 items, throw out the smallest. Whatever is left are the K largest numbers seen so far, and the top of the heap is the Kth largest. It sounds backwards to use a MIN-heap to find the LARGEST items, but the min-heap is the gatekeeper that kicks out the loser.",
      "steps": [
        "Make a min-heap (in C++: priority_queue<int, vector<int>, greater<int>>).",
        "For each number, push it into the heap.",
        "If the heap size is now bigger than K, pop once. That removes the smallest item.",
        "After the loop the heap holds the K largest numbers. heap.top() is the Kth largest.",
        "For the K SMALLEST items, flip it: use a max-heap and pop the biggest."
      ],
      "example": {
        "problem": "Kth Largest Element: find the 3rd largest number. Input: nums = [4, 7, 2, 9, 5, 8], k = 3. Output: 7, because the sorted order from the top is 9, 8, 7.",
        "walk": "The heap is drawn as a tree, with the smallest number at the root. Watch what happens each time the size reaches 4: the root, the smallest, is red and gets popped. So 2, then 4, then 5 leave. The heap never grows past K + 1 items, and at the end the root 7 is the 3rd largest.",
        "viz": {
          "kind": "tree",
          "cells": [
            4,
            "",
            "",
            ""
          ],
          "frames": [
            {
              "note": "Find the 3rd largest. We keep a min-heap of at most K = 3 numbers. Push 4. The queue shows the numbers still to read.",
              "cells": [
                4,
                "",
                "",
                ""
              ],
              "hl": {
                "0": "a"
              },
              "queue": [
                7,
                2,
                9,
                5,
                8
              ],
              "vars": {
                "x": 4,
                "size": 1
              }
            },
            {
              "note": "Push 7. The heap holds 2 of 3 numbers, so nothing is removed yet.",
              "cells": [
                4,
                7,
                "",
                ""
              ],
              "hl": {
                "1": "a"
              },
              "queue": [
                2,
                9,
                5,
                8
              ],
              "vars": {
                "x": 7,
                "size": 2
              }
            },
            {
              "note": "Push 2. It was smaller than its parent, so it floated up. The heap holds 3 of 3 numbers, so nothing is removed yet.",
              "cells": [
                2,
                7,
                4,
                ""
              ],
              "hl": {
                "0": "a"
              },
              "queue": [
                9,
                5,
                8
              ],
              "vars": {
                "x": 2,
                "size": 3
              }
            },
            {
              "note": "Push 9. The heap now holds 4 numbers, more than K = 3, so the smallest (2) has to go.",
              "cells": [
                2,
                7,
                4,
                9
              ],
              "hl": {
                "0": "bad",
                "3": "a"
              },
              "queue": [
                5,
                8
              ],
              "vars": {
                "x": 9,
                "size": 4
              }
            },
            {
              "note": "Pop the root 2. It is the smallest, so it cannot be one of the 3 largest. The heap keeps the 3 biggest numbers seen so far.",
              "cells": [
                4,
                7,
                9,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                5,
                8
              ],
              "vars": {
                "x": 9,
                "size": 3
              }
            },
            {
              "note": "Push 5. The heap now holds 4 numbers, more than K = 3, so the smallest (4) has to go.",
              "cells": [
                4,
                5,
                9,
                7
              ],
              "hl": {
                "0": "bad",
                "1": "a"
              },
              "queue": [
                8
              ],
              "vars": {
                "x": 5,
                "size": 4
              }
            },
            {
              "note": "Pop the root 4. It is the smallest, so it cannot be one of the 3 largest. The heap keeps the 3 biggest numbers seen so far.",
              "cells": [
                5,
                7,
                9,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                8
              ],
              "vars": {
                "x": 5,
                "size": 3
              }
            },
            {
              "note": "Push 8. The heap now holds 4 numbers, more than K = 3, so the smallest (5) has to go.",
              "cells": [
                5,
                7,
                9,
                8
              ],
              "hl": {
                "0": "bad",
                "3": "a"
              },
              "queue": [],
              "vars": {
                "x": 8,
                "size": 4
              }
            },
            {
              "note": "Pop the root 5. Everything is read. The heap holds the 3 largest numbers 7, 8, 9, and its root 7 is the 3rd largest.",
              "cells": [
                7,
                8,
                9,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [],
              "vars": {
                "x": 8,
                "size": 3
              },
              "out": "Answer: 7 (the root of the heap)"
            }
          ]
        }
      },
      "code": "// Kth largest element using a min-heap that never holds more than k numbers\nint findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> heap; // smallest on top\n    for (int x : nums) {\n        heap.push(x);\n        if ((int)heap.size() > k) heap.pop(); // drop the smallest, keep the k biggest\n    }\n    return heap.top(); // smallest of the k biggest = kth largest\n}",
      "complexity": "Time O(n log k), because each push or pop costs O(log k). Space O(k) for the heap.",
      "mistakes": [
        "Using a max-heap for Kth largest. That makes you pop n - k times, and the heap holds everything. Use a min-heap of size K.",
        "Popping before pushing or checking size > k - 1. Push first, then pop when the size is K + 1.",
        "Forgetting that priority_queue is a max-heap by default. Add greater<int> when you want the smallest on top."
      ],
      "practice": [
        215,
        703,
        1046
      ]
    },
    "1": {
      "name": "Kth element in a stream",
      "when": "Numbers keep arriving one at a time and after each arrival you must report the Kth largest (or smallest) so far. A design class with an add method that returns an answer is the usual form.",
      "idea": "This is the same size-K min-heap as before, but the heap lives inside a class and survives between calls. You cannot re-sort the whole history on every add, that would be far too slow. Instead the heap quietly holds the K largest numbers seen so far. On each add you push the new number, pop if the heap grew past K, and read the root. Each add costs only O(log k), no matter how long the stream has been running.",
      "steps": [
        "Store k and a min-heap as members of the class.",
        "In the constructor, feed every starting number through the same add logic.",
        "In add(val), push val, then pop if the size is bigger than k.",
        "Return heap.top(). It is the Kth largest of everything seen so far.",
        "A value smaller than the root just gets pushed and popped again, so the answer stays the same."
      ],
      "example": {
        "problem": "KthLargest with k = 3 and starting numbers [4, 5, 8, 2]. Then call add(3), add(5), add(10), add(9), add(4). Output: 4, 5, 5, 8, 8.",
        "walk": "The heap is drawn as a tree and always settles back to 3 numbers. Notice add(3): it is smaller than the root 4, so it enters and leaves at once and the answer stays 4. A big number like add(10) pushes out the old root and the answer rises. The answer can only stay the same or grow.",
        "viz": {
          "kind": "tree",
          "cells": [
            4,
            5,
            8,
            ""
          ],
          "frames": [
            {
              "note": "The class was built with k = 3 and numbers [4, 5, 8, 2]. It kept the 3 largest, 4, 5 and 8 (the 2 was dropped). The root 4 is the answer so far. The queue shows the numbers still to be added.",
              "cells": [
                4,
                5,
                8,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                3,
                5,
                10,
                9,
                4
              ],
              "vars": {
                "answer": 4
              }
            },
            {
              "note": "add(3). 3 is not bigger than the root 4, so it goes in and straight back out. The top 3 do not change.",
              "cells": [
                3,
                4,
                8,
                5
              ],
              "hl": {
                "0": "bad"
              },
              "queue": [
                5,
                10,
                9,
                4
              ],
              "vars": {
                "add": 3,
                "size": 4
              }
            },
            {
              "note": "After popping, the heap again holds the 3 largest numbers. The root is 4, so add returns 4.",
              "cells": [
                4,
                5,
                8,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                5,
                10,
                9,
                4
              ],
              "vars": {
                "add": 3,
                "answer": 4
              }
            },
            {
              "note": "add(5). Push it. The heap has 4 items, so the smallest (4) is about to be popped.",
              "cells": [
                4,
                5,
                8,
                5
              ],
              "hl": {
                "0": "bad",
                "3": "a"
              },
              "queue": [
                10,
                9,
                4
              ],
              "vars": {
                "add": 5,
                "size": 4
              }
            },
            {
              "note": "After popping, the heap again holds the 3 largest numbers. The root is 5, so add returns 5.",
              "cells": [
                5,
                5,
                8,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                10,
                9,
                4
              ],
              "vars": {
                "add": 5,
                "answer": 5
              }
            },
            {
              "note": "add(10). Push it. The heap has 4 items, so the smallest (5) is about to be popped.",
              "cells": [
                5,
                5,
                8,
                10
              ],
              "hl": {
                "0": "bad",
                "3": "a"
              },
              "queue": [
                9,
                4
              ],
              "vars": {
                "add": 10,
                "size": 4
              }
            },
            {
              "note": "After popping, the heap again holds the 3 largest numbers. The root is 5, so add returns 5.",
              "cells": [
                5,
                10,
                8,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                9,
                4
              ],
              "vars": {
                "add": 10,
                "answer": 5
              }
            },
            {
              "note": "add(9). Push it. The heap has 4 items, so the smallest (5) is about to be popped.",
              "cells": [
                5,
                9,
                8,
                10
              ],
              "hl": {
                "0": "bad",
                "1": "a"
              },
              "queue": [
                4
              ],
              "vars": {
                "add": 9,
                "size": 4
              }
            },
            {
              "note": "After popping, the heap again holds the 3 largest numbers. The root is 8, so add returns 8.",
              "cells": [
                8,
                9,
                10,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [
                4
              ],
              "vars": {
                "add": 9,
                "answer": 8
              }
            },
            {
              "note": "add(4). 4 is not bigger than the root 8, so it goes in and straight back out. The top 3 do not change.",
              "cells": [
                4,
                8,
                10,
                9
              ],
              "hl": {
                "0": "bad"
              },
              "queue": [],
              "vars": {
                "add": 4,
                "size": 4
              }
            },
            {
              "note": "After popping, the heap again holds the 3 largest numbers. The root is 8, so add returns 8.",
              "cells": [
                8,
                9,
                10,
                ""
              ],
              "hl": {
                "0": "ok"
              },
              "queue": [],
              "vars": {
                "add": 4,
                "answer": 8
              },
              "out": "Answers: 4, 5, 5, 8, 8"
            }
          ]
        }
      },
      "code": "class KthLargest {\n    priority_queue<int, vector<int>, greater<int>> heap; // min-heap of the k largest\n    int k;\npublic:\n    KthLargest(int k, vector<int>& nums) : k(k) {\n        for (int x : nums) add(x);   // reuse add for the starting numbers\n    }\n    int add(int val) {\n        heap.push(val);\n        if ((int)heap.size() > k) heap.pop(); // keep only the k largest\n        return heap.top();                    // kth largest so far\n    }\n};",
      "complexity": "Each add is O(log k) time. The whole object uses O(k) space.",
      "mistakes": [
        "Sorting the stored numbers again on every add. That is O(n log n) per call and times out.",
        "Reading heap.top() when the heap has fewer than k items. LeetCode guarantees enough numbers, but in your own code check the size first.",
        "Storing the k and the heap as locals in the constructor. They must be class members so they live between calls."
      ],
      "practice": [
        703,
        1046,
        215
      ]
    },
    "2": {
      "name": "Frequency + heap",
      "when": "The question is about the most frequent or least frequent items: top K frequent elements, words, or characters. Counting comes first, then you need the best K by count.",
      "idea": "This pattern has two stages. Stage one counts with a hash map, so every distinct value gets a count in O(n). Stage two looks only at the distinct values and picks the K with the biggest counts. Use the size-K min-heap trick again, but this time the heap holds pairs (count, value) and compares by count. The pair with the smallest count sits on top and is popped whenever the heap grows past K. Pairs in C++ compare by their first number, so putting the count first does the job for free.",
      "steps": [
        "Count each value in an unordered_map<int,int>.",
        "Make a min-heap of pair<int,int> holding (count, value).",
        "For each map entry, push the pair. If the size is bigger than K, pop the smallest count.",
        "When the loop ends, the heap holds the K most frequent values. Pop them into the answer.",
        "If the order matters, reverse the answer, since the least frequent comes out first."
      ],
      "example": {
        "problem": "Top K Frequent Elements. Input: nums = [5, 3, 5, 1, 3, 5, 3, 7, 1, 5], k = 2. Output: [5, 3] in any order, because 5 appears 4 times and 3 appears 3 times.",
        "walk": "First the map fills up with counts. Then the cells switch to one cell per distinct value, written as value x count. The heap stores (count, value) pairs. When the third pair arrives, the pair (2,1) is the weakest and is popped. Then (1,7) arrives and is popped at once. Only the strongest K stay.",
        "viz": {
          "kind": "array",
          "cells": [
            5,
            3,
            5,
            1,
            3,
            5,
            3,
            7,
            1,
            5
          ],
          "frames": [
            {
              "note": "Goal: the 2 most frequent numbers. Step one is to count every number with a hash map.",
              "hl": {},
              "vars": {
                "k": 2
              }
            },
            {
              "note": "Counting the first 5 numbers: 5 and 3 appeared twice, 1 once.",
              "hl": {
                "0": "a",
                "1": "a",
                "2": "a",
                "3": "a",
                "4": "a"
              },
              "map": {
                "1": 1,
                "3": 2,
                "5": 2
              }
            },
            {
              "note": "All 10 numbers counted: 5 appears 4 times, 3 appears 3 times, 1 twice, 7 once.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok",
                "7": "ok",
                "8": "ok",
                "9": "ok"
              },
              "map": {
                "1": 2,
                "3": 3,
                "5": 4,
                "7": 1
              }
            },
            {
              "note": "Now step two. The cells show value x count. Push the pair (count, value) = (2,1). The heap is ordered by count, so the smallest count sits on top.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "0": "a"
              },
              "queue": [
                "(2,1)"
              ]
            },
            {
              "note": "Push the pair (count, value) = (3,3). The heap is ordered by count, so the smallest count sits on top.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "1": "a"
              },
              "queue": [
                "(2,1)",
                "(3,3)"
              ]
            },
            {
              "note": "Now step two. Push (count, value) = (4,5). The heap has 3 pairs, more than K = 2. The smallest count (2) is the weakest and will be popped.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "2": "a"
              },
              "queue": [
                "(2,1)",
                "(3,3)",
                "(4,5)"
              ]
            },
            {
              "note": "Pop (2,1). The heap again holds the 2 best pairs so far.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "2": "b"
              },
              "queue": [
                "(3,3)",
                "(4,5)"
              ]
            },
            {
              "note": "Now step two. Push (count, value) = (1,7). The heap has 3 pairs, more than K = 2. The smallest count (1) is the weakest and will be popped.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "3": "a"
              },
              "queue": [
                "(1,7)",
                "(4,5)",
                "(3,3)"
              ]
            },
            {
              "note": "Pop (1,7). The heap again holds the 2 best pairs so far.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "3": "b"
              },
              "queue": [
                "(3,3)",
                "(4,5)"
              ]
            },
            {
              "note": "Everything is processed. The heap holds the pairs (3,3) and (4,5), so the 2 most frequent numbers are 3 and 5.",
              "cells": [
                "1 x2",
                "3 x3",
                "5 x4",
                "7 x1"
              ],
              "hl": {
                "0": "dim",
                "1": "ok",
                "2": "ok",
                "3": "dim"
              },
              "queue": [
                "(3,3)",
                "(4,5)"
              ],
              "out": "Answer: 5 and 3 (any order)"
            }
          ]
        }
      },
      "code": "// Returns the k most frequent numbers (any order)\nvector<int> topKFrequent(vector<int>& nums, int k) {\n    unordered_map<int, int> count;\n    for (int x : nums) count[x]++;                 // stage 1: count\n    // min-heap of (count, value): the smallest count is on top\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> heap;\n    for (auto& [value, c] : count) {               // stage 2: keep the k best\n        heap.push({c, value});\n        if ((int)heap.size() > k) heap.pop();\n    }\n    vector<int> ans;\n    while (!heap.empty()) { ans.push_back(heap.top().second); heap.pop(); }\n    return ans;\n}",
      "complexity": "Time O(n + d log k), where d is the number of distinct values. Space O(d) for the map plus O(k) for the heap.",
      "mistakes": [
        "Putting the value first in the pair. Then the heap compares by value, not by count, and gives wrong answers.",
        "Pushing every element instead of every distinct value. Count first, then push once per distinct value.",
        "Using a max-heap and popping K times works too, but it holds all d pairs. The size-K min-heap uses less memory."
      ],
      "practice": [
        347,
        451,
        692
      ]
    },
    "3": {
      "name": "Merge K sorted sources",
      "when": "You have K sorted lists, arrays, rows of a matrix, or streams, and you need the overall smallest items, the merged order, or the Kth smallest across all of them.",
      "idea": "Merging two sorted lists is easy: compare the two heads and take the smaller. With K lists you would need to compare K heads each time, and a heap does that for you in O(log k). Put the current head of every list into a min-heap. The top of the heap is the smallest value among all heads, so it is the next item of the merged answer. Pop it, then push the next item from the SAME list. The heap never holds more than K items, one per list.",
      "steps": [
        "Push the first node (or element) of each non-empty list into a min-heap ordered by value.",
        "While the heap is not empty, pop the smallest node and append it to the answer.",
        "If the popped node has a next node, push that next node.",
        "Keep a dummy head and a tail pointer to build the merged linked list.",
        "For arrays or matrix rows, store (value, list index, position) in the heap instead."
      ],
      "example": {
        "problem": "Merge k Sorted Lists. Input: [1,4,5], [1,3,4], [2,6]. Output: 1 1 2 3 4 4 5 6.",
        "walk": "The queue panel is the heap: it holds one head per list, written like 4(A). Green cells are already merged. Each step pops the smallest head and brings in the successor from the same list. The heap size shrinks from 3 to 0 only when lists run out. The merged value grows in sorted order with no sorting step.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            4,
            5,
            1,
            3,
            4,
            2,
            6
          ],
          "frames": [
            {
              "note": "Three sorted lists are laid out in one row: A is cells 0 to 2, B is 3 to 5, C is 6 to 7. The heap holds only each list's current head, written value(list).",
              "hl": {
                "0": "a",
                "3": "a",
                "6": "a"
              },
              "queue": [
                "1(A)",
                "1(B)",
                "2(C)"
              ],
              "vars": {
                "merged": ""
              }
            },
            {
              "note": "Pop the smallest head, 1 from list A, and append it to the answer. Push the next item of list A, which is 4.",
              "hl": {
                "0": "ok",
                "1": "a",
                "3": "a",
                "6": "a"
              },
              "queue": [
                "1(B)",
                "2(C)",
                "4(A)"
              ],
              "vars": {
                "merged": "1"
              }
            },
            {
              "note": "Pop the smallest head, 1 from list B, and append it to the answer. Push the next item of list B, which is 3.",
              "hl": {
                "0": "ok",
                "1": "a",
                "3": "ok",
                "4": "a",
                "6": "a"
              },
              "queue": [
                "2(C)",
                "4(A)",
                "3(B)"
              ],
              "vars": {
                "merged": "1 1"
              }
            },
            {
              "note": "Pop the smallest head, 2 from list C, and append it to the answer. Push the next item of list C, which is 6.",
              "hl": {
                "0": "ok",
                "1": "a",
                "3": "ok",
                "4": "a",
                "6": "ok",
                "7": "a"
              },
              "queue": [
                "3(B)",
                "4(A)",
                "6(C)"
              ],
              "vars": {
                "merged": "1 1 2"
              }
            },
            {
              "note": "Pop the smallest head, 3 from list B, and append it to the answer. Push the next item of list B, which is 4.",
              "hl": {
                "0": "ok",
                "1": "a",
                "3": "ok",
                "4": "ok",
                "5": "a",
                "6": "ok",
                "7": "a"
              },
              "queue": [
                "4(A)",
                "6(C)",
                "4(B)"
              ],
              "vars": {
                "merged": "1 1 2 3"
              }
            },
            {
              "note": "Pop the smallest head, 4 from list A, and append it to the answer. Push the next item of list A, which is 5.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "3": "ok",
                "4": "ok",
                "5": "a",
                "6": "ok",
                "7": "a"
              },
              "queue": [
                "4(B)",
                "6(C)",
                "5(A)"
              ],
              "vars": {
                "merged": "1 1 2 3 4"
              }
            },
            {
              "note": "Pop the smallest head, 4 from list B, and append it to the answer. List B is empty now, so nothing is pushed.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok",
                "7": "a"
              },
              "queue": [
                "5(A)",
                "6(C)"
              ],
              "vars": {
                "merged": "1 1 2 3 4 4"
              }
            },
            {
              "note": "Pop the smallest head, 5 from list A, and append it to the answer. List A is empty now, so nothing is pushed.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok",
                "7": "a"
              },
              "queue": [
                "6(C)"
              ],
              "vars": {
                "merged": "1 1 2 3 4 4 5"
              }
            },
            {
              "note": "Pop the smallest head, 6 from list C, and append it to the answer. List C is empty now, so nothing is pushed.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok",
                "6": "ok",
                "7": "ok"
              },
              "queue": [],
              "vars": {
                "merged": "1 1 2 3 4 4 5 6"
              },
              "out": "Answer: 1 1 2 3 4 4 5 6"
            }
          ]
        }
      },
      "code": "// Merge k sorted linked lists into one sorted list\nListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; }; // min-heap by value\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);\n    for (ListNode* head : lists)\n        if (head) heap.push(head);               // one head per list\n    ListNode dummy;\n    ListNode* tail = &dummy;\n    while (!heap.empty()) {\n        ListNode* node = heap.top(); heap.pop(); // smallest head overall\n        tail->next = node;\n        tail = node;\n        if (node->next) heap.push(node->next);   // successor from the same list\n    }\n    return dummy.next;\n}",
      "complexity": "Time O(N log k), where N is the total number of nodes, since each node is pushed and popped once. Space O(k) for the heap.",
      "mistakes": [
        "Pushing null pointers into the heap. Check each head and each next before pushing.",
        "Writing the comparator the wrong way round. For a min-heap by value, return a->val > b->val.",
        "Pushing all N nodes at the start. That works but costs O(N) memory. Only the K heads are needed."
      ],
      "practice": [
        23,
        378,
        355
      ]
    },
    "4": {
      "name": "Two heaps",
      "when": "You need the median of numbers that keep arriving, or any middle value of a moving collection. Phrases like running median, median of a stream, or sliding window median point here.",
      "idea": "The median sits in the middle of the sorted order, so split the numbers into two halves. The lower half goes in a max-heap, so you can reach its biggest value. The upper half goes in a min-heap, so you can reach its smallest value. The two tops are exactly the two middle numbers. Keep the heaps equal in size, or let the lower one have one extra. Then the median is the top of the lower heap when the total is odd, or the average of both tops when it is even.",
      "steps": [
        "Keep a max-heap lo (smaller half) and a min-heap hi (bigger half).",
        "To add a number, push it into lo, then move lo's top into hi. This keeps every item in lo smaller than every item in hi.",
        "If hi now has more items than lo, move hi's top back into lo.",
        "Median: if lo is bigger, return lo.top(). Otherwise return (lo.top() + hi.top()) / 2.0.",
        "Each add and each median query is fast, so no sorting is ever needed."
      ],
      "example": {
        "problem": "Find Median from Data Stream. Add the numbers 5, 15, 1, 3, 2, 8 one at a time and report the median after each. Output: 5, 10, 5, 4, 3, 4.",
        "walk": "The stack panel is the lower half, with its maximum on top (the right end). The queue panel is the upper half, with its minimum at the front. After every add, the last stack item and the first queue item are the two middle values. Check the frame for 3: lower half 1, 3 and upper half 5, 15 give (3 + 5) / 2 = 4.",
        "viz": {
          "kind": "array",
          "cells": [
            5,
            15,
            1,
            3,
            2,
            8
          ],
          "frames": [
            {
              "note": "Stream 5, 15, 1, 3, 2, 8. Stack = lower half (max on top), queue = upper half (min at front). Number 5 goes through the lower heap to the upper one, then back, to balance.",
              "hl": {
                "0": "a"
              },
              "ptrs": {
                "i": 0
              },
              "stack": [
                5
              ],
              "queue": [],
              "vars": {
                "median": 5,
                "lo": 1,
                "hi": 0
              }
            },
            {
              "note": "Add 15. It passes through the lower heap, its biggest moves to the upper heap. The median is 10.",
              "hl": {
                "1": "a"
              },
              "ptrs": {
                "i": 1
              },
              "stack": [
                5
              ],
              "queue": [
                15
              ],
              "vars": {
                "median": 10,
                "lo": 1,
                "hi": 1
              }
            },
            {
              "note": "Add 1. It passes through the lower heap, its biggest moves to the upper heap. Then the upper heap was bigger, so its smallest moved back to the lower heap. The median is 5.",
              "hl": {
                "2": "a"
              },
              "ptrs": {
                "i": 2
              },
              "stack": [
                1,
                5
              ],
              "queue": [
                15
              ],
              "vars": {
                "median": 5,
                "lo": 2,
                "hi": 1
              }
            },
            {
              "note": "Add 3. It passes through the lower heap, its biggest moves to the upper heap. The median is 4.",
              "hl": {
                "3": "a"
              },
              "ptrs": {
                "i": 3
              },
              "stack": [
                1,
                3
              ],
              "queue": [
                5,
                15
              ],
              "vars": {
                "median": 4,
                "lo": 2,
                "hi": 2
              }
            },
            {
              "note": "Add 2. It passes through the lower heap, its biggest moves to the upper heap. Then the upper heap was bigger, so its smallest moved back to the lower heap. The median is 3.",
              "hl": {
                "4": "a"
              },
              "ptrs": {
                "i": 4
              },
              "stack": [
                1,
                2,
                3
              ],
              "queue": [
                5,
                15
              ],
              "vars": {
                "median": 3,
                "lo": 3,
                "hi": 2
              }
            },
            {
              "note": "Add 8. It passes through the lower heap, its biggest moves to the upper heap. The median is 4.",
              "hl": {
                "5": "a"
              },
              "ptrs": {
                "i": 5
              },
              "stack": [
                1,
                2,
                3
              ],
              "queue": [
                5,
                8,
                15
              ],
              "vars": {
                "median": 4,
                "lo": 3,
                "hi": 3
              },
              "out": "Medians: 5, 10, 5, 4, 3, 4"
            }
          ]
        }
      },
      "code": "class MedianFinder {\n    priority_queue<int> lo;                            // max-heap: smaller half\n    priority_queue<int, vector<int>, greater<int>> hi; // min-heap: bigger half\npublic:\n    void addNum(int num) {\n        lo.push(num);\n        hi.push(lo.top()); lo.pop();   // biggest of the small half goes up\n        if (hi.size() > lo.size()) {   // keep lo the same size or one bigger\n            lo.push(hi.top()); hi.pop();\n        }\n    }\n    double findMedian() {\n        if (lo.size() > hi.size()) return lo.top();\n        return (lo.top() + hi.top()) / 2.0;\n    }\n};",
      "complexity": "addNum is O(log n) and findMedian is O(1). Space O(n) for all stored numbers.",
      "mistakes": [
        "Letting the heap sizes drift apart by more than one. Rebalance after every add.",
        "Doing integer division when averaging the two tops. Use / 2.0 so 4.5 is not turned into 4.",
        "Adding to the wrong heap first. Pushing straight into one heap can break the rule that lo is all smaller than hi."
      ],
      "practice": [
        295,
        480
      ]
    },
    "5": {
      "name": "Greedy with a heap",
      "when": "At each step you must pick the best item that is currently available, and the best one changes as things happen. Task scheduler, reorganize string, IPO and meeting-room problems often fit.",
      "idea": "Greedy means you always take the locally best choice. The hard part is finding that best choice quickly when the choices keep changing. A heap fixes that: it hands you the best available item in O(log n) and lets you add new items as they become available. For Reorganize String, the best choice is the letter with the most copies left, because the most common letter is the one most likely to cause two equal neighbours. To avoid repeating a letter, hold it out of the heap for one turn, then put it back with one fewer copy.",
      "steps": [
        "Count the letters and push (count, letter) for each into a max-heap.",
        "Pop the top pair and write its letter to the answer.",
        "If a pair is being held from the last turn and still has copies, push it back now.",
        "Hold the pair you just used, with its count minus one, until the next turn.",
        "When the heap is empty, check that the answer has the full length. If not, no valid arrangement exists."
      ],
      "example": {
        "problem": "Reorganize String: rearrange the letters of s = \"aabbbc\" so that no two equal letters are next to each other. One valid output: \"babcba\".",
        "walk": "The queue is the heap, written letter:count, biggest count first. The held chip shows the letter that must wait. At the first step b (3 copies) is written. At the second step b is not allowed again, so a is used, and then b is released back to the heap. The result alternates and the letter with the most copies is never stuck at the end.",
        "viz": {
          "kind": "array",
          "cells": [
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "frames": [
            {
              "note": "Rearrange aabbbc so no two equal letters touch. The queue is a max-heap of letter:count. Greedy rule: always write the letter with the most copies left, but never the same one twice in a row.",
              "cells": [
                null,
                null,
                null,
                null,
                null,
                null
              ],
              "queue": [
                "b:3",
                "a:2",
                "c:1"
              ],
              "vars": {
                "held": "none"
              }
            },
            {
              "note": "Take b, the letter with the most copies left (3), and write it in slot 0. Now b waits one turn.",
              "cells": [
                "b",
                null,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "0": "a"
              },
              "queue": [
                "a:2",
                "c:1"
              ],
              "vars": {
                "held": "b:2"
              }
            },
            {
              "note": "Take a, the letter with the most copies left (2), and write it in slot 1. Put b:2 back in the heap, since a different letter was written. Now a waits one turn.",
              "cells": [
                "b",
                "a",
                null,
                null,
                null,
                null
              ],
              "hl": {
                "1": "a"
              },
              "queue": [
                "b:2",
                "c:1"
              ],
              "vars": {
                "held": "a:1"
              }
            },
            {
              "note": "Take b, the letter with the most copies left (2), and write it in slot 2. Put a:1 back in the heap, since a different letter was written. Now b waits one turn.",
              "cells": [
                "b",
                "a",
                "b",
                null,
                null,
                null
              ],
              "hl": {
                "2": "a"
              },
              "queue": [
                "c:1",
                "a:1"
              ],
              "vars": {
                "held": "b:1"
              }
            },
            {
              "note": "Take c, the letter with the most copies left (1), and write it in slot 3. Put b:1 back in the heap, since a different letter was written. Now c waits one turn.",
              "cells": [
                "b",
                "a",
                "b",
                "c",
                null,
                null
              ],
              "hl": {
                "3": "a"
              },
              "queue": [
                "b:1",
                "a:1"
              ],
              "vars": {
                "held": "c:0"
              }
            },
            {
              "note": "Take b, the letter with the most copies left (1), and write it in slot 4. Now b waits one turn.",
              "cells": [
                "b",
                "a",
                "b",
                "c",
                "b",
                null
              ],
              "hl": {
                "4": "a"
              },
              "queue": [
                "a:1"
              ],
              "vars": {
                "held": "b:0"
              }
            },
            {
              "note": "Take a, the letter with the most copies left (1), and write it in slot 5. Now a waits one turn.",
              "cells": [
                "b",
                "a",
                "b",
                "c",
                "b",
                "a"
              ],
              "hl": {
                "5": "a"
              },
              "queue": [],
              "vars": {
                "held": "a:0"
              },
              "out": "Answer: babcba"
            }
          ]
        }
      },
      "code": "// Rearrange so no two adjacent letters are equal; return \"\" if impossible\nstring reorganizeString(string s) {\n    int cnt[26] = {};\n    for (char c : s) cnt[c - 'a']++;\n    priority_queue<pair<int,char>> heap;          // biggest count on top\n    for (int i = 0; i < 26; i++)\n        if (cnt[i]) heap.push({cnt[i], 'a' + i});\n    string res;\n    pair<int,char> held = {0, '#'};               // letter used last turn\n    while (!heap.empty()) {\n        auto [c, ch] = heap.top(); heap.pop();\n        res += ch;\n        if (held.first > 0) heap.push(held);      // it may be used again now\n        held = {c - 1, ch};                       // this one must wait a turn\n    }\n    return res.size() == s.size() ? res : \"\";\n}",
      "complexity": "Time O(n log 26), which is O(n) since the alphabet is fixed. Space O(1) beyond the answer.",
      "mistakes": [
        "Pushing the used letter straight back into the heap. It would be popped again and you would write the same letter twice.",
        "Forgetting the impossible case. If one letter is more than half the string (rounded up), the loop ends early and you must return an empty string.",
        "Not pushing the held pair back before the loop ends, which loses letters from the answer."
      ],
      "practice": [
        767,
        621,
        502
      ]
    },
    "6": {
      "name": "Closest points or values",
      "when": "You are asked for the K closest, nearest, or smallest-distance items to some target (a point, a number, a position). The word closest, nearest or weakest with a K is the clue.",
      "idea": "Turn every item into a single number, its distance to the target. Now it is the same size-K heap idea, with one twist: you want the K SMALLEST distances, so the item to throw away is the FARTHEST one. That means a max-heap. Keep at most K items in it. When a new item makes the heap too big, pop the top, which is the farthest of the kept items. Compare squared distances so you can skip the square root, since a bigger distance always has a bigger square.",
      "steps": [
        "Decide the key: for points use x*x + y*y, for numbers use abs(value - target).",
        "Make a max-heap of (distance, index). The farthest kept item is on top.",
        "Push each item. If the heap has more than K items, pop the farthest.",
        "After the loop, the heap holds the K closest items. Read them out using the stored index.",
        "Store the index, not a copy of the point, to keep the heap light and the code simple."
      ],
      "example": {
        "problem": "K Closest Points to Origin. Input: points = [[3,3],[5,-1],[-2,4],[1,1],[2,2]], k = 2. Output: [1,1] and [2,2] (squared distances 2 and 8).",
        "walk": "The queue shows the heap with the largest distance first, so the front is the next point to be evicted. Watch the third point, [-2,4], with distance 20. It pushes the size to 3 and the farthest, 26, is evicted. Then [1,1] with distance 2 evicts 20. Closer points keep arriving and kick out farther ones.",
        "viz": {
          "kind": "array",
          "cells": [
            "[3,3]",
            "[5,-1]",
            "[-2,4]",
            "[1,1]",
            "[2,2]"
          ],
          "frames": [
            {
              "note": "Find the 2 closest points to the origin. Use a MAX-heap of size 2 keyed by squared distance, so the farthest kept point is on top. The queue shows the heap, farthest first.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {},
              "queue": [],
              "vars": {
                "k": 2
              }
            },
            {
              "note": "Point [3,3] has squared distance 18. The heap has room, so just push it.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "0": "a"
              },
              "queue": [
                "18:[3,3]"
              ],
              "vars": {
                "d": 18,
                "k": 2
              }
            },
            {
              "note": "Point [5,-1] has squared distance 26. The heap has room, so just push it.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "1": "a"
              },
              "queue": [
                "26:[5,-1]",
                "18:[3,3]"
              ],
              "vars": {
                "d": 26,
                "k": 2
              }
            },
            {
              "note": "Point [-2,4] has squared distance 20. Push it. The heap holds 3 points, more than K = 2, so the farthest one is popped.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "2": "a"
              },
              "queue": [
                "26:[5,-1]",
                "20:[-2,4]",
                "18:[3,3]"
              ],
              "vars": {
                "d": 20,
                "k": 2
              }
            },
            {
              "note": "Pop the farthest, distance 26. The heap again holds the 2 closest points seen so far.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "2": "a"
              },
              "queue": [
                "20:[-2,4]",
                "18:[3,3]"
              ],
              "vars": {
                "d": 20,
                "k": 2
              }
            },
            {
              "note": "Point [1,1] has squared distance 2. Push it. The heap holds 3 points, more than K = 2, so the farthest one is popped.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "3": "a"
              },
              "queue": [
                "20:[-2,4]",
                "18:[3,3]",
                "2:[1,1]"
              ],
              "vars": {
                "d": 2,
                "k": 2
              }
            },
            {
              "note": "Pop the farthest, distance 20. The heap again holds the 2 closest points seen so far.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "3": "a"
              },
              "queue": [
                "18:[3,3]",
                "2:[1,1]"
              ],
              "vars": {
                "d": 2,
                "k": 2
              }
            },
            {
              "note": "Point [2,2] has squared distance 8. Push it. The heap holds 3 points, more than K = 2, so the farthest one is popped.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "4": "a"
              },
              "queue": [
                "18:[3,3]",
                "8:[2,2]",
                "2:[1,1]"
              ],
              "vars": {
                "d": 8,
                "k": 2
              }
            },
            {
              "note": "Pop the farthest, distance 18. The heap again holds the 2 closest points seen so far.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "4": "a"
              },
              "queue": [
                "8:[2,2]",
                "2:[1,1]"
              ],
              "vars": {
                "d": 8,
                "k": 2
              }
            },
            {
              "note": "All points are read. The heap holds the 2 closest: [1,1] with distance 2 and [2,2] with distance 8.",
              "cells": [
                "[3,3]",
                "[5,-1]",
                "[-2,4]",
                "[1,1]",
                "[2,2]"
              ],
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "ok",
                "4": "ok"
              },
              "queue": [
                "8:[2,2]",
                "2:[1,1]"
              ],
              "out": "Answer: [1,1] and [2,2]"
            }
          ]
        }
      },
      "code": "// K closest points to the origin (any order)\nvector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n    priority_queue<pair<int,int>> heap;     // max-heap of (squared distance, index)\n    for (int i = 0; i < (int)points.size(); i++) {\n        int d = points[i][0] * points[i][0] + points[i][1] * points[i][1];\n        heap.push({d, i});\n        if ((int)heap.size() > k) heap.pop();   // drop the farthest\n    }\n    vector<vector<int>> ans;\n    while (!heap.empty()) {\n        ans.push_back(points[heap.top().second]);\n        heap.pop();\n    }\n    return ans;\n}",
      "complexity": "Time O(n log k), since the heap never holds more than k items. Space O(k).",
      "mistakes": [
        "Using a min-heap for the K closest. The farthest kept item must be on top so you can remove it, so use a max-heap.",
        "Taking the square root. It is slower and adds floating point errors, and squared distances already compare correctly.",
        "Overflow with big coordinates in other problems. Use long long when squares can pass 2 billion."
      ],
      "practice": [
        973,
        658,
        1337
      ]
    }
  },
  "10": {
    "0": {
      "name": "Sort, then sweep",
      "when": "Items have a start and an end, or a value to compare, and checking every pair would be O(n squared). If sorting first makes only the neighbour or the best-so-far matter, this is the pattern.",
      "idea": "Sorting turns a messy problem into an orderly one. After sorting by start, every interval that could cover or touch the current one has already been seen. So you walk the list once and only remember one small fact about the past, such as the largest end so far. That fact answers the question for the current interval in O(1). Sorting costs O(n log n), the sweep costs O(n), and no nested loop is needed. When starts are equal, break the tie on purpose so the sweep stays correct.",
      "steps": [
        "Decide the sort key. Often it is the start, and the tie rule decides what happens with equal starts.",
        "Sort the items with a comparator lambda.",
        "Walk through the sorted list once, keeping the little bit of state you need (the last chosen item, or the biggest end so far).",
        "For each item, compare it with that state, decide to keep or skip it, and update the state.",
        "Return the count or the built list."
      ],
      "example": {
        "problem": "Remove Covered Intervals. Input: [[3,6],[1,4],[2,5],[2,8],[5,7],[9,10]]. Output: 3, because [2,5], [3,6] and [5,7] are covered by [2,8].",
        "walk": "After sorting, one number tells the story: maxEnd, the biggest end seen so far. If an interval ends beyond maxEnd, nothing earlier can cover it. Otherwise something earlier already starts before it and ends after it. Notice the tie rule: [2,8] is placed before [2,5], so [2,5] is correctly flagged as covered.",
        "viz": {
          "kind": "array",
          "cells": [
            "[3,6]",
            "[1,4]",
            "[2,5]",
            "[2,8]",
            "[5,7]",
            "[9,10]"
          ],
          "frames": [
            {
              "note": "Count the intervals that are NOT covered by another interval. Input in the given order. Covered means another interval starts earlier or equal and ends later or equal.",
              "cells": [
                "[3,6]",
                "[1,4]",
                "[2,5]",
                "[2,8]",
                "[5,7]",
                "[9,10]"
              ],
              "vars": {
                "kept": 0
              }
            },
            {
              "note": "Sort by start ascending. When two starts are equal, put the longer one first, so [2,8] comes before [2,5]. Now anything that could cover an interval comes before it.",
              "cells": [
                "[1,4]",
                "[2,8]",
                "[2,5]",
                "[3,6]",
                "[5,7]",
                "[9,10]"
              ],
              "vars": {
                "kept": 0,
                "maxEnd": 0
              }
            },
            {
              "note": "[1,4] ends at 4, past maxEnd 0. Nothing before it covers it, so keep it. maxEnd becomes 4.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "ok"
              },
              "vars": {
                "kept": 1,
                "maxEnd": 4
              }
            },
            {
              "note": "[2,8] ends at 8, past maxEnd 4. Nothing before it covers it, so keep it. maxEnd becomes 8.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "1": "ok"
              },
              "vars": {
                "kept": 2,
                "maxEnd": 8
              }
            },
            {
              "note": "[2,5] ends at 5, which is not past maxEnd 8. An earlier interval starts before it and ends after it, so it is covered.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "2": "bad"
              },
              "vars": {
                "kept": 2,
                "maxEnd": 8
              }
            },
            {
              "note": "[3,6] ends at 6, which is not past maxEnd 8. An earlier interval starts before it and ends after it, so it is covered.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "3": "bad"
              },
              "vars": {
                "kept": 2,
                "maxEnd": 8
              }
            },
            {
              "note": "[5,7] ends at 7, which is not past maxEnd 8. An earlier interval starts before it and ends after it, so it is covered.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "4": "bad"
              },
              "vars": {
                "kept": 2,
                "maxEnd": 8
              }
            },
            {
              "note": "[9,10] ends at 10, past maxEnd 8. Nothing before it covers it, so keep it. maxEnd becomes 10.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "5": "ok"
              },
              "vars": {
                "kept": 3,
                "maxEnd": 10
              },
              "out": "Answer: 3 intervals remain"
            }
          ]
        }
      },
      "code": "int removeCoveredIntervals(vector<vector<int>>& intervals) {\n    // start ascending; for equal starts, the longer interval first\n    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {\n        return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1];\n    });\n    int kept = 0, maxEnd = 0;\n    for (auto& iv : intervals) {\n        if (iv[1] > maxEnd) {   // ends past everything before it: not covered\n            kept++;\n            maxEnd = iv[1];\n        }\n    }\n    return kept;\n}",
      "complexity": "Time O(n log n) for the sort, then O(n) for the sweep. Space O(1) extra, apart from the sort.",
      "mistakes": [
        "Skipping the tie rule. With equal starts and the shorter one first, a covered interval looks uncovered.",
        "Comparing the start instead of the end against maxEnd. After sorting by start, the end is what decides coverage.",
        "Forgetting that sort changes the input order. Copy the vector first if you still need the original."
      ],
      "practice": [
        1288,
        455,
        56
      ]
    },
    "1": {
      "name": "Merge intervals",
      "when": "You get a list of ranges (meetings, time slots, segments) and must combine the ones that overlap, or insert a new range into a list and fix the overlaps.",
      "idea": "If the intervals are sorted by start, overlaps can only happen between neighbours. So keep a result list and look only at its LAST interval. Take the next interval. If its start is at or before the last end, they overlap, so stretch the last end to the bigger of the two ends. If its start is after the last end, there is a gap, so close the old interval and start a new one. The max matters: a later interval can sit fully inside the earlier one and must not shrink it.",
      "steps": [
        "Sort the intervals by start.",
        "Put the first interval into the result list.",
        "For each next interval, compare its start with the end of the last interval in the result.",
        "If start <= last end, set last end = max(last end, this end). Otherwise push the interval as a new one.",
        "Return the result list."
      ],
      "example": {
        "problem": "Merge Intervals. Input: [[8,10],[1,3],[15,18],[2,6],[6,7]]. Output: [[1,7],[8,10],[15,18]].",
        "walk": "After the sort, the stack panel shows the merged list so far. Watch the last interval in it. [2,6] starts at 2, before the end 3, so [1,3] grows to [1,6]. Then [6,7] only touches at 6, which still counts as overlap, so the end grows to 7. The gap between 7 and 8 is what keeps [8,10] separate.",
        "viz": {
          "kind": "array",
          "cells": [
            "[8,10]",
            "[1,3]",
            "[15,18]",
            "[2,6]",
            "[6,7]"
          ],
          "frames": [
            {
              "note": "Merge all overlapping intervals. Two intervals overlap when one starts before the other ends. They are given in a random order.",
              "cells": [
                "[8,10]",
                "[1,3]",
                "[15,18]",
                "[2,6]",
                "[6,7]"
              ],
              "vars": {
                "merged": 0
              }
            },
            {
              "note": "Sort by start. Now any interval that overlaps the last merged one must come right after it. The order is a sweep from left to right.",
              "cells": [
                "[1,3]",
                "[2,6]",
                "[6,7]",
                "[8,10]",
                "[15,18]"
              ],
              "vars": {
                "merged": 0
              }
            },
            {
              "note": "[1,3] starts at 1, after the last end. No overlap, so start a new merged interval.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "a"
              },
              "stack": [
                "[1,3]"
              ],
              "vars": {
                "merged": 1
              }
            },
            {
              "note": "[2,6] starts at 2, which is at or before the end 3 of [1,3]. They overlap, so the end becomes max(3, 6) = 6.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "0": "dim",
                "1": "a"
              },
              "stack": [
                "[1,6]"
              ],
              "vars": {
                "merged": 1
              }
            },
            {
              "note": "[6,7] starts at 6, which is at or before the end 6 of [1,6]. They overlap, so the end becomes max(6, 7) = 7.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "a"
              },
              "stack": [
                "[1,7]"
              ],
              "vars": {
                "merged": 1
              }
            },
            {
              "note": "[8,10] starts at 8, after the last end 7. No overlap, so start a new merged interval.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "a"
              },
              "stack": [
                "[1,7]",
                "[8,10]"
              ],
              "vars": {
                "merged": 2
              }
            },
            {
              "note": "[15,18] starts at 15, after the last end 10. No overlap, so start a new merged interval.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "0": "dim",
                "1": "dim",
                "2": "dim",
                "3": "dim",
                "4": "a"
              },
              "stack": [
                "[1,7]",
                "[8,10]",
                "[15,18]"
              ],
              "vars": {
                "merged": 3
              },
              "out": "Answer: [1,7] [8,10] [15,18]"
            }
          ]
        }
      },
      "code": "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());   // sort by start\n    vector<vector<int>> res;\n    for (auto& cur : intervals) {\n        if (!res.empty() && cur[0] <= res.back()[1])\n            res.back()[1] = max(res.back()[1], cur[1]); // overlap: stretch the end\n        else\n            res.push_back(cur);                         // gap: start a new interval\n    }\n    return res;\n}",
      "complexity": "Time O(n log n) for the sort, then one O(n) pass. Space O(n) for the result.",
      "mistakes": [
        "Setting the end to cur[1] instead of max(end, cur[1]). A small interval inside a big one would shrink it.",
        "Using < instead of <= when the problem says touching intervals merge. [1,4] and [4,5] should become [1,5].",
        "Not sorting first. Without the sort, overlaps can hide far apart in the list."
      ],
      "practice": [
        56,
        57,
        763
      ]
    },
    "2": {
      "name": "Interval scheduling",
      "when": "You want the most non-overlapping intervals, the fewest to remove so none overlap, or the fewest arrows or points to hit all intervals. Meeting rooms with one room and balloon bursting are cousins.",
      "idea": "Sort by END time, not start. The interval that finishes first blocks the least of the future, so taking it is never a bad choice. Walk the sorted list and remember the end of the last kept interval. If the next interval starts at or after that end, keep it. If it starts earlier, it overlaps a kept one that already ends sooner than it does, so throw the new one away. The number kept is the maximum, and the number thrown away is the minimum to remove.",
      "steps": [
        "Sort the intervals by end time.",
        "Set lastEnd to a very small number and removed to 0.",
        "For each interval, if its start >= lastEnd, keep it and set lastEnd to its end.",
        "Otherwise it overlaps, so add 1 to removed and do not change lastEnd.",
        "Return removed (or the kept count, depending on the question)."
      ],
      "example": {
        "problem": "Non-overlapping Intervals. Input: [[1,4],[2,3],[3,5],[4,6],[5,8],[7,9]]. Output: 3, the fewest intervals to remove. Kept: [2,3], [3,5], [5,8].",
        "walk": "The cells are sorted by end time, so [2,3] comes first even though [1,4] starts earlier. Green cells are kept and red cells are removed. Notice that [1,4] is removed and the short [2,3] is kept. Picking the earliest finisher leaves the most room, so 3 intervals fit.",
        "viz": {
          "kind": "array",
          "cells": [
            "[1,4]",
            "[2,3]",
            "[3,5]",
            "[4,6]",
            "[5,8]",
            "[7,9]"
          ],
          "frames": [
            {
              "note": "Remove the fewest intervals so the rest do not overlap. Touching ends like [2,3] and [3,5] are fine. Input is in the given order.",
              "cells": [
                "[1,4]",
                "[2,3]",
                "[3,5]",
                "[4,6]",
                "[5,8]",
                "[7,9]"
              ],
              "vars": {
                "removed": 0
              }
            },
            {
              "note": "Sort by END time. The interval that ends first leaves the most room for the ones after it. That is the greedy choice.",
              "cells": [
                "[2,3]",
                "[1,4]",
                "[3,5]",
                "[4,6]",
                "[5,8]",
                "[7,9]"
              ],
              "vars": {
                "lastEnd": "none",
                "removed": 0
              }
            },
            {
              "note": "[2,3] starts at 2. No overlap, so keep it. lastEnd becomes 3.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "ok"
              },
              "vars": {
                "lastEnd": 3,
                "removed": 0
              }
            },
            {
              "note": "[1,4] starts at 1, before lastEnd 3. It overlaps the kept interval, so remove it. Total removed: 1.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "0": "ok",
                "1": "bad"
              },
              "vars": {
                "lastEnd": 3,
                "removed": 1
              }
            },
            {
              "note": "[3,5] starts at 3, not before lastEnd 3. No overlap, so keep it. lastEnd becomes 5.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok"
              },
              "vars": {
                "lastEnd": 5,
                "removed": 1
              }
            },
            {
              "note": "[4,6] starts at 4, before lastEnd 5. It overlaps the kept interval, so remove it. Total removed: 2.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "bad"
              },
              "vars": {
                "lastEnd": 5,
                "removed": 2
              }
            },
            {
              "note": "[5,8] starts at 5, not before lastEnd 5. No overlap, so keep it. lastEnd becomes 8.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "bad",
                "4": "ok"
              },
              "vars": {
                "lastEnd": 8,
                "removed": 2
              }
            },
            {
              "note": "[7,9] starts at 7, before lastEnd 8. It overlaps the kept interval, so remove it. Total removed: 3.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "0": "ok",
                "1": "bad",
                "2": "ok",
                "3": "bad",
                "4": "ok",
                "5": "bad"
              },
              "vars": {
                "lastEnd": 8,
                "removed": 3
              },
              "out": "Answer: remove 3 intervals"
            }
          ]
        }
      },
      "code": "int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n    // sort by end time: the earliest finisher goes first\n    sort(intervals.begin(), intervals.end(),\n         [](auto& a, auto& b) { return a[1] < b[1]; });\n    int lastEnd = INT_MIN, removed = 0;\n    for (auto& iv : intervals) {\n        if (iv[0] >= lastEnd) lastEnd = iv[1]; // fits: keep it\n        else removed++;                        // overlaps: remove it\n    }\n    return removed;\n}",
      "complexity": "Time O(n log n) for the sort and O(n) for the pass. Space O(1) extra.",
      "mistakes": [
        "Sorting by start. A long interval that starts early would be kept and block many short ones.",
        "Using > instead of >= in the check. Touching intervals like [2,3] and [3,5] do not overlap.",
        "Updating lastEnd when an interval is removed. Only kept intervals set lastEnd."
      ],
      "practice": [
        435,
        452
      ]
    },
    "3": {
      "name": "Farthest reach",
      "when": "You stand on an array where each cell says how far you can jump, and you ask whether the end is reachable (Jump Game) or the fewest jumps to get there (Jump Game II).",
      "idea": "You do not need to try every path. Just track the farthest index you can reach so far. For Jump Game, walk left to right: if you are standing at an index beyond the farthest reach, you are stuck and the answer is false. For Jump Game II, think in layers like a breadth-first search. One jump reaches a range of cells. While you scan that range, keep the farthest point any of them reaches. When the scan hits the edge of the range, you must jump once more, and the new range ends at that farthest point.",
      "steps": [
        "Keep far (the farthest index reachable) and, for Jump Game II, curEnd (the end of the current jump's range) and jumps.",
        "At each index i, update far = max(far, i + nums[i]).",
        "For Jump Game: if i > far before the update, return false. If far reaches the last index, return true.",
        "For Jump Game II: when i == curEnd, add 1 to jumps and set curEnd = far.",
        "Stop the loop before the last index, since you do not need to jump from it."
      ],
      "example": {
        "problem": "Jump Game II. Input: nums = [2,3,1,1,4,2,1]. Output: 3. One path is index 0 to 1 to 4 to 6.",
        "walk": "Violet cells show where the current cell can jump. The key moments are the green ones, where i hits curEnd. At index 0 we must jump, and the best range ends at 2. At index 2 we must jump again, and the best reach is 4. At index 4 the third jump reaches 8, past the end. The vars show far growing quietly while jumps only change at the edges.",
        "viz": {
          "kind": "array",
          "cells": [
            2,
            3,
            1,
            1,
            4,
            2,
            1
          ],
          "frames": [
            {
              "note": "Jump Game II: from index 0, each number is the longest jump from that cell. Find the fewest jumps to reach the last index.",
              "cells": [
                2,
                3,
                1,
                1,
                4,
                2,
                1
              ],
              "hl": {
                "0": "a"
              },
              "vars": {
                "jumps": 0,
                "curEnd": 0,
                "far": 0
              }
            },
            {
              "note": "Index 0 is the end of this jump's range. Make jump 1. The farthest we could reach is 2, so the next range ends at 2.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "ok",
                "1": "b",
                "2": "b"
              },
              "vars": {
                "jumps": 1,
                "curEnd": 2,
                "far": 2
              }
            },
            {
              "note": "Index 1 can reach 4. far = 4. We are still inside the current range (ends at 2), so no new jump yet.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "1": "a",
                "2": "b",
                "3": "b",
                "4": "b"
              },
              "vars": {
                "jumps": 1,
                "curEnd": 2,
                "far": 4
              }
            },
            {
              "note": "Index 2 is the end of this jump's range. Make jump 2. The farthest we could reach is 4, so the next range ends at 4.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "2": "ok",
                "3": "b"
              },
              "vars": {
                "jumps": 2,
                "curEnd": 4,
                "far": 4
              }
            },
            {
              "note": "Index 3 can reach 4. far = 4. We are still inside the current range (ends at 4), so no new jump yet.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "3": "a",
                "4": "b"
              },
              "vars": {
                "jumps": 2,
                "curEnd": 4,
                "far": 4
              }
            },
            {
              "note": "Index 4 is the end of this jump's range. Make jump 3. The farthest we could reach is 8, so the next range ends at 8.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "4": "ok",
                "5": "b",
                "6": "b"
              },
              "vars": {
                "jumps": 3,
                "curEnd": 8,
                "far": 8
              }
            },
            {
              "note": "Index 5 can reach 7. far = 8. We are still inside the current range (ends at 8), so no new jump yet.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "5": "a",
                "6": "b"
              },
              "vars": {
                "jumps": 3,
                "curEnd": 8,
                "far": 8
              }
            },
            {
              "note": "curEnd is 8, past the last index 6, so the last cell is reachable with 3 jumps. We never had to pick the exact path.",
              "cells": [
                2,
                3,
                1,
                1,
                4,
                2,
                1
              ],
              "hl": {
                "6": "ok"
              },
              "vars": {
                "jumps": 3,
                "curEnd": 8,
                "far": 8
              },
              "out": "Answer: 3 jumps"
            }
          ]
        }
      },
      "code": "int jump(vector<int>& nums) {\n    int jumps = 0, curEnd = 0, far = 0;\n    for (int i = 0; i + 1 < (int)nums.size(); i++) {\n        far = max(far, i + nums[i]);   // farthest index reachable so far\n        if (i == curEnd) {             // end of the current jump's range\n            jumps++;                   // we must take another jump\n            curEnd = far;              // the new range ends at far\n        }\n    }\n    return jumps;\n}",
      "complexity": "Time O(n), one pass. Space O(1).",
      "mistakes": [
        "Running the loop to the last index. That adds an extra jump when curEnd equals the last index.",
        "Updating curEnd every step instead of only when i == curEnd. That counts too many jumps.",
        "In Jump Game, forgetting to stop when i > far. A zero can trap you before the end."
      ],
      "practice": [
        55,
        45
      ]
    },
    "4": {
      "name": "Running balance",
      "when": "You walk a circle or a line while a running total goes up and down, and you need a valid starting point, or you must restart whenever the total goes below zero. Gas station is the classic.",
      "idea": "Keep a running tank. When it drops below zero at index i, the current start has failed. The surprising part: every start between the old start and i fails too. Each of those would reach i with a tank that is at most as full as ours, and ours is already negative. So skip them all and restart at i + 1. At the end, if the sum of all gains is not negative, the last restart point is the answer. If the total is negative, there is not enough fuel anywhere and the answer is -1.",
      "steps": [
        "Keep total (sum of all gains), tank (current run), and start.",
        "At each station add gas[i] - cost[i] to both total and tank.",
        "If tank < 0, set start = i + 1 and reset tank to 0.",
        "After the loop, if total < 0 return -1.",
        "Otherwise return start."
      ],
      "example": {
        "problem": "Gas Station. gas = [3,1,1,5,2,4], cost = [2,2,3,2,3,3]. The cells show gas - cost: [1,-1,-2,3,-1,1]. Output: 3.",
        "walk": "The dashed window is the stretch tried from the current start. Watch index 2: the tank falls to -2, so the window is red and we restart at 3. That skips starts 0, 1 and 2 in one move. From 3 the tank stays at or above 0 all the way to the end, and the total gain of 1 proves the wrap-around works.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            -1,
            -2,
            3,
            -1,
            1
          ],
          "frames": [
            {
              "note": "Gas station: gas[i] fuel is gained at station i and cost[i] is needed to reach the next one. The cells show gain = gas - cost. Find the start index that completes the circle.",
              "cells": [
                1,
                -1,
                -2,
                3,
                -1,
                1
              ],
              "hl": {},
              "vars": {
                "tank": 0,
                "total": 0,
                "start": 0
              }
            },
            {
              "note": "Add the gain 1. The tank is 1, still not below zero, so start 0 still works so far.",
              "ptrs": {
                "start": 0,
                "i": 0
              },
              "win": [
                0,
                0
              ],
              "hl": {
                "0": "a"
              },
              "vars": {
                "tank": 1,
                "total": 1,
                "start": 0
              }
            },
            {
              "note": "Add the gain -1. The tank is 0, still not below zero, so start 0 still works so far.",
              "ptrs": {
                "start": 0,
                "i": 1
              },
              "win": [
                0,
                1
              ],
              "hl": {
                "1": "a"
              },
              "vars": {
                "tank": 0,
                "total": 0,
                "start": 0
              }
            },
            {
              "note": "Gain -2 makes the tank -2, below zero. We could not get here from index 0, or from any start in between. Restart at 3 with an empty tank.",
              "ptrs": {
                "start": 0,
                "i": 2
              },
              "win": [
                0,
                2
              ],
              "hl": {
                "2": "bad"
              },
              "vars": {
                "tank": -2,
                "total": -2,
                "start": 3
              }
            },
            {
              "note": "Add the gain 3. The tank is 3, still not below zero, so start 3 still works so far.",
              "ptrs": {
                "start": 3,
                "i": 3
              },
              "win": [
                3,
                3
              ],
              "hl": {
                "3": "a"
              },
              "vars": {
                "tank": 3,
                "total": 1,
                "start": 3
              }
            },
            {
              "note": "Add the gain -1. The tank is 2, still not below zero, so start 3 still works so far.",
              "ptrs": {
                "start": 3,
                "i": 4
              },
              "win": [
                3,
                4
              ],
              "hl": {
                "4": "a"
              },
              "vars": {
                "tank": 2,
                "total": 0,
                "start": 3
              }
            },
            {
              "note": "Add the gain 1. The tank is 3, still not below zero, so start 3 still works so far.",
              "ptrs": {
                "start": 3,
                "i": 5
              },
              "win": [
                3,
                5
              ],
              "hl": {
                "5": "a"
              },
              "vars": {
                "tank": 3,
                "total": 1,
                "start": 3
              }
            },
            {
              "note": "The total gain is 1, not below zero, so a full circle is possible. The restart point 3 is the answer.",
              "hl": {
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "tank": 3,
                "total": 1,
                "start": 3
              },
              "out": "Answer: start at index 3"
            }
          ]
        }
      },
      "code": "int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    int total = 0, tank = 0, start = 0;\n    for (int i = 0; i < (int)gas.size(); i++) {\n        int gain = gas[i] - cost[i];\n        total += gain;          // over the whole circle\n        tank += gain;           // since the current start\n        if (tank < 0) {         // this start failed, and so did all before i\n            start = i + 1;\n            tank = 0;\n        }\n    }\n    return total >= 0 ? start : -1;\n}",
      "complexity": "Time O(n), one pass. Space O(1).",
      "mistakes": [
        "Trying every start with an inner loop. That is O(n squared) and times out.",
        "Forgetting the total check. A restart point always exists after the loop, but it is only valid if total >= 0.",
        "Not resetting tank to 0 after a restart, which carries old debt into the new start."
      ],
      "practice": [
        134,
        860
      ]
    },
    "5": {
      "name": "Two-pass greedy",
      "when": "Each item depends on BOTH its left and its right neighbour, such as ratings, heights or scores, and one scan from a single side cannot satisfy both rules at once.",
      "idea": "Split the two rules and handle one at a time. The first pass goes left to right and only cares about the left neighbour: if the rating is higher than the left one, give one more candy than it. The second pass goes right to left and only cares about the right neighbour: if the rating is higher than the right one, make the candy at least one more than that neighbour. Use max in the second pass so the first pass is never undone. Each pass is simple and local, and together they satisfy both rules with the fewest candies.",
      "steps": [
        "Start every child with 1 candy.",
        "Scan left to right. If rating[i] > rating[i-1], set candy[i] = candy[i-1] + 1.",
        "Scan right to left. If rating[i] > rating[i+1], set candy[i] = max(candy[i], candy[i+1] + 1).",
        "Add up all the candies.",
        "The same two-scan idea works for other left and right rules, such as trapping rain water."
      ],
      "example": {
        "problem": "Candy. Input: ratings = [1,2,4,3,2,2,3]. Output: 12, with candies [1,2,3,2,1,1,2].",
        "walk": "The grid has the ratings on the top row and candies on the bottom row. The left pass lifts the candies at the rising spots (ratings 2, 4 and the last 3). The right pass then fixes the falling run 4, 3, 2: the 3 needs 2 candies and the 4 needs 3. Notice the 4 keeps its 3 candies because of the max.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              1,
              2,
              4,
              3,
              2,
              2,
              3
            ],
            [
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
          ],
          "rows": [
            "rating",
            "candy"
          ],
          "frames": [
            {
              "note": "Candy: every child gets at least 1 candy, and a child with a higher rating than a neighbour must get more than that neighbour. Top row is rating, bottom row is candy.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  1,
                  1,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {},
              "vars": {
                "total": 7
              }
            },
            {
              "note": "Left to right: rating 2 is higher than the left neighbour 1, so candy = 1 + 1 = 2.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  1,
                  1,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {
                "1,1": "a",
                "1,0": "b"
              },
              "vars": {
                "pass": "left",
                "total": 8
              }
            },
            {
              "note": "Left to right: rating 4 is higher than the left neighbour 2, so candy = 2 + 1 = 3.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  3,
                  1,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {
                "1,2": "a",
                "1,1": "b"
              },
              "vars": {
                "pass": "left",
                "total": 10
              }
            },
            {
              "note": "Left to right: rating 3 is higher than the left neighbour 2, so candy = 1 + 1 = 2.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  3,
                  1,
                  1,
                  1,
                  2
                ]
              ],
              "hl": {
                "1,6": "a",
                "1,5": "b"
              },
              "vars": {
                "pass": "left",
                "total": 11
              }
            },
            {
              "note": "The left pass is done. It guarantees that children with a lower-rated LEFT neighbour are fine. The right neighbours are not checked yet.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  3,
                  1,
                  1,
                  1,
                  2
                ]
              ],
              "hl": {
                "1,0": "dim",
                "1,1": "dim",
                "1,2": "dim",
                "1,3": "dim",
                "1,4": "dim",
                "1,5": "dim",
                "1,6": "dim"
              },
              "vars": {
                "pass": "left done",
                "total": 11
              }
            },
            {
              "note": "Right to left: rating 3 is higher than the right neighbour 2. Candy = max(old, 1 + 1) = 2. Taking the max keeps the left rule true.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  3,
                  2,
                  1,
                  1,
                  2
                ]
              ],
              "hl": {
                "1,3": "a",
                "1,4": "b"
              },
              "vars": {
                "pass": "right",
                "total": 12
              }
            },
            {
              "note": "Both passes are done. Every child follows both rules, and the total is 12 candies, the smallest possible.",
              "cells": [
                [
                  1,
                  2,
                  4,
                  3,
                  2,
                  2,
                  3
                ],
                [
                  1,
                  2,
                  3,
                  2,
                  1,
                  1,
                  2
                ]
              ],
              "hl": {
                "1,0": "ok",
                "1,1": "ok",
                "1,2": "ok",
                "1,3": "ok",
                "1,4": "ok",
                "1,5": "ok",
                "1,6": "ok"
              },
              "vars": {
                "total": 12
              },
              "out": "Answer: 12 candies"
            }
          ]
        }
      },
      "code": "int candy(vector<int>& ratings) {\n    int n = ratings.size();\n    vector<int> candy(n, 1);                  // everyone gets at least 1\n    for (int i = 1; i < n; i++)               // left to right: check the left neighbour\n        if (ratings[i] > ratings[i - 1]) candy[i] = candy[i - 1] + 1;\n    for (int i = n - 2; i >= 0; i--)          // right to left: check the right neighbour\n        if (ratings[i] > ratings[i + 1]) candy[i] = max(candy[i], candy[i + 1] + 1);\n    return accumulate(candy.begin(), candy.end(), 0);\n}",
      "complexity": "Time O(n) for two passes. Space O(n) for the candy array.",
      "mistakes": [
        "Doing only one pass. A falling run like 4, 3, 2 needs the right-to-left pass to give the 4 enough candy.",
        "Writing candy[i] = candy[i+1] + 1 in the second pass without max. That can lower the value from the first pass.",
        "Treating equal ratings as higher. Equal neighbours may have any candy count, so use a strict > check."
      ],
      "practice": [
        135,
        738
      ]
    },
    "6": {
      "name": "Sort by a custom key",
      "when": "You must assign, order or pair items, and the cost of each choice depends on a comparison between two values for the same item. The right order is not obvious until you invent a good sort key.",
      "idea": "Many greedy problems become easy once you sort by the right number. For Two City Scheduling, imagine sending everyone to city A first. Moving a person to city B changes the total by costB - costA. So the people who gain the most from moving are the ones with the smallest costB - costA. Sort by costA - costB, and the first half is best sent to A while the second half goes to B. The trick is to ask: what does each choice cost me compared with the alternative? Sort by that gap.",
      "steps": [
        "Ask what each item gains or loses by taking choice 1 instead of choice 2.",
        "Write that gap as a number for every item.",
        "Sort the items by the gap with a lambda comparator.",
        "Give the first part of the sorted list one choice and the other part the other choice.",
        "Add up the costs."
      ],
      "example": {
        "problem": "Two City Scheduling. Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]. Output: 1859.",
        "walk": "After the sort by costA - costB, the order is -511, 45, 108, 259, 394, 722. Violet cells (the first half) go to A and orange cells go to B. Look at [259,770]: A is far cheaper, so it leads the list. [840,118] is the opposite, so it ends last and goes to B.",
        "viz": {
          "kind": "array",
          "cells": [
            "[259,770]",
            "[448,54]",
            "[926,667]",
            "[184,139]",
            "[840,118]",
            "[577,469]"
          ],
          "frames": [
            {
              "note": "Two City Scheduling: send exactly half the people to city A and half to city B, with the least total cost. Each cell is [costA, costB].",
              "cells": [
                "[259,770]",
                "[448,54]",
                "[926,667]",
                "[184,139]",
                "[840,118]",
                "[577,469]"
              ],
              "vars": {
                "total": 0
              }
            },
            {
              "note": "Key idea: sort by costA - costB. A very negative number means A is much cheaper than B for that person. Those people should go to A first.",
              "cells": [
                "[259,770]",
                "[184,139]",
                "[577,469]",
                "[926,667]",
                "[448,54]",
                "[840,118]"
              ],
              "vars": {
                "total": 0
              }
            },
            {
              "note": "The differences in sorted order are -511, 45, 108, 259, 394, 722. The first 3 people get A, the last 3 get B.",
              "cells": [
                "[259,770]",
                "[184,139]",
                "[577,469]",
                "[926,667]",
                "[448,54]",
                "[840,118]"
              ],
              "hl": {
                "0": "b",
                "1": "b",
                "2": "b",
                "3": "a",
                "4": "a",
                "5": "a"
              },
              "vars": {
                "total": 0
              }
            },
            {
              "note": "Person [259,770] goes to city A and pays 259. Total: 259.",
              "ptrs": {
                "i": 0
              },
              "hl": {
                "0": "ok"
              },
              "vars": {
                "total": 259
              }
            },
            {
              "note": "Person [184,139] goes to city A and pays 184. Total: 443.",
              "ptrs": {
                "i": 1
              },
              "hl": {
                "0": "ok",
                "1": "ok"
              },
              "vars": {
                "total": 443
              }
            },
            {
              "note": "Person [577,469] goes to city A and pays 577. Total: 1020.",
              "ptrs": {
                "i": 2
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok"
              },
              "vars": {
                "total": 1020
              }
            },
            {
              "note": "Person [926,667] goes to city B and pays 667. Total: 1687.",
              "ptrs": {
                "i": 3
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok"
              },
              "vars": {
                "total": 1687
              }
            },
            {
              "note": "Person [448,54] goes to city B and pays 54. Total: 1741.",
              "ptrs": {
                "i": 4
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok"
              },
              "vars": {
                "total": 1741
              }
            },
            {
              "note": "Person [840,118] goes to city B and pays 118. Total: 1859.",
              "ptrs": {
                "i": 5
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "total": 1859
              },
              "out": "Answer: 1859"
            }
          ]
        }
      },
      "code": "int twoCitySchedCost(vector<vector<int>>& costs) {\n    // sort by how much cheaper city A is than city B\n    sort(costs.begin(), costs.end(),\n         [](auto& a, auto& b) { return a[0] - a[1] < b[0] - b[1]; });\n    int n = costs.size() / 2, total = 0;\n    for (int i = 0; i < n; i++)\n        total += costs[i][0] + costs[i + n][1]; // first half to A, second half to B\n    return total;\n}",
      "complexity": "Time O(n log n) for the sort. Space O(1) extra.",
      "mistakes": [
        "Sorting by costA alone. A person can have a cheap A and an even cheaper B, so the gap is what matters.",
        "Sending the cheapest people to one city by greedy picks without the half and half rule. The split must be exactly half.",
        "Writing the comparator with <= . It can break the strict ordering sort needs and may crash."
      ],
      "practice": [
        1029,
        406
      ]
    },
    "7": {
      "name": "Two pointers after sorting",
      "when": "You must pair items from the two ends of a sorted order, with a limit on each pair: boats with a weight limit, matching big with small, or two numbers that must add up to something.",
      "idea": "Sort first. Now look at the heaviest person. If even the lightest person cannot ride with them, nobody can, so the heavy one goes alone. If the lightest can ride with them, pairing them is the best use of that boat, because the lightest person is the easiest to fit with anyone. Either way the heaviest is handled, so move the right pointer in. Move the left pointer too only when the lightest rode along. Each step places at least one person, so the loop is a single pass.",
      "steps": [
        "Sort the weights and put l at the start and r at the end.",
        "While l <= r, use one boat.",
        "If people[l] + people[r] <= limit, the lightest rides along, so move l right.",
        "Always move r left, since the heaviest has now left.",
        "Return the number of boats used."
      ],
      "example": {
        "problem": "Boats to Save People. Input: people = [3,5,3,4,2,1], limit = 5. Output: 4.",
        "walk": "After sorting the weights are 1, 2, 3, 3, 4, 5. The pointers l and r start at the two ends. The 5 is too heavy to share even with the 1, so it goes alone (red). Then 4 pairs with 1 (green), 3 pairs with 2, and the last 3 goes alone. Each boat step moves r, and l only moves when the light one rides along.",
        "viz": {
          "kind": "array",
          "cells": [
            3,
            5,
            3,
            4,
            2,
            1
          ],
          "frames": [
            {
              "note": "Boats: each boat carries at most 2 people and at most 5 total weight. Find the fewest boats.",
              "cells": [
                3,
                5,
                3,
                4,
                2,
                1
              ],
              "vars": {
                "limit": 5,
                "boats": 0
              }
            },
            {
              "note": "Sort the weights. Now the lightest is on the left and the heaviest is on the right. Use two pointers l and r.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 0,
                "r": 5
              },
              "vars": {
                "limit": 5,
                "boats": 0
              }
            },
            {
              "note": "The heaviest 5 plus the lightest 1 is 6, over 5. The heavy one cannot pair with anyone, so it goes alone in boat 1.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 0,
                "r": 5
              },
              "hl": {
                "0": "b",
                "5": "bad"
              },
              "vars": {
                "limit": 5,
                "boats": 1
              }
            },
            {
              "note": "The heaviest 4 and the lightest 1 weigh 5, within 5. They share boat 2.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 0,
                "r": 4
              },
              "hl": {
                "0": "a",
                "4": "a",
                "5": "ok"
              },
              "vars": {
                "limit": 5,
                "boats": 2
              }
            },
            {
              "note": "The heaviest 3 and the lightest 2 weigh 5, within 5. They share boat 3.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 1,
                "r": 3
              },
              "hl": {
                "0": "ok",
                "1": "a",
                "3": "a",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "limit": 5,
                "boats": 3
              }
            },
            {
              "note": "Only 3 is left. It takes boat 4 alone.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 2,
                "r": 2
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "a",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "limit": 5,
                "boats": 4
              }
            },
            {
              "note": "All people are placed. It took 4 boats, and no boat could have been saved.",
              "cells": [
                1,
                2,
                3,
                3,
                4,
                5
              ],
              "ptrs": {
                "l": 2,
                "r": 1
              },
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "vars": {
                "limit": 5,
                "boats": 4
              },
              "out": "Answer: 4 boats"
            }
          ]
        }
      },
      "code": "int numRescueBoats(vector<int>& people, int limit) {\n    sort(people.begin(), people.end());\n    int l = 0, r = (int)people.size() - 1, boats = 0;\n    while (l <= r) {\n        if (people[l] + people[r] <= limit) l++; // the lightest rides with the heaviest\n        r--;                                     // the heaviest always leaves\n        boats++;\n    }\n    return boats;\n}",
      "complexity": "Time O(n log n) for the sort, then O(n) for the pointers. Space O(1) extra.",
      "mistakes": [
        "Pairing the heaviest with the second heaviest. The lightest person is the one most likely to fit.",
        "Using l < r. Then a single person left in the middle is never counted. Use l <= r.",
        "Forgetting to sort. The two-pointer logic only works on sorted weights."
      ],
      "practice": [
        881,
        455
      ]
    }
  },
  "11": {
    "0": {
      "name": "DFS on components",
      "when": "You need to visit everything reachable from a node, count groups of connected things (provinces, friend circles, islands), or copy a graph. Words like connected, reachable, group or component point here.",
      "idea": "DFS means: stand on a node, mark it visited, then walk to each unvisited neighbour and repeat. It goes as deep as it can before backing up. Once the DFS from one node finishes, it has touched every node that is connected to it, and nothing else. So to count components, loop over all nodes. Each time you meet a node that is not visited yet, you have found a new component: add one and run DFS from it. The visited marker is what stops you from walking in circles.",
      "steps": [
        "Build an adjacency list: adj[u] holds every neighbour of u. For an undirected edge add it both ways.",
        "Create a visited array of size n, all false.",
        "Write dfs(u): mark u visited, then call dfs(v) for each neighbour v that is not visited.",
        "Loop u from 0 to n - 1. If u is not visited, add 1 to the component count and call dfs(u).",
        "Return the count. For problems like clone graph, do the same walk but build a copy of each node as you visit it."
      ],
      "example": {
        "problem": "An undirected graph has 8 nodes A to H and edges A-B, B-C, A-C, D-E, F-G, G-H. Count its connected components. Expected answer: 3.",
        "walk": "The stack panel is the DFS call stack: the last item is where we stand now. Watch the three fresh starts at A, D and F, each one raises the counter. At C, its neighbour A is already visited, so DFS does not go back. Nodes turn green once they are done, and a green node is never entered again.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "A",
              "x": 10,
              "y": 18
            },
            {
              "id": "B",
              "x": 30,
              "y": 50
            },
            {
              "id": "C",
              "x": 10,
              "y": 82
            },
            {
              "id": "D",
              "x": 50,
              "y": 22
            },
            {
              "id": "E",
              "x": 50,
              "y": 78
            },
            {
              "id": "F",
              "x": 76,
              "y": 14
            },
            {
              "id": "G",
              "x": 94,
              "y": 50
            },
            {
              "id": "H",
              "x": 76,
              "y": 86
            }
          ],
          "edges": [
            [
              "A",
              "B"
            ],
            [
              "B",
              "C"
            ],
            [
              "A",
              "C"
            ],
            [
              "D",
              "E"
            ],
            [
              "F",
              "G"
            ],
            [
              "G",
              "H"
            ]
          ],
          "frames": [
            {
              "note": "Eight nodes, no edges visited yet. We will scan the nodes one by one and count how many DFS runs we need.",
              "vars": {
                "components": 0
              }
            },
            {
              "note": "A is not visited yet, so this is a new component. Count it and start a DFS from A.",
              "hl": {
                "A": "a"
              },
              "stack": [
                "A"
              ],
              "vars": {
                "components": 1
              }
            },
            {
              "note": "Go deeper to B. Mark it visited.",
              "hl": {
                "A": "ok",
                "B": "a"
              },
              "stack": [
                "A",
                "B"
              ],
              "vars": {
                "components": 1
              }
            },
            {
              "note": "Go deeper to C. Mark it visited. Neighbour A is already visited, so we skip it.",
              "hl": {
                "C": "a",
                "A": "ok",
                "B": "ok"
              },
              "stack": [
                "A",
                "B",
                "C"
              ],
              "vars": {
                "components": 1
              }
            },
            {
              "note": "D is not visited yet, so this is a new component. Count it and start a DFS from D.",
              "hl": {
                "D": "a",
                "C": "ok",
                "A": "ok",
                "B": "ok"
              },
              "stack": [
                "D"
              ],
              "vars": {
                "components": 2
              }
            },
            {
              "note": "Go deeper to E. Mark it visited.",
              "hl": {
                "D": "ok",
                "E": "a",
                "A": "ok",
                "B": "ok",
                "C": "ok"
              },
              "stack": [
                "D",
                "E"
              ],
              "vars": {
                "components": 2
              }
            },
            {
              "note": "F is not visited yet, so this is a new component. Count it and start a DFS from F.",
              "hl": {
                "D": "ok",
                "E": "ok",
                "F": "a",
                "A": "ok",
                "B": "ok",
                "C": "ok"
              },
              "stack": [
                "F"
              ],
              "vars": {
                "components": 3
              }
            },
            {
              "note": "Go deeper to G. Mark it visited.",
              "hl": {
                "D": "ok",
                "E": "ok",
                "G": "a",
                "F": "ok",
                "A": "ok",
                "B": "ok",
                "C": "ok"
              },
              "stack": [
                "F",
                "G"
              ],
              "vars": {
                "components": 3
              }
            },
            {
              "note": "Go deeper to H. Mark it visited.",
              "hl": {
                "D": "ok",
                "E": "ok",
                "G": "ok",
                "F": "ok",
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "H": "a"
              },
              "stack": [
                "F",
                "G",
                "H"
              ],
              "vars": {
                "components": 3
              }
            },
            {
              "note": "Every node is visited. Each DFS run swallowed one whole component, so the answer is the number of runs.",
              "hl": {
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "D": "ok",
                "E": "ok",
                "F": "ok",
                "G": "ok",
                "H": "ok"
              },
              "vars": {
                "components": 3
              },
              "out": "Answer: 3 components"
            }
          ]
        }
      },
      "code": "void dfs(int u, vector<vector<int>>& adj, vector<bool>& seen) {\n    seen[u] = true;                       // mark before exploring\n    for (int v : adj[u])\n        if (!seen[v]) dfs(v, adj, seen);  // only walk to new nodes\n}\n\nint countComponents(int n, vector<vector<int>>& edges) {\n    vector<vector<int>> adj(n);\n    for (auto& e : edges) {               // undirected: add both ways\n        adj[e[0]].push_back(e[1]);\n        adj[e[1]].push_back(e[0]);\n    }\n    vector<bool> seen(n, false);\n    int count = 0;\n    for (int u = 0; u < n; u++) {\n        if (!seen[u]) {                   // a brand new component\n            count++;\n            dfs(u, adj, seen);\n        }\n    }\n    return count;\n}",
      "complexity": "Time O(V + E) because each node is entered once and each edge is looked at twice. Space O(V) for the visited array and the recursion stack.",
      "mistakes": [
        "Marking a node visited after the recursive calls instead of before. On a cycle this recurses forever.",
        "Forgetting to add the edge in both directions for an undirected graph, so DFS cannot walk back.",
        "Very deep graphs (say a 100000 node chain) can overflow the recursion stack. Switch to an explicit stack if that is possible."
      ],
      "practice": [
        547,
        133,
        997,
        797
      ]
    },
    "1": {
      "name": "Grid as a graph",
      "when": "The input is a 2D grid of 0s and 1s, letters or heights, and you must count regions, measure an area, flood fill, or ask what is reachable by moving up, down, left or right.",
      "idea": "A grid is a graph you do not have to build. Every cell is a node, and its four neighbours (up, down, left, right) are its edges. So you can run DFS or BFS right on the grid. To count islands, scan every cell. When you find land that has not been seen, count one island and flood it: visit all connected land and mark it, so the scan will not count it again. The trick for marking is to change the grid itself (for example turn '1' into '0') instead of keeping a separate visited table.",
      "steps": [
        "Write a bounds check: row and column must be inside the grid. Test it before you read the cell.",
        "Define dfs(r, c): return if out of bounds or the cell is not land. Otherwise mark it (set it to '0').",
        "From the cell, call dfs on the four neighbours. A small array of direction pairs keeps this short.",
        "Scan every cell in two loops. When a cell is land, add 1 to the island count and call dfs on it.",
        "Return the count. For area problems, let dfs return 1 + the sum of its four calls."
      ],
      "example": {
        "problem": "Count the islands in the grid with rows 11000, 10010, 00100, 00011 (1 is land, links go up, down, left, right only). Expected answer: 4.",
        "walk": "Each letter marks cells that belong to one island. The first island has three cells and a flood visits them all before the scan moves on. The cell (2,2) touches (1,3) only at a corner, so it counts as its own island. That is why we only use four directions, not eight.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              1,
              1,
              0,
              0,
              0
            ],
            [
              1,
              0,
              0,
              1,
              0
            ],
            [
              0,
              0,
              1,
              0,
              0
            ],
            [
              0,
              0,
              0,
              1,
              1
            ]
          ],
          "rows": [
            "r0",
            "r1",
            "r2",
            "r3"
          ],
          "cols": [
            "c0",
            "c1",
            "c2",
            "c3",
            "c4"
          ],
          "frames": [
            {
              "note": "A 4 x 5 map. 1 is land, 0 is water. Each cell is a node, and its up, down, left and right cells are its neighbours.",
              "vars": {
                "islands": 0
              }
            },
            {
              "note": "Scan finds unvisited land at (0,0). New island, so islands = 1. Flood it with DFS.",
              "cells": [
                [
                  "A",
                  1,
                  0,
                  0,
                  0
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  0
                ],
                [
                  0,
                  0,
                  1,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,0": "a"
              },
              "vars": {
                "islands": 1
              }
            },
            {
              "note": "Visit land cell (1,0) and sink it with label A, so it is never counted twice.",
              "cells": [
                [
                  "A",
                  1,
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  1,
                  0
                ],
                [
                  0,
                  0,
                  1,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,0": "ok",
                "1,0": "a"
              },
              "vars": {
                "islands": 1
              }
            },
            {
              "note": "Visit land cell (0,1) and sink it with label A, so it is never counted twice.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  1,
                  0
                ],
                [
                  0,
                  0,
                  1,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,0": "ok",
                "1,0": "ok",
                "0,1": "a"
              },
              "vars": {
                "islands": 1
              }
            },
            {
              "note": "Scan finds unvisited land at (1,3). New island, so islands = 2. Flood it with DFS.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  "B",
                  0
                ],
                [
                  0,
                  0,
                  1,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  1,
                  1
                ]
              ],
              "hl": {
                "1,3": "a"
              },
              "vars": {
                "islands": 2
              }
            },
            {
              "note": "Scan finds unvisited land at (2,2). New island, so islands = 3. Flood it with DFS. It only touches (1,3) diagonally, and diagonals are not neighbours, so it is a separate island.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  "B",
                  0
                ],
                [
                  0,
                  0,
                  "C",
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  1,
                  1
                ]
              ],
              "hl": {
                "2,2": "a"
              },
              "vars": {
                "islands": 3
              }
            },
            {
              "note": "Scan finds unvisited land at (3,3). New island, so islands = 4. Flood it with DFS.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  "B",
                  0
                ],
                [
                  0,
                  0,
                  "C",
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  "D",
                  1
                ]
              ],
              "hl": {
                "3,3": "a"
              },
              "vars": {
                "islands": 4
              }
            },
            {
              "note": "Visit land cell (3,4) and sink it with label D, so it is never counted twice.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  "B",
                  0
                ],
                [
                  0,
                  0,
                  "C",
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  "D",
                  "D"
                ]
              ],
              "hl": {
                "3,3": "ok",
                "3,4": "a"
              },
              "vars": {
                "islands": 4
              }
            },
            {
              "note": "The scan is finished. Each flood fill used up one whole island, so the number of floods is the answer.",
              "cells": [
                [
                  "A",
                  "A",
                  0,
                  0,
                  0
                ],
                [
                  "A",
                  0,
                  0,
                  "B",
                  0
                ],
                [
                  0,
                  0,
                  "C",
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  "D",
                  "D"
                ]
              ],
              "hl": {
                "0,0": "ok",
                "0,1": "ok",
                "1,0": "ok",
                "1,3": "ok",
                "2,2": "ok",
                "3,3": "ok",
                "3,4": "ok"
              },
              "vars": {
                "islands": 4
              },
              "out": "Answer: 4 islands"
            }
          ]
        }
      },
      "code": "void sink(vector<vector<char>>& grid, int r, int c) {\n    int R = grid.size(), C = grid[0].size();\n    if (r < 0 || r >= R || c < 0 || c >= C) return;  // outside the grid\n    if (grid[r][c] != '1') return;                   // water or already visited\n    grid[r][c] = '0';                                // mark visited by sinking it\n    sink(grid, r + 1, c);\n    sink(grid, r - 1, c);\n    sink(grid, r, c + 1);\n    sink(grid, r, c - 1);\n}\n\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for (int r = 0; r < (int)grid.size(); r++)\n        for (int c = 0; c < (int)grid[0].size(); c++)\n            if (grid[r][c] == '1') {   // new island found\n                count++;\n                sink(grid, r, c);      // erase the whole island\n            }\n    return count;\n}",
      "complexity": "Time O(R * C) since every cell is entered at most once. Space O(R * C) in the worst case for the recursion stack.",
      "mistakes": [
        "Reading grid[r][c] before checking the bounds, which crashes on the edges.",
        "Forgetting to mark a cell before recursing, so the DFS bounces between two neighbours forever.",
        "Using 8 directions when the problem says 4. Diagonal cells are not connected unless the problem says so."
      ],
      "practice": [
        733,
        200,
        695,
        463,
        130
      ]
    },
    "2": {
      "name": "BFS for shortest path (unweighted)",
      "when": "You need the minimum number of steps, edges or moves in an unweighted graph, a grid, or a space of states: shortest path, fewest moves, word ladder, minimum genetic mutations.",
      "idea": "BFS explores in rings: first everything one step from the start, then everything two steps away, and so on. Because nodes are visited in order of distance, the first time you reach a node is guaranteed to be along a shortest path. A queue gives you that ring order for free, and a visited marker stops you from putting a node in the queue twice.",
      "steps": [
        "Push the start node into a queue with distance 0 and mark it visited.",
        "Pop the node at the front of the queue.",
        "For every neighbour that is not visited yet: mark it visited, set its distance to dist[node] + 1, and push it.",
        "If you pop (or discover) the target, its distance is the answer, so stop.",
        "If the queue becomes empty without reaching the target, the target is unreachable."
      ],
      "example": {
        "problem": "Find the fewest edges needed to go from A to F in the graph shown. Expected answer: 3.",
        "walk": "The orange number above each node is its distance from A. B and C are one step away, D and E are two steps away, and F is first discovered from D at distance 3. D is not queued a second time when C is processed, because it was already marked visited.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "A",
              "x": 4,
              "y": 50
            },
            {
              "id": "B",
              "x": 28,
              "y": 14
            },
            {
              "id": "C",
              "x": 28,
              "y": 86
            },
            {
              "id": "D",
              "x": 58,
              "y": 14
            },
            {
              "id": "E",
              "x": 58,
              "y": 86
            },
            {
              "id": "F",
              "x": 92,
              "y": 50
            }
          ],
          "edges": [
            [
              "A",
              "B"
            ],
            [
              "A",
              "C"
            ],
            [
              "B",
              "D"
            ],
            [
              "C",
              "D"
            ],
            [
              "C",
              "E"
            ],
            [
              "D",
              "F"
            ],
            [
              "E",
              "F"
            ]
          ],
          "frames": [
            {
              "note": "Start at A with distance 0. Put it in the queue and mark it visited.",
              "hl": {
                "A": "a"
              },
              "tags": {
                "A": 0
              },
              "queue": [
                "A"
              ]
            },
            {
              "note": "Pop A. Its unvisited neighbours B, C get distance 1 and join the queue.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b"
              },
              "ehl": {
                "A-B": "b",
                "A-C": "b"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1
              },
              "queue": [
                "B",
                "C"
              ]
            },
            {
              "note": "Pop B. Its unvisited neighbour D gets distance 2 and joins the queue.",
              "hl": {
                "A": "ok",
                "B": "a",
                "C": "ok",
                "D": "b"
              },
              "ehl": {
                "B-D": "b"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 2
              },
              "queue": [
                "C",
                "D"
              ]
            },
            {
              "note": "Pop C. Its unvisited neighbour E gets distance 2 and joins the queue.",
              "hl": {
                "A": "ok",
                "B": "ok",
                "C": "a",
                "D": "ok",
                "E": "b"
              },
              "ehl": {
                "C-E": "b"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 2,
                "E": 2
              },
              "queue": [
                "D",
                "E"
              ]
            },
            {
              "note": "Pop D. Its unvisited neighbour F gets distance 3 and joins the queue. F is found!",
              "hl": {
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "D": "a",
                "E": "ok",
                "F": "b"
              },
              "ehl": {
                "D-F": "b"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 2,
                "E": 2,
                "F": 3
              },
              "queue": [
                "E",
                "F"
              ],
              "out": "Shortest path A to F = 3 edges"
            },
            {
              "note": "Because BFS visits nodes in order of distance, the first time we reach F is via a shortest path. Done: 3 edges.",
              "hl": {
                "A": "ok",
                "B": "ok",
                "D": "ok",
                "F": "ok"
              },
              "ehl": {
                "A-B": "ok",
                "B-D": "ok",
                "D-F": "ok"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 2,
                "E": 2,
                "F": 3
              },
              "out": "Shortest path A to F = 3 edges"
            }
          ]
        }
      },
      "code": "int shortestPath(vector<vector<int>>& adj, int start, int target) {\n    vector<int> dist(adj.size(), -1);   // -1 means not visited\n    queue<int> q;\n    dist[start] = 0;\n    q.push(start);\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        if (u == target) return dist[u];\n        for (int v : adj[u]) {\n            if (dist[v] == -1) {        // first time we see v\n                dist[v] = dist[u] + 1;\n                q.push(v);\n            }\n        }\n    }\n    return -1;                          // target unreachable\n}",
      "complexity": "Time O(V + E) because every node and edge is handled once. Space O(V) for the queue and the distance array.",
      "mistakes": [
        "Marking a node visited when you pop it instead of when you push it. The same node then gets queued many times and the code slows down badly.",
        "Using BFS when edges have different weights. Use Dijkstra instead.",
        "Forgetting the case start == target, which should return 0."
      ],
      "practice": [
        1091,
        994,
        127,
        542
      ]
    },
    "3": {
      "name": "Multi-source BFS",
      "when": "Several starting points spread at the same speed and you need the time or distance for everything to be reached: rotting oranges, distance to the nearest 0 or gate, fire spreading through a grid.",
      "idea": "Normal BFS grows one ring out of a single start. Multi-source BFS starts with many rings at once. Put every source in the queue at distance 0 before the loop begins. The queue then holds all sources first, then everything one step away from any source, and so on. Each cell is reached by whichever source is closest, which is exactly the nearest-source distance. Run the loop one level at a time, and count how many levels it takes.",
      "steps": [
        "Scan the grid once. Push every source cell into the queue and count the fresh cells.",
        "Loop while the queue is not empty and fresh cells remain.",
        "Take size = queue.size() and process exactly that many cells. That is one minute (one level).",
        "For each cell, look at its 4 neighbours. Turn every fresh one into a source, push it, and reduce the fresh count.",
        "After each level add 1 to minutes. At the end return minutes if no fresh cells remain, else -1."
      ],
      "example": {
        "problem": "Rotting Oranges: grid rows 21101, 11011, 01111, 00112. 0 is empty, 1 is fresh, 2 is rotten. Each minute rot spreads to the 4 neighbours. Find the minutes until none is fresh. Expected answer: 3.",
        "walk": "The queue starts with two cells, the top-left and the bottom-right corner. Both spread in every round, so the rot approaches from two sides. Orange cells turned rotten this minute, green ones earlier. The count of minutes is the number of full rounds, not the number of cells processed.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              2,
              1,
              1,
              0,
              1
            ],
            [
              1,
              1,
              0,
              1,
              1
            ],
            [
              0,
              1,
              1,
              1,
              1
            ],
            [
              0,
              0,
              1,
              1,
              2
            ]
          ],
          "rows": [
            "r0",
            "r1",
            "r2",
            "r3"
          ],
          "cols": [
            "c0",
            "c1",
            "c2",
            "c3",
            "c4"
          ],
          "frames": [
            {
              "note": "Two oranges are rotten (2) at the start. Put BOTH in the queue now, so they spread at the same time. Fresh oranges: 13.",
              "hl": {
                "0,0": "a",
                "3,4": "a"
              },
              "queue": [
                "(0,0)",
                "(3,4)"
              ],
              "vars": {
                "minute": 0,
                "fresh": 13
              }
            },
            {
              "note": "Minute 1: one whole round. 4 fresh oranges next to rotten ones turn rotten. Fresh left: 9.",
              "cells": [
                [
                  2,
                  2,
                  1,
                  0,
                  1
                ],
                [
                  2,
                  1,
                  0,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1,
                  1,
                  2
                ],
                [
                  0,
                  0,
                  1,
                  2,
                  2
                ]
              ],
              "hl": {
                "1,0": "a",
                "0,1": "a",
                "2,4": "a",
                "3,3": "a",
                "0,0": "ok",
                "3,4": "ok"
              },
              "queue": [
                "(1,0)",
                "(0,1)",
                "(2,4)",
                "(3,3)"
              ],
              "vars": {
                "minute": 1,
                "fresh": 9
              }
            },
            {
              "note": "Minute 2: one whole round. 5 fresh oranges next to rotten ones turn rotten. Fresh left: 4.",
              "cells": [
                [
                  2,
                  2,
                  2,
                  0,
                  1
                ],
                [
                  2,
                  2,
                  0,
                  1,
                  2
                ],
                [
                  0,
                  1,
                  1,
                  2,
                  2
                ],
                [
                  0,
                  0,
                  2,
                  2,
                  2
                ]
              ],
              "hl": {
                "1,1": "a",
                "0,2": "a",
                "1,4": "a",
                "2,3": "a",
                "3,2": "a",
                "0,0": "ok",
                "0,1": "ok",
                "1,0": "ok",
                "2,4": "ok",
                "3,3": "ok",
                "3,4": "ok"
              },
              "queue": [
                "(1,1)",
                "(0,2)",
                "(1,4)",
                "(2,3)",
                "(3,2)"
              ],
              "vars": {
                "minute": 2,
                "fresh": 4
              }
            },
            {
              "note": "Minute 3: one whole round. 4 fresh oranges next to rotten ones turn rotten. Fresh left: 0.",
              "cells": [
                [
                  2,
                  2,
                  2,
                  0,
                  2
                ],
                [
                  2,
                  2,
                  0,
                  2,
                  2
                ],
                [
                  0,
                  2,
                  2,
                  2,
                  2
                ],
                [
                  0,
                  0,
                  2,
                  2,
                  2
                ]
              ],
              "hl": {
                "2,1": "a",
                "0,4": "a",
                "1,3": "a",
                "2,2": "a",
                "0,0": "ok",
                "0,1": "ok",
                "0,2": "ok",
                "1,0": "ok",
                "1,1": "ok",
                "1,4": "ok",
                "2,3": "ok",
                "2,4": "ok",
                "3,2": "ok",
                "3,3": "ok",
                "3,4": "ok"
              },
              "queue": [
                "(2,1)",
                "(0,4)",
                "(1,3)",
                "(2,2)"
              ],
              "vars": {
                "minute": 3,
                "fresh": 0
              }
            },
            {
              "note": "No fresh oranges are left. The number of rounds, 3, is the answer.",
              "hl": {
                "0,0": "ok",
                "0,1": "ok",
                "0,2": "ok",
                "0,4": "ok",
                "1,0": "ok",
                "1,1": "ok",
                "1,3": "ok",
                "1,4": "ok",
                "2,1": "ok",
                "2,2": "ok",
                "2,3": "ok",
                "2,4": "ok",
                "3,2": "ok",
                "3,3": "ok",
                "3,4": "ok"
              },
              "vars": {
                "minute": 3,
                "fresh": 0
              },
              "out": "Answer: 3 minutes"
            }
          ]
        }
      },
      "code": "int orangesRotting(vector<vector<int>>& grid) {\n    int R = grid.size(), C = grid[0].size(), fresh = 0;\n    queue<pair<int,int>> q;\n    for (int r = 0; r < R; r++)\n        for (int c = 0; c < C; c++) {\n            if (grid[r][c] == 2) q.push({r, c});   // every source goes in first\n            else if (grid[r][c] == 1) fresh++;\n        }\n    int dr[4] = {1, -1, 0, 0}, dc[4] = {0, 0, 1, -1};\n    int minutes = 0;\n    while (!q.empty() && fresh > 0) {\n        int sz = q.size();                          // one level = one minute\n        while (sz--) {\n            auto [r, c] = q.front(); q.pop();\n            for (int k = 0; k < 4; k++) {\n                int nr = r + dr[k], nc = c + dc[k];\n                if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;\n                if (grid[nr][nc] != 1) continue;\n                grid[nr][nc] = 2;                   // rots, also marks visited\n                fresh--;\n                q.push({nr, nc});\n            }\n        }\n        minutes++;\n    }\n    return fresh == 0 ? minutes : -1;               // -1 if some orange is unreachable\n}",
      "complexity": "Time O(R * C), every cell is pushed at most once. Space O(R * C) for the queue.",
      "mistakes": [
        "Starting one BFS per source and taking a minimum. It is slower and easy to get wrong. Push all sources together.",
        "Counting a minute for every popped cell instead of every level. Take the queue size before the inner loop.",
        "Forgetting the unreachable case: if fresh cells remain at the end, return -1."
      ],
      "practice": [
        994,
        542
      ]
    },
    "4": {
      "name": "Topological sort",
      "when": "Tasks have prerequisites and you need a valid order, or you must say whether it is possible at all (course schedule, build order, alphabet order). A directed graph with a possible cycle is the signal.",
      "idea": "A topological order lists every node after all of the nodes that point to it. Kahn's algorithm builds it greedily. A node with in-degree 0 has no unfinished prerequisites, so it can go next. Take it out, and for each node it points to, subtract one from that node's in-degree. Any node that drops to 0 is now free, so it joins the queue. If you can take out every node, you have a valid order. If the queue runs dry early, the leftover nodes sit on a cycle and no order exists.",
      "steps": [
        "Build the adjacency list and count in-degree[v] for every node from the edges.",
        "Push every node with in-degree 0 into a queue.",
        "Pop a node, add it to the order, and for each neighbour decrement its in-degree.",
        "When a neighbour reaches 0, push it. Keep going until the queue is empty.",
        "If the order has all n nodes, return it. Otherwise there is a cycle, so return an empty list (or false)."
      ],
      "example": {
        "problem": "Course Schedule II with 6 courses (0 to 5). Prerequisites: 5 before 2, 5 before 0, 4 before 0, 4 before 1, 2 before 3, 3 before 1. Return a valid order. One answer: 4 5 2 0 3 1.",
        "walk": "Watch the orange in-degree numbers fall as nodes are removed. Node 0 needs both 5 and 4, so it only becomes free after 5 is popped. Node 1 waits for 4 and for 3, and 3 waits for 2. Many valid orders exist. This code always takes the earliest free node, which gives 4 5 2 0 3 1.",
        "viz": {
          "kind": "graph",
          "directed": true,
          "nodes": [
            {
              "id": "0",
              "x": 40,
              "y": 50
            },
            {
              "id": "1",
              "x": 92,
              "y": 62
            },
            {
              "id": "2",
              "x": 40,
              "y": 14
            },
            {
              "id": "3",
              "x": 68,
              "y": 14
            },
            {
              "id": "4",
              "x": 6,
              "y": 80
            },
            {
              "id": "5",
              "x": 6,
              "y": 20
            }
          ],
          "edges": [
            [
              "5",
              "2"
            ],
            [
              "5",
              "0"
            ],
            [
              "4",
              "0"
            ],
            [
              "4",
              "1"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "1"
            ]
          ],
          "frames": [
            {
              "note": "Edge X -> Y means X must come before Y. The orange number is each node's in-degree: how many prerequisites are still waiting. Nodes 4 and 5 have 0, so they start in the queue.",
              "hl": {
                "4": "b",
                "5": "b"
              },
              "tags": {
                "0": 2,
                "1": 2,
                "2": 1,
                "3": 1,
                "4": 0,
                "5": 0
              },
              "queue": [
                "4",
                "5"
              ],
              "vars": {
                "order": "-"
              }
            },
            {
              "note": "Pop 4 and add it to the order. Reduce the in-degree of 0 and 1. None reaches 0 yet.",
              "hl": {
                "0": "b",
                "1": "b",
                "4": "a"
              },
              "ehl": {
                "4-0": "b",
                "4-1": "b"
              },
              "tags": {
                "0": 1,
                "1": 1,
                "2": 1,
                "3": 1,
                "4": 0,
                "5": 0
              },
              "queue": [
                "5"
              ],
              "vars": {
                "order": "4"
              }
            },
            {
              "note": "Pop 5 and add it to the order. Reduce the in-degree of 2 and 0. 2 and 0 reach 0, so queue it.",
              "hl": {
                "0": "b",
                "2": "b",
                "4": "ok",
                "5": "a"
              },
              "ehl": {
                "5-2": "b",
                "5-0": "b"
              },
              "tags": {
                "0": 0,
                "1": 1,
                "2": 0,
                "3": 1,
                "4": 0,
                "5": 0
              },
              "queue": [
                "2",
                "0"
              ],
              "vars": {
                "order": "4 5"
              }
            },
            {
              "note": "Pop 2 and add it to the order. Reduce the in-degree of 3. 3 reaches 0, so queue it.",
              "hl": {
                "2": "a",
                "3": "b",
                "4": "ok",
                "5": "ok"
              },
              "ehl": {
                "2-3": "b"
              },
              "tags": {
                "0": 0,
                "1": 1,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
              },
              "queue": [
                "0",
                "3"
              ],
              "vars": {
                "order": "4 5 2"
              }
            },
            {
              "note": "Pop 0 and add it to the order. It has no outgoing edges, so nothing changes.",
              "hl": {
                "0": "a",
                "2": "ok",
                "4": "ok",
                "5": "ok"
              },
              "tags": {
                "0": 0,
                "1": 1,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
              },
              "queue": [
                "3"
              ],
              "vars": {
                "order": "4 5 2 0"
              }
            },
            {
              "note": "Pop 3 and add it to the order. Reduce the in-degree of 1. 1 reaches 0, so queue it.",
              "hl": {
                "0": "ok",
                "1": "b",
                "2": "ok",
                "3": "a",
                "4": "ok",
                "5": "ok"
              },
              "ehl": {
                "3-1": "b"
              },
              "tags": {
                "0": 0,
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
              },
              "queue": [
                "1"
              ],
              "vars": {
                "order": "4 5 2 0 3"
              }
            },
            {
              "note": "Pop 1 and add it to the order. It has no outgoing edges, so nothing changes.",
              "hl": {
                "0": "ok",
                "1": "a",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "tags": {
                "0": 0,
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
              },
              "queue": [],
              "vars": {
                "order": "4 5 2 0 3 1"
              }
            },
            {
              "note": "All 6 nodes were taken out, so there is no cycle. This order respects every prerequisite. If some node never reached 0, a cycle would exist.",
              "hl": {
                "0": "ok",
                "1": "ok",
                "2": "ok",
                "3": "ok",
                "4": "ok",
                "5": "ok"
              },
              "tags": {
                "0": 0,
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
              },
              "vars": {
                "order": "4 5 2 0 3 1"
              },
              "out": "Order: 4 5 2 0 3 1"
            }
          ]
        }
      },
      "code": "// prerequisites[i] = {course, prereq}: prereq must come first\nvector<int> findOrder(int n, vector<vector<int>>& prerequisites) {\n    vector<vector<int>> adj(n);\n    vector<int> indeg(n, 0);\n    for (auto& p : prerequisites) {\n        adj[p[1]].push_back(p[0]);     // edge prereq -> course\n        indeg[p[0]]++;\n    }\n    queue<int> q;\n    for (int i = 0; i < n; i++)\n        if (indeg[i] == 0) q.push(i);  // free to take right now\n    vector<int> order;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        order.push_back(u);\n        for (int v : adj[u])\n            if (--indeg[v] == 0) q.push(v);  // last prerequisite done\n    }\n    if ((int)order.size() != n) return {};   // cycle: not everything got out\n    return order;\n}",
      "complexity": "Time O(V + E): every node is pushed once and every edge is used once. Space O(V + E) for the graph.",
      "mistakes": [
        "Reversing the edge direction. If the pair is {course, prereq}, the edge goes from prereq to course.",
        "Not checking order.size() == n at the end. That check is the cycle detection.",
        "Starting with only one zero in-degree node. Push all of them at the start."
      ],
      "practice": [
        207,
        210
      ]
    },
    "5": {
      "name": "Union-Find (DSU)",
      "when": "You merge things into groups as edges arrive and keep asking whether two nodes are already connected: redundant connection, number of components after unions, accounts merge, cycle in an undirected graph.",
      "idea": "Give every node a parent pointer. A group is a tree of parent pointers, and the root is its name. find(x) follows parents up to the root. union(a, b) joins two groups by pointing one root at the other. Two nodes are in the same group exactly when their roots are equal. That gives a neat cycle test: if an edge connects two nodes that already share a root, adding it would make a cycle. Path compression (pointing nodes closer to the root during find) keeps the trees flat, so each operation is almost O(1).",
      "steps": [
        "Make parent[i] = i for every node. Each node starts as its own group.",
        "Write find(x): if parent[x] is not x, set parent[x] = find(parent[x]) and return it. That is path compression.",
        "Write unite(a, b): find both roots. If they are equal, return false because they were already connected.",
        "Otherwise set parent[rootA] = rootB and return true.",
        "Process the edges in order. The first edge where unite returns false is the one that makes a cycle. To count components, start with n and subtract 1 for every successful union."
      ],
      "example": {
        "problem": "Redundant Connection: a tree on nodes 1 to 5 got one extra edge. The edges are [1,2], [2,3], [3,4], [2,5], [1,4]. Find the edge that can be removed to leave a tree. Expected answer: [1,4].",
        "walk": "The orange label is each node's current root. After the first four edges all five nodes share one root, so everything is a single group. When the last edge 1-4 arrives, both ends already have the same root. That means 1 and 4 were connected before this edge, and the edge closes a cycle. Green edges were merges, the red edge is the redundant one.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "1",
              "x": 16,
              "y": 20
            },
            {
              "id": "2",
              "x": 58,
              "y": 20
            },
            {
              "id": "3",
              "x": 58,
              "y": 80
            },
            {
              "id": "4",
              "x": 16,
              "y": 80
            },
            {
              "id": "5",
              "x": 92,
              "y": 20
            }
          ],
          "edges": [
            [
              "1",
              "2"
            ],
            [
              "2",
              "3"
            ],
            [
              "3",
              "4"
            ],
            [
              "2",
              "5"
            ],
            [
              "1",
              "4"
            ]
          ],
          "frames": [
            {
              "note": "Five nodes. Every node starts as its own group, so its label (orange) is itself. We add the edges one at a time.",
              "tags": {
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5
              },
              "ehl": {
                "1-2": "dim",
                "2-3": "dim",
                "3-4": "dim",
                "2-5": "dim",
                "1-4": "dim"
              },
              "vars": {
                "edges seen": 0
              }
            },
            {
              "note": "Edge 1-2: roots 1 and 2 differ, so they are in different groups. Union them: the root of 1's group now points to 2.",
              "hl": {
                "1": "a",
                "2": "a"
              },
              "ehl": {
                "2-3": "dim",
                "3-4": "dim",
                "2-5": "dim",
                "1-4": "dim",
                "1-2": "ok"
              },
              "tags": {
                "1": 2,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5
              },
              "vars": {
                "edges seen": 1
              }
            },
            {
              "note": "Edge 2-3: roots 2 and 3 differ, so they are in different groups. Union them: the root of 2's group now points to 3.",
              "hl": {
                "2": "a",
                "3": "a"
              },
              "ehl": {
                "3-4": "dim",
                "2-5": "dim",
                "1-4": "dim",
                "1-2": "ok",
                "2-3": "ok"
              },
              "tags": {
                "1": 3,
                "2": 3,
                "3": 3,
                "4": 4,
                "5": 5
              },
              "vars": {
                "edges seen": 2
              }
            },
            {
              "note": "Edge 3-4: roots 3 and 4 differ, so they are in different groups. Union them: the root of 3's group now points to 4.",
              "hl": {
                "3": "a",
                "4": "a"
              },
              "ehl": {
                "2-5": "dim",
                "1-4": "dim",
                "1-2": "ok",
                "2-3": "ok",
                "3-4": "ok"
              },
              "tags": {
                "1": 4,
                "2": 4,
                "3": 4,
                "4": 4,
                "5": 5
              },
              "vars": {
                "edges seen": 3
              }
            },
            {
              "note": "Edge 2-5: roots 4 and 5 differ, so they are in different groups. Union them: the root of 4's group now points to 5.",
              "hl": {
                "2": "a",
                "5": "a"
              },
              "ehl": {
                "1-4": "dim",
                "1-2": "ok",
                "2-3": "ok",
                "3-4": "ok",
                "2-5": "ok"
              },
              "tags": {
                "1": 5,
                "2": 5,
                "3": 5,
                "4": 5,
                "5": 5
              },
              "vars": {
                "edges seen": 4
              }
            },
            {
              "note": "Edge 1-4: both ends already have the same root (5). They are already connected, so this edge closes a cycle. It is the redundant one.",
              "hl": {
                "1": "bad",
                "4": "bad"
              },
              "ehl": {
                "1-2": "ok",
                "2-3": "ok",
                "3-4": "ok",
                "2-5": "ok",
                "1-4": "bad"
              },
              "tags": {
                "1": 5,
                "2": 5,
                "3": 5,
                "4": 5,
                "5": 5
              },
              "vars": {
                "edges seen": 5
              },
              "out": "Answer: [1, 4]"
            }
          ]
        }
      },
      "code": "struct DSU {\n    vector<int> parent;\n    DSU(int n) : parent(n) {\n        iota(parent.begin(), parent.end(), 0);   // each node is its own root\n    }\n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);  // path compression\n        return parent[x];\n    }\n    bool unite(int a, int b) {\n        int ra = find(a), rb = find(b);\n        if (ra == rb) return false;              // already connected: cycle\n        parent[ra] = rb;\n        return true;\n    }\n};\n\nvector<int> findRedundantConnection(vector<vector<int>>& edges) {\n    DSU dsu(edges.size() + 1);                   // nodes are numbered from 1\n    for (auto& e : edges)\n        if (!dsu.unite(e[0], e[1])) return e;    // this edge closes a cycle\n    return {};\n}",
      "complexity": "Time about O(E * alpha(N)), which is nearly O(E). Space O(N) for the parent array.",
      "mistakes": [
        "Comparing parent[a] and parent[b] instead of find(a) and find(b). Parents are not roots.",
        "Forgetting to find the roots before linking, so you attach a non-root node and break the groups.",
        "Sizing the array n instead of n + 1 when nodes are numbered from 1."
      ],
      "practice": [
        684,
        547
      ]
    },
    "6": {
      "name": "Cycle and bipartite checks",
      "when": "You must split nodes into two teams so that every edge crosses between them (bipartite, dislike groups, two-coloring), or decide if a graph has an odd cycle. Also any task that asks if a graph contains a cycle.",
      "idea": "A graph is bipartite if you can color each node with one of two colors so that no edge has the same color at both ends. Traverse with BFS or DFS. Color the start with 0. Every neighbour must get the opposite color. If a neighbour already has a color and it equals yours, you have found a conflict and the answer is false. This happens exactly when the graph has an odd-length cycle. The graph may be split into several components, so start a fresh traversal from every uncolored node.",
      "steps": [
        "Make a color array filled with -1 (uncolored).",
        "For each node that is still uncolored, give it color 0 and push it into a queue.",
        "Pop u. For each neighbour v: if v is uncolored, set color[v] = 1 - color[u] and push it.",
        "If v is already colored and color[v] == color[u], return false at once.",
        "If every component finishes without a conflict, return true."
      ],
      "example": {
        "problem": "Is Graph Bipartite? Nodes A to E, edges A-B, A-C, B-D, C-D, D-E, C-E. Can the nodes be two-colored with no edge having the same color at both ends? Expected answer: false.",
        "walk": "Orange is color 0 and violet is color 1. The square A-B-D-C works fine. The conflict comes from the triangle C-D-E: C is 1, D is 0, so E would need to differ from both, which is impossible with two colors. The red nodes show the edge that breaks the rule. Odd cycles always cause this.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "A",
              "x": 8,
              "y": 50
            },
            {
              "id": "B",
              "x": 34,
              "y": 14
            },
            {
              "id": "C",
              "x": 34,
              "y": 86
            },
            {
              "id": "D",
              "x": 64,
              "y": 14
            },
            {
              "id": "E",
              "x": 92,
              "y": 60
            }
          ],
          "edges": [
            [
              "A",
              "B"
            ],
            [
              "A",
              "C"
            ],
            [
              "B",
              "D"
            ],
            [
              "C",
              "D"
            ],
            [
              "D",
              "E"
            ],
            [
              "C",
              "E"
            ]
          ],
          "frames": [
            {
              "note": "Try to give every node color 0 or 1 so that each edge joins two different colors. Orange is 0, violet is 1. Start A with color 0.",
              "hl": {
                "A": "a"
              },
              "tags": {
                "A": 0
              },
              "queue": [
                "A"
              ]
            },
            {
              "note": "Pop A. Give its new neighbours B and C the opposite color 1, then queue them.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b"
              },
              "ehl": {
                "A-B": "ok",
                "A-C": "ok"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1
              },
              "queue": [
                "B",
                "C"
              ]
            },
            {
              "note": "Pop B. Give its new neighbours D the opposite color 0, then queue them. A already differs, fine.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b",
                "D": "a"
              },
              "ehl": {
                "A-B": "ok",
                "B-D": "ok"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 0
              },
              "queue": [
                "C",
                "D"
              ]
            },
            {
              "note": "Pop C. Give its new neighbours E the opposite color 0, then queue them. A, D already differ, fine.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b",
                "D": "a",
                "E": "a"
              },
              "ehl": {
                "A-C": "ok",
                "C-D": "ok",
                "C-E": "ok"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 0,
                "E": 0
              },
              "queue": [
                "D",
                "E"
              ]
            },
            {
              "note": "Pop D. Its neighbour E already has color 0, the same as D. An edge joins two nodes of the same color, so the graph is NOT bipartite.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b",
                "D": "bad",
                "E": "bad"
              },
              "ehl": {
                "D-E": "bad"
              },
              "tags": {
                "A": 0,
                "B": 1,
                "C": 1,
                "D": 0,
                "E": 0
              },
              "queue": [
                "E"
              ],
              "out": "Answer: false (odd cycle C-D-E)"
            }
          ]
        }
      },
      "code": "bool isBipartite(vector<vector<int>>& graph) {\n    int n = graph.size();\n    vector<int> color(n, -1);               // -1 = not colored yet\n    for (int s = 0; s < n; s++) {           // graph may have several components\n        if (color[s] != -1) continue;\n        color[s] = 0;\n        queue<int> q;\n        q.push(s);\n        while (!q.empty()) {\n            int u = q.front(); q.pop();\n            for (int v : graph[u]) {\n                if (color[v] == -1) {\n                    color[v] = 1 - color[u];   // opposite team\n                    q.push(v);\n                } else if (color[v] == color[u]) {\n                    return false;              // same color on both ends\n                }\n            }\n        }\n    }\n    return true;\n}",
      "complexity": "Time O(V + E), each node and edge is handled once. Space O(V) for the colors and the queue.",
      "mistakes": [
        "Only starting from node 0. A disconnected graph needs a fresh start from every uncolored node.",
        "Treating an already-colored neighbour as an error. It is fine when its color is different, and only a match is a conflict.",
        "For directed cycle detection do not reuse this. Use DFS with three states (unvisited, in progress, done), or Kahn's algorithm."
      ],
      "practice": [
        785,
        207
      ]
    },
    "7": {
      "name": "Dijkstra",
      "when": "Edges have different non-negative costs and you want the cheapest path from one node: network delay time, cheapest route, minimum effort path. A plain BFS gives wrong answers here.",
      "idea": "Dijkstra is BFS with a priority queue. Keep dist[v], the cheapest cost found so far for every node. Always expand the node with the smallest known distance, using a min-heap of (distance, node). When a node comes off the heap, its distance can never improve, because every other route would have to go through nodes that are at least as far away. Then try each outgoing edge: if dist[u] + w is smaller than dist[v], update dist[v] and push the new pair. Old, larger pairs stay in the heap and are skipped when popped. It only works if no edge cost is negative.",
      "steps": [
        "Set dist[] to infinity for every node, dist[start] = 0, and push (0, start) into a min-heap.",
        "Pop the smallest (d, u). If d is bigger than dist[u], it is an outdated entry, so skip it.",
        "For each edge (u, v, w): if d + w < dist[v], set dist[v] = d + w and push (dist[v], v).",
        "Repeat until the heap is empty.",
        "dist[] now holds the shortest distance to every node. Infinity means unreachable."
      ],
      "example": {
        "problem": "Undirected weighted graph on A to F with edges A-B 4, A-C 1, C-B 2, B-D 1, C-D 5, D-E 3, E-F 1. Find the shortest distance from A to F. Expected answer: 8.",
        "walk": "Watch B. The direct edge A-B first gives dist 4, but after C is finalized the route A-C-B gives 3, so B is updated and pushed again. The older entry (4,B) is still in the heap and gets skipped when it is popped. The same happens with D. Green nodes are finalized and never change again.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "A",
              "x": 6,
              "y": 50
            },
            {
              "id": "B",
              "x": 32,
              "y": 14
            },
            {
              "id": "C",
              "x": 32,
              "y": 86
            },
            {
              "id": "D",
              "x": 60,
              "y": 22
            },
            {
              "id": "E",
              "x": 80,
              "y": 78
            },
            {
              "id": "F",
              "x": 94,
              "y": 30
            }
          ],
          "edges": [
            [
              "A",
              "B"
            ],
            [
              "A",
              "C"
            ],
            [
              "C",
              "B"
            ],
            [
              "B",
              "D"
            ],
            [
              "C",
              "D"
            ],
            [
              "D",
              "E"
            ],
            [
              "E",
              "F"
            ]
          ],
          "weights": {
            "A-B": 4,
            "A-C": 1,
            "C-B": 2,
            "B-D": 1,
            "C-D": 5,
            "D-E": 3,
            "E-F": 1
          },
          "frames": [
            {
              "note": "Edge numbers are travel costs. dist (orange) starts at 0 for A. The min-heap holds (distance, node) pairs, smallest first.",
              "hl": {
                "A": "b"
              },
              "tags": {
                "A": 0
              },
              "queue": [
                "(0,A)"
              ]
            },
            {
              "note": "Pop (0,A). Its distance 0 is final. Relax its edges: B becomes 4, C becomes 1.",
              "hl": {
                "A": "a",
                "B": "b",
                "C": "b"
              },
              "ehl": {
                "A-B": "b",
                "A-C": "b"
              },
              "tags": {
                "A": 0,
                "B": 4,
                "C": 1
              },
              "queue": [
                "(1,C)",
                "(4,B)"
              ]
            },
            {
              "note": "Pop (1,C). Its distance 1 is final. Relax its edges: B becomes 3, D becomes 6.",
              "hl": {
                "C": "a",
                "A": "ok",
                "B": "b",
                "D": "b"
              },
              "ehl": {
                "C-B": "b",
                "C-D": "b"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 6
              },
              "queue": [
                "(3,B)",
                "(4,B)",
                "(6,D)"
              ]
            },
            {
              "note": "Pop (3,B). Its distance 3 is final. Relax its edges: D becomes 4.",
              "hl": {
                "C": "ok",
                "A": "ok",
                "B": "a",
                "D": "b"
              },
              "ehl": {
                "B-D": "b"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4
              },
              "queue": [
                "(4,B)",
                "(4,D)",
                "(6,D)"
              ]
            },
            {
              "note": "Pop (4,B) but dist[B] is already 3. This is an outdated entry, so skip it.",
              "hl": {
                "C": "ok",
                "A": "ok",
                "B": "dim"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4
              },
              "queue": [
                "(4,D)",
                "(6,D)"
              ]
            },
            {
              "note": "Pop (4,D). Its distance 4 is final. Relax its edges: E becomes 7.",
              "hl": {
                "D": "a",
                "C": "ok",
                "A": "ok",
                "B": "ok",
                "E": "b"
              },
              "ehl": {
                "D-E": "b"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4,
                "E": 7
              },
              "queue": [
                "(6,D)",
                "(7,E)"
              ]
            },
            {
              "note": "Pop (6,D) but dist[D] is already 4. This is an outdated entry, so skip it.",
              "hl": {
                "D": "dim",
                "C": "ok",
                "A": "ok",
                "B": "ok"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4,
                "E": 7
              },
              "queue": [
                "(7,E)"
              ]
            },
            {
              "note": "Pop (7,E). Its distance 7 is final. Relax its edges: F becomes 8.",
              "hl": {
                "D": "ok",
                "E": "a",
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "F": "b"
              },
              "ehl": {
                "E-F": "b"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4,
                "E": 7,
                "F": 8
              },
              "queue": [
                "(8,F)"
              ]
            },
            {
              "note": "Pop (8,F). Its distance 8 is final. No neighbour gets a shorter route.",
              "hl": {
                "D": "ok",
                "E": "ok",
                "F": "a",
                "A": "ok",
                "B": "ok",
                "C": "ok"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4,
                "E": 7,
                "F": 8
              },
              "queue": []
            },
            {
              "note": "The heap is empty. Shortest route A -> C -> B -> D -> E -> F costs 8. Note A to B directly costs 4, but via C it costs only 3.",
              "hl": {
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "D": "ok",
                "E": "ok",
                "F": "ok"
              },
              "ehl": {
                "E-F": "ok",
                "D-E": "ok",
                "B-D": "ok",
                "C-B": "ok",
                "A-C": "ok"
              },
              "tags": {
                "A": 0,
                "B": 3,
                "C": 1,
                "D": 4,
                "E": 7,
                "F": 8
              },
              "out": "Shortest A to F = 8"
            }
          ]
        }
      },
      "code": "// edges[i] = {u, v, w}, undirected. Returns the shortest distance start -> target\nint dijkstra(int n, vector<vector<int>>& edges, int start, int target) {\n    vector<vector<pair<int,int>>> adj(n);\n    for (auto& e : edges) {\n        adj[e[0]].push_back({e[1], e[2]});\n        adj[e[1]].push_back({e[0], e[2]});\n    }\n    vector<int> dist(n, INT_MAX);\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;  // min-heap\n    dist[start] = 0;\n    pq.push({0, start});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;            // outdated entry\n        for (auto [v, w] : adj[u]) {\n            if (d + w < dist[v]) {            // found a cheaper way to v\n                dist[v] = d + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist[target] == INT_MAX ? -1 : dist[target];\n}",
      "complexity": "Time O((V + E) log V) because each edge can push one heap entry. Space O(V + E).",
      "mistakes": [
        "Using Dijkstra with negative edge weights. It gives wrong answers, use Bellman-Ford instead.",
        "Skipping the check d > dist[u]. The code still works but does a lot of wasted work.",
        "Adding INT_MAX + w and overflowing. Only relax from nodes that were really reached, as the pop order guarantees here."
      ],
      "practice": [
        743,
        1631,
        787
      ]
    },
    "8": {
      "name": "Minimum spanning tree",
      "when": "You must connect all nodes with the smallest total cost and no extra edges: laying cables, roads between cities, min cost to connect points. The graph is undirected and weighted.",
      "idea": "A spanning tree touches every node using exactly n - 1 edges and has no cycle. The minimum one is found greedily. Kruskal's algorithm sorts the edges from cheapest to most expensive. It takes an edge if its two ends are in different groups, and skips it if they are already connected, since that would form a cycle. Union-find answers the group question quickly. Why is the greedy choice safe? The cheapest edge that does not make a cycle can always be part of some best tree. Prim's algorithm gives the same result by growing one tree with a min-heap.",
      "steps": [
        "Put all edges into a list and sort it by weight.",
        "Create a union-find structure with one group per node.",
        "Go through the sorted edges. If find(u) != find(v), unite them, add the weight to the total, and count the edge.",
        "If the two ends are in the same group, skip the edge.",
        "Stop when you have n - 1 edges. If you run out of edges first, the graph is not connected."
      ],
      "example": {
        "problem": "Weighted graph on A to F with edges A-B 4, A-C 3, B-C 1, B-D 2, C-D 4, D-E 2, E-F 6, D-F 7. Find the total weight of a minimum spanning tree. Expected answer: 14.",
        "walk": "Edges are processed in sorted order. B-C, B-D, D-E and A-C are taken, and the group labels merge as it goes. A-B (4) and C-D (4) are cheaper than E-F, but they are skipped because both ends are already in the same group. E-F is the only way to reach F, so it is taken even though it costs 6. The total is 1 + 2 + 2 + 3 + 6 = 14.",
        "viz": {
          "kind": "graph",
          "nodes": [
            {
              "id": "A",
              "x": 6,
              "y": 50
            },
            {
              "id": "B",
              "x": 36,
              "y": 14
            },
            {
              "id": "C",
              "x": 36,
              "y": 86
            },
            {
              "id": "D",
              "x": 64,
              "y": 50
            },
            {
              "id": "E",
              "x": 92,
              "y": 14
            },
            {
              "id": "F",
              "x": 92,
              "y": 86
            }
          ],
          "edges": [
            [
              "A",
              "B"
            ],
            [
              "A",
              "C"
            ],
            [
              "B",
              "C"
            ],
            [
              "B",
              "D"
            ],
            [
              "C",
              "D"
            ],
            [
              "D",
              "E"
            ],
            [
              "E",
              "F"
            ],
            [
              "D",
              "F"
            ]
          ],
          "weights": {
            "A-B": 4,
            "A-C": 3,
            "B-C": 1,
            "B-D": 2,
            "C-D": 4,
            "D-E": 2,
            "E-F": 6,
            "D-F": 7
          },
          "frames": [
            {
              "note": "All edges are shown faded. Kruskal sorts them by weight: 1, 2, 2, 3, 4, 4, 6, 7, then takes an edge only if it joins two different groups. The orange label is each node's group.",
              "ehl": {
                "A-B": "dim",
                "A-C": "dim",
                "B-C": "dim",
                "B-D": "dim",
                "C-D": "dim",
                "D-E": "dim",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "A",
                "B": "B",
                "C": "C",
                "D": "D",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 0,
                "taken": 0
              }
            },
            {
              "note": "Edge B-C (weight 1): different groups, so take it and merge them. Total weight is now 1.",
              "hl": {
                "B": "a",
                "C": "a"
              },
              "ehl": {
                "A-B": "dim",
                "A-C": "dim",
                "B-C": "ok",
                "B-D": "dim",
                "C-D": "dim",
                "D-E": "dim",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "A",
                "B": "C",
                "C": "C",
                "D": "D",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 1,
                "taken": 1
              }
            },
            {
              "note": "Edge B-D (weight 2): different groups, so take it and merge them. Total weight is now 3.",
              "hl": {
                "B": "a",
                "D": "a"
              },
              "ehl": {
                "A-B": "dim",
                "A-C": "dim",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "dim",
                "D-E": "dim",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "A",
                "B": "D",
                "C": "D",
                "D": "D",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 3,
                "taken": 2
              }
            },
            {
              "note": "Edge D-E (weight 2): different groups, so take it and merge them. Total weight is now 5.",
              "hl": {
                "D": "a",
                "E": "a"
              },
              "ehl": {
                "A-B": "dim",
                "A-C": "dim",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "dim",
                "D-E": "ok",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "A",
                "B": "E",
                "C": "E",
                "D": "E",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 5,
                "taken": 3
              }
            },
            {
              "note": "Edge A-C (weight 3): different groups, so take it and merge them. Total weight is now 8.",
              "hl": {
                "A": "a",
                "C": "a"
              },
              "ehl": {
                "A-B": "dim",
                "A-C": "ok",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "dim",
                "D-E": "ok",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "E",
                "B": "E",
                "C": "E",
                "D": "E",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 8,
                "taken": 4
              }
            },
            {
              "note": "Edge A-B (weight 4): A and B are already in the same group, so it would make a cycle. Skip it.",
              "hl": {
                "A": "bad",
                "B": "bad"
              },
              "ehl": {
                "A-B": "bad",
                "A-C": "ok",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "dim",
                "D-E": "ok",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "E",
                "B": "E",
                "C": "E",
                "D": "E",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 8,
                "taken": 4
              }
            },
            {
              "note": "Edge C-D (weight 4): C and D are already in the same group, so it would make a cycle. Skip it.",
              "hl": {
                "C": "bad",
                "D": "bad"
              },
              "ehl": {
                "A-B": "bad",
                "A-C": "ok",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "bad",
                "D-E": "ok",
                "E-F": "dim",
                "D-F": "dim"
              },
              "tags": {
                "A": "E",
                "B": "E",
                "C": "E",
                "D": "E",
                "E": "E",
                "F": "F"
              },
              "vars": {
                "total": 8,
                "taken": 4
              }
            },
            {
              "note": "Edge E-F (weight 6): different groups, so take it and merge them. Total weight is now 14.",
              "hl": {
                "E": "a",
                "F": "a"
              },
              "ehl": {
                "A-B": "bad",
                "A-C": "ok",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "bad",
                "D-E": "ok",
                "E-F": "ok",
                "D-F": "dim"
              },
              "tags": {
                "A": "F",
                "B": "F",
                "C": "F",
                "D": "F",
                "E": "F",
                "F": "F"
              },
              "vars": {
                "total": 14,
                "taken": 5
              }
            },
            {
              "note": "We have 5 edges for 6 nodes, so everything is connected. The remaining edges are not needed. Minimum total weight is 14.",
              "hl": {
                "A": "ok",
                "B": "ok",
                "C": "ok",
                "D": "ok",
                "E": "ok",
                "F": "ok"
              },
              "ehl": {
                "A-B": "dim",
                "A-C": "ok",
                "B-C": "ok",
                "B-D": "ok",
                "C-D": "dim",
                "D-E": "ok",
                "E-F": "ok",
                "D-F": "dim"
              },
              "tags": {
                "A": "F",
                "B": "F",
                "C": "F",
                "D": "F",
                "E": "F",
                "F": "F"
              },
              "vars": {
                "total": 14,
                "taken": 5
              },
              "out": "MST weight = 14"
            }
          ]
        }
      },
      "code": "struct DSU {\n    vector<int> p;\n    DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }\n    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        p[a] = b;\n        return true;\n    }\n};\n\n// edges[i] = {weight, u, v}. Returns the MST weight, or -1 if not connected\nint kruskal(int n, vector<array<int,3>> edges) {\n    sort(edges.begin(), edges.end());       // cheapest first\n    DSU dsu(n);\n    int total = 0, used = 0;\n    for (auto& [w, u, v] : edges) {\n        if (dsu.unite(u, v)) {              // joins two different groups\n            total += w;\n            if (++used == n - 1) break;     // tree is complete\n        }\n    }\n    return used == n - 1 ? total : -1;\n}",
      "complexity": "Time O(E log E) for the sort, the union-find work is almost free. Space O(V + E).",
      "mistakes": [
        "Adding the edge before checking for a cycle. Always test the group first, with find.",
        "Forgetting the n - 1 check, which hides a disconnected graph.",
        "Using this for directed graphs or shortest paths. An MST minimizes total cost, not the distance between two particular nodes."
      ],
      "practice": [
        1584,
        684
      ]
    },
    "9": {
      "name": "Graph from relations",
      "when": "The input is not a graph but a list of relations: equations like a / b = 2, words that differ by one letter, accounts sharing an email. You must answer questions about indirect links.",
      "idea": "First turn the relations into a graph, then use a normal traversal. For equations, each variable is a node. The fact a / b = k becomes an edge a to b with weight k, and also an edge b to a with weight 1 / k. To answer x / y, walk from x to y with DFS or BFS and multiply the weights on the way. If y cannot be reached, or a variable never appeared, the answer is -1. For word problems, the nodes are words (or states) and two are linked if they differ by one letter, so BFS finds the shortest chain.",
      "steps": [
        "Decide what a node is (a variable, a word, an account) and what an edge means.",
        "Map each node name to an id with a hash map, or use the name itself as the key.",
        "For each relation, add the edge in both directions. Give the reverse edge the inverse weight if the relation has a direction.",
        "For each query, run DFS or BFS from the first node. Carry a running product (or a distance).",
        "Return the result when you reach the target, or -1 when the search ends without finding it."
      ],
      "example": {
        "problem": "Evaluate Division: a / b = 2.0, b / c = 3.0, d / e = 5.0. Answer the queries a / c and a / d. Expected answers: 6.0 and -1.0.",
        "walk": "The drawn arrows show the given facts. The code also stores the reverse edge with the inverse weight, such as b to a with 0.5. The tag is the running product. Going a to b gives 2, then b to c gives 2 * 3 = 6. For a / d, the search from a never leaves the component {a, b, c}, so d is unreachable and the answer is -1.",
        "viz": {
          "kind": "graph",
          "directed": true,
          "nodes": [
            {
              "id": "a",
              "x": 8,
              "y": 62
            },
            {
              "id": "b",
              "x": 38,
              "y": 62
            },
            {
              "id": "c",
              "x": 68,
              "y": 62
            },
            {
              "id": "d",
              "x": 22,
              "y": 12
            },
            {
              "id": "e",
              "x": 62,
              "y": 12
            }
          ],
          "edges": [
            [
              "a",
              "b"
            ],
            [
              "b",
              "c"
            ],
            [
              "d",
              "e"
            ]
          ],
          "weights": {
            "a-b": 2,
            "b-c": 3,
            "d-e": 5
          },
          "frames": [
            {
              "note": "Each equation x / y = k is a fact about two variables, so make variables into nodes. Faded edges are facts we have not added yet.",
              "ehl": {
                "a-b": "dim",
                "b-c": "dim",
                "d-e": "dim"
              }
            },
            {
              "note": "Equation a / b = 2: a to b has weight 2, and the reverse b to a has weight 1/2. Weights multiply along a path.",
              "hl": {
                "a": "a",
                "b": "a"
              },
              "ehl": {
                "a-b": "b",
                "b-c": "dim",
                "d-e": "dim"
              }
            },
            {
              "note": "Equation b / c = 3: b to c has weight 3, and c to b has weight 1/3. Weights multiply along a path.",
              "hl": {
                "b": "a",
                "c": "a"
              },
              "ehl": {
                "a-b": "ok",
                "b-c": "b",
                "d-e": "dim"
              }
            },
            {
              "note": "Equation d / e = 5: d to e has weight 5, and e to d has weight 1/5. Weights multiply along a path.",
              "hl": {
                "d": "a",
                "e": "a"
              },
              "ehl": {
                "a-b": "ok",
                "b-c": "ok",
                "d-e": "b"
              }
            },
            {
              "note": "Query a / c. Start DFS at a with product 1. Then walk toward c and multiply the weights.",
              "hl": {
                "a": "a",
                "c": "dim"
              },
              "ehl": {
                "a-b": "ok",
                "b-c": "ok",
                "d-e": "ok"
              },
              "tags": {
                "a": 1
              },
              "vars": {
                "query": "a / c"
              }
            },
            {
              "note": "Walk a to b: the product becomes 1 * 2 = 2. This means a / b is 2.",
              "hl": {
                "a": "ok",
                "b": "a"
              },
              "ehl": {
                "a-b": "b",
                "b-c": "ok",
                "d-e": "ok"
              },
              "tags": {
                "a": 1,
                "b": 2
              },
              "vars": {
                "query": "a / c"
              }
            },
            {
              "note": "Walk b to c: the product becomes 2 * 3 = 6. We reached c, so a / c = 6.",
              "hl": {
                "a": "ok",
                "b": "ok",
                "c": "a"
              },
              "ehl": {
                "a-b": "ok",
                "b-c": "b",
                "d-e": "ok"
              },
              "tags": {
                "a": 1,
                "b": 2,
                "c": 6
              },
              "vars": {
                "query": "a / c"
              },
              "out": "a / c = 6"
            },
            {
              "note": "Query a / d: DFS from a can only reach b and c. It never reaches d, so the answer is -1. Unknown means no path.",
              "hl": {
                "a": "ok",
                "b": "ok",
                "c": "ok",
                "d": "bad"
              },
              "ehl": {
                "a-b": "ok",
                "b-c": "ok",
                "d-e": "ok"
              },
              "tags": {
                "a": 1,
                "b": 2,
                "c": 6
              },
              "vars": {
                "query": "a / d"
              },
              "out": "a / d = -1"
            }
          ]
        }
      },
      "code": "bool dfs(const string& u, const string& target, double cur,\n         unordered_map<string, vector<pair<string,double>>>& g,\n         unordered_set<string>& seen, double& res) {\n    if (u == target) { res = cur; return true; }\n    seen.insert(u);\n    for (auto& [v, w] : g[u])\n        if (!seen.count(v) && dfs(v, target, cur * w, g, seen, res))\n            return true;                      // multiply weights along the path\n    return false;\n}\n\nvector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values,\n                            vector<vector<string>>& queries) {\n    unordered_map<string, vector<pair<string,double>>> g;\n    for (int i = 0; i < (int)equations.size(); i++) {\n        const string& a = equations[i][0];\n        const string& b = equations[i][1];\n        g[a].push_back({b, values[i]});       // a / b = k\n        g[b].push_back({a, 1.0 / values[i]}); // b / a = 1 / k\n    }\n    vector<double> ans;\n    for (auto& q : queries) {\n        double res = -1.0;\n        if (g.count(q[0]) && g.count(q[1])) { // both variables must exist\n            unordered_set<string> seen;\n            dfs(q[0], q[1], 1.0, g, seen, res);\n        }\n        ans.push_back(res);\n    }\n    return ans;\n}",
      "complexity": "Time O(Q * (V + E)): one search per query. Space O(V + E) for the graph and the recursion.",
      "mistakes": [
        "Adding only the forward edge. Queries like b / a need the reverse edge with weight 1 / k.",
        "Not checking that both variables exist. An unknown variable must give -1, even for x / x.",
        "Forgetting the visited set, which loops forever on cycles such as a to b to a."
      ],
      "practice": [
        399,
        127
      ]
    }
  },
  "12": {
    "0": {
      "name": "1D linear",
      "when": "You walk along a line (stairs, houses, a number n) and the answer at position i depends only on the answer at one or two earlier positions. You are asked for a count, a minimum or a maximum.",
      "idea": "Say in words what dp[i] means, for example 'the best total using only the first i + 1 houses'. Then ask how the last choice changes it. For House Robber the last house is either skipped (answer stays dp[i-1]) or robbed (its value plus dp[i-2], because the neighbour must be skipped). Take the better one. Each dp value reuses earlier ones instead of recomputing them, which turns an exponential search into a single pass. Because dp[i] only looks back two steps, you can keep just two variables.",
      "steps": [
        "Define the state: dp[i] is the best answer for the first i + 1 items.",
        "Set the base cases: dp[0] and dp[1] are solved directly.",
        "Write the transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
        "Fill from left to right so the two earlier values are always ready.",
        "Return the last value. Keep only prev1 and prev2 to use O(1) space."
      ],
      "example": {
        "problem": "House Robber: houses hold [2, 7, 9, 3, 1] and you cannot rob two neighbouring houses. Find the maximum money. Expected answer: 12.",
        "walk": "Orange is the cell being filled and violet cells are the two earlier answers it looks at. At each house compare skip (copy the left cell) against take (this house plus the cell two to the left). The 'take' value is 11 at index 2 and 12 at the end, showing why we reach back two steps.",
        "viz": {
          "kind": "array",
          "cells": [
            null,
            null,
            null,
            null,
            null
          ],
          "frames": [
            {
              "note": "dp[i] = the most money we can take from houses 0..i. Houses hold [2, 7, 9, 3, 1]. A robbed house blocks its neighbour.",
              "cells": [
                null,
                null,
                null,
                null,
                null
              ]
            },
            {
              "note": "dp[0] = 2. With one house we just take it.",
              "cells": [
                2,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "0": "a"
              },
              "vars": {
                "nums[i]": 2
              }
            },
            {
              "note": "dp[1] = max(2, 7) = 7. Two neighbours, so we can only take one, the bigger.",
              "cells": [
                2,
                7,
                null,
                null,
                null
              ],
              "hl": {
                "0": "b",
                "1": "a"
              },
              "vars": {
                "nums[i]": 7
              }
            },
            {
              "note": "dp[2] = max(skip: dp[1], take: dp[0] + nums[2]) = max(7, 2 + 9) = 11.",
              "cells": [
                2,
                7,
                11,
                null,
                null
              ],
              "hl": {
                "0": "b",
                "1": "b",
                "2": "a"
              },
              "vars": {
                "nums[i]": 9,
                "skip": 7,
                "take": 11
              }
            },
            {
              "note": "dp[3] = max(skip: dp[2], take: dp[1] + nums[3]) = max(11, 7 + 3) = 11.",
              "cells": [
                2,
                7,
                11,
                11,
                null
              ],
              "hl": {
                "1": "b",
                "2": "b",
                "3": "a"
              },
              "vars": {
                "nums[i]": 3,
                "skip": 11,
                "take": 10
              }
            },
            {
              "note": "dp[4] = max(skip: dp[3], take: dp[2] + nums[4]) = max(11, 11 + 1) = 12.",
              "cells": [
                2,
                7,
                11,
                11,
                12
              ],
              "hl": {
                "2": "b",
                "3": "b",
                "4": "a"
              },
              "vars": {
                "nums[i]": 1,
                "skip": 11,
                "take": 12
              }
            },
            {
              "note": "The last cell is the answer: 12, by robbing houses with 2, 9 and 1.",
              "cells": [
                2,
                7,
                11,
                11,
                12
              ],
              "hl": {
                "4": "ok"
              },
              "out": "Answer: 12"
            }
          ]
        }
      },
      "code": "// Maximum money without robbing two adjacent houses\nint rob(vector<int>& nums) {\n    int prev2 = 0, prev1 = 0;            // dp[i-2] and dp[i-1]\n    for (int x : nums) {\n        int cur = max(prev1, prev2 + x); // skip this house, or take it\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}",
      "complexity": "Time O(n), one step per house. Space O(1) because only the last two values are kept (O(n) with a full dp array).",
      "mistakes": [
        "Writing dp[i-1] + nums[i] for the take case. That robs two neighbours. It must be dp[i-2] + nums[i].",
        "Forgetting the base cases when n is 0 or 1, and reading dp[-1] or dp[-2].",
        "Updating prev1 before prev2 in the rolling version, which overwrites a value you still need."
      ],
      "practice": [
        70,
        746,
        198,
        213,
        343
      ]
    },
    "1": {
      "name": "0/1 knapsack",
      "when": "Each item can be used at most once and you must hit a target or stay under a capacity: can a subset reach a sum, how many subsets, or what is the best value. Typical words: subset, partition, take or skip.",
      "idea": "Think of the items one by one. For each item you either skip it or take it once. Keep dp[s] meaning 'the sum s can be built from the items processed so far'. When item x arrives, every sum s that was reachable as s - x now makes s reachable too. To stop the same item being used twice, update the table from the largest s down to x, so dp[s - x] still describes the state before this item. Equal partition becomes: can we reach sum/2?",
      "steps": [
        "Compute the total. If it is odd, return false. Otherwise the target is total / 2.",
        "Create dp[0..target] with dp[0] = true (the empty subset) and the rest false.",
        "For each item x, loop s from target down to x.",
        "Set dp[s] = dp[s] or dp[s - x]: either already reachable, or reachable by taking x.",
        "Return dp[target]."
      ],
      "example": {
        "problem": "Partition Equal Subset Sum: can [2, 3, 5, 6] be split into two subsets with the same sum? The total is 16, so we need a subset with sum 8. Expected answer: true.",
        "walk": "Each frame processes one item. Orange cells are sums that just became reachable, and violet cells are the older sums they grew from (the new sum minus the item). Green means reachable. After item 5, sum 8 turns on (3 + 5), which is the target.",
        "viz": {
          "kind": "array",
          "cells": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "frames": [
            {
              "note": "dp[s] = 1 means some subset of the items seen so far adds up to exactly s. Total is 16, so the target is 8. Only dp[0] is true at first.",
              "cells": [
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "hl": {
                "0": "ok"
              },
              "vars": {
                "target": 8
              }
            },
            {
              "note": "Item 2, s from 8 down. New sums: 2 (= 0 + 2).",
              "cells": [
                1,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              "hl": {
                "0": "b",
                "2": "a"
              },
              "vars": {
                "item": 2,
                "target": 8
              }
            },
            {
              "note": "Item 3, s from 8 down. New sums: 5 (= 2 + 3), 3 (= 0 + 3).",
              "cells": [
                1,
                0,
                1,
                1,
                0,
                1,
                0,
                0,
                0
              ],
              "hl": {
                "0": "b",
                "2": "b",
                "3": "a",
                "5": "a"
              },
              "vars": {
                "item": 3,
                "target": 8
              }
            },
            {
              "note": "Item 5, s from 8 down. New sums: 8 (= 3 + 5), 7 (= 2 + 5).",
              "cells": [
                1,
                0,
                1,
                1,
                0,
                1,
                0,
                1,
                1
              ],
              "hl": {
                "2": "b",
                "3": "b",
                "7": "a",
                "8": "a"
              },
              "vars": {
                "item": 5,
                "target": 8
              }
            },
            {
              "note": "Item 6, s from 8 down. New sums: 6 (= 0 + 6).",
              "cells": [
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                1,
                1
              ],
              "hl": {
                "0": "b",
                "6": "a"
              },
              "vars": {
                "item": 6,
                "target": 8
              }
            },
            {
              "note": "dp[8] is true, so a subset sums to 8 and the rest also sums to 8 (3 + 5 and 2 + 6). We can split.",
              "cells": [
                1,
                0,
                1,
                1,
                0,
                1,
                1,
                1,
                1
              ],
              "hl": {
                "8": "ok"
              },
              "out": "Answer: true"
            }
          ]
        }
      },
      "code": "// Can nums be split into two subsets with equal sum?\nbool canPartition(vector<int>& nums) {\n    int total = accumulate(nums.begin(), nums.end(), 0);\n    if (total % 2) return false;\n    int target = total / 2;\n    vector<char> dp(target + 1, 0);\n    dp[0] = 1;                                  // empty subset\n    for (int x : nums)\n        for (int s = target; s >= x; s--)       // downwards: use x at most once\n            dp[s] = dp[s] || dp[s - x];\n    return dp[target];\n}",
      "complexity": "Time O(n * target), one pass over the table per item. Space O(target) thanks to the single reused row.",
      "mistakes": [
        "Looping s upwards. Then dp[s - x] may already include x, so one item is used many times (that is unbounded knapsack).",
        "Forgetting dp[0] = true, so nothing is ever reachable.",
        "Not checking the total for oddness first, which makes total / 2 a wrong target."
      ],
      "practice": [
        416,
        494
      ]
    },
    "2": {
      "name": "Unbounded knapsack",
      "when": "You may use the same item or coin as many times as you like to reach an exact total. You want the fewest items, or the number of ways. Words: coins, amount, unlimited supply, combinations.",
      "idea": "Let dp[a] be the best answer for total a. To build a, think about the last coin used: if it is c, the rest is a - c, which you already solved. Try every coin and keep the best: dp[a] = min(dp[a - c] + 1). Because the earlier cell may itself already contain coin c, reuse is allowed automatically. Loop order matters for counting. To count combinations put the coins in the outer loop (each coin gets one pass). To count permutations put the amounts in the outer loop.",
      "steps": [
        "Define dp[a] = fewest coins for amount a. Set dp[0] = 0 and every other cell to a big sentinel such as amount + 1.",
        "For a from 1 to amount, try each coin c with c <= a.",
        "Update dp[a] = min(dp[a], dp[a - c] + 1).",
        "If dp[amount] is still the sentinel, return -1, otherwise return it.",
        "For counting ways, use dp[a] += dp[a - c] with coins in the OUTER loop."
      ],
      "example": {
        "problem": "Coin Change: coins [1, 3, 4], amount 6. Find the fewest coins that sum to 6. Expected answer: 2 (3 + 3). Greedy would pick 4 + 1 + 1 and use 3 coins.",
        "walk": "Orange is dp[a] being computed. Violet cells are dp[a - c] for each coin c, the sub-problems it can come from. Look at dp[6]: taking the big coin 4 leads to dp[2] = 2 (total 3), but coin 3 leads to dp[3] = 1 (total 2), so the best choice is not the largest coin.",
        "viz": {
          "kind": "array",
          "cells": [
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ],
          "frames": [
            {
              "note": "dp[a] = fewest coins that make amount a. Coins are 1, 3, 4 and each coin can be reused. dp[0] = 0, since zero coins make 0.",
              "cells": [
                0,
                null,
                null,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "0": "ok"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[1] = min over coins of dp[1-c] + 1 = min(1) = 1.",
              "cells": [
                0,
                1,
                null,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "0": "b",
                "1": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[2] = min over coins of dp[2-c] + 1 = min(2) = 2.",
              "cells": [
                0,
                1,
                2,
                null,
                null,
                null,
                null
              ],
              "hl": {
                "1": "b",
                "2": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[3] = min over coins of dp[3-c] + 1 = min(3, 1) = 1.",
              "cells": [
                0,
                1,
                2,
                1,
                null,
                null,
                null
              ],
              "hl": {
                "0": "b",
                "2": "b",
                "3": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[4] = min over coins of dp[4-c] + 1 = min(2, 2, 1) = 1.",
              "cells": [
                0,
                1,
                2,
                1,
                1,
                null,
                null
              ],
              "hl": {
                "0": "b",
                "1": "b",
                "3": "b",
                "4": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[5] = min over coins of dp[5-c] + 1 = min(2, 3, 2) = 2.",
              "cells": [
                0,
                1,
                2,
                1,
                1,
                2,
                null
              ],
              "hl": {
                "1": "b",
                "2": "b",
                "4": "b",
                "5": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = min(3, 2, 3) = 2. Two 3-coins beat greedy 4+1+1.",
              "cells": [
                0,
                1,
                2,
                1,
                1,
                2,
                2
              ],
              "hl": {
                "2": "b",
                "3": "b",
                "5": "b",
                "6": "a"
              },
              "vars": {
                "coins": "1,3,4"
              }
            },
            {
              "note": "dp[6] = 2, so the fewest coins for 6 is two (3 + 3).",
              "cells": [
                0,
                1,
                2,
                1,
                1,
                2,
                2
              ],
              "hl": {
                "6": "ok"
              },
              "out": "Answer: 2"
            }
          ]
        }
      },
      "code": "// Fewest coins to make amount, or -1 if impossible\nint coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);   // amount + 1 means \"impossible\"\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++)\n        for (int c : coins)\n            if (c <= a)\n                dp[a] = min(dp[a], dp[a - c] + 1);\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
      "complexity": "Time O(amount * number of coins). Space O(amount) for the dp array.",
      "mistakes": [
        "Using INT_MAX as infinity and then adding 1, which overflows. Use amount + 1 instead.",
        "Using greedy (largest coin first). It fails for sets like [1, 3, 4].",
        "Mixing up loop order when counting ways: amounts outer counts permutations, coins outer counts combinations."
      ],
      "practice": [
        322,
        518
      ]
    },
    "3": {
      "name": "Longest increasing subsequence",
      "when": "You need the longest strictly increasing (or non-decreasing) chain you can pick from an array while keeping the original order, without needing the elements to be next to each other.",
      "idea": "A subsequence skips elements but keeps order. Define dp[i] as the length of the longest increasing subsequence that ends exactly at nums[i]. To end at i, look at every earlier j with nums[j] < nums[i]. You can append nums[i] to the best of those chains: dp[i] = 1 + max(dp[j]). If no earlier value is smaller, the chain is just the element itself, length 1. The answer is the maximum over all dp[i], because the best chain can end anywhere. This is O(n^2). A faster O(n log n) version keeps a 'tails' list and uses binary search to replace the first tail that is >= the new number.",
      "steps": [
        "Define dp[i] = length of the longest increasing subsequence ending at index i. Start all values at 1.",
        "For each i, loop over j from 0 to i - 1.",
        "If nums[j] < nums[i], set dp[i] = max(dp[i], dp[j] + 1).",
        "Track the maximum dp[i] seen. That is the answer, not dp[n-1].",
        "For O(n log n): keep a sorted tails list and use lower_bound to place each number."
      ],
      "example": {
        "problem": "Longest Increasing Subsequence of [10, 9, 2, 5, 3, 7, 101, 18]. Expected answer: 4, for example 2, 3, 7, 101.",
        "walk": "Top row is the input, bottom row is dp. Orange marks the current index. Violet cells are earlier dp values from smaller numbers, the chains we could extend. For 7 the smaller values are 2, 5, 3 and the best dp among them is 2, giving 3. Then 101 extends that to 4.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              10,
              9,
              2,
              5,
              3,
              7,
              101,
              18
            ],
            [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
          ],
          "rows": [
            "nums",
            "dp"
          ],
          "cols": [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7"
          ],
          "frames": [
            {
              "note": "Row 1 is the array. dp[i] = length of the longest increasing subsequence that ENDS at index i. Every element alone is length 1.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  1,
                  1,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {}
            },
            {
              "note": "i=3, value 5. Smaller values before it: 2. Best dp among them is 1 (at 2), so dp[3] = 1 + 1 = 2.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  1,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,3": "a",
                "1,3": "a",
                "1,2": "b"
              },
              "vars": {
                "dp[i]": 2
              }
            },
            {
              "note": "i=4, value 3. Smaller values before it: 2. Best dp among them is 1 (at 2), so dp[4] = 1 + 1 = 2.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  2,
                  1,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,4": "a",
                "1,4": "a",
                "1,2": "b"
              },
              "vars": {
                "dp[i]": 2
              }
            },
            {
              "note": "i=5, value 7. Smaller values before it: 2, 5, 3. Best dp among them is 2 (at 5), so dp[5] = 2 + 1 = 3.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  2,
                  3,
                  1,
                  1
                ]
              ],
              "hl": {
                "0,5": "a",
                "1,5": "a",
                "1,2": "b",
                "1,3": "b",
                "1,4": "b"
              },
              "vars": {
                "dp[i]": 3
              }
            },
            {
              "note": "i=6, value 101. Smaller values before it: 10, 9, 2, 5, 3, 7. Best dp among them is 3 (at 7), so dp[6] = 3 + 1 = 4.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  2,
                  3,
                  4,
                  1
                ]
              ],
              "hl": {
                "0,6": "a",
                "1,6": "a",
                "1,0": "b",
                "1,1": "b",
                "1,2": "b",
                "1,3": "b",
                "1,4": "b",
                "1,5": "b"
              },
              "vars": {
                "dp[i]": 4
              }
            },
            {
              "note": "i=7, value 18. Smaller values before it: 10, 9, 2, 5, 3, 7. Best dp among them is 3 (at 7), so dp[7] = 3 + 1 = 4.",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  2,
                  3,
                  4,
                  4
                ]
              ],
              "hl": {
                "0,7": "a",
                "1,7": "a",
                "1,0": "b",
                "1,1": "b",
                "1,2": "b",
                "1,3": "b",
                "1,4": "b",
                "1,5": "b"
              },
              "vars": {
                "dp[i]": 4
              }
            },
            {
              "note": "The answer is the biggest dp value, not the last one: 4 (for example 2, 3, 7, 101).",
              "cells": [
                [
                  10,
                  9,
                  2,
                  5,
                  3,
                  7,
                  101,
                  18
                ],
                [
                  1,
                  1,
                  1,
                  2,
                  2,
                  3,
                  4,
                  4
                ]
              ],
              "hl": {
                "1,6": "ok",
                "1,7": "ok"
              },
              "out": "Answer: 4"
            }
          ]
        }
      },
      "code": "// O(n^2) DP: dp[i] = LIS length ending at i\nint lengthOfLIS(vector<int>& nums) {\n    int n = nums.size(), best = 0;\n    vector<int> dp(n, 1);\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < i; j++)\n            if (nums[j] < nums[i])\n                dp[i] = max(dp[i], dp[j] + 1);\n        best = max(best, dp[i]);                 // chain may end anywhere\n    }\n    return best;\n}\n\n// O(n log n): tails[k] = smallest tail of an increasing run of length k + 1\nint lengthOfLISFast(vector<int>& nums) {\n    vector<int> tails;\n    for (int x : nums) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}",
      "complexity": "DP version: time O(n^2), space O(n). Tails version: time O(n log n) from one binary search per element, space O(n).",
      "mistakes": [
        "Returning dp[n-1]. The best chain may end earlier, so return the maximum of dp.",
        "Using <= instead of < when the subsequence must be strictly increasing.",
        "In the tails version, using upper_bound for a strict LIS. Use lower_bound so equal values replace instead of extend."
      ],
      "practice": [
        300,
        139
      ]
    },
    "4": {
      "name": "Grid DP",
      "when": "You move through a grid (usually only right and down), and you must count paths or find a minimum or maximum cost. The state is a cell (row, col).",
      "idea": "Let dp[r][c] mean 'the answer for reaching cell (r, c)'. Since you can only arrive from above or from the left, that answer is built from two neighbours you have already computed. Fill the table row by row and the last cell holds the final answer. The first row and column have only one way in, so they are the base cases.",
      "steps": [
        "Define the state in words: dp[r][c] is the number of ways to reach (r, c).",
        "Set the base cases: the whole first row and first column are 1.",
        "Write the transition: dp[r][c] = dp[r-1][c] + dp[r][c-1].",
        "Fill the table in an order where both inputs are ready (row by row, left to right).",
        "Return dp[rows-1][cols-1]. If only the previous row is needed, keep a single row to save space."
      ],
      "example": {
        "problem": "Unique Paths: a robot starts at the top-left of a 3 x 4 grid and may only move right or down. How many different paths lead to the bottom-right cell? Expected answer: 10.",
        "walk": "Orange is the cell being filled and violet cells are the two neighbours it adds together. The first row and column are 1 because there is exactly one way to reach them. Every other cell is the sum of the cell above and the cell to its left, and the corner ends up as 10.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ]
          ],
          "rows": [
            "r0",
            "r1",
            "r2"
          ],
          "cols": [
            "c0",
            "c1",
            "c2",
            "c3"
          ],
          "frames": [
            {
              "note": "dp[r][c] will hold the number of ways to reach cell (r, c) moving only right or down.",
              "cells": [
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ]
            },
            {
              "note": "First row and first column: there is only one way to get to any of them, going straight. So they are 1.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  null,
                  null,
                  null
                ],
                [
                  1,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,0": "ok",
                "0,1": "ok",
                "0,2": "ok",
                "0,3": "ok",
                "1,0": "ok",
                "2,0": "ok"
              }
            },
            {
              "note": "dp[1][1] = above (1) + left (1) = 2.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  null,
                  null
                ],
                [
                  1,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,1": "a",
                "0,1": "b",
                "1,0": "b"
              }
            },
            {
              "note": "dp[1][2] = above (1) + left (2) = 3.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  null
                ],
                [
                  1,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,2": "a",
                "0,2": "b",
                "1,1": "b"
              }
            },
            {
              "note": "dp[1][3] = above (1) + left (3) = 4.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  4
                ],
                [
                  1,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,3": "a",
                "0,3": "b",
                "1,2": "b"
              }
            },
            {
              "note": "dp[2][1] = above (2) + left (1) = 3.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  4
                ],
                [
                  1,
                  3,
                  null,
                  null
                ]
              ],
              "hl": {
                "2,1": "a",
                "1,1": "b",
                "2,0": "b"
              }
            },
            {
              "note": "dp[2][2] = above (3) + left (3) = 6.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  4
                ],
                [
                  1,
                  3,
                  6,
                  null
                ]
              ],
              "hl": {
                "2,2": "a",
                "1,2": "b",
                "2,1": "b"
              }
            },
            {
              "note": "dp[2][3] = above (4) + left (6) = 10.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  4
                ],
                [
                  1,
                  3,
                  6,
                  10
                ]
              ],
              "hl": {
                "2,3": "a",
                "1,3": "b",
                "2,2": "b"
              }
            },
            {
              "note": "The bottom-right cell holds the answer: 10 different paths.",
              "cells": [
                [
                  1,
                  1,
                  1,
                  1
                ],
                [
                  1,
                  2,
                  3,
                  4
                ],
                [
                  1,
                  3,
                  6,
                  10
                ]
              ],
              "hl": {
                "2,3": "ok"
              },
              "out": "10 unique paths"
            }
          ]
        }
      },
      "code": "int uniquePaths(int m, int n) {\n    vector<vector<int>> dp(m, vector<int>(n, 1));   // first row and column stay 1\n    for (int r = 1; r < m; r++)\n        for (int c = 1; c < n; c++)\n            dp[r][c] = dp[r - 1][c] + dp[r][c - 1];\n    return dp[m - 1][n - 1];\n}",
      "complexity": "Time O(m * n), one visit per cell. Space O(m * n), which can be reduced to O(n) by keeping only the previous row.",
      "mistakes": [
        "Starting the loops at 0 and reading dp[-1], which is out of bounds. Start at 1, or add explicit bounds checks.",
        "Filling in the wrong order so a neighbour is still 0 when you read it.",
        "Forgetting that blocked cells (obstacles) must get 0 ways, and that this also affects the first row and column."
      ],
      "practice": [
        62,
        64,
        120,
        221
      ]
    },
    "5": {
      "name": "Two-string DP",
      "when": "You compare two strings or two arrays: longest common subsequence, edit distance, interleaving, matching. The answer depends on how prefixes of both inputs relate.",
      "idea": "Make a table with one row per prefix of string A and one column per prefix of string B. Cell dp[i][j] answers the question for the first i letters of A and the first j letters of B. Look at the last letter of each prefix. If they match, the answer often comes from the diagonal cell dp[i-1][j-1]. If they differ, you must make a choice, and each choice points at a neighbour: above, left or diagonal. The extra empty-prefix row and column hold the base cases. For edit distance the three neighbours are delete, insert and replace.",
      "steps": [
        "Define dp[i][j] for prefixes of length i and j. Make the table (m + 1) x (n + 1).",
        "Fill the base row and column: dp[i][0] = i and dp[0][j] = j for edit distance.",
        "Compare a[i-1] and b[j-1]. If equal, dp[i][j] = dp[i-1][j-1].",
        "Otherwise dp[i][j] = 1 + min(dp[i-1][j-1] replace, dp[i-1][j] delete, dp[i][j-1] insert).",
        "Fill row by row and return dp[m][n]."
      ],
      "example": {
        "problem": "Edit Distance: convert word1 = 'horse' into word2 = 'ros' using insert, delete or replace of one letter. Expected answer: 3.",
        "walk": "Rows are letters of 'horse', columns are letters of 'ros', and the first row and column are the empty prefix. In each row the orange cell shows one transition and violet cells are its three inputs: diagonal (replace or match), above (delete) and left (insert). The bottom-right cell is the answer.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null
            ]
          ],
          "rows": [
            "-",
            "h",
            "o",
            "r",
            "s",
            "e"
          ],
          "cols": [
            "-",
            "r",
            "o",
            "s"
          ],
          "frames": [
            {
              "note": "dp[i][j] = fewest edits to turn the first i letters of 'horse' into the first j letters of 'ros'. Allowed edits: insert, delete, replace.",
              "cells": [
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null
                ]
              ]
            },
            {
              "note": "Base cases. Turning i letters into nothing takes i deletes (left column). Turning nothing into j letters takes j inserts (top row).",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  null,
                  null,
                  null
                ],
                [
                  2,
                  null,
                  null,
                  null
                ],
                [
                  3,
                  null,
                  null,
                  null
                ],
                [
                  4,
                  null,
                  null,
                  null
                ],
                [
                  5,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,0": "ok",
                "1,0": "ok",
                "2,0": "ok",
                "3,0": "ok",
                "4,0": "ok",
                "5,0": "ok",
                "0,1": "ok",
                "0,2": "ok",
                "0,3": "ok"
              }
            },
            {
              "note": "Row h. dp[1][1]: 'h' differs from 'r'. 1 + min(replace 0, delete 1, insert 1) = 1.",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  null,
                  null,
                  null
                ],
                [
                  3,
                  null,
                  null,
                  null
                ],
                [
                  4,
                  null,
                  null,
                  null
                ],
                [
                  5,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,1": "a",
                "1,2": "dim",
                "1,3": "dim",
                "0,0": "b",
                "0,1": "b",
                "1,0": "b"
              }
            },
            {
              "note": "Row o. dp[2][2]: 'o' equals 'o', so no edit is needed: copy the diagonal dp[1][1] = 1.",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  2,
                  1,
                  2
                ],
                [
                  3,
                  null,
                  null,
                  null
                ],
                [
                  4,
                  null,
                  null,
                  null
                ],
                [
                  5,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "2,1": "b",
                "2,2": "a",
                "2,3": "dim",
                "1,1": "b",
                "1,2": "b"
              }
            },
            {
              "note": "Row r. dp[3][1]: 'r' equals 'r', so no edit is needed: copy the diagonal dp[2][0] = 2.",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  2,
                  1,
                  2
                ],
                [
                  3,
                  2,
                  2,
                  2
                ],
                [
                  4,
                  null,
                  null,
                  null
                ],
                [
                  5,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "3,1": "a",
                "3,2": "dim",
                "3,3": "dim",
                "2,0": "b",
                "2,1": "b",
                "3,0": "b"
              }
            },
            {
              "note": "Row s. dp[4][3]: 's' equals 's', so no edit is needed: copy the diagonal dp[3][2] = 2.",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  2,
                  1,
                  2
                ],
                [
                  3,
                  2,
                  2,
                  2
                ],
                [
                  4,
                  3,
                  3,
                  2
                ],
                [
                  5,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "4,1": "dim",
                "4,2": "b",
                "4,3": "a",
                "3,2": "b",
                "3,3": "b"
              }
            },
            {
              "note": "Row e. dp[5][3]: 'e' differs from 's'. 1 + min(replace 3, delete 2, insert 4) = 3.",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  2,
                  1,
                  2
                ],
                [
                  3,
                  2,
                  2,
                  2
                ],
                [
                  4,
                  3,
                  3,
                  2
                ],
                [
                  5,
                  4,
                  4,
                  3
                ]
              ],
              "hl": {
                "5,1": "dim",
                "5,2": "b",
                "5,3": "a",
                "4,2": "b",
                "4,3": "b"
              }
            },
            {
              "note": "The bottom-right cell is the answer: 3 edits (horse to rorse, to rose, to ros).",
              "cells": [
                [
                  0,
                  1,
                  2,
                  3
                ],
                [
                  1,
                  1,
                  2,
                  3
                ],
                [
                  2,
                  2,
                  1,
                  2
                ],
                [
                  3,
                  2,
                  2,
                  2
                ],
                [
                  4,
                  3,
                  3,
                  2
                ],
                [
                  5,
                  4,
                  4,
                  3
                ]
              ],
              "hl": {
                "5,3": "ok"
              },
              "out": "Answer: 3"
            }
          ]
        }
      },
      "code": "// Minimum insert / delete / replace operations to turn a into b\nint minDistance(string a, string b) {\n    int m = a.size(), n = b.size();\n    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;   // delete everything\n    for (int j = 0; j <= n; j++) dp[0][j] = j;   // insert everything\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++) {\n            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});\n        }\n    return dp[m][n];\n}",
      "complexity": "Time O(m * n), one visit per cell. Space O(m * n), reducible to O(n) because each row needs only the previous row.",
      "mistakes": [
        "Indexing a[i] instead of a[i - 1]. Row i stands for the first i letters, so the last letter is a[i - 1].",
        "Forgetting the base row and column, so empty-prefix cases are all zero.",
        "In LCS, using min instead of max, or adding 1 when letters differ."
      ],
      "practice": [
        1143,
        72,
        97
      ]
    },
    "6": {
      "name": "String or substring DP",
      "when": "You split a string into valid pieces (word break, decode ways), or ask whether substrings are palindromes or valid. The state is a prefix length i, or a pair (i, j) for a substring.",
      "idea": "Let dp[i] answer the question for the first i characters. To finish the prefix of length i, try every last piece s[j..i). If the part before it, dp[j], is already good and the piece itself is valid (a dictionary word, a number from 1 to 26, a palindrome), then dp[i] is good too. For counting problems like Decode Ways you add up dp[j] over valid pieces instead. For palindromes there is a second style: expand outwards from every centre (single letters and gaps between letters) while both ends match, which costs O(n^2) with O(1) space.",
      "steps": [
        "Define dp[i] for the first i characters, with dp[0] = true for the empty prefix.",
        "Put the dictionary in an unordered_set so piece checks are quick.",
        "For each i from 1 to n, try every cut point j from 0 to i - 1.",
        "If dp[j] is true and s.substr(j, i - j) is valid, set dp[i] = true and stop trying cuts.",
        "Return dp[n]. For counting use dp[i] += dp[j] instead."
      ],
      "example": {
        "problem": "Word Break: s = 'catsand', dictionary [cat, cats, and, sand, dog]. Can s be split into dictionary words? Expected answer: true.",
        "walk": "Top row shows the letters (column i holds letter number i), bottom row is dp. Violet cells are the cut points j that worked. Red means no valid last word, so the prefix is stuck. dp[7] is true by two routes, cats + and and cat + sand, and one is enough.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              null,
              "c",
              "a",
              "t",
              "s",
              "a",
              "n",
              "d"
            ],
            [
              1,
              null,
              null,
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "rows": [
            "s",
            "dp"
          ],
          "cols": [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7"
          ],
          "frames": [
            {
              "note": "dp[i] = 1 if the first i letters can be cut into dictionary words. Words: cat, cats, and, sand, dog. dp[0] = 1 (empty prefix).",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,0": "ok"
              }
            },
            {
              "note": "dp[1] = 0: no cut point j has dp[j] = 1 with S[j..1) a word, for prefix 'c'.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,1": "bad"
              }
            },
            {
              "note": "dp[2] = 0: no cut point j has dp[j] = 1 with S[j..2) a word, for prefix 'ca'.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,2": "bad"
              }
            },
            {
              "note": "dp[3] = 1: dp[0] is 1 and 'cat' is a word, so the prefix 'cat' can be cut.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,3": "ok",
                "1,0": "b"
              }
            },
            {
              "note": "dp[4] = 1: dp[0] is 1 and 'cats' is a word, so the prefix 'cats' can be cut.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  1,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,4": "ok",
                "1,0": "b"
              }
            },
            {
              "note": "dp[5] = 0: no cut point j has dp[j] = 1 with S[j..5) a word, for prefix 'catsa'.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  1,
                  0,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,5": "bad"
              }
            },
            {
              "note": "dp[6] = 0: no cut point j has dp[j] = 1 with S[j..6) a word, for prefix 'catsan'.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  1,
                  0,
                  0,
                  null
                ]
              ],
              "hl": {
                "1,6": "bad"
              }
            },
            {
              "note": "dp[7] = 1: dp[4] is 1 and 'and' is a word (dp[3] and 'sand' also works). The whole string can be cut.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  1,
                  0,
                  0,
                  1
                ]
              ],
              "hl": {
                "1,7": "ok",
                "1,3": "b",
                "1,4": "b"
              }
            },
            {
              "note": "dp[7] is 1, so 'catsand' can be segmented, as cats + and or cat + sand.",
              "cells": [
                [
                  null,
                  "c",
                  "a",
                  "t",
                  "s",
                  "a",
                  "n",
                  "d"
                ],
                [
                  1,
                  0,
                  0,
                  1,
                  1,
                  0,
                  0,
                  1
                ]
              ],
              "hl": {
                "1,7": "ok"
              },
              "out": "Answer: true"
            }
          ]
        }
      },
      "code": "// Can s be split into words from the dictionary?\nbool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    int n = s.size();\n    vector<char> dp(n + 1, 0);\n    dp[0] = 1;                                   // empty prefix is fine\n    for (int i = 1; i <= n; i++)\n        for (int j = 0; j < i; j++)\n            if (dp[j] && dict.count(s.substr(j, i - j))) {\n                dp[i] = 1;                       // last word is s[j..i)\n                break;\n            }\n    return dp[n];\n}",
      "complexity": "Time O(n^2) cut points times the cost of a substring and hash lookup (about O(n^3) in the worst case). Space O(n) plus the dictionary.",
      "mistakes": [
        "Forgetting dp[0] = true, so no word can ever start at the beginning.",
        "Off by one in substr: the piece from j to i has length i - j.",
        "In Decode Ways, forgetting that '0' alone is invalid and that '06' is not the number 6."
      ],
      "practice": [
        139,
        91,
        647,
        5
      ]
    },
    "7": {
      "name": "State machine",
      "when": "Each day (or step) you are in one of a few named situations, and your choices depend on it: buy and sell stock with a cooldown or a fee or a limit of transactions, or any 'allowed to do X only after Y' rule.",
      "idea": "Draw the situations as boxes and the allowed moves as arrows. For stocks with cooldown: hold (you own a share), sold (you sold today) and rest (you own nothing and may buy tomorrow). Keep the best profit for each state at the end of each day, and compute today's values from yesterday's: you reach hold by staying in hold or buying from rest, you reach sold by selling from hold, and you reach rest by staying in rest or coming from sold (this is the cooldown day). Update all three from the old values, then repeat for the next day.",
      "steps": [
        "List the states and draw the arrows for the allowed moves.",
        "Give each state a value: the best profit so far while in that state. Set the day-0 values.",
        "Each day write the new value of each state from yesterday's states.",
        "Compute all new values from the old ones before overwriting, especially sold.",
        "The answer is the best of the states where you hold nothing (sold and rest)."
      ],
      "example": {
        "problem": "Best Time to Buy and Sell Stock with Cooldown: prices [1, 2, 3, 0, 2]. After selling you must wait one day before buying. Maximum profit? Expected answer: 3.",
        "walk": "The chips show the three state values after each day. Notice that hold stays at -1 while the price rises, then jumps to 1 on day 3 when we buy at price 0 using the profit 1 banked in rest. The final answer is the better of sold and rest, 3.",
        "viz": {
          "kind": "array",
          "cells": [
            1,
            2,
            3,
            0,
            2
          ],
          "frames": [
            {
              "note": "Prices [1, 2, 3, 0, 2]. Three states: hold (own a share), sold (just sold today), rest (own nothing, free to buy). Day 0: hold = -1, sold = 0, rest = 0.",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "0": "a"
              },
              "vars": {
                "hold": -1,
                "sold": 0,
                "rest": 0
              }
            },
            {
              "note": "Day 1, price 2. sold = hold + p = -1+2 = 1. hold = max(-1, rest-p = -2) = -1. rest = max(0, old sold 0) = 0.",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "1": "a"
              },
              "vars": {
                "hold": -1,
                "sold": 1,
                "rest": 0
              }
            },
            {
              "note": "Day 2, price 3. sold = hold + p = -1+3 = 2. hold = max(-1, rest-p = -3) = -1. rest = max(0, old sold 1) = 1.",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "2": "a"
              },
              "vars": {
                "hold": -1,
                "sold": 2,
                "rest": 1
              }
            },
            {
              "note": "Day 3, price 0. sold = hold + p = -1+0 = -1. hold = max(-1, rest-p = 1) = 1. rest = max(1, old sold 2) = 2.",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "3": "a"
              },
              "vars": {
                "hold": 1,
                "sold": -1,
                "rest": 2
              }
            },
            {
              "note": "Day 4, price 2. sold = hold + p = 1+2 = 3. hold = max(1, rest-p = 0) = 1. rest = max(2, old sold -1) = 2.",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "4": "a"
              },
              "vars": {
                "hold": 1,
                "sold": 3,
                "rest": 2
              }
            },
            {
              "note": "Best profit is max(sold, rest) on the last day = max(3, 2) = 3 (buy 1 sell 2, cooldown, buy 0 sell 2).",
              "cells": [
                1,
                2,
                3,
                0,
                2
              ],
              "hl": {
                "4": "ok"
              },
              "vars": {
                "hold": 1,
                "sold": 3,
                "rest": 2
              },
              "out": "Answer: 3"
            }
          ]
        }
      },
      "code": "// Max profit with a one-day cooldown after selling\nint maxProfit(vector<int>& prices) {\n    int hold = -prices[0], sold = 0, rest = 0;\n    for (int i = 1; i < (int)prices.size(); i++) {\n        int prevSold = sold;\n        sold = hold + prices[i];                 // sell what we hold\n        hold = max(hold, rest - prices[i]);      // keep holding, or buy from rest\n        rest = max(rest, prevSold);              // stay resting, or cooldown ends\n    }\n    return max(sold, rest);\n}",
      "complexity": "Time O(n), one update of three values per day. Space O(1), only the three state values are kept.",
      "mistakes": [
        "Overwriting sold before reading its old value for rest. Save prevSold first.",
        "Allowing buy straight from sold, which ignores the cooldown. Buy only from rest.",
        "Returning hold at the end. Holding a share at the end is never better than having sold it."
      ],
      "practice": [
        309,
        198
      ]
    },
    "8": {
      "name": "Interval DP",
      "when": "The answer for a range [l, r] is built from smaller ranges inside it, and you must choose a split point or the last operation. Words: burst, merge, cut, remove from either end, best order.",
      "idea": "Define dp[l][r] as the best result for the range between l and r. The trick is to pick the LAST action in the range, not the first. In Burst Balloons, if balloon k is the last one burst between l and r, then l and r are still its neighbours, so its coins are p[l] * p[k] * p[r]. Before that, the left part (l, k) and right part (k, r) were burst independently, and those are smaller ranges already solved. Try every k and take the max. Fill ranges in order of increasing length so the smaller ones are ready.",
      "steps": [
        "Pad the array with a 1 at both ends. Define dp[l][r] for balloons strictly between l and r.",
        "Ranges with nothing inside (r = l + 1) are 0.",
        "Loop gap from 2 up to n - 1, then l from 0, setting r = l + gap.",
        "Try every k with l < k < r as the LAST balloon: dp[l][k] + p[l]*p[k]*p[r] + dp[k][r]. Keep the max.",
        "Return dp[0][n - 1]."
      ],
      "example": {
        "problem": "Burst Balloons: balloons [3, 1, 5, 8]. Bursting balloon i gives left * i * right coins using its current neighbours (outside the array counts as 1). Find the maximum coins. Expected answer: 167.",
        "walk": "Rows are l and columns are r, labelled with index(value) of the padded array. Cells fill by growing gap. In the detail frames, orange is the cell computed and violet are the two smaller ranges around the best last balloon k. The corner dp[0][5] is the answer.",
        "viz": {
          "kind": "grid",
          "cells": [
            [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null,
              null
            ],
            [
              null,
              null,
              null,
              null,
              null,
              null
            ]
          ],
          "rows": [
            "0(1)",
            "1(3)",
            "2(1)",
            "3(5)",
            "4(8)",
            "5(1)"
          ],
          "cols": [
            "0(1)",
            "1(3)",
            "2(1)",
            "3(5)",
            "4(8)",
            "5(1)"
          ],
          "frames": [
            {
              "note": "dp[l][r] = most coins from bursting every balloon strictly between l and r. Padded array is [1, 3, 1, 5, 8, 1]. Balloons 0 and 5 are fake 1s.",
              "cells": [
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ]
            },
            {
              "note": "Gaps of 2: one balloon between l and r. It is burst last, so dp = p[l]*p[k]*p[r]. E.g. dp[0][2] = 1*3*1 = 3, dp[1][3] = 3*1*5 = 15.",
              "cells": [
                [
                  null,
                  0,
                  3,
                  null,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  0,
                  15,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  0,
                  40,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  0,
                  40
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  0
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,2": "a",
                "1,3": "a",
                "2,4": "a",
                "3,5": "a"
              }
            },
            {
              "note": "Gaps of 3: two balloons inside, try each as the LAST to burst. E.g. dp[0][3] = max(k=1: 0+1*3*5+dp[1][3]=30, k=2: dp[0][2]+1*1*5+0=8) = 30.",
              "cells": [
                [
                  null,
                  0,
                  3,
                  30,
                  null,
                  null
                ],
                [
                  null,
                  null,
                  0,
                  15,
                  135,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  0,
                  40,
                  48
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  0,
                  40
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  0
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,3": "a",
                "1,4": "a",
                "2,5": "a"
              }
            },
            {
              "note": "dp[0][4] = max(k=1: 0+24+135=159; k=2: 3+8+40=51; k=3: 30+40+0=70) = 159.",
              "cells": [
                [
                  null,
                  0,
                  3,
                  30,
                  159,
                  null
                ],
                [
                  null,
                  null,
                  0,
                  15,
                  135,
                  null
                ],
                [
                  null,
                  null,
                  null,
                  0,
                  40,
                  48
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  0,
                  40
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  0
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,4": "a",
                "0,1": "b",
                "1,4": "b"
              },
              "vars": {
                "best last k": 1
              }
            },
            {
              "note": "dp[1][5] = max(k=2: 0+3+48=51; k=3: 15+15+40=70; k=4: 135+24+0=159) = 159.",
              "cells": [
                [
                  null,
                  0,
                  3,
                  30,
                  159,
                  null
                ],
                [
                  null,
                  null,
                  0,
                  15,
                  135,
                  159
                ],
                [
                  null,
                  null,
                  null,
                  0,
                  40,
                  48
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  0,
                  40
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  0
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "1,5": "a",
                "1,4": "b",
                "4,5": "b"
              },
              "vars": {
                "best last k": 4
              }
            },
            {
              "note": "dp[0][5] = max over last balloon k. Best is k=4: dp[0][4] + 1*8*1 + dp[4][5] = 159 + 8 + 0 = 167.",
              "cells": [
                [
                  null,
                  0,
                  3,
                  30,
                  159,
                  167
                ],
                [
                  null,
                  null,
                  0,
                  15,
                  135,
                  159
                ],
                [
                  null,
                  null,
                  null,
                  0,
                  40,
                  48
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  0,
                  40
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  0
                ],
                [
                  null,
                  null,
                  null,
                  null,
                  null,
                  null
                ]
              ],
              "hl": {
                "0,5": "ok",
                "0,4": "b",
                "4,5": "b"
              },
              "vars": {
                "best last k": 4
              },
              "out": "Answer: 167"
            }
          ]
        }
      },
      "code": "// Maximum coins from bursting all balloons\nint maxCoins(vector<int>& nums) {\n    vector<int> p = {1};\n    for (int x : nums) p.push_back(x);\n    p.push_back(1);                              // padded with 1s\n    int n = p.size();\n    vector<vector<int>> dp(n, vector<int>(n, 0));\n    for (int gap = 2; gap < n; gap++)            // size of the range\n        for (int l = 0; l + gap < n; l++) {\n            int r = l + gap;\n            for (int k = l + 1; k < r; k++)      // k is the LAST balloon burst\n                dp[l][r] = max(dp[l][r],\n                    dp[l][k] + p[l] * p[k] * p[r] + dp[k][r]);\n        }\n    return dp[0][n - 1];\n}",
      "complexity": "Time O(n^3): O(n^2) ranges times O(n) split points. Space O(n^2) for the table.",
      "mistakes": [
        "Choosing k as the FIRST balloon to burst. Then the two sides are not independent. Pick the last one.",
        "Forgetting the padding 1s at the ends, so edge balloons have no neighbours.",
        "Filling by l first instead of by increasing range length, which reads cells that are not computed yet."
      ],
      "practice": [
        312,
        647
      ]
    },
    "9": {
      "name": "DP on trees",
      "when": "You choose nodes in a tree with a rule linking a node to its parent or children (do not take two connected nodes), and want the best total. The answer for a node depends on its subtrees.",
      "idea": "Run a post-order DFS: handle both children first, then the node. Because the choice at a node affects its children (if you rob it you cannot rob them), a single number is not enough. Return a pair for each node: the best total if this node IS robbed, and the best total if it is NOT. If robbed, add the node's value plus both children's skipped values. If skipped, each child is free, so add the better of each child's two values. The answer is the max of the root's pair. Each node is visited once.",
      "steps": [
        "Define dfs(node) returning {rob, skip}. A null node returns {0, 0}.",
        "Call dfs on the left and right children first (post-order).",
        "rob = node->val + left.skip + right.skip.",
        "skip = max(left.rob, left.skip) + max(right.rob, right.skip).",
        "Return max(root.rob, root.skip)."
      ],
      "example": {
        "problem": "House Robber III: tree [3, 2, 3, null, 3, null, 1] (level order). A thief cannot rob two directly linked houses. Find the maximum money. Expected answer: 7.",
        "walk": "The tag beside each node reads rob/skip. Leaves are easy. For a parent, rob adds only the children's skip values, while skip takes the better option of each child. Compare node 2 (3/0) under the root: robbing it gives only 2, skipping lets us take its leaf 3 for 3. The root wins with 7 by robbing itself.",
        "viz": {
          "kind": "tree",
          "cells": [
            3,
            2,
            3,
            null,
            3,
            null,
            1
          ],
          "frames": [
            {
              "note": "Each house is a tree node. Rule: do not rob a parent and its child. Every node will report two numbers: best if robbed / best if skipped.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {},
              "vars": {}
            },
            {
              "note": "Leaf 3: rob = 3, skip = 0.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "4": "a"
              },
              "tags": {
                "4": "3/0"
              },
              "ehl": {}
            },
            {
              "note": "Node 2: rob = 2 + children skipped (skip3=0) = 2. skip = max(3,0) = 3.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "1": "a",
                "4": "b"
              },
              "tags": {
                "1": "2/3",
                "4": "3/0"
              },
              "ehl": {
                "1-4": "b"
              }
            },
            {
              "note": "Leaf 1: rob = 1, skip = 0.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "6": "a"
              },
              "tags": {
                "1": "2/3",
                "4": "3/0",
                "6": "1/0"
              },
              "ehl": {}
            },
            {
              "note": "Node 3: rob = 3 + children skipped (skip1=0) = 3. skip = max(1,0) = 1.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "2": "a",
                "6": "b"
              },
              "tags": {
                "1": "2/3",
                "2": "3/1",
                "4": "3/0",
                "6": "1/0"
              },
              "ehl": {
                "2-6": "b"
              }
            },
            {
              "note": "Node 3: rob = 3 + children skipped (skip2=3 + skip3=1) = 7. skip = max(2,3) + max(3,1) = 6.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "0": "a",
                "1": "b",
                "2": "b"
              },
              "tags": {
                "0": "7/6",
                "1": "2/3",
                "2": "3/1",
                "4": "3/0",
                "6": "1/0"
              },
              "ehl": {
                "0-1": "b",
                "0-2": "b"
              }
            },
            {
              "note": "Root answer = max(7, 6) = 7: rob the root (3) and the two leaves 3 and 1.",
              "cells": [
                3,
                2,
                3,
                null,
                3,
                null,
                1
              ],
              "hl": {
                "0": "ok",
                "4": "ok",
                "6": "ok"
              },
              "tags": {
                "0": "7/6",
                "1": "2/3",
                "2": "3/1",
                "4": "3/0",
                "6": "1/0"
              },
              "out": "Answer: 7"
            }
          ]
        }
      },
      "code": "// Returns {best if this node is robbed, best if it is skipped}\npair<int,int> dfs(TreeNode* node) {\n    if (!node) return {0, 0};\n    auto L = dfs(node->left);\n    auto R = dfs(node->right);\n    int rob = node->val + L.second + R.second;                 // children must be skipped\n    int skip = max(L.first, L.second) + max(R.first, R.second); // children are free\n    return {rob, skip};\n}\n\nint rob(TreeNode* root) {\n    auto res = dfs(root);\n    return max(res.first, res.second);\n}",
      "complexity": "Time O(n), each node is visited once. Space O(h) for the recursion stack, where h is the tree height.",
      "mistakes": [
        "Returning one number per node. You lose the information about whether the node was taken.",
        "Using rob = val + max(child values) so a robbed parent may sit next to a robbed child. Use the children's skip values.",
        "Memoizing with a map on top of the pair, which is unnecessary. The pair already removes repeated work."
      ],
      "practice": [
        337,
        198
      ]
    }
  }
};
