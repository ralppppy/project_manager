import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

export const LoginModel = createSlice({
  name: "LoginModel",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      let { client, employee, ...rest } = payload || {};
      let extraInfo = payload?.employee ? payload?.employee : payload?.client;
      delete extraInfo.id;

      state.user = { ...rest, ...extraInfo };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = LoginModel.actions;

export default LoginModel.reducer;
