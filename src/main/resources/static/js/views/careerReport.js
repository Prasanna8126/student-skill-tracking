// Student Career Report View (Printable & PDF Export)
import { api } from '../api.js';
import { showToast } from '../components/toast.js';

export async function renderCareerReport(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Compiling career dossier report...
    </div>
  `;

  try {
    const report = await api.get('/reports/student');
    const p = report.profile || {};
    const gap = report.skillGapAnalysis || {};
    const progress = report.careerProgress || {};
    const targetCareer = report.targetCareer || {};

    container.innerHTML = `
      <div class="view-container max-w-4xl mx-auto space-y-6">
        
        <!-- Action Header -->
        <div class="flex items-center justify-between no-print">
          <div>
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">Student Career & Skill Report</h2>
            <p class="text-xs text-slate-500">Official comprehensive technical assessment dossier</p>
          </div>
          <div class="flex items-center gap-3">
            <button id="print-report-btn" class="btn btn-secondary btn-sm shadow-sm">
              <i class="fa-solid fa-print"></i> Print
            </button>
            <button id="export-pdf-btn" class="btn btn-primary btn-sm shadow-md shadow-indigo-500/20">
              <i class="fa-solid fa-file-pdf"></i> Download PDF Report
            </button>
          </div>
        </div>

        <!-- Printable Document Canvas -->
        <div id="career-report-document" class="card p-8 sm:p-12 bg-white border border-slate-300 shadow-xl space-y-8 text-slate-800">
          
          <!-- Report Header -->
          <div class="border-b-2 border-indigo-600 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  <i class="fa-solid fa-graduation-cap"></i>
                </span>
                <span class="text-xs uppercase font-extrabold tracking-wider text-indigo-700">CareerTrack Verified Academic Portfolio</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">${escapeHtml(p.fullName || 'Student Name')}</h1>
              <p class="text-xs text-slate-500 mt-0.5">
                ${escapeHtml(p.department || '')} &bull; ${escapeHtml(p.academicYear || '')} &bull; ${escapeHtml(p.college || '')}
              </p>
            </div>

            <div class="text-left sm:text-right text-xs text-slate-500 space-y-1">
              <div><strong class="text-slate-700">Student ID:</strong> ${escapeHtml(p.studentId || 'N/A')}</div>
              <div><strong class="text-slate-700">Email:</strong> ${escapeHtml(p.email || '')}</div>
              <div><strong class="text-slate-700">Report Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <!-- Executive Summary & Career Goal -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Career</span>
              <span class="text-base font-extrabold text-indigo-700 block mt-0.5">${escapeHtml(targetCareer.title || 'General Software Engineering')}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Skill Match Score</span>
              <span class="text-base font-extrabold text-slate-900 block mt-0.5">${gap.skillMatchPercentage || 0}% Match</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Career Readiness</span>
              <span class="text-base font-extrabold text-emerald-600 block mt-0.5">${progress.careerReadinessScore || 0}% (${progress.readinessCategory || 'Evaluated'})</span>
            </div>
          </div>

          <!-- Section 1: Skills Inventory -->
          <div>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              1. Technical Skills Inventory (${report.skills ? report.skills.length : 0})
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${(report.skills && report.skills.length) ? report.skills.map(s => `
                <div class="p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                  <div class="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>${escapeHtml(s.skillName)}</span>
                    <span class="text-indigo-600">${s.proficiency}%</span>
                  </div>
                  <div class="flex justify-between text-[10px] text-slate-500">
                    <span>${escapeHtml(s.category)}</span>
                    <span class="font-medium">${s.skillLevel}</span>
                  </div>
                </div>
              `).join('') : '<p class="text-xs text-slate-400">No skills documented.</p>'}
            </div>
          </div>

          <!-- Section 2: Verified Certifications -->
          <div>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              2. Certifications & Credentials (${report.certifications ? report.certifications.length : 0})
            </h3>
            <div class="space-y-2">
              ${(report.certifications && report.certifications.length) ? report.certifications.map(c => `
                <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span class="font-bold text-slate-900 block">${escapeHtml(c.title)}</span>
                    <span class="text-[11px] text-slate-500">${escapeHtml(c.issuingOrganization)} &bull; Issued: ${c.issueDate}</span>
                  </div>
                  <span class="badge ${c.status === 'VERIFIED' ? 'badge-verified' : 'badge-pending'} text-[10px]">
                    ${c.status}
                  </span>
                </div>
              `).join('') : '<p class="text-xs text-slate-400">No certifications recorded.</p>'}
            </div>
          </div>

          <!-- Section 3: Completed Projects & Experience -->
          <div>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              3. Practical Projects & Experience (${report.projects ? report.projects.length : 0})
            </h3>
            <div class="space-y-3">
              ${(report.projects && report.projects.length) ? report.projects.map(proj => `
                <div class="p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div class="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>${escapeHtml(proj.title)}</span>
                    <span class="text-[10px] uppercase text-indigo-600">${proj.status}</span>
                  </div>
                  <p class="text-slate-600 text-[11px] mb-1.5">${escapeHtml(proj.description || '')}</p>
                  <p class="text-[10px] text-slate-400"><strong class="text-slate-600">Tech Stack:</strong> ${escapeHtml(proj.technologiesUsed || 'N/A')}</p>
                </div>
              `).join('') : '<p class="text-xs text-slate-400">No projects recorded.</p>'}
            </div>
          </div>

          <!-- Section 4: Gap Analysis & Recommendations -->
          <div>
            <h3 class="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
              4. Skill Gap Analysis & Recommended Next Steps
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <span class="font-bold text-amber-900 block mb-2"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Skills to Improve / Missing:</span>
                <ul class="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  ${gap.missingSkills ? gap.missingSkills.map(m => `<li>Missing: <strong>${escapeHtml(m.skillName)}</strong> (Required: ${m.requiredLevel})</li>`).join('') : ''}
                  ${gap.needsImprovement ? gap.needsImprovement.map(i => `<li>Focus: <strong>${escapeHtml(i.skillName)}</strong> (Current: ${i.currentProficiency}%, Required: ${i.requiredProficiency}%)</li>`).join('') : ''}
                </ul>
              </div>

              <div class="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
                <span class="font-bold text-indigo-900 block mb-2"><i class="fa-solid fa-graduation-cap mr-1"></i> Recommended Curricula:</span>
                <ul class="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  ${(gap.recommendedCourses && gap.recommendedCourses.length) ? gap.recommendedCourses.slice(0, 3).map(rc => `<li>Course: ${escapeHtml(rc.title)} (${escapeHtml(rc.provider)})</li>`).join('') : '<li>No urgent courses needed.</li>'}
                  ${(gap.recommendedCertifications && gap.recommendedCertifications.length) ? gap.recommendedCertifications.slice(0, 2).map(rct => `<li>Cert: ${escapeHtml(rct.title)} (${escapeHtml(rct.provider)})</li>`).join('') : ''}
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer Signature -->
          <div class="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
            <p>Generated by CareerTrack Student Career Management Platform &bull; System Verified Portfolio Dossier</p>
          </div>

        </div>

      </div>
    `;

    // Handle Print
    document.getElementById('print-report-btn').addEventListener('click', () => {
      window.print();
    });

    // Handle PDF Download with html2pdf.js
    document.getElementById('export-pdf-btn').addEventListener('click', () => {
      const element = document.getElementById('career-report-document');
      const studentName = (p.fullName || 'Student').replace(/\s+/g, '_');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Career_Report_${studentName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      showToast('Generating official PDF report...', 'info');
      // @ts-ignore
      html2pdf().set(opt).from(element).save()
        .then(() => showToast('PDF downloaded successfully!', 'success'))
        .catch(() => showToast('Error generating PDF.', 'error'));
    });

  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to compile career report.</p>
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
