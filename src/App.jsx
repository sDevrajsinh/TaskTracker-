// src/App.jsx
import { useState, useRef, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useAppContext } from './context/AppContext';

import Header from './components/layout/Header';
import LoginOverlay from './components/auth/LoginOverlay';
import QuoteCard from './components/dashboard/QuoteCard';
import StatsRow from './components/dashboard/StatsRow';
import ProgressBar from './components/dashboard/ProgressBar';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import ToastContainer from './components/ui/Toast';
import ConfirmModal from './components/ui/ConfirmModal';
import Confetti from './components/ui/Confetti';

export default function App() {
  const { user, loading } = useAuth();
  const { tasks } = useTasks(user);
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useAppContext();
  const confettiRef = useRef(null);
  const formRef = useRef(null);

  const [editTask, setEditTask] = useState(null);

  // Show welcome toast once on login
  const [welcomed, setWelcomed] = useState(false);
  if (user && !welcomed) {
    setWelcomed(true);
    const firstName = user.displayName?.split(' ')[0] || 'there';
    showToast(`Welcome back, ${firstName}! 👋`);
  }
  if (!user && welcomed) {
    setWelcomed(false);
  }

  function handleEdit(task) {
    setEditTask(task);
    // Scroll to form
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function handleEditDone() {
    setEditTask(null);
  }

  const handleComplete = useCallback(() => {
    confettiRef.current?.fire();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="brand-logo">
          <i className="fas fa-bolt" />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading TaskTracker…</p>
      </div>
    );
  }

  return (
    <>
      {/* Animated background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Auth overlay */}
      {!user && <LoginOverlay />}

      {/* App Header */}
      <Header user={user} isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="app-container">
        <QuoteCard />
        <StatsRow tasks={tasks} />
        <ProgressBar tasks={tasks} />

        <div className="main-grid">
          {/* LEFT: Task List */}
          <TaskList tasks={tasks} onEdit={handleEdit} onComplete={handleComplete} />

          {/* RIGHT: Add/Edit Form */}
          <aside ref={formRef}>
            <TaskForm
              user={user}
              editTask={editTask}
              onEditDone={handleEditDone}
            />
          </aside>
        </div>
      </main>

      {/* Global UI */}
      <ToastContainer />
      <ConfirmModal />
      <Confetti ref={confettiRef} />
    </>
  );
}
