export function clearLocalStorage() {
  localStorage.clear('token');
  localStorage.clear('tokenExpiry');
  localStorage.clear('userFullName');
  localStorage.clear('userEmail');
}

export function isTokenExpired() {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (tokenExpiry && tokenExpiry <= Date.now()) {
    return true;
  }

  return false;
}
