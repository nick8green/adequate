export const number = (key: string): number | undefined => {
  const value = process.env[key];
  return value ? Number(value) : undefined;
};

export const string = (key: string): string | undefined => {
  return process.env[key];
};

export const boolean = (key: string): boolean | undefined => {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : undefined;
};

export const mustBeString = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

export const mustBeNumber = (key: string): number => {
  const value = process.env[key];
  if (!value || isNaN(Number(value))) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return Number(value);
};

export const mustBeBoolean = (key: string): boolean => {
  const value = process.env[key];
  if (
    !value ||
    (value.toLowerCase() !== 'true' && value.toLowerCase() !== 'false')
  ) {
    throw new Error(`Environment variable ${key} must be 'true' or 'false'`);
  }
  return value.toLowerCase() === 'true';
};

export const exists = (key: string): boolean => {
  return process.env[key] !== undefined;
};
