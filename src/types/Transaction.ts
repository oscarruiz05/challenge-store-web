export interface Transaction {
  product_id: string;
  quantity: number;
  card_token: string;
  acceptance_token: string;
  accept_personal_auth: string;
  customer: {
    name: string;
    last_name: string;
    email: string;
    address: string;
    number_phone: string;
  };
}
