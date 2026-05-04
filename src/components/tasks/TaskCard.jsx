// src/components/tasks/TaskCard.jsx
import { useState, useEffect } from 'react';
import { toggleTaskStatus, updateTask, deleteTask, startTimer, pauseTimer, markFinePaid } from '../../firebase/firestore';
import { useAppContext } from '../../context/AppContext';
import { formatSecondsToHMS, getTaskTotalSeconds } from '../../utils/formatters';

export default function TaskCard({ task, onEdit, onComplete }) {
  const { showToast, showConfirm } = useAppContext();
  const [timerDisplay, setTimerDisplay] = useState(() =>
    formatSecondsToHMS(getTaskTotalSeconds(task))
  );

  const totalSeconds = getTaskTotalSeconds(task);
  const isTimeMet = totalSeconds >= 10800; // 3 hours in seconds
  const isOverdue = !task.isDone && task.date < new Date().toLocaleDateString('en-CA') && !task.finePaid;
  const isFinePaid = !task.isDone && task.date < new Date().toLocaleDateString('en-CA') && task.finePaid;

  let statusLabel = null;
  let canMarkDone = isTimeMet; // Base condition: must meet 3h requirement

  if (task.isDone) {
    statusLabel = <span className="badge badge-success status-label">Completed ✅</span>;
    canMarkDone = true;
  } else if (isOverdue) {
    statusLabel = <span className="badge badge-penalty status-label animated pulse infinite">₹100 Fine</span>;
    canMarkDone = false;
  } else if (!isTimeMet) {
    const remainingSecs = 10800 - totalSeconds;
    const h = Math.floor(remainingSecs / 3600);
    const m = Math.floor((remainingSecs % 3600) / 60);
    statusLabel = <span className="badge badge-info status-label">Need {h}h {m}m more focus ⏳</span>;
  } else if (isFinePaid) {
    statusLabel = <span className="badge badge-warning status-label">Fine Paid ✅</span>;
  } else {
    statusLabel = <span className="badge badge-info status-label">Ready to finish! ✨</span>;
  }

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

  function handlePayFine() {
    showConfirm(
      `Mark fine as paid for "${task.name}"? This will remove the ₹100 penalty.`,
      async () => {
        await markFinePaid(task.id);
        showToast('Fine settled! 💸');
      }
    );
  }

  const priorityClass = `priority-${(task.priority || 'medium').toLowerCase()}`;

  return (
    <div
      className={`task-item ${priorityClass} ${task.isDone ? 'completed' : ''} ${task.isLearning ? 'learning' : ''} ${isOverdue ? 'overdue' : ''}`}
    >
      {/* Status Toggle */}
      <div className="task-status-container">
        {task.isDone ? (
          <button className="task-status-btn done" onClick={handleToggleStatus}>
            <i className="fas fa-check" />
          </button>
        ) : !canMarkDone ? (
          <div className="status-indicator locked" title={isOverdue ? "Fine Pending" : "3h focus required"}>
            <i className={isOverdue ? "fas fa-times-circle" : "fas fa-lock"} />
            <span className="status-text">{isOverdue ? "Not Done" : "Locked"}</span>
          </div>
        ) : (
          <button className="task-status-btn" onClick={handleToggleStatus} title="Mark as done">
            {/* Ready to be marked done */}
          </button>
        )}
      </div>

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
          {statusLabel}
          <span className="task-meta-item" id={`timer-${task.id}`}>
            <i className="far fa-clock" />
            {timerDisplay}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-ops">
        {isOverdue && (
          <button
            className="btn-op settle-fine"
            onClick={handlePayFine}
            title="Settle Fine"
            aria-label="Settle fine"
            style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}
          >
            <i className="fas fa-hand-holding-usd" />
          </button>
        )}
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
