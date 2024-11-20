import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  holidays: [],
  modalOpen: false,

  isUpdate: false,

  paginate: {
    pageSize: 10,
    page: 1,
  },
  sort: {
    field: "createdAt",
    order: "descend",
  },
  search: {
    s: "",
    searchIndex: "",
  },
};

export const HolidayModel = createSlice({
  name: "HolidayModel",
  initialState,
  reducers: {
    setHolidays: (state, { payload }) => {
      state.holidays = payload;
    },

    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },

    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
    },

    setPage: (state, { payload }) => {
      state.paginate.page = payload;
    },

    setSort: (state, { payload }) => {
      state.sort = payload;
    },

    setSearch: (state, { payload }) => {
      state.search = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setHolidays,
  setModalOpen,
  setFilter,
  setIsUpdate,
  setPage,
  setSort,
  setSearch,
} = HolidayModel.actions;

export default HolidayModel.reducer;
