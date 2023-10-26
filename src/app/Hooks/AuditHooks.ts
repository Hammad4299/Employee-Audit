"use client";

import { AuditDataFilters } from "../audit/page";
import { AuditService as AuditServiceClass } from "../Services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IssueDetail, Project } from "../DomainModals";

import objectHash from "object-hash";
import { TimeEntry } from "@/app/DomainModals/Reports";
import { useMemo, useState } from "react";
const serviceInstance = new AuditServiceClass();

export const useWorkspaces = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["workspaces"],
    queryFn: serviceInstance.getWorkspaces,
  });
  return {
    workspaces: data,
    isLoading,
    error,
    refetch,
  };
};

export const useAudit = (auditFilters?: AuditDataFilters) => {
  const empty: TimeEntry[] = useMemo(() => [], []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["time-entries", "list", auditFilters],
    enabled: false,
    staleTime: Infinity,
    queryFn: () => {
      return serviceInstance.getAuditData(auditFilters).then((res) => {
        return res.data.data.map((d): TimeEntry => {
          const {
            assignedIssueId,

            assignedProject,
            ...hashable
          } = d;
          return {
            ...d,
            id: objectHash(hashable),
          };
        });
      });
    },
  });
  return {
    timeEntries: data || empty,
    isLoading,
    error,
    refetch: refetch,
  };
};

export const useProjects = () => {
  const empty: Project[] = useMemo(() => [], []);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects", "list"],
    queryFn: () => serviceInstance.getAllProject().then((res) => res.data),
  });
  return {
    projects: data || empty,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateProjects = () => {
  const queryClient = useQueryClient();
  const { isPending, data, mutateAsync } = useMutation({
    mutationFn: (project: Partial<Project>) =>
      serviceInstance.createProject(project).then((res) => res.data),
    onSuccess: (project) =>
      queryClient.invalidateQueries({
        queryKey: ["projects", "list"],
      }),
  });
  return {
    createProject: mutateAsync,
    isLoading: isPending,
    project: data,
  };
};
export const useUpdateProjects = () => {
  const queryClient = useQueryClient();
  const { isPending, data, mutateAsync } = useMutation({
    mutationFn: (project: Partial<Project>) =>
      serviceInstance.updateProject(project).then((res) => res.data),
    onSuccess: (project) =>
      queryClient.invalidateQueries({
        queryKey: ["projects", "list"],
      }),
  });
  return {
    updateProject: mutateAsync,
    isLoading: isPending,
    project: data,
  };
};

export const useIssueDetails = () => {
  const empty: IssueDetail[] = useMemo(() => [], []);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["issues", "list"],
    queryFn: () => serviceInstance.getAllIssueDetails().then((res) => res.data),
  });
  return {
    issues: data || empty,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateIssueDetails = () => {
  const queryClient = useQueryClient();
  const { isPending, data, mutateAsync } = useMutation({
    mutationFn: (issue: Partial<IssueDetail>) =>
      serviceInstance.createIssueDetail(issue).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["issues", "list"],
      }),
  });
  return {
    createIssue: mutateAsync,
    isLoading: isPending,
    issue: data,
  };
};

export const useUpdateIssueDetails = () => {
  const queryClient = useQueryClient();
  const { isPending, data, mutateAsync } = useMutation({
    mutationFn: (issue: IssueDetail) =>
      serviceInstance.updateIssueDetail(issue).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["issues", "list"],
      }),
  });
  return {
    updateIssue: mutateAsync,
    isLoading: isPending,
    issue: data,
  };
};
