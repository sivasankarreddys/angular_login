/**
 * Mock data for testing login application
 */

export const MockUsers = {
  validUser: {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator'
  },
  testUser: {
    username: 'testuser',
    password: 'testpass',
    name: 'Test User'
  },
  invalidUser: {
    username: 'invalid',
    password: 'wrong',
    name: 'Invalid User'
  }
};

export const MockResponses = {
  loginSuccess: 'login successful!',
  loginFailure: 'Invalid username or password',
  serverError: 'Internal server error',
  networkError: 'Network connection failed',
  emptyCredentials: 'Please enter username and password',
  userNotFound: 'User not found',
  accountLocked: 'Account is locked'
};

export const MockApiEndpoints = {
  validate: 'http://localhost:8080/login/validate',
  getName: 'http://localhost:8080/login/name',
  logout: 'http://localhost:8080/login/logout'
};

export const MockHttpErrors = {
  unauthorized: {
    status: 401,
    statusText: 'Unauthorized',
    message: 'Authentication failed'
  },
  serverError: {
    status: 500,
    statusText: 'Internal Server Error',
    message: 'Server is temporarily unavailable'
  },
  notFound: {
    status: 404,
    statusText: 'Not Found',
    message: 'Endpoint not found'
  },
  badRequest: {
    status: 400,
    statusText: 'Bad Request',
    message: 'Invalid request format'
  }
};

export const MockFormData = {
  validLogin: {
    username: 'admin',
    password: 'admin123'
  },
  invalidLogin: {
    username: 'wronguser',
    password: 'wrongpass'
  },
  emptyLogin: {
    username: '',
    password: ''
  },
  partialLogin: {
    username: 'user',
    password: ''
  }
};