import { Notify } from "notiflix/build/notiflix-notify-aio";
import "./css/styles.css";
import refs from "./refs";

import { createTask,
  // addToFirebaseStorage,
  // getTaskFromFirebaseStorage,  
  // removeFromFirebase,
  
  addTaskToLocalStorage,
  getTaskFromLocalStorage,
  addToLocalStorage,
} from "./services";

import {
  addToFirebaseStorage,
  getTaskFromFirebaseStorage,
  removeFromFirebase,
} from "./services/auth";
import { renderTask } from "./markup";
import {
  addToDOM,
  getParentElement,
  filterTasks,
  rewriteLocalStorage,
} from "./helpers";
import { singIn, signOutUser } from "./services/auth";


refs.form.addEventListener("submit", onAddTask);
refs.list.addEventListener("click", onTaskChange);
refs.button.addEventListener('click',onBtnSingIn)
refs.button2.addEventListener("click", onBtnSingOut);



let IS_LOG_IN = false


isLogIn()


import { getAuth, onAuthStateChanged } from "firebase/auth";




function onAddTask(e) {
  e.preventDefault();
  const inputVal = e.currentTarget.elements.message.value.trim();
  if (!inputVal) {
    Notify.info("Enter a task");
    return;
  }
  const data = createTask(inputVal);
  changeStorage(data);
  refs.form.reset();
}


async function startTasksFirebase() {
  const tasks = await getTaskFromFirebaseStorage();
  if (!tasks) {
    return;
  }
  addToDOM(renderTask(tasks), refs.list);
}



function onTaskChange(e) {
  if (!IS_LOG_IN) {
    onTaskChangeLocal(e)
    return
  }
  onTaskChangeFirebase(e)
}



async function onTaskChangeFirebase(e) {
  if (e.target.tagName === "BUTTON") {
    const { task, id } = getParentElement(e.target, getTaskFromLocalStorage);
    removeFromFirebase(id).then(task.remove());
  }
  if (e.target.tagName === "P") {
    const { task, id } = getParentElement(e.target, getTaskFromLocalStorage);
    const data = await getTaskFromFirebaseStorage(id);
    data.isChecked = task.classList.toggle("checked");
    addToFirebaseStorage(data);
  }
}


function onTaskChangeLocal(e) {
  if (e.target.tagName === "BUTTON") {
    const { task,  id, tasks} = getParentElement(
      e.target,
      getTaskFromLocalStorage
      
    );
    const newList = filterTasks(tasks, id);
    task.remove();
    addToLocalStorage(newList);
  }
  if (e.target.tagName === "P") {
    const { task, id, tasks } = getParentElement(
      e.target,
      getTaskFromLocalStorage
    );
    task.classList.toggle("checked");
    const newList = rewriteLocalStorage(tasks, id);
    addToLocalStorage(newList);
  }
}



function isLogIn() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      IS_LOG_IN = true
      fromLocalToFirebase();
      changestart();
      // startTasksFirebase();
    // data.uid = user.uid;

    console.log('LogIn');
  } else {
      IS_LOG_IN = false
      console.log('LogOut');
      setTimeout(() => {
        refs.list.innerHTML = ''
      }, 100);
      
  }
});
}
  
setTimeout(() => {
    if (!IS_LOG_IN) {
    changestart()}
}, 500);


function changestart () {
  if (!IS_LOG_IN) {
    startTasksLocal();
    return
  }
  startTasksFirebase();
  // fromLocalToFirebase()
}

function changeStorage(data) {
  
  if (!IS_LOG_IN) {
    //якщо не зайшов тоді

    addTaskToLocalStorage(data);
    addToDOM(renderTask([data]), refs.list);
    // запис створення і виведення з локал
    return;
  }
  //рендер з файрбейс
  addToFirebaseStorage(data);
  addToDOM(renderTask([data]), refs.list);

  //запис в файр з локал по з юзер ід і видалення з локал
}


function startTasksLocal() {
  const tasks = getTaskFromLocalStorage();
  if (!tasks) {
    return;
  }
  addToDOM(renderTask(JSON.parse(tasks)), refs.list);
}





function onBtnSingIn(e) {
  singIn()
}
function onBtnSingOut(pe) {
signOutUser()
}

function fromLocalToFirebase(params) {
  const tasks = getTaskFromLocalStorage();
  if (!tasks) {
    return;
  }
  const parsed = JSON.parse(tasks).map((m) => {
    addToFirebaseStorage(m)
  })
  console.log(JSON.parse(tasks));
  localStorage.clear();
  refs.list.innerHTML=''
}