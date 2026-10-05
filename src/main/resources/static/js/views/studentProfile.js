// Student Profile View
import { api } from '../api.js';
import { showToast } from '../components/toast.js';
import { auth } from '../auth.js';

export async function renderStudentProfile(container) {
  container.innerHTML = `
    <div class="flex items-center justify-center py-20 text-slate-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-2"></i> Loading profile...
    </div>
  `;

  try {
    const [profile, careers] = await Promise.all([
      api.get('/students/profile'),
      api.get('/careers')
    ]);

    container.innerHTML = `
      <div class="view-container max-w-4xl mx-auto space-y-6">
        
        <!-- Header Profile Card -->
        <div class="card p-6 border-slate-200">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div class="relative group">
              <img id="profile-img-preview"
                src="${profile.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}"
                alt="Avatar" class="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-500 shadow-md">
              <label for="avatar-file-input" class="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md transition">
                <i class="fa-solid fa-camera text-xs"></i>
              </label>
              <input type="file" id="avatar-file-input" class="hidden" accept="image/*">
            </div>

            <div class="flex-1 text-center sm:text-left space-y-1">
              <h2 class="text-2xl font-bold text-slate-900">${escapeHtml(profile.fullName)}</h2>
              <p class="text-sm font-medium text-slate-500">${escapeHtml(profile.email)} &bull; ${escapeHtml(profile.studentId || 'No Student ID')}</p>
              <p class="text-xs text-indigo-600 font-semibold">${escapeHtml(profile.department || 'Department Unassigned')} &bull; ${escapeHtml(profile.academicYear || '')}</p>
              <p class="text-xs text-slate-400">${escapeHtml(profile.college || '')}</p>

              <div class="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                ${profile.githubUrl ? `<a href="${escapeHtml(profile.githubUrl)}" target="_blank" class="badge bg-slate-100 hover:bg-slate-200 text-slate-700"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
                ${profile.linkedinUrl ? `<a href="${escapeHtml(profile.linkedinUrl)}" target="_blank" class="badge bg-sky-50 hover:bg-sky-100 text-sky-700"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
                ${profile.resumeUrl ? `<a href="${escapeHtml(profile.resumeUrl)}" target="_blank" class="badge bg-emerald-50 hover:bg-emerald-100 text-emerald-700"><i class="fa-solid fa-file-pdf"></i> Resume</a>` : ''}
              </div>
            </div>

            <div class="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
              <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target Role</div>
              <span class="badge badge-role text-xs px-3 py-1 font-bold">
                ${escapeHtml(profile.targetCareerTitle || 'Not Selected')}
              </span>
            </div>
          </div>
        </div>

        <!-- Editable Form -->
        <div class="card p-6 border-slate-200">
          <div class="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Edit Profile Information</h3>
              <p class="text-xs text-slate-500">Update your academic, contact, and career preferences</p>
            </div>
            <button type="submit" form="profile-form" id="save-profile-btn" class="btn btn-primary btn-sm px-5">
              <i class="fa-solid fa-floppy-disk text-xs"></i> Save Changes
            </button>
          </div>

          <form id="profile-form" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" id="prof-name" value="${escapeHtml(profile.fullName)}" required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Student ID</label>
                <input type="text" id="prof-studentid" value="${escapeHtml(profile.studentId || '')}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                <input type="text" id="prof-dept" value="${escapeHtml(profile.department || '')}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Academic Year</label>
                <select id="prof-year"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
                  <option value="1st Year" ${profile.academicYear === '1st Year' ? 'selected' : ''}>1st Year</option>
                  <option value="2nd Year" ${profile.academicYear === '2nd Year' ? 'selected' : ''}>2nd Year</option>
                  <option value="3rd Year" ${profile.academicYear === '3rd Year' ? 'selected' : ''}>3rd Year</option>
                  <option value="4th Year" ${profile.academicYear === '4th Year' ? 'selected' : ''}>4th Year</option>
                  <option value="Postgraduate" ${profile.academicYear === 'Postgraduate' ? 'selected' : ''}>Postgraduate</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">College / University</label>
                <input type="text" id="prof-college" value="${escapeHtml(profile.college || '')}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input type="tel" id="prof-phone" value="${escapeHtml(profile.phone || '')}" placeholder="+1 (555) 000-0000"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Career Role</label>
                <select id="prof-career"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
                  <option value="">-- Select Target Career Goal --</option>
                  ${careers.map(c => `
                    <option value="${c.id}" ${profile.targetCareerId === c.id ? 'selected' : ''}>
                      ${escapeHtml(c.title)} (${escapeHtml(c.departmentFocus || 'General')})
                    </option>
                  `).join('')}
                </select>
                <p class="text-[11px] text-slate-500 mt-1">This career choice drives your Skill Gap Analysis and Recommendations.</p>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Short Bio</label>
                <textarea id="prof-bio" rows="3" placeholder="Briefly introduce your career aspirations, interests, and background..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">${escapeHtml(profile.bio || '')}</textarea>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Resume Link (URL)</label>
                <input type="url" id="prof-resume" value="${escapeHtml(profile.resumeUrl || '')}" placeholder="https://..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                <input type="url" id="prof-linkedin" value="${escapeHtml(profile.linkedinUrl || '')}" placeholder="https://linkedin.com/in/..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">GitHub Profile</label>
                <input type="url" id="prof-github" value="${escapeHtml(profile.githubUrl || '')}" placeholder="https://github.com/..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Profile Image URL</label>
                <input type="url" id="prof-imgurl" value="${escapeHtml(profile.profileImageUrl || '')}" placeholder="https://..."
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
              </div>

            </div>
          </form>
        </div>

      </div>
    `;

    // Handle avatar file upload
    const avatarInput = document.getElementById('avatar-file-input');
    const avatarPreview = document.getElementById('profile-img-preview');
    const imgUrlInput = document.getElementById('prof-imgurl');

    avatarInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        showToast('Uploading profile image...', 'info');
        const res = await api.post('/upload', formData);
        avatarPreview.src = res.fileUrl;
        imgUrlInput.value = res.fileUrl;
        showToast('Avatar uploaded successfully! Click Save Changes.', 'success');
      } catch (err) {
        // error toast already handled by api.js
      }
    });

    // Form submit
    const form = document.getElementById('profile-form');
    const saveBtn = document.getElementById('save-profile-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Saving...';

      const payload = {
        fullName: document.getElementById('prof-name').value.trim(),
        studentId: document.getElementById('prof-studentid').value.trim(),
        department: document.getElementById('prof-dept').value.trim(),
        academicYear: document.getElementById('prof-year').value,
        college: document.getElementById('prof-college').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        targetCareerId: document.getElementById('prof-career').value ? Number(document.getElementById('prof-career').value) : null,
        bio: document.getElementById('prof-bio').value.trim(),
        resumeUrl: document.getElementById('prof-resume').value.trim(),
        linkedinUrl: document.getElementById('prof-linkedin').value.trim(),
        githubUrl: document.getElementById('prof-github').value.trim(),
        profileImageUrl: imgUrlInput.value.trim()
      };

      try {
        await api.put('/students/profile', payload);
        await auth.refreshUser();
        showToast('Profile updated successfully!', 'success');
        renderStudentProfile(container);
      } catch (err) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk text-xs"></i> Save Changes';
      }
    });

  } catch (err) {
    container.innerHTML = `
      <div class="card p-8 text-center text-rose-600">
        <p class="font-semibold">Failed to load profile details.</p>
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
