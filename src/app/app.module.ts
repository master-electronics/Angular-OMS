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
import { HttpHeaderInterceptor } from './shared/interceptors/http-header.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ShellComponent } from './pages/shell/shell.component';
import { NavbarComponent } from './pages/shell/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { IconsProviderModule } from './icons-provider.module';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
registerLocaleData(en);

import { environment } from '../environments/environment';
import { MenuItemComponent } from './shared/ui/menu-item.component';
import { MenubarItemComponent } from './shared/ui/menubar-item.compenent';
import { LoadingSpinnerComponent } from './shared/ui/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShellComponent,
    NavbarComponent,
    HomeComponent,
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
    IconsProviderModule,
    NzButtonModule,
    NzInputModule,
    NzMessageModule,
    NzDrawerModule,
    NzDropDownModule,
    NzMenuModule,
    NzAlertModule,
    NzFormModule,
    NzCardModule,
    MenuItemComponent,
    MenubarItemComponent,
    NzModalModule,
    LoadingSpinnerComponent,
  ],

  providers: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
