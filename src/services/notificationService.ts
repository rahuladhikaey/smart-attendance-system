import { NotificationItem, UserRole } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

class NotificationService {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];
  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public getNotifications(role?: UserRole): NotificationItem[] {
    if (!role) return [...this.notifications];
    return this.notifications.filter(n => !n.targetRole || n.targetRole === role);
  }

  public getUnreadCount(role?: UserRole): number {
    return this.getNotifications(role).filter(n => !n.read).length;
  }

  public markAsRead(id: string) {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.notify();
    }
  }

  public markAllAsRead() {
    this.notifications.forEach(n => (n.read = true));
    this.notify();
  }
}

export const notificationService = new NotificationService();
