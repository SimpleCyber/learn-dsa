/* ==========================================================================
   Command Palette & Search
   ========================================================================== */

let paletteModal = null;
let paletteSelectedIndex = 0;
let paletteHits = [];
let searchIndex = null;

function buildSearchIndex() {
  if (searchIndex || typeof TOPICS === 'undefined') return;
  searchIndex = [];
  TOPICS.forEach(t => {
    searchIndex.push({
      label: t.name,
      sub: `Topic ${pad2(t.id)} · Roadmap Overview`,
      type: 'topic',
      topicId: t.id
    });
    t.patterns.forEach((p, i) => {
      searchIndex.push({
        label: p[0],
        sub: `Pattern in Topic ${pad2(t.id)}: ${t.name}`,
        type: 'pattern',
        topicId: t.id,
        patternIndex: i
      });
    });
    t.q.concat(t.cp).forEach(q => {
      searchIndex.push({
        label: q[1],
        sub: `#${q[0]} · ${LEVEL[q[2]][0]} · ${t.name}`,
        type: 'problem',
        topicId: t.id,
        title: q[1],
        num: q[0]
      });
    });
  });
}

function openPalette() {
  buildSearchIndex();
  if (paletteModal) return;

  paletteModal = document.createElement('div');
  paletteModal.className = 'fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4';
  
  paletteModal.innerHTML = `
    <div class="dsa-card w-full max-w-xl shadow-2xl overflow-hidden fade-in border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <div class="flex items-center px-4 border-b border-stone-200 dark:border-zinc-800">
        <span class="text-stone-400 text-lg mr-2">🔍</span>
        <input id="paletteInput" placeholder="Search topics, patterns, problem names or numbers..." class="w-full bg-transparent py-4 text-sm sm:text-base outline-none placeholder:text-stone-400 text-stone-900 dark:text-zinc-100">
        <kbd class="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-stone-400 border border-stone-200 dark:border-zinc-700 rounded">ESC</kbd>
      </div>
      <ul id="paletteList" class="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-zinc-800 text-sm"></ul>
      <div class="px-4 py-2 bg-stone-50 dark:bg-zinc-950/60 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs text-stone-400">
        <span>Use <kbd class="px-1 border rounded">↑</kbd> <kbd class="px-1 border rounded">↓</kbd> to navigate</span>
        <span>Press <kbd class="px-1 border rounded">ENTER</kbd> to jump</span>
      </div>
    </div>
  `;

  paletteModal.onclick = e => {
    if (e.target === paletteModal) closePalette();
  };

  document.body.appendChild(paletteModal);

  const inp = paletteModal.querySelector('#paletteInput');
  inp.focus();
  paletteSelectedIndex = 0;
  drawPaletteResults();

  inp.oninput = () => {
    paletteSelectedIndex = 0;
    drawPaletteResults();
  };
}

function drawPaletteResults() {
  if (!paletteModal || !searchIndex) return;
  const val = paletteModal.querySelector('#paletteInput').value.toLowerCase().trim();
  const words = val.split(/\s+/).filter(Boolean);

  if (words.length) {
    paletteHits = searchIndex.filter(item => {
      const text = `${item.label} ${item.sub}`.toLowerCase();
      return words.every(w => text.includes(w));
    }).slice(0, 15);
  } else {
    // Default show topics
    paletteHits = searchIndex.filter(x => x.type === 'topic').slice(0, 12);
  }

  paletteSelectedIndex = Math.min(paletteSelectedIndex, Math.max(0, paletteHits.length - 1));

  const list = paletteModal.querySelector('#paletteList');
  if (!paletteHits.length) {
    list.innerHTML = `<li class="px-4 py-8 text-center text-stone-400 text-sm">No matching topics, patterns, or problems.</li>`;
    return;
  }

  list.innerHTML = paletteHits.map((h, i) => {
    const isSelected = i === paletteSelectedIndex;
    const badgeColor = h.type === 'topic' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
      : h.type === 'pattern' ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    return `
      <li data-idx="${i}" class="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
        isSelected ? 'bg-orange-50 dark:bg-orange-500/10' : 'hover:bg-stone-50 dark:hover:bg-zinc-800/40'
      }">
        <div class="min-w-0">
          <div class="font-medium truncate text-stone-800 dark:text-zinc-200">${esc(h.label)}</div>
          <div class="text-xs text-stone-500 dark:text-zinc-400 truncate mt-0.5">${esc(h.sub)}</div>
        </div>
        <span class="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${badgeColor}">${h.type}</span>
      </li>
    `;
  }).join('');

  list.querySelectorAll('li[data-idx]').forEach(li => {
    li.onclick = () => selectPaletteHit(paletteHits[+li.dataset.idx]);
  });
}

function selectPaletteHit(hit) {
  if (!hit) return;
  closePalette();
  if (hit.type === 'topic') {
    window.location.hash = `#/topic/${hit.topicId}`;
  } else if (hit.type === 'pattern') {
    window.location.hash = `#/topic/${hit.topicId}/learn`;
    setTimeout(() => {
      const card = document.querySelector(`[data-pattern-index="${hit.patternIndex}"]`);
      if (card) {
        card.open = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  } else if (hit.type === 'problem') {
    window.location.hash = `#/topic/${hit.topicId}/solve`;
    setTimeout(() => {
      const row = document.querySelector(`[data-problem-num="${hit.num}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('flashrow');
      }
    }, 150);
  }
}

function closePalette() {
  if (paletteModal) {
    paletteModal.remove();
    paletteModal = null;
  }
}

// Global Key Listeners for search & hotkeys
document.addEventListener('keydown', e => {
  const isInput = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput)) {
    e.preventDefault();
    openPalette();
    return;
  }
  if (paletteModal) {
    if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      paletteSelectedIndex = Math.min(paletteHits.length - 1, paletteSelectedIndex + 1);
      drawPaletteResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      paletteSelectedIndex = Math.max(0, paletteSelectedIndex - 1);
      drawPaletteResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectPaletteHit(paletteHits[paletteSelectedIndex]);
    }
  }
});
