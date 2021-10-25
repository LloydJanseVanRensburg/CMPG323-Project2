export interface UserAccountData {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
}

export interface RegisterPayload {}

export interface LoginPayload {
  email: string;
  password: string;
}
