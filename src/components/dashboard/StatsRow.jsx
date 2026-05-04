// src/components/dashboard/StatsRow.jsx
export default function StatsRow({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isDone).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Penalty calculation: ₹100 for each pending task where date < today and fine not paid
  const today = new Date().toLocaleDateString('en-CA');
  const overdueTasks = tasks.filter((t) => !t.isDone && t.date < today && !t.finePaid);

  const devuFine = overdueTasks.filter(t => t.owner === 'Devu').length * 100;
  const nehuFine = overdueTasks.filter(t => t.owner === 'Nehu').length * 100;
  const totalFine = devuFine + nehuFine;

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
      <div className="stat-item penalty">
        <i className="fas fa-hand-holding-usd stat-icon" style={{ color: '#ff4d4d' }} />
        <span className="stat-val" style={{ color: '#ff4d4d' }}>₹{totalFine}</span>
        <span className="stat-lab">Total Penalty</span>
      </div>
    </div>
  );
}
