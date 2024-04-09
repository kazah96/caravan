export type LoginRequestParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  refresh_token: string;
  status: number;
  token: string;
  message: string;
};
