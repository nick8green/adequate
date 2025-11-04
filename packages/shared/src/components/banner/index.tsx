import './style.css';

import Image from 'next/image';
import { FC } from 'react';

type BannerProps = {
  title: string;
  description: string;
  image: string;
  side: 'left' | 'right';
};

export const Banner: FC<BannerProps> = ({
  title,
  description,
  image,
  side,
}) => (
  <div className='banner'>
    <div className={`banner-image ${side}`}>
      <Image
        alt={title}
        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPcvmFDPQAG1QKYq7uyLgAAAABJRU5ErkJggg=='
        height={300}
        src={image}
        width={400}
        placeholder='blur'
        priority={true}
      />
    </div>
    <div className={`banner-content`}>
      <h3 className='banner-title'>{title}</h3>
      <p className='banner-description'>{description}</p>
    </div>
  </div>
);

export default Banner;
