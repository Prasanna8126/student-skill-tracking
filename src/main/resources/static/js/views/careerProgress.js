// Career Progress & Employability Readiness View
import { api } from '../api.js';

export async function renderCareerProgress(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Calculating career readiness index...
    </div>
  `;

  try {
    const progress = await api.get('/career-progress');

    let badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    let ringColor = 'text-amber-500';

    if (progress.careerReadinessScore >= 80) {
      badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      ringColor = 'text-emerald-500';
    } else if (progress.careerReadinessScore < 40) {
      badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
      ringColor = 'text-rose-500';
    }

    container.innerHTML = `
      <div class="view-container max-w-5xl mx-auto space-y-6">
        
        <!-- Header Hero -->
        <div class="card p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <span class="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
                Career Target: ${escapeHtml(progress.targetCareerTitle || 'Not Set')}
              </span>
              <h2 class="text-3xl font-extrabold tracking-tight">Career Readiness & Milestones</h2>
              <p class="text-slate-300 text-sm max-w-xl">
                Composite evaluation of your verified skills, industry certifications, portfolio projects, and technical courses.
              </p>
            </div>

            <!-- Big Circular Readiness Gauge -->
            <div class="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <div class="text-center">
                <span class="text-4xl font-black ${ringColor} block">${progress.careerReadinessScore}%</span>
                <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Career Readiness</span>
              </div>
              <div class="border-l border-white/10 pl-4 text-left">
                <span class="badge ${badgeBg} text-[10px] font-bold block mb-1">
                  ${escapeHtml(progress.readinessCategory)}
                </span>
                <span class="text-[11px] text-slate-300 block">Based on 4-pillar index</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Readiness Pillars Breakdown Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="card p-5 border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">1. Skill Match</span>
                <i class="fa-solid fa-layer-group text-indigo-500"></i>
              </div>
              <div class="text-2xl font-black text-slate-900">${progress.skillMatchPercentage}%</div>
              <p class="text-xs text-slate-500 mt-1">${progress.totalSkillsOwned} acquired / ${progress.skillsRemainingCount} gaps</p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${progress.skillMatchPercentage}%"></div>
            </div>
          </div>

          <div class="card p-5 border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">2. Verified Certs</span>
                <i class="fa-solid fa-certificate text-emerald-500"></i>
              </div>
              <div class="text-2xl font-black text-slate-900">${progress.verifiedCertifications} <span class="text-xs font-normal text-slate-400">/ 3 Goal</span></div>
              <p class="text-xs text-emerald-600 font-medium mt-1">Admin Verified</p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${Math.min(100, (progress.verifiedCertifications / 3) * 100)}%"></div>
            </div>
          </div>

          <div class="card p-5 border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">3. Projects Built</span>
                <i class="fa-solid fa-diagram-project text-purple-500"></i>
              </div>
              <div class="text-2xl font-black text-slate-900">${progress.completedProjects} <span class="text-xs font-normal text-slate-400">/ 3 Goal</span></div>
              <p class="text-xs text-slate-500 mt-1">Completed portfolio items</p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div class="bg-purple-600 h-1.5 rounded-full" style="width: ${Math.min(100, (progress.completedProjects / 3) * 100)}%"></div>
            </div>
          </div>

          <div class="card p-5 border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-slate-400 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">4. Courses Finished</span>
                <i class="fa-solid fa-book-open text-sky-500"></i>
              </div>
              <div class="text-2xl font-black text-slate-900">${progress.completedCourses} <span class="text-xs font-normal text-slate-400">/ 3 Goal</span></div>
              <p class="text-xs text-slate-500 mt-1">Completed curricula</p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div class="bg-sky-500 h-1.5 rounded-full" style="width: ${Math.min(100, (progress.completedCourses / 3) * 100)}%"></div>
            </div>
          </div>

        </div>

        <!-- Career Milestones List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div class="card p-6 border-slate-200">
            <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-emerald-500"></i>
              Acquired Qualifications (${progress.acquiredSkills ? progress.acquiredSkills.length : 0})
            </h3>
            <div class="space-y-2.5">
              ${(progress.acquiredSkills && progress.acquiredSkills.length) ? progress.acquiredSkills.map(s => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span class="font-bold text-slate-800">${escapeHtml(s.skillName)}</span>
                  <div class="flex items-center gap-2">
                    <span class="badge badge-advanced text-[10px]">${s.studentLevel}</span>
                    <span class="font-bold text-emerald-600">${s.currentProficiency}%</span>
                  </div>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">No skills acquired matching target role.</p>'}
            </div>
          </div>

          <div class="card p-6 border-slate-200">
            <h3 class="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-hourglass-start text-amber-500"></i>
              Skills Remaining to Master (${progress.pendingSkills ? progress.pendingSkills.length : 0})
            </h3>
            <div class="space-y-2.5">
              ${(progress.pendingSkills && progress.pendingSkills.length) ? progress.pendingSkills.map(s => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span class="font-bold text-slate-800 block">${escapeHtml(s.skillName)}</span>
                    <span class="text-[10px] text-slate-400">Target: ${s.requiredLevel} (${s.requiredProficiency}%)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold ${s.currentProficiency > 0 ? 'text-amber-600' : 'text-rose-500'}">
                      ${s.currentProficiency > 0 ? `${s.currentProficiency}%` : 'Missing'}
                    </span>
                    <a href="#/skills" class="btn btn-secondary btn-sm text-[10px] py-1 px-2">Update</a>
                  </div>
                </div>
              `).join('') : '<p class="text-xs text-slate-400 py-4 text-center">All required skills mastered!</p>'}
            </div>
          </div>

        </div>

      </div>
    `;

  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to compute career progress.</p>
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
