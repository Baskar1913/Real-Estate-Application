import api from "./api";
import type { AuthResponse, AuthUser, LoginData, RegisterData } from "../types";

export const loginRequest = async (data: LoginData) => (await api.post<AuthResponse>("/auth/login/", data)).data;
export const registerRequest = async (data: RegisterData) => (await api.post<AuthResponse>("/auth/register/", data)).data;
export const currentUserRequest = async () => (await api.get<AuthUser>("/auth/me/")).data;
export const logoutRequest = async () => { await api.post("/auth/logout/"); };
export const forgotRequest = async (data: { email: string; role: "user" | "admin"; step: "verify" | "reset"; password?: string; confirm_password?: string }) => (await api.post<{message: string}>("/auth/forgot-password/", data)).data;
