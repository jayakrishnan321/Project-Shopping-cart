import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api'; // adjust path to match your folder structure

// Thunk to add a product to the cart
export const usercart = createAsyncThunk(
    'cart/add',
    async ({ id, email }, thunkAPI) => {
        try {
            const res = await API.post('/cart/add', {
                productId: id,
                email: email,
            });
            return res.data; // assuming { message, updatedCart }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Thunk to fetch cart items for a user
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (email, thunkAPI) => {
        try {
            const res = await API.get(`/cart/${email}`);
              console.log("Fetched cart data:", res.data); 
            return res.data; // assuming { cart: [...] }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);
export const increaseQuantity = createAsyncThunk(
  'cart/increase',
  async (itemId, thunkAPI) => {
    try {
      const res = await API.put(`/cart/increase/${itemId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  'cart/decrease',
  async (itemId, thunkAPI) => {
    try {
      const res = await API.put(`/cart/decrease/${itemId}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
export const removeitemcart=createAsyncThunk(
    'cart/removeitem',
    async({id},thunkAPI)=>{
        try{
             const res=await API.delete(`/cart/delete/${id}`)
             return res.data
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(usercart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usercart.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.items = action.payload.updatedCart || state.items; // optional
            })
            .addCase(usercart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
            })

            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
