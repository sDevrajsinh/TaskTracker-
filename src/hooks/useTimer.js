// src/hooks/useTimer.js
import { useEffect, useRef } from 'react';
import { getTaskTotalSeconds } from '../utils/formatters';

/**
 * Runs a 1-second interval that calls onTick with the running task's total seconds.
 * Cleans up when no task is running.
 */
export function useTimer(tasks, onTick) {
  const intervalRef = useRef(null);

  useEffect(() => {
    const runningTask = tasks.find((t) => t.isRunning);

    if (runningTask) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const seconds = getTaskTotalSeconds(runningTask);
        onTick(runningTask.id, seconds);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks, onTick]);
}
