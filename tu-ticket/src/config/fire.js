import firebase from 'firebase'
//import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDKciRyAR2VX87V2su_w2Q9BBtm8ztIQU4",
    authDomain: "tuticket-a4567.firebaseapp.com",
    databaseURL: "https://tuticket-a4567.firebaseio.com",
    projectId: "tuticket-a4567",
    storageBucket: "tuticket-a4567.appspot.com",
    messagingSenderId: "392481134339",
    appId: "1:392481134339:web:5aca0b8c7cd98ad856fb36",
    measurementId: "G-BCMGS344N3"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
//firebaseApp.firestore();

export default firebaseApp.firestore();