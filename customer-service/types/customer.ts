export interface Address {
  id: string;
  customerId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  wishlist: string[]; // Array of product IDs
  createdAt: Date;
  updatedAt: Date;
}
