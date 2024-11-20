import { Button, Form, Col, Select, Space, Typography } from "antd";
import React, { Suspense } from "react";

import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Developers } from "../../Common/components";
import { ModuleListController } from "@modules/ModuleList/controllers";

const TOTAL_SPAN = 24;

const { Option } = Select;
const { Text } = Typography;

function ModuleListAddTeam({ form, QUERY_KEY }) {
  const queryClient = useQueryClient();
  const isUpdate = useSelector((state) => state.module.isUpdate);
  const updateModuleState = useSelector(
    (state) => state.module.updateModuleState
  );
  const { handleAddTeam, handleRemoveUser, handleGetUsers } =
    ModuleListController({
      form,
      queryClient,
      QUERY_KEY,
      isUpdate,
      updateModuleState,
    });

  const loggedInUser = useSelector((state) => state.login.user);
  const selectedProjectId = useSelector(
    (state) => state.module.selectedProjectId
  );

  let team = Form.useWatch("team", form);

  let QUERY_KEY_USERS = [
    "module_list_users",
    loggedInUser.organization_id,
    selectedProjectId,
    updateModuleState,
  ];

  const mutation = useMutation({
    mutationFn: ({ usersData = [], user, type }) => {
      let newusersData = [];
      if (type === "remove") {
        newusersData = usersData.filter((c) => c.user_id !== user.user_id);
      } else {
        newusersData = [user, ...usersData];
      }
      return newusersData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY_USERS, (prevData) => {
        return data;
      });
    },
  });

  const [usersData] = useQueries([
    {
      queryKey: QUERY_KEY_USERS,
      queryFn: () =>
        handleGetUsers(loggedInUser, selectedProjectId, updateModuleState),

      enabled: !!form.getFieldValue("project_id") || !!selectedProjectId,
      staleTime: 10,
    },
  ]);
  return (
    <>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 20 }}
        lg={{ span: 20 }}
        xl={{ span: 20 }}
        xxl={{ span: 20 }}
      >
        <Form.Item label="User" name="user_id">
          <Select showSearch allowClear>
            {usersData?.data?.map((c) => (
              <Option key={c.user_id} value={c.user_id}>
                {c.first_name} {c.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 4 }}
        lg={{ span: 4 }}
        xl={{ span: 4 }}
        xxl={{ span: 4 }}
        className="d-flex align-items-center mt-4"
      >
        <Form.Item>
          <Button
            onClick={() => {
              handleAddTeam({
                usersData: usersData?.data,
                mutation,
                loggedInUser,
              });
            }}
            type="link"
          >
            Add
          </Button>
        </Form.Item>
      </Col>

      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN }}
        lg={{ span: TOTAL_SPAN }}
        xl={{ span: TOTAL_SPAN }}
        xxl={{ span: TOTAL_SPAN }}
        className="mb-3"
      >
        <Form.Item
          name="team"
          rules={[
            {
              required: true,
              message: "Please add team members!",
            },
          ]}
        >
          <Space align="center" size="small">
            <div>
              <Text>Team: </Text>
            </div>

            <div>
              <Suspense fallback={<></>}>
                <Developers
                  users={team}
                  size="medium"
                  onClick={(userTeam) => {
                    handleRemoveUser({
                      userTeam,
                      usersData: usersData?.data,
                      mutation,
                    });
                  }}
                />
              </Suspense>
            </div>
          </Space>
        </Form.Item>
      </Col>
    </>
  );
}

export default React.memo(ModuleListAddTeam);
