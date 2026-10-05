// Login View
import { auth } from '../auth.js';

export function renderLoginView(container) {
  container.innerHTML = `
    <div class="min-h-[80vh] flex flex-col justify-center items-center py-6 px-4">
      <div class="card max-w-md w-full p-8 shadow-xl border-slate-200">
        
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30 text-2xl">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Sign In to CareerTrack</h2>
          <p class="text-xs text-slate-500 mt-1">Student Skill & Certification Tracking System</p>
        </div>

        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <i class="fa-regular fa-envelope"></i>
              </span>
              <input type="email" id="login-email" required
                placeholder="name@university.edu"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <i class="fa-solid fa-lock"></i>
              </span>
              <input type="password" id="login-password" required
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition">
            </div>
          </div>

          <button type="submit" id="login-submit-btn" class="btn btn-primary w-full py-2.5 mt-2 shadow-md shadow-indigo-500/20">
            <span>Sign In</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-100 text-center">
          <p class="text-xs text-slate-600 mb-3 font-semibold uppercase tracking-wider">Quick Demo Login</p>
          <div class="grid grid-cols-2 gap-2">
            <button id="quick-student-btn" class="btn btn-secondary btn-sm py-2 text-xs">
              <i class="fa-solid fa-user-graduate text-indigo-600"></i> John (Student)
            </button>
            <button id="quick-admin-btn" class="btn btn-secondary btn-sm py-2 text-xs">
              <i class="fa-solid fa-shield-halved text-amber-600"></i> Administrator
            </button>
          </div>
        </div>

        <div class="mt-6 text-center text-xs text-slate-500">
          Don't have an account? 
          <a href="#/register" class="text-indigo-600 font-semibold hover:underline">Register as Student</a>
        </div>

      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    try {
      const authData = await auth.login(emailInput.value, passInput.value);
      if (authData.role === 'ROLE_ADMIN') {
        window.location.hash = '#/admin/dashboard';
      } else {
        window.location.hash = '#/dashboard';
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Sign In</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
    }
  });

  document.getElementById('quick-student-btn').addEventListener('click', () => {
    emailInput.value = 'john.doe@university.edu';
    passInput.value = 'Student@123';
    form.dispatchEvent(new Event('submit'));
  });

  document.getElementById('quick-admin-btn').addEventListener('click', () => {
    emailInput.value = 'admin@system.com';
    passInput.value = 'Admin@123';
    form.dispatchEvent(new Event('submit'));
  });
}
