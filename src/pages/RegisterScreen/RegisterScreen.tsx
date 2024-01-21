import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { UserRequestDto } from '../../services/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import styles from './RegisterScreenStyles.module.css';
import { Button, Typography } from '@mui/material';
import { ControlledInput } from '../../components/Input/Input';
import { ControlledSelect } from '../../components/Select/Select';
import { setLoading } from '../../store/authSlice';
import axios from 'axios';
import { config } from '../../config/config';

const validationSchema = yup.object({
  firstName: yup.string().required('This field is required!'),
  lastName: yup.string().required('This field is required!'),
  username: yup.string().required('This field is required!'),
  address: yup.string().required('This field is required!'),
  userType: yup.string().required('This field is required!'),
  emailAddress: yup
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

export const RegisterScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<UserRequestDto>({
    resolver: yupResolver(validationSchema)
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authLoading = useSelector((state: RootState) => state.auth.loading);

  const onSubmit = (data: UserRequestDto) => {
    dispatch(setLoading(true));
    axios
      .post(`${config.API_URL}api/auth/register`, data)
      .then(function (response) {
        if (response.data) {
          dispatch(setLoading(false));
          navigate('/login');
        } else {
          dispatch(setLoading(false));
          console.log('NOT GOOD');
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        console.log('Error: ', error);
      });
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <Typography variant={'h3'} sx={{ fontWeight: '700' }}>
          Welcome!
        </Typography>
        <Typography variant={'h5'} sx={{ fontWeight: '500' }}>
          Let's set you up:
        </Typography>
      </div>
      <div className={styles.inputDataWrapper}>
        <div className={styles.basicUserDataWrapper}>
          <ControlledInput
            control={control}
            label="First name"
            name={'firstName'}
          />
          <ControlledInput
            control={control}
            label="Last name"
            name={'lastName'}
          />
          <ControlledInput
            control={control}
            label="Username"
            name={'username'}
          />
        </div>
        <div className={styles.basicUserDataWrapper}>
          <ControlledInput
            control={control}
            label="Email"
            name={'emailAddress'}
          />
          <ControlledInput
            control={control}
            label="Password"
            name={'password'}
            textType={'password'}
          />
          <ControlledInput control={control} label="Address" name={'address'} />
        </div>
      </div>
      <div className={styles.userTypeAndButtonWrapper}>
        <ControlledSelect
          control={control}
          label="User type"
          name={'userType'}
          options={[
            {
              label: 'Business Owner',
              value: 'OWNER'
            },
            { label: 'Regular User', value: 'CLIENT' }
          ]}
        />
        <Button
          variant={'contained'}
          onClick={handleSubmit(onSubmit)}
          fullWidth
          disabled={authLoading}
        >
          Register
        </Button>
      </div>
      <div className={styles.footerWrapper}>
        <Typography
          variant={'h5'}
          sx={{ fontWeight: '500', textAlign: 'center' }}
        >
          Already have an account?
        </Typography>
        <Button
          variant={'outlined'}
          fullWidth
          color={'primary'}
          onClick={() => navigate('/login')}
          disabled={authLoading}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
