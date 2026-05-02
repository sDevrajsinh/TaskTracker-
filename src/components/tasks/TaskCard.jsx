// src/components/tasks/TaskCard.jsx
import { useState, useEffect } from 'react';
import { toggleTaskStatus, updateTask, deleteTask, startTimer, pauseTimer } from '../../firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { formatSecondsToHMS, getTaskTotalSeconds } from '../../utils/formatters';

export default function TaskCard({ task, onEdit, onComplete }) {
  const { showToast, showConfirm } = useAppContext();
  const [timerDisplay, setTimerDisplay] = useState(() =>
    formatSecondsToHMS(getTaskTotalSeconds(task))
  );

  // Update timer display every second when running
  useEffect(() => {
    if (!task.isRunning) {
      setTimerDisplay(formatSecondsToHMS(getTaskTotalSeconds(task)));
      return;
    }
    const interval = setInterval(() => {
      setTimerDisplay(formatSecondsToHMS(getTaskTotalSeconds(task)));
    }, 1000);
    return () => clearInterval(interval);
  }, [task.isRunning, task.timeSpentSeconds, task.lastStarted]);

  async function handleToggleStatus() {
    await toggleTaskStatus(task.id, task.isDone);
    if (!task.isDone) onComplete?.();
  }

  async function handleToggleTimer() {
    if (task.isRunning) {
      await pauseTimer(task.id, task.timeSpentSeconds || 0, task.lastStarted);
    } else {
      await startTimer(task.id);
    }
  }

  function handleDelete() {
    showConfirm(
      `Delete "${task.name}"? This action cannot be undone.`,
      async () => {
        await deleteTask(task.id);
        showToast('Task removed', 'warning');
      }
    );
  }

  const priorityClass = `priority-${(task.priority || 'medium').toLowerCase()}`;

  return (
    <div
      className={`task-item ${priorityClass} ${task.isDone ? 'completed' : ''} ${task.isLearning ? 'learning' : ''}`}
    >
      {/* Status Toggle */}
      <button
        className={`task-status-btn ${task.isDone ? 'done' : ''}`}
        onClick={handleToggleStatus}
        title={task.isDone ? 'Mark as pending' : 'Mark as done'}
        aria-label="Toggle task status"
      >
        {task.isDone && <i className="fas fa-check" style={{ fontSize: '0.7rem' }} />}
      </button>

      {/* Content */}
      <div className="task-content">
        <h3 style={task.isDone ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
          {task.name}
        </h3>
        <p>{task.details || 'No description provided.'}</p>
        <div className="task-meta">
          <span className={`badge badge-${(task.priority || 'medium').toLowerCase()}`}>
            {task.priority || 'Medium'}
          </span>
          {task.category && (
            <span className={`badge badge-${(task.category || '').toLowerCase()}`}>
              {task.category}
            </span>
          )}
          {task.isLearning && (
            <span className="badge badge-learning">🧠 Learning</span>
          )}
          <span className="task-meta-item">
            <i className="far fa-user" />
            {task.owner || 'Devu'}
          </span>
          <span className="task-meta-item" id={`timer-${task.id}`}>
            <i className="far fa-clock" />
            {timerDisplay}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-ops">
        <button
          className={`btn-op ${task.isRunning ? 'running' : ''}`}
          onClick={handleToggleTimer}
          title={task.isRunning ? 'Pause Timer' : 'Start Timer'}
          aria-label="Toggle timer"
        >
          <i className={`fas ${task.isRunning ? 'fa-pause' : 'fa-play'}`} />
        </button>
        <button
          className="btn-op"
          onClick={() => onEdit(task)}
          title="Edit Task"
          aria-label="Edit task"
        >
          <i className="fas fa-pen-nib" />
        </button>
        <button
          className="btn-op del"
          onClick={handleDelete}
          title="Delete Task"
          aria-label="Delete task"
        >
          <i className="fas fa-trash-alt" />
        </button>
      </div>
    </div>
  );
}
