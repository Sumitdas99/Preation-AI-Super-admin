import ApiClient from "../api-client";
import { API_URL } from "../environment";
import { decryptPayload } from "../lib/encryption";

export const adminApi = {
  getBrandAdminRequests: async ({ status, search, page = 1, limit = 20 }) => {
    const params = { page, limit };
    if (status && status !== "All Status") params.status = status.toLowerCase();
    if (search) params.search = search;
    const response = await ApiClient.get(`${API_URL}/auth/admin/approval-requests`, params);
    return decryptPayload(response);
  },

  getDashboardStats: async () => {
    return await ApiClient.get(`${API_URL}/auth/admin/dashboard/stats`);
  },

  approveBrandAdmin: async (userId) => {
    return await ApiClient.post(`${API_URL}/auth/admin/approval-requests/${userId}/approve`);
  },

  rejectBrandAdmin: async (userId, reason) => {
    return await ApiClient.post(`${API_URL}/auth/admin/approval-requests/${userId}/reject`, { reason });
  },

  createBrandAdminInvite: async (data) => {
    return await ApiClient.post(`${API_URL}/auth/super-admin/brand-admin/invite`, data);
  },

  getUsers: async ({ search, role, workspace, brand, status, start_date, end_date, page = 1, limit = 20 }) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (role && role !== "All Roles") params.role = role;
    if (workspace && workspace !== "All Workspaces") params.workspace = workspace;
    if (brand && brand !== "All Brands") params.brand = brand;
    if (status && status !== "all") params.status = status;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    return await ApiClient.get(`${API_URL}/auth/admin/users`, params);
  },

  getBrandsList: async () => {
    return await ApiClient.get(`${API_URL}/auth/admin/brands/list`);
  },

  getBrandAdmin: async (brandId) => {
    return await ApiClient.get(`${API_URL}/auth/admin/brands/${brandId}/brand-admin`);
  },

  transferBrandAdmin: async ({ brandId, fromUserId, toUserEmail, newTemporaryPassword, toUserFirstName, toUserLastName }) => {
    const body = { brand_id: brandId, from_user_id: fromUserId, to_user_email: toUserEmail };
    if (newTemporaryPassword && newTemporaryPassword.length >= 8) body.new_temporary_password = newTemporaryPassword;
    if (toUserFirstName?.trim()) body.to_user_first_name = toUserFirstName.trim();
    if (toUserLastName?.trim()) body.to_user_last_name = toUserLastName.trim();
    return await ApiClient.post(`${API_URL}/auth/admin/transfer-brand-admin`, body);
  },

  inviteUserAsSuperAdmin: async (data) => {
    return await ApiClient.post(`${API_URL}/users/invitations/super-admin`, data);
  },

  updateUserStatus: async (userId, isActive) => {
    return await ApiClient.post(`${API_URL}/auth/admin/users/${userId}/status`, { is_active: isActive });
  },

  forceLogoutUser: async (userId) => {
    return await ApiClient.post(`${API_URL}/auth/admin/users/${userId}/force-logout`);
  },

  forceLogoutAll: async () => {
    return await ApiClient.post(`${API_URL}/auth/admin/force-logout-all`);
  },

  forcePasswordResetUser: async (userId, newTemporaryPassword) => {
    return await ApiClient.post(`${API_URL}/auth/admin/users/${userId}/force-password-reset`, {
      new_temporary_password: newTemporaryPassword,
    });
  },

  forcePasswordResetAll: async (newTemporaryPassword) => {
    return await ApiClient.post(`${API_URL}/auth/admin/force-password-reset-all`, {
      new_temporary_password: newTemporaryPassword,
    });
  },

  getInvitationsByBrand: async (brandId) => {
    return await ApiClient.get(`${API_URL}/users/invitations/super-admin/by-brand`, { brand_id: brandId });
  },

  getAllBrandAdminInvitations: async ({ page = 1, limit = 10 } = {}) => {
    return await ApiClient.get(`${API_URL}/users/invitations/super-admin/brand-admins`, { page, limit });
  },
};
