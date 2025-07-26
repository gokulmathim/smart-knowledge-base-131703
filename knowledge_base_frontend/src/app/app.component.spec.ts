import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angular');
  });

  it('should render the navbar and layout root', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check for navbar
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    // Check for sidebar
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
    // Check for theme toggle
    expect(compiled.querySelector('app-theme-toggle')).toBeTruthy();
    // Check for layout root
    expect(compiled.querySelector('.layout-root')).toBeTruthy();
  });
});
