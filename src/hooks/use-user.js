import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/user.js';
import { getUserByUserId } from '../services/firebase';

// gets looged in user with the user id from authentication
export default function useUser() {
	const [activeUser, setActiveUser] = useState({});
	const { user } = useContext(UserContext);

	useEffect(() => {
		async function getUserObjByUserId() {
			// function that calls (firebase services) that gets user data by uid
			// destructure the array
			const [response] = await getUserByUserId(user.uid);
			setActiveUser(response);
		}
		if (user?.uid) {
			getUserObjByUserId();
		}
	}, [user]);

	return { user: activeUser };
}
