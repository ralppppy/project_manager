import { createSlice } from "@reduxjs/toolkit";

let clientProjFilter = localStorage.getItem("clientProjFilter");

const initialState = {
  selectedFilter: clientProjFilter
    ? JSON.parse(clientProjFilter).selectedFilter
    : { clientId: "All", projectId: "All", moduleId: "ALL" },
  parentFilterName: clientProjFilter
    ? JSON.parse(clientProjFilter).parentFilterName
    : "All",
  childFilterName: clientProjFilter
    ? JSON.parse(clientProjFilter).childFilterName
    : "All",
  childModuleName: clientProjFilter
    ? JSON.parse(clientProjFilter).childModuleName
    : "All",
};

export const CommonModel = createSlice({
  name: "CommonModel",
  initialState,
  reducers: {
    setSelectedFilter: (state, { payload }) => {
      let {
        parentFilterName,
        childFilterName,
        childModuleName,
        selectedFilter,
      } = payload;

      state.parentFilterName = parentFilterName;
      state.childFilterName = childFilterName;
      state.childModuleName = childModuleName;

      let newSelectedFilter = {
        ...selectedFilter,
        projectId: selectedFilter.projectId ? selectedFilter.projectId : "All",
        moduleId: selectedFilter.moduleId ? selectedFilter.moduleId : "All",
      };

      state.selectedFilter = newSelectedFilter;

      localStorage.setItem(
        "clientProjFilter",
        JSON.stringify({
          parentFilterName,
          childFilterName,
          childModuleName,
          selectedFilter: {
            ...newSelectedFilter,
          },
        })
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedFilter } = CommonModel.actions;

export default CommonModel.reducer;
