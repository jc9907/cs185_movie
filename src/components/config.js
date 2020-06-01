import firebase from "firebase";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyACJ8-913EpzdE7eFQdAJvDLwhwWZL9-Ic",
  authDomain: "cs185-react-6ffac.firebaseapp.com",
  databaseURL: "https://cs185-react-6ffac.firebaseio.com",
  projectId: "cs185-react-6ffac",
  storageBucket: "cs185-react-6ffac.appspot.com",
  messagingSenderId: "751577762405",
  appId: "1:751577762405:web:07c30947f637efd9e7d48c",
};
// Initialize Firebase
var config = firebase.initializeApp(firebaseConfig);
export default config;
