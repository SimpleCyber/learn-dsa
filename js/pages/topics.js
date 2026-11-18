/* ==========================================================================
   Page: Topics Grid - Pure Grid Format
   ========================================================================== */

function renderTopicsPage() {
  const o = overall();

  return `
    <div class="fade-in max-w-7xl mx-auto space-y-6">
      <!-- Minimal Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-zinc-800">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            Topics
          </h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-1">
            Twelve core DSA topics in learning order.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-zinc-800 text-xs font-mono font-bold text-stone-700 dark:text-zinc-300">
            ${o.topicsDone} / ${TOPICS.length} Complete · ${o.done} / ${o.total} Solved
          </span>
        </div>
      </div>

      <!-- 12 Topic Cards Pure Grid -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${TOPICS.map((t, i) => {
          const s = o.stats[i];
          const isNext = o.nextTopic && o.nextTopic.id === t.id;

          return `
            <a href="#/topic/${t.id}" class="dsa-card p-6 flex flex-col justify-between transition-all hover:border-orange-500 hover:-translate-y-0.5 hover:shadow-md ${
              s.complete
                ? 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/10'
                : isNext
                ? 'border-orange-400 dark:border-orange-500/60 shadow-xs'
                : ''
            }">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-mono text-2xl font-black ${
                    s.complete ? 'text-emerald-500' : isNext ? 'text-orange-500' : 'text-stone-300 dark:text-zinc-700'
                  }">
                    ${pad2(t.id)}
                  </span>
                  ${s.complete
                    ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">✓ Completed</span>`
                    : isNext
                    ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white">Up Next</span>`
                    : `<span class="font-mono text-xs text-stone-400">${s.pct}%</span>`
                  }
                </div>

                <h2 class="mt-3 text-lg font-bold leading-snug text-stone-900 dark:text-zinc-100">
                  ${t.name}
                </h2>
                <p class="text-xs text-stone-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  ${esc(t.intro)}
                </p>

                <div class="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                  <div class="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                    <span>${t.q.length} Questions + 5 Checkpoint</span>
                    <span>${t.weeks}</span>
                  </div>
                  <div class="w-full bg-stone-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500 transition-all duration-300" style="width: ${s.pct}%"></div>
                  </div>
                </div>
              </div>

              <!-- Open Link -->
              <div class="mt-5 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
                <span class="font-mono text-stone-500">${s.done}/${s.total} Solved</span>
                <span class="text-orange-600 dark:text-orange-400 font-bold">
                  Open Topic
                </span>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
