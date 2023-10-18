import { Organization, Project, WorkSpaces } from "@/app/DomainModals";
import axios, { AxiosInstance } from "axios";
export const axiosGlobal = (apiKey: string) =>
  axios.create({
    baseURL: "https://api.track.toggl.com/api/v9/",
    auth: {
      username: apiKey,
      password: "api_token",
    },
  });
class ToggleService {
  private apiKey: string;
  private instance: AxiosInstance;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.instance = axiosGlobal(this.apiKey);
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
}
