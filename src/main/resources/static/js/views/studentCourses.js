// Student Course Tracking View
import { api } from '../api.js';
import { openModal, showConfirmModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export async function renderStudentCourses(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading courses...
    </div>
  `;

  try {
    const courses = await api.get('/courses');
    renderCoursesUI(container, courses);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load courses.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderCoursesUI(container, courses) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Course Tracking</h2>
          <p class="text-xs text-slate-500 mt-0.5">Track your ongoing learning progress across MOOC platforms</p>
        </div>
        <button id="add-course-btn" class="btn btn-primary shadow-md shadow-indigo-500/20">
          <i class="fa-solid fa-plus text-xs"></i> Add Course
        </button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="course-search" placeholder="Search by course name or platform..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>
        
        <div class="flex items-center gap-2">
          <button class="course-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5" data-status="ALL">
            All (${courses.length})
          </button>
          <button class="course-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="IN_PROGRESS">
            In Progress (${courses.filter(c => c.status === 'IN_PROGRESS').length})
          </button>
          <button class="course-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="COMPLETED">
            Completed (${courses.filter(c => c.status === 'COMPLETED').length})
          </button>
          <button class="course-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5" data-status="NOT_STARTED">
            Not Started (${courses.filter(c => c.status === 'NOT_STARTED').length})
          </button>
        </div>
      </div>

      <!-- Courses Grid -->
      <div id="courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Rendered dynamically -->
      </div>

    </div>
  `;

  let currentStatus = 'ALL';
  let searchQuery = '';

  const renderGrid = () => {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;

    const filtered = courses.filter(c => {
      const matchesStatus = currentStatus === 'ALL' || c.status === currentStatus;
      const matchesSearch = !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.platform.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full card p-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <p class="font-semibold text-slate-700">No courses found</p>
          <p class="text-xs text-slate-500 mt-1">Start tracking your courses on Coursera, Udemy, edX, or YouTube.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => {
      let statusBadge = 'bg-slate-100 text-slate-700';
      let barColor = 'bg-slate-400';

      if (c.status === 'COMPLETED') {
        statusBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
        barColor = 'bg-emerald-500';
      } else if (c.status === 'IN_PROGRESS') {
        statusBadge = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
        barColor = 'bg-indigo-600';
      }

      return `
        <div class="card p-5 card-hover relative group flex flex-col justify-between border-slate-200">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="badge bg-slate-100 text-slate-700 text-[10px] font-semibold">${escapeHtml(c.platform)}</span>
              <span class="badge ${statusBadge} text-[10px]">${c.status.replace('_', ' ')}</span>
            </div>

            <h3 class="font-bold text-slate-900 text-base leading-tight mb-1">${escapeHtml(c.title)}</h3>
            ${c.instructor ? `<p class="text-xs text-slate-500 mb-3"><i class="fa-solid fa-chalkboard-user mr-1 text-slate-400"></i> ${escapeHtml(c.instructor)}</p>` : ''}

            <!-- Progress Bar -->
            <div class="mt-4 mb-3">
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-500">Progress</span>
                <span class="font-bold text-slate-800">${c.progressPercentage}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${c.progressPercentage}%"></div>
              </div>
            </div>

            <div class="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-100">
              ${c.startDate ? `<div>Started: <span class="text-slate-600">${c.startDate}</span></div>` : ''}
              ${c.completionDate ? `<div>Completed: <span class="text-emerald-600 font-medium">${c.completionDate}</span></div>` : ''}
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              ${c.courseUrl ? `
                <a href="${escapeHtml(c.courseUrl)}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1.5 px-3">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Course
                </a>
              ` : '<span></span>'}
            </div>

            <div class="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition">
              <button class="edit-course-btn text-slate-500 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${c.id}" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-course-btn text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100" data-id="${c.id}" data-title="${escapeHtml(c.title)}" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach edit / delete handlers
    grid.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const course = courses.find(x => x.id === id);
        if (course) openCourseModal(container, course);
      });
    });

    grid.querySelectorAll('.delete-course-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const title = btn.getAttribute('data-title');
        showConfirmModal({
          title: 'Delete Course',
          message: `Are you sure you want to remove '${title}' from your courses?`,
          async onConfirm() {
            try {
              await api.delete(`/courses/${id}`);
              showToast(`Course '${title}' removed.`, 'success');
              renderStudentCourses(container);
            } catch (err) {}
          }
        });
      });
    });
  };

  document.getElementById('course-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  container.querySelectorAll('.course-status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.course-status-pill').forEach(p => {
        p.className = 'course-status-pill badge bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-3 py-1.5';
      });
      pill.className = 'course-status-pill badge bg-indigo-600 text-white cursor-pointer px-3 py-1.5';
      currentStatus = pill.getAttribute('data-status');
      renderGrid();
    });
  });

  document.getElementById('add-course-btn').addEventListener('click', () => {
    openCourseModal(container, null);
  });

  renderGrid();
}

function openCourseModal(container, existingCourse) {
  const isEdit = !!existingCourse;

  openModal({
    title: isEdit ? 'Update Course Progress' : 'Add Course to Tracker',
    contentHtml: `
      <form id="course-modal-form" class="space-y-4">
        
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Course Title *</label>
          <input type="text" id="modal-course-title" value="${existingCourse ? escapeHtml(existingCourse.title) : ''}" required
            placeholder="e.g. Complete Spring Boot & Hibernate Masterclass"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Platform *</label>
            <input type="text" id="modal-course-platform" value="${existingCourse ? escapeHtml(existingCourse.platform) : ''}" required
              placeholder="Coursera, Udemy, edX, LinkedIn Learning"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Instructor (Optional)</label>
            <input type="text" id="modal-course-instructor" value="${existingCourse ? escapeHtml(existingCourse.instructor || '') : ''}" placeholder="Instructor name"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            <span>Progress Percentage</span>
            <span id="course-prof-val" class="text-sm font-bold text-indigo-600">${existingCourse ? existingCourse.progressPercentage : 0}%</span>
          </div>
          <input type="range" id="modal-course-progress" min="0" max="100" value="${existingCourse ? existingCourse.progressPercentage : 0}"
            class="w-full accent-indigo-600 cursor-pointer">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Status</label>
            <select id="modal-course-status"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
              <option value="NOT_STARTED" ${existingCourse && existingCourse.status === 'NOT_STARTED' ? 'selected' : ''}>Not Started</option>
              <option value="IN_PROGRESS" ${existingCourse && existingCourse.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
              <option value="COMPLETED" ${existingCourse && existingCourse.status === 'COMPLETED' ? 'selected' : ''}>Completed</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
            <input type="date" id="modal-course-start" value="${existingCourse && existingCourse.startDate ? existingCourse.startDate : ''}"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Course URL (Optional)</label>
          <input type="url" id="modal-course-url" value="${existingCourse ? escapeHtml(existingCourse.courseUrl || '') : ''}" placeholder="https://..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" id="modal-cancel-btn" class="btn btn-secondary btn-sm px-4">Cancel</button>
          <button type="submit" id="modal-submit-btn" class="btn btn-primary btn-sm px-5">
            ${isEdit ? 'Save Changes' : 'Add Course'}
          </button>
        </div>

      </form>
    `,
    onRender(close) {
      document.getElementById('modal-cancel-btn').addEventListener('click', close);

      const progressSlider = document.getElementById('modal-course-progress');
      const progressVal = document.getElementById('course-prof-val');
      const statusSelect = document.getElementById('modal-course-status');

      progressSlider.addEventListener('input', () => {
        const val = Number(progressSlider.value);
        progressVal.innerText = `${val}%`;
        if (val === 100) {
          statusSelect.value = 'COMPLETED';
        } else if (val > 0) {
          statusSelect.value = 'IN_PROGRESS';
        } else {
          statusSelect.value = 'NOT_STARTED';
        }
      });

      statusSelect.addEventListener('change', () => {
        if (statusSelect.value === 'COMPLETED') {
          progressSlider.value = 100;
          progressVal.innerText = '100%';
        } else if (statusSelect.value === 'NOT_STARTED') {
          progressSlider.value = 0;
          progressVal.innerText = '0%';
        }
      });

      const form = document.getElementById('course-modal-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('modal-submit-btn');
        submitBtn.disabled = true;

        const payload = {
          title: document.getElementById('modal-course-title').value.trim(),
          platform: document.getElementById('modal-course-platform').value.trim(),
          instructor: document.getElementById('modal-course-instructor').value.trim() || null,
          progressPercentage: Number(progressSlider.value),
          status: statusSelect.value,
          startDate: document.getElementById('modal-course-start').value || null,
          courseUrl: document.getElementById('modal-course-url').value.trim() || null
        };

        try {
          if (isEdit) {
            await api.put(`/courses/${existingCourse.id}`, payload);
            showToast('Course updated successfully!', 'success');
          } else {
            await api.post('/courses', payload);
            showToast('Course added to tracker!', 'success');
          }

          close();
          renderStudentCourses(container);
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
