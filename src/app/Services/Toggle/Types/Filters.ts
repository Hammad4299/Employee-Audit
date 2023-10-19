export interface ReportFilters {
  billable?: boolean;
  client_ids?: number[];
  description?: string;
  end_date: string;
  first_id?: number;
  first_row_number?: number;
  first_timestamp?: number;
  group_ids?: number[];
  grouped?: boolean;
  hide_amounts?: boolean;
  max_duration_seconds?: number;
  min_duration_seconds?: number;
  order_by?: string;
  order_dir?: string;
  page_size?: number;
  postedFields?: string[];
  project_ids?: number[];
  rounding?: number;
  rounding_minutes?: number;
  startTime?: string;
  start_date: string;
  tag_ids?: number[];
  task_ids?: number[];
  time_entry_ids?: number[];
  user_ids?: number[];
}
