export interface User {
  id: number;
  username: string;
}

export interface TimeEntry {
  user: User;
  project_id: number;
  description: string;
  projectId: number;
  timerange: string;
  assignedIssue?: string;
}
