// src/components/dashboard/StatsRow.jsx
export default function StatsRow({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isDone).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const learningCount = tasks.filter((t) => t.isLearning).length;

  return (
    <div className="stats-row">
      <div className="stat-item">
        <i className="fas fa-layer-group stat-icon" />
        <span className="stat-val" id="total-tasks-val">{total}</span>
        <span className="stat-lab">Total</span>
      </div>
      <div className="stat-item">
        <i className="fas fa-check-double stat-icon" />
        <span className="stat-val" id="completed-tasks-val">{completed}</span>
        <span className="stat-lab">Done</span>
      </div>
      <div className="stat-item">
        <i className="fas fa-chart-line stat-icon" />
        <span className="stat-val" id="productivity-pct">{pct}%</span>
        <span className="stat-lab">Efficiency</span>
      </div>
    </div>
  );
}
