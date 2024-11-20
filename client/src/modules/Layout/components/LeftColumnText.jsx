import React from "react";
import { theme, Typography } from "antd";
import "./styles.css";

const { Title, Paragraph } = Typography;

function LeftColumnText() {
  const { token } = theme.useToken();

  return (
    <div className="overlay d-flex align-items-center justify-content-center ">
      <div className="m-5">
        <Title level={1} style={{ color: token.colorBgBase, fontSize: 40 }}>
          Project management with project-p
        </Title>
        <Paragraph style={{ color: token.colorBgBase, fontSize: 20 }}>
          We help you stay organized and manage your tasks efficiently. With our
          intuitive interface, you can easily create tasks, track time logs, and
          stay productive throughout the day.
        </Paragraph>
        <Paragraph style={{ color: token.colorBgBase, fontSize: 15 }}>
          Features:
          <ul>
            <li>Create and manage tasks</li>
            <li>Track time logs for accurate time management</li>
            <li>Assign tasks to team members</li>
            <li>Set deadlines and reminders</li>
            <li>Generate reports for task progress and time utilization</li>
          </ul>
        </Paragraph>
      </div>
    </div>
  );
}

export default LeftColumnText;
