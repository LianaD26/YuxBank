import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchBarComponent } from './serch-bar.component';

describe('SerchBarComponent', () => {
  let component: SerchBarComponent;
  let fixture: ComponentFixture<SerchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
