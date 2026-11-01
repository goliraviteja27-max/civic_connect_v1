import { request } from './api';
import { Issue, IssueCreateRequest, IssueCreateResponse, IssuePreviewResponse, IssueStatus } from '../types';

export const issueService = {
  // Live auto-classification preview before submitting
  async previewIssue(description: string): Promise<IssuePreviewResponse> {
    return request<IssuePreviewResponse>('/api/issues/preview', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  },

  // Submit a new complaint
  async submitComplaint(data: IssueCreateRequest): Promise<IssueCreateResponse> {
    return request<IssueCreateResponse>('/api/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Fetch all complaints filed by a citizen
  async getCitizenComplaints(userId: number): Promise<Issue[]> {
    return request<Issue[]>(`/api/issues/user/${userId}`);
  },

  // Fetch single complaint details
  async getComplaintById(issueId: number): Promise<Issue> {
    return request<Issue>(`/api/issues/${issueId}`);
  },

  // Fetch complaints routed to a specific department
  async getDepartmentComplaints(departmentId: number, status?: string): Promise<Issue[]> {
    let url = `/api/issues/department/${departmentId}`;
    if (status && status.trim() !== '') {
      url += `?status=${encodeURIComponent(status.trim())}`;
    }
    return request<Issue[]>(url);
  },

  // Officer updates status (REPORTED -> IN PROGRESS -> RESOLVED)
  async updateStatus(issueId: number, status: IssueStatus): Promise<{ message: string; issueId: number; status: string }> {
    return request<{ message: string; issueId: number; status: string }>(`/api/issues/${issueId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
