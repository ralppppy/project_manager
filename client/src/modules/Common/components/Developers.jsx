import { Avatar, Button, Dropdown, Skeleton, Tooltip } from "antd";

import React, { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";

import "./styles.css";

function Developers({
  size = "small",
  maxCount = 3,
  users = [],
  onClick,
  isLoading = false,
  allowAdd = null,
}) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };
  return (
    <>
      {isLoading ? (
        <Skeleton.Avatar active={true} size={size} shape="circle" />
      ) : (
        <div className="d-flex align-items-center">
          <Avatar.Group size={size} maxCount={maxCount}>
            {users.map((user, index) => (
              <Tooltip
                key={index}
                title={`${user.first_name} ${user.last_name} | ${user.projectRoleName}`}
                placement="top"
              >
                <Avatar
                  onClick={() => {
                    if (allowAdd) {
                      setVisible(false);
                    }

                    onClick(user);
                  }}
                  style={{
                    backgroundColor: "#f56a00",
                    cursor: "pointer",
                  }}
                >
                  {user.first_name.charAt(0).toUpperCase()}
                  {user.last_name.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
          {allowAdd && allowAdd.list.length > 0 && (
            <Dropdown
              // open={true}
              menu={{
                items: allowAdd.list.map((c) => ({
                  id: c.id,
                  key: c.id,
                  label: `${c.first_name} ${c.last_name}`,
                })),
                onSelect: allowAdd.onAddSelect,
                selectable: true,
              }}
              open={visible}
              onOpenChange={handleVisibleChange}
              trigger={["hover"]}
            >
              <Button shape="circle" type="dashed" icon={<UserAddOutlined />} />
            </Dropdown>
          )}
        </div>
      )}
    </>
  );
}

export default Developers;
