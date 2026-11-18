/* ==========================================================================
   Component: In-Place Minimal Settings Popover Dropdown
   Basic User Information & LeetCode Connection Only
   ========================================================================== */

function renderSettingsDropdownHTML() {
  const prof = state.userProfile;
  const p = prof?.profile;
  const stats = prof?.submitStats?.acSubmissionNum || [];
  const lcAll = stats.find(x => x.difficulty === 'All')?.count ?? '—';
  const lcEasy = stats.find(x => x.difficulty === 'Easy')?.count ?? '—';
  const lcMed = stats.find(x => x.difficulty === 'Medium')?.count ?? '—';
  const lcHard = stats.find(x => x.difficulty === 'Hard')?.count ?? '—';

  return `
    <!-- Header Row -->
    <div class="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800 text-xs">
      <span class="font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
        <span>👤</span> LeetCode Account
      </span>
      ${state.username ? `
        <button id="dropdownDisconnectBtn" class="text-[11px] text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium cursor-pointer">
          Disconnect
        </button>
      ` : ''}
    </div>

    <!-- Basic User Information (if connected) -->
    ${prof ? `
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          ${p?.userAvatar ? `
            <img src="${esc(p.userAvatar)}" alt="${esc(p.realName || state.username)}" class="w-10 h-10 rounded-xl border border-orange-500/40 object-cover shrink-0">
          ` : `
            <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold text-sm grid place-items-center shrink-0">
              ${esc(state.username.slice(0, 2).toUpperCase())}
            </div>
          `}
          <div class="min-w-0 flex-1">
            <div class="font-bold text-xs text-stone-900 dark:text-white truncate">
              ${esc(p?.realName || state.username)}
            </div>
            <div class="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-semibold truncate">
              @${esc(state.username)}
            </div>
            <div class="text-[10px] text-stone-400 mt-0.5 truncate">
              ${p?.ranking ? `🏆 #${Number(p.ranking).toLocaleString()}` : ''}
              ${p?.countryName ? ` • 📍 ${esc(p.countryName)}` : ''}
            </div>
          </div>
        </div>

        <!-- Social Links (LinkedIn, GitHub) -->
        <div class="flex items-center gap-2 text-[11px]">
          ${prof.linkedinUrl ? `
            <a href="${esc(prof.linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold flex items-center gap-1 hover:bg-sky-100 transition-colors">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/></svg>
              <span>LinkedIn</span>
            </a>
          ` : ''}
          ${prof.githubUrl ? `
            <a href="${esc(prof.githubUrl)}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-semibold flex items-center gap-1 transition-colors">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              <span>GitHub</span>
            </a>
          ` : ''}
        </div>

        <!-- LeetCode Platform Solved Stats -->
        <div class="grid grid-cols-4 gap-1.5 text-center pt-1 border-t border-stone-100 dark:border-zinc-800">
          <div class="p-1 rounded-lg bg-stone-50 dark:bg-zinc-800/60">
            <div class="font-mono font-bold text-xs text-stone-900 dark:text-white">${lcAll}</div>
            <div class="text-[9px] uppercase font-semibold text-stone-400">Total</div>
          </div>
          <div class="p-1 rounded-lg bg-stone-50 dark:bg-zinc-800/60">
            <div class="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">${lcEasy}</div>
            <div class="text-[9px] uppercase font-semibold text-emerald-600">Easy</div>
          </div>
          <div class="p-1 rounded-lg bg-stone-50 dark:bg-zinc-800/60">
            <div class="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">${lcMed}</div>
            <div class="text-[9px] uppercase font-semibold text-amber-600">Med</div>
          </div>
          <div class="p-1 rounded-lg bg-stone-50 dark:bg-zinc-800/60">
            <div class="font-mono font-bold text-xs text-rose-500 dark:text-rose-400">${lcHard}</div>
            <div class="text-[9px] uppercase font-semibold text-rose-500">Hard</div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Connection & Sync Input -->
    <div class="space-y-2 pt-1 border-t border-stone-100 dark:border-zinc-800">
      <div class="flex items-center gap-1.5">
        <input id="dropdownUserInput" value="${esc(state.username)}" placeholder="Enter LeetCode username" spellcheck="false" autocomplete="off"
          class="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-orange-500 text-stone-900 dark:text-zinc-100">
        <button id="dropdownSyncBtn" class="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors disabled:opacity-60 shadow-xs cursor-pointer shrink-0" ${state.syncing ? 'disabled' : ''}>
          <span class="${state.syncing ? 'spin' : ''}">⟳</span>
          <span>${state.syncing ? 'Syncing...' : (state.username ? 'Sync' : 'Connect')}</span>
        </button>
      </div>

      ${state.lastSync ? `
        <div class="text-[10px] text-stone-400 flex items-center justify-between">
          <span>Synced with LeetCode</span>
          <span class="font-mono">${new Date(state.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ` : ''}

      ${state.error ? `
        <p class="text-[10px] text-rose-500 dark:text-rose-400">⚠️ ${esc(state.error)}</p>
      ` : ''}
    </div>
  `;
}

/* --- Dropdown Toggle & Binding --- */
function toggleSettingsDropdown(force) {
  const dd = document.getElementById('settingsDropdown');
  if (!dd) return;

  const shouldOpen = typeof force === 'boolean' ? force : dd.classList.contains('hidden');

  if (shouldOpen) {
    dd.innerHTML = renderSettingsDropdownHTML();
    dd.classList.remove('hidden');
    bindSettingsDropdownEvents();
  } else {
    dd.classList.add('hidden');
  }
}

function closeSettingsDropdown() {
  const dd = document.getElementById('settingsDropdown');
  if (dd) dd.classList.add('hidden');
}

function updateSettingsDropdownContent() {
  const dd = document.getElementById('settingsDropdown');
  if (dd && !dd.classList.contains('hidden')) {
    dd.innerHTML = renderSettingsDropdownHTML();
    bindSettingsDropdownEvents();
  }
}

function bindSettingsDropdownEvents() {
  const dd = document.getElementById('settingsDropdown');
  if (!dd) return;

  const syncBtn = dd.querySelector('#dropdownSyncBtn');
  const userInput = dd.querySelector('#dropdownUserInput');
  if (syncBtn && userInput) {
    syncBtn.onclick = () => {
      const val = userInput.value.trim();
      if (val) {
        syncUser(val).then(() => updateSettingsDropdownContent());
      }
    };
    userInput.onkeydown = e => {
      if (e.key === 'Enter') {
        const val = userInput.value.trim();
        if (val) {
          syncUser(val).then(() => updateSettingsDropdownContent());
        }
      }
    };
  }

  const discBtn = dd.querySelector('#dropdownDisconnectBtn');
  if (discBtn) {
    discBtn.onclick = () => {
      if (confirm(`Disconnect @${state.username}?`)) {
        disconnectUser();
        updateSettingsDropdownContent();
      }
    };
  }
}

// Close when clicking outside of the dropdown and settings button
document.addEventListener('click', e => {
  const dd = document.getElementById('settingsDropdown');
  const container = document.getElementById('settingsContainer');
  const userChipPill = document.getElementById('userChipPill');

  if (dd && !dd.classList.contains('hidden')) {
    const inContainer = container && container.contains(e.target);
    const inUserChip = userChipPill && userChipPill.contains(e.target);
    if (!inContainer && !inUserChip) {
      closeSettingsDropdown();
    }
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSettingsDropdown();
  }
});

// Aliases for compatibility across navigation callers
function openSettingsModal() {
  toggleSettingsDropdown(true);
}

function closeSettingsModal() {
  closeSettingsDropdown();
}

function updateSettingsModalContent() {
  updateSettingsDropdownContent();
}

function renderSettingsPage() {
  setTimeout(() => toggleSettingsDropdown(true), 50);
  return typeof renderTopicsPage === 'function' ? renderTopicsPage() : '';
}

function bindSettingsEvents() {
  // Handled in dropdown
}
