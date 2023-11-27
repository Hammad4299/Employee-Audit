import ExcelJS from "exceljs";
import { WorkDaysExcelReportRawData } from "@/app/Types/WorkDayTypes";
import { NextRequest, NextResponse } from "next/server";
import config from "@/app/config/config";
import dayjs from "dayjs";
import { mkdirSync } from "fs";
import path from "path";
import childProcess from "child_process";
import { ToggleService } from "@/app/Services/Toggle";
import { groupBy } from "lodash";

interface TimeEntriesData {
  username: string;
  timeLoggedDate: string;
  timeLoggedSeconds: number;
}

export const POST = async (request: NextRequest) => {
  const data: WorkDaysExcelReportRawData = await request.json();

  const { workspaces, rawData, dateRange } = data;
  
  const workbook = new ExcelJS.Workbook();
  const toggleServiceInstance = new ToggleService(config.toggl.apiToken || "");

  const employeesOrderArray: string[] = [
    "Anas's workspace",
    "Farhanulhaq's workspace",
    "Saadwaseem's workspace",
    "Shafkatullah's workspace",
    "Nabeelshaikh's workspace",
    "Inzamamasghar's workspace",
    "Shahzad Sheikh's workspace",
    "Muhammad Furqan Ul Haq's workspace",
    "Abdulwasay's workspace",
    "Saadraza's workspace",
    "Umairhaneef's workspace",
    "Hassantariq's workspace",
    "Aun Rizvi's workspace",
    "Ahsan Bilal's workspace",
    "Hasnan Ahmed's workspace",
    "Faisal Ikram's workspace",
    "Ahmer Adnan Malik's workspace",
    "Ahmad Attique's workspace",
    "Taha Siddiqui's workspace",
    "abdul.rafay's workspace",
    "ikram.rasheed's workspace",
    "wasiq.bin.zahid's workspace",
  ];

  const sortedWorkspace = workspaces.sort((a, b) => {
    const aIndex = employeesOrderArray.indexOf(a.owner);
    const bIndex = employeesOrderArray.indexOf(b.owner);

    // If an owner is not found, move it to the end
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });

  for (const workspace of sortedWorkspace) {
    // console.log("dateeessss", dateRange);

    let timeEntriesData: TimeEntriesData[];
    await toggleServiceInstance
      .getReports(workspace.toggleId.toString(), {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate,
        page_size: 1000,
      })
      .then((data) => {
        // console.log("lengthhhhhhhhh", JSON.stringify(data.data));
        timeEntriesData = data.data.map((x) => ({
          username: x.username,
          timeLoggedDate: dayjs(x.time_entries[0].start).format("YYYY-MM-DD"),
          timeLoggedSeconds: x.time_entries[0].seconds,
        }));
      });

    // console.log("step1", timeEntriesData, timeEntriesData.length);

    let groupedTimeEntriesData = groupBy(timeEntriesData, (data) => {
      return dayjs(data.timeLoggedDate).format("YYYY-MM-DD");
    });

    // console.log("step2", timeEntriesData);

    const sumOfTimeByDay: TimeEntriesData[] = Object.keys(
      groupedTimeEntriesData
    ).map((key) => {
      return groupedTimeEntriesData[key].reduce((acc, data) => {
        return {
          username: data.username,
          timeLoggedDate: data.timeLoggedDate,
          timeLoggedSeconds:
            +data.timeLoggedSeconds +
            (!!acc.timeLoggedSeconds ? +acc.timeLoggedSeconds : 0),
        };
      }, {} as TimeEntriesData);
    });

    // console.log("step3", sumOfTimeByDay);

    const groupingEmployeeTimeEntries = groupBy(sumOfTimeByDay, "username");

    // console.log("step4", groupingEmployeeTimeEntries);

    const sheetData = rawData.map((rd) => {
      return {
        date: rd.date,
        milisecondsRecorded: 0,
        hoursRecorded: 0,
        isWorkedDay: rd.isWorkDay === 0 ? false : true,
        fullWorHours: rd.consideringFullDayHrs,
        halfWorHours: rd.consideringHalfDayHrs,
        fullDayLeave: false,
        halfDayLeave: false,
      };
    });

    const modifySheetData = sheetData.map((data) => {
      const modifiedData = Object.keys(groupingEmployeeTimeEntries).reduce(
        (acc, entry) => {
          const matchingEntry = groupingEmployeeTimeEntries[entry].find(
            (e) => e.timeLoggedDate === data.date
          );
          if (matchingEntry) {
            const secondsToHrs = +(
              matchingEntry.timeLoggedSeconds /
              (60 * 60)
            ).toFixed(1);
            acc.hoursRecorded = secondsToHrs;
            acc.milisecondsRecorded = matchingEntry.timeLoggedSeconds;
            // off days condition is not checked because the api is not returning enteries of off days
          }
          return acc;
        },
        { ...data }
      );
      return modifiedData;
    });

    // console.log("step5", JSON.stringify(modifySheetData));

    const sheet = workbook.addWorksheet(
      workspace.owner.replace(/workspace|'s/g, "")
    );

    const workdaySheetData = [
      [
        "Dates",
        "ms recorded",
        "Hours recorded",
        "Work day",
        "Full hours",
        "Half hours",
        "Full day leave",
        "Half day leave",
        "",
        "",
      ],
      ...modifySheetData.map((x) => [...Object.values(x), "", ""]),
    ];

    workdaySheetData.map((x) => {
      sheet.addRow(x);
    });

    // add leaves formulas
    for (let i = 0; i < workdaySheetData.length - 1; i++) {
      sheet.getCell(`G${i + 2}`).value = {
        formula: `=AND(D${i + 2},C${i + 2}<F${i + 2})`,
      };
      sheet.getCell(`H${i + 2}`).value = {
        formula: `=AND(D${i + 2},NOT(G${i + 2}),C${i + 2}<E${i + 2})`,
      };
    }
    // adding column and formulas for total audit information
    sheet.getCell(`K1`).value = "Total half day leaves";
    sheet.getCell(`K2`).value = "Total full day leaves";
    sheet.getCell(`K3`).value = "Total hours done";
    sheet.getCell(`K4`).value = "Working days remaining";
    sheet.getCell(`K5`).value = "Working hours remaining";
    sheet.getCell(`K6`).value = "Overtime";
    sheet.getCell(`K7`).value = "Month";

    sheet.getCell(`L1`).value = { formula: `=COUNTIF(H:H,TRUE)` };
    sheet.getCell(`L2`).value = { formula: `=COUNTIF(G:G,TRUE)` };
    sheet.getCell(`L3`).value = { formula: `=SUM(C:C)` };
    sheet.getCell(`L4`).value = {
      formula: `=COUNTIF(D:D,TRUE)-COUNTIF(G:G,TRUE)-(COUNTIF(H:H,TRUE)*0.5)`,
    };
    sheet.getCell(`L5`).value = { formula: `=L4*8` };
    // sheet.getCell(`L6`).value = { formula: `=CEILING.MATH(60*(L3-L5))/60` };
    sheet.getCell(`L6`).value = { formula: "=CEILING(60*(L3-L5)/60, 1)" };
    // sheet.getCell('L6').value = { formula: '=CEILING.MATH(60*(L3-L5)/60, 1)' };
    sheet.getCell(`L7`).value = `${dayjs(dateRange.startDate).format(
      "MMM-YY"
    )}`;
  }

  const filePath = `${config.getAbsolutePath(
    "/"
  )}workdaysStorage/workdays-audit-${dayjs().format("HH-mm-ss")}.xlsx`;

  mkdirSync(path.dirname(filePath), {
    recursive: true,
  });

  await workbook.xlsx.writeFile(filePath);

  childProcess.exec(`start "" "${path.dirname(filePath)}"`);

  return data ? NextResponse.json({ data: "file saved" }) : null;
};
