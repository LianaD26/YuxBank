import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocketsComponent } from './pockets.component';

describe('PocketsComponent', () => {
  let component: PocketsComponent;
  let fixture: ComponentFixture<PocketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
