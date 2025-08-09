import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '@/lib/appwrite/service';

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (thunkAPI) => {
    try {
      return await service.fetchCartItems();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity }, thunkAPI) => {
    try {
      return await service.addToCart({ product, quantity });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ docId, quantity }, thunkAPI) => {
    try {
      return await service.updateQuantity({ docId, quantity });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (docId, thunkAPI) => {
    try {
      await service.removeFromCart(docId);
      return docId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const addedItem = action.payload;
        const idx = state.items.findIndex(i => i.$id === addedItem.$id);
        if (idx >= 0) {
          state.items[idx].quantity = addedItem.quantity;
        } else {
          state.items.push(addedItem);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateQuantityAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedItem = action.payload;
        const idx = state.items.findIndex(i => i.$id === updatedItem.$id);
        if (idx >= 0) state.items[idx].quantity = updatedItem.quantity;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.$id !== action.payload);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
