import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);
export const initialState = {
  filterDataOptions: ["All"],
  filterStatusOptions: ["All"],
  search: "",
  filterDate: {
    start: "",
    end: "",
  },
  startDate: dayjs.utc().startOf("day").toISOString(),
  endDate: dayjs.utc().endOf("day").toISOString(),
};

export const TimelogModel = createSlice({
  name: "TimelogModel",
  initialState,
  reducers: {
    setStartEndDate: (state, { payload: { startDate, endDate } }) => {
      state.startDate = startDate;
      state.endDate = endDate;
    },

    setFilterDataOptions: (state, { payload }) => {
      state.filterDataOptions = payload;
    },
    setFilterStatusOptions: (state, { payload }) => {
      state.filterStatusOptions = payload;
    },

    setSearchValue: (state, { payload }) => {
      state.search = payload;
    },
    setFilterDate: (state, { payload }) => {
      state.filterDate.start = payload.start;
      state.filterDate.end = payload.end;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFilterDataOptions,
  setSearchValue,
  setFilterDate,
  setFilterStatusOptions,
  setStartEndDate,
} = TimelogModel.actions;

export default TimelogModel.reducer;
