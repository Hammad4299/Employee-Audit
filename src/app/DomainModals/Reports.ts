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
  tagIds?: string[] | null;
  assignedIssueId?: number;
  assignedIssueDetail?: {
    id: number;
    description: string;
    issueKey: string;
  } | null;
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
