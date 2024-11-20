// const UserService = require("../services/UserService");

// Example controller method

const path = require("path");
const { validationResult } = require("express-validator");

const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));
const { EP_User, EP_Employee } = require(path.resolve("database", "models"));

const { getOne, update } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));
const {
  verifyEncryptedText,
  createToken,
  encryptText,
} = require("../services/AuthServices");

const { verifyToken } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware.js"
));

const { createMail } = require(path.resolve("utils", "Mailer", "Mailer.js"));

const { FormatMilliseconds } = require(path.resolve(
  "utils",
  "FormatMilliseconds.js"
));

const SetPassword = require(path.resolve(
  "utils",
  "Mailer",
  "templates",
  "SetPassword.js"
));
const randomstring = require("randomstring");
const { Op } = require("sequelize");

const login = async (req, res) => {
  let { email, password } = req.body;
  let where = { email };
  let [response, error] = await getOne(EP_User, where, null, {
    include: [
      {
        association: EP_User.employee,
        attributes: ["id"],
      },
      {
        association: EP_User.client,
        attributes: ["id", "client_id"],
      },
    ],
  });

  if (error) return res.json(formatResponse(false, null));
  if (!response)
    return res.json(formatResponse(false, null, "Email Doesn't Exists !"));

  let isPasswordVerified = verifyEncryptedText(password, response.password);

  if (!isPasswordVerified)
    return res
      .status(400)
      .send(formatResponse(false, null, "Invalid Email or Password !"));

  delete response.dataValues.password;

  let tokenValues = {
    id: response.dataValues.id,
    email: response.dataValues.email,
    first_name: response.dataValues.first_name,
    last_name: response.dataValues.last_name,
    is_employee: response.dataValues.is_employee,
    acitve: response.dataValues.acitve,
    employee: response.dataValues.employee,
    client: response.dataValues.client,
  };

  let token = await createToken(tokenValues);
  let maxAge = 2 * 24 * 60 * 60 * 1000; // 24 hours

  res.cookie("token", token, { maxAge, httpOnly: true });

  res.json(formatResponse(true, response));
};

const verifyUserToken = async (req, res) => {
  let [response, error] = await getOne(
    EP_User,
    { id: req.user.id },
    { exclude: ["password", "verification_token", "reset_password_token"] },

    {
      include: [
        {
          association: EP_User.employee,
          include: [
            {
              association: EP_Employee.menu_access,
            },
          ],
        },
        {
          association: EP_User.client,
        },
      ],
    }
  );

  res.json(formatResponse(true, response));
};

const logout = (req, res) => {
  res.clearCookie("token");
  return res.json(formatResponse(true, true));
};

const verifySetPasswordToken = async (req, res) => {
  const authorizationHeader = req.headers["authorization"];

  const [_, token] = authorizationHeader.split(" ");

  let [decoded, error] = verifyToken(token);
  let { id, verification_token } = decoded;

  let [user, userError] = await getOne(
    EP_User,
    {
      id,
      verification_token,
    },
    ["id"]
  );

  if (error) {
    return res.status(401).send(formatResponse(false, null, error));
  } else {
    if (!user) {
      return res.status(401).send(formatResponse(false, null, error));
    } else {
      return res.json(formatResponse(true, decoded));
    }
  }
};

const updatePassword = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).send(formatResponse(false, null, errors));
  }

  let { email, id } = req.user;

  let { currentPassword, password, confirm } = req.body;

  let [userData, error] = await getOne(
    EP_User,
    {
      id,
      email,
    },
    ["password", "id", "email"],
    {
      raw: true,
    }
  );

  let isCurrentPasswordVerified = verifyEncryptedText(
    currentPassword,
    userData.password
  );

  if (!isCurrentPasswordVerified) {
    return res
      .status(400)
      .send(formatResponse(false, null, "Current password is incorrect!"));
  }

  //Update the password
  let encryptedPassword = encryptText(password);

  let [updateResponse, updateError] = await update(
    EP_User,
    {
      password: encryptedPassword,
    },
    {
      id: userData.id,
      email: userData.email,
    }
  );

  if (updateError) {
    return res.status(401).send(formatResponse(false, null, error));
  } else {
    return res.json(formatResponse(true, null, updateResponse));
  }
};

const setPassword = async (req, res) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).send(formatResponse(false, null, errors));
  }

  const authorizationHeader = req.headers["authorization"];

  const { password } = req.body;

  const [_, token] = authorizationHeader.split(" ");

  let [decoded, error] = verifyToken(token);

  if (error) {
    return res.status(401).send(formatResponse(false, null, error));
  }

  let { id, first_name, last_name, email, organization_id } = decoded;

  let [user, userError] = await getOne(
    EP_User,
    {
      id,
      first_name,
      last_name,
      email,
      organization_id,
    },
    ["id"]
  );

  if (user) {
    let encryptedPassword = encryptText(password);
    let [userUpdate, userUpdateError] = await update(
      EP_User,
      { password: encryptedPassword, verification_token: null },
      {
        id: user.id,
      }
    );

    if (userUpdateError) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, userUpdate));
    }
  } else {
    res.json(formatResponse(false, null));
  }
};

const sendSetPasswordEmail = async (response) => {
  let { first_name, last_name, email } = response;

  const expirationMilliseconds = 30 * 60 * 1000; // 30 minutes in milliseconds

  let token = await createToken(response, {
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

const sendEmailToRecoverAccount = async (req, res) => {
  let { email } = req.body;

  let [response, error] = await getOne(
    EP_User,
    {
      email,
    },
    { exclude: ["password", "reset_password_token"] }
  );

  if (response) {
    let randomStringToken = randomstring.generate();

    let [_, __] = await update(
      EP_User,
      { verification_token: randomStringToken },
      { email: response.email }
    );

    let newResponse = {
      ...response.dataValues,
      verification_token: randomStringToken,
    };

    sendSetPasswordEmail(newResponse);

    return res.json(formatResponse(true, "Email send"));
  }

  return res.json(formatResponse(true, "Email send"));
};

module.exports = {
  logout,
  login,
  verifyUserToken,
  verifySetPasswordToken,
  setPassword,
  sendEmailToRecoverAccount,
  updatePassword,
};
