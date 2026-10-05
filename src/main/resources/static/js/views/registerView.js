// Student Registration View
import { auth } from '../auth.js';

export function renderRegisterView(container) {
  container.innerHTML = `
    <div class="min-h-[85vh] flex flex-col justify-center items-center py-6 px-4">
      <div class="card max-w-xl w-full p-8 shadow-xl border-slate-200">
        
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-indigo-500/30 text-xl">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Create Student Account</h2>
          <p class="text-xs text-slate-500 mt-1">Start tracking your skills, certifications, and career gap analysis</p>
        </div>

        <form id="register-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
              <input type="text" id="reg-name" required placeholder="e.g. Alex Johnson"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
              <input type="email" id="reg-email" required placeholder="alex@university.edu"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Password *</label>
              <input type="password" id="reg-password" required minlength="6" placeholder="Min. 6 characters"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Student ID</label>
              <input type="text" id="reg-studentid" placeholder="e.g. STU-2024-105"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Department</label>
              <select id="reg-dept"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="General Science / MCA">General Science / MCA</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Academic Year</label>
              <select id="reg-year"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition bg-white">
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year" selected>3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">College / University</label>
              <input type="text" id="reg-college" placeholder="e.g. Institute of Technology"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>

          </div>

          <button type="submit" id="reg-submit-btn" class="btn btn-primary w-full py-2.5 mt-4 shadow-md shadow-indigo-500/20">
            <span>Create Account</span>
            <i class="fa-solid fa-user-check text-xs"></i>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          Already have an account? 
          <a href="#/login" class="text-indigo-600 font-semibold hover:underline">Sign In</a>
        </div>

      </div>
    </div>
  `;

  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('reg-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

    const payload = {
      fullName: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      studentId: document.getElementById('reg-studentid').value.trim(),
      department: document.getElementById('reg-dept').value,
      academicYear: document.getElementById('reg-year').value,
      college: document.getElementById('reg-college').value.trim()
    };

    try {
      await auth.register(payload);
      window.location.hash = '#/dashboard';
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Create Account</span> <i class="fa-solid fa-user-check text-xs"></i>';
    }
  });
}
