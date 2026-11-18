/* ==========================================================================
   Minimal Subtle Feedback Banner
   ========================================================================== */

let toastBox = null;

function showToast(msg, isError = false) {
  if (!toastBox || !document.body.contains(toastBox)) {
    toastBox = document.createElement('div');
    toastBox.className = 'fixed top-16 right-4 z-[90] flex flex-col gap-2 pointer-events-none max-w-sm';
    document.body.appendChild(toastBox);
  }

  const el = document.createElement('div');
  el.className = `notice-pill pointer-events-auto rounded-xl px-4 py-2.5 text-xs font-semibold shadow-lg flex items-center gap-2 border transition-opacity duration-300 ${
    isError
      ? 'bg-rose-600 text-white border-rose-500'
      : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-stone-800 dark:border-zinc-200'
  }`;
  el.innerHTML = `<span>${isError ? '!' : '✓'}</span><span>${esc(msg)}</span>`;
  toastBox.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2400);
}
