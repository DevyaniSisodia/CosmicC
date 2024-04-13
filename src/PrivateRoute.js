// PrivateRoute.js

import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [user] = useAuthState(auth);

  return user ? <Route {...rest} element={<Element />} /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
