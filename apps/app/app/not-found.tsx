import Link from 'next/link';

export default () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href='/'>Return Home</Link>
    </div>
  );
};
