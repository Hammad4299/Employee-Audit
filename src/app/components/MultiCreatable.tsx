"use client";

import React, { KeyboardEventHandler } from "react";

import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

interface CreatableMultiselectComponentProps {
  onCreate: (newValue: string) => void;
}

export const MultiCreatableComponent = (props: CreatableMultiselectComponentProps) => {

    const {onCreate} = props;

  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newValue) => {
        onCreate(newValue)
        setInputValue(newValue);
      }}
      onKeyDown={handleKeyDown}
      placeholder="Type and press enter to create tags..."
      value={value}
    />
  );
};
