import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginScreen } from '../pages/LoginScreen/LoginScreen';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { LoggedInRoutes } from './LoggedInRoutes';
import { LoggedOutRoutes } from './LoggedOutRoutes';
import { SplashScreen } from '../pages/SplashScreen/SplashScreen';

export const AppRoutes: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const isLoggedOut = useSelector((state: RootState) => state.auth.loggedOut);

  const UserRoutes = () => {
    if (isLoggedIn) return <LoggedInRoutes />;
    if (isLoggedOut) return <LoggedOutRoutes />;
    else return <SplashScreen />;
  };

  return <UserRoutes />;
};
