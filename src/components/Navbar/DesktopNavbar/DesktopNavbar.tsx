import React from 'react';
import { AuthUser, MyBusiness, NavbarItems } from '../../../services/types';
import styles from '../NavbarStyles.module.css';
import logo from '../../../images/logo.png';
import { TabGroup } from '../../Tabs/TabGroup/TabGroup';

type DesktopNavbarProps<T = string> = {
  tabs: Record<string, NavbarItems | MyBusiness>;
  defaultTab?: T;
  user: AuthUser | undefined;
};

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  tabs,
  defaultTab,
  user
}) => {
  return (
    <>
      <div className={styles.titleWrapper}>
        <img src={logo} alt="Alumni" className={styles.logoStyle} />
      </div>
      <TabGroup tabs={tabs} defaultTab={defaultTab} />
      {/* {user && (
        <ProfileButton onClick={onProfileClick} />
      )} */}
    </>
  );
};
