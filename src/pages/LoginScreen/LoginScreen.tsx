import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { setLoading, setLoggedInUser } from '../../store/authSlice';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginUserDto } from '../../services/types';
import { ControlledInput } from '../../components/Input/Input';
import { Button, Typography } from '@mui/material';
import styles from './LoginScreenStyles.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config/config';
import { TOKEN } from '../../services/token';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Please use correct email format!')
    .max(150, 'Email cannot be longer than 150 characters!')
    .required('This field is required!'),
  password: yup
    .string()
    .min(6, 'Password needs at least 6 characters!')
    .max(30, 'Password cannot be longer than 30 characters!')
    .required('This field is required!')
});

export const LoginScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<LoginUserDto>({
    resolver: yupResolver(validationSchema)
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authLoading = useSelector((state: RootState) => state.auth.loading);

  const onSubmit = (data: LoginUserDto) => {
    dispatch(setLoading(true));
    axios
      .post(`${config.API_URL}api/auth/login`, data)
      .then(function (response) {
        if (response.data) {
          TOKEN.set(response.data.jwt);
          dispatch(setLoggedInUser(response.data.userDTO));
        } else {
          console.log('NOT GOOD');
        }
      })
      .catch(function (error) {
        console.log('Error: ', error);
      });
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <Typography variant={'h3'} sx={{ fontWeight: '700' }}>
          Welcome back!
        </Typography>
        <Typography variant={'h5'} sx={{ fontWeight: '500' }}>
          Let's log you back in:
        </Typography>
      </div>
      <div className={styles.inputDataWrapper}>
        <ControlledInput control={control} label="Email" name={'email'} />
        <ControlledInput
          control={control}
          label="Password"
          name={'password'}
          textType={'password'}
        />
        <Button
          variant={'contained'}
          fullWidth
          color={'primary'}
          onClick={handleSubmit(onSubmit)}
          disabled={authLoading}
        >
          Log in
        </Button>
      </div>
      <div className={styles.footerWrapper}>
        <Typography
          variant={'h5'}
          sx={{ fontWeight: '500', textAlign: 'center' }}
        >
          First time joining us?
        </Typography>
        <Button
          variant={'outlined'}
          fullWidth
          color={'primary'}
          onClick={() => navigate('/register')}
          disabled={authLoading}
        >
          Register
        </Button>
      </div>
    </div>
  );
};
