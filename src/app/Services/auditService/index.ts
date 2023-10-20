import { Workspace } from "@/app/DomainModals";
import {
  AuditData,
  AuditDataFilters,
  IssueDetails,
  Projects,
} from "@/app/audit/page";
import { axiosInstance } from "@/app/utilities/axios";

export class AuditService {
  getWorkspaces() {
    return axiosInstance.get<Workspace[]>("api/Workspace").then((x) => x.data);
  }
  getAuditData(filters?: AuditDataFilters) {
    return axiosInstance
      .get<AuditData[]>(
        `api/Reporting?start_date=${filters?.dateRange.startDate}&end_date=${filters?.dateRange.startDate}&workspace_ids=${filters?.workspaces}`
      )
      .then((x) => x.data);
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
