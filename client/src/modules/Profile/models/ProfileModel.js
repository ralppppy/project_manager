import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardHeight: 0,
  profileInfoModal: false,
};

export const ProfileModel = createSlice({
  name: "ProfileModel",
  initialState,
  reducers: {
    setCardHeight: (state, { payload }) => {
      state.cardHeight = payload;
    },

    setProfileInfoModal: (state, { payload }) => {
      state.profileInfoModal = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCardHeight, setProfileInfoModal } = ProfileModel.actions;

export default ProfileModel.reducer;
