import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../services/types';

interface AuthState {
  user?: AuthUser;
  loggedIn: boolean;
  loggedOut?: boolean;
  loading: boolean;
  error?: string;
}

const initialState: AuthState = {
  user: undefined,
  loggedIn: false,
  loggedOut: undefined,
  loading: false,
  error: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.loggedOut = false;
      state.loading = false;
    },
    signUpSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.loggedOut = false;
      state.loading = false;
    },
    signOutSuccess: (state) => {
      state.user = undefined;
      state.loggedIn = false;
      state.loggedOut = true;
      state.loading = false;
    },
    setLoggedInUser: (state, action: PayloadAction<AuthUser | undefined>) => {
      state.user = action.payload;
      state.loggedIn = !!action.payload;
      state.loggedOut = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  signInSuccess,
  signUpSuccess,
  signOutSuccess,
  setLoggedInUser,
  setLoading,
  setError
} = authSlice.actions;

export default authSlice.reducer;
