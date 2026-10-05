// Central SPA Router & Navigation Controller
import { auth } from './auth.js';
import { api } from './api.js';

// Views
import { renderLoginView } from './views/loginView.js';
import { renderRegisterView } from './views/registerView.js';
import { renderStudentDashboard } from './views/studentDashboard.js';
import { renderStudentProfile } from './views/studentProfile.js';
import { renderStudentSkills } from './views/studentSkills.js';
import { renderStudentCerts } from './views/studentCerts.js';
import { renderStudentCourses } from './views/studentCourses.js';
import { renderStudentProjects } from './views/studentProjects.js';
import { renderSkillGapAnalysis } from './views/skillGapAnalysis.js';
import { renderCareerProgress } from './views/careerProgress.js';
import { renderCareerReport } from './views/careerReport.js';

// Admin Views
import { renderAdminDashboard } from './views/adminDashboard.js';
import { renderAdminStudents } from './views/adminStudents.js';
import { renderAdminCerts } from './views/adminCerts.js';
import { renderAdminCareers } from './views/adminCareers.js';
import { renderAdminSkills } from './views/adminSkills.js';

const routes = {
  '#/login': { render: renderLoginView, guestOnly: true, title: 'Sign In', subtitle: 'Access CareerTrack' },
  '#/register': { render: renderRegisterView, guestOnly: true, title: 'Register', subtitle: 'Join CareerTrack' },

  // Student Routes
  '#/dashboard': { render: renderStudentDashboard, studentOnly: true, title: 'Student Dashboard', subtitle: 'Overview & learning metrics' },
  '#/profile': { render: renderStudentProfile, studentOnly: true, title: 'My Profile', subtitle: 'Personal & academic information' },
  '#/skills': { render: renderStudentSkills, studentOnly: true, title: 'Skills Portfolio', subtitle: 'Manage technical competencies' },
  '#/certifications': { render: renderStudentCerts, studentOnly: true, title: 'Certifications', subtitle: 'Credentials & administrative verification' },
  '#/courses': { render: renderStudentCourses, studentOnly: true, title: 'Course Tracker', subtitle: 'Track online course completions' },
  '#/projects': { render: renderStudentProjects, studentOnly: true, title: 'Project Portfolio', subtitle: 'Showcase real-world software experience' },
  '#/skill-gap': { render: renderSkillGapAnalysis, studentOnly: true, title: 'Skill Gap Analysis', subtitle: 'Career benchmark & recommendations' },
  '#/career-progress': { render: renderCareerProgress, studentOnly: true, title: 'Career Progress', subtitle: 'Employability readiness index' },
  '#/career-report': { render: renderCareerReport, studentOnly: true, title: 'Career Report', subtitle: 'Verified resume & career dossier' },

  // Admin Routes
  '#/admin/dashboard': { render: renderAdminDashboard, adminOnly: true, title: 'Admin Analytics', subtitle: 'Institutional overview & metrics' },
  '#/admin/students': { render: renderAdminStudents, adminOnly: true, title: 'Student Directory', subtitle: 'View registered students & portfolios' },
  '#/admin/certifications': { render: renderAdminCerts, adminOnly: true, title: 'Verify Certifications', subtitle: 'Review & approve student credentials' },
  '#/admin/careers': { render: renderAdminCareers, adminOnly: true, title: 'Career Roles', subtitle: 'Manage career benchmark roles' },
  '#/admin/skills': { render: renderAdminSkills, adminOnly: true, title: 'Master Skills', subtitle: 'Manage recognized technical skills' }
};

export async function navigate() {
  let hash = window.location.hash || '#/dashboard';
  if (hash === '#' || hash === '') hash = '#/dashboard';

  // Route matching
  const route = routes[hash];

  if (!route) {
    window.location.hash = auth.isAuthenticated() ? (auth.isAdmin() ? '#/admin/dashboard' : '#/dashboard') : '#/login';
    return;
  }

  // Authentication Guards
  if (!auth.isAuthenticated() && !route.guestOnly) {
    window.location.hash = '#/login';
    return;
  }

  if (auth.isAuthenticated() && route.guestOnly) {
    window.location.hash = auth.isAdmin() ? '#/admin/dashboard' : '#/dashboard';
    return;
  }

  if (route.adminOnly && !auth.isAdmin()) {
    window.location.hash = '#/dashboard';
    return;
  }

  if (route.studentOnly && auth.isAdmin()) {
    window.location.hash = '#/admin/dashboard';
    return;
  }

  // UI Shell layout visibility
  updateShellUI(hash, route);

  // Render view
  const content = document.getElementById('app-content');
  if (content) {
    route.render(content);
  }

  // Update Notification Count if logged in
  if (auth.isAuthenticated()) {
    updateNotifications();
  }
}

function updateShellUI(hash, route) {
  const sidebar = document.getElementById('sidebar');
  const topNav = document.getElementById('top-navbar');
  const studentNavGroup = document.getElementById('student-nav-group');
  const adminNavGroup = document.getElementById('admin-nav-group');

  if (!auth.isAuthenticated()) {
    sidebar?.classList.add('hidden');
    topNav?.classList.add('hidden');
    return;
  }

  sidebar?.classList.remove('hidden');
  topNav?.classList.remove('hidden');

  const user = auth.getUser() || {};
  const isAdmin = auth.isAdmin();

  if (isAdmin) {
    studentNavGroup?.classList.add('hidden');
    adminNavGroup?.classList.remove('hidden');
  } else {
    studentNavGroup?.classList.remove('hidden');
    adminNavGroup?.classList.add('hidden');
  }

  // Update titles
  const titleEl = document.getElementById('page-title');
  const subtitleEl = document.getElementById('page-subtitle');
  if (titleEl) titleEl.innerText = route.title;
  if (subtitleEl) subtitleEl.innerText = route.subtitle;

  // Update user info
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarRole = document.getElementById('sidebar-user-role');
  const topName = document.getElementById('top-user-name');
  const topBadge = document.getElementById('top-role-badge');
  const sidebarAvatar = document.getElementById('sidebar-avatar');

  if (sidebarName) sidebarName.innerText = user.fullName || 'User';
  if (sidebarRole) sidebarRole.innerText = isAdmin ? 'Administrator' : 'Student';
  if (topName) topName.innerText = user.fullName || 'User';
  if (topBadge) {
    topBadge.innerText = isAdmin ? 'ADMIN' : 'STUDENT';
    topBadge.className = isAdmin ? 'badge bg-amber-50 text-amber-800 border border-amber-200 text-[10px]' : 'badge badge-role text-[10px]';
  }
  if (sidebarAvatar && user.profileImageUrl) {
    sidebarAvatar.src = user.profileImageUrl;
  }

  // Highlight active nav item
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('href') === hash) {
      el.classList.add('bg-slate-800', 'text-white', 'shadow-inner');
      el.classList.remove('text-slate-300');
    } else {
      el.classList.remove('bg-slate-800', 'text-white', 'shadow-inner');
      el.classList.add('text-slate-300');
    }
  });

  // Close mobile sidebar on navigate
  closeMobileSidebar();
}

async function updateNotifications() {
  try {
    const res = await api.get('/notifications/unread-count');
    const badge = document.getElementById('notif-badge');
    if (badge) {
      if (res.unreadCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  } catch (e) {}
}

async function loadNotificationsDropdown() {
  const list = document.getElementById('notif-list');
  if (!list) return;

  try {
    const notifs = await api.get('/notifications');
    if (!notifs || notifs.length === 0) {
      list.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">No notifications.</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="p-3 hover:bg-slate-50 transition cursor-pointer ${!n.isRead ? 'bg-indigo-50/40' : ''}" data-id="${n.id}">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-bold text-slate-900">${escapeHtml(n.title)}</span>
          <span class="text-[10px] text-slate-400">${new Date(n.createdAt).toLocaleDateString()}</span>
        </div>
        <p class="text-[11px] text-slate-600 line-clamp-2">${escapeHtml(n.message)}</p>
      </div>
    `).join('');

    list.querySelectorAll('[data-id]').forEach(item => {
      item.addEventListener('click', async () => {
        const id = item.getAttribute('data-id');
        try {
          await api.put(`/notifications/${id}/read`);
          item.classList.remove('bg-indigo-50/40');
          updateNotifications();
        } catch (e) {}
      });
    });
  } catch (e) {
    list.innerHTML = `<div class="p-4 text-center text-xs text-rose-500">Failed to load notifications.</div>`;
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar?.classList.add('-translate-x-full');
  backdrop?.classList.add('hidden');
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar?.classList.remove('-translate-x-full');
  backdrop?.classList.remove('hidden');
}

// Global Event Listeners
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('hashchange', navigate);

  // Mobile menu buttons
  document.getElementById('open-sidebar-btn')?.addEventListener('click', openMobileSidebar);
  document.getElementById('close-sidebar-btn')?.addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);

  // Logout button
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    auth.logout();
  });

  // Notification Bell Dropdown Toggle
  const notifBtn = document.getElementById('notif-bell-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown?.classList.toggle('hidden');
    if (!notifDropdown?.classList.contains('hidden')) {
      loadNotificationsDropdown();
    }
  });

  document.getElementById('mark-all-read-btn')?.addEventListener('click', async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotificationsDropdown();
      updateNotifications();
    } catch (e) {}
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!document.getElementById('notifications-wrapper')?.contains(e.target)) {
      notifDropdown?.classList.add('hidden');
    }
  });

  // Initialize navigation
  navigate();
});

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
