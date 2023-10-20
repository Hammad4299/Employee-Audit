import { TimeEntry } from "@/app/DomainModals/Reports";

import { keyBy, orderBy, range } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import moment from "moment";
import config from "@/app/config/config";
export const POST = async (request: NextRequest) => {
  //   const data = await request.json();
  const data: TimeEntry[] = [
    {
      user: { id: 1, username: "Saad" },
      description: "Description 1",
      project: "Project 1",
      timerange: "Time Range 1",
      tagIds: ["tag1", "tag2"],
      assignedIssueId: 2,
      timeEntry: {
        id: 1,
        seconds: 100,
        start: "2023-10-19",
        stop: "2023-10-20",
        at: "2023-10-19",
      },
      assignedIssueKey: "ISSUE-1",
      assignedProject: { id: 1, name: "Project 1" },
    },
    {
      user: { id: 1, username: "Talha" },
      description: "Description 1",
      project: "Project 1",
      timerange: "Time Range 1",
      tagIds: ["tag1", "tag2"],
      assignedIssueId: 2,
      timeEntry: {
        id: 1,
        seconds: 100,
        start: "2023-10-19",
        stop: "2023-10-20",
        at: "2023-10-19",
      },
      assignedIssueKey: "ISSUE-2",
      assignedProject: { id: 1, name: "Project 1" },
    },
    {
      user: { id: 2, username: "Raza" },
      description: "Description 2",
      project: "Project 2",
      timerange: "Time Range 2",
      tagIds: ["tag3", "tag4"],
      assignedIssueId: 2,
      timeEntry: {
        id: 2,
        seconds: 200,
        start: "2023-10-18",
        stop: "2023-10-19",
        at: "2023-10-18",
      },
      assignedIssueKey: "ISSUE-1",
      assignedProject: { id: 2, name: "Project 2" },
    },
  ];

  const reportDataByProject = keyBy(data, (x: TimeEntry) => {
    return x?.assignedProject?.name;
  });
  const workbook = new ExcelJS.Workbook();
  let result = [];
  let spentTime: { [key: string]: number } = {};
  Object.keys(reportDataByProject).map((x) => {
    const sheet = workbook.addWorksheet(x);
    result = data.reduce<string[][]>((acc, curr: TimeEntry) => {
      const index = acc.findIndex((el) => el[0] === curr.assignedIssueKey);
      if (index === -1) {
        acc.push([curr?.assignedIssueKey] as string[]);
        acc[acc.length - 1].push(curr.user?.username as string);
        spentTime[curr.assignedIssueKey as string] = curr.timeEntry.seconds;
      } else {
        spentTime[curr.assignedIssueKey as string] += curr.timeEntry.seconds;
        acc[index].push(curr.user.username);
      }
      return acc;
    }, []);
    result = result.map((x) => {
      x.push(spentTime[x[0]].toString()); // Add accumulated time to the row
      return x;
    });
    result.map((x) => {
      sheet.addRow(x);
    });
  });
  await workbook.xlsx.writeFile(
    `${config.getAbsolutePath("/")}/storage/toggl-${moment().format(
      "HH-mm-ss"
    )}.xlsx`
  );

  return data ? NextResponse.json({ data: "File Saved" }) : null;
};
export const GET = async (request: NextRequest) => {};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
