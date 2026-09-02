import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice";
import languageReducer from "./features/languageSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  language: languageReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
