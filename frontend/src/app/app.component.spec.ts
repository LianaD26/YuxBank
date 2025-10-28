import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component'; // ✅ Cambiar importación

describe('AppComponent', () => { // ✅ Cambiar nombre del describe
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // ✅ Cambiar por AppComponent
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // ✅ Cambiar por AppComponent
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent); // ✅ Cambiar por AppComponent
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, yuxbank');
  });
});