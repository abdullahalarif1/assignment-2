import Joi from "joi";

// Subtype for Joi validation
const UsernameValidationSchema = Joi.object({
  firstName: Joi.string().min(1).max(255),
  lastName: Joi.string().min(1).max(255),
});

const UserAddressValidationSchema = Joi.object({
  street: Joi.string().min(1).max(255),
  city: Joi.string().min(1).max(255),
  country: Joi.string().min(1).max(255),
});

//Subtype for Joi validation
const UserOrdersValidationSchema = Joi.object({
  productName: Joi.string().min(1).max(255),
  price: Joi.number(),
  quantity: Joi.number().integer(),
});

// Main Joi validation schema
const UserValidationSchema = Joi.object({
  userId: Joi.number(),
  username: Joi.string().min(1).max(200),
  password: Joi.string().min(1).max(20),
  fullName: UsernameValidationSchema,
  age: Joi.number().integer(),
  email: Joi.string().email().required(),
  isActive: Joi.boolean(),
  hobbies: Joi.array().items(Joi.string()).min(1),
  address: UserAddressValidationSchema,
  orders: Joi.array().items(UserOrdersValidationSchema),

});

export default UserValidationSchema;
