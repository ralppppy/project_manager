import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  modules: [],
  updateModuleState: {},
  isUpdate: false,
  modalOpen: false,
  selectedClientId: 0,
  selectedProjectId: 0,
  paginate: {
    pageSize: 10,
    page: 1,
  },
  search: {
    s: "",
  },
};

export const ModuleListModel = createSlice({
  name: "ModuleListModel",
  initialState,
  reducers: {
    setSearchValue: (state, { payload }) => {
      state.search.s = payload;
    },
    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
    },
    setUpdateModuleState: (state, { payload }) => {
      state.updateModuleState = payload;
    },
    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },
    setSelectedClientId: (state, { payload }) => {
      state.selectedClientId = payload;
    },
    setSelectedProjectId: (state, { payload }) => {
      state.selectedProjectId = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsUpdate,
  setUpdateModuleState,
  setModalOpen,
  setSelectedClientId,
  setSelectedProjectId,
  setSearchValue,
} = ModuleListModel.actions;

export default ModuleListModel.reducer;
