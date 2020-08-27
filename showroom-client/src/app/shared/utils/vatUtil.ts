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

export function priceIncludingVAT(orderLine: OrderCalc, buyerCountry?: string, sellerCountry?: string): number {
  let shouldIncludeVat = true;
  if (buyerCountry && sellerCountry) {
    shouldIncludeVat = vatDetailsBetweenTwoCountries(buyerCountry, sellerCountry).includeVat;
  }
  if (shouldIncludeVat) {
    return round(priceIncludingVATNoRound(orderLine));
  } else {
    return round(priceExcludingVATNoRound(orderLine));
  }
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

export function totalSumInclVAT(order: Order, buyerCountry?: string, sellerCountry?: string): number {
  let sum = 0;
  for (const orderLine of order.orderLines) {
    const orderCalc = orderLineToCalc(orderLine);
    sum += priceIncludingVAT(orderCalc, buyerCountry, sellerCountry);
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

const EU_COUNTRY_CODES = [
  'BE', 'EL', 'LT', 'PT', 'BG', 'ES', 'LU', 'RO', 'CZ',
  'FR', 'HU', 'SI', 'DK', 'HR', 'MT', 'SK', 'DE', 'IT',
  'NL', 'FI', 'EE', 'CY', 'AT', 'SE', 'IE', 'LV', 'PL',
];

function isInTheEU(country: string): boolean {
  return EU_COUNTRY_CODES.includes(country);
}

export interface VatDetails {
  vatCode?: string;
  includeVat: boolean;
}

export function vatDetailsBetweenTwoCountries(buyerCountry: string, sellerCountry: string): VatDetails {
  if (sellerCountry !== buyerCountry) {
    if (isInTheEU(sellerCountry) && isInTheEU(buyerCountry)) {
      return {
        vatCode: 'AE',
        includeVat: false,
      };
    } else {
      return {
        includeVat: false,
      };
    }
  } else {
    return {
      vatCode: 'S',
      includeVat: true,
    };
  }
}
