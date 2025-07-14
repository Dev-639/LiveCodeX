import Modal from "@/components/Modal";
import { useCreateProjectsMutation } from "@/state/api";
import React, { useState } from "react";
import {formatISO} from 'date-fns'; 

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectsMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;
    const formatStartDate= formatISO(new Date(startDate), { representation: 'complete'});
    const formatEndDate= formatISO(new Date(endDate), { representation: 'complete'});

    await createProject({
      name: projectName,
      description,
      startDate :formatStartDate,
      endDate : formatEndDate,
    });
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:bg-dark-tertiary dark:border-dark-tertiary dark:text-white dark:focus-outline-non";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New-Project">
      <form
        action=""
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className={inputStyles}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" 
        className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium shadow-sm hover:bg-blue-600  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          !isFormValid() || isLoading ? "cursor-not-allowed opacity-50": ""
        }`}
        disabled={!isFormValid() || isLoading}>
          {isLoading ? "Creating...." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
