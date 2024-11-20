const path = require("path");
const { EP_Project, EP_ProjectTeam, EP_ProjectVersion } = require(path.resolve(
  "database",
  "models"
));
const sequelize = require("sequelize");

const getProjectDetails = async (organization_id) => {
  try {
    let projectDetails = await EP_Project.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("*")), "totalProjects"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN active = 0 THEN 1 ELSE 0 END")
          ),
          "inactiveProjects",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN active = 1 THEN 1 ELSE 0 END")
          ),
          "activeProjects",
        ],
      ],
      where: {
        organization_id,
      },
    });

    return [projectDetails, null];
  } catch (error) {
    return [null, error];
  }
};

const deleteTeamMember = async (user_team_id) => {
  try {
    let response = await EP_ProjectTeam.destroy({
      where: { id: user_team_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
const deleteVersion = async (user_team_id) => {
  try {
    let response = await EP_ProjectVersion.destroy({
      where: { id: user_team_id },
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = { getProjectDetails, deleteTeamMember, deleteVersion };
