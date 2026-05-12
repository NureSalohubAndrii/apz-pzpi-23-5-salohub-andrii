import { useMutation } from '@tanstack/react-query';
import { register, verifyEmail, login, logout } from '@/api/auth.api';
import type { RegisterRequest, VerifyEmailRequest, LoginRequest } from '@/types/auth.types';

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });

export const useVerifyEmailMutation = (userId: string) =>
  useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmail(userId, data),
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: () => logout(),
  });
