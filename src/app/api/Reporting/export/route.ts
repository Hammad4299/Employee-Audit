import { TimeEntry } from "@/app/DomainModals/Reports";
import childProcess from "child_process";
import { groupBy, keyBy, orderBy, range, sum, uniq } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import moment from "moment";
import config from "@/app/config/config";
import { mkdirSync } from "fs";
import path from "path";
export const POST = async (request: NextRequest) => {
  const data: TimeEntry[] = await request.json();
  // const data: TimeEntry[] = [
  //   {
  //     user: { id: 1, username: "Saad" },
  //     description: "Description 1",
  //     project: "Project 1",
  //     timerange: "Time Range 1",
  //     tagIds: ["tag1", "tag2"],
  //     assignedIssueId: 2,
  //     timeEntry: {
  //       id: 1,
  //       seconds: 100,
  //       start: "2023-10-19",
  //       stop: "2023-10-20",
  //       at: "2023-10-19",
  //     },
  //     assignedIssueKey: "ISSUE-1",
  //     assignedProject: { id: 1, name: "Project 1" },
  //   },
  //   {
  //     user: { id: 1, username: "Talha" },
  //     description: "Description 1",
  //     project: "Project 1",
  //     timerange: "Time Range 1",
  //     tagIds: ["tag1", "tag2"],
  //     assignedIssueId: 2,
  //     timeEntry: {
  //       id: 1,
  //       seconds: 100,
  //       start: "2023-10-19",
  //       stop: "2023-10-20",
  //       at: "2023-10-19",
  //     },
  //     assignedIssueKey: "ISSUE-2",
  //     assignedProject: { id: 1, name: "Project 1" },
  //   },
  //   {
  //     user: { id: 2, username: "Raza" },
  //     description: "Description 2",
  //     project: "Project 2",
  //     timerange: "Time Range 2",
  //     tagIds: ["tag3", "tag4"],
  //     assignedIssueId: 2,
  //     timeEntry: {
  //       id: 2,
  //       seconds: 200,
  //       start: "2023-10-18",
  //       stop: "2023-10-19",
  //       at: "2023-10-18",
  //     },
  //     assignedIssueKey: "ISSUE-1",
  //     assignedProject: { id: 2, name: "Project 2" },
  //   },
  // ];

  const reportDataByProject = groupBy(data, (x: TimeEntry) => {
    return x?.assignedProject?.name;
  });
  const workbook = new ExcelJS.Workbook();

  Object.keys(reportDataByProject).map((x) => {
    const projectData = reportDataByProject[x];
    const projectUserData = groupBy(projectData, (x) => x.user.username);
    const issueKeys = uniq(projectData.map((x) => x.assignedIssueKey));
    const users = Object.keys(projectUserData);
    let personSums: number[] = [...users.map((x) => 0)];
    let result: string[][] = [["Issue", ...users, "Total"]];
    issueKeys.map((issueKey) => {
      let issueTotal = 0;
      const row: string[] = [issueKey];
      const remainderColumns = users.map((user, index) => {
        const userData = (projectUserData[user] || []).filter(
          (x) => x.assignedIssueKey === issueKey
        );
        const total = userData.length
          ? sum(userData.map((x) => x.timeEntry.seconds / (60 * 60)))
          : 0;
        personSums[index] += total;
        issueTotal += total;
        return total.toFixed(2);
      });
      row.push(...remainderColumns, issueTotal.toFixed(2));
      result.push(row);
    });

    const sheet = workbook.addWorksheet(x);
    result.map((x) => {
      sheet.addRow(x);
    });
    sheet.addRow([
      "Total",
      ...personSums.map((x) => x.toFixed(2)),
      sum(personSums).toFixed(2),
    ]);
  });
  const filePath = `${config.getAbsolutePath(
    "/"
  )}/storage/toggl-${moment().format("HH-mm-ss")}.xlsx`;
  mkdirSync(path.dirname(filePath), {
    recursive: true,
  });
  await workbook.xlsx.writeFile(filePath);
  childProcess.exec(`start "" "${path.dirname(filePath)}"`);
  return data ? NextResponse.json({ data: "File Saved" }) : null;
};
export const GET = async (request: NextRequest) => {};

export const PUT = async (request: NextRequest) => {};

export const DELETE = async (request: NextRequest) => {};
