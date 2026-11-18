/* ==========================================================================
   Interactive Algorithm Step-by-Step Visualizer
   ========================================================================== */

function mountAlgorithmVisualizer(container, vizKey) {
  if (typeof VIZ === 'undefined' || !VIZ[vizKey]) return;
  const vizData = VIZ[vizKey];
  const frames = vizData.f();
  let stepIndex = 0;
  let playTimer = null;

  const wrapper = document.createElement('div');
  wrapper.className = 'mt-5 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20 p-5 fade-in';

  wrapper.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
        <span class="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Interactive Execution</span>
      </div>
      <span class="step-count font-mono text-xs text-stone-500 dark:text-zinc-400"></span>
    </div>

    <h4 class="text-sm font-semibold mt-1 text-stone-800 dark:text-zinc-200">${esc(vizData.title)}</h4>

    <div class="vcells mt-5 mb-2 overflow-x-auto pb-2">
      ${frames[0].a.map(val => `
        <div class="vcell">
          <b>${val}</b>
          <i>0</i>
          <span class="vptr"></span>
        </div>
      `).join('')}
    </div>

    <div class="vstack min-h-[28px] flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mt-2"></div>

    <div class="vnote min-h-[44px] mt-2 text-sm text-stone-700 dark:text-zinc-300 font-mono bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-violet-100 dark:border-violet-900/40"></div>

    <div class="mt-4 flex items-center gap-2 pt-2 border-t border-violet-200/60 dark:border-violet-900/40">
      <button class="btn-prev rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-stone-50 px-3.5 py-1.5 text-xs font-semibold">◀ Back</button>
      <button class="btn-play rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 text-xs font-semibold transition-colors">▶ Play</button>
      <button class="btn-next rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-stone-50 px-3.5 py-1.5 text-xs font-semibold">Next ▶</button>
      <button class="btn-reset ml-auto text-xs text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300">Reset</button>
    </div>
  `;

  const cells = [...wrapper.querySelectorAll('.vcell')];
  const stepCountEl = wrapper.querySelector('.step-count');
  const noteEl = wrapper.querySelector('.vnote');
  const stackEl = wrapper.querySelector('.vstack');
  const playBtn = wrapper.querySelector('.btn-play');

  function renderStep() {
    const fr = frames[stepIndex];
    cells.forEach((cell, idx) => {
      cell.classList.toggle('von', !!(fr.hi && fr.hi.includes(idx)));
      cell.classList.toggle('vrng', !!(fr.range && idx >= fr.range[0] && idx <= fr.range[1]));
      cell.querySelector('i').textContent = idx;
      const pointers = Object.keys(fr.p || {}).filter(name => fr.p[name] === idx);
      cell.querySelector('.vptr').textContent = pointers.join(',');
    });

    noteEl.textContent = fr.note || '';
    if (fr.stack) {
      stackEl.innerHTML = `Stack: ${
        fr.stack.length
          ? fr.stack.map(v => `<span class="vchip">${v}</span>`).join('')
          : '<span class="italic text-stone-400">empty</span>'
      }`;
    } else {
      stackEl.innerHTML = '';
    }

    stepCountEl.textContent = `Step ${stepIndex + 1} of ${frames.length}`;
  }

  function stopAutoplay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
      playBtn.textContent = '▶ Play';
    }
  }

  wrapper.querySelector('.btn-prev').onclick = () => {
    stopAutoplay();
    stepIndex = Math.max(0, stepIndex - 1);
    renderStep();
  };

  wrapper.querySelector('.btn-next').onclick = () => {
    stopAutoplay();
    stepIndex = Math.min(frames.length - 1, stepIndex + 1);
    renderStep();
  };

  wrapper.querySelector('.btn-reset').onclick = () => {
    stopAutoplay();
    stepIndex = 0;
    renderStep();
  };

  playBtn.onclick = () => {
    if (playTimer) {
      stopAutoplay();
      return;
    }
    if (stepIndex >= frames.length - 1) stepIndex = 0;
    playBtn.textContent = '❚❚ Pause';
    renderStep();
    playTimer = setInterval(() => {
      if (stepIndex >= frames.length - 1) {
        stopAutoplay();
        return;
      }
      stepIndex++;
      renderStep();
    }, 1200);
  };

  renderStep();
  container.appendChild(wrapper);
}
