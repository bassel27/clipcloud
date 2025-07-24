export const TOKEN_STORAGE = {
  setTokens: (accessToken: string, refreshToken: string) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
  },
  
  getAccessToken: (): string | null => {
    return sessionStorage.getItem('access_token');
  },
  
  getRefreshToken: (): string | null => {
    return sessionStorage.getItem('refresh_token');
  },
  
  clearTokens: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }
};