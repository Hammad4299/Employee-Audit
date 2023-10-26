import { Project } from "@/app/DomainModals";

export interface User {
  id: number;
  username: string;
}

export interface TimeEntry {
  id?: string;
  user: User;
  description: string;
  project: Project;
  timerange: string;
  tagIds?: string[] | null;
  assignedIssueId?: number;

  timeEntry: {
    id: number;
    seconds: number;
    start: string;
    stop: string;
    at: string;
  };

  assignedProject?: {
    id: number;
    name: string;
  } | null;
}
