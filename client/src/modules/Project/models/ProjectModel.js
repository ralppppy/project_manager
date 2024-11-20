import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  projects: [],
  modalOpen: false,

  filter: {
    active: true,
    assignedProjects: true,
  },

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
};

export const ProjectModel = createSlice({
  name: "ProjectModel",
  initialState,
  reducers: {
    setProjects: (state, { payload }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.projects = payload;
    },

    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },

    setFilter: (state, { payload }) => {
      let { type, value } = payload;
      state.filter = { ...state.filter, [type]: value };
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
  setProjects,
  setModalOpen,
  setFilter,
  setRefetchDetails,
  setIsUpdate,
  setUpdateState,
  setModalInfo,
  setPage,
  setSort,
  setSearch,
} = ProjectModel.actions;

export default ProjectModel.reducer;
