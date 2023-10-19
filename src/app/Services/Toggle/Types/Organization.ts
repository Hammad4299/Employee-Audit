export interface Organization {
  id: number;
  name: string;
  pricing_plan_id: number;
  created_at: string;
  at: string;
  server_deleted_at: string | null;
  is_multi_workspace_enabled: boolean;
  suspended_at: string | null;
  user_count: number;
  trial_info?: {
    trial: boolean;
    trial_available: boolean;
    trial_end_date: string | null;
    next_payment_date: string | null;
    last_pricing_plan_id: string | number | null;
  };
  is_unified: boolean;
  max_workspaces: number;
  admin: boolean;
  owner: boolean;
}
