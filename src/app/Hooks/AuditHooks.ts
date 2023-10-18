"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AuditData, AuditDataFilters } from "../audit/page";
import { AuditService as AuditServiceClass } from "../Services";

const serviceInstance = new AuditServiceClass();

export const useAudit = (filters?: AuditDataFilters) => {
  const [auditData, setAuditData] = useState<AuditData[]>([]);

  const refetch = useCallback(()=> {
    return serviceInstance.getAuditData(filters).then((res)=> {
      setAuditData(res.data)
      return res.data
    })
  }, [])

  useEffect(() => {
    refetch();
  }, []);

  return {
    refetch,
    auditData,
  };
};
