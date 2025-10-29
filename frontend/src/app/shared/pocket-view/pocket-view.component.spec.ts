import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocketViewComponent } from './pocket-view.component';

describe('PocketViewComponent', () => {
  let component: PocketViewComponent;
  let fixture: ComponentFixture<PocketViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocketViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
