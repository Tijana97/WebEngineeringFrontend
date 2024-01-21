import React from 'react';
import PlusCircle from '../../images/plusCircle.svg';
import styles from './ImageCardStyles.module.css';
import { Typography } from '@mui/material';

type ImageCardProps = {
  image?: string;
  headerText: string;
  subtitleText?: string;
  onClick: () => void;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  headerText,
  subtitleText = '',
  onClick,
  ...rest
}) => {
  return (
    <div className={styles.imageCardContainer} onClick={onClick}>
      {image ? (
        <div className={styles.imageContainer}>
          <img
            src={image}
            alt="imageFailedToRender"
            className={styles.imageStyle}
          />
        </div>
      ) : (
        <div className={styles.addImageContainer}>
          <img
            src={PlusCircle}
            alt="imageFailedToRender"
            style={{ width: '50%', height: '50%' }}
          />
        </div>
      )}

      <div className={styles.imageCardComponent}>
        <Typography variant={'h6'} sx={{ fontWeight: '700' }} noWrap>
          {headerText}
        </Typography>
        <Typography variant={'h6'} noWrap>
          {subtitleText}
        </Typography>
      </div>
    </div>
  );
};
