import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformModule } from '@angular/cdk/platform';
import { AppRoutingModule } from './app.routing';
import { SharedComponentModule } from './components/shared-component.module';
import { SharedUtilityModule } from './shared/shared-utility.module';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';

import { AppComponent } from './app.component';
import { AthTokenInterceptor } from './shared/interceptors/ath-token.interceptor';
import { ErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ShellComponent } from './pages/shell/shell.component';
import { NavbarComponent } from './pages/shell/navbar/navbar.component';
import { FooterComponent } from './pages/shell/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { TestComponent } from './pages/test/test.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    NotFoundComponent,
    ShellComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    TestComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PlatformModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedComponentModule,
    SharedUtilityModule,
    GoogleTagManagerModule.forRoot({
      id: environment.GTM_ID,
    }),
    KeyboardShortcutsModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: `${environment.apiUrl}/graphql`,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
