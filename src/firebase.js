import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase projekti seaded (Firebase Console → Project settings → General → "Your apps").
const firebaseConfig = {
  apiKey: "AIzaSyCo2VA56zzdgm0vaoHYUS9TjVByNERwW-Q",
  authDomain: "nutifix-new.firebaseapp.com",
  databaseURL: "https://nutifix-new-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nutifix-new",
  storageBucket: "nutifix-new.firebasestorage.app",
  messagingSenderId: "65113397733",
  appId: "1:65113397733:web:a25efe6776b4c03df8f70c",
}

// TURVAVÕRK: kui Firebase'i seadistamine mingil põhjusel ebaõnnestub
// (nt vale konfiguratsioon, blokeeritud võrk vms), ei tohi see kunagi
// kogu lehte tühjaks jätta – ainult arvustuste funktsioon jääb siis
// vaikimisi näidisandmete peale. `db` on sel juhul `null` ja
// Reviews.jsx oskab sellega toime tulla.
let db = null
try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
} catch (err) {
  console.error('Firebase\'i seadistamine ebaõnnestus – arvustused kuvavad ainult näidisandmeid:', err)
}

export { db }
