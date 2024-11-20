import axios from "axios";

const API_PATH = "/api/tasks_list/";
const API_TASK_PATH = "/api/tasks";
const TaskListServices = () => {
  const getSingleModule = async (module_id) => {
    try {
      let organization_id = params.organization_id;
      let id = params.id;

      delete params.organization_id;
      let response = await axios.put(
        `${API_PATH}/${organization_id}/${id}`,
        params
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const createTask = async (params) => {
    try {
      let response = await axios.post(`${API_TASK_PATH}`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const createTaskCommentService = async (params) => {
    try {
      let response = await axios.post(
        `${API_TASK_PATH}/comment/${params.organization_id}`,
        params
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getTaskCommentService = async (params) => {
    try {
      let { organization_id, task_id, ...rest } = params;
      let response = await axios.get(
        `${API_TASK_PATH}/comment/${organization_id}/${task_id}`,
        {
          params: { ...rest },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const updateTask = async (params, task_id) => {
    try {
      let response = await axios.put(`${API_TASK_PATH}/${task_id}`, params);

      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  };

  const updateTaskInputService = async (params, task_id) => {
    try {
      let response = await axios.put(
        `${API_TASK_PATH}/input/${task_id}`,
        params
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getTasksDropdownType = async (organization_id, apiPath = "") => {
    try {
      let response = await axios.get(`${apiPath}/${organization_id}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getTasksService = async ({
    organization_id,
    client_id,
    project_id,
    module_id,
    paginate,
    filters,
    taskTitleSearch,
    isFeedback,
    isDashboard,
    currentUserId,
  }) => {
    try {
      let response = await axios.get(
        `${API_TASK_PATH}/${organization_id}/${client_id}/${project_id}/${module_id}`,
        {
          params: {
            paginate,
            filters,
            taskTitleSearch,
            isFeedback,
            isDashboard,
            currentUserId,
          },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getTasksDropdownSearch = async ({
    organization_id,
    client_id,
    project_id,
    module_id,
    search,
  }) => {
    try {
      ///api/tasks/dropdown/1/3/3/29?search=re
      let response = await axios.get(
        `${API_TASK_PATH}/dropdown/${organization_id}/${client_id}/${project_id}/${module_id}`,
        { params: { search } }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteMemberService = async (organization_id, team_task_id) => {
    try {
      let response = await axios.delete(
        `${API_TASK_PATH}/delete_member/${organization_id}/${team_task_id}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteTaskService = async ({ organization_id, taskId }) => {
    try {
      let response = await axios.delete(
        `${API_TASK_PATH}/${organization_id}/${taskId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteCommentService = async ({
    organization_id,
    comment_id,
    commenter_id,
  }) => {
    try {
      let response = await axios.delete(
        `${API_TASK_PATH}/delete_comment/${organization_id}/${comment_id}`,
        {
          params: { commenter_id },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const deleteTaskCommentAndAttachmentService = async ({
    organization_id,
    task_id,
    deleteToken,
  }) => {
    try {
      let response = await axios.delete(
        `${API_TASK_PATH}/delete_comment_and_attachment/${organization_id}/${task_id}`,
        {
          headers: {
            Authorization: `Bearer ${deleteToken}`,
          },
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getCommentAttachments = async (
    comment_id,
    task_id,
    isCommentAttachment
  ) => {
    //  ///api/files/comment/7

    let apiPath = isCommentAttachment
      ? `/api/files/comment/${comment_id}`
      : `/api/files/task/${task_id}`;
    try {
      let response = await axios.get(apiPath);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const uploadFileService = async (uploadUrl, formData) => {
    try {
      let response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file upload
        },
      });

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const deleteFileService = async (attachmentId, fileName, fileType) => {
    try {
      let response = await axios.delete(`/api/files/${attachmentId}`, {
        params: { fileName, fileType },
      });

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getTasksHoursWorkedService = async ({ organization_id, task_id }) => {
    try {
      let response = await axios.get(
        `${API_TASK_PATH}/hours_worked/${organization_id}/${task_id}`
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    getTasksDropdownType,
    createTask,
    updateTask,
    getTasksService,
    getTasksDropdownSearch,
    deleteMemberService,
    createTaskCommentService,
    getTaskCommentService,
    getCommentAttachments,
    uploadFileService,
    deleteFileService,
    updateTaskInputService,
    getTasksHoursWorkedService,
    deleteTaskService,
    deleteCommentService,
    deleteTaskCommentAndAttachmentService,
  };
};

export default TaskListServices;
