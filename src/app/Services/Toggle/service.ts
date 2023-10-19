import { Organization, Project, WorkSpaces } from "@/app/Services/Toggle/Types";
import { ReportFilters } from "@/app/Services/Toggle/Types/Filters";
import axios, { AxiosInstance } from "axios";

export const axiosGlobalClient = (apiKey: string) =>
  axios.create({
    baseURL: "https://api.track.toggl.com/api/v9/",
    auth: {
      username: apiKey,
      password: "api_token",
    },
  });
export const axiosReportingClient = (apiKey: string) =>
  axios.create({
    baseURL: "https://api.track.toggl.com/reports/api/v3/",
    auth: {
      username: apiKey,
      password: "api_token",
    },
  });
export class ToggleService {
  private apiKey: string;
  private instance: AxiosInstance;
  private reportingInstance: AxiosInstance;
  constructor(apiKey: string) {
    console.log(`🚀 ~ ToggleService ~ constructor ~ apiKey:`, apiKey);
    this.apiKey = apiKey;
    this.instance = axiosGlobalClient(this.apiKey);
    this.reportingInstance = axiosReportingClient(this.apiKey);
  }
  public async getAllWorkSpaces() {
    const data = await this.instance.get<WorkSpaces[]>("workspaces", {});
    return data.data;
  }
  public async getWorkSpace(workspaceId: string) {
    const data = await this.instance.get<WorkSpaces>(
      `workspaces/${workspaceId}`
    );
    return data.data;
  }
  public async getAllProject(workspaceId: string) {
    const data = await this.instance.get<Project[]>(
      `workspaces/${workspaceId}/projects`
    );
    return data.data;
  }
  public async getWorkSpaceProject(workspaceId: string, projectId: string) {
    const data = await this.instance.get<Project>(
      `workspaces/${workspaceId}/projects/${projectId}`
    );
    return data.data;
  }
  public async getAllOrganizations() {
    const data = await this.instance.get<Organization[]>(`me/organizations`);
    return data.data;
  }
  public async createWorkSpace(
    workspace: Partial<WorkSpaces>,
    organizationId: string
  ) {
    const data = await this.instance.post<Organization[]>(
      `organizations/${organizationId}/workspaces`,
      workspace
    );
    return data.data;
  }
  public async createProjects(project: Partial<Project>, workspaceId: string) {
    const data = await this.instance.post<Organization[]>(
      `workspaces/${workspaceId}/projects`,
      project
    );
    return data.data;
  }
  public async getReports(workSpaceId: string, filters: ReportFilters) {
    const data = await this.reportingInstance.post(
      `workspace/${workSpaceId}/search/time_entries`,
      filters
    );
    return data;
  }
}
export default ToggleService;
