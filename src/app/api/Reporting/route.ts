import { ProjectIssue } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import ProjectModal from "@/app/Models/ProjectModal";
import { getAllProjects } from "@/app/Repositories/Project";
import { getAllProjectIssues } from "@/app/Repositories/ProjectIssue";
import { getAllWorkspaces } from "@/app/Repositories/Workspace";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";
import { groupBy } from "lodash";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {};
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("start_date") || "";
  console.log(`🚀 ~ GET ~ startDate:`, startDate);
  const endDate = searchParams.get("end_date") || "";
  const projectIds = searchParams.getAll("project_ids") || [];
  const toggleServiceInstance = new ToggleService(config.toggl.apiToken || "");
  const workspaces = await getAllWorkspaces();
  const projects = await getAllProjects();
  const projectLinkedWithIssue: ProjectIssue[] = await getAllProjectIssues();
  let reportingEntries: Array<TimeEntry> = [];
  for (let workspace of workspaces) {
    let nextRowNumber: string | undefined = "";
    while (nextRowNumber !== undefined) {
      const reportChunk = await toggleServiceInstance.getReports(
        workspace.toggleId.toString(),
        {
          start_date: startDate,
          end_date: endDate,
          first_row_number: !!nextRowNumber ? +nextRowNumber : undefined,
        }
      );
      if (!!reportChunk.status && !!reportChunk.headers["x-next-row-number"]) {
        nextRowNumber = reportChunk.headers["x-next-row-number"];
      } else {
        nextRowNumber = undefined;
      }
      reportingEntries = [
        ...reportingEntries,
        ...reportChunk.data.map((x: any) => {
          const timeEntry = moment.duration(
            x.time_entries[0].seconds,
            "seconds"
          );
          return {
            user: {
              id: x.user_id,
              username: x.username,
            },
            workspace: workspace.owner,
            project_id: x.project_id,
            description: x.description,
            projectId: x.project_id,
            timerange: `${Math.floor(timeEntry.asHours())}h : ${
              Math.floor(timeEntry.asMinutes()) -
              Math.floor(timeEntry.asHours()) * 60
            }min`,
            timeEntry: {
              ...x.time_entries[0],
            },
            // timeStart: x.time_entries[0].time_start,
            // timeEnd: x.time_entries[0].time_end,
            // moment.utc(duration.asMilliseconds()).format("HH:mm:ss")
          };
        }),
      ];
    }
  }
  const groupedEntriesByProject = groupBy(reportingEntries, "project_id");
  const reportData = Object.keys(groupedEntriesByProject)
    .map((x) => {
      console.log(`🚀 ~ .map ~ x:`, x);
      const project = projects.find((p) =>
        JSON.parse(p.aliases).includes(x.toString())
      );
      console.log(`🚀 ~ .map ~ project:`, project);
      return groupedEntriesByProject[x].map((a) => ({
        ...a,
        projectName: !!project ? project.name : null,
      }));
    })
    .flatMap((x) => x);
  // if the project in alias of project then linked issue key then extract no
  reportData.map((data) => {
    const associateProjectIssue = projectLinkedWithIssue.find(
      (x) => x.projectId == data.projectId
    );
    // comparison
    // mutated_issue_number
    const description = data?.description || "";
    const timeMatches = description.match(/\d+/g)?.map(Number);
    if (timeMatches && timeMatches?.length == 1) {
    } else if (timeMatches && timeMatches?.length > 1) {
    } else {
      data.assignedIssue = description;
    }
  });
  return NextResponse.json({ data: reportData }, { status: 200 });
};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
