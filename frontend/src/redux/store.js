import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice"; 

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer, 
  },
});
