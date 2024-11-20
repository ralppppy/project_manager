import { Badge, Segmented, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useQuery } from "react-query";

import { TaskListController } from "../../TasksList/controllers";

const { Text } = Typography;
const PointFilter = () => {
  const dispatch = useDispatch();

  const { handleSetPointFilter } = TaskListController({ dispatch });

  const assignedCount = useSelector(
    (state) => state.taskList.assignedTasksCount
  );
  const unassignedCount = useSelector(
    (state) => state.taskList.unassignedTasksCount
  );

  return (
    <div className="mb-3">
      <Segmented
        size="small"
        onChange={handleSetPointFilter}
        options={[
          {
            label: (
              <div className="m-2">
                <Text style={{ fontSize: 12 }}>
                  Assigned Tasks <Badge color="blue" count={assignedCount} />
                </Text>
              </div>
            ),
            value: 0,
          },
          {
            label: (
              <div className="m-2">
                <Text style={{ fontSize: 12 }}>
                  Unassigned Tasks <Badge color="red" count={unassignedCount} />
                </Text>
              </div>
            ),
            value: 1,
          },
        ]}
      />
    </div>
  );
};

export default PointFilter;
