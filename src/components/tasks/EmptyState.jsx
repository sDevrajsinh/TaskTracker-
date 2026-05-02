// src/components/tasks/EmptyState.jsx
export default function EmptyState({ searchTerm }) {
  return (
    <div className="empty-state">
      <i className={searchTerm ? 'fas fa-search' : 'fas fa-clipboard-list'} />
      <p>
        {searchTerm
          ? `No matches for "${searchTerm}"`
          : 'No tasks here. Add one to get started!'}
      </p>
    </div>
  );
}
