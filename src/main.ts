import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { InMemoryCache } from '@apollo/client/core';
import { middleware, errorLink } from './app/ApolloLink';
import { HttpBatchLink, HttpLink } from 'apollo-angular/http';
import {
  APOLLO_NAMED_OPTIONS,
  NamedOptions,
  ApolloModule,
} from 'apollo-angular';
import { HttpHeaderInterceptor } from './app/shared/interceptors/http-header.interceptor';
import {
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { Title, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routing';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(ApolloModule),
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: (httpLink: HttpBatchLink): NamedOptions => {
        const http = httpLink.create({ uri: environment.graphql });
        const middle = middleware.concat(http);
        const link = errorLink.concat(middle);
        return {
          wmsNodejs: {
            link,
            cache: new InMemoryCache(),
          },
        };
      },
      deps: [HttpLink],
    },
    { provide: NZ_I18N, useValue: en_US },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
