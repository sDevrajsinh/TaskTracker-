// src/components/dashboard/ProgressBar.jsx
import { getTodayString } from '../../utils/formatters';

export default function ProgressBar({ tasks }) {
  const today = getTodayString();
  const todayTasks = tasks.filter((t) => t.date === today);
  const done = todayTasks.filter((t) => t.isDone).length;
  const total = todayTasks.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">
          <i className="fas fa-calendar-day" style={{ marginRight: '0.4rem', color: 'var(--primary)' }} />
          Today's Progress
        </span>
        <span className="progress-pct">{done}/{total} tasks · {pct}%</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
