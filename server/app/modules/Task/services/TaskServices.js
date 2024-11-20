const path = require("path");
const { EP_ModuleTeam } = require(path.resolve("database", "models"));
const sequelize = require("sequelize");

const deleteModuleTeamMember = async (user_project_id) => {
  try {
    let response = await EP_ModuleTeam.destroy({
      where: { project_team_id: user_project_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const deleteDuplicateTeamMember = async (project_team_id, module_id) => {
  try {
    let response = await EP_ModuleTeam.destroy({
      where: { project_team_id, module_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = { deleteModuleTeamMember, deleteDuplicateTeamMember };
