import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from '@apollo/client/core';
import { ErrorResponse, onError } from '@apollo/client/link/error';

export const errorLink = onError(
  ({ graphQLErrors, networkError }: ErrorResponse) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
      );

    if (networkError) console.error(`[Network error]: ${networkError.message}`);
  }
);

export const middleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || null}`
    ),
  });
  return forward(operation);
});
