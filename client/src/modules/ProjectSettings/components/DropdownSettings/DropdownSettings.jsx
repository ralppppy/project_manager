import { Col, Row } from "antd";
import React from "react";
import { SettingsCard } from ".";
import { useSelector } from "react-redux";

const TOTAL_SPAN = 24;

function DropdownSettings() {
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const Settings = [
    {
      id: 1,

      KEY: "settings_task_type_key",
      apis: {
        get: "/api/tasks_type/tasks_type_settings",
        post: "/api/tasks_type",
        put: "/api/tasks_type",
        updateSort: "/api/tasks_type/update_sort",
        delete: "/api/tasks_type",
      },

      invalidateQueries: [
        ["tasks_type_dropdown", organization_id],
        ["tasks", organization_id],
      ],

      title: "Task Type",
      deleteErrorMessage:
        "Unable to delete this entry because this is connected to a task",
    },
    {
      id: 2,
      KEY: "settings_task_status_key",

      title: "Task Status",
      apis: {
        get: "/api/tasks_status/tasks_status_settings",
        post: "/api/tasks_status",
        put: "/api/tasks_status",
        updateSort: "/api/tasks_status/update_sort",
        delete: "/api/tasks_status",
      },
      invalidateQueries: [
        ["tasks_status_dropdown", organization_id],
        ["tasks", organization_id],
      ],
      deleteErrorMessage:
        "Unable to delete this entry because this is connected to a task",
    },
    {
      id: 3,
      KEY: "settings_task_priority_key",

      title: "Task Priority",
      apis: {
        get: "/api/tasks_priority/tasks_priority_dropdown",
        post: "/api/tasks_priority",
        put: "/api/tasks_priority",
        updateSort: "/api/tasks_priority/update_sort",
        delete: "/api/tasks_priority",
      },
      invalidateQueries: [
        ["tasks_priority_dropdown", organization_id],
        ["tasks", organization_id],
      ],
      deleteErrorMessage:
        "Unable to delete this entry because this is connected to a task",
    },
    {
      id: 4,
      KEY: "settings_task_project_roles_key",

      title: "Project Roles",
      apis: {
        get: "/api/project_roles/project_role_dropdown",
        post: "/api/project_roles",
        put: "/api/project_roles",
        updateSort: "/api/project_roles/update_sort",
        delete: "/api/project_roles",
      },
      invalidateQueries: [["project_role", organization_id]],
      deleteErrorMessage:
        "Unable to delete this entry because their are users are assign to this",
    },
    {
      id: 5,
      KEY: "settings_department_key",

      title: "Departments",
      apis: {
        get: "/api/departments/department_dropdown",
        post: "/api/departments",
        put: "/api/departments",
        updateSort: "/api/departments/update_sort",
        delete: "/api/departments",
      },
      invalidateQueries: [["departments", organization_id]],
      deleteErrorMessage:
        "Unable to delete this entry because their are users are assign to this",
    },
    {
      id: 6,
      KEY: "settings_user_types_key",

      title: "User Types",
      apis: {
        get: "/api/user_types/user_type_settings",
        post: "/api/user_types",
        put: "/api/user_types",
        updateSort: "/api/user_types/update_sort",
        delete: "/api/user_types",
      },
      invalidateQueries: [["user_type", organization_id]],

      deleteErrorMessage:
        "Unable to delete this entry because their are users are assign to this",
    },
    {
      id: 7,
      KEY: "settings_holiday_type_key",

      title: "Holiday Type",
      apis: {
        get: "/api/holiday_type/holiday_type_dropdown",
        post: "/api/holiday_type",
        put: "/api/holiday_type",
        updateSort: "/api/holiday_type/update_sort",
        delete: "/api/holiday_type",
      },
      invalidateQueries: [["holiday_type", organization_id]],

      deleteErrorMessage:
        "Unable to delete this entry because there are holidays assign to this",
    },
  ];

  return (
    <Row gutter={[10, 10]}>
      {Settings.map((setting) => (
        <Col
          key={setting.id}
          xs={{ span: TOTAL_SPAN }}
          sm={{ span: TOTAL_SPAN }}
          md={{ span: TOTAL_SPAN / 6 }}
          lg={{ span: TOTAL_SPAN / 6 }}
          xl={{ span: TOTAL_SPAN / 6 }}
          xxl={{ span: TOTAL_SPAN / 6 }}
        >
          {" "}
          <SettingsCard
            KEY={setting.KEY}
            apis={setting.apis}
            title={setting.title}
            cardData={setting.cardData}
            invalidateQueries={setting.invalidateQueries}
            deleteErrorMessage={setting.deleteErrorMessage}
          />
        </Col>
      ))}
    </Row>
  );
}

export default DropdownSettings;
