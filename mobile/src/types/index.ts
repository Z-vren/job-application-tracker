export type ApplicationStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export type Application = {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  deadline: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationInput = {
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  deadline?: string | null;
  notes?: string;
};

export type User = {
  id: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

