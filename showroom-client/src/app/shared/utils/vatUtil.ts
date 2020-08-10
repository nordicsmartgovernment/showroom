import {Order, OrderLine} from '../../dashboard/ordering/order-shop/order-shop.component';

export function round(num: number) {
  num = Math.round(num * 100) / 100;
  return num;
}

export function priceIncludingVAT(orderLine: OrderLine): number {
  return round(priceIncludingVATNoRound(orderLine));
}

function priceExcludingVATNoRound(orderLine: OrderLine) {
  return orderLine.amount * orderLine.product.price;
}

function vatNoRound(orderLine: OrderLine) {
  return 1 + orderLine.product.vatRate / 100;
}

function priceIncludingVATNoRound(orderLine: OrderLine) {
  return priceExcludingVAT(orderLine) * vatNoRound(orderLine);
}

export function priceExcludingVAT(orderLine: OrderLine): number {
  return round(priceExcludingVATNoRound(orderLine));
}

export function totalSumInclVAT(order: Order): number {
  let sum = 0;
  for (const orderLine of order.orderLines) {
    sum += priceIncludingVAT(orderLine);
  }
  return round(sum);
}

export function totalSumExclVAT(order: Order): number {
  let sum = 0;
  for (const orderLine of order.orderLines) {
    sum += priceExcludingVAT(orderLine);
  }
  return round(sum);
}
