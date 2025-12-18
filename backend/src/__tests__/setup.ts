// Test setup file
// This file runs before all tests

// Configure test environment variables if needed
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

// Add any global test setup here
// For example, database connections, mocks, etc.



