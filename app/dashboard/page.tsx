"use client";
import React from "react";
import Dashboard from "../components/Dashboard";
import { Task } from "../types/Tasks";
import requireAuthentication from "../components/ProtectDashboard";
import { isApolloError, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_TASKS } from "../api/graphql/queries";
import { DELETE_TASK, UPDATE_TASK } from "../api/graphql/mutations";

const AuthenticatedDashboard = requireAuthentication(Dashboard);

const DashboardPage: React.FC = () => {
  // Fetch all tasks with useQuery
  const { data } = useQuery(GET_ALL_TASKS);
  const tasks = (data?.tasks as Task[]) || [];

  // Edit task function
  const handleEditTask = async (task: Task) => {
    const [updateTask] = useMutation(UPDATE_TASK, {
      variables: { id: task.id, name: task.name, description: task.description },
      refetchQueries: [GET_ALL_TASKS],
    });

    await updateTask();
  };

  // Delete task function
  const handleDeleteTask = async (taskId: string) => {
    const [deleteTask] = useMutation(DELETE_TASK, {
      variables: { deleteTaskId: taskId },
      refetchQueries: [GET_ALL_TASKS],
    });

    await deleteTask();
  };

  // Render Dashboard with tasks and handlers
  return (
    <AuthenticatedDashboard
      
      tasks={tasks}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
    />
  );
};

export default DashboardPage;
