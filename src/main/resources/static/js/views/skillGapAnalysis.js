// Career Skill Gap Analysis View
import { api } from '../api.js';
import { showToast } from '../components/toast.js';

export async function renderSkillGapAnalysis(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading Career Skill Gap Engine...
    </div>
  `;

  try {
    const [careers, profile] = await Promise.all([
      api.get('/careers'),
      api.get('/students/profile')
    ]);

    if (!careers || careers.length === 0) {
      container.innerHTML = `<div class="card p-8 text-center text-slate-500">No career roles configured yet.</div>`;
      return;
    }

    // Default to student's target career or the first career
    let selectedCareerId = profile.targetCareerId || careers[0].id;

    renderGapEngine(container, careers, selectedCareerId, profile);
  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load skill gap analysis.</p>
        <p class="text-xs text-slate-500 mt-1">${err.message}</p>
      </div>
    `;
  }
}

async function renderGapEngine(container, careers, careerId, profile) {
  container.innerHTML = `
    <div class="view-container space-y-6">
      
      <!-- Page Header & Career Selector -->
      <div class="card p-6 bg-white border-slate-200">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <i class="fa-solid fa-wand-magic-sparkles"></i> AI Career Intelligence Engine
            </span>
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Career Skill Gap Analysis</h2>
            <p class="text-xs text-slate-500">Select a career pathway to compare your current skill set against industry requirements</p>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div class="min-w-[260px]">
              <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Career Role</label>
              <select id="gap-role-select" class="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white shadow-sm">
                ${careers.map(c => `
                  <option value="${c.id}" ${c.id === careerId ? 'selected' : ''}>
                    ${escapeHtml(c.title)}
                  </option>
                `).join('')}
              </select>
            </div>
            
            <div class="sm:self-end">
              <button id="set-target-career-btn" class="btn btn-secondary btn-sm h-[42px] px-4 font-semibold text-xs whitespace-nowrap">
                <i class="fa-solid fa-bookmark text-indigo-600"></i> Set as Target
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Results Container -->
      <div id="gap-results-container">
        <div class="flex items-center justify-center py-16 text-slate-400">
          <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Analyzing competencies...
        </div>
      </div>

    </div>
  `;

  const roleSelect = document.getElementById('gap-role-select');
  const targetBtn = document.getElementById('set-target-career-btn');

  roleSelect.addEventListener('change', () => {
    loadAnalysisData(Number(roleSelect.value));
  });

  targetBtn.addEventListener('click', async () => {
    const roleId = Number(roleSelect.value);
    try {
      await api.put(`/students/target-career/${roleId}`);
      showToast('Set as your primary target career!', 'success');
      targetBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i> Current Target';
      targetBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
    } catch (e) {}
  });

  await loadAnalysisData(careerId);
}

async function loadAnalysisData(careerId) {
  const container = document.getElementById('gap-results-container');
  if (!container) return;

  try {
    const data = await api.get(`/career-analysis/${careerId}`);

    const matchPct = data.skillMatchPercentage;
    let matchColor = 'text-amber-500';
    let matchBg = 'bg-amber-50 border-amber-200';
    let ringStroke = '#f59e0b';

    if (matchPct >= 75) {
      matchColor = 'text-emerald-600';
      matchBg = 'bg-emerald-50 border-emerald-200';
      ringStroke = '#10b981';
    } else if (matchPct < 40) {
      matchColor = 'text-rose-600';
      matchBg = 'bg-rose-50 border-rose-200';
      ringStroke = '#ef4444';
    }

    // Circumference for 45 radius circle = 2 * PI * 45 ≈ 282.74
    const circumference = 282.74;
    const strokeDashoffset = circumference - (matchPct / 100) * circumference;

    container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Score Overview Banner -->
        <div class="card p-6 border-slate-200">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div class="flex items-center gap-6">
              <!-- SVG Gauge -->
              <div class="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"></circle>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="${ringStroke}" stroke-width="8"
                    stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
                    stroke-linecap="round" class="transition-all duration-1000 ease-out"></circle>
                </svg>
                <div class="absolute flex flex-col items-center">
                  <span class="text-2xl font-black ${matchColor}">${matchPct}%</span>
                  <span class="text-[9px] uppercase tracking-wider font-bold text-slate-400">Match</span>
                </div>
              </div>

              <div>
                <h3 class="text-xl font-bold text-slate-900">${escapeHtml(data.careerRoleTitle)}</h3>
                <p class="text-xs text-slate-500 max-w-lg mt-1">${escapeHtml(data.careerRoleDescription || 'Predefined career benchmark profile')}</p>
                <div class="flex items-center gap-4 mt-3 text-xs font-semibold text-slate-600">
                  <span><i class="fa-solid fa-list-check text-indigo-500 mr-1"></i> ${data.totalRequiredSkills} Required Skills</span>
                  <span><i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> ${data.alreadyAcquired.length} Acquired</span>
                  <span><i class="fa-solid fa-circle-exclamation text-amber-500 mr-1"></i> ${data.needsImprovement.length} Needs Focus</span>
                  <span><i class="fa-solid fa-circle-xmark text-rose-500 mr-1"></i> ${data.missingSkills.length} Missing</span>
                </div>
              </div>
            </div>

            <!-- Readiness Badge Card -->
            <div class="p-4 rounded-xl border ${matchBg} text-center md:text-right w-full md:w-auto">
              <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Employability Status</span>
              <span class="text-sm font-extrabold ${matchColor} block">
                ${matchPct >= 80 ? '🌟 Highly Qualified for Entry' : matchPct >= 50 ? '⚡ Strong Foundations / Good Trajectory' : '🌱 Early Stage Learning Required'}
              </span>
              <span class="text-xs text-slate-500 block mt-0.5">
                ${matchPct >= 80 ? 'Ready for technical interviews' : 'Focus on the missing & improvement areas'}
              </span>
            </div>

          </div>
        </div>

        <!-- 3 Pillars Breakdown: Acquired, Needs Improvement, Missing -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Column 1: Already Acquired -->
          <div class="card p-5 border-emerald-200/80 bg-emerald-50/20 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-check"></i>
                  </span>
                  <h4 class="font-bold text-slate-900 text-sm">Already Acquired</h4>
                </div>
                <span class="badge bg-emerald-100 text-emerald-800 text-[11px]">${data.alreadyAcquired.length}</span>
              </div>

              <div class="space-y-3">
                ${data.alreadyAcquired.length > 0 ? data.alreadyAcquired.map(s => `
                  <div class="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-slate-900 text-xs">${escapeHtml(s.skillName)}</span>
                      <span class="text-[11px] font-bold text-emerald-600">${s.currentProficiency}%</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${s.currentProficiency}%"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-slate-400 mt-1.5">
                      <span>Level: ${s.studentLevel}</span>
                      <span>Target: ${s.requiredLevel}</span>
                    </div>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400 py-6 text-center italic">No required skills acquired yet.</p>'}
              </div>
            </div>

            <p class="text-[11px] text-emerald-700/80 mt-4 text-center">✓ Meets or exceeds required proficiency</p>
          </div>

          <!-- Column 2: Needs Improvement -->
          <div class="card p-5 border-amber-200/80 bg-amber-50/20 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </span>
                  <h4 class="font-bold text-slate-900 text-sm">Needs Improvement</h4>
                </div>
                <span class="badge bg-amber-100 text-amber-800 text-[11px]">${data.needsImprovement.length}</span>
              </div>

              <div class="space-y-3">
                ${data.needsImprovement.length > 0 ? data.needsImprovement.map(s => `
                  <div class="p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-slate-900 text-xs">${escapeHtml(s.skillName)}</span>
                      <span class="text-[11px] font-bold text-amber-600">${s.currentProficiency}% <span class="text-slate-400">/ ${s.requiredProficiency}%</span></span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${s.currentProficiency}%"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>Current: ${s.studentLevel}</span>
                      <span class="font-semibold text-amber-700">Target: ${s.requiredLevel}</span>
                    </div>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400 py-6 text-center italic">No skills needing partial improvement.</p>'}
              </div>
            </div>

            <p class="text-[11px] text-amber-700/80 mt-4 text-center">⚠ In portfolio, but below role threshold</p>
          </div>

          <!-- Column 3: Missing Skills -->
          <div class="card p-5 border-rose-200/80 bg-rose-50/20 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-xmark"></i>
                  </span>
                  <h4 class="font-bold text-slate-900 text-sm">Missing Skills</h4>
                </div>
                <span class="badge bg-rose-100 text-rose-800 text-[11px]">${data.missingSkills.length}</span>
              </div>

              <div class="space-y-3">
                ${data.missingSkills.length > 0 ? data.missingSkills.map(s => `
                  <div class="p-3 bg-white rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p class="font-bold text-slate-900 text-xs">${escapeHtml(s.skillName)}</p>
                      <span class="text-[10px] text-rose-600 font-semibold">Required: ${s.requiredLevel}</span>
                    </div>
                    <a href="#/skills" class="btn btn-secondary btn-sm text-[10px] py-1 px-2.5">
                      <i class="fa-solid fa-plus text-[9px]"></i> Add
                    </a>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400 py-6 text-center italic">No missing skills! Excellent job.</p>'}
              </div>
            </div>

            <p class="text-[11px] text-rose-700/80 mt-4 text-center">✗ Not yet present in your skills portfolio</p>
          </div>

        </div>

        <!-- Curated Recommendations Section -->
        <div class="card p-6 border-slate-200">
          <div class="border-b border-slate-100 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-base font-bold text-slate-900">Recommended Courses & Certifications</h3>
              <p class="text-xs text-slate-500">Curated learning pathways tailored to bridge your specific skill gaps for ${escapeHtml(data.careerRoleTitle)}</p>
            </div>
            <span class="badge bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs">
              ${data.recommendedCourses.length + data.recommendedCertifications.length} Recommendations Available
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Courses Recommendations -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-graduation-cap text-sky-500"></i> Recommended Courses (${data.recommendedCourses.length})
              </h4>
              <div class="space-y-3">
                ${data.recommendedCourses.length > 0 ? data.recommendedCourses.map(r => `
                  <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition shadow-sm">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <span class="badge bg-sky-50 text-sky-700 text-[10px] font-semibold">${escapeHtml(r.provider)}</span>
                      <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1"></i>${escapeHtml(r.estimatedDuration || 'Self-paced')}</span>
                    </div>
                    <h5 class="font-bold text-slate-900 text-xs leading-snug mb-2">${escapeHtml(r.title)}</h5>
                    ${r.skillName ? `<span class="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium mb-3">Target Skill: ${escapeHtml(r.skillName)}</span>` : ''}
                    <div>
                      <a href="${escapeHtml(r.url || '#')}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1 px-3 w-full justify-center">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Explore Course
                      </a>
                    </div>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No specific course recommendations needed.</p>'}
              </div>
            </div>

            <!-- Certifications Recommendations -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-award text-amber-500"></i> Recommended Certifications (${data.recommendedCertifications.length})
              </h4>
              <div class="space-y-3">
                ${data.recommendedCertifications.length > 0 ? data.recommendedCertifications.map(r => `
                  <div class="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition shadow-sm">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <span class="badge bg-amber-50 text-amber-700 text-[10px] font-semibold">${escapeHtml(r.provider)}</span>
                      <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1"></i>${escapeHtml(r.estimatedDuration || 'Exam based')}</span>
                    </div>
                    <h5 class="font-bold text-slate-900 text-xs leading-snug mb-2">${escapeHtml(r.title)}</h5>
                    ${r.skillName ? `<span class="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium mb-3">Target Skill: ${escapeHtml(r.skillName)}</span>` : ''}
                    <div>
                      <a href="${escapeHtml(r.url || '#')}" target="_blank" class="btn btn-secondary btn-sm text-[11px] py-1 px-3 w-full justify-center">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Certification Guide
                      </a>
                    </div>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No specific certification recommendations needed.</p>'}
              </div>
            </div>

          </div>
        </div>

      </div>
    `;

  } catch (err) {
    container.innerHTML = `
      <div class="card p-6 text-center text-rose-600">
        <p class="font-semibold">Failed to analyze skill gap for this role.</p>
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
