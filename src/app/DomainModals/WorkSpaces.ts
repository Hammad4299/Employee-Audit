import { UserRole } from "@/app/DomainModals/User";

export interface WorkSpaces {
  id: number;
  organization_id: number;
  name: string;
  profile: number;
  premium: boolean;
  business_ws: boolean;
  admin: boolean;
  role: UserRole;
  suspended_at: number | string | null;
  server_deleted_at: number | string | null;
  default_hourly_rate: number | string | null;
  rate_last_updated: number | string | null;
  default_currency: string;
}
