import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShopSelectionComponent } from './purchase-shop-selection.component';

describe('OrderShopSelectionComponent', () => {
  let component: PurchaseShopSelectionComponent;
  let fixture: ComponentFixture<PurchaseShopSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShopSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShopSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
