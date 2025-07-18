import Modal from "@/components/Modal";
import { Priority, Status, useCreateTasksMutation } from "@/state/api";
import React, { useState } from "react";
import {formatISO} from 'date-fns'; 

type Props = {
  isOpen: boolean;
  onClose: () => void;
   id: String;
};

const ModalNewTask = ({ isOpen, onClose, id }: Props) => {
  const [createTask, {isLoading}] = useCreateTasksMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const handleSubmit = async () => {
    if (!title || !authorUserId) return;
    const formatStartDate= formatISO(new Date(startDate), { representation: 'complete'});
    const formatDueDate= formatISO(new Date(dueDate), { representation: 'complete'});

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate : formatStartDate,
      dueDate: formatDueDate,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: Number(id),
    });
  };

  const isFormValid = () => {
    return title && authorUserId;
  };

  const selectStyles="mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:bg-dark-tertiary dark:border-dark-tertiary dark:text-white dark:focus-outline-non";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select className={selectStyles} 
          value={status}
          onChange={(e)=> setStatus(Status[e.target.value as keyof typeof  Status])}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>UnderReview</option>
            <option value={Status.Completed}>Completed</option>

          </select>
          <select className={selectStyles} 
          value={status}
          onChange={(e)=> setPriority(Priority[e.target.value as keyof typeof Priority])}
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>

          </select>

        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma seperated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <input
          type="text"
          className={inputStyles}
          placeholder="Author User ID"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />

        <button type="submit" 
        className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium shadow-sm hover:bg-blue-600  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          !isFormValid() || isLoading ? "cursor-not-allowed opacity-50": ""
        }`}
        disabled={!isFormValid() || isLoading}>
          {isLoading ? "Creating...." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
