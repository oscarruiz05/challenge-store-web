export interface Card {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface ResponseCard {
  status: string;
  data: DataCard;
}

export interface DataCard {
  id: string;
  created_at: string;
  brand: string;
  name: string;
  last_four: string;
  bin: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
  expires_at: string;
  validity_ends_at: string;
  validity_starts_at: string;
}
