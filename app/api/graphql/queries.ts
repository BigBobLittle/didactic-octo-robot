import { gql } from "@apollo/client";

export const GET_ALL_TASKS = gql`
query Query {
    tasks {
      created_at
      description
      id
      name
      updated_at
    }
  }`