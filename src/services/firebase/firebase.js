import * as firebase from "firebase/app";
import "firebase/firestore";

import { FIREBASE_CONFIG } from "../../config";

function initialize() {
  firebase.initializeApp(FIREBASE_CONFIG);
}

export default {
  initialize,
};
