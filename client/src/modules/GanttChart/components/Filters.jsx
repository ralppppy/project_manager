import { Form, Select } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GanttChartController } from "../controllers";

function Filters({ data, calendar }) {
  const modulesDropdownFilter = useSelector(
    (state) => state.ganttChart.modulesDropdownFilter
  );

  const dispatch = useDispatch();

  const { handleFilterModule } = GanttChartController({
    dispatch,
    calendar,
  });

  let func = {
    modules: (values) => {
      handleFilterModule(values);
    },
  };

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("modules", modulesDropdownFilter);
  }, [modulesDropdownFilter]);

  return (
    <div>
      <Form
        form={form}
        name="basic"
        autoComplete="off"
        onValuesChange={(values) => {
          for (let key of Object.keys(values)) {
            func[key](values[key]);
          }
        }}
      >
        <Form.Item label="Modules" name="modules">
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            options={data}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Filters;
