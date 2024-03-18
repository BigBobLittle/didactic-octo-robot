"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Modal,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import TaskTable from "./Tasktable";
import TaskFormComponent from "./TaskForm";
import { Task } from "../types/Tasks";
import { useMutation } from "@apollo/client";
import { DELETE_TASK, UPDATE_TASK } from "../api/graphql/mutations";
import { GET_ALL_TASKS } from "../api/graphql/queries";
import { useRouter } from "next/navigation";

interface DashboardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deletePromptOpen, setDeletePromptOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenTaskForm = () => {
    setSelectedTask(selectedTask);
    setOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };
  

  const handleCloseTaskForm = () => {
    setSelectedTask(null);
    setOpen(false);
  };

  const handleCloseDeletePrompt = () => {
    setTaskToDelete(null);
    setDeletePromptOpen(false);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      onDeleteTask(taskToDelete);
      setDeletePromptOpen(false);
    }
  };

  const [deleteTask] = useMutation(DELETE_TASK);
  const onDeleteTask = async (taskId: string) => {
    await deleteTask({
      variables: {
        input: {
          id: taskId,
        },
      },
      refetchQueries: [GET_ALL_TASKS],
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenTaskForm}
          >
            Add Task
          </Button>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <TaskTable
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={onDeleteTask}
        />
      </div>

      <Modal open={open} onClose={handleCloseTaskForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TaskFormComponent
            task={selectedTask}
            onCancel={handleCloseTaskForm}
            // onSubmit={(task) => {
            //   onEditTask(task);
            //   handleCloseTaskForm();
            // }}
          />
        </Box>
      </Modal>

      <Modal open={deletePromptOpen} onClose={handleCloseDeletePrompt}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this task?
          </Typography>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Yes
          </Button>
          <Button
            onClick={handleCloseDeletePrompt}
            variant="contained"
            color="secondary"
          >
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;
