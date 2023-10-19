export interface User {
  id: number;
  username: string;
}

export interface TimeEntry {
  user: User;
  description: string;
  project: string;
  timerange: string;
  assignedIssueId?: number;
  //for tmp project
  assignedIssueKey?: string;
  assignedProjectId?: number;
}
