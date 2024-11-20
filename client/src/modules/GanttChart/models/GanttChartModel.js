import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  startDate: "",
  endDate: "",
  modulesDropdownFilter: [],
  usersDropdownFilter: [],
  usersDropdownFilterSelected: [],
  filterResourcesWithEvents: false,
  filterModalOpen: false,
  summaryModalOpen: false,
};

export const GanttChartModel = createSlice({
  name: "GanttChartModel",
  initialState,
  reducers: {
    setStartEndDate: (state, { payload: { startDate, endDate } }) => {
      state.startDate = startDate;
      state.endDate = endDate;
    },

    setSummaryModalOpen: (state, { payload }) => {
      state.summaryModalOpen = payload;
    },

    setFilterModalOpen: (state, { payload }) => {
      state.filterModalOpen = payload;
    },

    setModules: (state, { payload }) => {
      state.modulesDropdownFilter = payload;
    },
    setUsers: (state, { payload }) => {
      state.usersDropdownFilterSelected = payload;
    },
    setUsersDropdownFilter: (state, { payload }) => {
      state.usersDropdownFilter = payload;
    },
    setFilterToggleResourcesWithEvents: (state, { payload }) => {
      state.filterResourcesWithEvents = !state.filterResourcesWithEvents;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setStartEndDate,
  setModules,
  setUsers,
  setUsersDropdownFilter,
  setFilterToggleResourcesWithEvents,
  setFilterModalOpen,
  setSummaryModalOpen,
} = GanttChartModel.actions;

export default GanttChartModel.reducer;
