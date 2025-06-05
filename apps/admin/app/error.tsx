'use client';

import { FC, useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// This error boundary is used to catch errors in the app
// and display a fallback UI. It can be used to catch errors in
// server components, client components, and pages.
// It is a client component, so it can use hooks like useEffect.
// It is also used to catch errors in the app router.
// It is used to catch errors in the app router.

export const Error: FC = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error); // eslint-disable-line no-console
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default Error;
