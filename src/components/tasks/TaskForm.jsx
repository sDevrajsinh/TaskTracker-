// src/components/tasks/TaskForm.jsx
import { useState, useEffect } from 'react';
import { addTask, updateTask } from '../../firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { getTodayString } from '../../utils/formatters';

const defaultForm = () => ({
  name: '',
  date: getTodayString(),
  owner: '',
  priority: '',
  category: '',
  details: '',
  isLearning: false,
});

export default function TaskForm({ user, editTask, onEditDone }) {
  const { showToast } = useAppContext();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setForm({
        name: editTask.name || '',
        date: editTask.date || getTodayString(),
        owner: editTask.owner || 'Devu',
        priority: editTask.priority || 'Medium',
        category: editTask.category || 'Work',
        details: editTask.details || '',
        isLearning: editTask.isLearning || false,
      });
    } else {
      setForm(defaultForm());
    }
  }, [editTask]);

  function handleChange(e) {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return showToast('Please login first', 'error');
    if (!form.name.trim()) return showToast('Task name is required', 'error');

    if (!form.owner) return showToast('Please select an owner', 'error');
    if (!form.priority) return showToast('Please select a priority', 'error');
    if (!form.category) return showToast('Please select a category', 'error');

    setLoading(true);
    const baseData = {
      name: form.name.trim(),
      date: form.date,
      formattedDate: new Date(form.date).toLocaleDateString('en-GB'),
      owner: form.owner,
      priority: form.priority,
      category: form.category,
      details: form.details.trim(),
      isLearning: form.isLearning,
      updatedAt: Date.now(),
    };

    try {
      if (editTask) {
        await updateTask(editTask.id, baseData);
        showToast('Task updated successfully ✅');
        onEditDone?.();
      } else {
        await addTask({
          ...baseData,
          isDone: false,
          timeSpentSeconds: 0,
          isRunning: false,
          lastStarted: null,
          createdAt: Date.now(),
          userId: user.uid,
        });
        showToast('New task created 🎉');
      }
      setForm(defaultForm());
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving task. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setForm(defaultForm());
    onEditDone?.();
  }

  return (
    <div className="panel">
      <h2 className="panel-title" style={{ marginBottom: '1.25rem' }}>
        <i className={editTask ? 'fas fa-pen' : 'fas fa-plus-circle'} />
        {editTask ? 'Edit Task' : 'New Task'}
      </h2>

      {editTask && (
        <div className="edit-banner">
          <i className="fas fa-pencil-alt" />
          Editing: <strong>{editTask.name}</strong>
        </div>
      )}

      <form id="task-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group full">
            <label htmlFor="name">Task Name</label>
            <input
              id="name"
              type="text"
              placeholder="What needs to be done?"
              value={form.name}
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="owner">Owner</label>
            <select id="owner" value={form.owner} onChange={handleChange} required>
              <option value="" disabled>Select Owner</option>
              <option value="Devu">Devu</option>
              <option value="Nehu">Nehu</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={form.priority} onChange={handleChange} required>
              <option value="" disabled>Select Priority</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={handleChange} required>
              <option value="" disabled>Select Category</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">🏠 Personal</option>
              <option value="Learning">📚 Learning</option>
            </select>
          </div>

          <div className="input-group full">
            <label htmlFor="details">Details (Optional)</label>
            <textarea
              id="details"
              rows={2}
              placeholder="Any extra notes..."
              value={form.details}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isLearning"
              checked={form.isLearning}
              onChange={handleChange}
            />
            <label htmlFor="isLearning">Mark as Learning Task 🧠</label>
          </div>
        </div>

        <div className="form-actions">
          {editTask && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              <i className="fas fa-times" /> Cancel
            </button>
          )}
          <button
            type="submit"
            id="submit-btn"
            className="btn-primary"
            disabled={loading}
            style={{ flex: 2 }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <i className={editTask ? 'fas fa-save' : 'fas fa-paper-plane'} />
                <span>{editTask ? 'Save Changes' : 'Create Task'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
