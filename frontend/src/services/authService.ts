import { request } from './api';
import { User, DepartmentAccount } from '../types';

export interface RegisterCitizenPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginCitizenPayload {
  email: string;
  password: string;
}

export interface LoginDepartmentPayload {
  username: string;
  password: string;
}

export const authService = {
  // Citizen Registration
  async registerCitizen(payload: RegisterCitizenPayload): Promise<{ message: string; userId?: number }> {
    return request<{ message: string; userId?: number }>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Citizen Login
  async loginCitizen(payload: LoginCitizenPayload): Promise<User> {
    const data = await request<any>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const user: User = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    this.setCurrentUser(user);
    return user;
  },

  // Citizen Session
  getCurrentUser(): User | null {
    const raw = localStorage.getItem('civic_citizen');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User): void {
    localStorage.setItem('civic_citizen', JSON.stringify(user));
  },

  logoutCitizen(): void {
    localStorage.removeItem('civic_citizen');
  },

  // Department Officer Login
  async loginDepartment(payload: LoginDepartmentPayload): Promise<DepartmentAccount> {
    const data = await request<DepartmentAccount>('/api/departments/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setCurrentOfficer(data);
    return data;
  },

  // Department Officer Session
  getCurrentOfficer(): DepartmentAccount | null {
    const raw = localStorage.getItem('civic_officer');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentOfficer(officer: DepartmentAccount): void {
    localStorage.setItem('civic_officer', JSON.stringify(officer));
  },

  logoutDepartment(): void {
    localStorage.removeItem('civic_officer');
  },
};
