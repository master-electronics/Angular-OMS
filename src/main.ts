import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppRoutingModule } from './app/app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
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
import {
  Title,
  BrowserModule,
  bootstrapApplication,
} from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      CommonModule,
      ApolloModule,
      PlatformModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      NzIconModule,
      NzButtonModule,
      NzInputModule,
      NzMessageModule,
      NzDrawerModule,
      NzDropDownModule,
      NzMenuModule,
      NzAlertModule,
      NzFormModule,
      NzCardModule,
      NzModalModule
    ),
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
