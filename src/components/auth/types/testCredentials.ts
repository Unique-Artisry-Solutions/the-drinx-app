
export interface TestUserCredentials {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: 'individual' | 'establishment' | 'promoter';
  phone: string;
}

export interface TestCredentialsData {
  individual: TestUserCredentials;
  establishment: TestUserCredentials;
  promoter: TestUserCredentials;
}
