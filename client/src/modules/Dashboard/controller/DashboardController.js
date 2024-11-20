import DashboardServices from "../services/DashboardServices";

const DashboardController = () => {
  const {
    getTasksStatusWithCount,
    getDashboardUsers,
    getUserProjects,
    getUnassignedTasks,
    getUnassignedProjects,
    getChartData,
    getTasklistPopover,
  } = DashboardServices();

  const handleGetTasklistPopover = async (
    organization_id,
    user_id,
    project_id
  ) => {
    let [response, error] = await getTasklistPopover({
      organization_id,
      user_id,
      project_id,
    });

    let tasks = response.data?.map((task) => ({
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

    return tasks;
    // return response.data;
  };

  const handleGetChartData = async (organization_id) => {
    let [response, error] = await getChartData({
      organization_id,
    });

    return response.data;
  };
  const handleGetUnassignedProjects = async (organization_id) => {
    let [response, error] = await getUnassignedProjects({
      organization_id,
    });

    return response.data;
  };

  const handleGetUnassignedTasks = async (organization_id) => {
    let [response, error] = await getUnassignedTasks({
      organization_id,
    });

    return response.data;
  };

  const handleGetUserProjects = async (organization_id, user_id) => {
    let [response, error] = await getUserProjects({
      organization_id,
      user_id,
    });

    return response.data;
  };

  const handleGetDashboardUsers = async (organization_id) => {
    let [response, error] = await getDashboardUsers({
      organization_id,
    });

    return response.data;
  };

  const handleGetTasksStatusWithCount = async ({
    organization_id,
    selectedFilter,
    isFeedback,
  }) => {
    let [response, error] = await getTasksStatusWithCount({
      organization_id,
      selectedFilter,
      isFeedback,
    });
    return response;
  };

  return {
    handleGetTasksStatusWithCount,
    handleGetDashboardUsers,
    handleGetUserProjects,
    handleGetUnassignedTasks,
    handleGetUnassignedProjects,
    handleGetChartData,
    handleGetTasklistPopover,
  };
};

export default DashboardController;
