import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import service from "@/lib/appwrite/service";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, thunkAPI) => {
    try {
      return await service.fetchWishlist(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      return await service.addToWishlist({ userId, productId });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (docId, thunkAPI) => {
    try {
      await service.removeFromWishlist(docId);
      return docId;  // return deleted docId to update store
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name:"wishlist",
  initialState:{
    items:[],
    status:'idle',
    error:null,
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchWishlist.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchWishlist.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.items = action.payload;
    })
    .addCase(fetchWishlist.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    })
    .addCase(addToWishlist.fulfilled, (state, action) => {
      const doc = action.payload;
      if(!state.items.find(i => i && i.productId === doc.productId)){
        state.items.push(doc);
      }
    })
    .addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.items = state.items.filter(i => i.$id !== action.payload);
    })
    .addMatcher(
      action => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected'),
      (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      }
    )
  }
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
