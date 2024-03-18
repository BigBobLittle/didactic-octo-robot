import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
mutation Mutation($input: LoginInput!) {
    login(input: $input) {
      data {
        token
      }
      message
    }
  }
`
export const CREATE_TASK = gql` 
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    name
  }
}
`

export const DELETE_TASK = gql`
mutation Mutation($input: DeleteTaskInput!) {
  deleteTask(input: $input) {
    message
  }
}
`

export const UPDATE_TASK = gql`
mutation Mutation($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    name
  }
}`