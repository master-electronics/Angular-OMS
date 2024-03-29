import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from '@apollo/client/core';
import { ErrorResponse, onError } from '@apollo/client/link/error';
import { Logger } from './shared/services/logger.service';

export const errorLink = onError(
  ({ graphQLErrors, networkError }: ErrorResponse) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        Logger.error('ApolloLink', 'error', `${message}, ${locations}, ${path}`)
      );

    if (networkError)
      Logger.error('ApolloLink', 'NetWorkError', `${networkError.message}`);
  }
);

export const middleware = new ApolloLink((operation, forward) => {
  const token = JSON.parse(sessionStorage.getItem('userInfo') || '').idToken;
  if (token) {
    operation.setContext({
      headers: new HttpHeaders().set('Authorization', `Bearer ${token || ''}`),
    });
  }
  return forward(operation);
});
