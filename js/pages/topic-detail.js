/* ==========================================================================
   Page: Topic Detail - Patterns Sidebar with Popup Modals & Main Questions
   ========================================================================== */

let activePatternModal = null;
let topicBannerExpanded = false;

const topicFilter = {
  diff: { E: true, M: true, H: true },
  search: '',
  hideSolved: false
};

function highlightCpp(code) {
  if (!code) return '';
  const re = /(\/\/[^\n]*)|\b(for|while|if|else|return|auto|const|break|continue|void|true|false|nullptr)\b|\b(int|long|bool|char|string|vector|unordered_map|unordered_set|queue|stack|deque|list|pair|ListNode|TreeNode|Node|function)\b|\b(\d+)\b/g;
  let out = '', last = 0;
  code.replace(re, (match, comm, kw, type, num, offset) => {
    out += esc(code.slice(last, offset));
    if (comm) {
      out += `<span class="text-stone-400 dark:text-zinc-500 italic">${esc(match)}</span>`;
    } else if (kw) {
      out += `<span class="text-orange-500 dark:text-orange-400 font-semibold">${esc(match)}</span>`;
    } else if (type) {
      out += `<span class="text-sky-500 dark:text-sky-400 font-semibold">${esc(match)}</span>`;
    } else if (num) {
      out += `<span class="text-amber-500 dark:text-amber-300 font-semibold">${esc(match)}</span>`;
    }
    last = offset + match.length;
    return match;
  });
  return out + esc(code.slice(last));
}

/* --- Pattern Details Popup Modal --- */
function openPatternModal(topicId, patternIndex) {
  closePatternModal();
  const t = TOPICS.find(x => x.id === topicId);
  if (!t || !t.patterns[patternIndex]) return;

  const p = t.patterns[patternIndex];
  const key = `${t.id}:${patternIndex}`;
  const detList = (typeof DET !== 'undefined' && DET[t.id]) || [];
  const det = detList[patternIndex];
  const deep = (typeof X !== 'undefined' && X[key]) || null;
  const why = (typeof Y !== 'undefined' && Y[key]) || null;
  const code = (why && why[2]) || (deep && deep[3]) || '';
  const hasViz = typeof VIZ !== 'undefined' && !!VIZ[key];

  // Match related questions for this pattern
  const pWords = (p[0] || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  let relatedQuestions = t.q.concat(t.cp).filter(q => {
    const tag = (q[3] || '').toLowerCase();
    return pWords.some(w => tag.includes(w));
  });
  if (!relatedQuestions.length) {
    relatedQuestions = t.q.slice(0, 3);
  }

  activePatternModal = document.createElement('div');
  activePatternModal.className = 'fixed inset-0 z-[95] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4';

  activePatternModal.innerHTML = `
    <div class="dsa-card w-full max-w-3xl max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-5 fade-in shadow-2xl relative bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700">
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-zinc-800">
        <div class="flex items-start gap-3">
          <span class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-mono text-sm font-bold grid place-items-center shrink-0 mt-0.5">
            ${pad2(patternIndex + 1)}
          </span>
          <div>
            <div class="text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold">
              Topic ${pad2(t.id)}: ${esc(t.name)}
            </div>
            <h3 class="text-xl font-bold text-stone-900 dark:text-zinc-100 mt-0.5">${esc(p[0])}</h3>
            <p class="text-xs text-stone-500 dark:text-zinc-400 mt-1">${esc(p[1])}</p>
          </div>
        </div>
        <button id="closePatModalBtn" class="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center text-lg">✕</button>
      </div>

      <!-- Intuition -->
      ${det ? `
        <div class="space-y-3 text-sm">
          <div class="p-4 rounded-xl bg-stone-50 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700/80">
            <div class="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <span>💡</span> Core Intuition & Logic
            </div>
            <p class="mt-2 text-stone-800 dark:text-zinc-100 leading-relaxed font-sans text-sm">${mdCode(det[0])}</p>
          </div>

          ${det[1] ? `
            <div class="p-3.5 rounded-xl bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80">
              <div class="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">Example Walkthrough</div>
              <div class="mt-2 flex flex-wrap gap-2 text-xs font-mono">
                ${det[1].split('|').map((step, sIdx) => `
                  <span class="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200">
                    <span class="text-orange-500 font-bold">${sIdx + 1}.</span> ${esc(step)}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Traps & Complexity -->
      ${deep ? `
        <div class="grid sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-stone-900 dark:text-rose-100">
            <div class="font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">⚠️ Common Pitfall</div>
            <p class="mt-1 leading-relaxed text-stone-800 dark:text-rose-100">${mdCode(deep[2])}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700/80 text-stone-800 dark:text-zinc-200">
            <div class="font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">Complexity & Use Case</div>
            <p class="mt-1 leading-relaxed"><strong class="text-stone-900 dark:text-white">Time / Space:</strong> ${esc(deep[1])}</p>
            <p class="mt-0.5 leading-relaxed"><strong class="text-stone-900 dark:text-white">Use when:</strong> ${esc(deep[0])}</p>
          </div>
        </div>
      ` : ''}

      <!-- Step-by-Step Algorithm -->
      ${why && why[1] ? `
        <div>
          <div class="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">Algorithm Steps</div>
          <ol class="space-y-1.5 text-xs text-stone-800 dark:text-zinc-200">
            ${why[1].split('|').map((st, i) => `
              <li class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-stone-200 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 font-mono text-[10px] grid place-items-center mt-0.5 shrink-0 font-bold">${i + 1}</span>
                <span class="leading-relaxed">${mdCode(st)}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      ` : ''}

      <!-- Interactive Execution Visualizer -->
      ${hasViz ? `
        <div class="pt-2">
          <div class="viz-modal-mount" data-viz-key="${key}"></div>
        </div>
      ` : ''}

      <!-- Syntax-Highlighted C++ Code -->
      ${code ? `
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <div class="text-[11px] font-bold uppercase tracking-wider text-stone-400">Reference C++ Implementation</div>
            <button id="modalCopyCodeBtn" class="px-2.5 py-1 rounded-md border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 transition-colors">
              📋 Copy Code
            </button>
          </div>
          <pre class="code-pre text-xs overflow-x-auto"><code>${highlightCpp(code)}</code></pre>
        </div>
      ` : ''}

      <!-- Related Questions Section (Bottom of Modal) -->
      ${relatedQuestions.length ? `
        <div class="pt-4 border-t border-stone-100 dark:border-zinc-800 space-y-3">
          <div class="flex items-center justify-between">
            <div class="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">Related Questions (${relatedQuestions.length})</div>
            <span class="text-[11px] text-stone-400">Solve in ${esc(t.name)}</span>
          </div>
          <div class="space-y-2">
            ${relatedQuestions.map(rq => {
              const solved = isSolved(rq);
              const [lvlName, lvlClasses] = LEVEL[rq[2]];
              return `
                <div class="p-3 rounded-xl border border-stone-200 dark:border-zinc-700/80 bg-stone-50/70 dark:bg-zinc-800/60 hover:bg-stone-100/80 dark:hover:bg-zinc-800/90 transition-colors flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      solved ? 'bg-emerald-500 text-white' : 'border border-stone-300 dark:border-zinc-600 text-transparent'
                    }">✓</span>
                    <span class="font-mono text-xs text-stone-400 dark:text-zinc-400 shrink-0">#${rq[0]}</span>
                    <button class="modal-prob-link font-semibold text-xs text-stone-800 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-left truncate cursor-pointer transition-colors" data-num="${rq[0]}" data-title="${esc(rq[1])}">
                      ${esc(rq[1])}
                    </button>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${lvlClasses} font-mono font-bold">${lvlName}</span>
                    <button class="modal-solve-btn px-2.5 py-1 rounded-lg ${
                      solved ? 'border border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700' : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                    } text-[11px] font-bold transition-all cursor-pointer" data-num="${rq[0]}" data-title="${esc(rq[1])}">
                      ${solved ? 'Review' : 'Solve'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Close handlers
  activePatternModal.onclick = e => {
    if (e.target === activePatternModal) closePatternModal();
  };
  activePatternModal.querySelector('#closePatModalBtn').onclick = closePatternModal;

  const copyBtn = activePatternModal.querySelector('#modalCopyCodeBtn');
  if (copyBtn && code) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy Code'; }, 1500);
      } catch (e) {
        showToast('Clipboard copy failed', true);
      }
    };
  }

  // Related problem click handlers inside modal
  activePatternModal.querySelectorAll('.modal-prob-link, .modal-solve-btn').forEach(btn => {
    btn.onclick = () => {
      openProblem(btn.dataset.num, btn.dataset.title);
    };
  });

  document.body.appendChild(activePatternModal);

  // Mount visualizer if available
  if (hasViz) {
    const slot = activePatternModal.querySelector('.viz-modal-mount');
    if (slot && typeof mountAlgorithmVisualizer === 'function') {
      mountAlgorithmVisualizer(slot, key);
    }
  }
}

function closePatternModal() {
  if (activePatternModal) {
    activePatternModal.remove();
    activePatternModal = null;
  }
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activePatternModal) {
    closePatternModal();
  }
});

/* --- Topic Detail Page Render --- */
function renderTopicDetailPage(topicId) {
  const topicIdx = TOPICS.findIndex(t => t.id === topicId);
  if (topicIdx < 0) return renderTopicsPage();

  const t = TOPICS[topicIdx];
  const s = topicStats(t);
  const prevTopic = TOPICS[topicIdx - 1];
  const nextTopic = TOPICS[topicIdx + 1];

  const rawQuestions = t.q;
  const filteredQuestions = rawQuestions.filter(q => {
    if (!topicFilter.diff[q[2]]) return false;
    if (topicFilter.hideSolved && isSolved(q)) return false;
    if (topicFilter.search) {
      const text = `#${q[0]} ${q[1]} ${q[3]}`.toLowerCase();
      if (!text.includes(topicFilter.search.toLowerCase())) return false;
    }
    return true;
  });

  return `
    <div class="fade-in max-w-7xl mx-auto space-y-6">
      <!-- Topic Header Banner: Expandable & Collapsible (Collapsed by default) -->
      <div class="dsa-card p-3.5 sm:p-4 transition-all">
        <button id="topicBannerToggleBtn" class="w-full flex items-center justify-between gap-3 text-left cursor-pointer group" title="Click to expand/collapse topic details">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold grid place-items-center shrink-0">
              ${pad2(t.id)}
            </span>
            <div class="min-w-0 flex items-center gap-2 flex-wrap">
              <h1 class="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-1.5 truncate">
                <span>Topic ${pad2(t.id)}: ${esc(t.name)}</span>
                ${s.complete ? `<span class="text-emerald-500 text-sm" title="Topic Mastered">✓</span>` : ''}
              </h1>
              <span class="text-xs text-stone-400 font-normal hidden sm:inline">(${t.weeks})</span>
            </div>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <span class="px-3 py-1 rounded-xl bg-stone-100 dark:bg-zinc-800 text-xs font-mono font-bold text-stone-800 dark:text-zinc-200">
              ${s.done} / ${s.total} Solved (${s.pct}%)
            </span>
            <span id="topicBannerChevron" class="w-7 h-7 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center text-stone-500 transition-transform duration-200 ${topicBannerExpanded ? 'rotate-180' : ''}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </button>

        <!-- Collapsible Content (Hidden by default, expands to show strategy) -->
        <div id="topicBannerBody" class="${topicBannerExpanded ? '' : 'hidden'} mt-3.5 pt-3 border-t border-stone-100 dark:border-zinc-800 fade-in">
          <p class="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed max-w-3xl font-sans">
            ${esc(t.intro)}
          </p>
          <div class="mt-2 text-[11px] font-mono text-stone-400">
            Recommended pace: <span class="text-stone-700 dark:text-zinc-300 font-semibold">${t.weeks}</span>
          </div>
        </div>
      </div>

      <!-- Main Layout: Patterns Sidebar (Left) + Questions Content (Main) -->
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT SIDE: Pattern Options List (No Scrollbar) -->
        <aside class="lg:col-span-4 dsa-card p-5 space-y-3 sticky top-20">
          <div class="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
            <h2 class="font-bold text-sm text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>💡</span> Patterns to Learn
            </h2>
            <span class="text-[11px] font-mono text-stone-400">${t.patterns.length} options</span>
          </div>
          <p class="text-xs text-stone-400 leading-snug">Click any pattern to view its logic, walkthrough, C++ template, and visualizer:</p>

          <div class="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto no-scrollbar">
            ${t.patterns.map((p, idx) => `
              <button class="pattern-option-btn w-full text-left p-3 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 bg-white dark:bg-zinc-900 hover:bg-orange-50/40 dark:hover:bg-zinc-800/80 transition-all flex items-start gap-2.5 group cursor-pointer" data-topic-id="${t.id}" data-pattern-idx="${idx}">
                <span class="w-5 h-5 rounded-md bg-stone-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950 text-stone-600 dark:text-zinc-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 font-mono text-[11px] font-bold grid place-items-center shrink-0 mt-0.5">
                  ${idx + 1}
                </span>
                <div class="min-w-0 flex-1">
                  <div class="font-semibold text-xs text-stone-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                    ${esc(p[0])}
                  </div>
                  <div class="text-[11px] text-stone-400 dark:text-zinc-400 truncate mt-0.5">
                    ${esc(p[1])}
                  </div>
                </div>
              </button>
            `).join('')}
          </div>
        </aside>

        <!-- MAIN CONTENT: Questions and Checkpoints -->
        <main class="lg:col-span-8 space-y-6">
          <!-- Filter Toolbar -->
          <div class="dsa-card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <!-- Search -->
            <div class="relative w-full sm:w-60">
              <span class="absolute left-3 top-2.5 text-stone-400">🔍</span>
              <input id="probSearchInput" value="${esc(topicFilter.search)}" placeholder="Filter questions..."
                class="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-orange-500 text-stone-900 dark:text-zinc-100">
            </div>

            <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              <!-- Difficulty -->
              <div class="inline-flex rounded-lg border border-stone-200 dark:border-zinc-700 p-0.5 bg-stone-50 dark:bg-zinc-800">
                ${[['E', 'Easy'], ['M', 'Medium'], ['H', 'Hard']].map(([k, name]) => `
                  <button data-filter-diff="${k}" class="px-2.5 py-1 rounded-md font-medium transition-all ${
                    topicFilter.diff[k] ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-xs' : 'text-stone-400 opacity-60'
                  }">${name}</button>
                `).join('')}
              </div>

              <!-- Unsolved Only -->
              <button id="filterHideSolvedBtn" class="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 font-medium ${
                topicFilter.hideSolved ? 'bg-stone-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400' : ''
              }">
                ${topicFilter.hideSolved ? 'Unsolved Only' : 'All Problems'}
              </button>
            </div>
          </div>

          <!-- Questions Table -->
          <div class="dsa-card overflow-hidden">
            <div class="px-5 py-3.5 bg-stone-50 dark:bg-zinc-900 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span class="font-bold uppercase tracking-wider text-stone-500">Core Curated Questions</span>
              <span class="font-mono text-stone-400">${s.reqDone} / ${s.req} non-hard solved</span>
            </div>

            <ul class="divide-y divide-stone-100 dark:divide-zinc-800">
              ${filteredQuestions.length ? filteredQuestions.map(q => {
                const solved = isSolved(q);
                const ts = solvedTs(q[1]);
                const [lvlName, lvlClasses] = LEVEL[q[2]];

                return `
                  <li data-problem-num="${q[0]}" class="p-4 transition-colors hover:bg-stone-100/70 dark:hover:bg-zinc-800/60 flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                      <!-- Solved Checkmark -->
                      <span class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        solved ? 'bg-emerald-500 text-white' : 'border-2 border-stone-300 dark:border-zinc-700 text-transparent'
                      }">
                        ✓
                      </span>

                      <span class="font-mono text-xs text-stone-400 w-11 shrink-0">#${q[0]}</span>

                      <!-- Title & Details -->
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <button class="prob-open-link font-semibold text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-left transition-colors" data-num="${q[0]}" data-title="${esc(q[1])}">
                            ${esc(q[1])}
                          </button>
                        </div>
                        <div class="mt-1 flex items-center gap-2 text-xs text-stone-400 flex-wrap">
                          <button class="prob-pattern-tag px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400" data-topic-id="${t.id}" data-tag="${esc(q[3])}">
                            🏷️ ${esc(q[3])}
                          </button>
                          ${solved ? `<span class="text-emerald-600 dark:text-emerald-400 font-medium">solved</span>` : ''}
                        </div>
                      </div>
                    </div>

                    <!-- Right Actions: Difficulty Level (Replaced Note) + Clean Solve Button (No Arrow) -->
                    <div class="flex items-center gap-2.5 shrink-0">
                      <span class="px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${lvlClasses}">
                        ${lvlName}
                      </span>

                      <button data-solve-num="${q[0]}" data-solve-title="${esc(q[1])}" class="prob-solve-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        solved
                          ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                          : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                      }">
                        ${solved ? 'Review' : 'Solve'}
                      </button>
                    </div>
                  </li>
                `;
              }).join('') : `
                <li class="p-6 text-center text-stone-400 text-xs">No questions match your filter.</li>
              `}
            </ul>
          </div>

          <!-- Checkpoints Section -->
          <div class="dsa-card overflow-hidden border-violet-200 dark:border-violet-900/40">
            <div class="px-5 py-4 bg-violet-50/60 dark:bg-violet-950/30 border-b border-violet-100 dark:border-violet-900/40 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 class="font-bold text-sm text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>🎯 Checkpoint Challenge</span>
                  <span class="text-xs font-normal text-stone-500">(Solve 4 of 5 to master topic)</span>
                </h3>
              </div>
              <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-full ${
                s.cpDone >= 4 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-200 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
              }">
                ${s.cpDone} / 5 Solved
              </span>
            </div>

            <ul class="divide-y divide-stone-100 dark:divide-zinc-800">
              ${t.cp.map((q, idx) => {
                const solved = isSolved(q);
                const [lvlName, lvlClasses] = LEVEL[q[2]];
                return `
                  <li class="p-4 flex items-center justify-between gap-4 hover:bg-stone-100/70 dark:hover:bg-zinc-800/60 transition-colors">
                    <div class="flex items-center gap-3.5 min-w-0">
                      <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        solved ? 'bg-emerald-500 text-white' : 'border-2 border-stone-300 dark:border-zinc-700 text-stone-400'
                      }">
                        ${solved ? '✓' : idx + 1}
                      </span>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <button class="prob-open-link font-semibold text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors" data-num="${q[0]}" data-title="${esc(q[1])}">
                            ${esc(q[1])}
                          </button>
                        </div>
                        <div class="text-xs text-stone-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>#${q[0]} · ${esc(q[3])}</span>
                          ${solved ? `<span class="text-emerald-600 dark:text-emerald-400 font-medium">solved</span>` : ''}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2.5 shrink-0">
                      <span class="px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${lvlClasses}">
                        ${lvlName}
                      </span>

                      <button data-solve-num="${q[0]}" data-solve-title="${esc(q[1])}" class="prob-solve-btn px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        solved
                          ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }">
                        ${solved ? 'Review' : 'Solve'}
                      </button>
                    </div>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </main>
      </div>

      <!-- Bottom Navigation: Topic Grid & Prev/Next Topic -->
      <div class="pt-4 pb-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between text-xs sm:text-sm text-stone-500">
        <a href="#/topics" class="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-all shadow-xs">
          <span>←</span> Topic Grid
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          ${prevTopic ? `
            <a href="#/topic/${prevTopic.id}" class="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition-all shadow-xs">
              ← Prev: ${esc(prevTopic.name)}
            </a>
          ` : ''}
          ${nextTopic ? `
            <a href="#/topic/${nextTopic.id}" class="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition-all shadow-xs">
              Next: ${esc(nextTopic.name)} →
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function bindTopicDetailEvents(topicId) {
  // Topic Header Banner Expand/Collapse Toggle
  const bannerToggle = document.getElementById('topicBannerToggleBtn');
  const bannerBody = document.getElementById('topicBannerBody');
  const chevron = document.getElementById('topicBannerChevron');
  if (bannerToggle && bannerBody && chevron) {
    bannerToggle.onclick = () => {
      topicBannerExpanded = !topicBannerExpanded;
      if (topicBannerExpanded) {
        bannerBody.classList.remove('hidden');
        chevron.classList.add('rotate-180');
      } else {
        bannerBody.classList.add('hidden');
        chevron.classList.remove('rotate-180');
      }
    };
  }

  // Pattern options button -> opens modal
  document.querySelectorAll('.pattern-option-btn').forEach(btn => {
    btn.onclick = () => {
      const pIdx = parseInt(btn.dataset.patternIdx, 10);
      openPatternModal(topicId, pIdx);
    };
  });

  // Clicking pattern tag in question row -> opens modal
  document.querySelectorAll('.prob-pattern-tag').forEach(btn => {
    btn.onclick = () => {
      const tag = btn.dataset.tag.toLowerCase();
      const t = TOPICS.find(x => x.id === topicId);
      if (!t) return;
      const idx = t.patterns.findIndex(p => p[0].toLowerCase().includes(tag) || tag.includes(p[0].toLowerCase().slice(0, 5)));
      openPatternModal(topicId, idx >= 0 ? idx : 0);
    };
  });

  // Solve / Review Links
  document.querySelectorAll('.prob-open-link, .prob-solve-btn').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      const num = btn.dataset.num || btn.dataset.solveNum;
      const title = btn.dataset.title || btn.dataset.solveTitle;
      openProblem(num, title);
    };
  });

  // Filter Toolbar in Questions View
  const sInput = document.getElementById('probSearchInput');
  if (sInput) {
    sInput.oninput = e => {
      topicFilter.search = e.target.value;
      const main = document.querySelector('main.lg\\:col-span-8');
      if (main) {
        renderTopicDetailPage(topicId);
        main.innerHTML = document.querySelector('main.lg\\:col-span-8')?.innerHTML || '';
        bindTopicDetailEvents(topicId);
      }
    };
  }

  document.querySelectorAll('[data-filter-diff]').forEach(b => {
    b.onclick = () => {
      const k = b.dataset.filterDiff;
      topicFilter.diff[k] = !topicFilter.diff[k];
      notifyStateChange();
    };
  });

  const hideBtn = document.getElementById('filterHideSolvedBtn');
  if (hideBtn) {
    hideBtn.onclick = () => {
      topicFilter.hideSolved = !topicFilter.hideSolved;
      notifyStateChange();
    };
  }
}
