import { Student } from '../types';
import { MOCK_STUDENTS } from '../data/mockData';

class StudentService {
  private students: Student[] = [...MOCK_STUDENTS];
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

  public getStudents(): Student[] {
    return [...this.students];
  }

  public getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id || s.studentId === id);
  }

  public getStudentsByClass(classId: string): Student[] {
    return this.students.filter(s => s.classId === classId);
  }

  public addStudent(studentData: Omit<Student, 'id' | 'attendanceRate' | 'totalClasses' | 'presentCount' | 'absentCount' | 'lateCount'>): Student {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      attendanceRate: 100,
      totalClasses: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
    };
    this.students.unshift(newStudent);
    this.notify();
    return newStudent;
  }

  public updateBiometricStatus(studentId: string, status: 'ENROLLED' | 'NOT_ENROLLED' | 'PENDING') {
    const student = this.students.find(s => s.id === studentId || s.studentId === studentId);
    if (student) {
      student.biometricStatus = status;
      student.biometricEnrolledAt = status === 'ENROLLED' ? new Date().toISOString().split('T')[0] : undefined;
      this.notify();
    }
  }
}

export const studentService = new StudentService();
