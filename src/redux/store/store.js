import { configureStore } from "@reduxjs/toolkit";
import userReduer from '../userSlice/userSlice.js'
import protectedCheckoutReducer from '../protectedSlice/protectedCheckout.js'
import { userApi } from "../../services/userApi.js";
import { adminApi } from "../../services/adminApi.js";

export const store = configureStore({
    reducer: {
      user:userReduer,
      protectedCheckout:protectedCheckoutReducer,
      [userApi.reducerPath]: userApi.reducer, 
      [adminApi.reducerPath]: adminApi.reducer, 
    },
   
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware).concat(adminApi.middleware),
  });









   // Adding the api middleware enables caching, invalidation, and refetching