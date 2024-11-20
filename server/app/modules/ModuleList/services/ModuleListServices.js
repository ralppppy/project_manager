const path = require("path");
const { EP_ModuleTeam } = require(path.resolve("database", "models"));
const sequelize = require("sequelize");

const deleteModuleTeamMember = async (module_team_id) => {
  try {
    let response = await EP_ModuleTeam.destroy({
      where: { id: module_team_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
const deleteModuleTeamMemberProject = async (project_team_id) => {
  try {
    let response = await EP_ModuleTeam.destroy({
      where: { project_team_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const deleteDuplicateTeamMember = async (
  project_team_id,
  module_id,
  user_id
) => {
  try {
    let response = await EP_ModuleTeam.destroy({
      where: { project_team_id, module_id, user_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = {
  deleteModuleTeamMember,
  deleteDuplicateTeamMember,
  deleteModuleTeamMemberProject,
};
