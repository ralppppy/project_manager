const path = require("path");
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const {
  get,
  bulkCreate,
  create,
  count,
  destroy,
  update,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { EP_Holidays } = require(path.resolve("database", "models"));

const handleCreateHoliday = async (req, res) => {
  const { organization_id } = req.params;
  let { params } = req.body;

  let [response, error] = await create(EP_Holidays, params, {
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleGetHoliday = async (req, res) => {
  const { organization_id } = req.params;
  let { paginate } = req.query;

  let pagination = paginate
    ? {
        ...paginate,
      }
    : null;

  let [response, error] = await get(
    EP_Holidays,
    { organization_id },
    null,
    [
      "id",
      "holiday_id_text",
      "holiday_type_id",
      "organization_id",
      "instruction",
    ],
    paginate
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

module.exports = {
  handleGetHoliday,
  handleCreateHoliday,
};
