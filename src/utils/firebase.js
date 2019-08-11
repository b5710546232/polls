import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC0dQmgoaczw7P0E-V9M6O5-wszKzaSyEY",
    authDomain: "just-hackathon-poll.firebaseapp.com",
    databaseURL: "https://just-hackathon-poll.firebaseio.com",
    projectId: "just-hackathon-poll",
    storageBucket: "just-hackathon-poll.appspot.com",
    messagingSenderId: "644108349847",
    appId: "1:644108349847:web:1025732ce4c280a6"
};

export const firebaseApp = firebase.initializeApp(config);
