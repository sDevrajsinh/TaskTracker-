// src/components/ui/Toast.jsx
import { useAppContext } from '../../context/AppContext';

const ICONS = {
  success: 'fa-check-circle',
  error: 'fa-exclamation-circle',
  warning: 'fa-exclamation-triangle',
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div id="toast-container" className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`} role="alert">
          <i className={`fas ${ICONS[toast.type] || ICONS.success} toast-icon`} />
          <span className="toast-msg">{toast.msg}</span>
          <button
            className="toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  );
}
