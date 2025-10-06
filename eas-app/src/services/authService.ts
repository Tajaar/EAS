// eas-app/src/services/authService.ts
import { api } from "./api";
import type { User } from "../types/user";

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};
