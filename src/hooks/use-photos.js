import { useState, useEffect } from 'react';

import { getPhotos } from '../services/firebase';

export default function usePhotos(user) {
	const [photos, setPhotos] = useState(null);
	const { userId, following } = user;

	useEffect(() => {
		async function getTimelinePhotos() {
			// example: [2,1,5	] (2 is raphael)
			// does the user follow ppl
			if (following?.length > 0) {
				const followedUserPhotos = await getPhotos(userId, following);
				// sort them by date, newest by date
				followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
				setPhotos(followedUserPhotos);
			}
		}
		getTimelinePhotos();
	}, [userId, following]);

	return { photos };
}
