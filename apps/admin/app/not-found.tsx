import Link from 'next/link';
import { FC } from 'react';

export const NotFount: FC = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href='/'>Return Home</Link>
    </div>
  );
};

export default NotFount;
