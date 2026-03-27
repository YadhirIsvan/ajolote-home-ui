let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStore = {
  setTokens(access: string, refresh: string): void {
    _accessToken = access;
    _refreshToken = refresh;
  },
  getAccessToken(): string | null {
    return _accessToken;
  },
  getRefreshToken(): string | null {
    return _refreshToken;
  },
  clearTokens(): void {
    _accessToken = null;
    _refreshToken = null;
  },
};
