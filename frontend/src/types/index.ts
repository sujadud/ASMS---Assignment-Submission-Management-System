export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  classroomId?: string | null;
  classroomName?: string | null;
  createdAt: string;
}

export interface PublicSettings {
  themePreset: string;
  fontFamily: string;
  institutionName: string;
  maxUploadSizeBytes: number;
  allowedExtensions: string[];
  latePenaltyPercentPerDay: number;
}

export interface SystemOverview {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalClassrooms: number;
  totalSubjects: number;
  totalAssignments: number;
  totalSubmissions: number;
}

export interface Classroom {
  id: string;
  name: string;
  academicYear: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId?: string | null;
  teacherName?: string | null;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  isPublished: boolean;
  teacherId: string;
  teacherName: string;
  classroomId: string;
  classroomName: string;
  subjectId: string;
  subjectName: string;
  submissionCount: number;
  createdAt: string;
}

export type SubmissionStatus = 'Submitted' | 'Evaluated' | 'Late' | 'Rejected';

export interface SubmissionReview {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  filePath: string;
  originalFileName: string;
  fileSizeBytes: number;
  submittedAt: string;
  isLate: boolean;
  daysLate: number;
  status: SubmissionStatus;
  marksObtained?: number | null;
  feedback: string;
  evaluatedAt?: string | null;
}

export interface StudentAssignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  teacherName: string;
  subjectName: string;
  classroomName: string;
  hasSubmitted: boolean;
  submissionStatus?: SubmissionStatus | null;
  marksObtained?: number | null;
  feedback?: string | null;
  submittedAt?: string | null;
  submittedFilePath?: string | null;
  submittedFileName?: string | null;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  subjectName: string;
  maxMarks: number;
  filePath: string;
  originalFileName: string;
  fileSizeBytes: number;
  submittedAt: string;
  status: SubmissionStatus;
  marksObtained?: number | null;
  feedback: string;
  evaluatedAt?: string | null;
}
