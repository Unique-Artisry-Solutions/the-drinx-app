
export interface TestUserCredential {
  email: string;
  password: string;
  name: string;
  username: string;
  userType: string;
  phone: string;
}

export interface TestCredentialsData {
  individual: TestUserCredential;
  establishment: TestUserCredential;
  promoter: TestUserCredential;
  admin: TestUserCredential;
}
