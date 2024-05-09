import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "vi",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.theme = state.language === "vi" ? "en" : "vi";
    },
  },
});

export const { toggleLanguage } = languageSlice.actions;

export default languageSlice.reducer;
