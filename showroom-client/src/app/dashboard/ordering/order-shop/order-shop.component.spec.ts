import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShopComponent } from './order-shop.component';

describe('OrderShopComponent', () => {
  let component: OrderShopComponent;
  let fixture: ComponentFixture<OrderShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
