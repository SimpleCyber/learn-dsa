/* ==========================================================================
   Clean Router & App Coordinator
   ========================================================================== */

function parseRoute() {
  const hash = (location.hash || '#/topics').replace(/^#\/?/, '');
  const parts = hash.split('/');
  return {
    name: parts[0] === 'topic' ? 'topic' : parts[0] === 'settings' ? 'settings' : 'topics',
    id: parts[1] ? parseInt(parts[1], 10) : null
  };
}

function renderApp() {
  const route = parseRoute();
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Render Clean Navbar
  if (typeof renderNavbar === 'function') {
    renderNavbar(route.name, { id: route.id });
  }

  // Render View
  if (route.name === 'settings') {
    // If navigated via URL hash to #/settings, open in-place pop-up and return to topics
    location.hash = '#/topics';
    if (typeof openSettingsModal === 'function') {
      setTimeout(openSettingsModal, 20);
    }
    return;
  }

  if (route.name === 'topic' && route.id) {
    appContainer.innerHTML = renderTopicDetailPage(route.id);
    if (typeof bindTopicDetailEvents === 'function') bindTopicDetailEvents(route.id);
  } else {
    // Default: Clean Topics Grid
    appContainer.innerHTML = renderTopicsPage();
  }
}

// Reactive updates on state change
onStateChange(() => {
  renderApp();
  if (typeof updateSettingsModalContent === 'function') {
    updateSettingsModalContent();
  }
});

// Hashchange listener
window.addEventListener('hashchange', () => {
  renderApp();
  window.scrollTo(0, 0);
});

function initApp() {
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.onclick = () => toggleTheme();
  }

  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.onclick = () => openPalette();
  }
  const searchBtnMobile = document.getElementById('searchBtnMobile');
  if (searchBtnMobile) {
    searchBtnMobile.onclick = () => openPalette();
  }

  // Render initial view
  renderApp();

  // Background auto-sync if connected and last sync > 15 mins ago
  if (state.username && (!state.lastSync || Date.now() - state.lastSync > 15 * 60 * 1000)) {
    syncUser(state.username);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
