// Student Dashboard View
import { api } from '../api.js';
import { renderDoughnutChart, renderBarChart } from '../components/charts.js';

export async function renderStudentDashboard(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading dashboard metrics...
    </div>
  `;

  try {
    const stats = await api.get('/student/dashboard-stats');

    container.innerHTML = `
      <div class="view-container space-y-6">
        
        <!-- Welcome Banner -->
        <div class="card p-6 bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="inline-block px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-2 uppercase tracking-wider">
                ${stats.department || 'Student Dashboard'}
              </span>
              <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, ${escapeHtml(stats.studentName)}! 👋</h2>
              <p class="text-indigo-100 text-sm mt-1 max-w-xl">
                Targeting <span class="font-bold underline text-white">${escapeHtml(stats.targetCareerTitle || 'Not Selected')}</span>.
                ${stats.careerSkillMatch > 0 ? `Your current career skill match is ${stats.careerSkillMatch}%.` : 'Explore skill gap analysis to identify learning opportunities.'}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <a href="#/skill-gap" class="btn bg-white text-indigo-700 hover:bg-indigo-50 shadow-md font-bold text-sm px-4 py-2.5">
                <i class="fa-solid fa-chart-pie text-amber-500"></i> Skill Gap Analysis
              </a>
              <a href="#/career-report" class="btn bg-indigo-800/80 hover:bg-indigo-900 text-white font-semibold text-sm px-4 py-2.5 border border-white/20">
                <i class="fa-solid fa-file-pdf text-sky-300"></i> Career Report
              </a>
            </div>
          </div>
          <!-- Decorative background circles -->
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <!-- 6 KPI Stat Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
          
          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Skills</span>
              <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-layer-group"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.totalSkills}</div>
            <p class="text-[11px] text-slate-500 mt-1">Acquired skills</p>
          </div>

          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Certifications</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-certificate"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.verifiedCertifications} <span class="text-xs font-normal text-slate-400">/ ${stats.totalCertifications}</span></div>
            <p class="text-[11px] text-emerald-600 font-medium mt-1">${stats.verifiedCertifications} Verified</p>
          </div>

          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Courses Done</span>
              <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-book-open"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.coursesCompleted} <span class="text-xs font-normal text-slate-400">/ ${stats.totalCourses}</span></div>
            <p class="text-[11px] text-slate-500 mt-1">Completed courses</p>
          </div>

          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Projects Done</span>
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-diagram-project"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.projectsCompleted} <span class="text-xs font-normal text-slate-400">/ ${stats.totalProjects}</span></div>
            <p class="text-[11px] text-slate-500 mt-1">Portfolio projects</p>
          </div>

          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Learning Index</span>
              <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-bolt"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.overallLearningProgress}%</div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${stats.overallLearningProgress}%"></div>
            </div>
          </div>

          <div class="card p-4 card-hover">
            <div class="flex items-center justify-between text-slate-400 mb-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Career Match</span>
              <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-bullseye"></i>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900">${stats.careerSkillMatch}%</div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-rose-500 h-1.5 rounded-full" style="width: ${stats.careerSkillMatch}%"></div>
            </div>
          </div>

        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div class="card p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900">Skill Distribution by Category</h3>
              <a href="#/skills" class="text-xs font-semibold text-indigo-600 hover:underline">Manage Skills &rarr;</a>
            </div>
            <div class="h-64 relative">
              <canvas id="chart-skills-cat"></canvas>
            </div>
          </div>

          <div class="card p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900">Skill Levels Breakdown</h3>
              <a href="#/skills" class="text-xs font-semibold text-indigo-600 hover:underline">View All &rarr;</a>
            </div>
            <div class="h-64 relative">
              <canvas id="chart-skills-lvl"></canvas>
            </div>
          </div>

        </div>

        <!-- Recent Activities & Portfolio Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Recent Certifications -->
          <div class="card p-5 lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900">Recent Certifications</h3>
              <a href="#/certifications" class="text-xs font-semibold text-indigo-600 hover:underline">View All &rarr;</a>
            </div>
            <div class="space-y-3">
              ${(stats.recentCertifications && stats.recentCertifications.length) ? stats.recentCertifications.map(c => `
                <div class="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div class="min-w-0 pr-2">
                    <p class="text-xs font-bold text-slate-900 truncate">${escapeHtml(c.title)}</p>
                    <p class="text-[11px] text-slate-500 truncate">${escapeHtml(c.issuingOrganization)}</p>
                  </div>
                  <span class="badge ${c.status === 'VERIFIED' ? 'badge-verified' : c.status === 'PENDING' ? 'badge-pending' : 'badge-expired'} text-[10px]">
                    ${c.status}
                  </span>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No certifications added yet.</p>'}
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="card p-5 lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900">Recent Projects</h3>
              <a href="#/projects" class="text-xs font-semibold text-indigo-600 hover:underline">View All &rarr;</a>
            </div>
            <div class="space-y-3">
              ${(stats.recentProjects && stats.recentProjects.length) ? stats.recentProjects.map(p => `
                <div class="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div class="flex items-center justify-between mb-1">
                    <p class="text-xs font-bold text-slate-900 truncate">${escapeHtml(p.title)}</p>
                    <span class="text-[10px] uppercase font-bold text-indigo-600">${p.status}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 line-clamp-1 mb-2">${escapeHtml(p.technologiesUsed || 'Technologies not specified')}</p>
                  ${p.githubUrl ? `
                    <a href="${escapeHtml(p.githubUrl)}" target="_blank" class="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600">
                      <i class="fa-brands fa-github"></i> Repository &rarr;
                    </a>
                  ` : ''}
                </div>
              `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No projects added yet.</p>'}
            </div>
          </div>

          <!-- In-Progress Courses -->
          <div class="card p-5 lg:col-span-1">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900">Courses In Progress</h3>
              <a href="#/courses" class="text-xs font-semibold text-indigo-600 hover:underline">View All &rarr;</a>
            </div>
            <div class="space-y-3">
              ${(stats.inProgressCourses && stats.inProgressCourses.length) ? stats.inProgressCourses.map(co => `
                <div class="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p class="text-xs font-bold text-slate-900 truncate mb-1">${escapeHtml(co.title)}</p>
                  <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>${escapeHtml(co.platform)}</span>
                    <span class="font-bold text-indigo-600">${co.progressPercentage}%</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${co.progressPercentage}%"></div>
                  </div>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No active courses in progress.</p>'}
            </div>
          </div>

        </div>

      </div>
    `;

    // Render Charts
    const catLabels = Object.keys(stats.skillsByCategory || {});
    const catValues = Object.values(stats.skillsByCategory || {});
    renderDoughnutChart('chart-skills-cat', catLabels, catValues);

    const lvlLabels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
    const lvlValues = lvlLabels.map(l => (stats.skillsByLevel && stats.skillsByLevel[l]) || 0);
    renderBarChart('chart-skills-lvl', lvlLabels, lvlValues, 'Skill Count', '#6366f1');

  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
        <p class="font-semibold">Failed to load dashboard metrics.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
        <button class="btn btn-secondary btn-sm mt-4" onclick="window.location.reload()">Retry</button>
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
