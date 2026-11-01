import { request } from './api';
import { Department, DashboardStats } from '../types';

export const departmentService = {
  // Fetch list of all departments
  async getAllDepartments(): Promise<Department[]> {
    return request<Department[]>('/api/departments');
  },

  // Fetch city-wide statistics
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/dashboard/stats');
  },

  // Fetch department-specific statistics
  async getDepartmentStats(departmentId: number): Promise<{
    totalAssigned: number;
    reportedCount: number;
    inProgressCount: number;
    resolvedCount: number;
    highPriorityCount: number;
  }> {
    return request<any>(`/api/dashboard/department/${departmentId}`);
  },
};
