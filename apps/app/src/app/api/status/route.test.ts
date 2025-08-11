import * as route from '@app/app/api/status/route';
import * as handler from '@shared/routes/status';

jest.mock('@shared/routes/status', () => ({
  __esModule: true,
  default: jest.fn(() => 'serveStatusHandler'),
}));

describe('status route', () => {
  it('should export revalidate as 5', () => {
    expect(route.revalidate).toBe(5);
  });

  it('should export GET as the result of serveStatus("/status")', () => {
    expect(route.GET).toBe('serveStatusHandler');
    expect(handler.default).toHaveBeenCalled();
  });
});
