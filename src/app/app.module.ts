import { NgModule } from '@angular/core';
import {
  ApolloModule,
  APOLLO_NAMED_OPTIONS,
  NamedOptions,
} from 'apollo-angular';
import { HttpBatchLink, HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { errorLink, middleware } from './ApolloLink';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformModule } from '@angular/cdk/platform';
import { AppRoutingModule } from './app.routing';
import { SharedComponentModule } from './components/shared-component.module';
import { SharedUtilityModule } from './shared/shared-utility.module';
import { HttpHeaderInterceptor } from './shared/interceptors/http-header.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ShellComponent } from './pages/shell/shell.component';
import { NavbarComponent } from './pages/shell/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { menubarItem } from './shared/menubar-item.compenent';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { IconsProviderModule } from './icons-provider.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
registerLocaleData(en);

import { environment } from '../environments/environment';
import { ErrorInterceptor } from './shared/interceptors/http-error.interceptor';
// import { GlobalErrorHandler } from './shared/global-error-handler';

import { menuItem } from './shared/menu-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    NotFoundComponent,
    ShellComponent,
    NavbarComponent,
    HomeComponent,
    menuItem,
    menubarItem,
  ],
  imports: [
    CommonModule,
    ApolloModule,
    HttpClientModule,
    PlatformModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
    IconsProviderModule,
    NzButtonModule,
    NzInputModule,
    NzSpinModule,
    NzMessageModule,
    NzDrawerModule,
    NzDropDownModule,
    NzMenuModule,
    NzAlertModule,
    NzFormModule,
    NzCardModule,
  ],

  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
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
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
