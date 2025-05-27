export const cardPatterns = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/
};

export function getCardType(cardNumber: string | null | undefined): string {
  if (!cardNumber) return 'unknown';
  
  const value = cardNumber.replace(/\s/g, '');
  
  for (const [type, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(value)) {
      return type;
    }
  }
  
  return 'unknown';
}