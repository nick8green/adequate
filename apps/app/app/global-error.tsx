'use client';

import { FC } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// This error boundary is used to catch errors in the app
// and display a fallback UI. It can be used to catch errors in
// server components, client components, and pages.
// It is a client component, so it can use hooks like useEffect.
// It is also used to catch errors in the app router.
// It is used to catch errors in the app router.

export const GlobalError: FC<GlobalErrorProps> = ({ error, reset }) => {
  console.error('Global error caught:', error); // eslint-disable-line no-console
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
};

export default GlobalError;
