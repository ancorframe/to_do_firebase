import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Notify } from "notiflix/build/notiflix-notify-aio";
const provider = new GoogleAuthProvider();

import { getDatabase, ref, set, get, remove } from "firebase/database";

const db = getDatabase();

const auth = getAuth();
export function singIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
        const user = result.user;
        // console.log(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}



 let USER_ID = ''




onAuthStateChanged(auth, (user) => {
  if (user) {
    Notify.success(`${user.displayName} is Signed In`);
    // console.log(user);
    // const uid = user.uid;
    USER_ID=user.uid ;
    // console.log(uid);
    // ...
  } else {
// console.log(user);
  }
});

export function addToFirebaseStorage(task) {
  try {
    task.uid = USER_ID;
    // set(ref(db, "tasks/" + task.id), task);
    set(ref(db, `tasks/${USER_ID}/${task.id}`), task);
  } catch (error) {
    console.log(error);
  }
}

export function signOutUser() {
  signOut(auth)
    .then(() => {
      Notify.info("User logout");
      USER_ID=''
    })
    .catch((error) => {
      // An error happened.
    });
}


export function getTaskFromFirebaseStorage(id) {

  const url = id ? `tasks/${USER_ID}/${id}` : `tasks/${USER_ID}/`;
  
  return get(ref(db, url))
    .then((snapshot) => {

      if (snapshot.exists()) {
        
        if (id) {
          console.log(snapshot.val());
          return snapshot.val()
        }
        const loll = Object.values(snapshot.val())
        console.log("~ loll", loll)
        
        const plpl = Object.values(loll[0])
        console.log("~ plpl", plpl)
        return loll;

      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}


export function removeFromFirebase(id) {
  try {
    return remove(ref(db, `tasks/${USER_ID}`));
  } catch (error) {}
}
