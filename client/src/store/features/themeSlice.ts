import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ThemeState {
  mode: "dark" | "light";
}

const initialState: ThemeState = { mode: "light" };

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toogleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.mode = action.payload;
    },
  },
});

export const { toogleTheme, setTheme } = themeSlice.actions;
export const themeSelector = (state: RootState) => state.theme;

export default themeSlice.reducer;
