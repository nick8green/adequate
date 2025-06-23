import { Modal } from '@nick8green/components';
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

const ErrorPage: FC<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error); // eslint-disable-line no-console
  }, [error]);

  return (
    <Modal isOpen={true} onClose={reset}>
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
            )
          }
        >
          Report Bug
        </button>
      </div>
    </Modal>
  );
};

export default ErrorPage;
