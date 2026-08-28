import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

const AUTH_STORAGE_KEY = 'attendance_saas_auth_user';

class AuthService {
  private currentUser: User = MOCK_USERS[0]; // Defaults to Admin for rich preview, easily switchable

  constructor() {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch {
        this.currentUser = MOCK_USERS[0];
      }
    }
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }

  public getRole(): UserRole {
    return this.currentUser.role;
  }

  public loginAsDemo(role: UserRole): User {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    this.currentUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth_changed'));
    return user;
  }

  public loginWithCredentials(email: string): User {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: email.includes('teacher') ? 'TEACHER' : email.includes('student') ? 'STUDENT' : 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Academic Operations',
      createdAt: new Date().toISOString(),
    };
    this.currentUser = user;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth_changed'));
    return user;
  }

  public logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUser = MOCK_USERS[0];
    window.dispatchEvent(new Event('auth_changed'));
  }
}

export const authService = new AuthService();
