import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Photos from './Photos';
import { getUserPhotosByUserId } from '../../services/firebase';

const reducer = (state, newState) => ({
	...state,
	...newState,
});

const initialState = {
	profile: {},
	photosCollection: [],
	followerCount: 0,
};

export default function Profile({ user }) {
	const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
		reducer,
		initialState
	);
	const { userId } = user;

	useEffect(() => {
		async function getProfileInfoAndPhotos() {
			const photos = await getUserPhotosByUserId(userId);
			dispatch({
				profile: user,
				photosCollection: photos,
				followerCount: user.followers.length,
			});
		}

		getProfileInfoAndPhotos();
	}, [user, userId]);

	return (
		<>
			<Header
				photosCount={photosCollection ? photosCollection.length : 0}
				profile={profile}
				followerCount={followerCount}
				setFollowerCount={dispatch}
			/>
			<Photos photos={photosCollection} />
		</>
	);
}

Profile.propTypes = {
	// user: PropTypes.shape({
	// 	dateCreated: PropTypes.number.isRequired,
	// 	emailAddress: PropTypes.string.isRequired,
	// 	followers: PropTypes.array.isRequired,
	// 	following: PropTypes.array.isRequired,
	// 	fullName: PropTypes.string.isRequired,
	// 	userId: PropTypes.string.isRequired,
	// 	username: PropTypes.string.isRequired,
	// }),

	user: PropTypes.shape({
		dateCreated: PropTypes.number,
		emailAddress: PropTypes.string,
		followers: PropTypes.array,
		following: PropTypes.array,
		fullName: PropTypes.string,
		userId: PropTypes.string,
		username: PropTypes.string,
	}),
};
