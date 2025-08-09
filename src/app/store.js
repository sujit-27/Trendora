import { configureStore } from "@reduxjs/toolkit";

import authReducer from '../features/authSlice'
import cartReducer from '../features/cartSlice'
import wishlistReducer from '../features/wishlistSlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
})