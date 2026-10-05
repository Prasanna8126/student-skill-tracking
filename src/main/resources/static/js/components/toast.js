// Toast notification utility
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0';

  let icon = 'fa-circle-info text-sky-500';
  let bgBorder = 'bg-white border-slate-200 text-slate-800';

  if (type === 'success') {
    icon = 'fa-circle-check text-emerald-500';
    bgBorder = 'bg-emerald-50/90 border-emerald-200 text-emerald-900';
  } else if (type === 'error') {
    icon = 'fa-circle-exclamation text-rose-500';
    bgBorder = 'bg-rose-50/90 border-rose-200 text-rose-900';
  } else if (type === 'warning') {
    icon = 'fa-triangle-exclamation text-amber-500';
    bgBorder = 'bg-amber-50/90 border-amber-200 text-amber-900';
  }

  toast.className += ` ${bgBorder}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg flex-shrink-0"></i>
    <span class="flex-1 leading-snug">${escapeHtml(message)}</span>
    <button class="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
