import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  clients: [],
  modalOpen: false,

  updateState: {},

  isUpdate: false,

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

  addUserClientModalOpen: false,
  passwordStrength: null,
  currentUserClient: {},
  currentUpdateUser: {},
  isUpdatingUser: false,
};

export const ClientModel = createSlice({
  name: "ClientModel",
  initialState,
  reducers: {
    setCurrentUserClient: (state, { payload }) => {
      state.currentUserClient = payload;
    },
    setIsUpdatingUser: (state, { payload }) => {
      state.isUpdatingUser = payload;
    },
    setCurrentUpdateUser: (state, { payload }) => {
      state.currentUpdateUser = payload;
    },

    setPasswordStrength: (state, { payload }) => {
      state.passwordStrength = payload;
    },

    setUserClientModalOpen: (state, { payload }) => {
      state.addUserClientModalOpen = payload;
    },

    setClients: (state, { payload }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.clients = payload;
    },

    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },

    setRefetchDetails: (state, { payload }) => {
      state.refetchDetails = payload;
    },

    setUpdateState: (state, { payload }) => {
      state.updateState = payload;
    },
    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
    },

    setModalInfo: (state, { payload }) => {
      state.modal = { ...payload.modal };
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
export const {
  setClients,
  setModalOpen,
  setFilter,
  setRefetchDetails,
  setIsUpdate,
  setUpdateState,
  setModalInfo,
  setPage,
  setSort,
  setSearch,
  setIsUpdatingUser,
  setUserClientModalOpen,
  setPasswordStrength,
  setCurrentUserClient,
  setCurrentUpdateUser,
} = ClientModel.actions;

export default ClientModel.reducer;
