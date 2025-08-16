import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  teamId?: number;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId?: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks ?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId: number;
  projectManagerUserId: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProjects: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (results, error, { projectId }) =>
        [{ type: "Tasks", id: `PROJECT-${projectId}` }],
    }),
    getTaskByUser: build.query<Task[], number>({
      query: (userId)=> `tasks/user/${userId}`,
      providesTags: (result, error, userId)=>
        result
          ?result.map(({id})=> ({type:"Tasks", id}))
          : [{type: "Tasks", id:userId }],
    }),
    createTasks: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: (result, error, task) => [
        { type: "Tasks", id: `PROJECT-${task.projectId}` },
      ],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string; projectId: number }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      async onQueryStarted({ taskId, status, projectId }, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          api.util.updateQueryData("getTasks", { projectId }, (draft) => {
            const task = draft.find((t) => t.id === taskId);
            if (task) {
              task.status = status as Status; // update instantly
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // rollback if request fails
        }
      },
    }),
    getUsers: build.query<User[], void>({
      query: ()=> "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: ()=>"teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query:(query)=> `search?query=${query}`,
    })
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectsMutation,
  useGetTasksQuery,
  useCreateTasksMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTaskByUserQuery
} = api;

