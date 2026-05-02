// src/components/tasks/TaskList.jsx
import { useState, useCallback } from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

const CATEGORIES = ['All', 'Work', 'Personal', 'Learning'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priority', label: 'Priority' },
  { value: 'owner', label: 'Owner' },
];
const PRIORITY_MAP = { High: 3, Medium: 2, Low: 1 };

export default function TaskList({ tasks, onEdit, onComplete }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterDate, setFilterDate] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = tasks
    .filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.details && t.details.toLowerCase().includes(search.toLowerCase()));
      const matchDate = !filterDate || t.date === filterDate;
      const matchCategory =
        activeCategory === 'All' || t.category === activeCategory;
      return matchSearch && matchDate && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return (PRIORITY_MAP[b.priority] || 2) - (PRIORITY_MAP[a.priority] || 2);
      if (sortBy === 'owner') return (a.owner || '').localeCompare(b.owner || '');
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  const handleComplete = useCallback(() => onComplete?.(), [onComplete]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <i className="fas fa-list-ul" />
          Your Tasks
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
            ({filtered.length})
          </span>
        </h2>
        <div className="list-filters">
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="category-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search + Date Filter */}
      <div className="list-actions">
        <div className="search-wrap">
          <i className="fas fa-search" />
          <input
            type="text"
            id="task-search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <input
          type="date"
          id="filter-date"
          className="filter-date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Task Cards */}
      <div id="task-list-container">
        {filtered.length === 0 ? (
          <EmptyState searchTerm={search} />
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
}
