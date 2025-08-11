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

const GlobalError: FC<GlobalErrorProps> = ({ error, reset }) => {
  console.error('Global error caught:', error); // eslint-disable-line no-console
  return (
    <html lang='en'>
      <body>
        <div>
          <h2>Something went wrong!</h2>
          <p>Really sorry about this, we are not sure what has happened.</p>
          <p>
            Please try again and if the problem persists, please contact an
            administrator.
          </p>
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
          <button
            onClick={() =>
              window.open(
                'https://github.com/nick8green/adequate/issues/new?template=bug_report.yml',
                '_blank',
                'noopener noreferrer',
              )
            }
          >
            Report Bug
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
