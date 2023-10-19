import { Workspace } from "@/app/DomainModals";
import { AuditDataFilters, IssueDetails, Projects } from "@/app/audit/page";
import { axiosInstance } from "@/app/utilities/axios";

export class AuditService {
  getWorkspaces() {
    return axiosInstance
      .post<Workspace[]>("api/workspaces")
      .then((x) => x.data);
  }
  getAuditData(filters?: AuditDataFilters) {
    return axiosInstance.post("endpoint", filters);
  }
  getAllProject() {
    return axiosInstance.get("endpoint");
  }
  getAllIssueDetails() {
    return axiosInstance.get("endpoint");
  }
  createProject(name: string) {
    return axiosInstance.post("endpoint", name);
  }
  createIssueDetail(body: string) {
    return axiosInstance.post("endpoint", body);
  }
  updateProject(body: Projects) {
    return axiosInstance.post("endpoint", body);
  }
  updateIssueDetail(body: IssueDetails) {
    return axiosInstance.post("endpoint", body);
  }
}
