// Admin Certification Verification View
import { api } from '../api.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderAdminCerts(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading certification queue...
    </div>
  `;

  try {
    const certs = await api.get('/admin/certifications');
    renderCertsTable(container, certs);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load certification queue.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderCertsTable(container, certs) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Certification Verification Workspace</h2>
          <p class="text-xs text-slate-500 mt-0.5">Review, validate credentials, and approve or reject submissions</p>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="badge bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1 font-bold">
            ${certs.filter(c => c.status === 'PENDING').length} Pending Review
          </span>
        </div>
      </div>

      <!-- Filters -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="admin-cert-search" placeholder="Search by student, certificate, or organization..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="flex items-center gap-2">
          <button class="admin-cert-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5" data-status="ALL">
            All (${certs.length})
          </button>
          <button class="admin-cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="PENDING">
            Pending (${certs.filter(c => c.status === 'PENDING').length})
          </button>
          <button class="admin-cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="VERIFIED">
            Verified (${certs.filter(c => c.status === 'VERIFIED').length})
          </button>
          <button class="admin-cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="REJECTED">
            Rejected (${certs.filter(c => c.status === 'REJECTED').length})
          </button>
        </div>
      </div>

      <!-- Certifications Table -->
      <div class="card overflow-hidden border-slate-200">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Student</th>
                <th class="py-3 px-4">Certification Title</th>
                <th class="py-3 px-4">Issuing Organization</th>
                <th class="py-3 px-4">Issue / Expiry Date</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-certs-tbody" class="divide-y divide-slate-100 text-slate-700">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  let currentStatus = 'ALL';
  let searchQuery = '';

  const renderRows = () => {
    const tbody = document.getElementById('admin-certs-tbody');
    if (!tbody) return;

    const filtered = certs.filter(c => {
      const matchesStatus = currentStatus === 'ALL' || c.status === currentStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.studentName && c.studentName.toLowerCase().includes(q)) ||
        (c.studentEmail && c.studentEmail.toLowerCase().includes(q)) ||
        (c.issuingOrganization && c.issuingOrganization.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-10 text-center text-slate-400 font-medium">
            No certification submissions found matching criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(c => {
      let badge = 'badge-pending';
      if (c.status === 'VERIFIED') badge = 'badge-verified';
      else if (c.status === 'REJECTED' || c.status === 'EXPIRED') badge = 'badge-expired';

      return `
        <tr class="hover:bg-slate-50/80 transition">
          <td class="py-3.5 px-4 font-semibold text-slate-900">
            ${escapeHtml(c.studentName)}
            <span class="block text-[11px] text-slate-400 font-normal">${escapeHtml(c.studentEmail)} &bull; ${escapeHtml(c.studentId || '')}</span>
          </td>
          <td class="py-3.5 px-4 font-bold text-indigo-700">
            ${escapeHtml(c.title)}
            ${c.certificateId ? `<span class="block text-[10px] text-slate-400 font-mono font-normal">ID: ${escapeHtml(c.certificateId)}</span>` : ''}
          </td>
          <td class="py-3.5 px-4 font-medium text-slate-700">
            ${escapeHtml(c.issuingOrganization)}
          </td>
          <td class="py-3.5 px-4 text-slate-500">
            <div>Issued: ${c.issueDate}</div>
            <div class="text-[10px] text-slate-400">Expires: ${c.expiryDate || 'No Expiry'}</div>
          </td>
          <td class="py-3.5 px-4">
            <span class="badge ${badge} text-[10px]">${c.status}</span>
          </td>
          <td class="py-3.5 px-4 text-right">
            <div class="flex items-center justify-end gap-2">
              ${c.credentialUrl ? `
                <a href="${escapeHtml(c.credentialUrl)}" target="_blank" class="btn btn-secondary btn-sm text-[10px] py-1 px-2" title="Verify Online">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> URL
                </a>
              ` : ''}
              ${c.certificateFilePath ? `
                <a href="${escapeHtml(c.certificateFilePath)}" target="_blank" class="btn btn-secondary btn-sm text-[10px] py-1 px-2" title="View Document">
                  <i class="fa-solid fa-file"></i> File
                </a>
              ` : ''}
              <button class="review-cert-btn btn btn-primary btn-sm text-[10px] py-1 px-3" data-id="${c.id}">
                <i class="fa-solid fa-gavel text-[9px]"></i> Review
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.review-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const cert = certs.find(x => x.id === id);
        if (cert) openVerificationModal(container, cert);
      });
    });
  };

  document.getElementById('admin-cert-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderRows();
  });

  container.querySelectorAll('.admin-cert-status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.admin-cert-status-pill').forEach(p => {
        p.className = 'admin-cert-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5';
      });
      pill.className = 'admin-cert-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5';
      currentStatus = pill.getAttribute('data-status');
      renderRows();
    });
  });

  renderRows();
}

function openVerificationModal(container, cert) {
  openModal({
    title: 'Review & Verify Student Certification',
    contentHtml: `
      <div class="space-y-4 text-xs">
        
        <!-- Summary Box -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Student:</span>
            <span class="font-bold text-slate-900">${escapeHtml(cert.studentName)} (${escapeHtml(cert.studentEmail)})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Certification:</span>
            <span class="font-bold text-indigo-700">${escapeHtml(cert.title)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Issuing Organization:</span>
            <span class="text-slate-700 font-medium">${escapeHtml(cert.issuingOrganization)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 font-medium">Issue / Expiry:</span>
            <span class="text-slate-700 font-medium">${cert.issueDate} &rarr; ${cert.expiryDate || 'No Expiry'}</span>
          </div>
          ${cert.certificateId ? `
            <div class="flex justify-between">
              <span class="text-slate-400 font-medium">Certificate ID:</span>
              <span class="font-mono text-slate-700 font-medium">${escapeHtml(cert.certificateId)}</span>
            </div>
          ` : ''}
        </div>

        <!-- Links to verify -->
        <div class="flex items-center gap-3 py-1">
          ${cert.credentialUrl ? `
            <a href="${escapeHtml(cert.credentialUrl)}" target="_blank" class="btn btn-secondary btn-sm flex-1 text-xs">
              <i class="fa-solid fa-arrow-up-right-from-square text-indigo-600"></i> Open Verification Link
            </a>
          ` : '<span class="text-slate-400 italic">No URL provided</span>'}
          ${cert.certificateFilePath ? `
            <a href="${escapeHtml(cert.certificateFilePath)}" target="_blank" class="btn btn-secondary btn-sm flex-1 text-xs">
              <i class="fa-solid fa-file-pdf text-rose-600"></i> View Uploaded File
            </a>
          ` : ''}
        </div>

        <form id="verify-form" class="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Decision *</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="border border-slate-200 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-emerald-50/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 text-xs font-bold text-slate-800">
                <input type="radio" name="decision" value="VERIFIED" checked class="text-emerald-600">
                <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i> Approve & Verify
              </label>
              <label class="border border-slate-200 rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-rose-50/50 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 text-xs font-bold text-slate-800">
                <input type="radio" name="decision" value="REJECTED" class="text-rose-600">
                <i class="fa-solid fa-circle-xmark text-rose-600 text-sm"></i> Reject Submission
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Admin Feedback / Review Notes</label>
            <textarea id="verify-feedback" rows="3" placeholder="Provide notes or explain reasons if rejected..."
              class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">${escapeHtml(cert.adminFeedback || '')}</textarea>
          </div>

          <div class="pt-2 flex justify-end gap-3">
            <button type="button" id="verify-cancel-btn" class="btn btn-secondary btn-sm px-4">Cancel</button>
            <button type="submit" id="verify-submit-btn" class="btn btn-primary btn-sm px-5">Submit Decision</button>
          </div>
        </form>

      </div>
    `,
    onRender(close) {
      document.getElementById('verify-cancel-btn').addEventListener('click', close);

      const form = document.getElementById('verify-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('verify-submit-btn');
        submitBtn.disabled = true;

        const decision = document.querySelector('input[name="decision"]:checked').value;
        const feedback = document.getElementById('verify-feedback').value.trim();

        try {
          await api.put(`/admin/certifications/${cert.id}/verify`, {
            status: decision,
            adminFeedback: feedback || null
          });
          showToast(`Certification updated to ${decision}!`, 'success');
          close();
          renderAdminCerts(container);
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
