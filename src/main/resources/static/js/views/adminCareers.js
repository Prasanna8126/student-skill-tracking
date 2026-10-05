// Admin Career Roles Management View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderAdminCareers(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading career pathways...
    </div>
  `;

  try {
    const [careers, masterSkills] = await Promise.all([
      api.get('/careers'),
      api.get('/skills')
    ]);

    renderCareersUI(container, careers, masterSkills);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load career roles.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderCareersUI(container, careers, masterSkills) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Career Roles & Competency Benchmarks</h2>
          <p class="text-xs text-slate-500 mt-0.5">Define career profiles, required skills, and benchmark thresholds</p>
        </div>
        <button id="add-career-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Career Role
        </button>
      </div>

      <!-- Careers List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${careers.map(c => `
          <div class="card p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 class="font-bold text-slate-900 text-lg leading-snug">${escapeHtml(c.title)}</h3>
                  <span class="text-xs text-indigo-600 font-semibold">${escapeHtml(c.departmentFocus || 'General IT')}</span>
                </div>
                <button class="delete-career-btn text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition" data-id="${c.id}" data-title="${escapeHtml(c.title)}">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <p class="text-xs text-slate-600 mb-4 leading-relaxed">${escapeHtml(c.description || '')}</p>

              <!-- Required Skills List -->
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Required Competencies (${c.requiredSkills ? c.requiredSkills.length : 0})
                </h4>
                <div class="flex flex-wrap gap-1.5 mb-4">
                  ${(c.requiredSkills && c.requiredSkills.length) ? c.requiredSkills.map(req => `
                    <span class="badge bg-slate-100 text-slate-800 text-[10px] font-semibold border border-slate-200">
                      ${escapeHtml(req.skillName)} &bull; <strong class="text-indigo-600">${req.minimumLevel}</strong> (w:${req.weight})
                    </span>
                  `).join('') : '<span class="text-xs text-slate-400">No skills assigned yet.</span>'}
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>${c.recommendations ? c.recommendations.length : 0} Curated recommendations</span>
              <span class="text-[11px] text-indigo-600 font-semibold">Active Benchmark</span>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  // Attach delete buttons
  container.querySelectorAll('.delete-career-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      const title = btn.getAttribute('data-title');
      showConfirmModal({
        title: 'Delete Career Role',
        message: `Are you sure you want to remove '${title}'? This will affect student gap analyses linked to this role.`,
        async onConfirm() {
          try {
            await api.delete(`/admin/careers/${id}`);
            showToast(`Career role '${title}' deleted.`, 'success');
            renderAdminCareers(container);
          } catch (err) {}
        }
      });
    });
  });

  // Add career role modal
  document.getElementById('add-career-btn').addEventListener('click', () => {
    openModal({
      title: 'Define New Career Role',
      maxWidth: 'max-w-2xl',
      contentHtml: `
        <form id="career-modal-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Career Title *</label>
            <input type="text" id="modal-career-title" required placeholder="e.g. DevOps Engineer, Security Analyst"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Department Focus</label>
            <input type="text" id="modal-career-dept" placeholder="e.g. Computer Science / Cybersecurity"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
            <textarea id="modal-career-desc" rows="3" placeholder="Role responsibilities and expectations..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Select Core Required Skills</label>
            <div class="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
              ${masterSkills.map(s => `
                <label class="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" name="reqSkillCheck" value="${s.id}" class="text-indigo-600 rounded">
                  <span class="text-slate-800 font-medium">${escapeHtml(s.name)}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" id="modal-career-cancel" class="btn btn-secondary btn-sm px-4">Cancel</button>
            <button type="submit" id="modal-career-submit" class="btn btn-primary btn-sm px-5">Create Role</button>
          </div>
        </form>
      `,
      onRender(close) {
        document.getElementById('modal-career-cancel').addEventListener('click', close);

        const form = document.getElementById('career-modal-form');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const submitBtn = document.getElementById('modal-career-submit');
          submitBtn.disabled = true;

          const checkedSkills = Array.from(document.querySelectorAll('input[name="reqSkillCheck"]:checked'))
            .map(cb => ({
              skillMasterId: Number(cb.value),
              minimumLevel: 'INTERMEDIATE',
              weight: 8
            }));

          const payload = {
            title: document.getElementById('modal-career-title').value.trim(),
            departmentFocus: document.getElementById('modal-career-dept').value.trim() || null,
            description: document.getElementById('modal-career-desc').value.trim() || null,
            requiredSkills: checkedSkills
          };

          try {
            await api.post('/admin/careers', payload);
            showToast('Career role created successfully!', 'success');
            close();
            renderAdminCareers(container);
          } catch (err) {
            submitBtn.disabled = false;
          }
        });
      }
    });
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
