import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

export default function IsUserLoggedIn({
	user,
	loggedInPath,
	children,
	...rest
}) {
	// loggedInPath, is the user logged in and are they trying to reach logged in
	return (
		<Route
			{...rest}
			render={({ location }) => {
				if (!user) {
					return children;
				}

				if (user) {
					return (
						<Redirect
							to={{ pathname: loggedInPath, state: { from: location } }}
						/>
					);
				}

				return null;
			}}
		/>
	);
}

IsUserLoggedIn.propTypes = {
	user: PropTypes.object,
	loggedInPath: PropTypes.string.isRequired,
	children: PropTypes.object.isRequired,
};
