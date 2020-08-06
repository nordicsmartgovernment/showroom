import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShopSelectionComponent } from './order-shop-selection.component';

describe('OrderShopSelectionComponent', () => {
  let component: OrderShopSelectionComponent;
  let fixture: ComponentFixture<OrderShopSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderShopSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShopSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
