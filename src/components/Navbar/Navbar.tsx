import React, { useEffect, useState } from 'react';
import styles from './NavbarStyles.module.css';
import { DesktopNavbar } from './DesktopNavbar/DesktopNavbar';
import { MyBusiness, NavbarItems } from '../../services/types';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { MobileNavbar } from './MobileNavbar/MobileNavbar';

export const Navbar: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (
      location.pathname.split('/')[1] === '' ||
      location.pathname.split('/')[1] === undefined
    ) {
      if (user?.userType === 'OWNER') {
        setCurrentTab('profile');
      } else {
        setCurrentTab('home');
      }
    } else {
      setCurrentTab(location.pathname.split('/')[1]);
    }
  }, [location.pathname]);

  const tabs: Record<string, NavbarItems | MyBusiness> =
    user?.userType === 'CLIENT'
      ? {
          home: {
            value: 'Home'
          },
          profile: {
            value: 'Profile'
          }
        }
      : {
          'add-hotel': {
            value: 'Add Hotel'
          },
          profile: {
            value: 'Profile'
          }
        };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.desktopNavbar}>
        <DesktopNavbar user={user} tabs={tabs} defaultTab={currentTab} />
      </div>
      <div className={styles.mobileNavbar}>
        <MobileNavbar user={user} tabs={tabs} defaultTab="home" />
      </div>
    </nav>
  );
};
