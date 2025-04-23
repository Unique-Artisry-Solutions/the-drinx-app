
import { TestCredentialsData } from '../types/testCredentials';

export const TEST_CREDENTIALS: TestCredentialsData = {
  individual: {
    email: 'testuser@spiritless.com',
    password: 'Test123!',
    name: 'Test User',
    username: 'testuser',
    userType: 'individual',
    phone: '555-0101'
  },
  establishment: {
    email: 'testbusiness@spiritless.com',
    password: 'Test123!',
    name: 'Test Bar',
    username: 'testbar',
    userType: 'establishment',
    phone: '555-0102'
  },
  promoter: {
    email: 'testpromoter@spiritless.com',
    password: 'Test123!',
    name: 'Test Promoter',
    username: 'testpromoter',
    userType: 'promoter',
    phone: '555-0103'
  }
};
