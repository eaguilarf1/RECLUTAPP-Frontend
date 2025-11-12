export type Role = 'Admin' | 'Recruiter' | 'Candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}
