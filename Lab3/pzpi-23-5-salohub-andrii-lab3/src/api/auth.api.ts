import { apiRequest } from '@/api/client';
import type {
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RefreshResponse,
  User,
} from '@/types/auth.types';

export const register = (data: RegisterRequest) =>
  apiRequest<ApiResponse<RegisterResponse>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyEmail = (userId: string, data: VerifyEmailRequest) =>
  apiRequest<ApiResponse<VerifyEmailResponse>>(`/auth/verify-email/${userId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const login = (data: LoginRequest) =>
  apiRequest<ApiResponse<LoginResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const refreshToken = () =>
  apiRequest<ApiResponse<RefreshResponse>>('/auth/refresh', {
    method: 'POST',
  });

export const logout = () =>
  apiRequest<ApiResponse<{ message: string }>>('/auth/logout', {
    method: 'POST',
  });

export const getMe = () =>
  apiRequest<ApiResponse<User>>('/auth/me', {
    method: 'GET',
  });
