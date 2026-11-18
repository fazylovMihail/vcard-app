import { authApi } from "@/features/auth/authApi";
import { projectsApi } from "@/features/projects/projectsApi";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import themeSlice from "@/features/theme/themeSlice";

const reducer = {
  [projectsApi.reducerPath]: projectsApi.reducer,
  [authApi.reducerPath]: projectsApi.reducer,
  [themeSlice.name]: themeSlice.reducer,
};

export const makeStore = () => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(projectsApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
