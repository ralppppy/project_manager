const path = require("path");
const Op = require("sequelize").Op;
const {
  createToken,
  encryptText,
} = require("../../AuthModule/services/AuthServices");
const dayjs = require("dayjs");
const randomstring = require("randomstring");

const {
  get,
  getOne,
  update,
  create,
  getExistingByColumn,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
const { validationResult } = require("express-validator");

const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));
const { FormatMilliseconds } = require(path.resolve(
  "utils",
  "FormatMilliseconds.js"
));

const { createMail } = require(path.resolve("utils", "Mailer", "Mailer.js"));
const SetPassword = require(path.resolve(
  "utils",
  "Mailer",
  "templates",
  "SetPassword.js"
));

const { EP_User, EP_Employee, EP_ClientUser } = require(path.resolve(
  "database",
  "models"
));

// Example controller method
const handleGetOrganizationUsers = async (req, res) => {
  let { organization_id } = req.params;
  let { paginate, sort, search } = req.query;

  let pagingation = paginate
    ? {
        ...paginate,
      }
    : null;

  let sortFormat = {
    descend: "DESC",
    ascend: "ASC",
  };

  let sorting = sort ? [[sort.field, sortFormat[sort.order]]] : null;

  let searchData = {};
  let searchDataEmployeeDepartment = {};

  if (search.searchIndex === "employee") {
    if (search.s) {
      searchDataEmployeeDepartment = {
        where: {
          name: {
            [Op.like]: `%${search.s}%`,
          },
        },
      };
    }
  } else {
    if (search && search.s) {
      searchData = {
        [search.searchIndex]: {
          [Op.like]: `%${search.s}%`,
        },
      };
    }
  }

  let [users, error] = await get(
    EP_User,
    { organization_id, ...searchData },
    sorting,
    {
      exclude: [
        "password",
        "verification_token",
        "active_security",
        "createdAt",
        "updatedAt",
      ],
    },
    pagingation,
    {
      include: [
        {
          required: true,
          association: EP_User.employee,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              // required: true,
              association: EP_Employee.department,
              attributes: ["id", "name", "color"],
              ...searchDataEmployeeDepartment,
            },
          ],
        },
      ],
    },
    {
      include: [
        {
          required: true,
          association: EP_User.employee,
          attributes: [],
          include: [
            {
              // required: true,
              association: EP_Employee.department,
              attributes: [],
              ...searchDataEmployeeDepartment,
            },
          ],
        },
      ],
    }
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleGetAllOrganizationUserDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    EP_User,
    { organization_id },
    null,
    ["id", "first_name", "last_name"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

const handleGetOrganizationUser = async (req, res) => {
  let { id, organization_id } = req.params;

  let [users, error] = await getOne(EP_User, { id, organization_id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const formatUserFormData = (data, organization_id) => {
  let {
    first_name,
    last_name,
    email,
    verification_token,
    is_employee,
    password,
    ...rest
  } = data;

  let connectedModel = is_employee ? "employee" : "client";

  data = {
    first_name,
    last_name,
    email,
    organization_id,
    is_employee,
    sort: 0,
    password,
    active_security: true,
    is_active: true,
    verification_token,
    [connectedModel]: { ...rest },
  };

  return data;
};

const sendSetPasswordEmail = async (response) => {
  let { first_name, last_name, email } = response;

  // const expirationMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 hours in milliseconds
  // const expirationMilliseconds = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const expirationMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds

  let token = await createToken(response.dataValues, {
    expiresIn: expirationMilliseconds,
  });

  let content = SetPassword({
    first_name,
    last_name,
    token,
    expiresInText: FormatMilliseconds(expirationMilliseconds),
  });
  let sendTo = email;
  await createMail(content, sendTo);
};

const handleCreateUser = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).send(formatResponse(false, null, errors));
  }

  let data = req.body;

  let { organization_id } = req.params;

  let randomStringToken = randomstring.generate();

  data = { ...data, verification_token: randomStringToken };

  data = formatUserFormData(data, organization_id);

  let [response, error] = await create(EP_User, data, null, {
    include: [{ association: EP_User.employee }],
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res.status(409).send(formatResponse(false, null, "Email Already exist!"));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    sendSetPasswordEmail(response);

    res.json(formatResponse(true, response));
  }
};

const handleCreateUserClient = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).send(formatResponse(false, null, errors));
  }

  let data = req.body;

  let { organization_id } = req.params;

  let encryptedPassword = encryptText(data.password);

  data = { ...data, password: encryptedPassword };

  data = formatUserFormData(data, organization_id);

  let [response, error] = await create(EP_User, data, null, {
    include: [{ association: EP_User.client }],
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res.status(409).send(formatResponse(false, null, "Email Already exist!"));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateUser = async (req, res) => {
  let { id, organization_id } = req.params;
  let data = req.body;

  data = formatUserFormData(data, organization_id);
  delete data?.employee?.id;

  let [response, error] = await update(EP_User, data, { id });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res.status(409).send(formatResponse(false, null, "Email Already exist!"));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    let [responseEmployee, errorEmployee] = await update(
      EP_Employee,
      data.employee,
      {
        user_id: id,
      }
    );

    if (errorEmployee) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, response));
    }
  }
};

const handleSendEmail = async (req, res) => {
  await createMail();
  res.json("OW");
};

const handleGetClientUsers = async (req, res) => {
  let { organization_id, client_id } = req.params;

  let [clients, error] = await get(
    EP_ClientUser,
    { client_id },
    null,
    [
      "id",
      ["id", "key"],
      "client_id",
      "phone_number",
      "country",
      "zip_code",
      "street_nr",
      "city",
    ],
    null,

    {
      include: [
        {
          required: true,
          association: EP_ClientUser.user,
          attributes: ["id", "first_name", "last_name", "email", "is_active"],
        },
      ],
    }
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

module.exports = {
  handleGetOrganizationUsers,
  handleGetOrganizationUser,
  handleGetAllOrganizationUserDropdown,
  handleCreateUser,
  handleUpdateUser,
  handleSendEmail,
  handleGetClientUsers,
  handleCreateUserClient,
};
