import { Project } from "@/app/DomainModals";

export interface ProjectIssue {
  id: number;
  issueKey: string;
  projectId: number;
  project?: Project;
}
export default ProjectIssue;
