"use client";
import React, { useState } from "react";

import CreatableSelect from "react-select/creatable";
import { useCreateIssueDetails, useCreateProjects } from "../Hooks/AuditHooks";
import { IssueDetails, Projects } from "../audit/page";

interface Option {
  readonly label: string;
  readonly value: string;
}
interface CreatableSelectComponentProps {
  projects?: Projects[];
  issueDetails?: IssueDetails[];
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

  let defaultOptions: Option[] = [];

  if (projects && projects.length) {
    console.log("Running conponent for Project");
    defaultOptions = projects.map((project) => createOption(project.name));
  } else if (issueDetails && issueDetails.length) {
    console.log("Running conponent for Isssue");
    defaultOptions = issueDetails.map((issue) => createOption(issue.name));
  }

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState<Option | null>();

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    let response;
    if (forProjects) {
      console.log("Creating project");
      response = await createProjects(inputValue);
    } else if (forIssueDetails) {
      console.log("Creating Issue");
      response = await createIssueDetails(inputValue);
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
