// Admin Master Skills Management View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderAdminSkills(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading master skills catalog...
    </div>
  `;

  try {
    const skills = await api.get('/skills');
    renderMasterSkillsUI(container, skills);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load skills catalog.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderMasterSkillsUI(container, skills) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Master Skills Catalog</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage the institutional repository of recognized skills and categories</p>
        </div>
        <button id="add-master-skill-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Master Skill
        </button>
      </div>

      <!-- Search Input -->
      <div class="card p-4">
        <div class="relative max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="admin-skill-search" placeholder="Search catalog..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>
      </div>

      <!-- Skills Cards Grid -->
      <div id="master-skills-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;

  let searchQuery = '';

  const renderGrid = () => {
    const grid = document.getElementById('master-skills-grid');
    if (!grid) return;

    const filtered = skills.filter(s => {
      const q = searchQuery.toLowerCase();
      return !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="col-span-full py-8 text-center text-slate-400 text-xs">No skills found.</p>`;
      return;
    }

    grid.innerHTML = filtered.map(s => `
      <div class="card p-4 border-slate-200 flex flex-col justify-between group hover:border-indigo-300 transition">
        <div>
          <div class="flex items-start justify-between gap-1 mb-1">
            <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(s.name)}</h4>
            <button class="delete-mskill-btn text-slate-400 hover:text-rose-600 p-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition"
              data-id="${s.id}" data-name="${escapeHtml(s.name)}">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
          <span class="badge bg-slate-100 text-slate-600 text-[10px] font-semibold mb-2">${escapeHtml(s.category)}</span>
          <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${escapeHtml(s.description || 'No description')}</p>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.delete-mskill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const name = btn.getAttribute('data-name');
        showConfirmModal({
          title: 'Delete Master Skill',
          message: `Are you sure you want to remove '${name}' from the master catalog?`,
          async onConfirm() {
            try {
              await api.delete(`/admin/skills/${id}`);
              showToast(`Skill '${name}' removed.`, 'success');
              renderAdminSkills(container);
            } catch (err) {}
          }
        });
      });
    });
  };

  document.getElementById('admin-skill-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  document.getElementById('add-master-skill-btn').addEventListener('click', () => {
    openModal({
      title: 'Add New Master Skill',
      contentHtml: `
        <form id="master-skill-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Skill Name *</label>
            <input type="text" id="modal-ms-name" required placeholder="e.g. Flutter, Kotlin, Terraform"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
            <input type="text" id="modal-ms-cat" required placeholder="e.g. Mobile Development, DevOps & Tools"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
            <textarea id="modal-ms-desc" rows="3" placeholder="Brief technical definition of the skill..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"></textarea>
          </div>

          <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" id="modal-ms-cancel" class="btn btn-secondary btn-sm px-4">Cancel</button>
            <button type="submit" id="modal-ms-submit" class="btn btn-primary btn-sm px-5">Add to Catalog</button>
          </div>
        </form>
      `,
      onRender(close) {
        document.getElementById('modal-ms-cancel').addEventListener('click', close);

        const form = document.getElementById('master-skill-form');
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const submitBtn = document.getElementById('modal-ms-submit');
          submitBtn.disabled = true;

          const payload = {
            name: document.getElementById('modal-ms-name').value.trim(),
            category: document.getElementById('modal-ms-cat').value.trim(),
            description: document.getElementById('modal-ms-desc').value.trim() || null
          };

          try {
            await api.post('/admin/skills', payload);
            showToast('Master skill added to catalog!', 'success');
            close();
            renderAdminSkills(container);
          } catch (err) {
            submitBtn.disabled = false;
          }
        });
      }
    });
  });

  renderGrid();
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
