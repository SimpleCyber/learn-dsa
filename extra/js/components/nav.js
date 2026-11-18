/* ==========================================================================
   Clean & Distraction-Free Navigation Bar
   ========================================================================== */

function renderNavbar(currentRoute, routeParams = {}) {
  const navContainer = document.getElementById('mainNav');
  const userChip = document.getElementById('userChip');
  const overallEl = document.getElementById('navOverall');

  // Clean brand only (no redundant topic string next to DSA logo)
  if (navContainer) {
    navContainer.innerHTML = '';
  }

  // Settings Button -> In-Place Popover Dropdown
  const settingsBtn = document.getElementById('navSettingsBtn') || document.getElementById('navPageToggleBtn');
  if (settingsBtn) {
    settingsBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof toggleSettingsDropdown === 'function') toggleSettingsDropdown();
    };
  }

  // Overall Stats
  if (overallEl) {
    const o = overall();
    overallEl.innerHTML = `
      <div class="flex items-center gap-2 font-mono text-xs text-stone-500 dark:text-zinc-400" title="${o.done} of ${o.total} total problems solved">
        <span class="font-semibold text-stone-800 dark:text-zinc-200">${o.done}/${o.total}</span>
        <div class="w-14 h-1.5 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
          <div class="h-full bg-orange-500 transition-all duration-500" style="width: ${o.pct}%"></div>
        </div>
      </div>
    `;
  }

  // User Chip: Always expanded avatar icon + username button, matching Settings button styling & rounding
  if (userChip) {
    if (state.username) {
      const avatarUrl = state.userProfile?.profile?.userAvatar;
      userChip.innerHTML = `
        <button id="userChipPill" class="h-8 px-2.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 flex items-center gap-2 text-xs font-mono font-medium transition-colors cursor-pointer" title="Connected as @${esc(state.username)}. Click for settings & profile.">
          ${avatarUrl ? `
            <img src="${esc(avatarUrl)}" alt="Avatar" class="w-4 h-4 rounded-full object-cover shrink-0">
          ` : `
            <span class="w-4 h-4 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-[10px] font-mono font-bold grid place-items-center shrink-0">
              ${esc(state.username.slice(0, 2).toUpperCase())}
            </span>
          `}
          <span>@${esc(state.username)}</span>
        </button>
      `;

      const pill = userChip.querySelector('#userChipPill');
      if (pill) {
        pill.onclick = e => {
          e.stopPropagation();
          if (typeof toggleSettingsDropdown === 'function') toggleSettingsDropdown();
        };
      }
    } else {
      userChip.innerHTML = `
        <button id="navConnectBtn" class="h-8 px-2.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-50 dark:hover:bg-zinc-800/80 text-xs font-medium text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer">
          Connect LC
        </button>
      `;
      const connectBtn = userChip.querySelector('#navConnectBtn');
      if (connectBtn) {
        connectBtn.onclick = e => {
          e.stopPropagation();
          if (typeof toggleSettingsDropdown === 'function') toggleSettingsDropdown(true);
        };
      }
    }
  }
}
