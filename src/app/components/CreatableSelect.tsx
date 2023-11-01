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
  options?: Option[];
  mode: "project" | "issue";
  value?: Option;
  onChange: (id: Option) => void;
}

export const CreatableSelectComponent = (
  props: CreatableSelectComponentProps
) => {
  const { options, value, onChange, mode } = props;

  const { createIssue: createIssueDetails } = useCreateIssueDetails();
  const { createProject: createProjects } = useCreateProjects();

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    let response;
    if (mode === "project") {
      response = await createProjects({ name: inputValue });
      onChange({
        label: response.name,
        value: response.id.toString(),
      });
    } else {
      response = await createIssueDetails({ issueKey: inputValue });
      onChange({
        label: response.issueKey,
        value: response.id.toString(),
      });
    }
    setIsLoading(false);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={onChange}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
};
