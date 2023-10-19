import { Project } from "@/app/DomainModals";

export interface ProjectIssue {
  id: number;
  issueKey: number;
  projectId: number;
  project?: Project;
}
export default ProjectIssue;
