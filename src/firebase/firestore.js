// src/firebase/firestore.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

const TASKS_COLLECTION = 'tasks';

export function subscribeToTasks(callback, onError) {
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  }, onError);
}

export async function addTask(taskData) {
  return addDoc(collection(db, TASKS_COLLECTION), taskData);
}

export async function updateTask(id, data) {
  return updateDoc(doc(db, TASKS_COLLECTION, id), data);
}

export async function deleteTask(id) {
  return deleteDoc(doc(db, TASKS_COLLECTION, id));
}

export async function toggleTaskStatus(id, currentDone) {
  return updateDoc(doc(db, TASKS_COLLECTION, id), { isDone: !currentDone });
}

export async function startTimer(id) {
  return updateDoc(doc(db, TASKS_COLLECTION, id), {
    isRunning: true,
    lastStarted: Date.now(),
  });
}

export async function pauseTimer(id, timeSpentSeconds, lastStarted) {
  const elapsed = Math.floor((Date.now() - lastStarted) / 1000);
  return updateDoc(doc(db, TASKS_COLLECTION, id), {
    isRunning: false,
    timeSpentSeconds: timeSpentSeconds + elapsed,
    lastStarted: null,
  });
}
