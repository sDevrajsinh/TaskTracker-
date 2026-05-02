// src/components/ui/ConfirmModal.jsx
import { useAppContext } from '../../context/AppContext';

export default function ConfirmModal() {
  const { confirmModal, dismissConfirm } = useAppContext();

  if (!confirmModal) return null;

  function handleConfirm() {
    confirmModal.onConfirm();
    dismissConfirm();
  }

  return (
    <div className="modal-backdrop" onClick={dismissConfirm}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i className="fas fa-trash-alt" />
        </div>
        <h3>Delete Task?</h3>
        <p>{confirmModal.message || 'This action cannot be undone. The task will be permanently removed.'}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={dismissConfirm} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleConfirm}>
            <i className="fas fa-trash-alt" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
