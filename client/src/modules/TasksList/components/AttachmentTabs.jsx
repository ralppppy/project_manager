import { Image, List, Popconfirm, Spin, Tabs, Typography } from "antd";
import React from "react";
import { TaskListController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

import {
  InboxOutlined,
  FileImageOutlined,
  CloseCircleFilled,
  FileOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import { Link } from "react-router-dom";

import Masonry from "react-responsive-masonry";
import "./styles.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
const allowedFileTypes = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
  "tiff",

  // Documents
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "txt",

  // Data Files
  "csv",
  "json",
  "xml",

  // Archives
  "zip",
  "rar",

  // Web Files
  "html",
  "css",
  "js",

  // Audio/Video Files
  "mp3",
  "mp4",
  "avi",

  // Database Files
  "sql",

  // Miscellaneous
  "md",
  "log",
];

const allowedMimeTypes = allowedFileTypes.map((ext) => `.${ext}`).join(",");

const { Text } = Typography;

const { Dragger } = Upload;

const props = (
  params,
  mutate,
  currentCommentData,
  currentCommentParentData,
  isCommentAttachment
) => {
  const queryParams = new URLSearchParams(params);

  return {
    name: "file",
    multiple: true,
    action: `/api/files?${queryParams.toString()}`,
    accept: allowedMimeTypes,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        mutate({
          data: info.file.response,
          currentCommentData,
          currentCommentParentData,
          isCommentAttachment,
        });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,

    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
  };
};

const tabs = [
  {
    title: "Images",
    Icon: FileImageOutlined,
    component: (
      data,
      title,
      isFetching,
      deleteAttacmentMutation,

      userId
    ) => {
      if (isFetching) {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <Spin />
          </div>
        );
      }

      if (data) {
        return (
          <Masonry columnsCount={2} gutter="10px">
            {data
              ?.filter(
                (image) => image.file_type.toLowerCase() === title.toLowerCase()
              )
              ?.map((image, i) => (
                <div key={image.id} style={{ position: "relative" }}>
                  <div className="overlay" />

                  {userId === image.uploader_id && (
                    <Popconfirm
                      title="Delete the attachment"
                      description="Are you sure to delete this attachment?"
                      onConfirm={() =>
                        deleteAttacmentMutation({
                          itemData: image,
                        })
                      }
                      placement="bottomLeft"
                      okText="Yes"
                      cancelText="No"
                    >
                      <CloseCircleFilled
                        style={{
                          fontSize: 15,
                          position: "absolute",
                          top: 2,
                          right: 2,
                          zIndex: 1000,
                          cursor: "pointer",
                          color: "#ff4d4d",
                        }}
                      />
                    </Popconfirm>
                  )}

                  <Image
                    key={i}
                    src={`/public/${image.file_type}/${image.file_name}`}
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
              ))}
          </Masonry>
        );
      }
      return <></>;
    },
  },
  {
    title: "Files",
    Icon: FileOutlined,
    component: (
      data,
      title,
      isFetching,
      deleteAttacmentMutation,

      userId
    ) => {
      if (isFetching) {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <Spin />
          </div>
        );
      }
      if (data) {
        return (
          <>
            <List
              dataSource={data?.filter(
                (image) => image.file_type.toLowerCase() === title.toLowerCase()
              )}
              renderItem={(item) => (
                <List.Item className="d-flex justify-content-between align-items-center">
                  <Link
                    to={`/public/${item.file_type}/${item.file_name}`}
                    target="_blank"
                    download
                  >
                    {item.file_name}
                  </Link>
                  {userId === item.uploader_id && (
                    <Popconfirm
                      title="Delete the attachment"
                      description="Are you sure to delete this attachment?"
                      onConfirm={() =>
                        deleteAttacmentMutation({
                          itemData: item,
                        })
                      }
                      placement="bottomLeft"
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <CloseCircleFilled
                        style={{
                          fontSize: 15,

                          cursor: "pointer",
                          color: "#ff4d4d",
                        }}
                      />
                    </Popconfirm>
                  )}

                  {/* {JSON.stringify(item)} */}
                </List.Item>
              )}
            />
          </>
        );
      }
      return <></>;
    },
  },
];

function AttachmentTabs({ form, isCommentAttachment, sInternal }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [messageApi, contextHolder] = message.useMessage();
  const currentCommentData = useSelector(
    (state) => state.taskList.currentCommentData
  );
  const userId = useSelector((state) => state.login.user.id);
  const currentCommentParentData = useSelector(
    (state) => state.taskList.currentCommentParentData
  );
  const isViewingAttachements = useSelector(
    (state) => state.taskList.isViewingAttachements
  );
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const uploader_id = useSelector((state) => state.login.user.id);
  const updateData = useSelector((state) => state.taskList.updateData);

  const isCommentInternal = useSelector(
    (state) => state.taskList.isCommentInternal
  );

  let COMMENT_ATTACHMENT = ["comment_attachment", currentCommentData?.id];
  let TASK_ATTACHMENT = ["task_attachment", organization_id, updateData?.id];

  let COMMENT_ATTACHMENT_KEY = isCommentAttachment
    ? COMMENT_ATTACHMENT
    : TASK_ATTACHMENT;

  const TASK_COMMENT_KEY = [
    "task_comment",
    organization_id,
    updateData.id,
    isCommentInternal,
  ];

  const getAttachmentFor = isCommentAttachment
    ? !!currentCommentData?.id
    : !!updateData?.id;

  const {
    handleGetCommentAttachment,
    handleSuccessUploadFile,
    handlePaste,
    handleDeleteFile,
  } = TaskListController({
    dispatch,
    queryClient,
    messageApi,
    COMMENT_ATTACHMENT_KEY,
    TASK_COMMENT_KEY,
    TASK_ATTACHMENT,
  });

  let project_id = form.getFieldValue("project_id");
  let client_id = form.getFieldValue("client_id");
  let module_id = form.getFieldValue("module_id");

  let params = {
    project_id,
    client_id,
    module_id,
    organization_id,
    task_id: updateData?.id,
    comment_id: currentCommentData?.id,
    uploader_id,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: COMMENT_ATTACHMENT_KEY,
    queryFn: () =>
      handleGetCommentAttachment({
        comment_id: currentCommentData?.id,
        task_id: updateData?.id,
        isCommentAttachment,
      }),
    enabled: !!organization_id && !!uploader_id && getAttachmentFor,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: handleSuccessUploadFile,
  });

  const { mutate: deleteAttacmentMutation } = useMutation({
    mutationFn: handleDeleteFile,
  });

  return (
    <>
      {contextHolder}

      <div
        onPaste={(event) => {
          if (!isViewingAttachements) {
            handlePaste({
              event,
              params,
              currentCommentData,
              currentCommentParentData,
              mutate,
              isCommentAttachment,
            });
          }
        }}
      >
        {(!isViewingAttachements || !isCommentAttachment) && (
          <div className="mb-3">
            <Dragger
              {...props(
                params,
                mutate,
                currentCommentData,
                currentCommentParentData,
                isCommentAttachment
              )}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              {/* <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p> */}
            </Dragger>
          </div>
        )}

        <Tabs
          // style={{ height: 200, overflow: "auto" }}
          defaultActiveKey="1"
          items={tabs.map(({ title, Icon, component }, i) => {
            const id = String(i + 1);
            return {
              label: (
                <span>
                  <Icon />
                  {title}{" "}
                  <Text style={{ fontSize: 9 }}>
                    (
                    {
                      data?.filter(
                        (image) =>
                          image.file_type.toLowerCase() === title.toLowerCase()
                      ).length
                    }
                    )
                  </Text>
                </span>
              ),
              key: id,
              children: component(
                data,
                title,
                isFetching,
                deleteAttacmentMutation,

                userId
              ),
            };
          })}
        />
      </div>
    </>
  );
}

export default React.memo(AttachmentTabs);
