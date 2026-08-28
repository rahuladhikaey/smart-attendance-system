import { AcademicClass } from '../types';
import { MOCK_CLASSES } from '../data/mockData';

class ClassService {
  private classes: AcademicClass[] = [...MOCK_CLASSES];

  public getClasses(): AcademicClass[] {
    return [...this.classes];
  }

  public getClassById(id: string): AcademicClass | undefined {
    return this.classes.find(c => c.id === id || c.code === id);
  }

  public getClassesForTeacher(teacherId: string): AcademicClass[] {
    return this.classes.filter(c => c.teacherId === teacherId);
  }
}

export const classService = new ClassService();
