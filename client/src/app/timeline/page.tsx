
"use client"

import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { isError } from "util";


type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
    const isDarkMode=useAppSelector((state)=> state.global.isDarkMode);
    
    const {data:projects,error,isLoading}=useGetProjectsQuery();
    
    const [displayOptions, setDisplayOptions]= useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US"
    })

    const ganttTasks=useMemo(()=>{
        return(
            projects?.map((project)=>({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                name: project.name,
                id: `Project-${project.id}`,
                type: "project" as TaskTypeItems,
                progress: 50,
                isDisabled: false,
            })) || []
        );
    }, [projects]);

    const handleViewModelChange=(
        event: React.ChangeEvent<HTMLSelectElement>,
    )=>{
        setDisplayOptions((prev)=>({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    if(isLoading) return <div>Loading...</div>
    if(isError || !projects) return <div>An error occured while fetching projects.</div>

  return (
    <div className="max-w-full p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 py-5">
            <h1 className="me-2 text-lg font-bold dark:text-white">
                Project Task Timeline
            </h1>
            <div className="relative inline-block w-64">
                <select className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white" value={displayOptions.viewMode} onChange={handleViewModelChange} name="" id="">
                    <option value={ViewMode.Day}>Day</option>
                    <option value={ViewMode.Week}>Week</option>
                    <option value={ViewMode.Month}>Month</option>
                </select>
            </div>
        </div>
        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
            <div className="timeline">
                <Gantt
                tasks={ganttTasks}
                {...displayOptions}
                columnWidth={displayOptions.viewMode===ViewMode.Month ?150 :100}
                listCellWidth="100px"
                barBackgroundColor={isDarkMode ? "#101214": "#aeb8c2"}
                barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                />
            </div>
            <div className="px-4 pb-5 pt-1">
                <button 
                onClick={()=> setIsModalNewTaskOpen(true)}
                className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600">
                    Add New Task
                </button>

            </div>
        </div>
    </div>
  )
}

export default Timeline