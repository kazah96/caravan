import { jwtDecode } from 'jwt-decode';

export function tokenHasExpired(token: string | null, maxExpirationDiff = 10000) {
  try {
    if (token !== null) {
      const parsedToken = jwtDecode(token);
      if (parsedToken !== null) {
        const now = Date.now();
        const { exp } = parsedToken;
        const diff = (exp ?? 0) * 1000 - now;
        if (diff > maxExpirationDiff) {
          return false;
        }
      }
    }
  } catch (e) {
    return true;
  }

  return true;
}
