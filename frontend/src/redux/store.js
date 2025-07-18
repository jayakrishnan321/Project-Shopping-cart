import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice"; 
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import supplierReducer from "./slices/supplierSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer, 
    user: userReducer,
    cart: cartReducer,
    supplier:supplierReducer
  },
});
