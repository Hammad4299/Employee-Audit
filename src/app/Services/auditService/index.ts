import { IssueDetail, Project, Workspace } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import { WorkDaysExcelReportRawData } from "@/app/Types/WorkDayTypes";
import { AuditDataFilters } from "@/app/audit/page";
import { axiosInstance } from "@/app/utilities/axios";

export class AuditService {
  getWorkspaces() {
    return axiosInstance.get<Workspace[]>("api/Workspace").then((x) => x.data);
  }
  getAuditData(filters?: AuditDataFilters) {
    return axiosInstance.get<{ data: TimeEntry[] }>(`api/Reporting`, {
      params: {
        start_date: filters?.dateRange.startDate,
        end_date: filters?.dateRange.endDate,
        workspace_ids: [...filters?.workspaces],
      },
    });
  }
  generalAuditData(entries: TimeEntry[]) {
    return axiosInstance.post(`api/Reporting/export`, JSON.stringify(entries));
  }
  getAllProject() {
    return axiosInstance.get<Project[]>("api/Project");
  }
  getAllIssueDetails() {
    return axiosInstance.get<IssueDetail[]>("api/IssueDetail");
  }
  createProject(project: Partial<Project>) {
    return axiosInstance.post<Project>("api/Project", project);
  }
  createIssueDetail(issueDetails: Partial<IssueDetail>) {
    return axiosInstance.post<IssueDetail>("api/IssueDetail", issueDetails);
  }
  updateProject(project: Partial<Project>) {
    return axiosInstance.put<Project>(`api/Project/${project.id}`, project);
  }
  updateIssueDetail(issueDetail: IssueDetail) {
    return axiosInstance.put<IssueDetail>(
      `api/IssueDetail/${issueDetail.id}`,
      issueDetail
    );
  }
  generateWorkdaysExcel(workdaysData: WorkDaysExcelReportRawData) {
    return axiosInstance.post(`api/WorkdayReporting/export`, workdaysData)
  }
}
