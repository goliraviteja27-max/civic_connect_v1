export type IssueStatus = 'REPORTED' | 'IN PROGRESS' | 'RESOLVED';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  location: string;
}

export interface DepartmentAccount {
  accountId: number;
  username: string;
  departmentId: number;
  departmentName: string;
  location: string;
  message?: string;
}

export interface Issue {
  issueId: number;
  description: string;
  location: string;
  category: string;
  priority: PriorityLevel | string;
  status: IssueStatus | string;
  userId: number;
  departmentId: number;
  departmentName?: string;
  userName?: string;
  userPhone?: string;
}

export interface IssuePreviewResponse {
  category: string;
  priority: string;
  department: string;
  departmentId: number;
}

export interface IssueCreateRequest {
  description: string;
  location: string;
  userId: number;
}

export interface IssueCreateResponse {
  message: string;
  issueId: number;
  category: string;
  priority: string;
  department: string;
  departmentId: number;
  location: string;
  status: string;
}

export interface DepartmentStats {
  department_id: number;
  department_name: string;
  total_issues: number;
  resolved_issues: number;
}

export interface DashboardStats {
  totalIssues: number;
  reportedCount: number;
  inProgressCount: number;
  resolvedCount: number;
  highPriorityCount: number;
  departments: DepartmentStats[];
}

export interface ApiError {
  error?: string;
  message?: string;
}
