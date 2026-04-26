process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';

// Extend test timeout for slow operations
jest.setTimeout(10000);

// Suppress console output during tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress logs
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
};
