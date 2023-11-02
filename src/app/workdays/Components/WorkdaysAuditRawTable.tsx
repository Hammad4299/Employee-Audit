"use client";
import React, { useMemo, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TableContainer,
  TextField,
} from "@mui/material";
import RawWorkdaysInputsGenerator from "./RawWorkdaysInputsGenerator";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import {
  FieldNames,
  RawWorkdaysData,
  RawWorkdaysInputs,
  consideredWeekWorkingDays,
} from "@/app/Types/WorkDayTypes";
import objectHash from "object-hash";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { useWorkspaces } from "@/app/Hooks/AuditHooks";
import { Workspace } from "@/app/DomainModals";
import { AuditService } from "@/app/Services";
import WorkspacesSelectDialog from "./WorkspacesSelectDialog";

dayjs.extend(weekday);

const useStyles = makeStyles({});

interface WorkdaysAuditRawTableProps {}

const WorkdaysAuditRawTable = (props: WorkdaysAuditRawTableProps) => {
  const {} = props;
  const classes = useStyles();

  const { workspaces } = useWorkspaces();

  const [rawWorkdaysInputs, setRawWorkdaysInputs] = useState<RawWorkdaysInputs>(
    {
      dateRange: {
        startDate: "",
        endDate: "",
      },
      defaultMinHours: {
        fullDay: 7.5,
        halfDay: 3.5,
      },
    }
  );
  const [workspacesValues, setWorkspacesValues] = useState<Workspace[]>([]);

  const [showAddWorkspaceDialog, setShowAddWorkspaceDialog] =
    useState<boolean>(false);

  const allDatesBetweenRange: string[] = useMemo((): string[] => {
    const endDate = rawWorkdaysInputs?.dateRange?.endDate;
    const startDate = rawWorkdaysInputs?.dateRange?.startDate;
    const dates: string[] = [];
    let currentDate: Dayjs = dayjs(startDate);
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  }, [rawWorkdaysInputs.dateRange]);

  const decideIsWorkdayOrNot = (date: string): number => {
    let isWorkday: number = null;
    if (date) {
      const weekdayOfSelectedDate = dayjs(date).format("dddd");
      if (consideredWeekWorkingDays.includes(weekdayOfSelectedDate)) {
        isWorkday = 1;
      } else {
        isWorkday = 0;
      }
    }
    return isWorkday;
  };

  const headCells: GridColDef[] = [
    {
      field: FieldNames.ID,
      headerName: "ID",
      type: "string",
      editable: false,
      width: 200,
    },
    {
      field: FieldNames.Date,
      headerName: "Date",
      type: "string",
      editable: false,
      width: 200,
    },
    {
      field: FieldNames["Is Work Day"],
      headerName: "Is Work Day",
      type: "number",
      editable: true,
      width: 200,
      align: "left",
      headerAlign: "left",
      // valueParser: (value: GridEditCellValueParams, params: any) => {
      //   const pattern = /^[01]$/;
      //   if (!pattern.test(value as any)) {
      //     alert("please insert only 0 or 1");
      //     return 1;
      //   }
      //   return value;
      // },
    },
    {
      field: FieldNames["Considering Full Day Hrs"],
      headerName: "Full Day",
      type: "number",
      editable: true,
      width: 200,
      align: "left",
      headerAlign: "left",
      // valueParser: (value: GridEditCellValueParams) => {
      //   const pattern = /^[0-9]+(\.[0-9])?$/;
      //   if (!pattern.test(value as any)) {
      //     alert("please insert only digits from 0 to 9 with one decimal place");
      //     return 7.5;
      //   }
      //   return value;
      // },
      // preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      //   const pattern = /^[0-9]+(\.[0-9])?$/;
      //   if (params.hasChanged && !pattern.test(params.props.value)) {
      //     alert("Please insert only digits from 0 to 9 with one decimal place");
      //     return {
      //       ...params,
      //       props: {
      //         ...params.props,
      //         value: 7.5,
      //       },
      //     };
      //   }

      //   return params;
      // },
    },
    {
      field: FieldNames["Considering Half Day Hrs"],
      headerName: "Half Day",
      type: "number",
      editable: true,
      width: 200,
      align: "left",
      headerAlign: "left",
      // valueParser: (value: GridEditCellValueParams) => {
      //   const pattern = /^[0-9]+(\.[0-9])?$/;
      //   if (!pattern.test(value as any)) {
      //     alert("please insert only digits from 0 to 9 with one decimal place");
      //     return 3.5;
      //   }
      //   return value;
      // },
    },
  ];

  let rawData: RawWorkdaysData[] = useMemo(() => {
    return allDatesBetweenRange
      ?.map((d) => {
        return {
          date: d,
          isWorkDay: decideIsWorkdayOrNot(d),
          consideringFullDayHrs: rawWorkdaysInputs.defaultMinHours.fullDay,
          consideringHalfDayHrs: rawWorkdaysInputs.defaultMinHours.halfDay,
        } as RawWorkdaysData;
      })
      .map((x) => ({ ...x, id: objectHash(x) }));
  }, [allDatesBetweenRange, rawWorkdaysInputs.defaultMinHours]);

  const tableCellEditHandler = (
    value: any,
    field: string,
    row: RawWorkdaysData
  ) => {
    console.log("params", value, field, row);

    if (
      field === FieldNames["Is Work Day"] ||
      field === FieldNames["Considering Half Day Hrs"] ||
      field === FieldNames["Considering Full Day Hrs"]
    ) {
      rawData = rawData.map((x) => {
        if (x.id === row.id) {
          return {
            ...x,
            [field]: Number(value),
          };
        }
        return x;
      });
      console.log(
        "🚀 ~ file: WorkdaysAuditRawTable.tsx:207 ~ rawData=rawData.map ~ rawData:",
        rawData
      );
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <RawWorkdaysInputsGenerator
          // inputFields={rawWorkdaysInputs}
          onInputChange={(inputs) => setRawWorkdaysInputs(inputs)}
        />
      </Grid>
      <Grid
        container
        marginBottom={2}
        alignItems={"center"}
        display={"flex"}
        justifyContent={"flex-end"}
      >
        <Grid item xs={2} textAlign={"right"}>
          <Button
            variant="contained"
            onClick={() => setShowAddWorkspaceDialog(true)}
          >
            show workspaces
          </Button>
        </Grid>
        <Grid item xs={2} textAlign={"right"}>
          <Button
            variant="contained"
            disabled={rawData.length && workspacesValues.length ? false : true}
            onClick={() => {
              const service = new AuditService();
              service
                .generateWorkdaysExcel({
                  dateRange: rawWorkdaysInputs.dateRange,
                  rawData: rawData,
                  workspaces: workspacesValues,
                })
                .catch((err) => alert("error"))
                .then((x) =>
                  alert("A file directory should have opened with excel file")
                );
            }}
          >
            {workspacesValues.length
              ? "GENERATE REPORT"
              : "SELECT WORKSPACE FIRST"}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rawData}
              columns={headCells}
              slots={{
                toolbar: GridToolbar,
              }}
              density="compact"
              pageSizeOptions={[100, 100, 100]}
              disableRowSelectionOnClick={true}
              checkboxSelection={false}
              onCellEditStop={(params: GridCellEditStopParams, event: any) => {
                tableCellEditHandler(
                  event.target.value,
                  params.colDef.field as keyof RawWorkdaysData,
                  params.row
                );
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
            />
          </Box>
        </TableContainer>
      </Grid>
      {showAddWorkspaceDialog && (
        <WorkspacesSelectDialog
          workspaces={workspaces || []}
          onClose={() => setShowAddWorkspaceDialog(false)}
          onSave={(workspaces) => {
            setWorkspacesValues(workspaces);
            setShowAddWorkspaceDialog(false);
          }}
        />
      )}
    </Grid>
  );
};

export default WorkdaysAuditRawTable;
