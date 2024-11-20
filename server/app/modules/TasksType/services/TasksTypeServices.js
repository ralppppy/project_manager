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
