import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Profile from '../../pages/Profile';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import suggestedProfilesFixture from '../../fixtures/suggested-profiles';
import {
	getUserByUsername,
	getUserPhotosByUserId,
} from '../../services/firebase';
import profileThatIsFollowedByTheLoggedInUser from '../../fixtures/profile-followed-by-logged-in-user';
import profileThatIsNotFollowedByTheLoggedInUser from '../../fixtures/profile-not-followed-by-logged-in-user';
import useUser from '../../hooks/use-user';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({ username: 'orwell' }),
	useHistory: () => ({
		push: mockHistoryPush,
	}),
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Profile/>', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the profile page with a user profile', async () => {
		await act(async () => {
			getUserByUsername.mockImplementation(() => [userFixture]);
			getUserPhotosByUserId.mockImplementation(() => photosFixture);
			useUser.mockImplementation(() => ({ user: userFixture }));
			const firebase = {
				auth: jest.fn(() => ({
					signOut: jest.fn(() => Promise.resolve({})),
				})),
			};

			const { getByText, getByTitle } = render(
				<Router>
					<FirebaseContext.Provider
						value={{
							firebase,
						}}
					>
						<UserContext.Provider
							value={{
								user: {
									uid: 'IIRXotQ5ZXgAMg9KPOlnZDFrhEl2',
									displayName: 'steve',
								},
							}}
						>
							<Profile />
						</UserContext.Provider>
					</FirebaseContext.Provider>
				</Router>
			);

			await waitFor(() => {
				expect(mockHistoryPush).not.toHaveBeenCalled();
				expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
				expect(getUserByUsername).toHaveBeenCalledWith('orwell');
				expect(getByTitle('Sign Out')).toBeTruthy();
				expect(getByText('steve')).toBeTruthy();
				expect(getByText('Steve Jobs')).toBeTruthy();

				screen.getByText((content, node) => {
					const hasText = (node) => node.textContent === '5 photos';
					const nodeHasText = hasText(node);
					const childrenDontHaveText = Array.from(node.children).every(
						(child) => !hasText(child)
					);
					return nodeHasText && childrenDontHaveText;
				});

				screen.getByText((content, node) => {
					const hasText = (node) => node.textContent === '3 followers';
					const nodeHasText = hasText(node);
					const childrenDontHaveText = Array.from(node.children).every(
						(child) => !hasText(child)
					);
					return nodeHasText && childrenDontHaveText;
				});

				screen.getByText((content, node) => {
					const hasText = (node) => node.textContent === '2 following';
					const nodeHasText = hasText(node);
					const childrenDontHaveText = Array.from(node.children).every(
						(child) => !hasText(child)
					);
					return nodeHasText && childrenDontHaveText;
				});

				// okay, go ahead and sign the user out
				fireEvent.click(getByTitle('Sign Out'));

				fireEvent.keyDown(getByTitle('Sign Out'), {
					key: 'Enter',
				});

				expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.LOGIN);
			});
		});
	});
});
