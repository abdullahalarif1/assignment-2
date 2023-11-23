// sub type of user
export type IUsername = {
  firstName: string;
  lastName: string;
};

// sub type of user
export type IUserAddress = {
  street: string;
  city: string;
  country: string;
};

// sub type of user
export type IUserOrders = {
  productName: string;
  price: number;
  quantity: number;
};

// Main type ---->
export type IUser = {
  userId: number;
  username: string;
  password: string;
  fullName: IUsername;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: "Traveling" | "Playing"[];
  address: IUserAddress;
  // orders: IUserOrders[];
};
