import { ProjectIssue } from "@/app/DomainModals";
import { TimeEntry } from "@/app/DomainModals/Reports";
import stringSimilarity from "string-similarity";
import { getAllProjects } from "@/app/Repositories/Project";
import { getAllProjectIssues } from "@/app/Repositories/ProjectIssue";
import { getWorkspaceByIds } from "@/app/Repositories/Workspace";
import { ToggleService } from "@/app/Services/Toggle";
import config from "@/app/config/config";
import { groupBy, keyBy, orderBy, range } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {};
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("start_date") || "";

  const endDate = searchParams.get("end_date") || "";
  const workspaceIds = searchParams.getAll("workspace_ids") || [];

  const toggleServiceInstance = new ToggleService(config.toggl.apiToken || "");
  const workspaces = await getWorkspaceByIds(workspaceIds);

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
          return {
            user: {
              id: x.user_id,
              username: x.username,
            },
            tags : x.tag_ids,
            workspace: workspace.owner,
            project: togglProjectMap[x.project_id],
            description: x.description,

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
      terms: [
        p.name,
        ...(JSON.parse(p.aliases as any) || []),
        ...(issuesByProject[p.id.toString()]?.map((x) => x.issueKey) || []),
      ],
    };
  });
  let terms: string[] = projectMatchCriteria.flatMap((x) => x.terms);

  const regexes: RegExp[] = terms.map((x) => {
    return new RegExp(`${x}[\\-\\s]{0,}\\d+`);
  });

  // if the project in alias of project then linked issue key then extract no
  reportingEntries = reportingEntries.flatMap((data: TimeEntry) => {
    //check double entry
    const multipleExpression = new RegExp("[A-Z]+[\\-\\s]\\d+");
    let fullDescription = (data?.description || "").toUpperCase();
    let issueMatches = [];
    let matchedIssue;
    while ((matchedIssue = multipleExpression.exec(fullDescription)) !== null) {
      fullDescription = fullDescription.replace(matchedIssue[0], "");
      console.log(
        `🚀 ~ reportingEntries=reportingEntries.flatMap ~ fullDescription:`,
        fullDescription,
        "issueMatch",
        matchedIssue,
        "fullDescription",
        fullDescription
      );
      issueMatches.push(matchedIssue[0]);
    }
    console.log(
      `🚀 ~ reportingEntries=reportingEntries.flatMap ~ issueMatches:`,
      issueMatches
    );
    console.log(`🚀 ~ detectedIssueKeys ~ issueMatches: brfore `, issueMatches);

    let detectedIssueKeys = issueMatches.flatMap((x) => {
      const matchedIssueKeys = regexes.map((regex) => {
        let detectedKey = regex.exec(x)?.[0];
        if (!!!detectedKey) {
          return undefined;
        }
        detectedKey = detectedKey
          .replace(/\-/g, "")
          .replace(/\s/g, "")
          .toUpperCase();
        let normalizedKey = detectedKey;
        for (let a = 0; a < detectedKey.length; ++a) {
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
        return normalizedKey;
      });

      return matchedIssueKeys
        .filter((x) => !!x)
        .map((issueKey: any) =>
          issueKey && issueKey.length === 1 ? issueKey[0] : issueKey
        );
    });

    console.log(
      `🚀 ~ reportingEntries=reportingEntries.flatMap ~ detectedIssueKeys:`,
      detectedIssueKeys
    );
    if (detectedIssueKeys.length == 0) {
      return [data];
    }

    const timePerSlot = data.timeEntry.seconds / detectedIssueKeys.length;
    let divideIssueEntries: TimeEntry[] = [];
    range(0, issueMatches.length).flatMap((x) => {
      divideIssueEntries.push({
        ...data,
        assignedIssueKey: detectedIssueKeys[x] || "",
        timeEntry: {
          ...data.timeEntry,
          seconds: timePerSlot,
        },
      });
    });
    return divideIssueEntries;
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
                (data.project?.name || "").toLowerCase(),
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
    data.assignedProject =
      project && project[0]
        ? {
            id: project[0].project.id,
            name: project[0].project.name,
          }
        : null;
    return data;
  });
  return NextResponse.json({ data: reportingEntries }, { status: 200 });
};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
