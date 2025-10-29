import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentServicesComponentComponent } from './payment-services-component.component';

describe('PaymentServicesComponentComponent', () => {
  let component: PaymentServicesComponentComponent;
  let fixture: ComponentFixture<PaymentServicesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentServicesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentServicesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
