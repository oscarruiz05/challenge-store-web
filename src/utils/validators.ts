import type { FormData, FormErrors } from '@/types/Form';

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateCardExpiry = (expiry: string): { isValid: boolean; message?: string } => {
  const [month, year] = expiry.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
    return { isValid: false, message: "Mes inválido" };
  }
  
  if (parseInt(year) < currentYear || 
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
    return { isValid: false, message: "Tarjeta vencida" };
  }
  
  return { isValid: true };
};

export const validateForm = (formData: FormData, errors: FormErrors): boolean => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = "";
  });
  
  // Card number validation
  if (!formData.cardNumber) {
    errors.cardNumber = "El número de tarjeta es requerido";
    isValid = false;
  } else if (formData.cardNumber.replace(/\s+/g, "").length < 15) {
    errors.cardNumber = "Número de tarjeta inválido";
    isValid = false;
  }
  
  // Expiry validation
  if (!formData.expiry) {
    errors.expiry = "La fecha es requerida";
    isValid = false;
  } else {
    const result = validateCardExpiry(formData.expiry);
    if (!result.isValid) {
      errors.expiry = result.message || "Fecha inválida";
      isValid = false;
    }
  }
  
  // CVC validation
  if (!formData.cvc) {
    errors.cvc = "El CVC es requerido";
    isValid = false;
  } else if (formData.cvc.length < 3) {
    errors.cvc = "CVC inválido";
    isValid = false;
  }
  
  // Card name validation
  if (!formData.cardName) {
    errors.cardName = "El nombre del titular es requerido";
    isValid = false;
  }
  
  // Delivery info validation
  if (!formData.name) {
    errors.name = "El nombre es requerido";
    isValid = false;
  }
  
  if (!formData.email) {
    errors.email = "El correo es requerido";
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = "Correo inválido";
    isValid = false;
  }
  
  if (!formData.address) {
    errors.address = "La dirección es requerida";
    isValid = false;
  }
  
  if (!formData.phone) {
    errors.phone = "El teléfono es requerido";
    isValid = false;
  }
  
  return isValid;
};