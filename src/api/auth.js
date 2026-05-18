import ApiClient from "../api-client";
import { API_URL } from "../environment";

export const loginSuperAdmin = async ({ email, password }, dispatch = null) => {
  const response = await ApiClient.post(
    `${API_URL}/auth/super-admin/login`,
    { email, password },
    null,
    dispatch
  );
  return response;
};

export const sendForgotPasswordOtp = async (email, dispatch = null) => {
  const response = await ApiClient.post(
    `${API_URL}/auth/forgot-password/send-otp`,
    { email },
    null,
    dispatch
  );
  return response;
};

export const verifyForgotPasswordOtp = async (email, otp, dispatch = null) => {
  const response = await ApiClient.post(
    `${API_URL}/auth/forgot-password/verify-otp`,
    { email, otp },
    null,
    dispatch
  );
  return response;
};

export const resetPasswordWithOtp = async (email, otp, newPassword, dispatch = null) => {
  const response = await ApiClient.post(
    `${API_URL}/auth/forgot-password/reset`,
    { email, otp, new_password: newPassword },
    null,
    dispatch
  );
  return response;
};

export const completeNewPasswordChallenge = async (payload, dispatch = null) => {
  const response = await ApiClient.post(
    `${API_URL}/auth/complete-new-password`,
    payload,
    null,
    dispatch
  );
  return response;
};

export const getProfile = async (dispatch = null) => {
  const response = await ApiClient.get(`${API_URL}/auth/profile`, {}, null, dispatch);
  return response;
};

export const updateProfile = async (payload, dispatch = null) => {
  const response = await ApiClient.put(`${API_URL}/auth/profile`, payload, null, dispatch);
  return response;
};
