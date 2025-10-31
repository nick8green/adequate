import {
  boolean,
  exists,
  mustBeBoolean,
  mustBeNumber,
  mustBeString,
  number,
  string,
} from './environment';

describe('environment utils', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe('number', () => {
    it('returns number when env var is set', () => {
      process.env.TEST_NUM = '42';
      expect(number('TEST_NUM')).toBe(42);
    });

    it('returns undefined when env var is not set', () => {
      delete process.env.TEST_NUM;
      expect(number('TEST_NUM')).toBeUndefined();
    });

    it('returns NaN for non-numeric string', () => {
      process.env.TEST_NUM = 'abc';
      expect(number('TEST_NUM')).toBeNaN();
    });
  });

  describe('string', () => {
    it('returns string when env var is set', () => {
      process.env.TEST_STR = 'hello';
      expect(string('TEST_STR')).toBe('hello');
    });

    it('returns undefined when env var is not set', () => {
      delete process.env.TEST_STR;
      expect(string('TEST_STR')).toBeUndefined();
    });
  });

  describe('boolean', () => {
    it('returns true for "true"', () => {
      process.env.TEST_BOOL = 'true';
      expect(boolean('TEST_BOOL')).toBe(true);
    });

    it('returns false for "false"', () => {
      process.env.TEST_BOOL = 'false';
      expect(boolean('TEST_BOOL')).toBe(false);
    });

    it('is case insensitive', () => {
      process.env.TEST_BOOL = 'TrUe';
      expect(boolean('TEST_BOOL')).toBe(true);
    });

    it('returns undefined when env var is not set', () => {
      delete process.env.TEST_BOOL;
      expect(boolean('TEST_BOOL')).toBeUndefined();
    });

    it('returns false for any other value', () => {
      process.env.TEST_BOOL = 'yes';
      expect(boolean('TEST_BOOL')).toBe(false);
    });
  });

  describe('mustBeString', () => {
    it('returns string when env var is set', () => {
      process.env.TEST_STR = 'hello';
      expect(mustBeString('TEST_STR')).toBe('hello');
    });

    it('throws error when env var is not set', () => {
      delete process.env.TEST_STR;
      expect(() => mustBeString('TEST_STR')).toThrow(
        'Environment variable TEST_STR is required',
      );
    });
  });

  describe('mustBeNumber', () => {
    it('returns number when env var is set to a number', () => {
      process.env.TEST_NUM = '123';
      expect(mustBeNumber('TEST_NUM')).toBe(123);
    });

    it('throws error when env var is not set', () => {
      delete process.env.TEST_NUM;
      expect(() => mustBeNumber('TEST_NUM')).toThrow(
        'Environment variable TEST_NUM must be a valid number',
      );
    });

    it('throws error when env var is not a valid number', () => {
      process.env.TEST_NUM = 'abc';
      expect(() => mustBeNumber('TEST_NUM')).toThrow(
        'Environment variable TEST_NUM must be a valid number',
      );
    });
  });

  describe('mustBeBoolean', () => {
    it('returns true for "true"', () => {
      process.env.TEST_BOOL = 'true';
      expect(mustBeBoolean('TEST_BOOL')).toBe(true);
    });

    it('returns false for "false"', () => {
      process.env.TEST_BOOL = 'false';
      expect(mustBeBoolean('TEST_BOOL')).toBe(false);
    });

    it('is case insensitive', () => {
      process.env.TEST_BOOL = 'TrUe';
      expect(mustBeBoolean('TEST_BOOL')).toBe(true);
    });

    it('throws error when env var is not set', () => {
      delete process.env.TEST_BOOL;
      expect(() => mustBeBoolean('TEST_BOOL')).toThrow(
        "Environment variable TEST_BOOL must be 'true' or 'false'",
      );
    });

    it('throws error when env var is not "true" or "false"', () => {
      process.env.TEST_BOOL = 'yes';
      expect(() => mustBeBoolean('TEST_BOOL')).toThrow(
        "Environment variable TEST_BOOL must be 'true' or 'false'",
      );
    });
  });

  describe('exists', () => {
    it('returns true when env var is set', () => {
      process.env.TEST_EXISTS = 'something';
      expect(exists('TEST_EXISTS')).toBe(true);
    });

    it('returns false when env var is not set', () => {
      delete process.env.TEST_EXISTS;
      expect(exists('TEST_EXISTS')).toBe(false);
    });
  });
});
