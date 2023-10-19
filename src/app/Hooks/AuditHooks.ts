"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  AuditData,
  AuditDataFilters,
  IssueDetails,
  Projects,
} from "../audit/page";
import { AuditService as AuditServiceClass } from "../Services";
import { useQuery } from "@tanstack/react-query";
const serviceInstance = new AuditServiceClass();

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: serviceInstance.getWorkspaces,
  });
};

export const useAudit = (auditFilters?: AuditDataFilters) => {
  const [auditData, setAuditData] = useState<AuditData[]>([]);

  const refetch = useCallback((filters?: AuditDataFilters) => {
    return serviceInstance.getAuditData(filters).then((res) => {
      setAuditData(res.data);
      return res.data;
    });
  }, []);

  useEffect(() => {
    if (auditFilters) {
      refetch(auditFilters);
    }
  }, [auditFilters]);

  return {
    refetch,
    auditData,
  };
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Projects[]>([]);

  const refetch = useCallback(() => {
    return serviceInstance.getAllProject().then((res) => {
      setProjects(res.data);
      return res.data;
    });
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  return {
    refetch,
    projects,
  };
};

export const useCreateProjects = () => {
  const [projects, setProjects] = useState<Projects[]>([]);
  const createProjects = (name: string): Promise<Projects> => {
    return serviceInstance.createProject(name).then((res) => {
      setProjects(res.data);
      return res.data;
    });
  };
  return {
    projects,
    createProjects,
  };
};

export const useUpdateProjects = () => {
  const [projects, setProjects] = useState<Projects[]>([]);
  const updateProjects = (body: Projects): Promise<Projects> => {
    return serviceInstance.updateProject(body).then((res) => {
      setProjects(res.data);
      return res.data;
    });
  };
  return {
    updateProjects,
    projects,
  };
};

export const useIssueDetails = () => {
  const [issueDetails, setIssueDetails] = useState<IssueDetails[]>([]);

  const refetch = useCallback(() => {
    return serviceInstance.getAllIssueDetails().then((res) => {
      setIssueDetails(res.data);
      return res.data;
    });
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  return {
    refetch,
    issueDetails,
  };
};

export const useCreateIssueDetails = () => {
  const [issueDetails, setIssueDetails] = useState<IssueDetails[]>([]);
  const createIssueDetails = (body: string): Promise<IssueDetails> => {
    return serviceInstance.createIssueDetail(body).then((res) => {
      setIssueDetails(res.data);
      return res.data;
    });
  };
  return {
    createIssueDetails,
    issueDetails,
  };
};

export const useUpdateIssueDetails = () => {
  const [issueDetails, setIssueDetails] = useState<IssueDetails[]>([]);
  const updateIssueDetails = (body: IssueDetails): Promise<IssueDetails> => {
    return serviceInstance.updateIssueDetail(body).then((res) => {
      setIssueDetails(res.data);
      return res.data;
    });
  };
  return {
    updateIssueDetails,
    issueDetails,
  };
};
