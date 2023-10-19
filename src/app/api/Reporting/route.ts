import { ProjectIssue } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import ProjectModal from "@/app/Models/ProjectModal";
import stringSimilarity from "string-similarity";
import { getAllProjects } from "@/app/Repositories/Project";
import { getAllProjectIssues } from "@/app/Repositories/ProjectIssue";
import { getAllWorkspaces } from "@/app/Repositories/Workspace";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";
import { group } from "console";
import { groupBy, keyBy, orderBy } from "lodash";
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
  const issuesByProject = groupBy(projectLinkedWithIssue, (x) => x.projectId);
  let reportingEntries: Array<TimeEntry> = [];
  for (let workspace of workspaces) {
    const togglProjects = await toggleServiceInstance.getAllProject(
      workspace.toggleId.toString()
    );
    const togglProjectMap = keyBy(togglProjects, (x) => x.id);

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
            project: togglProjectMap[x.project_id],
            description: x.description,
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

  const projectMatchCriteria = projects.flatMap((p) => {
    return {
      project: p,
      terms: [p.name, ...(p.aliases || [])],
    };
  });
  let terms: string[] = projectMatchCriteria.flatMap((x) => x.terms);
  const regexes: RegExp[] = terms.map((x) => {
    return new RegExp(`${x}[\-\s]{0,}\d+`);
  });

  // if the project in alias of project then linked issue key then extract no
  reportingEntries = reportingEntries.flatMap((data) => {
    const detectedIssueKeys = regexes.flatMap((x) => {
      x.exec(data?.description);
      let detectedKey = "wmae -  - - - 12312";
      detectedKey = detectedKey
        .replace(/\-/g, "")
        .replace(/\s/g, "")
        .toUpperCase();
      let normalizedKey = detectedKey;
      for (const a = 0; a < detectedKey.length; ++a) {
        if (
          detectedKey.charCodeAt(a) >= 48 &&
          detectedKey.charCodeAt(a) <= 57
        ) {
          normalizedKey = `${normalizedKey.substring(
            0,
            a
          )}-${normalizedKey.substring(a)}`;
          break;
        }
      }
      return [normalizedKey];
    });
    if (detectedIssueKeys.length == 0) {
      return [data];
    }
    return detectedIssueKeys.map((issueKey) => {
      //todo handle time division
      return {
        ...data,
        assignedIssueKey: issueKey,
      };
    });
  });

  reportingEntries = reportingEntries.map((data) => {
    const scores = projectMatchCriteria.map((x) => {
      terms.push(...x.terms);
      return {
        project: x.project,
        issueKeyMatch:
          orderBy(
            x.terms.map((term) =>
              stringSimilarity.compareTwoStrings(
                (data.assignedIssueKey || "").toLowerCase(),
                term.toLowerCase()
              )
            ),
            (x) => x,
            "desc"
          )[0] || 0,
        projectMatchScore:
          orderBy(
            x.terms.map((term) =>
              stringSimilarity.compareTwoStrings(
                (data.project || "").toLowerCase(),
                term.toLowerCase()
              )
            ),
            (x) => x,
            "desc"
          )[0] || 0,
        descriptionMatchScore: x.terms.find((term) =>
          (data.description || "").toLowerCase().includes(term)
        )
          ? 1
          : orderBy(
              x.terms.map((term) =>
                stringSimilarity.compareTwoStrings(
                  (data.description || "").toLowerCase(),
                  term.toLowerCase()
                )
              ),
              (x) => x,
              "desc"
            )[0] || 0,
      };
    });
    const project = orderBy(
      scores,
      (x) =>
        Math.max(x.issueKeyMatch, x.projectMatchScore, x.descriptionMatchScore),
      "desc"
    );
    data.assignedProjectId =
      project && project[0] ? (project[0].project.id as any) : null;
    return data;
  });
  return NextResponse.json({ data: reportingEntries }, { status: 200 });
};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
