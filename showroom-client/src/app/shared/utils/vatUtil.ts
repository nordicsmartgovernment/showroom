import {Order, OrderLine} from '../../dashboard/ordering/order.component';

export interface OrderCalc {
  price: number;
  vatRate: number;
  amount: number;
}

export function round(num: number) {
  num = Math.round(num * 100) / 100;
  return num;
}

export function priceIncludingVAT(orderLine: OrderCalc): number {
  return round(priceIncludingVATNoRound(orderLine));
}

function priceExcludingVATNoRound(orderLine: OrderCalc) {
  return orderLine.amount * orderLine.price;
}

function vatNoRound(orderLine: OrderCalc) {
  return 1 + orderLine.vatRate / 100;
}

function priceIncludingVATNoRound(orderLine: OrderCalc) {
  return priceExcludingVAT(orderLine) * vatNoRound(orderLine);
}

export function priceExcludingVAT(orderLine: OrderCalc): number {
  return round(priceExcludingVATNoRound(orderLine));
}

export function totalSumInclVAT(order: Order): number {
  let sum = 0;
  for (const orderLine of order.orderLines) {
    sum += priceIncludingVAT((orderLineToCalc(orderLine)));
  }
  return round(sum);
}

export function totalSumExclVAT(order: Order): number {
  let sum = 0;
  for (const orderLine of order.orderLines) {
    sum += priceExcludingVAT(orderLineToCalc(orderLine));
  }
  return round(sum);
}

export function orderLineToCalc(orderLine: OrderLine): OrderCalc {
  return {
    amount: orderLine.amount,
    vatRate: orderLine.product.vatRate,
    price: orderLine.product.price,
  };
}
