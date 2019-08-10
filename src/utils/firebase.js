import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC0dQmgoaczw7P0E-V9M6O5-wszKzaSyEY",
    authDomain: "just-hackathon-poll.web.app",
    databaseURL: "https://just-hackathon-poll.firebaseio.com/"
};

export const firebaseApp = firebase.initializeApp(config);
