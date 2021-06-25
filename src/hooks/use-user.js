import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';

// gets looged in user with the user id from authentication
export default function useUser(userId) {
	const [activeUser, setActiveUser] = useState({});

	useEffect(() => {
		async function getUserObjByUserId() {
			// function that calls (firebase services) that gets user data by uid
			// destructure the array
			const [user] = await getUserByUserId(userId);
			// if no user set to an empty object
			setActiveUser(user || {});
		}
		if (userId) {
			getUserObjByUserId();
		}
	}, [userId]);

	return { user: activeUser };
}
