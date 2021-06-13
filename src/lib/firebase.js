import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import seed file
import { seedDatabase } from '../seed';

// here is where I want to call the seed file (only ONCE!!)

const config = {
	apiKey: 'AIzaSyDH3Wkcs7ifcL1RA9XeIzES_xqh0WGzuBA',
	authDomain: 'instagram-clone-d2ab1.firebaseapp.com',
	projectId: 'instagram-clone-d2ab1',
	storageBucket: 'instagram-clone-d2ab1.appspot.com',
	messagingSenderId: '410121020380',
	appId: '1:410121020380:web:bcae43573ee2bc4b45a519',
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// call seed file
// seedDatabase(firebase);

export { firebase, FieldValue };
