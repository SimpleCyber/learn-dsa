# DSA Patterns

Learn Data Structures & Algorithms through **patterns**, not by memorizing hundreds of solutions.

**[Live Demo](https://learn-dsa-silk.vercel.app/)** · [Roadmap](#roadmap) · [Getting Started](#getting-started) · [Contributing](#contributing)

[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20Tailwind%20%7C%20Vanilla%20JS-orange)
![No build](https://img.shields.io/badge/setup-no%20build%20step-brightgreen)

![Topics overview](images/topics.png)

## Why

Most interview problems are variations of a small set of patterns: Two Pointers, Sliding Window, Monotonic Stack, BFS, Interval Scheduling, DP, and so on. Learn the idea and the template once, and the next 20 problems in that category feel the same.

## Features

- **12 topics, 20 curated problems each** (240 total)
- **Pattern cards** with intuition, a step-by-step walkthrough, common pitfalls, and a copyable C++ template
- **Interactive visualizers** to see algorithms run step by step
- **LeetCode sync** that marks a problem solved only when a submission is *Accepted*
- **Command palette** (`Ctrl/Cmd + K`) to search topics and problems
- **Light and dark mode**, difficulty filters, and an "Unsolved only" toggle
- **No build step**, works offline

![Topic detail](images/dashboard.png)

## Roadmap

| # | Topic | Key patterns |
|:-:|---|---|
| 01 | Arrays & Strings | Prefix sums, Kadane's, read/write pointer, Dutch National Flag |
| 02 | Hashing | Two-pass map, frequency signatures, HashSet, prefix mod buckets |
| 03 | Two Pointers & Sliding Window | Opposite/same direction, fixed & dynamic windows, `atMost(K)` |
| 04 | Stacks & Queues | Matching pairs, monotonic stack, Min-Stack, sliding window deque |
| 05 | Linked Lists | Dummy head, fast & slow pointers, reversal, merge, LRU Cache |
| 06 | Binary Search | Lower/upper bound, rotated array, search on answer, peak finding |
| 07 | Recursion & Backtracking | Subsets, permutations, combinations, grid DFS, N-Queens |
| 08 | Trees & BST | Traversals, root-to-leaf paths, LCA, BST validation |
| 09 | Heap & Priority Queue | Top-K, K-way merge, running median |
| 10 | Greedy & Intervals | Interval scheduling, Jump Game, gas station |
| 11 | Graphs | Components, grid DFS, multi-source BFS, topological sort, DSU |
| 12 | Dynamic Programming | 1D, LIS, 2D grid, state machine, tree DP |

## Getting Started

```bash
git clone https://github.com/SimpleCyber/learn-dsa.git
cd learn-dsa
```

Then open `dsa.html` in your browser. Or serve it locally:

```bash
python -m http.server 8000
# visit http://localhost:8000/dsa.html
```

## LeetCode Sync

1. Click **Connect LC** in the navbar.
2. Enter your LeetCode username.
3. Click **Sync Solves**.

Your accepted submissions are matched against the roadmap and marked as solved.

## Shortcuts

| Key | Action |
|---|---|
| `Ctrl/Cmd + K` | Open command palette |
| `Esc` | Close modal or popover |

## Project Structure

```text
learn-dsa/
├── dsa.html
├── css/styles.css
├── images/
└── js/
    ├── app.js                 # Router & bootstrap
    ├── state.js               # State, LocalStorage, LeetCode sync
    ├── components/            # nav, palette, toast, visualizer UI
    ├── data/
    │   ├── topics.js          # Topics & problems
    │   ├── patterns-data.js   # Intuition, walkthroughs, C++ templates
    │   └── visualizers.js     # Visualizer engines
    └── pages/                 # topics, topic-detail, settings
```

## Contributing

Contributions are welcome.

- Patterns and C++ templates: `js/data/patterns-data.js`
- Visualizers: `js/data/visualizers.js`
- Problem lists: `js/data/topics.js`

Fork the repo, make your change, and open a pull request. Bugs and ideas go in [Issues](https://github.com/SimpleCyber/learn-dsa/issues).

## License

[MIT](LICENSE)
