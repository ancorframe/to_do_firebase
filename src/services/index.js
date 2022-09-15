import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase";

import { getDatabase, ref, set, get, remove } from "firebase/database";
// import { USER_ID } from "./auth";
const app = initializeApp(firebaseConfig);

const TASKS = "list_of_tasks";

const db = getDatabase();

// export function addToFirebaseStorage(task) {
//   try {
//     set(ref(db, "tasks/" + task.id), task);
//     // set(ref(db, "tasks/" + ), task);
//   } catch (error) {
//     console.log(error);
//   }
// }

// export function addToFirebaseStorage(task) {
//   const parsedLocalStorage = getTaskFromLocalStorage(TASKS);
//   const tasks = parsedLocalStorage ? JSON.parse(parsedLocalStorage) : [];
//   tasks.push(task);
//   addToLocalStorage(tasks);
// }

// export function getTaskFromFirebaseStorage(id) {
//   const url = id ? `tasks/${id}` : "tasks/";
//   return get(ref(db, url))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         if (id) {
//           return snapshot.val();
//         }
//         return Object.values(snapshot.val());
//       } else {
//         console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// export function getTaskFromLocalStorage(key = TASKS) {
//   return localStorage.getItem(key);
// }

export function createTask(inputVal, uid) {
  return { inputVal, isChecked: false, id: Date.now() , uid: 0 };
}



export function removeFromFirebase(id) {
  try {
    return remove(ref(db, "tasks/" + id));
  } catch (error) {}
}



export function addTaskToLocalStorage(task) {
  const parsedLocalStorage = getTaskFromLocalStorage(TASKS);
  const tasks = parsedLocalStorage ? JSON.parse(parsedLocalStorage) : [];
  tasks.push(task);
  addToLocalStorage(tasks);
}

export function getTaskFromLocalStorage(key = TASKS) {
  return localStorage.getItem(key);
}

export function addToLocalStorage(tasks) {
  localStorage.setItem(TASKS, JSON.stringify(tasks));
}