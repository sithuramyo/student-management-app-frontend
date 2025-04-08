import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = <T = any>(token: string): T | null => {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
};
