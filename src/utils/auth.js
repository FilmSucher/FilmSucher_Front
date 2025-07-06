export function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1]; // base64 payload
    const decoded = JSON.parse(atob(payload));
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}