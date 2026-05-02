// src/utils/formatters.js

export function formatSecondsToHMS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getTaskTotalSeconds(task) {
  let total = task.timeSpentSeconds || 0;
  if (task.isRunning && task.lastStarted) {
    total += Math.floor((Date.now() - task.lastStarted) / 1000);
  }
  return total;
}

export function getTodayString() {
  return new Date().toLocaleDateString('en-CA');
}

export function formatHeaderDate() {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return `Today is ${new Date().toLocaleDateString(undefined, options)}`;
}

export function escapeHtml(unsafe) {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
