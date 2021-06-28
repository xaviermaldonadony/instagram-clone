import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Dashboard from '../../pages/Dashboard';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import suggestedProfilesFixture from '../../fixtures/suggested-profiles';
import { getPhotos, getSuggestedProfiles } from '../../services/firebase';
import useUser from '../../hooks/use-user';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useHistory: () => ({
		push: mockHistoryPush,
	}),
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Dashboard />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the dashboard with a user profile and follows a user form the suggested profile sidebar', async () => {
		await act(async () => {
			getPhotos.mockImplementation(() => photosFixture);
			getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
			useUser.mockImplementation(() => ({ user: userFixture }));

			const firebase = {
				firestore: jest.fn(() => ({
					collection: jest.fn(() => ({
						doc: jest.fn(() => ({
							update: jest.fn(() => Promise.resolve('User added')),
						})),
					})),
				})),
			};

			const fieldValues = {
				arrayUnion: jest.fn(),
				arrayRemove: jest.fn(),
			};

			const { getByText, getByTestId, getByTitle, getAllByText, getByAltText } =
				render(
					<Router>
						<FirebaseContext.Provider
							value={{ firebase, FieldValue: fieldValues }}
						>
							<UserContext.Provider
								value={{
									user: {
										uid: 'IIRXotQ5ZXgAMg9KPOlnZDFrhEl2',
										displayName: 'steve',
									},
								}}
							>
								<LoggedInUserContext.Provider value={{ user: userFixture }}>
									<Dashboard
										user={{
											uid: 'IIRXotQ5ZXgAMg9KPOlnZDFrhEl2',
											displayName: 'steve',
										}}
									/>
								</LoggedInUserContext.Provider>
							</UserContext.Provider>
						</FirebaseContext.Provider>
					</Router>
				);

			await waitFor(() => {
				expect(document.title).toEqual('Instagram');
				expect(getByTitle('Sign Out')).toBeTruthy();
				expect(getAllByText('raphael')).toBeTruthy();
				expect(getByAltText('Instagram')).toBeTruthy(); // Instagram logo
				expect(getByAltText('steve profile')).toBeTruthy();
				// expect(getByAltText('Saint George and the Dragon')).toBeTruthy();
				expect(getByText('Suggestions for you')).toBeTruthy();

				fireEvent.click(getByText('Follow')); // following the user

				// regular click
				fireEvent.click(getByTestId('like-photo-nJMT1l8msuNZ8tH3zvVI'));
				// toggle like using keyboard
				fireEvent.keyDown(getByTestId('like-photo-nJMT1l8msuNZ8tH3zvVI'), {
					key: 'Enter',
				});

				// click to focus on the comment icon -> input box
				fireEvent.click(getByTestId('focus-input-nJMT1l8msuNZ8tH3zvVI'));

				//  add a comment to a photo on the dashboard
				fireEvent.change(getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI'), {
					target: { value: 'Amazing photo!' },
				});

				// submit the form of nJMT1l8msuNZ8tH3zvVI
				fireEvent.submit(
					getByTestId('add-comment-submit-nJMT1l8msuNZ8tH3zvVI')
				);

				// submit a comment or at least attempt with an invalid string length
				fireEvent.change(getByTestId('add-comment-nJMT1l8msuNZ8tH3zvVI'), {
					target: { value: '' },
				});

				fireEvent.submit(
					getByTestId('add-comment-submit-nJMT1l8msuNZ8tH3zvVI')
				);

				// toggle focus
				fireEvent.keyDown(getByTestId('focus-input-nJMT1l8msuNZ8tH3zvVI'), {
					key: 'Enter',
				});

				// submit a comment using  nJMT1l8msuNZ8tH3zvVI
				fireEvent.submit(
					getByTestId('add-comment-submit-nJMT1l8msuNZ8tH3zvVI')
				);
			});
		});
	});

	it('renders the dashboard with a user profile of undefined', async () => {
		await act(async () => {
			getPhotos.mockImplementation(() => photosFixture);
			getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
			useUser.mockImplementation(() => ({ user: undefined }));

			const firebase = {
				firestore: jest.fn(() => ({
					collection: jest.fn(() => ({
						doc: jest.fn(() => ({
							update: jest.fn(() => Promise.resolve({})),
						})),
					})),
				})),
			};

			const { getByText, queryByText } = render(
				<Router>
					<FirebaseContext.Provider value={{ firebase }}>
						<UserContext.Provider
							value={{
								user: {
									uid: 'IIRXotQ5ZXgAMg9KPOlnZDFrhEl2',
									displayName: 'steve',
								},
							}}
						>
							<LoggedInUserContext.Provider value={{ user: userFixture }}>
								<Dashboard
									user={{
										uid: 'IIRXotQ5ZXgAMg9KPOlnZDFrhEl2',
										displayName: 'steve',
									}}
								/>
							</LoggedInUserContext.Provider>
						</UserContext.Provider>
					</FirebaseContext.Provider>
				</Router>
			);

			expect(getByText('Login')).toBeTruthy();
			expect(getByText('Sign Up')).toBeTruthy();
			expect(queryByText('Suggestions for you')).toBeFalsy();
		});
	});
});
