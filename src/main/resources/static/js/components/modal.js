// Modal Dialog Utility
export function openModal({ title, contentHtml, onRender, maxWidth = 'max-w-xl' }) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  root.innerHTML = `
    <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" id="modal-backdrop"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
      <div class="card ${maxWidth} w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-slate-200">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 class="text-base font-bold text-slate-900">${title}</h3>
          <button id="modal-close-btn" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition hover:bg-slate-200/60">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="p-6 max-h-[80vh] overflow-y-auto" id="modal-body-container">
          ${contentHtml}
        </div>
      </div>
    </div>
  `;

  root.classList.remove('hidden');

  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('modal-backdrop');

  const closeModal = () => {
    root.classList.add('hidden');
    root.innerHTML = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  if (typeof onRender === 'function') {
    onRender(closeModal);
  }

  return closeModal;
}

export function showConfirmModal({ title = 'Confirm Action', message, confirmText = 'Delete', confirmClass = 'btn-danger', onConfirm }) {
  openModal({
    title,
    maxWidth: 'max-w-md',
    contentHtml: `
      <div class="text-center py-2">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-xl">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <p class="text-slate-600 text-sm mb-6">${message}</p>
        <div class="flex justify-center gap-3">
          <button id="confirm-cancel-btn" class="btn btn-secondary px-5 py-2">Cancel</button>
          <button id="confirm-action-btn" class="btn ${confirmClass} px-5 py-2">${confirmText}</button>
        </div>
      </div>
    `,
    onRender(close) {
      document.getElementById('confirm-cancel-btn')?.addEventListener('click', close);
      document.getElementById('confirm-action-btn')?.addEventListener('click', async () => {
        close();
        if (typeof onConfirm === 'function') {
          await onConfirm();
        }
      });
    }
  });
}
