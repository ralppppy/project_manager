import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Popover,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import { useQueries } from "react-query";
import { TaskListController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { SingleFilterInput, TaskSearchInput } from ".";

const { Text } = Typography;

const TOTAL_SPAN = 24;
const options = [
  {
    id: 1,
    label: "Approved",
    value: 1,
  },
  {
    id: 0,
    label: "Pending",
    value: 0,
  },
];

function TaskTableFilters() {
  const [form] = Form.useForm();

  const [openFilter, setOpenFilter] = useState(false);

  const dispatch = useDispatch();

  const [taskTypeCheckAll, setTaskTypeCheckAll] = useState({
    indeterminate: false,
    checked: true,
  });
  const [taskStatusCheckAll, setTaskStatusCheckAll] = useState({
    indeterminate: false,
    checked: true,
  });
  const [taskPriorityCheckAll, setTaskPriorityCheckAll] = useState({
    indeterminate: false,
    checked: true,
  });
  const [taskApprovalCheckAll, setTaskApprovalCheckAll] = useState({
    indeterminate: false,
    checked: true,
  });

  const { handleGetTaskTypeDropdown, handleSetFilters } = TaskListController({
    dispatch,
  });
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  let QUERY_KEY_TASK_TYPE = ["tasks_type_dropdown", organization_id];
  let QUERY_KEY_TASK_STATUS = ["tasks_status_dropdown", organization_id];
  let QUERY_KEY_TASK_PRIORITY = ["tasks_priority_dropdown", organization_id];

  let [taskType, taskStatus, taskPriority] = useQueries([
    {
      queryKey: QUERY_KEY_TASK_TYPE,
      queryFn: () => handleGetTaskTypeDropdown(organization_id, "tasks_type"),

      enabled: !!organization_id,
      staleTime: Infinity,
    },
    {
      queryKey: QUERY_KEY_TASK_STATUS,
      queryFn: () => handleGetTaskTypeDropdown(organization_id, "tasks_status"),
      enabled: !!organization_id,
      staleTime: Infinity,
    },
    {
      queryKey: QUERY_KEY_TASK_PRIORITY,
      queryFn: () =>
        handleGetTaskTypeDropdown(organization_id, "tasks_priority"),
      enabled: !!organization_id,
      staleTime: Infinity,
    },
  ]);

  useEffect(() => {
    if (
      !taskType.isFetching &&
      !taskStatus.isFetching &&
      !taskPriority.isFetching
    ) {
      handleSetFilters({
        task_type_filter: taskType.data?.map((c) => c.id),
        task_status_filter: taskStatus.data?.map((c) => c.id),
        task_priority_filter: taskPriority.data?.map((c) => c.id),
        task_approval_filter: options?.map((c) => c.id),
      });
    }
  }, [taskType.isFetching, taskStatus.isFetching, taskPriority.isFetching]);

  if (taskType.isFetching && taskStatus.isFetching && taskPriority.isFetching) {
    return (
      <>
        <Spin />
      </>
    );
  }

  const filterFunction = (key, values, setData, data) => {
    if (Array.isArray(values[key])) {
      if (values[key].length === 0) {
        setData((prev) => ({
          ...prev,
          indeterminate: false,
          checked: false,
        }));
      } else {
        if (
          JSON.stringify(values[key]) === JSON.stringify(data?.map((c) => c.id))
        ) {
          setData((prev) => ({
            ...prev,
            indeterminate: false,
            checked: true,
          }));
        } else {
          setData((prev) => ({
            ...prev,
            indeterminate: true,
            checked: false,
          }));
        }
      }
    }
  };

  let allFunctions = {
    task_type_filter: (key, values) => {
      filterFunction(key, values, setTaskTypeCheckAll, taskType?.data);
    },
    task_status_filter: (key, values) => {
      filterFunction(key, values, setTaskStatusCheckAll, taskStatus?.data);
    },
    task_priority_filter: (key, values) => {
      filterFunction(key, values, setTaskPriorityCheckAll, taskPriority?.data);
    },
    task_approval_filter: (key, values) => {
      filterFunction(key, values, setTaskApprovalCheckAll, options);
    },
  };

  const content = (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        handleSetFilters(values);
        setOpenFilter(false);
      }}
      initialValues={{
        task_type_filter: taskType.data?.map((c) => c.id),
        task_status_filter: taskStatus.data?.map((c) => c.id),
        task_priority_filter: taskPriority.data?.map((c) => c.id),
        task_approval_filter: options?.map((c) => c.id),
      }}
      onValuesChange={(values) => {
        for (let key of Object.keys(values)) {
          allFunctions[key](key, values);
        }
      }}
    >
      <Text style={{ fontSize: 14 }} strong>
        Filters
      </Text>
      <Divider />
      <Suspense fallback={<></>}>
        <Space size={0} direction="vertical">
          {/* label, form, data, checkData, setCheckData */}

          <SingleFilterInput
            label="Task Status"
            form={form}
            name="task_status_filter"
            data={taskStatus?.data}
            checkData={taskStatusCheckAll}
            setCheckData={setTaskStatusCheckAll}
          />

          <SingleFilterInput
            label="Task Type"
            form={form}
            name="task_type_filter"
            data={taskType?.data}
            checkData={taskTypeCheckAll}
            setCheckData={setTaskTypeCheckAll}
          />

          <SingleFilterInput
            label="Task Priority"
            form={form}
            name="task_priority_filter"
            data={taskPriority?.data}
            checkData={taskPriorityCheckAll}
            setCheckData={setTaskPriorityCheckAll}
          />

          <SingleFilterInput
            label="Task Approval"
            form={form}
            name="task_approval_filter"
            data={options}
            checkData={taskApprovalCheckAll}
            setCheckData={setTaskApprovalCheckAll}
          />
        </Space>
      </Suspense>

      <Button htmlType="submit" type="default" className="w-100">
        Apply filter
      </Button>
    </Form>
  );
  return (
    <Row style={{ marginBottom: -15 }} gutter={[10, 10]}>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 6 }}
        lg={{ span: TOTAL_SPAN / 6 }}
        xl={{ span: TOTAL_SPAN / 6 }}
        xxl={{ span: TOTAL_SPAN / 6 }}
      >
        <Suspense fallback={<></>}>
          <TaskSearchInput />
        </Suspense>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: TOTAL_SPAN / 6 }}
        lg={{ span: TOTAL_SPAN / 6 }}
        xl={{ span: TOTAL_SPAN / 6 }}
        xxl={{ span: TOTAL_SPAN / 6 }}
      >
        <Space size={0}>
          <Popover
            placement="bottom"
            content={content}
            trigger="click"
            onOpenChange={(e) => {
              setOpenFilter(e);
            }}
            open={openFilter}
          >
            <Button type="ghost" about="" icon={<FilterFilled />}>
              Filters
            </Button>
          </Popover>
        </Space>
      </Col>
    </Row>
  );
}

export default TaskTableFilters;
