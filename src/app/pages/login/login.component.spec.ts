import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../shared/services/authentication.service';

describe('LoginComponent', () => {
  let authenticationService: AuthenticationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [],
    });
  });

  it(`Login with correct username and password`, () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`Get error when username is wrong`, () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
  });
});
