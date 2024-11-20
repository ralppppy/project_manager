// const UserService = require("../services/UserService");

// Example controller method
const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs");

const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));
const { EP_User, EP_TaskComment, EP_File } = require(path.resolve(
  "database",
  "models"
));

const { get, getOne, create, destroy } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));

const uploadFilePathImages = path.resolve("public", "images");
const uploadFilePathFile = path.resolve("public", "files");

const generateRandomFileName = (originalFileName) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8); // Generates a random string of length 6

  const formattedDate = dayjs(timestamp).format("DD-MM-YYYY");

  const randomFileName = `${timestamp}_${formattedDate}_${randomString}`;

  return randomFileName;
};

const isImageFile = (filename) => {
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "tiff",
  ];

  const fileExtension = filename.split(".").pop().toLowerCase();

  return imageExtensions.includes(fileExtension);
};

const handleSaveFileToDb = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const { name } = req.files.file;

  let nameSplit = name.split(".");

  let fileExtention = nameSplit[nameSplit.length - 1];

  let file_name = `${generateRandomFileName()}.${fileExtention}`;

  let file_type = isImageFile(file_name) ? "images" : "files";

  let data = {
    ...req.query,
    file_name,
    file_type,
  };

  let [response, error] = await create(EP_File, data, [
    "id",
    "file_name",
    "file_type",
    "uploader_id",
    "comment_id",
  ]);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    let [comment, _] = await getOne(
      EP_TaskComment,
      { id: response.comment_id },
      ["reply_to_id"]
    );

    let newResponse = { ...response.dataValues, comment };

    let fullFilePath = path.resolve(
      isImageFile(file_name) ? uploadFilePathImages : uploadFilePathFile,
      file_name
    );

    req.files.file.mv(fullFilePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      let fullFilePath = path.resolve(
        isImageFile(file_name) ? uploadFilePathImages : uploadFilePathFile,
        file_name
      );

      req.files.file.mv(fullFilePath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(formatResponse(true, newResponse));
      });
    });
  }

  // console.log(req.query);

  // return res.json(req.query);
};

const handleGetCommentFiles = async (req, res) => {
  let { comment_id } = req.params;

  let [response, error] = await get(
    EP_File,
    { comment_id },
    [["createdAt", "DESC"]],
    ["id", "file_name", "file_type", "uploader_id", "comment_id"],
    null,
    {
      include: [
        {
          association: EP_File.comment,
          attributes: ["reply_to_id"],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleGetTaskFiles = async (req, res) => {
  let { task_id } = req.params;

  let [response, error] = await get(
    EP_File,
    { task_id },
    [["createdAt", "DESC"]],
    ["id", "file_name", "file_type", "uploader_id", "comment_id"],
    null,
    {
      include: [
        {
          association: EP_File.comment,
          attributes: ["reply_to_id"],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteAttachment = async (req, res) => {
  let { attachment_id } = req.params;

  let { fileName, fileType } = req.query;

  let [response, error] = await destroy(EP_File, { id: attachment_id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    let fullFilePath = path.resolve(
      fileType === "images" ? uploadFilePathImages : uploadFilePathFile,
      fileName
    );

    if (fs.existsSync(fullFilePath)) {
      //Remove the file in the file system
      fs.unlink(fullFilePath, (err) => {
        if (err) return res.status(500).send(err);

        res.json(formatResponse(true, response));
      });
    } else {
      res.json(formatResponse(true, response));
    }
  }
};

module.exports = {
  handleSaveFileToDb,
  handleGetCommentFiles,
  handleDeleteAttachment,
  handleGetTaskFiles,
};
