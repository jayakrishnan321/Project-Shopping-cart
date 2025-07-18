

import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  supplierInfo: JSON.parse(sessionStorage.getItem("supplierInfo")) || null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSupplierInfo: (state, action) => {
      state.supplierInfo = action.payload;
      sessionStorage.setItem("supplierInfo", JSON.stringify(action.payload));
    },
    clearSupplierInfo: (state) => {
      state.supplierInfo = null;
      sessionStorage.removeItem("supplierInfo");
    },
  },
});



export const { setSupplierInfo, clearSupplierInfo } = supplierSlice.actions;
export default supplierSlice.reducer;



