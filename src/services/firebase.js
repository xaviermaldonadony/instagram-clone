import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
	const result = await firebase
		.firestore()
		.collection('users')
		.where('username', '==', username)
		.get();
	// console.log('results.docs', result.docs);
	return result.docs.map((user) => user.data().length > 0);
}

// get user from firestore where userId === userId (pass from auth)
export async function getUserByUserId(userId) {
	const result = await firebase
		.firestore()
		.collection('users')
		.where('userId', '==', userId)
		.get();

	const user = result.docs.map((item) => ({
		...item.data(),
		docId: item.id,
	}));

	return user;
}

export async function getSuggestedProfiles(userId, following) {
	const result = await firebase.firestore().collection('users').limit(10).get();

	// get all the users
	// dont want your own profile and profiles we are following
	return result.docs
		.map((user) => ({ ...user.data(), docId: user.id }))
		.filter(
			(profile) =>
				profile.userId !== userId && !following.includes(profile.userId)
		);
}

// user can hit follow or unfollow, it's a toggle
export async function updateLoggedInUserFollowing(
	// current logged in user
	loggedInUserDocId,
	// the user requested to follow
	profileId,
	// true/false is this user being followed
	isFollowingProfile
) {
	return firebase
		.firestore()
		.collection('users')
		.doc(loggedInUserDocId)
		.update({
			following: isFollowingProfile
				? FieldValue.arrayRemove(profileId)
				: FieldValue.arrayUnion(profileId),
		});
}

export async function updateFollowedUserFollowers(
	profileDocId,
	loggedInUserDocId,
	isFollowingProfile
) {
	return firebase
		.firestore()
		.collection('users')
		.doc(profileDocId)
		.update({
			followers: isFollowingProfile
				? FieldValue.arrayRemove(loggedInUserDocId)
				: FieldValue.arrayUnion(loggedInUserDocId),
		});
}

export async function getPhotos(userId, following) {
	// following [5,3,2	] would go and get the photos for those users
	const result = await firebase
		.firestore()
		.collection('photos')
		.where('userId', 'in', following)
		.get();

	const userFollowedPhotos = result.docs.map((photo) => ({
		...photo.data(),
		docId: photo.id,
	}));

	// get the details of each user, photo, liked status, and the username the photo belongs to
	const photosWithuserDetails = await Promise.all(
		userFollowedPhotos.map(async (photo) => {
			let userLikedPhoto = false;
			if (photo.likes.includes(userId)) {
				userLikedPhoto = true;
			}
			// get the user, since that users detail is not in this collection
			const user = await getUserByUserId(photo.userId);
			const { username } = user[0];

			return { username, ...photo, userLikedPhoto };
		})
	);

	return photosWithuserDetails;
}
