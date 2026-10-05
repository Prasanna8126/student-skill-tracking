// Student Certifications Management View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderStudentCerts(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading certifications...
    </div>
  `;

  try {
    const certs = await api.get('/certifications');
    renderCertsUI(container, certs);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load certifications.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderCertsUI(container, certs) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Certifications Portfolio</h2>
          <p class="text-xs text-slate-500 mt-0.5">Submit industry credentials for administrative verification</p>
        </div>
        <button id="add-cert-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Certification
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="cert-search" placeholder="Search by title or organization..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>
        
        <div class="flex items-center gap-2">
          <button class="cert-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5" data-status="ALL">
            All (${certs.length})
          </button>
          <button class="cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="VERIFIED">
            Verified (${certs.filter(c => c.status === 'VERIFIED').length})
          </button>
          <button class="cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="PENDING">
            Pending (${certs.filter(c => c.status === 'PENDING').length})
          </button>
          <button class="cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="EXPIRED">
            Expired (${certs.filter(c => c.status === 'EXPIRED').length})
          </button>
        </div>
      </div>

      <!-- Certifications Cards Grid -->
      <div id="certs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;

  let currentStatus = 'ALL';
  let searchQuery = '';

  const renderGrid = () => {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    const filtered = certs.filter(c => {
      const matchesStatus = currentStatus === 'ALL' || c.status === currentStatus;
      const matchesSearch = !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full card p-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <p class="font-semibold text-slate-700">No certifications found</p>
          <p class="text-xs text-slate-500 mt-1">Add your earned certifications to boost your career readiness score.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => {
      let badgeClass = 'badge-pending';
      let icon = 'fa-hourglass-half text-amber-500';

      if (c.status === 'VERIFIED') {
        badgeClass = 'badge-verified';
        icon = 'fa-circle-check text-emerald-500';
      } else if (c.status === 'EXPIRED') {
        badgeClass = 'badge-expired';
        icon = 'fa-circle-xmark text-rose-500';
      } else if (c.status === 'REJECTED') {
        badgeClass = 'badge-expired';
        icon = 'fa-ban text-rose-500';
      }

      return `
        <div class="card p-5 card-hover relative group flex flex-col justify-between border-slate-200">
          <div>
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                <i class="fa-solid fa-award text-indigo-600"></i>
              </div>
              <span class="badge ${badgeClass} text-[10px]">
                <i class="fa-solid ${icon}"></i> ${c.status}
              </span>
            </div>

            <h3 class="font-bold text-slate-900 text-base leading-tight mb-1">${escapeHtml(c.title)}</h3>
            <p class="text-xs font-semibold text-indigo-600 mb-3">${escapeHtml(c.issuingOrganization)}</p>

            <div class="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              ${c.certificateId ? `
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Credential ID:</span>
                  <span class="font-mono text-slate-700 font-medium">${escapeHtml(c.certificateId)}</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Issued On:</span>
                <span class="text-slate-700 font-medium">${c.issueDate}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Expires:</span>
                <span class="text-slate-700 font-medium">${c.expiryDate ? c.expiryDate : 'Does not expire'}</span>
              </div>
            </div>

            ${c.adminFeedback ? `
              <div class="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <span class="font-bold block mb-0.5"><i class="fa-solid fa-comment-dots mr-1"></i> Admin Feedback:</span>
                ${escapeHtml(c.adminFeedback)}
              </div>
            ` : ''}
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              ${c.credentialUrl ? `
                <a href="${escapeHtml(c.credentialUrl)}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1.5 px-2.5">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Verify
                </a>
              ` : ''}
              ${c.certificateFilePath ? `
                <a href="${escapeHtml(c.certificateFilePath)}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1.5 px-2.5">
                  <i class="fa-solid fa-file-arrow-down"></i> File
                </a>
              ` : ''}
            </div>

            <div class="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition">
              <button class="edit-cert-btn text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${c.id}" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-cert-btn text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${c.id}" data-title="${escapeHtml(c.title)}" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach edit / delete handlers
    grid.querySelectorAll('.edit-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const cert = certs.find(x => x.id === id);
        if (cert) openCertModal(container, cert);
      });
    });

    grid.querySelectorAll('.delete-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const title = btn.getAttribute('data-title');
        showConfirmModal({
          title: 'Delete Certification',
          message: `Are you sure you want to delete the certification '${title}'?`,
          async onConfirm() {
            try {
              await api.delete(`/certifications/${id}`);
              showToast(`Certification '${title}' deleted.`, 'success');
              renderStudentCerts(container);
            } catch (err) {}
          }
        });
      });
    });
  };

  // Search input handler
  document.getElementById('cert-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  // Filter pills
  container.querySelectorAll('.cert-status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.cert-status-pill').forEach(p => {
        p.className = 'cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5';
      });
      pill.className = 'cert-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5';
      currentStatus = pill.getAttribute('data-status');
      renderGrid();
    });
  });

  document.getElementById('add-cert-btn').addEventListener('click', () => {
    openCertModal(container, null);
  });

  renderGrid();
}

function openCertModal(container, existingCert) {
  const isEdit = !!existingCert;

  openModal({
    title: isEdit ? 'Edit Certification' : 'Add Certification for Verification',
    contentHtml: `
      <form id="cert-modal-form" class="space-y-4">
        
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Certification Title *</label>
          <input type="text" id="modal-cert-title" value="${existingCert ? escapeHtml(existingCert.title) : ''}" required
            placeholder="e.g. AWS Certified Solutions Architect, Oracle Java SE"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Issuing Organization *</label>
          <input type="text" id="modal-cert-org" value="${existingCert ? escapeHtml(existingCert.issuingOrganization) : ''}" required
            placeholder="e.g. Amazon Web Services, Oracle, Google, Microsoft"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Credential ID (Optional)</label>
            <input type="text" id="modal-cert-id" value="${existingCert ? escapeHtml(existingCert.certificateId || '') : ''}" placeholder="e.g. AWS-123456"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Issue Date *</label>
            <input type="date" id="modal-cert-issue" value="${existingCert ? existingCert.issueDate : ''}" required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Expiry Date (Leave empty if none)</label>
            <input type="date" id="modal-cert-expiry" value="${existingCert && existingCert.expiryDate ? existingCert.expiryDate : ''}"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Credential Verification URL</label>
            <input type="url" id="modal-cert-url" value="${existingCert ? escapeHtml(existingCert.credentialUrl || '') : ''}" placeholder="https://..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Upload Certificate Document (PDF / Image)</label>
          <div class="flex items-center gap-3">
            <input type="file" id="modal-cert-file-input" accept=".pdf,image/*" class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
            <input type="hidden" id="modal-cert-filepath" value="${existingCert ? escapeHtml(existingCert.certificateFilePath || '') : ''}">
          </div>
          <p id="file-upload-status" class="text-[11px] text-slate-400 mt-1">${existingCert && existingCert.certificateFilePath ? 'Existing file attached.' : 'Optional file upload.'}</p>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" id="modal-cancel-btn" class="btn btn-secondary btn-sm px-4">Cancel</button>
          <button type="submit" id="modal-submit-btn" class="btn btn-primary btn-sm px-5">
            ${isEdit ? 'Update Certification' : 'Submit for Verification'}
          </button>
        </div>

      </form>
    `,
    onRender(close) {
      document.getElementById('modal-cancel-btn').addEventListener('click', close);

      const fileInput = document.getElementById('modal-cert-file-input');
      const filePathInput = document.getElementById('modal-cert-filepath');
      const fileStatus = document.getElementById('file-upload-status');

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        fileStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Uploading file...';

        try {
          const res = await api.post('/upload', formData);
          filePathInput.value = res.fileUrl;
          fileStatus.innerHTML = `<span class="text-emerald-600"><i class="fa-solid fa-check mr-1"></i> Uploaded: ${escapeHtml(res.fileName)}</span>`;
        } catch (err) {
          fileStatus.innerText = 'Upload failed. You can still provide a credential URL.';
        }
      });

      const form = document.getElementById('cert-modal-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('modal-submit-btn');
        submitBtn.disabled = true;

        const payload = {
          title: document.getElementById('modal-cert-title').value.trim(),
          issuingOrganization: document.getElementById('modal-cert-org').value.trim(),
          certificateId: document.getElementById('modal-cert-id').value.trim(),
          issueDate: document.getElementById('modal-cert-issue').value,
          expiryDate: document.getElementById('modal-cert-expiry').value || null,
          credentialUrl: document.getElementById('modal-cert-url').value.trim() || null,
          certificateFilePath: filePathInput.value.trim() || null
        };

        try {
          if (isEdit) {
            await api.put(`/certifications/${existingCert.id}`, payload);
            showToast('Certification updated successfully!', 'success');
          } else {
            await api.post('/certifications', payload);
            showToast('Certification submitted for review!', 'success');
          }

          close();
          renderStudentCerts(container);
        } catch (err) {
          submitBtn.disabled = false;
        }
      });
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}
