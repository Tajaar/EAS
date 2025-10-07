import { api } from "./api";
import type { AttendanceLog } from "../types/attendance";

export const checkIn = async (user_id: number, method: string = "portal") => {
  return api.post("/attendance/check-in", { user_id, method });
};

export const checkOut = async (user_id: number, method: string = "portal") => {
  return api.post("/attendance/check-out", { user_id, method });
};

export const getLogs = async (user_id: number): Promise<AttendanceLog[]> => {
  const response = await api.get(`/attendance/logs/${user_id}`);
  return response.data;
};

export const getAllLogs = async (admin_id: number): Promise<AttendanceLog[]> => {
  const response = await api.get(`/admin/all-logs?admin_id=${admin_id}`);
  return response.data;
};

export const getCheckStatus = async (user_id: number): Promise<boolean> => {
  const response = await api.get(`/attendance/status?user_id=${user_id}`);
  return response.data.is_checked_in; // backend should return { is_checked_in: true/false }
};
