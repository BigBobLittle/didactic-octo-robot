import { useState, useRef, useEffect } from "react";
import { TextField, Button, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@apollo/client";
import { CREATE_TASK, UPDATE_TASK } from "../api/graphql/mutations";
import { GET_ALL_TASKS } from "../api/graphql/queries";

interface TaskFormProps {
  task: Task | null;
  onCancel: () => void;
}

interface Task {
  name: string;
  description: string;
  id: string;
}

const TaskFormComponent: React.FC<TaskFormProps> = ({ task, onCancel }) => {
 
  const [name, setName] = useState(task ? task.name : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const input = task
    ? { input: { id: task.id, name, description } }
    : { input: { name, description } };

  const [mutationFunction, { loading }] = useMutation(
    task && task.name ? UPDATE_TASK : CREATE_TASK,
    {
      variables: {
        ...input,
      },
      onCompleted: () => {
        setName("");
        setDescription("");
        onCancel();
      },
      onError: (error) => {
        setError(error.message);
      },
      refetchQueries: [GET_ALL_TASKS],
    }
  );
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !description) {
      setError("Please fill in all fields");
      return;
    }

    await mutationFunction();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={formRef} component="form" onSubmit={handleSubmit}>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        type="button"
        color="primary"
        onClick={onCancel}
      >
        <CloseIcon />
      </IconButton>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        margin="normal"
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary">
        {task && task.id ? "Update" : "Add"}
      </Button>
    </Box>
  );
};

export default TaskFormComponent;
