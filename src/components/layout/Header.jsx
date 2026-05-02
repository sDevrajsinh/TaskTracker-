// src/components/layout/Header.jsx
import { logoutUser } from '../../firebase/auth';
import { useAppContext } from '../../context/AppContext';
import { formatHeaderDate } from '../../utils/formatters';

export default function Header({ user, isDark, toggleTheme }) {
  const { showToast } = useAppContext();

  async function handleLogout() {
    await logoutUser();
    showToast('Logged out successfully', 'warning');
  }

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-logo">
          <i className="fas fa-bolt" />
        </div>
        <div className="brand-text">
          <h1>TaskTracker Pro</h1>
          <p id="header-date">{formatHeaderDate()}</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          id="theme-toggle"
          className="btn-icon"
          title="Toggle Theme"
          onClick={toggleTheme}
        >
          <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'} />
        </button>

        {user && (
          <div className="user-pill">
            <img
              id="user-photo"
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=6366f1&color=fff`}
              alt="Profile"
              className="user-img"
            />
            <span className="user-name">
              {user.displayName?.split(' ')[0] || 'User'}
            </span>
            <button
              id="logout-btn"
              className="btn-icon"
              title="Logout"
              onClick={handleLogout}
              style={{ width: 32, height: 32, fontSize: '0.8rem' }}
            >
              <i className="fas fa-sign-out-alt" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
