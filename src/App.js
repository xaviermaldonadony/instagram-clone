import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as ROUTES from './constants/routes';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
	return (
		<Router>
			<Suspense fallback={<p>Loading ...</p>}>
				<Switch>
					<Route path={ROUTES.LOGIN} component={Login} />
					<Route path={ROUTES.SIGN_UP} component={Signup} />
					<Route component={NotFound} />
				</Switch>
			</Suspense>
		</Router>
	);
}

export default App;
