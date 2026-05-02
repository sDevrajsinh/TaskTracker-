// src/hooks/useTasks.js
import { useState, useEffect, useRef } from 'react';
import { subscribeToTasks } from '../firebase/firestore';

export function useTasks(user) {
  const [tasks, setTasks] = useState([]);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      return;
    }

    unsubRef.current = subscribeToTasks(
      (fetchedTasks) => setTasks(fetchedTasks),
      (err) => console.error('Firestore sync error:', err)
    );

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [user]);

  return { tasks };
}
