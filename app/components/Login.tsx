"use client";
import React, { useState } from "react";
import { Button, TextField, Typography, Container, Alert } from "@mui/material";
import { useMutation, ApolloError, isApolloError } from "@apollo/client";
import { LOGIN_MUTATION } from "../api/graphql/mutations";
import { useRouter } from "next/navigation";



const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [login] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform validation here
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // perform login by connecting to apollo server
    try {
      const { data } = await login({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });

      // Handle successful login
      // redirect to dashboard
      // save token to local storage
      if (data && data.login && data.login.data.token) {
      
       localStorage.setItem("authToken", data.login.token)
        // Redirect to the dashboard page
      }
      setSuccess(data.login.message);
      router.push("/dashboard");

     
    } catch (error: any) {
      if (isApolloError(error)) {
        const { graphQLErrors, networkError } = error;
        if (graphQLErrors) {
          // Handle GraphQL errors (e.g., invalid credentials, validation errors)
          const errorMessage = graphQLErrors[0].message; // Get the first error message
          setError(errorMessage);
        } else if (networkError) {
          // Handle network errors (e.g., connection issues)
          setError("Network error occurred. Please try again later.");
        } else {
          // Handle unexpected errors (log for debugging)
          // console.error("Unexpected login error:", error);
          setError("An error occurred. Please try again later."); // Generic message
        }
      }
    }
  };

  return (
    <Container maxWidth="sm">
      {error && (
        <Alert variant="outlined" severity="error">
          {error}
        </Alert>
      )}

      {/* {success && SimpleSnackbar({message: success})} */}

      <Typography variant="h4" align="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
