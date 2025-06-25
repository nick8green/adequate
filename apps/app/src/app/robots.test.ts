import robots from '@app/app/robots';

describe('robots', () => {
  it('should return the correct robots object', () => {
    const result = robots();

    expect(result).toEqual({
      host: '',
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/api/*',
      },
      sitemap: 'sitemap.xml',
    });
  });

  it('should have host as an empty string', () => {
    const result = robots();
    expect(result.host).toBe('');
  });

  it('should allow all user agents', () => {
    const result = robots();
    expect(result.rules.userAgent).toBe('*');
  });

  it('should allow root path and disallow /api/*', () => {
    const result = robots();
    expect(result.rules.allow).toBe('/');
    expect(result.rules.disallow).toBe('/api/*');
  });

  it('should set sitemap to /sitemap.xml', () => {
    const result = robots();
    expect(result.sitemap).toBe('sitemap.xml');
  });
});
