// Auth State Management
import { api } from './api.js';
import { showToast } from './components/toast.js';

export const auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  setSession(authData) {
    localStorage.setItem('token', authData.token);
    this.setUser({
      id: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      studentProfileId: authData.studentProfileId
    });
  },

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'ROLE_ADMIN';
  },

  isStudent() {
    const user = this.getUser();
    return user && user.role === 'ROLE_STUDENT';
  },

  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    this.setSession(data);
    showToast(`Welcome back, ${data.fullName}!`, 'success');
    return data;
  },

  async register(registrationData) {
    const data = await api.post('/auth/register', registrationData);
    this.setSession(data);
    showToast(`Registration successful! Welcome, ${data.fullName}.`, 'success');
    return data;
  },

  async refreshUser() {
    try {
      const res = await api.get('/auth/me');
      const current = this.getUser() || {};
      if (res.fullName) {
        current.fullName = res.fullName;
      }
      if (res.profileImageUrl) {
        current.profileImageUrl = res.profileImageUrl;
      }
      this.setUser(current);
      return res;
    } catch (e) {
      console.warn('Could not refresh user session', e);
      return null;
    }
  },

  logout() {
    this.clearSession();
    showToast('Logged out successfully.', 'info');
    window.location.hash = '#/login';
  }
};
