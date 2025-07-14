import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice"; 
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer, 
    user: userReducer
  },
});
