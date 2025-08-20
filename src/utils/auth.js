import { ref } from 'vue';

const isAuthenticated = ref(!!localStorage.getItem('token'));

export function login(token, username) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  isAuthenticated.value = true;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  isAuthenticated.value = false;
}

export function useAuth() {
  return { isAuthenticated };
}

export function getRoleFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1]; // base64 payload
    const decoded = JSON.parse(atob(payload));

    // debugs logging
    if (decoded.iat) {
      console.log("Issued at (iat):", new Date(decoded.iat * 1000).toLocaleString());
    }
    if (decoded.exp) {
      console.log("Expires (exp):", new Date(decoded.exp * 1000).toLocaleString());
    }
    console.log("Full decoded payload:", decoded);

    const exp = decoded.exp;
    if (Date.now() >= exp * 1000) return null;
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}