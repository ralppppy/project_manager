import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  modalOpen: false,
  currectSelectedData: {
    client_id: 0,
    project_id: 0,
  },

  paginate: {
    pageSize: 10,
    page: 1,
  },
  errors: { project_id: false, client_id: false, module_id: false },

  search: {
    s: "",
    searchIndex: "",
  },
  isUpdate: false,

  updateData: {},

  filters: null,
  taskTitleSearch: "",

  isView: false,
  comment: "",
  reply_to_id: null,

  commentingStatus: false,
  drawerOpen: false,
  currentCommentData: {},
  currentCommentParentData: {},
  isViewingAttachements: false,
  isCommentInternal: true,
  addedMember: false,

  assignedTasksCount: 0,
  unassignedTasksCount: 0,
  pointFilter: 0,
};

export const TasksListModel = createSlice({
  name: "TasksListModel",
  initialState,
  reducers: {
    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },

    setCommentType: (state, { payload }) => {
      state.isCommentInternal = payload;
    },

    setAddedMember: (state, { payload }) => {
      state.addedMember = payload;
    },

    setCurrentComment: (state, { payload }) => {
      state.currentCommentData = payload;
    },
    setCurrentCommentParent: (state, { payload }) => {
      state.currentCommentParentData = payload;
    },

    setDrawerOpen: (state, { payload }) => {
      state.drawerOpen = payload;
    },

    setTastTitleSearch: (state, { payload }) => {
      state.taskTitleSearch = payload;
    },

    setFilters: (state, { payload }) => {
      state.filters = payload;
    },

    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
    },

    setUpdateData: (state, { payload }) => {
      state.updateData = payload;
    },

    setErrors: (state, { payload }) => {
      state.errors = { ...state.errors, ...payload };
    },

    setCurrentSelectedData: (state, { payload }) => {
      state.currectSelectedData = payload;
    },
    setPage: (state, { payload }) => {
      state.paginate.page = payload;
    },

    setIsView: (state, { payload }) => {
      state.isView = payload;
    },
    setComment: (state, { payload }) => {
      state.comment = payload;
    },

    setReplyToId: (state, { payload }) => {
      state.reply_to_id = payload;
    },

    setToggleCommentingStatus: (state, { payload }) => {
      state.commentingStatus = !state.commentingStatus;
    },

    setIsViewingAttachements: (state, { payload }) => {
      state.isViewingAttachements = payload;
    },

    setAssignedTasksCount: (state, { payload }) => {
      state.assignedTasksCount = payload;
    },
    setUnassignedTasksCount: (state, { payload }) => {
      state.unassignedTasksCount = payload;
    },

    setPointFilter: (state, { payload }) => {
      state.pointFilter = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setModalOpen,
  setCurrentSelectedData,
  setErrors,
  setIsUpdate,
  setUpdateData,
  setFilters,
  setTastTitleSearch,
  setIsViewingTask,
  setIsView,
  setComment,
  setReplyToId,
  setToggleCommentingStatus,
  setDrawerOpen,
  setCurrentComment,
  setIsViewingAttachements,
  setCurrentCommentParent,
  setAddedMember,
  setCommentType,
  setAssignedTasksCount,
  setUnassignedTasksCount,
  setPointFilter,
} = TasksListModel.actions;

export default TasksListModel.reducer;
