it.todo('errorPage test');

// import ErrorPage from '@shared/pages/error';
// import { fireEvent, render, screen } from '@testing-library/react';
// import React from 'react';

// // Mock Modal component from @nick8green/components
// jest.mock('@nick8green/components', () => ({
//   Modal: ({ isOpen, onClose, children }: any) =>
//     isOpen ? (
//       <div data-testid='modal'>
//         <button data-testid='close-modal' onClick={onClose}>
//           Close
//         </button>
//         {children}
//       </div>
//     ) : null,
// }));

// describe('ErrorPage', () => {
//   const error = new Error('Test error');
//   const reset = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders the error modal with correct content', () => {
//     render(<ErrorPage error={error} reset={reset} />);
//     expect(screen.getByTestId('modal')).toBeInTheDocument();
//     expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
//     expect(
//       screen.getByText(
//         'Really sorry about this, we are not sure what has happened.',
//       ),
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText(
//         'Please try again and if the problem persists, please contact an administrator.',
//       ),
//     ).toBeInTheDocument();
//     expect(screen.getByText('Try again')).toBeInTheDocument();
//     expect(screen.getByText('Report Bug')).toBeInTheDocument();
//   });

//   it('calls reset when "Try again" button is clicked', () => {
//     render(<ErrorPage error={error} reset={reset} />);
//     fireEvent.click(screen.getByText('Try again'));
//     expect(reset).toHaveBeenCalledTimes(1);
//   });

//   it('calls reset when modal close button is clicked', () => {
//     render(<ErrorPage error={error} reset={reset} />);
//     fireEvent.click(screen.getByTestId('close-modal'));
//     expect(reset).toHaveBeenCalledTimes(1);
//   });

//   it('opens bug report link in a new tab when "Report Bug" is clicked', () => {
//     const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
//     render(<ErrorPage error={error} reset={reset} />);
//     fireEvent.click(screen.getByText('Report Bug'));
//     expect(openSpy).toHaveBeenCalledWith(
//       'https://github.com/nick8green/adequate/issues/new?template=bug_report.yml',
//       '_blank',
//     );
//     openSpy.mockRestore();
//   });

//   it('logs the error to console.error', () => {
//     const consoleErrorSpy = jest
//       .spyOn(console, 'error')
//       .mockImplementation(() => {});
//     render(<ErrorPage error={error} reset={reset} />);
//     expect(consoleErrorSpy).toHaveBeenCalledWith(error);
//     consoleErrorSpy.mockRestore();
//   });
// });
