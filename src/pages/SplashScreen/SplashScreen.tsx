import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signInSuccess, signOutSuccess } from '../../store/authSlice';
import axios from 'axios';
import { TOKEN } from '../../services/token';
import styles from './SplashScreenStyles.module.css';
import logo from '../../images/logo.png';
import { LinearProgress, Typography } from '@mui/material';

export const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (TOKEN.get()) {
      axios
        .get(`http://localhost:8080/api/auth/get-me`, {
          headers: { Authorization: `${TOKEN.get()}` }
        })
        .then(function (response) {
          if (response.data) {
            console.log('DATA: ', response.data);
            dispatch(signInSuccess(response.data));
          } else {
            console.log('NOT GOOD');
            dispatch(signOutSuccess());
          }
        })
        .catch(function (error) {
          console.log('Error: ', error);
          dispatch(signOutSuccess());
        });
    } else {
      dispatch(signOutSuccess());
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <img src={logo} alt="logo" className={styles.logoStyle} />
      <Typography variant="h3">Loading...</Typography>
      <div className={styles.loaderStyle}>
        <LinearProgress />
      </div>
    </div>
  );
};
