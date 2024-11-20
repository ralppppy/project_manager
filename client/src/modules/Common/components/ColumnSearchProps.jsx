import { Button, Form, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const ColumnSearchProps = (
  dataIndex,
  dispatch,
  setSearch,
  pagination,
  navigate
) => {
  return {
    filterDropdown: ({ confirm, close }) => (
      <div
        style={{
          paddingTop: 8,
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <Form
          size="small"
          onFinish={(values) => {
            const queryParams = new URLSearchParams({
              ...pagination,
              page: 1,
            });

            navigate(`?${queryParams.toString()}`, { replace: true });
            dispatch(
              setSearch({ s: values[dataIndex], searchIndex: dataIndex })
            );
            confirm();
          }}
          onReset={() => {
            dispatch(setSearch(""));
          }}
        >
          <Form.Item name={dataIndex}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button htmlType="reset">Reset</Button>

              <Button type="link" size="small" onClick={close}>
                close
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
  };
};

export default ColumnSearchProps;
