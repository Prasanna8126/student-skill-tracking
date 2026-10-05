// Student Projects Portfolio View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderStudentProjects(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading project portfolio...
    </div>
  `;

  try {
    const projects = await api.get('/projects');
    renderProjectsUI(container, projects);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load projects.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderProjectsUI(container, projects) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Project Showcase & Experience</h2>
          <p class="text-xs text-slate-500 mt-0.5">Showcase your technical projects, repositories, and live demonstrations</p>
        </div>
        <button id="add-proj-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Project
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="proj-search" placeholder="Search by project title, tech stack, or category..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>
        
        <div class="flex items-center gap-2">
          <button class="proj-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5" data-status="ALL">
            All (${projects.length})
          </button>
          <button class="proj-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="COMPLETED">
            Completed (${projects.filter(p => p.status === 'COMPLETED').length})
          </button>
          <button class="proj-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="IN_PROGRESS">
            In Progress (${projects.filter(p => p.status === 'IN_PROGRESS').length})
          </button>
          <button class="proj-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="PLANNED">
            Planned (${projects.filter(p => p.status === 'PLANNED').length})
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;

  let currentStatus = 'ALL';
  let searchQuery = '';

  const renderGrid = () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const filtered = projects.filter(p => {
      const matchesStatus = currentStatus === 'ALL' || p.status === currentStatus;
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.technologiesUsed && p.technologiesUsed.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full card p-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-laptop-code"></i>
          </div>
          <p class="font-semibold text-slate-700">No projects found</p>
          <p class="text-xs text-slate-500 mt-1">Showcase your portfolio projects with live URLs and GitHub repositories.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      let statusClass = 'bg-slate-100 text-slate-700';
      if (p.status === 'COMPLETED') statusClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      else if (p.status === 'IN_PROGRESS') statusClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200';

      const techTags = p.technologiesUsed
        ? p.technologiesUsed.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      return `
        <div class="card p-5 card-hover relative group flex flex-col justify-between border-slate-200">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="badge bg-slate-100 text-slate-700 text-[10px] font-semibold">${escapeHtml(p.category || 'General Project')}</span>
              <span class="badge ${statusClass} text-[10px]">${p.status.replace('_', ' ')}</span>
            </div>

            <h3 class="font-bold text-slate-900 text-base leading-tight mb-2">${escapeHtml(p.title)}</h3>
            <p class="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">${escapeHtml(p.description || 'No description provided.')}</p>

            <!-- Tech Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${techTags.map(t => `
                <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-100/60">
                  ${escapeHtml(t)}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              ${p.githubUrl ? `
                <a href="${escapeHtml(p.githubUrl)}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1.5 px-2.5" title="GitHub Repository">
                  <i class="fa-brands fa-github"></i> Code
                </a>
              ` : ''}
              ${p.liveDemoUrl ? `
                <a href="${escapeHtml(p.liveDemoUrl)}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1.5 px-2.5" title="Live Demo">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
                </a>
              ` : ''}
            </div>

            <div class="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition">
              <button class="edit-proj-btn text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${p.id}" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-proj-btn text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${p.id}" data-title="${escapeHtml(p.title)}" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach edit / delete handlers
    grid.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const proj = projects.find(x => x.id === id);
        if (proj) openProjectModal(container, proj);
      });
    });

    grid.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const title = btn.getAttribute('data-title');
        showConfirmModal({
          title: 'Delete Project',
          message: `Are you sure you want to remove '${title}' from your portfolio?`,
          async onConfirm() {
            try {
              await api.delete(`/projects/${id}`);
              showToast(`Project '${title}' deleted.`, 'success');
              renderStudentProjects(container);
            } catch (err) {}
          }
        });
      });
    });
  };

  document.getElementById('proj-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  container.querySelectorAll('.proj-status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.proj-status-pill').forEach(p => {
        p.className = 'proj-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5';
      });
      pill.className = 'proj-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5';
      currentStatus = pill.getAttribute('data-status');
      renderGrid();
    });
  });

  document.getElementById('add-proj-btn').addEventListener('click', () => {
    openProjectModal(container, null);
  });

  renderGrid();
}

function openProjectModal(container, existingProject) {
  const isEdit = !!existingProject;

  openModal({
    title: isEdit ? 'Edit Project Details' : 'Add Project to Portfolio',
    contentHtml: `
      <form id="proj-modal-form" class="space-y-4">
        
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Project Title *</label>
          <input type="text" id="modal-proj-title" value="${existingProject ? escapeHtml(existingProject.title) : ''}" required
            placeholder="e.g. Distributed Task Scheduler, E-Commerce Platform"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category</label>
            <input type="text" id="modal-proj-cat" value="${existingProject ? escapeHtml(existingProject.category || '') : ''}"
              placeholder="e.g. Full Stack Web App, AI/ML, Cloud"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Status</label>
            <select id="modal-proj-status"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
              <option value="PLANNED" ${existingProject && existingProject.status === 'PLANNED' ? 'selected' : ''}>Planned</option>
              <option value="IN_PROGRESS" ${!existingProject || existingProject.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
              <option value="COMPLETED" ${existingProject && existingProject.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Technologies Used (Comma-separated)</label>
          <input type="text" id="modal-proj-tech" value="${existingProject ? escapeHtml(existingProject.technologiesUsed || '') : ''}"
            placeholder="e.g. Java, Spring Boot, MySQL, Docker, React"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
          <textarea id="modal-proj-desc" rows="3" placeholder="Explain the project architecture, features, and your individual contribution..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">${existingProject ? escapeHtml(existingProject.description || '') : ''}</textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">GitHub Repository Link</label>
            <input type="url" id="modal-proj-github" value="${existingProject ? escapeHtml(existingProject.githubUrl || '') : ''}" placeholder="https://github.com/..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Live Demo Link (Optional)</label>
            <input type="url" id="modal-proj-demo" value="${existingProject ? escapeHtml(existingProject.liveDemoUrl || '') : ''}" placeholder="https://..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" id="modal-cancel-btn" class="btn btn-secondary btn-sm px-4">Cancel</button>
          <button type="submit" id="modal-submit-btn" class="btn btn-primary btn-sm px-5">
            ${isEdit ? 'Save Changes' : 'Add Project'}
          </button>
        </div>

      </form>
    `,
    onRender(close) {
      document.getElementById('modal-cancel-btn').addEventListener('click', close);

      const form = document.getElementById('proj-modal-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('modal-submit-btn');
        submitBtn.disabled = true;

        const payload = {
          title: document.getElementById('modal-proj-title').value.trim(),
          category: document.getElementById('modal-proj-cat').value.trim() || null,
          status: document.getElementById('modal-proj-status').value,
          technologiesUsed: document.getElementById('modal-proj-tech').value.trim() || null,
          description: document.getElementById('modal-proj-desc').value.trim() || null,
          githubUrl: document.getElementById('modal-proj-github').value.trim() || null,
          liveDemoUrl: document.getElementById('modal-proj-demo').value.trim() || null
        };

        try {
          if (isEdit) {
            await api.put(`/projects/${existingProject.id}`, payload);
            showToast('Project updated successfully!', 'success');
          } else {
            await api.post('/projects', payload);
            showToast('Project added to portfolio!', 'success');
          }

          close();
          renderStudentProjects(container);
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
