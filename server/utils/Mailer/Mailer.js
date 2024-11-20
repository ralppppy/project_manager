const nodemailer = require("nodemailer");
const template = require("./templates/index");
const path = require("path");

const { FROM_EMAIL, FROM_EMAIL_PASS } = require(path.resolve(
  "database",
  "config",
  "environment.js"
));

const initiateTransporter = () => {
  let transporter = nodemailer.createTransport({
    host: "mail.cyon.ch",
    port: 465,
    auth: {
      user: FROM_EMAIL,
      pass: FROM_EMAIL_PASS,
    },
    
    secure: true, // Enable SSL/TLS
    tls: {
      rejectUnauthorized: true, // Enable strict SSL checking
    },
  });

  return transporter;
};

const initiateConfig = (content, sendTo) => {
  let primaryColor = "#bd212d";

  let htmlTemplate = template(content, { primaryColor });

  const config = {
    from: `"noreply" <${FROM_EMAIL}>`, // sender address
    // to: "ralpyosores@gmail.com", // list of receiversalvera.principe@exact-construct.ch
    to: sendTo, // list of receivers
    subject: "Hello ", // Subject line
    html: htmlTemplate, // html body
    attachments: [
      {
        filename: "logo.png",
        path: path.resolve("utils", "Mailer", "assets", "logo.png"),
        cid: "logo",
      },
    ],
  };

  return config;
};

const createMail = async (content, sendTo) => {
  let transporter = initiateTransporter();

  let config = initiateConfig(content, sendTo);
  try {
    const info = await transporter.sendMail(config);

    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { createMail };
