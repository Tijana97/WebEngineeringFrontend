import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomeScreen } from '../pages/HomeScreen/HomeScreen';
import { Navbar } from '../components/Navbar/Navbar';
import { ProfileScreen } from '../pages/ProfileScreen/ProfileScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { CreateHotelScreen } from '../pages/CreateHotelScreen/CreateHotelScreen';

export const LoggedInRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Navbar />
      <Routes>
        {user?.userType === 'OWNER' ? (
          <>
            <Route path="*" element={<ProfileScreen />} />
            <Route path="/" element={<ProfileScreen />} />
            <Route path="/add-hotel" element={<CreateHotelScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </>
        ) : (
          <>
            <Route path="*" element={<HomeScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </>
        )}
      </Routes>
    </div>
  );
};
