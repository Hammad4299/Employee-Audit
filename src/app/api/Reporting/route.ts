import ProjectModal from "@/app/Models/ProjectModal";
import { getAllProjects } from "@/app/Repositories/Project";
import { getAllWorkspaces } from "@/app/Repositories/Workspace";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";
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
  let reportingEntries: any = [];
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
            project_id: x.project_id,
            description: x.description,
            projectId: x.project_id,
            timerange: `${Math.floor(timeEntry.asHours())}h : ${
              Math.floor(timeEntry.asMinutes()) -
              Math.floor(timeEntry.asHours()) * 60
            }min`,
            // moment.utc(duration.asMilliseconds()).format("HH:mm:ss")
          };
        }),
      ];
    }
  }
  
  return NextResponse.json({ data: reportingEntries }, { status: 200 });
};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
