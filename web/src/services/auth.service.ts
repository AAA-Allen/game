import { api } from "@/services/api";
import type { ApiResponse, AuthUser } from "@/types/api";

type AuthPayload = {
  username: string;
  password: string;
};

type LoginData = {
  token: string;
  user: AuthUser;
};

type RegisterData = {
  user: AuthUser;
};

export async function login(payload: AuthPayload) {
  const response = await api.post<ApiResponse<LoginData>>("/auth/login", payload);
  return response.data.data;
}

export async function register(payload: AuthPayload) {
  const response = await api.post<ApiResponse<RegisterData>>(
    "/auth/register",
    payload,
  );
  return response.data.data;
}

export async function getProfile() {
  const response = await api.get<ApiResponse<AuthUser>>("/users/profile");
  return response.data.data;
}
