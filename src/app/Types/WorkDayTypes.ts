import { Workspace } from "../DomainModals";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface RawWorkdaysInputs {
  dateRange: DateRange;
  defaultMinHours: {
    fullDay: number;
    halfDay: number;
  };
}

export interface RawWorkdaysData {
  id?: string;
  date: string;
  isWorkDay: number;
  consideringFullDayHrs: number;
  consideringHalfDayHrs: number;
}

export interface WorkDaysExcelReportRawData {
    dateRange: DateRange;
    rawData: RawWorkdaysData[];
    workspaces: Workspace[];
}

export const consideredWeekWorkingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export enum FieldNames {
  "ID" = "id",
  "Date" = "date",
  "Is Work Day" = "isWorkDay",
  "Considering Full Day Hrs" = "consideringFullDayHrs",
  "Considering Half Day Hrs" = "consideringHalfDayHrs",
}
