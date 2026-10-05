// Admin Student Directory View
import { api } from '../api.js';
import { openModal } from '../components/modal.js';

export async function renderAdminStudents(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading student directory...
    </div>
  `;

  try {
    const students = await api.get('/admin/students');
    renderStudentsUI(container, students);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load student directory.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

function renderStudentsUI(container, students) {
  const departments = Array.from(new Set(students.map(s => s.department).filter(Boolean))).sort();

  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">Registered Students Directory</h2>
          <p class="text-xs text-slate-500 mt-0.5">Browse student profiles, skill distributions, and credentials</p>
        </div>
        <span class="badge bg-indigo-50 text-indigo-700 text-xs px-3 py-1 font-bold">
          ${students.length} Total Registered Students
        </span>
      </div>

      <!-- Filters -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <i class="fa-solid fa-magnifying-glass text-xs"></i>
          </span>
          <input type="text" id="admin-student-search" placeholder="Search by name, email, or student ID..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
        </div>

        <div>
          <select id="admin-dept-filter" class="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white">
            <option value="ALL">All Departments</option>
            ${departments.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Students Table -->
      <div class="card overflow-hidden border-slate-200">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th class="py-3 px-4">Student</th>
                <th class="py-3 px-4">Department & Year</th>
                <th class="py-3 px-4">Target Career</th>
                <th class="py-3 px-4 text-center">Skills</th>
                <th class="py-3 px-4 text-center">Verified Certs</th>
                <th class="py-3 px-4 text-center">Projects</th>
                <th class="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody id="admin-students-tbody" class="divide-y divide-slate-100 text-slate-700">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  let searchQuery = '';
  let selectedDept = 'ALL';

  const renderTable = () => {
    const tbody = document.getElementById('admin-students-tbody');
    if (!tbody) return;

    const filtered = students.filter(s => {
      const matchesDept = selectedDept === 'ALL' || s.department === selectedDept;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.studentId && s.studentId.toLowerCase().includes(q));
      return matchesDept && matchesSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-10 text-center text-slate-400 font-medium">
            No students matching criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(s => `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-3">
            <img src="${s.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}"
              alt="Avatar" class="w-8 h-8 rounded-full object-cover border border-slate-200">
            <div>
              <span class="font-bold text-slate-900 block">${escapeHtml(s.fullName)}</span>
              <span class="text-[11px] text-slate-400 block">${escapeHtml(s.email)} &bull; ${escapeHtml(s.studentId || 'ID: None')}</span>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-4">
          <span class="font-medium text-slate-800 block">${escapeHtml(s.department || 'Unassigned')}</span>
          <span class="text-[11px] text-slate-400 block">${escapeHtml(s.academicYear || '')}</span>
        </td>
        <td class="py-3.5 px-4">
          <span class="badge badge-role text-[10px]">${escapeHtml(s.targetCareerTitle || 'Not Set')}</span>
        </td>
        <td class="py-3.5 px-4 text-center font-bold text-slate-800">
          ${s.totalSkills}
        </td>
        <td class="py-3.5 px-4 text-center">
          <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            ${s.verifiedCertifications}
          </span>
        </td>
        <td class="py-3.5 px-4 text-center font-bold text-slate-800">
          ${s.completedProjects}
        </td>
        <td class="py-3.5 px-4 text-right">
          <button class="view-student-btn btn btn-secondary btn-sm text-[11px] py-1 px-3" data-id="${s.id}">
            <i class="fa-solid fa-eye text-indigo-600"></i> View Portfolio
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.view-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        openStudentDetailsModal(id);
      });
    });
  };

  document.getElementById('admin-student-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderTable();
  });

  document.getElementById('admin-dept-filter').addEventListener('change', (e) => {
    selectedDept = e.target.value;
    renderTable();
  });

  renderTable();
}

async function openStudentDetailsModal(profileId) {
  openModal({
    title: 'Student Portfolio & Academic Profile',
    maxWidth: 'max-w-3xl',
    contentHtml: `
      <div id="student-modal-content" class="py-8 text-center text-slate-400">
        <i class="fa-solid fa-spinner fa-spin text-xl mr-2"></i> Loading profile...
      </div>
    `,
    async onRender() {
      try {
        const report = await api.get(`/reports/student/${profileId}`);
        const p = report.profile;
        const gap = report.skillGapAnalysis || {};

        const content = document.getElementById('student-modal-content');
        if (!content) return;

        content.className = 'space-y-6 text-left text-slate-800';
        content.innerHTML = `
          <!-- Header card -->
          <div class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img src="${p.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}"
              class="w-16 h-16 rounded-xl object-cover border border-slate-300">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">${escapeHtml(p.fullName)}</h3>
              <p class="text-xs text-slate-500">${escapeHtml(p.email)} &bull; ${escapeHtml(p.studentId || '')} &bull; ${escapeHtml(p.phone || '')}</p>
              <p class="text-xs text-indigo-600 font-semibold mt-0.5">${escapeHtml(p.department || '')} &bull; ${escapeHtml(p.academicYear || '')} &bull; ${escapeHtml(p.college || '')}</p>
              
              <div class="flex gap-2 mt-2">
                ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" class="badge bg-slate-200 text-slate-800"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
                ${p.linkedinUrl ? `<a href="${escapeHtml(p.linkedinUrl)}" target="_blank" class="badge bg-sky-100 text-sky-800"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
                ${p.resumeUrl ? `<a href="${escapeHtml(p.resumeUrl)}" target="_blank" class="badge bg-emerald-100 text-emerald-800"><i class="fa-solid fa-file-pdf"></i> Resume</a>` : ''}
              </div>
            </div>
            <div>
              <span class="badge badge-role text-xs">${escapeHtml(p.targetCareerTitle || 'No Target')}</span>
            </div>
          </div>

          <!-- Bio -->
          ${p.bio ? `<p class="text-xs text-slate-600 italic px-1">${escapeHtml(p.bio)}</p>` : ''}

          <!-- Skills -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Technical Skills (${report.skills.length})</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              ${report.skills.map(s => `
                <div class="p-2 rounded-lg border border-slate-200 bg-white text-xs">
                  <div class="flex justify-between font-bold">
                    <span>${escapeHtml(s.skillName)}</span>
                    <span class="text-indigo-600">${s.proficiency}%</span>
                  </div>
                  <span class="text-[10px] text-slate-400">${s.skillLevel}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Certifications -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Certifications (${report.certifications.length})</h4>
            <div class="space-y-2">
              ${report.certifications.map(c => `
                <div class="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold text-slate-900 block">${escapeHtml(c.title)}</span>
                    <span class="text-[10px] text-slate-500">${escapeHtml(c.issuingOrganization)} &bull; ${c.issueDate}</span>
                  </div>
                  <span class="badge ${c.status === 'VERIFIED' ? 'badge-verified' : 'badge-pending'} text-[10px]">${c.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Projects -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Projects (${report.projects.length})</h4>
            <div class="space-y-2">
              ${report.projects.map(pr => `
                <div class="p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span class="font-bold text-slate-900 block">${escapeHtml(pr.title)}</span>
                  <span class="text-[11px] text-slate-500 block mb-1">${escapeHtml(pr.technologiesUsed || '')}</span>
                  <p class="text-[10px] text-slate-400">${escapeHtml(pr.description || '')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } catch (err) {
        document.getElementById('student-modal-content').innerHTML = `
          <div class="p-4 text-center text-rose-600 text-xs">Failed to load student details: ${err.message}</div>
        `;
      }
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
