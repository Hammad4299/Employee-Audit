import { AuditDataFilters } from "@/app/audit/page";
import { axiosInstance } from "@/app/utilities/axios";

export class AuditService {
  getAuditData(filters?: AuditDataFilters) {
    return axiosInstance.post("endpoint", filters);
  }
}
