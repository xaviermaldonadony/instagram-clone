import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
	updateLoggedInUserFollowing,
	updateFollowedUserFollowers,
} from '../../services/firebase';

export default function SuggestedProfile({
	loggedInUserDocId,
	profileDocId,
	username,
	profileId,
	userId,
}) {
	const [followed, setFollowed] = useState(false);

	async function handleFollowUser() {
		// will remove them from the list of suggestions if followed
		setFollowed(true);
		// update the following array of the logged in user
		await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
		// update the followers array of the user who has been followed
		await updateFollowedUserFollowers(profileDocId, userId, false);
	}

	return !followed ? (
		<div className='flex flex-row items-center align-items justify-between'>
			<div className='flex items-center justify-between'>
				<img
					src={`/images/avatars/${username}.jpg`}
					alt={`${username} profile `}
					className='rounded-full w-8 flex mr-3'
				/>
				<Link to={`/p/${username}`}>
					<p className='font-bold text-sm'>{username}</p>
				</Link>
			</div>
			<button
				type='button'
				className='text-xs font-bold text-blue-medium'
				onClick={handleFollowUser}
			>
				Follow
			</button>
		</div>
	) : null;
}

SuggestedProfile.propTypes = {
	profileDocId: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	profileId: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired,
	loggedInUserDocId: PropTypes.string.isRequired,
};
