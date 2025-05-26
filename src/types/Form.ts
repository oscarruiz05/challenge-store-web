export interface FormData {
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

export interface FormErrors {
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

export interface PaymentData {
  product_id: string;
  quantity: number;
  card_token: string;
  last_four: string;
  acceptance_token: string;
  accept_personal_auth: string;
  customer: {
    name: string;
    last_name: string;
    email: string;
    address: string;
    number_phone: string;
  };
  product?: any;
}