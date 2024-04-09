import { User } from '../../model/auth';
import { LoginResponse } from './types';

export const transformLoginResult = (result: LoginResponse): User => {
  return {
    id: result.id,
    refreshToken: result.refresh_token,
    status: result.status,
    token: result.token,
  };
};
