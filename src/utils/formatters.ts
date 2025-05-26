export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length > 0) {
    return cleanValue.match(new RegExp('.{1,4}', 'g'))!.join(' ');
  }
  
  return cleanValue;
};

export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length > 2) {
    return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
  }
  
  return cleanValue;
};