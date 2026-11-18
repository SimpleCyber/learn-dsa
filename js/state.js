/* ==========================================================================
   State & LeetCode Sync - Core Only
   ========================================================================== */

const API = 'https://leetcode-api-pied.vercel.app';

const LEVEL = {
  E: ['Easy', 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'],
  M: ['Medium', 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'],
  H: ['Hard', 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800']
};

/* --- Utilities --- */
const slugify = t => (t || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/[\s-]+/g, '-');
const norm = t => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const mdCode = s => esc(s).replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
const pad2 = n => String(n).padStart(2, '0');

function lsGet(k, d) {
  try {
    const v = localStorage.getItem(k);
    return v === null ? d : JSON.parse(v);
  } catch (e) {
    return d;
  }
}

function lsSet(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}

/* --- Core State --- */
const state = {
  username: lsGet('dsa.user', 'simplecyber'),
  userProfile: lsGet('dsa.profile', null),
  recentSubmissions: lsGet('dsa.recentSubmissions', []),
  solved: lsGet('dsa.solved', {}),
  hideSolved: lsGet('dsa.hide', false),
  syncing: false,
  error: null,
  lastSync: lsGet('dsa.lastSync', 0)
};

const urlCache = lsGet('dsa.urls', {});

/* --- Change Listeners --- */
const listeners = [];
function onStateChange(fn) {
  listeners.push(fn);
}
function notifyStateChange() {
  listeners.forEach(fn => {
    try { fn(state); } catch (e) { console.error(e); }
  });
}

/* --- Solved Queries --- */
function solvedMap() {
  return (state.username && state.solved[state.username]) || {};
}

function solvedTs(title) {
  return solvedMap()[norm(title)] || 0;
}

function isSolved(q) {
  return solvedTs(q[1]) > 0;
}

function topicStats(t) {
  const req = t.q.filter(q => q[2] !== 'H');
  const reqDone = req.filter(isSolved).length;
  const allDone = t.q.filter(isSolved).length;
  const cpDone = t.cp.filter(isSolved).length;
  const complete = reqDone === req.length && cpDone >= 4;
  const total = t.q.length + t.cp.length;
  const done = allDone + cpDone;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { req: req.length, reqDone, allDone, cpDone, complete, total, done, pct };
}

function overall() {
  const stats = (typeof TOPICS !== 'undefined' ? TOPICS : []).map(topicStats);
  const total = stats.reduce((a, s) => a + s.total, 0);
  const done = stats.reduce((a, s) => a + s.done, 0);
  const topicsDone = stats.filter(s => s.complete).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  let nextTopic = null;
  if (typeof TOPICS !== 'undefined') {
    const nextIdx = stats.findIndex(s => !s.complete);
    nextTopic = nextIdx >= 0 ? TOPICS[nextIdx] : null;
  }
  return { stats, total, done, topicsDone, pct, nextTopic };
}

function ago(ts) {
  const d = Math.floor((Date.now() / 1000 - ts) / 86400);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  return `${m}mo ago`;
}

/* --- LeetCode API Sync --- */
async function syncUser(name) {
  const cleanName = (name || state.username || '').trim();
  if (!cleanName) {
    state.error = 'Please enter a username';
    notifyStateChange();
    return;
  }
  state.syncing = true;
  state.error = null;
  notifyStateChange();

  try {
    const [pRes, sRes] = await Promise.all([
      fetch(`${API}/user/${cleanName}`, { headers: { accept: '*/*' } }),
      fetch(`${API}/user/${cleanName}/submissions?limit=100`, { headers: { accept: '*/*' } })
    ]);

    if (!pRes.ok && !sRes.ok) {
      throw new Error('User not found on LeetCode: ' + cleanName);
    }

    // 1. Process profile
    if (pRes.ok) {
      const pData = await pRes.json();
      state.userProfile = pData;
      lsSet('dsa.profile', pData);
    }

    // 2. Process recent submissions - ONLY tick when the question is actually solved (Accepted / status === 10)
    if (sRes.ok) {
      const subs = await sRes.json();
      const list = Array.isArray(subs) ? subs : (subs.submission || []);
      state.recentSubmissions = list;
      lsSet('dsa.recentSubmissions', list);

      const map = {};
      for (const s of list) {
        const isAccepted = s.statusDisplay === 'Accepted' || s.status === 10;
        if (isAccepted) {
          const ts = parseInt(s.timestamp, 10) || 0;
          const k = norm(s.title);
          if (ts && (!map[k] || ts > map[k])) {
            map[k] = ts;
          }
        }
      }

      state.solved[cleanName] = map;
      lsSet('dsa.solved', state.solved);
    }

    state.username = cleanName;
    state.lastSync = Date.now();

    lsSet('dsa.user', state.username);
    lsSet('dsa.lastSync', state.lastSync);

    if (typeof showToast === 'function') {
      showToast(`Synced @${cleanName} with LeetCode`);
    }
  } catch (err) {
    state.error = err.message || 'Sync failed';
    if (typeof showToast === 'function') {
      showToast(state.error, true);
    }
  } finally {
    state.syncing = false;
    notifyStateChange();
  }
}

function disconnectUser() {
  state.username = '';
  state.userProfile = null;
  state.recentSubmissions = [];
  state.error = null;
  lsSet('dsa.user', '');
  lsSet('dsa.profile', null);
  lsSet('dsa.recentSubmissions', []);
  if (typeof showToast === 'function') {
    showToast('Disconnected LeetCode account');
  }
  notifyStateChange();
}

async function openProblem(num, title) {
  const fallback = `https://leetcode.com/problems/${slugify(title)}/`;
  if (urlCache[num]) {
    window.open(urlCache[num], '_blank');
    return;
  }
  const win = window.open('', '_blank');
  let url = fallback;
  try {
    const r = await fetch(`${API}/problem/${num}`, { headers: { accept: '*/*' } });
    if (r.ok) {
      const j = await r.json();
      if (j.url) {
        url = j.url;
        urlCache[num] = url;
        lsSet('dsa.urls', urlCache);
      }
    }
  } catch (e) {}
  if (win) {
    win.location.href = url;
  } else {
    window.location.href = url;
  }
}

/* --- Notes & Starred Questions --- */
const notes = () => lsGet('dsa.notes', {});
function saveNote(problemNum, partial) {
  const all = notes();
  all[problemNum] = { ...(all[problemNum] || {}), ...partial };
  lsSet('dsa.notes', all);
  notifyStateChange();
}

/* --- Activity & Streak for Settings --- */
const dayKey = d => d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

function activity() {
  const m = solvedMap();
  const seen = new Set(Object.values(m));
  const cnt = {};
  seen.forEach(ts => {
    const k = dayKey(new Date(ts * 1000));
    cnt[k] = (cnt[k] || 0) + 1;
  });

  let streak = 0;
  const d = new Date();
  if (!cnt[dayKey(d)]) d.setDate(d.getDate() - 1);
  while (cnt[dayKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const cells = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (16 * 7 - 1) - today.getDay());

  for (let i = 0; i < 17 * 7; i++) {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    if (x > today) break;
    const c = cnt[dayKey(x)] || 0;
    const levelCls = c >= 3 ? 'l3' : c === 2 ? 'l2' : c === 1 ? 'l1' : '';
    cells.push(`<i class="${levelCls}" style="--n:${i}" title="${x.toDateString()}: ${c} solved"></i>`);
  }

  return { streak, cells: cells.join(''), total: seen.size };
}

/* --- Clean Theme Toggle --- */
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem('dsa.theme', isDark ? 'dark' : 'light');
  } catch (e) {}
  notifyStateChange();
}
