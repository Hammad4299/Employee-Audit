"use client";
import React, { useEffect, useState } from "react";

import CreatableSelect from "react-select/creatable";
import { useCreateIssueDetails, useCreateProjects } from "../Hooks/AuditHooks";
import { IssueDetail, Project } from "../DomainModals";

interface Option {
  readonly label: string;
  readonly value: string;
}
interface CreatableSelectComponentProps {
  projects?: Project[];
  issueDetails?: IssueDetail[];
  forProjects?: boolean;
  forIssueDetails?: boolean;
}

export const CreatableSelectComponent = (
  props: CreatableSelectComponentProps
) => {
  const { issueDetails, projects, forIssueDetails, forProjects } = props;

  const { createIssueDetails } = useCreateIssueDetails();
  const { createProjects } = useCreateProjects();

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  console.log("🚀 ~ file: CreatableSelect.tsx:35 ~ options:", options);
  const [value, setValue] = useState<Option | null>();

  useEffect(() => {
    if (projects && projects.length) {
      console.log("Running conponent for Project");
      setOptions(projects.map((project) => createOption(project.name)));
    } else if (issueDetails && issueDetails.length) {
      console.log("Running conponent for Isssue");
      setOptions(issueDetails.map((issue) => createOption(issue.issueKey)));
    }
  }, [projects, issueDetails]);

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    let response;
    if (forProjects) {
      console.log("Creating project");
      response = await createProjects({name: inputValue});
    } else if (forIssueDetails) {
      console.log("Creating Issue");
      response = await createIssueDetails({issueKey: inputValue});
    }
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
};
