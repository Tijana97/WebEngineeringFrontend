import React, { PropsWithChildren } from 'react';
import styles from './TabStyles.module.css';
import { Typography } from '@mui/material';

type TabProps = {
  selected?: boolean;
  onClick: () => void;
  text: string;
};

export const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  selected = false,
  onClick,
  text
}) => {
  return (
    <div
      className={styles.wrapper}
      style={selected ? { borderBottom: '4px solid black' } : {}}
      onClick={onClick}
    >
      <Typography variant={'h5'}>{text}</Typography>
    </div>
  );
};
