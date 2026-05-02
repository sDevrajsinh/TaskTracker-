// src/components/auth/LoginOverlay.jsx
import { useState } from 'react';
import { loginWithGoogle } from '../../firebase/auth';
import { useAppContext } from '../../context/AppContext';

export default function LoginOverlay() {
  const { showToast } = useAppContext();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login Error:', err);
      let msg = 'Login failed. Check your connection.';
      if (err.code === 'auth/unauthorized-domain') msg = 'Domain not authorized in Firebase Console.';
      else if (err.code === 'auth/popup-closed-by-user') msg = 'Login popup closed. Please try again.';
      else if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your internet.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-logo">
          <i className="fas fa-bolt" />
        </div>
        <h2>Welcome Back</h2>
        <p>Track your goals together with TaskTracker Pro.<br />Sign in to sync your tasks across all devices.</p>
        <div className="login-divider">or continue with</div>
        <button id="google-login-btn" className="google-btn" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMjQgOS41YzMuNTQgMCA2LjcxIDEuMjIgOS4yMSAzLjZsNi44NS02Ljg1QzM1LjkgMi4zOCAzMC40NyAwIDI0IDAgMTQuNjIgMCA2LjUxIDUuMzggMi41NiAxMy4yMmw3Ljk4IDYuMTlDMTIuNDMgMTMuNzIgMTcuNzQgOS41IDI0IDkuNXoiLz48cGF0aCBmaWxsPSIjNDI4NUY0IiBkPSJNNDYuOTggMjQuNTVjMC0xLjU3LS4xNS0zLjA5LS4zOC00LjU1SDI0djkuMDJoMTIuOTRjLS41OCAyLjk2LTIuMjYgNS40OC00Ljc4IDcuMThsNy43MyA2YzQuNTEtNC4xOCA3LjA5LTEwLjM2IDcuMDktMTcuNjV6Ii8+PHBhdGggZmlsbD0iI0ZCQkMwNSIgZD0iTTEwLjUzIDI4LjU5Yy0uNDgtMS40NS0uNzYtMi45OS0uNzYtNC41OXMuMjctMy4xNC43Ni00LjU5bC03Ljk4LTYuMTlDLjkyIDE2LjQ2IDAgMjAuMTIgMCAyNHMuOTIgNy41NCAyLjU2IDEwLjc4bDcuOTctNi4xOXoiLz48cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMjQgNDhjNi40OCAwIDExLjkzLTIuMTMgMTUuODktNS44MWwtNy43My02Yy0yLjE1IDEuNDUtNC45MiAyLjMtOC4xNiAyLjMtNi4yNiAwLTExLjU3LTQuMjItMTMuNDctOS45MWwtNy45OCA2LjE5QzYuNTEgNDIuNjIgMTQuNjIgNDggMjQgNDh6Ii8+PC9zdmc+"
              width="18"
              height="18"
              alt="Google"
            />
          )}
          <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>
      </div>
    </div>
  );
}
