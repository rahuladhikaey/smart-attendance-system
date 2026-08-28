import { Teacher } from '../types';
import { MOCK_TEACHERS } from '../data/mockData';

class TeacherService {
  private teachers: Teacher[] = [...MOCK_TEACHERS];

  public getTeachers(): Teacher[] {
    return [...this.teachers];
  }

  public getTeacherById(id: string): Teacher | undefined {
    return this.teachers.find(t => t.id === id || t.teacherId === id);
  }
}

export const teacherService = new TeacherService();
