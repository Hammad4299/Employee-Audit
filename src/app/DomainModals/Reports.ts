import { Project } from "@/app/DomainModals";

export interface User {
  id: number;
  username: string;
}

export interface TimeEntry {
  user: User;
  description: string;
  project: Project;
  timerange: string;
  assignedIssueId?: number;
  timeEntry: {
    id: number;
    seconds: number;
    start: string;
    stop: string;
    at: string;
  };
  assignedIssueKey?: string;
  assignedProject?: {
    id: number;
    name: string;
  } | null;
}
