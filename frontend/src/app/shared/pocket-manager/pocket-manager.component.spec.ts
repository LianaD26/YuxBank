import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocketManagerComponent } from './pocket-manager.component';

describe('PocketManagerComponent', () => {
  let component: PocketManagerComponent;
  let fixture: ComponentFixture<PocketManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PocketManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PocketManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
