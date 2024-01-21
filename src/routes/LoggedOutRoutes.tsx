import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginScreen } from '../pages/LoginScreen/LoginScreen';
import { RegisterScreen } from '../pages/RegisterScreen/RegisterScreen';

export const LoggedOutRoutes: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Routes>
        <Route path="*" element={<LoginScreen />} />
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </div>
  );
};
