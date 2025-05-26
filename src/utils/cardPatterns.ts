export const cardPatterns: Record<string, RegExp> = {
  visa: /^4/,
  mastercard: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/,
  amex: /^3[47]/,
  diners: /^3(0[0-5]|[68])/,
};
