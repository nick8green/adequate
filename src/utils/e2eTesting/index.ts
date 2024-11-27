import { test as base } from '@playwright/test';

interface CustomFixtures {}

export const test = base.extend<CustomFixtures>({});

export { expect } from '@playwright/test';
