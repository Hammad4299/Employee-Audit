"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AuditDataFilters } from "../audit/page";
import { AuditService as AuditServiceClass } from "../Services";
import { useQuery } from "@tanstack/react-query";
import { IssueDetail, Project } from "../DomainModals";
import { TimeEntry } from "../DomainModals/Reports";
const serviceInstance = new AuditServiceClass();

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: serviceInstance.getWorkspaces,
  });
};

export const useAudit = (auditFilters?: AuditDataFilters) => {
  const [auditData, setAuditData] = useState<TimeEntry[]>([]);

  const refetch = useCallback(
    (filters?: AuditDataFilters): Promise<TimeEntry[]> => {
      console.log("asdsd", filters);
      return serviceInstance.getAuditData(filters).then((res) => {
        setAuditData(res.data.data);
        return res.data.data;
      });
    },
    []
  );

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
  const [projects, setProjects] = useState<Project[]>([]);

  const refetch = useCallback((): Promise<Project[]> => {
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
  const [projects, setProjects] = useState<Project>();
  const createProjects = (project: Partial<Project>): Promise<Project> => {
    return serviceInstance.createProject(project).then((res) => {
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
  const [projects, setProjects] = useState<Project>();
  const updateProjects = (project: Partial<Project>): Promise<Project> => {
    return serviceInstance.updateProject(project).then((res) => {
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
  const [issueDetails, setIssueDetails] = useState<IssueDetail[]>([]);

  const refetch = useCallback((): Promise<IssueDetail[]> => {
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
  const [issueDetails, setIssueDetails] = useState<IssueDetail>();
  const createIssueDetails = (
    issueDetails: Partial<IssueDetail>
  ): Promise<IssueDetail> => {
    return serviceInstance.createIssueDetail(issueDetails).then((res) => {
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
  const [issueDetails, setIssueDetails] = useState<IssueDetail>();
  const updateIssueDetails = (
    issueDetail: IssueDetail
  ): Promise<IssueDetail> => {
    return serviceInstance.updateIssueDetail(issueDetail).then((res) => {
      setIssueDetails(res.data);
      return res.data;
    });
  };
  return {
    updateIssueDetails,
    issueDetails,
  };
};
