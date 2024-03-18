"use client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import React from "react";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
});
// process.env.NEXT_PUBLIC_API || console.log({ httpLink });
const Providers = ({ children }: { children: React.ReactNode }) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    //  uri: "http://localhost:3000/graphql",
    link: authLink.concat(httpLink),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const authLink = setContext((_, { headers }) => {
  // Get the JWT token from localStorage
  const token = localStorage.getItem("authToken");

  // Add the token to the headers if it exists
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    headers,
  };
});

console.log({ authConcat: authLink.concat(httpLink) });
// Save JWT token to cookies
const saveTokenToLocalStorage = (token: string) => {
  localStorage.setItem("authToken", token);
};

export { authLink, Providers, saveTokenToLocalStorage };
