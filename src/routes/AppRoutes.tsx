import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { AppShell } from '../components/layout/AppShell';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { FeaturesPage } from '../pages/public/FeaturesPage';
import { AboutPage } from '../pages/public/AboutPage';
import { LoginPage } from '../pages/public/LoginPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';

// Admin Pages
import {
  AdminDashboard,
  AttendanceManagement,
  AttendanceSessionDetail,
  StudentsList,
  StudentDetail,
  TeachersList,
  TeacherDetail,
  ClassesList,
  ClassDetail,
  ReportsPage,
  AnalyticsPage,
  VerificationSecurity,
  NotificationsPage,
  SettingsPage,
} from '../pages/admin';

// Teacher Pages
import {
  TeacherDashboard,
  TeacherClasses,
  TeacherClassDetail,
  TeacherAttendance,
  TeacherLiveSession,
  TeacherStudents,
  TeacherReports,
  TeacherProfile,
} from '../pages/teacher';

// Student Pages
import {
  StudentDashboard,
  StudentAttendanceStart,
  StudentLocationVerification,
  StudentQRScan,
  StudentBiometricVerification,
  StudentAttendanceSuccess,
  StudentAttendanceFailure,
  StudentHistory,
  StudentSchedule,
  StudentProfile,
} from '../pages/student';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Marketing & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Admin Workspace */}
      <Route path="/admin" element={<AppShell />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="attendance/session/:id" element={<AttendanceSessionDetail />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="teachers" element={<TeachersList />} />
        <Route path="teachers/:id" element={<TeacherDetail />} />
        <Route path="classes" element={<ClassesList />} />
        <Route path="classes/:id" element={<ClassDetail />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="verification" element={<VerificationSecurity />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Teacher Workspace */}
      <Route path="/teacher" element={<AppShell />}>
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:id" element={<TeacherClassDetail />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="attendance/session/:id" element={<TeacherLiveSession />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="reports" element={<TeacherReports />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Student Workspace */}
      <Route path="/student" element={<AppShell />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendanceStart />} />
        <Route path="attendance/location" element={<StudentLocationVerification />} />
        <Route path="attendance/scan" element={<StudentQRScan />} />
        <Route path="attendance/biometric" element={<StudentBiometricVerification />} />
        <Route path="attendance/success" element={<StudentAttendanceSuccess />} />
        <Route path="attendance/failure" element={<StudentAttendanceFailure />} />
        <Route path="history" element={<StudentHistory />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
