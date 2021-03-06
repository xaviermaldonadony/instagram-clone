import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

export default function Signup() {
	const history = useHistory();
	const { firebase } = useContext(FirebaseContext);

	const [username, setUsername] = useState('');
	const [fullName, setFullName] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const isInvalid = password === '' || emailAddress === '';

	const handleSignup = async (event) => {
		event.preventDefault();
		const userNameExists = await doesUsernameExist(username);
		// if length 0, falsy no user, crete user
		if (!userNameExists.length) {
			try {
				const createdUserResult = await firebase
					.auth()
					.createUserWithEmailAndPassword(emailAddress, password);
				// authentication
				// emailAddress & password & username (displayName)
				await createdUserResult.user.updateProfile({ displayName: username });

				// firebase user collection (create a document)
				await firebase
					.firestore()
					.collection('users')
					.add({
						userId: createdUserResult.user.uid,
						username: username.toLowerCase(),
						fullName,
						emailAddress: emailAddress.toLowerCase(),
						// follow some one to see a time line
						following: ['2'],
						followers: [],
						dateCreted: Date.now(),
					});
				history.push(ROUTES.DASHBOARD);
			} catch (error) {
				setUsername('');
				setFullName('');
				setEmailAddress('');
				setPassword('');
				setError(error.message);
			}
		} else {
			setUsername('');
			setFullName('');
			setEmailAddress('');
			setPassword('');
			setError('That user name is already taken, please try another.');
		}
	};

	useEffect(() => {
		document.title = 'Sign Up - Instagram';
	}, []);

	return (
		<div className='container px-4 md:px-0 flex flex-col md:flex-row mx-auto max-w-screen-md items-center h-screen'>
			<div className='hidden md:flex w-full md:w-3/5'>
				<img
					src='/images/iphone-with-profile.jpg'
					alt='iphone with'
					className='object-scale-down'
				/>
			</div>
			<div className='flex flex-col w-full md:w-2/5 justify-center h-full max-w-md m-auto'>
				<div className='flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded'>
					<h1 className='flex justify-center w-full'>
						<img
							src='/images/logo.png'
							alt='Instagram'
							className='mt-2 w-6/12 mb-4'
						/>
					</h1>
					{error && <p className='mb-4 text-xs text-red-primary'>{error}</p>}

					<form onSubmit={handleSignup} method='POST'>
						<input
							aria-label='Enter your username'
							type='text'
							placeholder='Username'
							className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-gray-primary rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-medium focus:border-transparent'
							onChange={({ target }) => setUsername(target.value)}
							value={username}
						/>
						<input
							aria-label='Enter your full name'
							type='text'
							placeholder='Full name'
							className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-gray-primary rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-medium focus:border-transparent'
							onChange={({ target }) => setFullName(target.value)}
							value={fullName}
						/>
						<input
							aria-label='Enter your email address'
							type='text'
							placeholder='Email address'
							className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-gray-primary rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-medium focus:border-transparent '
							onChange={({ target }) => setEmailAddress(target.value)}
							value={emailAddress}
						/>
						<input
							aria-label='Enter your email address'
							type='password'
							placeholder='Password'
							className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-gray-primary rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-medium focus:border-transparent'
							onChange={({ target }) => setPassword(target.value)}
							value={password}
						/>
						<button
							data-testid='sign-up'
							disabled={isInvalid}
							type='submit'
							className={`bg-blue-medium text-white w-full founded h-8 font-bold ${
								isInvalid && 'opacity-50'
							}`}
						>
							Sign Up
						</button>
					</form>
				</div>
				<div className='flex justify center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary'>
					<p className='text-sm'>
						Have an account?
						<Link to={ROUTES.LOGIN} className='font-bold text-blue-medium'>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
