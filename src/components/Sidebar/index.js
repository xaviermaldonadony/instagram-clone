import React, { useContext } from 'react';
import LoggedInUserContext from '../../context/logged-in-user';

import User from './User';
import Suggestions from './Suggestions';

export default function Sidebar() {
	const { user: { docId = '', fullName, username, userId, following } = {} } =
		useContext(LoggedInUserContext);

	return (
		<div className='hidden md:block p-4'>
			<User username={username} fullName={fullName} />
			<Suggestions
				userId={userId}
				following={following}
				loggedInUserDocId={docId}
			/>
		</div>
	);
}
