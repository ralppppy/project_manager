import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  utilities: {
    modalOpen: false,
  },
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

export const ExactPlaceTableModel = createSlice({
  name: "ExactPlaceTableModel",
  initialState,
  reducers: {
    LIST: (state, data) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.clients = data;
    },
    insertClient: (state, data) => {
      data = { ...data, key: data.id };
      state.clients.push(data);
    },
    setModalOpen: (state, { payload }) => {
      state.utilities.modalOpen = payload;
    },

    setPageSize: (state, { payload }) => {},
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
export { initialState };
export const { LIST, setModalOpen, insertClient, setPage, setSort, setSearch } =
  ExactPlaceTableModel.actions;

export default ExactPlaceTableModel.reducer;
