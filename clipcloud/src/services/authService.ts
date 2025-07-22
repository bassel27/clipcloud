import { API_BASE_URL } from "@/utils/constants";
import axios from "axios";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
    email,
    password,
  });

  return response.data; // { access_token, refresh_token }
};


export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
    email,
    password,
  });

  return response.data; 
};