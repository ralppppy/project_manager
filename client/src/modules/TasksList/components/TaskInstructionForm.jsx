import { Button, Col, Form, Modal, Row, Spin, Typography, theme } from "antd";
import React, { useEffect, useState } from "react";
import BundledEditor from "../../Common/components/BundledEditor";
import { useSelector } from "react-redux";
import { TasksComments } from ".";
import { HfInference } from "@huggingface/inference";
import AttachmentTabs from "./AttachmentTabs";
import "./styles.css";

const TOTAL_SPAN = 24;

const { Text, Title } = Typography;

function TaskInstructionForm({ form, updateTask }) {
  const [editorRef, setRef] = useState(null);
  //   const editorRef = useRef();
  const isView = useSelector((state) => state.taskList.isView);

  const { token } = theme.useToken();
  const isUpdate = useSelector((state) => state.taskList.isUpdate);
  const updateData = useSelector((state) => state.taskList.updateData);
  // const isEmployee = useSelector((state) => state.login.user.is_employee);
  const currentUserId = useSelector((state) => state.login.user.id);
  const [generatingAiRes, setGeneratingAiRes] = useState(true);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [content, setContent] = useState("");

  // Update the form field value when the editor content changes
  const handleEditorChange = () => {
    let content = editorRef?.getContent({ format: "html" });

    form.setFieldsValue({ content });
  };

  useEffect(() => {
    if (isUpdate && editorRef) {
      //   form.setFieldValue("content", updateData.instruction);
      editorRef?.setContent(updateData.instruction || "");
    }
  }, [isUpdate, updateData, editorRef]);

  // useEffect(() => {
  //   (async () => {
  //     const inference = new HfInference(
  //       import.meta.env.VITE_HUGGING_FACE_TOKEN
  //     );

  //     // Chat completion API
  //     //runwayml/stable-diffusion-v1-5
  //     const out = await inference.chatCompletion({
  //       model: "meta-llama/Meta-Llama-3-8B-Instruct",
  //       messages: [
  //         {
  //           role: "user",
  //           content:
  //             "You are a software developer assigned to analyze a task. Please read and analyze the task provided, and then explain it in clear English and also please provide posible solution. Some tasks may be written in different languages, such as German. Avoid asking further questions. Provide your response using HTML tags for improved readability. Only reply with an HTML visual representation of your analysis.",
  //         },
  //         {
  //           role: "user",
  //           content: updateData.instruction,
  //         },
  //       ],
  //       max_tokens: 500,
  //     });

  //     setContent(out.choices[0].message?.content);

  //     setTimeout(() => {
  //       setGeneratingAiRes(false);
  //     }, 1000);
  //   })();
  // }, [updateData.instruction]);

  return (
    <>
      {isView ? (
        <Row gutter={[10, 10]}>
          {/* <div style={{ height: 450, overflow: "auto" }}> */}
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            xxl={{ span: 12 }}
          >
            <div
              style={{
                height: 450,
                overflow: "auto",
                backgroundColor: token.colorBgContainer,
                padding: 20,
                borderRadius: token.borderRadius,
              }}
            >
              {" "}
              <Title level={4}> Instruction</Title>
              {!isUpdate || currentUserId === updateData?.creator?.id ? (
                <Form.Item
                  getValueProps={(value) => {
                    return "";
                  }}
                  name="content"
                >
                  <BundledEditor
                    onBlur={(e) => {
                      if (isView) {
                        let content = e.target.getContent({ format: "html" });
                        let values = { instruction: content };

                        updateTask({
                          values,
                          task_id: updateData.id,
                        });
                      }
                    }}
                    key={1}
                    onEditorChange={handleEditorChange}
                    onInit={(evt, editor) => setRef(editor)}
                    init={{
                      entity_encoding: "raw",
                      force_br_newlines: true,

                      paste_data_images: true,
                      statusbar: false,
                      menubar: false,
                      inline: false,
                      content_style: `@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap"); body { color: ${token.colorText}; font-family: Poppins;  font-size: 10pt; }`,
                      plugins: [
                        "autoresize",
                        "link",
                        "lists",
                        "table",
                        "image",
                        "paste",
                      ],
                      toolbar:
                        "undo redo | blocks fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table tablecellvalign | link | customRotateText270 | forecolor backcolor removeformat image print",
                      toolbar_mode: "wrap",
                      smart_paste: true,
                      font_size_formats:
                        "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
                      table_toolbar: "",
                      table_resize_bars: true,
                      min_height: 400,
                      max_height: 400,
                    }}
                  />
                </Form.Item>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: updateData.instruction, //DOMPurify.sanitize(updateData.instruction),
                  }}
                />
              )}
            </div>
          </Col>

          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 7 }}
            lg={{ span: 7 }}
            xl={{ span: 7 }}
            xxl={{ span: 7 }}
            style={{
              borderLeft: `1px solid ${token.colorBgContainerDisabled}`,
            }}
          >
            <TasksComments form={form} />
          </Col>

          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: 5 }}
            lg={{ span: 5 }}
            xl={{ span: 5 }}
            xxl={{ span: 5 }}
            style={{
              borderLeft: `1px solid ${token.colorBgContainerDisabled}`,
            }}
          >
            <Text stong> Attachements</Text>

            <div style={{ height: 450, overflow: "auto" }}>
              <AttachmentTabs form={form} isCommentAttachment={false} />
            </div>
          </Col>
        </Row>
      ) : (
        <Form.Item
          label="Instruction"
          getValueProps={(value) => {
            return "";
          }}
          name="content"
        >
          <BundledEditor
            key={1}
            onEditorChange={handleEditorChange}
            onInit={(evt, editor) => setRef(editor)}
            init={{
              entity_encoding: "raw",
              force_br_newlines: true,
              // force_p_newlines: false,
              // forced_root_block: "",
              paste_data_images: true,
              statusbar: false,
              menubar: false,
              inline: false,
              content_style: `@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap"); body { color: ${token.colorText}; font-family: Poppins;  font-size: 10pt; }`,
              plugins: [
                "autoresize",
                "link",
                "lists",
                "table",
                "image",
                "paste",
              ],
              toolbar:
                "undo redo | blocks fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | table tablecellvalign | link | customRotateText270 | forecolor backcolor removeformat image print",
              toolbar_mode: "wrap",
              smart_paste: true,
              font_size_formats:
                "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
              table_toolbar: "",
              table_resize_bars: true,
              min_height: 400,
              max_height: 400,
            }}
          />
        </Form.Item>
      )}
    </>
  );
}

export default React.memo(TaskInstructionForm);
