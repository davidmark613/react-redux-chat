import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD13PkfnjHnaa8MEmVi4a1UkCyAmqA9L2I",
    authDomain: "react-redux-chat-c7a97.firebaseapp.com",
    databaseURL: "https://react-redux-chat-c7a97-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-redux-chat-c7a97",
    storageBucket: "react-redux-chat-c7a97.appspot.com",
    messagingSenderId: "297278563995",
    appId: "1:297278563995:web:28acc9eda0904675b8c83e"
};

firebase.initializeApp(firebaseConfig);

export default firebase;