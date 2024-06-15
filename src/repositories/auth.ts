import { initializeApp } from "firebase/app";
import { User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: process.env["REACT_APP_API_KEY"],
    authDomain: process.env["REACT_APP_AUTH_DOMAIN"],
    projectId: process.env["REACT_APP_PROJECT_ID"],
    storageBucket: process.env["REACT_APP_STORAGE_BUCKET"],
    messagingSenderId: process.env["REACT_APP_MESSAGING_SENDER_ID"],
    appId: process.env["REACT_APP_APP_ID"],
    measurementId: process.env["REACT_APP_MEASUREMENT_ID"],
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


/**
 * Creates a new user in the firebase authentication system.
 * @param email 
 * @param password 
 */
export async function SignUpUser(email: string, password: string) {
    try {
        const createdUser = await createUserWithEmailAndPassword(auth, email, password);
        return createdUser;
    } catch {
        // TODO: Send proper error information
        return null;
    }
}


/**
 * Logs in an existing user given it's email and password.
 * @param email 
 * @param password 
 */
export async function LogInUser(email: string, password: string) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch {
        // TODO: Send proper error information
        return null;
    }
}


/**
 * Returns the user that's currently logged in. If there are none, returns null.
 */
export function GetCurrentUser() {
    return auth.currentUser;
}


export function OnAuthStateChanged(onChanged: (user: User | null) => void) {
    onAuthStateChanged(auth, onChanged);
}