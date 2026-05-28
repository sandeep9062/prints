// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "@/services/authApi";
import { productsApi } from "@/services/productsApi";
import { userApi } from "@/services/userApi";
import { contactApi } from "@/services/contactApi";
import { cartApi } from "@/services/cartApi";
import { ordersApi } from "@/services/ordersApi";
import { customizationApi } from "@/services/customizationApi";
import { blogApi } from "@/services/blogApi";
import { mediaApi } from "@/services/mediaApi";
import { siteSettingsApi } from "@/services/siteSettingsApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [customizationApi.reducerPath]: customizationApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [siteSettingsApi.reducerPath]: siteSettingsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      contactApi.middleware,
      productsApi.middleware,
      userApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      customizationApi.middleware,
      blogApi.middleware,
      mediaApi.middleware,
      siteSettingsApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
