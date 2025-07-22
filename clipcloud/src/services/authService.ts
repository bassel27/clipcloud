import { API_BASE_URL } from "@/utils/constants";
import axios from "axios";

export const TOKEN_STORAGE = {
  setTokens: (accessToken: string, refreshToken: string) => {
    // TODO: Use httpOnly cookies in production, sessionStorage as fallback
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

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth header
apiClient.interceptors.request.use(
  (config) => {
    const token = TOKEN_STORAGE.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("token is "  + token)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {      originalRequest._retry = true;
      
      try {
        console.log("refresh token shit")
        const refreshToken = TOKEN_STORAGE.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        TOKEN_STORAGE.setTokens(accessToken, newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.log("refresh error:" + refreshError)
        TOKEN_STORAGE.clearTokens();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
    email,
    password,
  });

  const { accessToken, refreshToken } = response.data;
  TOKEN_STORAGE.setTokens(accessToken, refreshToken);
  
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    email,
    password,
  });

  // Note: Your backend register doesn't return tokens, only user info
  // You might want to auto-login after registration
  return response.data; 
};

// export const logout = async () => {
//   try {
//     // Optional: Call backend logout endpoint
//     await apiClient.post('/auth/logout');
//   } catch (error) {
//     console.error('Logout error:', error);
//   } finally {
//     TOKEN_STORAGE.clearTokens();
//   }
// };

export const isAuthenticated = (): boolean => {
  return !!TOKEN_STORAGE.getAccessToken();
};
