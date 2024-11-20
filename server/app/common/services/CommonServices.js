const sequelize = require("sequelize");
const formatWhereOptions = (where) => {
  return typeof where === "object"
    ? { where }
    : {
        where: {
          id: where,
        },
      };
};

const formatAttributes = (returns) => {
  return returns ? { attributes: returns } : {};
};

const count = async (model, where, countExtra) => {
  try {
    // Deal with where statements
    let whereOption = formatWhereOptions(where);

    // Construct the options object by spreading whereOption
    let options = {
      ...whereOption,
      ...countExtra,
    };

    let response = await model.findOne({
      ...options,
      attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "total"]],
    });
    // Call the count method on the model, passing the options object
    // let response = await model.count(options);

    return [options.raw ? response.total : response.dataValues.total, null];
  } catch (error) {
    // If an error occurs, return null as the count response and the error object
    return [null, error];
  }
};

const get = async (
  model,
  where = {},
  order = [["id", "ASC"]],
  returns = null,
  paginate = null,
  extra = {},
  countExtra = {}
) => {
  try {
    let options = {};
    let paginateOption = {};
    let totalData = 0;

    let whereOption = formatWhereOptions(where);

    /**Deal with attributes */
    let attributes = formatAttributes(returns);

    /**Deal with where pagination */
    if (paginate && typeof paginate === "object") {
      let { page, pageSize } = paginate;

      let limit = parseInt(pageSize);

      let offset = (page - 1) * pageSize;

      paginateOption = {
        limit,
        offset,
      };

      let [total, error] = await count(
        model,
        {
          ...whereOption.where,
        },
        countExtra
      );

      totalData = total;
    }

    options = {
      order,
      ...whereOption,
      ...attributes,
      ...paginateOption,
      ...extra,
    };

    let response = await model.findAll(options);

    if (paginate && typeof paginate === "object") {
      return [{ data: response, totalData }, null];
    }

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
const getOne = async (model, where, returns = null, extra = {}) => {
  try {
    let options = {};
    let whereOption = formatWhereOptions(where);

    /**Deal with attributes */
    let attributes = formatAttributes(returns);

    options = {
      ...whereOption,
      ...attributes,
      ...extra,
    };

    let response = await model.findOne(options);

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const create = async (model, data, returns = null, extra = {}) => {
  try {
    let attributes = formatAttributes(returns);
    let response = await model.create(data, {
      ...attributes,
      ...extra,
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const bulkCreate = async (model, data, returns = null, extra = {}) => {
  try {
    let attributes = formatAttributes(returns);

    let response = await model.bulkCreate(data, {
      ...attributes,
      ...extra,
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const update = async (model, data, where, extra = {}) => {
  try {
    let whereOption = formatWhereOptions(where);

    options = {
      ...whereOption,
      ...extra,
    };

    let response = await model.update(data, options);

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const upsert = async (model, data, returns = null, extra = {}) => {
  try {
    let attributes = formatAttributes(returns);

    let response = await model.upsert(data, {
      ...attributes,
      ...extra,
    });

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const destroy = async (model, where, extra = {}) => {
  try {
    let whereOption = formatWhereOptions(where);

    options = {
      ...whereOption,
      ...extra,
    };

    let response = await model.destroy(options);

    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

const getExistingByColumn = async (model, column, value) => {
  try {
    let count = await model.count({
      where: {
        [column]: value,
      },
    });

    return [count > 0, null];
  } catch (error) {
    return [null, error];
  }
};

module.exports = {
  get,
  getOne,
  count,
  update,
  destroy,
  create,
  bulkCreate,
  getExistingByColumn,
  upsert,
};
