export interface Project {
  id: number;
  workspace_id: number;
  client_id: number;
  name: string;
  is_private: boolean;
  active: boolean;
  at: string;
  created_at: string;
  server_deleted_at: string | null;
  color: string;
  billable: boolean;
  template: boolean;
  auto_estimates: boolean;
  estimated_hours: number | string | null;
  rate: number | string | null;
  rate_last_updated: number | string | null;
  currency: string;
  recurring: boolean;
  recurring_parameters: number | null;
  current_period: number | null;
  fixed_fee: number | null;
  actual_hours: number | null;
  wid: number;
  cid: number;
}
