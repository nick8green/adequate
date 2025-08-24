import sitemap from '@app/app/sitemap';

describe('sitemap', () => {
  it('should return an array with the correct url', () => {
    const result = sitemap();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('https://nick8green.co.uk');
  });

  it('should set lastModified to a recent date', () => {
    const result = sitemap();
    const lastModified = result[0].lastModified;
    expect(lastModified).toBeInstanceOf(Date);
    // Check that lastModified is within the last 5 seconds
    expect(Date.now() - lastModified.getTime()).toBeLessThan(5000);
  });
});
