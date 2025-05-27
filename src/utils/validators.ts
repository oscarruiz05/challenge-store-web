interface FormData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
  name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
}

export function validateCardNumber(cardNumber: string | null | undefined): boolean {
  if (!cardNumber) return false;
  
  const value = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(value);
}

export function validateExpiryDate(expiry: string | null | undefined): boolean {
  if (!expiry) return false;
  
  const value = expiry.replace(/[^\d/]/g, '');
  
  let month, year;
  if (value.includes('/')) {
    [month, year] = value.split('/');
  } else {
    month = value.substring(0, 2);
    year = value.substring(2);
  }
  
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return false;
  }
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }
  
  return true;
}

export function validateCVC(cvc: string | null | undefined): boolean {
  if (!cvc) return false;
  return /^\d{3,4}$/.test(cvc);
}

export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateForm(formData: FormData): boolean {
  for (const key in formData) {
    if (!formData[key as keyof FormData]) {
      return false;
    }
  }
  
  if (!validateCardNumber(formData.cardNumber)) {
    return false;
  }
  
  if (!validateExpiryDate(formData.expiry)) {
    return false;
  }
  
  if (!validateCVC(formData.cvc)) {
    return false;
  }
  
  if (!validateEmail(formData.email)) {
    return false;
  }
  
  return true;
}