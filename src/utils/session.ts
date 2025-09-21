// src/utils/session.ts
export function clearSession() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('UserId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userDepartment');
  } catch (e) {
    console.warn('Failed to clear session', e);
  }
}

/** Clears session and does a full redirect to login (optional) */
export function logoutAndRedirect(url = '/login') {
  clearSession();
  window.location.href = url;
}
