import { API_BASE_URL } from "@/utils/constants";
import { TOKEN_STORAGE } from "@/utils/tokenStorage";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth header
apiClient.interceptors.request.use(
  (config) => {
    const token = TOKEN_STORAGE.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
