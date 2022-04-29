import { timeStamp } from "console";
import { initializeApp, getApp, FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit, DocumentSnapshot, Timestamp, FieldValue } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAg9NQgE1sRUukatEboCLAF-5vrafwTfhU",
    authDomain: "next-js-blog-app-2dc96.firebaseapp.com",
    projectId: "next-js-blog-app-2dc96",
    storageBucket: "next-js-blog-app-2dc96.appspot.com",
    messagingSenderId: "760545664572",
    appId: "1:760545664572:web:82158c88ebc4a2e6a2ed39",
    measurementId: "G-MLZD9D71NR"
  };

// Initialize firebase
// let firebaseApp;
// let firestore;
// if (!getApps().length) {
//   // firebase.initializeApp(firebaseConfig);
//   initializeApp(firebaseConfig);
//   firestore = getFirestore();
// }

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = createFirebaseApp(firebaseConfig);



// Auth exports
// export const auth = firebase.auth();
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// Firestore exports
export const firestore = getFirestore(firebaseApp);
// export const firestore = firebase.firestore();
// export { firestore };
// export const serverTimestamp = serverTimestamp;
export const fromMillis = Timestamp.fromMillis;
// export const increment = increment;

// Storage exports
export const storage = getStorage(firebaseApp);


/// Helper functions
// Gets a users/{uid} document with username
export async function getUserWithUsername(username:string) {
  // const usersRef = collection(firestore, 'users');
  // const query = usersRef.where('username', '==', username).limit(1);

  const q = query(
    collection(firestore, 'users'), 
    where('username', '==', username),
    limit(1)
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;
}


//Converts a firestore document to JSON
export function postToJSON(doc:DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0,
  };
}
