import { gql } from 'graphql-tag';

const typeDefs = gql`
    type Task {
        id: ID!
        name: String
        description: String
        created_at: String
        updated_at: String

    }

  input SignupInput {
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }


  input CreateTaskInput {
    name: String!
    description: String!
  }

  input UpdateTaskInput {
    id: ID!
    name: String!
    description: String!
  }
  type Query {
    hello: String
    tasks: [Task]
    task(id: Int!): Task
  }
 
  type Response {
    message: String
    data: TokenData
  }
  
  type TokenData {
    token: String
  }

  input DeleteTaskInput {
    id: ID!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(input: UpdateTaskInput!): Task
    deleteTask(input: DeleteTaskInput!): Response
    login(input: LoginInput!): Response!
    signup(input: SignupInput): Response!
    
  }
`;

export default typeDefs;
