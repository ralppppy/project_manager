import { Button, Form, Col, Select, Space, Typography } from "antd";
import React, { Suspense } from "react";

import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { ClientController } from "@modules/Client/controllers";
import { useSelector } from "react-redux";
import { Developers } from "../../Common/components";
import { ProjectController } from "../controllers";

const TOTAL_SPAN = 24;

const { Option } = Select;
const { Text } = Typography;

function AddTeam({ form, QUERY_KEY }) {
  const { handleGetUsers } = ClientController({ form });
  const queryClient = useQueryClient();

  const isUpdate = useSelector((state) => state.project.isUpdate);

  const { handleAddTeam, handleGetProjectRoles, handleRemoveUser } =
    ProjectController({ form, queryClient, QUERY_KEY, isUpdate });

  const loggedInUser = useSelector((state) => state.login.user);

  let QUERY_KEY_USERS = ["users", loggedInUser.organization_id];
  let QUERY_KEY_PROJECT_ROLE = ["project_role", loggedInUser.organization_id];

  const mutation = useMutation({
    mutationFn: ({ usersData, user, type }) => {
      let newusersData = [];
      if (type === "remove") {
        newusersData = usersData.filter((c) => c.id !== user.id);
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

  const [usersData, projectRoleData] = useQueries([
    {
      queryKey: QUERY_KEY_USERS,
      queryFn: () => handleGetUsers(loggedInUser, form, isUpdate),

      enabled: !!loggedInUser.organization_id,
      staleTime: 10,
    },
    {
      queryKey: QUERY_KEY_PROJECT_ROLE,
      queryFn: () => handleGetProjectRoles(loggedInUser),
      enabled: !!loggedInUser.organization_id,
      staleTime: Infinity,
    },
  ]);

  console.log(projectRoleData, "projectRoleData");

  return (
    <>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 10 }}
        lg={{ span: 10 }}
        xl={{ span: 10 }}
        xxl={{ span: 10 }}
      >
        <Form.Item label="User" name="user_id">
          <Select showSearch allowClear>
            {usersData?.data?.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 10 }}
        lg={{ span: 10 }}
        xl={{ span: 10 }}
        xxl={{ span: 10 }}
      >
        <Form.Item label="Project Role" name="project_role_id">
          <Select showSearch allowClear>
            {projectRoleData?.data?.map((projectRole) => (
              <Option key={projectRole.id} value={projectRole.id}>
                {projectRole.name}
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
                projectRoleData: projectRoleData?.data,
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
                  users={form.getFieldValue("team")}
                  size="medium"
                  onClick={(userTeam) => {
                    handleRemoveUser({
                      userTeam,
                      usersData: usersData?.data,
                      organization_id: loggedInUser.organization_id,
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

export default React.memo(AddTeam);
