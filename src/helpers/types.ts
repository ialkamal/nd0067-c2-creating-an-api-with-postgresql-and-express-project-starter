export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  hash: string;
};

export type Product = {
  id?: number;
  name: string;
  price: string;
  category?: string;
};

export type Order = {
  id: number;
  products: [
    {
      product_id: number;
      quantity: number;
    }
  ];
  user_id: string;
  active_status: boolean; //true for active and false for complete
};
