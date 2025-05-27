export function formatCardNumber(value: string | null | undefined): string {
  if (!value) return '';
  
  const v = value.replace(/\D/g, '');
  
  const formatted = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  return formatted;
}

export function formatExpiryDate(value: string | null | undefined): string {
  if (!value) return '';
  
  const v = value.replace(/\D/g, '');
  
  if (v.length > 2) {
    return `${v.substring(0, 2)}/${v.substring(2)}`;
  }
  
  return v;
}