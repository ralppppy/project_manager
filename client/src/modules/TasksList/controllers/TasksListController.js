import { setSelectedFilter } from "../../Common/models/CommonModel";
import { setStartEndDate } from "../../Timelog/models/TimelogModel";
import { TimelogServices } from "../../Timelog/services";
import { TaskListServices } from "../services";
import { DashboardServices } from "../../Dashboard/services";
import {
  setAddedMember,
  setComment,
  setCommentType,
  setCurrentComment,
  setCurrentCommentParent,
  setDrawerOpen,
  setFilters,
  setIsUpdate,
  setIsView,
  setIsViewingAttachements,
  setModalOpen,
  setReplyToId,
  setToggleCommentingStatus,
  setUpdateData,
  setUnassignedTasksCount,
  setAssignedTasksCount,
  setPointFilter,
} from "../models/TasksListModel";

import dayjs from "dayjs";

const TaskListController = ({
  dispatch,
  user,
  queryClient,
  navigate,
  QUERY_KEY_TASKS,
  organization_id,
  teamList,
  setTeamList,
  form,
  isUpdate,
  messageApi,
  MODULE_TEAM_KEY,
  COMMENT_ATTACHMENT_KEY,
  TASK_COMMENT_KEY,
  TASK_ATTACHMENT,
  isView,
  setOpen,
}) => {
  const {
    getTasksDropdownType,
    createTask,
    getTasksService,
    getTasksDropdownSearch,
    updateTask,
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
  } = TaskListServices();

  const { createTimelogData } = TimelogServices();
  const { getUnassignedTasks } = DashboardServices();

  const handleGetModuleData = async ({ module_id }) => {};

  const bulkInvalidateQueries = () => {
    queryClient.invalidateQueries(["project_summary"]);
    queryClient.invalidateQueries(["module_lists"]);
    queryClient.invalidateQueries(["module_list_users"]);

    queryClient.invalidateQueries(["tasks"]);
    queryClient.invalidateQueries(["task_completion_percent"]);
    queryClient.invalidateQueries(["task_hours"]);
    queryClient.invalidateQueries(["project_task_hours"]);

    queryClient.invalidateQueries(["departments_dashboard"]);
    queryClient.invalidateQueries(["chart_data"]);
    queryClient.invalidateQueries(["unassigned_projects"]);
    queryClient.invalidateQueries(["unassigned_tasks"]);
    queryClient.invalidateQueries(["user_projects"]);
  };

  const handleModalOpen = (
    modalOpen,
    isUpdate = false,
    updateData = null,
    isView = false
  ) => {
    if (modalOpen) {
      dispatch(setIsView(isView));
    }

    if (isUpdate) {
      if (!modalOpen) {
        dispatch(setIsUpdate(false));
        dispatch(setUpdateData({}));

        //need a little delay to remove weird animation when closing the modal on update
        setTimeout(() => {
          const MODULE_TEAM_KEY = ["single_module_team"];
          queryClient.invalidateQueries(MODULE_TEAM_KEY);
        }, 200);
      } else {
        dispatch(setIsUpdate(isUpdate));
        dispatch(setUpdateData(updateData));
      }
    }

    dispatch(setModalOpen(modalOpen));
  };

  const formatDropdownTypeData = (data) => {
    return data?.map((d) => ({
      id: d.id,
      key: `${d.id}`,
      label: d.name,
      color: d?.color,
    }));
  };
  const handleGetTaskTypeDropdown = async (organization_id, type) => {
    let [response, error] = await getTasksDropdownType(
      organization_id,
      `/api/${type}/${type}_dropdown`
    );

    response = formatDropdownTypeData(response.data);

    return response;
  };

  const formatTeam = (team, additionalData, isUpdate) => {
    //organization_id:integer,project_id:integer,client_id:integer,project_role_id:integer,user_id:integer

    let formatedTeam = team?.map((c) => {
      return {
        ...c,
        id: c.new ? undefined : c.id,
        // id: isUpdate ? c.user.id : undefined,
        user_id: c.user_id,
        project_role_id: c.project_role_id,
        new: c.new,
        ...additionalData,
      };
    });

    return [
      formatedTeam?.filter((c) => c.new),
      formatedTeam?.filter((c) => !c.new),
    ];
  };

  const handleCreateOrUpdateTask = async ({
    values,
    additionalData,
    isUpdate,
    task_id,
  }) => {
    let { content, ...rest } = values;

    let [team, oldTeam] = formatTeam(
      rest.team,
      {
        ...additionalData,
        module_id: rest.module_id,
        project_id: rest.project_id,
        client_id: rest.client_id,
      },
      isUpdate
    );

    let instruction = content?.target?.getContent({ format: "html" });

    let newData = {
      ...rest,
      instruction: instruction,
      is_approved: false,
      creator_id: user.id,
      organization_id: user.organization_id,
      connected_to_id: rest.connected_to_id
        ? rest.connected_to_id?.id
        : undefined,
      team,
    };

    let response, error;

    if (isUpdate) {
      [response, error] = await updateTask(newData, task_id);
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["departments_dashboard"]);
      queryClient.invalidateQueries(["chart_data"]);
    } else {
      [response, error] = await createTask({
        ...newData,
        is_time_estimate_approved: false,
      });
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["departments_dashboard"]);
      queryClient.invalidateQueries(["chart_data"]);
    }

    return [response, error, newData, isUpdate, task_id, oldTeam];
  };

  const handleUpdateTeam = async ({ values, task_id, additionalData }) => {
    let [team, oldTeam] = formatTeam(
      values.team,
      {
        ...additionalData,
        module_id: values.module_id,
        project_id: values.project_id,
        client_id: values.client_id,
      },
      true
    );

    let newData = {
      team,
    };

    let [response, error] = await updateTask(newData, task_id);

    if (!error) {
      queryClient.setQueryData(QUERY_KEY_TASKS, (prevData) => {
        let updatedData = prevData?.data?.map((prev) => {
          if (prev.id === task_id) {
            form.setFieldValue("team", [
              ...oldTeam,
              ...response.data?.map((c) => ({
                ...c,
                first_name: c.user.first_name,
                last_name: c.user.last_name,
                projectRoleName: c.project_role.name,
              })),
            ]);

            return {
              ...prev,

              team: [
                ...oldTeam,
                ...response.data?.map((c) => ({
                  ...c,
                  first_name: c.user.first_name,
                  last_name: c.user.last_name,
                  projectRoleName: c.project_role.name,
                })),
              ],
            };
          }

          return prev;
        });

        return { ...prevData, data: updatedData };
      });

      dispatch(setAddedMember(false));

      messageApi.open({
        type: "success",
        content: `Task succesfully updated!`,
      });
      bulkInvalidateQueries();
    }
  };

  const handleUpdateTask = async ({ values, task_id, updateType }) => {
    let [response, error] = await updateTaskInputService(values, task_id);

    queryClient.setQueryData(QUERY_KEY_TASKS, (prevData) => {
      let QUERY_KEY = [];
      let taskData = {};
      if (updateType) {
        QUERY_KEY = [updateType.key, organization_id];

        taskData = queryClient
          .getQueryData(QUERY_KEY)
          .find((taskData) => taskData.id === values[updateType.name]);
      }

      let updatedData = prevData?.data?.map((prev) => {
        if (prev.id === task_id) {
          let updateDataOb = updateType
            ? { [updateType.property]: { ...taskData, name: taskData.label } }
            : {};

          let newUpdateData = {
            ...prev,
            ...values,
            ...updateDataOb,
          };

          dispatch(setUpdateData(newUpdateData));
          return newUpdateData;
        }

        return prev;
      });

      //if task_status is updated
      if (updateType?.property === "task_status") {
        queryClient.invalidateQueries(["task_completion_percent"]);
        queryClient.invalidateQueries(["module_lists"]);
        queryClient.invalidateQueries(["tasks_status_card_key"]);
        queryClient.invalidateQueries(["departments_dashboard"]);
        queryClient.invalidateQueries(["chart_data"]);
      }

      //if time estimate is updated
      if (values.time_estimate) {
        queryClient.invalidateQueries(["task_hours"]);
        queryClient.invalidateQueries(["project_task_hours"]);
        queryClient.invalidateQueries(["departments_dashboard"]);
        queryClient.invalidateQueries(["chart_data"]);
      }

      return { ...prevData, data: updatedData };
    });

    messageApi.open({
      type: "success",
      content: `Task succesfully updated!`,
    });
  };

  const handleGetTasks = async ({
    organization_id,
    client_id,
    project_id,
    module_id,
    paginate,
    filters,
    taskTitleSearch,
    isFeedback,
    isDashboard = false,
    currentUserId,
    isUnassigned,
  }) => {
    let [
      {
        data: { data, totalData },
      },
      error,
    ] = await getTasksService({
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
    });

    let tasks = data?.map((task) => ({
      ...task,
      key: task.id,
      team: task.team
        ? task.team.map((c) => ({
            ...c,
            user_id: c.user.id,
            first_name: c.user.first_name,
            last_name: c.user.last_name,
            projectRoleName: c.project_role.name,
            project_role_id: c.project_role.id,
          }))
        : [],
    }));
    let total = data.length;

    if (isUnassigned) {
      tasks = tasks.filter((task) => task.team.length === 0);
      total = tasks.length;
    }
    isDashboard && handleSetAssignedTasksCount(total);
    isUnassigned && handleSetUnassignedTasksCount(total);

    return { data: tasks, totalData };
  };

  const handleSuccessCreateTask = ([
    response,
    error,
    newData,
    isUpdate,
    task_id,
    oldTeam,
  ]) => {
    if (isUpdate) {
      queryClient.setQueryData(QUERY_KEY_TASKS, (prevData) => {
        let QUERY_KEY_TASK_STATUS = ["tasks_status_dropdown", organization_id];
        let QUERY_KEY_TASK_TYPE = ["tasks_type_dropdown", organization_id];
        let QUERY_KEY_TASK_PRIORITY = [
          "tasks_priority_dropdown",
          organization_id,
        ];

        const taskStatusData = queryClient
          .getQueryData(QUERY_KEY_TASK_STATUS)
          .find((status) => status.id === newData.task_status_id);

        const taskTypeData = queryClient
          .getQueryData(QUERY_KEY_TASK_TYPE)
          .find((type) => type.id === newData.task_type_id);

        const taskPriorityData = queryClient
          .getQueryData(QUERY_KEY_TASK_PRIORITY)
          .find((type) => type.id === newData.task_priority_id);

        let updatedData = prevData?.data?.map((prev) => {
          if (prev.id === task_id) {
            return {
              ...prev,
              ...newData,
              task_status: { ...taskStatusData, name: taskStatusData.label },
              task_type: { ...taskTypeData, name: taskTypeData.label },
              task_priority: {
                ...taskPriorityData,
                name: taskPriorityData.label,
              },
              team: [
                ...oldTeam,
                ...response.data?.map((c) => ({
                  ...c,
                  first_name: c.user.first_name,
                  last_name: c.user.last_name,
                  projectRoleName: c.project_role.name,
                })),
              ],
            };
          }

          return prev;
        });

        return { ...prevData, data: updatedData };
      });

      handleModalOpen(false);
      queryClient.invalidateQueries(["task_completion_percent"]);
      bulkInvalidateQueries();

      messageApi.open({
        type: "success",
        content: `Task succesfully updated!`,
      });
    } else {
      if (!error) {
        handleModalOpen(false);

        queryClient.invalidateQueries(["tasks"]);
        queryClient.invalidateQueries(["task_completion_percent"]);
        queryClient.invalidateQueries(["task_hours"]);
        queryClient.invalidateQueries(["project_task_hours"]);
        bulkInvalidateQueries();
        messageApi.open({
          type: "success",
          content: `Task succesfully created!`,
        });
      }
    }
  };

  const handleSearchTask = async ({
    organization_id,
    client_id,
    project_id,
    module_id,
    search,
  }) => {
    let [response, error] = await getTasksDropdownSearch({
      organization_id,
      client_id,
      project_id,
      module_id,
      search,
    });

    return response.data;
  };

  const handleTaskListFilterChange = ({
    filterState,
    client_id,
    project_id,
    module_id,
  }) => {
    if (filterState) {
      let filterData = filterState.find((c) => {
        return `${c.id}` === `${client_id}`;
      });

      let project = filterData?.children?.find((c) => {
        return `${c.id}` === `${project_id}`;
      });

      if (project) {
        // If project selection filter is all
        if (isNaN(project_id)) {
          dispatch(
            setSelectedFilter({
              parentFilterName: filterData.name,
              childFilterName: "All", //if projected selected is ALL,
              childModuleName: "All",
              selectedFilter: {
                clientId: filterData.id,
                projectId: project.id, //if projected selected is ALL
                moduleId: null,
              },
            })
          );
        } else {
          let moduleId = "";

          if (isNaN(module_id)) {
            moduleId = `${client_id}-${project_id}-${module_id}`;
          } else {
            moduleId = `${module_id}`;
          }

          let moduleData = project?.children?.find((c) => {
            return `${c.id}` === moduleId;
          });

          let childModuleName = moduleData ? moduleData?.label : "All";

          dispatch(
            setSelectedFilter({
              parentFilterName: filterData.name,
              childFilterName: project.name,
              childModuleName: childModuleName,
              selectedFilter: {
                clientId: filterData.id,
                projectId: project.id, //if projected selected is ALL
                moduleId: moduleId,
              },
            })
          );
        }
      } else {
        dispatch(
          setSelectedFilter({
            parentFilterName: "All",
            childFilterName: "All", //if projected selected is ALL,
            childModuleName: "All",
            selectedFilter: {
              clientId: filterData.id,
              projectId: null, //if projected selected is ALL
              moduleId: null,
            },
          })
        );
      }
    }
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    switch (extra.action) {
      case "paginate":
        let { current, pageSize } = pagination;
        const queryParams = new URLSearchParams({
          page: current,
          pageSize: pageSize,
        });

        navigate(`?${queryParams.toString()}`, { replace: true });

        break;
      // case "sort":
      //   if (sorter.order) {
      //     dispatch(
      //       setSort({
      //         field: sorter.field,
      //         order: sorter.order,
      //       })
      //     );
      //   } else {
      //     dispatch(
      //       setSort({
      //         ...initialState.sort,
      //       })
      //     );
      //   }

      //   break;

      default:
        break;
    }
  };

  const handleRemoveMemberFromDb = async (organization_id, task_team_id) => {
    let [response, error] = await deleteMemberService(
      organization_id,
      task_team_id
    );

    return [response, error];
  };

  const handleAddMember = ({ key }) => {
    let newTeam = form.getFieldValue("team") || [];

    if (isView) {
      dispatch(setAddedMember(true));
    }
    bulkInvalidateQueries();
    queryClient.setQueryData(MODULE_TEAM_KEY, (prevData) => {
      let teamMember = prevData?.find((c) => parseInt(c.id) === parseInt(key));
      teamMember = { ...teamMember, new: true };
      newTeam = [...newTeam, teamMember];

      form.setFieldValue("team", newTeam);
      return prevData.filter((c) => parseInt(c.id) !== parseInt(key));
    });
  };

  const handleRemoveMemberFromList = (data) => {
    bulkInvalidateQueries();
    queryClient.setQueryData(MODULE_TEAM_KEY, (prevData) => {
      let prevTeam = form.getFieldValue("team") || [];

      prevData.push(data);

      prevTeam = prevTeam.filter((c) => parseInt(c.id) !== parseInt(data.id));
      form.setFieldValue("team", prevTeam);

      return prevData;
    });
  };

  const handleRemoveMember = async ({ data, task_id }) => {
    if (isUpdate) {
      // console.log(isUpdate, data, task_id, "sdfsdfsdfsdfsdf");
      let [response, error] = await handleRemoveMemberFromDb(
        organization_id,
        data.id
      );
      if (!error) {
        handleRemoveMemberFromList(data);

        queryClient.setQueryData(QUERY_KEY_TASKS, (prevData) => {
          let updatedData = prevData?.data?.map((prev) => {
            if (parseInt(prev.id) === parseInt(task_id)) {
              let prevTeam = form.getFieldValue("team") || [];

              prevTeam = prevTeam.filter(
                (c) => parseInt(c.id) !== parseInt(data.id)
              );
              return {
                ...prev,
                team: prevTeam,
              };
            }
            return prev;
          });
          return { ...prevData, data: updatedData };
        });
        // queryClient.invalidateQueries(["tasks"]);

        messageApi.open({
          type: "success",
          content: `${data.first_name} ${data.last_name} was removed as a team member`,
        });
        bulkInvalidateQueries();
      }
    } else {
      handleRemoveMemberFromList(data);
    }
  };

  const handleUpdateMemberOnUpdate = (team) => {
    queryClient.setQueryData(MODULE_TEAM_KEY, (prevData) => {
      return team;
    });
  };

  const handleSetFilters = (filters) => {
    dispatch(setFilters(filters));
  };

  const handleCreateComment = async ({ params, TASK_COMMENT_KEY }) => {
    let [response, error] = await createTaskCommentService(params);
    if (!error) {
      queryClient.setQueryData(TASK_COMMENT_KEY, (prevData = []) => {
        if (params.reply_to_id) {
          prevData = prevData.map((c) => {
            if (c.id === params.reply_to_id) {
              let newReplies = c.replies || [];

              newReplies = [...newReplies, response.data];
              // newReplies.push(response.data);

              return { ...c, replies: newReplies };
            }

            return c;
          });
        } else {
          prevData = [...prevData, response.data];
        }
        dispatch(setToggleCommentingStatus());

        dispatch(setComment(""));
        dispatch(setReplyToId(null));
        return prevData;
      });
    }
  };
  const handleGetComments = async (params) => {
    let [response, error] = await getTaskCommentService(params);

    return response.data;
  };

  const handleDrawerState = (
    isOpen,
    commentData,
    isViewing = false,
    commentParent,
    isInternal
  ) => {
    dispatch(setDrawerOpen(isOpen));
    dispatch(setCurrentComment(commentData));
    dispatch(setCurrentCommentParent(commentParent));
    dispatch(setIsViewingAttachements(isViewing));
    dispatch(setCommentType(isInternal));
  };

  const handleGetCommentAttachment = async ({
    comment_id,
    task_id,
    isCommentAttachment,
  }) => {
    let [response, error] = await getCommentAttachments(
      comment_id,
      task_id,
      isCommentAttachment
    );

    return response.data;
  };

  const handleSuccessUploadFile = ({ data, isCommentAttachment }) => {
    queryClient.setQueryData(COMMENT_ATTACHMENT_KEY, (prev) => {
      let newData = {
        id: data.data.id,
        file_name: data.data.file_name,
        file_type: data.data.file_type,
        uploader_id: parseInt(data.data.uploader_id),
        comment_id: parseInt(data.data.comment_id),
        comment: data.data.comment,
      };

      prev = [newData, ...prev];

      //Update the task comment data when uploading is from a comment, this code will update the attachment count of that comment
      if (isCommentAttachment) {
        console.log(TASK_COMMENT_KEY, "TASK_COMMENT_KEY");
        queryClient.setQueryData(TASK_COMMENT_KEY, (commentsPrev) => {
          //If selected comment is a child of a comment
          if (newData.comment.reply_to_id) {
            // if (currentCommentParentData) {
            let newCommentPrev = commentsPrev.map((c) => {
              if (c.id === newData.comment.reply_to_id) {
                let newReplies = c.replies.map((reply) => {
                  if (reply.id === newData.comment_id) {
                    return { ...reply, attachmentsCount: prev?.length };
                  }

                  return reply;
                });

                return { ...c, replies: newReplies };
              }

              return c;
            });

            return newCommentPrev;
          } else {
            let newCommentPrev = commentsPrev.map((c) => {
              if (c.id === newData.comment_id) {
                return { ...c, attachmentsCount: prev?.length };
              }

              return c;
            });

            return newCommentPrev;
          }
        });

        queryClient.setQueryData(TASK_ATTACHMENT, (taskAttachment) => {
          taskAttachment = [newData, ...taskAttachment];

          return taskAttachment;
        });
      }

      messageApi.open({
        type: "success",
        content: `File succesfully uploaded!`,
      });
      return prev;
    });
  };

  const handleImagePaste = async ({
    file,
    params,
    currentCommentData,
    currentCommentParentData,
    mutate,
    isCommentAttachment,
  }) => {
    // Handle the pasted image file, e.g., upload it to your server or display it.
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file); // 'file' should match the backend's file field name
    const queryParams = new URLSearchParams(params);

    let uploadUrl = `/api/files?${queryParams.toString()}`;
    // Send the POST request using Axios
    let [response, error] = await uploadFileService(uploadUrl, formData);

    if (!error) {
      mutate({
        data: response,
        currentCommentData,
        currentCommentParentData,
        isCommentAttachment,
      });
    }

    // console.log("Pasted image:", file);
  };

  const handlePaste = ({
    event,
    params,
    currentCommentData,
    currentCommentParentData,
    mutate,
    isCommentAttachment,
  }) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;

    for (const item of items) {
      if (item.kind === "file" && item.type.includes("image")) {
        const file = item.getAsFile();
        handleImagePaste({
          file,
          params,
          currentCommentData,
          currentCommentParentData,
          mutate,
          isCommentAttachment,
        });
      }
    }
  };

  const handleDeleteFile = async ({
    itemData: {
      id: attachmentId,
      file_name,
      file_type,
      comment_id,
      uploader_id,
      comment,
    },
  }) => {
    // return;

    let reply_to_id = comment?.reply_to_id;

    let [response, error] = await deleteFileService(
      attachmentId,
      file_name,
      file_type
    );

    queryClient.setQueryData(COMMENT_ATTACHMENT_KEY, (prev) => {
      prev = prev.filter((c) => attachmentId !== c.id);

      queryClient.setQueryData(TASK_COMMENT_KEY, (taskCommentPrev) => {
        if (reply_to_id) {
          let newCommentPrev = taskCommentPrev.map((c) => {
            if (c.id === reply_to_id) {
              let newReplies = c.replies.map((reply) => {
                if (reply.id === comment_id) {
                  return {
                    ...reply,
                    attachmentsCount: reply.attachmentsCount - 1,
                  };
                }

                return reply;
              });

              return { ...c, replies: newReplies };
            }

            return c;
          });

          return newCommentPrev;
        } else {
          let newCommentPrev = taskCommentPrev.map((comment) => {
            if (comment.id === comment_id) {
              return {
                ...comment,
                attachmentsCount: comment.attachmentsCount - 1,
              };
            }

            return comment;
          });

          return newCommentPrev;
        }
      });
      messageApi.open({
        type: "success",
        content: `File succesfully deleted!`,
      });

      queryClient.setQueryData(TASK_ATTACHMENT, (taskAttachment) => {
        taskAttachment = taskAttachment.filter((c) => attachmentId !== c.id);

        return taskAttachment;
      });

      return prev;
    });
  };

  const handleGetTaskHoursWorked = async ({ organization_id, task_id }) => {
    let [response, error] = await getTasksHoursWorkedService({
      organization_id,
      task_id,
    });

    return response;
  };

  const generateTasksQueryKey = (
    { isDashboard, isFeedback },
    selectedFilter,

    { modId, projId, clientId }
  ) => {
    let module_id, project_id, client_id;

    if (isDashboard || isFeedback) {
      let { moduleId, projectId, clientId } = selectedFilter;
      module_id = `${moduleId}`;
      project_id = `${projectId}`;
      client_id = `${clientId}`;
    } else {
      module_id = modId;
      project_id = projId;
      client_id = clientId;
    }

    module_id = isFeedback ? "All" : module_id;

    return { client_id, project_id, module_id };
  };

  const handleOpenChange = (open) => {
    setOpen(open);
  };

  const handleAddTimelog = async ({
    values,
    task,
    user,
    organization_id,
    form,
  }) => {
    let { timelog_date, timelog_start, timelog_end } = values;

    if (!timelog_date || !timelog_start || !timelog_end) {
      messageApi.open({
        type: "error",
        content: `Invalid Start Time or End Time!`,
      });
      return;
    } else if (timelog_start >= timelog_end) {
      messageApi.open({
        type: "error",
        content: `Invalid Start Time or End Time!`,
      });
      return;
    }

    let { user_id } = user;

    let {
      client: { id: client_id },
      id,
      project: { id: project_id },
      module_id,
    } = task;

    let start_time = dayjs(timelog_start).format("HH:mm");
    let end_time = dayjs(timelog_end).format("HH:mm");

    let [startHour, startMin] = start_time.split(":");
    let [endHour, endMin] = end_time.split(":");
    let start_date = dayjs
      .utc(timelog_date)
      .set("hour", startHour)
      .set("minute", startMin)
      .toISOString();
    let end_date = dayjs
      .utc(timelog_date)
      .set("hour", endHour)
      .set("minute", endMin)
      .toISOString();

    //hours_worked in seconds
    let hours_worked = dayjs(end_date).diff(dayjs(start_date)) / 1000;

    let params = {
      organization_id,
      client_id,
      project_id,
      module_id,
      task_id: id,
      start_date,
      end_date,
      hours_worked,
      user_id,
    };

    let [{ data }, error] = await createTimelogData(params);

    if (!error) {
      // ;
      queryClient.setQueryData(["hours_worked", task.id, true], (prevData) => {
        data = {
          ...data,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        };
        let newTimelogData = [data, ...prevData.data];

        messageApi.open({
          type: "success",
          content: `Timelog added!`,
        });

        handleOpenChange(false);

        form?.resetFields();
        return {
          ...prevData,
          data: newTimelogData,
        };
      });
    } else {
      messageApi.open({
        type: "error",
        content: error,
      });
    }
  };

  const handleDeleteTask = async ({ organization_id, task }) => {
    let [response, error] = await deleteTaskService({
      organization_id,
      taskId: task.id,
    });

    return [response, error];
  };

  const handleNavigateToTimeLog = async (timeLogPath, { date_plotted }) => {
    let startDate = dayjs
      .utc(date_plotted, "DD-MM-YYYY")
      .startOf("day")
      .toISOString();
    let endDate = dayjs
      .utc(date_plotted, "DD-MM-YYYY")
      .endOf("day")
      .toISOString();
    dispatch(setStartEndDate({ startDate, endDate }));
    // window.open(timeLogPath, "_blank");
    navigate(timeLogPath, { target: "_blank" });
  };

  const handleDeleteComment = async ({
    item,
    organization_id,
    TASK_COMMENT_KEY,
    isReply,
  }) => {
    let [response, error] = await deleteCommentService({
      comment_id: item.id,
      organization_id,
      commenter_id: item.commenter.id,
    });

    if (!error) {
      queryClient.setQueryData(TASK_COMMENT_KEY, (taskCommentPrev) => {
        messageApi.open({
          type: "success",
          content: "Comment deleted!",
        });

        if (isReply) {
          let newPrevComment = taskCommentPrev.map((c) => {
            if (c.id === item.reply_to_id) {
              let newReply = c.replies.filter((reply) => reply.id !== item.id);

              return { ...c, replies: newReply };
            }

            return c;
          });

          return newPrevComment;
        }

        return taskCommentPrev.filter((c) => c.id !== item.id);
      });
    }
  };

  const handleDeleteTaskCommentAndAttachment = async ({
    organization_id,
    task_id,
    deleteToken,
  }) => {
    let [response, error] = await deleteTaskCommentAndAttachmentService({
      organization_id,
      task_id,
      deleteToken,
    });
    return [response, error];
  };

  const handleGetUnassignedTasksCount = async (organization_id) => {
    let total = 0;
    let [response, error] = await getUnassignedTasks({
      organization_id,
    });

    response.data?.map((c) => {
      total += c.open_tasks;
    });

    handleSetUnassignedTasksCount(total);

    return total;
  };

  const handleSetAssignedTasksCount = (count) => {
    dispatch(setAssignedTasksCount(count));
  };
  const handleSetUnassignedTasksCount = (count) => {
    dispatch(setUnassignedTasksCount(count));
  };

  const handleSetPointFilter = (value) => {
    dispatch(setPointFilter(value));
  };

  return {
    handleGetModuleData,
    handleModalOpen,
    handleGetTaskTypeDropdown,
    handleCreateOrUpdateTask,
    handleGetTasks,
    handleSuccessCreateTask,
    handleSearchTask,
    handleTaskListFilterChange,
    onTableChange,
    handleAddMember,
    handleRemoveMember,
    handleRemoveMemberFromDb,
    handleUpdateMemberOnUpdate,
    handleSetFilters,
    handleCreateComment,
    handleGetComments,
    handleDrawerState,
    handleGetCommentAttachment,
    handleSuccessUploadFile,
    handleImagePaste,
    handlePaste,
    handleDeleteFile,
    handleUpdateTask,
    handleUpdateTeam,
    handleGetTaskHoursWorked,
    generateTasksQueryKey,
    handleAddTimelog,
    handleOpenChange,
    handleDeleteTask,
    handleNavigateToTimeLog,
    handleDeleteComment,
    handleDeleteTaskCommentAndAttachment,
    handleGetUnassignedTasksCount,
    handleSetUnassignedTasksCount,
    handleSetPointFilter,
  };
};

export default TaskListController;
