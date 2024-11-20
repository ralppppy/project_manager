import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  primaryColor: "#bd212d",
  tempColor: "#bd212d",

  background: localStorage.getItem("background")
    ? JSON.parse(localStorage.getItem("background"))
    : {
        color: "#fff",
        borderColor: "#f0f0f0",
        colorShow: "#fff",
        textColor: "rgba(0, 0, 0, 0.88)",
      },
};

export const Global = createSlice({
  name: "Global",
  initialState,
  reducers: {
    setPrimaryColor: (state, { payload }) => {
      state.primaryColor = payload;
    },
    setTempColor: (state, { payload }) => {
      state.tempColor = payload;
    },

    setBackgroundColor: (state, { payload }) => {
      state.background = payload;

      localStorage.setItem("background", JSON.stringify(payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPrimaryColor, setTempColor, setBackgroundColor } =
  Global.actions;

export default Global.reducer;
