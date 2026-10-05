// Admin Analytics Dashboard View
import { api } from '../api.js';
import { renderBarChart, renderDoughnutChart } from '../components/charts.js';

export async function renderAdminDashboard(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading institution metrics...
    </div>
  `;

  try {
    const data = await api.get('/admin/dashboard');

    container.innerHTML = `
      <div class="view-container space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Institution Analytics & Oversight</h2>
            <p class="text-xs text-slate-500">Comprehensive overview of students, skill trends, and verification requests</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="#/admin/certifications" class="btn btn-primary btn-sm shadow-md shadow-indigo-500/20">
              <i class="fa-solid fa-clipboard-check"></i> Verification Queue (${data.pendingCertifications})
            </a>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Students</span>
            <div class="text-2xl font-black text-slate-900">${data.totalStudents}</div>
            <p class="text-[11px] text-indigo-600 mt-1">Registered users</p>
          </div>

          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Certs</span>
            <div class="text-2xl font-black text-slate-900">${data.totalCertifications}</div>
            <p class="text-[11px] text-slate-500 mt-1">Submitted</p>
          </div>

          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Verified</span>
            <div class="text-2xl font-black text-emerald-600">${data.verifiedCertifications}</div>
            <p class="text-[11px] text-emerald-600 font-semibold mt-1">Approved credentials</p>
          </div>

          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pending</span>
            <div class="text-2xl font-black text-amber-500">${data.pendingCertifications}</div>
            <p class="text-[11px] text-amber-600 font-semibold mt-1">Awaiting review</p>
          </div>

          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Courses</span>
            <div class="text-2xl font-black text-slate-900">${data.totalCourses}</div>
            <p class="text-[11px] text-sky-600 mt-1">Course enrollments</p>
          </div>

          <div class="card p-4 border-slate-200 card-hover">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Projects</span>
            <div class="text-2xl font-black text-slate-900">${data.totalProjects}</div>
            <p class="text-[11px] text-purple-600 mt-1">Showcased projects</p>
          </div>

        </div>

        <!-- Analytics Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Students by Department -->
          <div class="card p-5 border-slate-200">
            <h3 class="text-sm font-bold text-slate-900 mb-4">Students by Department</h3>
            <div class="h-64 relative">
              <canvas id="chart-admin-dept"></canvas>
            </div>
          </div>

          <!-- Students by Year -->
          <div class="card p-5 border-slate-200">
            <h3 class="text-sm font-bold text-slate-900 mb-4">Students by Academic Year</h3>
            <div class="h-64 relative">
              <canvas id="chart-admin-year"></canvas>
            </div>
          </div>

          <!-- Most Common Skills -->
          <div class="card p-5 border-slate-200">
            <h3 class="text-sm font-bold text-slate-900 mb-4">Most Common Student Skills</h3>
            <div class="h-64 relative">
              <canvas id="chart-admin-skills"></canvas>
            </div>
          </div>

        </div>

        <!-- Pending Verifications Queue Preview -->
        <div class="card p-6 border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">Pending Certification Verifications</h3>
              <p class="text-xs text-slate-500">Students awaiting administrative review of their credentials</p>
            </div>
            <a href="#/admin/certifications" class="btn btn-secondary btn-sm text-xs font-semibold">
              Open Verification Workspace &rarr;
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th class="py-3 px-4">Student</th>
                  <th class="py-3 px-4">Certification Title</th>
                  <th class="py-3 px-4">Issuing Organization</th>
                  <th class="py-3 px-4">Issue Date</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                ${(data.pendingVerificationQueue && data.pendingVerificationQueue.length) ? data.pendingVerificationQueue.map(c => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="py-3 px-4 font-semibold text-slate-900">
                      ${escapeHtml(c.studentName)}
                      <span class="block text-[10px] text-slate-400 font-normal">${escapeHtml(c.studentEmail)}</span>
                    </td>
                    <td class="py-3 px-4 font-bold text-indigo-700">${escapeHtml(c.title)}</td>
                    <td class="py-3 px-4">${escapeHtml(c.issuingOrganization)}</td>
                    <td class="py-3 px-4 text-slate-500">${c.issueDate}</td>
                    <td class="py-3 px-4 text-right">
                      <a href="#/admin/certifications" class="btn btn-primary btn-sm text-[10px] py-1 px-3">
                        Review & Verify
                      </a>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="5" class="py-6 text-center text-slate-400 font-medium">
                      <i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> All certification submissions have been reviewed!
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    // Render Department Doughnut
    const deptLabels = Object.keys(data.studentsByDepartment || {});
    const deptValues = Object.values(data.studentsByDepartment || {});
    renderDoughnutChart('chart-admin-dept', deptLabels, deptValues);

    // Render Year Bar
    const yearLabels = Object.keys(data.studentsByYear || {});
    const yearValues = Object.values(data.studentsByYear || {});
    renderBarChart('chart-admin-year', yearLabels, yearValues, 'Students', '#0ea5e9');

    // Render Top Skills Bar
    const skillLabels = (data.topSkillsAcrossStudents || []).map(s => s.skill);
    const skillValues = (data.topSkillsAcrossStudents || []).map(s => s.count);
    renderBarChart('chart-admin-skills', skillLabels, skillValues, 'Students', '#10b981');

  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load admin dashboard.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
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
