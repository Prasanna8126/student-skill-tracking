// Student Skills Portfolio View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderStudentSkills(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading skills portfolio...
    </div>
  `;

  try {
    const [skills, masterSkills] = await Promise.all([
      api.get('/student/skills'),
      api.get('/skills')
    ]);

    renderSkillsUI(container, skills, masterSkills);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load skills.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderSkillsUI(container, skills, masterSkills) {
  const categories = Array.from(new Set(skills.map(s => s.category || 'General'))).sort();

  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Technical Skills Portfolio</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage and showcase your technical proficiencies and evidence</p>
        </div>
        <button id="add-skill-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Skill
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="skill-search" placeholder="Search skills (e.g. Java, Python, SQL)..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>
        
        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button class="skill-cat-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5" data-cat="ALL">
            All (${skills.length})
          </button>
          ${categories.map(c => `
            <button class="skill-cat-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-cat="${escapeHtml(c)}">
              ${escapeHtml(c)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Skills Cards Grid -->
      <div id="skills-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;

  let currentCategory = 'ALL';
  let searchQuery = '';

  const renderGrid = () => {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    const filtered = skills.filter(s => {
      const matchesCat = currentCategory === 'ALL' || (s.category || 'General') === currentCategory;
      const matchesSearch = !searchQuery || s.skillName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full card p-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-code"></i>
          </div>
          <p class="font-semibold text-slate-700">No skills found</p>
          <p class="text-xs text-slate-500 mt-1">Try adjusting your filters or click 'Add Skill' to add one.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(s => {
      let levelClass = 'badge-beginner';
      if (s.skillLevel === 'INTERMEDIATE') levelClass = 'badge-intermediate';
      else if (s.skillLevel === 'ADVANCED') levelClass = 'badge-advanced';
      else if (s.skillLevel === 'EXPERT') levelClass = 'badge-expert';

      let barColor = 'bg-indigo-600';
      if (s.proficiency < 40) barColor = 'bg-amber-500';
      else if (s.proficiency >= 80) barColor = 'bg-emerald-600';

      return `
        <div class="card p-5 card-hover relative group flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 class="font-bold text-slate-900 text-base leading-tight">${escapeHtml(s.skillName)}</h3>
                <span class="text-[11px] font-medium text-slate-500">${escapeHtml(s.category || 'General')}</span>
              </div>
              <span class="badge ${levelClass} text-[10px]">${s.skillLevel}</span>
            </div>

            <!-- Proficiency Bar -->
            <div class="mt-4 mb-2">
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-600">Proficiency</span>
                <span class="text-indigo-600 font-bold">${s.proficiency}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${s.proficiency}%"></div>
              </div>
            </div>

            ${s.description ? `<p class="text-xs text-slate-500 line-clamp-2 mt-2">${escapeHtml(s.description)}</p>` : ''}
          </div>

          <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              ${s.evidenceUrl ? `
                <a href="${escapeHtml(s.evidenceUrl)}" target="_blank" class="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium">
                  <i class="fa-solid fa-link text-[10px]"></i> Evidence / Project
                </a>
              ` : `<span class="text-slate-400 text-[11px]">Added ${s.dateAdded || 'recently'}</span>`}
            </div>

            <div class="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition">
              <button class="edit-skill-btn text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${s.id}" title="Edit Skill">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-skill-btn text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${s.id}" data-name="${escapeHtml(s.skillName)}" title="Delete Skill">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach edit / delete handlers
    grid.querySelectorAll('.edit-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const skill = skills.find(x => x.id === id);
        if (skill) openSkillModal(container, skill, masterSkills);
      });
    });

    grid.querySelectorAll('.delete-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const name = btn.getAttribute('data-name');
        showConfirmModal({
          title: 'Delete Skill',
          message: `Are you sure you want to remove '${name}' from your skills portfolio?`,
          async onConfirm() {
            try {
              await api.delete(`/student/skills/${id}`);
              showToast(`Skill '${name}' removed.`, 'success');
              renderStudentSkills(container);
            } catch (err) {}
          }
        });
      });
    });
  };

  // Search input handler
  document.getElementById('skill-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  // Category pill handlers
  container.querySelectorAll('.skill-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.skill-cat-pill').forEach(p => {
        p.className = 'skill-cat-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5';
      });
      pill.className = 'skill-cat-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5';
      currentCategory = pill.getAttribute('data-cat');
      renderGrid();
    });
  });

  // Add skill button
  document.getElementById('add-skill-btn').addEventListener('click', () => {
    openSkillModal(container, null, masterSkills);
  });

  renderGrid();
}

function openSkillModal(container, existingSkill, masterSkills) {
  const isEdit = !!existingSkill;

  openModal({
    title: isEdit ? 'Update Skill Proficiency' : 'Add Skill to Portfolio',
    contentHtml: `
      <form id="skill-modal-form" class="space-y-4">
        
        ${isEdit ? `
          <div class="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 mb-2">
            <h4 class="font-bold text-indigo-950 text-sm">${escapeHtml(existingSkill.skillName)}</h4>
            <p class="text-xs text-indigo-700">${escapeHtml(existingSkill.category || 'General')}</p>
          </div>
        ` : `
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Existing Skill or Add Custom</label>
            <select id="modal-skill-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
              <option value="">-- Choose from Standard Catalog --</option>
              ${masterSkills.map(m => `
                <option value="${m.id}" data-name="${escapeHtml(m.name)}" data-cat="${escapeHtml(m.category)}">
                  ${escapeHtml(m.name)} (${escapeHtml(m.category)})
                </option>
              `).join('')}
              <option value="CUSTOM">+ Add Custom Skill Name...</option>
            </select>
          </div>

          <div id="custom-skill-inputs" class="hidden space-y-3 pt-1">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Custom Skill Name *</label>
              <input type="text" id="modal-custom-name" placeholder="e.g. Next.js, GraphQL, Rust"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category</label>
              <input type="text" id="modal-custom-cat" placeholder="e.g. Frontend Development"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>
          </div>
        `}

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Proficiency Level *</label>
          <div class="grid grid-cols-4 gap-2">
            ${['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map(lvl => `
              <label class="border border-slate-200 rounded-xl p-2.5 text-center cursor-pointer hover:bg-slate-50 transition text-xs font-semibold select-none flex flex-col items-center gap-1">
                <input type="radio" name="skillLevel" value="${lvl}" class="sr-only" ${((existingSkill ? existingSkill.skillLevel : 'INTERMEDIATE') === lvl) ? 'checked' : ''}>
                <span class="level-indicator w-2.5 h-2.5 rounded-full ${((existingSkill ? existingSkill.skillLevel : 'INTERMEDIATE') === lvl) ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-300'}"></span>
                <span>${lvl}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            <span>Proficiency Percentage</span>
            <span id="slider-val" class="text-sm font-bold text-indigo-600">${existingSkill ? existingSkill.proficiency : 65}%</span>
          </div>
          <input type="range" id="modal-skill-prof" min="0" max="100" value="${existingSkill ? existingSkill.proficiency : 65}"
            class="w-full accent-indigo-600 cursor-pointer">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Evidence / Project Link (Optional)</label>
          <input type="url" id="modal-skill-evidence" value="${existingSkill ? escapeHtml(existingSkill.evidenceUrl || '') : ''}" placeholder="https://github.com/... or project link"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" id="modal-cancel-btn" class="btn btn-secondary btn-sm px-4">Cancel</button>
          <button type="submit" id="modal-submit-btn" class="btn btn-primary btn-sm px-5">
            ${isEdit ? 'Save Changes' : 'Add to Profile'}
          </button>
        </div>

      </form>
    `,
    onRender(close) {
      document.getElementById('modal-cancel-btn').addEventListener('click', close);

      const slider = document.getElementById('modal-skill-prof');
      const sliderVal = document.getElementById('slider-val');
      slider.addEventListener('input', () => {
        sliderVal.innerText = `${slider.value}%`;
      });

      // Radio button selection visual sync
      const radios = document.querySelectorAll('input[name="skillLevel"]');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          document.querySelectorAll('.level-indicator').forEach(ind => {
            ind.className = 'level-indicator w-2.5 h-2.5 rounded-full bg-slate-300';
          });
          const activeIndicator = radio.parentElement.querySelector('.level-indicator');
          activeIndicator.className = 'level-indicator w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200';
        });
      });

      if (!isEdit) {
        const select = document.getElementById('modal-skill-select');
        const customDiv = document.getElementById('custom-skill-inputs');
        select.addEventListener('change', () => {
          if (select.value === 'CUSTOM') {
            customDiv.classList.remove('hidden');
          } else {
            customDiv.classList.add('hidden');
          }
        });
      }

      // Handle submit
      const form = document.getElementById('skill-modal-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('modal-submit-btn');
        submitBtn.disabled = true;

        const selectedLevel = document.querySelector('input[name="skillLevel"]:checked').value;
        const prof = Number(slider.value);
        const evidence = document.getElementById('modal-skill-evidence').value.trim();

        try {
          if (isEdit) {
            await api.put(`/student/skills/${existingSkill.id}`, {
              skillLevel: selectedLevel,
              proficiency: prof,
              evidenceUrl: evidence
            });
            showToast('Skill updated successfully!', 'success');
          } else {
            const select = document.getElementById('modal-skill-select');
            let payload = {
              skillLevel: selectedLevel,
              proficiency: prof,
              evidenceUrl: evidence
            };

            if (select.value === 'CUSTOM') {
              payload.skillName = document.getElementById('modal-custom-name').value.trim();
              payload.category = document.getElementById('modal-custom-cat').value.trim() || 'General';
              if (!payload.skillName) {
                showToast('Please enter a custom skill name.', 'warning');
                submitBtn.disabled = false;
                return;
              }
            } else if (select.value) {
              payload.skillMasterId = Number(select.value);
            } else {
              showToast('Please choose a skill or select custom.', 'warning');
              submitBtn.disabled = false;
              return;
            }

            await api.post('/student/skills', payload);
            showToast('Skill added to profile!', 'success');
          }

          close();
          renderStudentSkills(container);
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
