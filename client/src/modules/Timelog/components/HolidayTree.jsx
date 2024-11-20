import { Tree } from "antd";
import React, { useEffect, useState } from "react";
import { CarryOutOutlined } from "@ant-design/icons";
import { Draggable } from "@fullcalendar/interaction";
const initTreeData = [
  {
    title: "Public Holiday",
    key: "a1",
    children: [
      {
        title: "2023",
        key: "a2",
        children: [
          {
            title: "January",
            key: "a9",
          },
          {
            title: "February",
            key: "a10",
          },
        ],
      },
      {
        title: "2022",
        key: "a3",
        children: [
          {
            title: "January",
            key: "a11",
          },
          {
            title: "February",
            key: "a12",
          },
        ],
      },
      {
        title: "2021",
        key: "a4",
        children: [
          {
            title: "January",
            key: "a14",
          },
          {
            title: "February",
            key: "a15",
          },
        ],
      },
    ],
  },
  {
    title: "Holiday Leave",
    key: "a5",
    children: [
      {
        title: "2023",
        key: "a6",
        children: [
          {
            title: "January",
            key: "a16",
          },
          {
            title: "February",
            key: "a17",
          },
        ],
      },
      {
        title: "2022",
        key: "a7",
        children: [
          {
            title: "January",
            key: "a18",
          },
          {
            title: "February",
            key: "a19",
          },
        ],
      },
      {
        title: "2021",
        key: "a8",
        children: [
          {
            title: "January",
            key: "a20",
          },
          {
            title: "February",
            key: "a21",
          },
        ],
      },
    ],
  },
  {
    title: "Sick Leave",
    key: "a28",
    children: [
      {
        title: "2023",
        key: "a29",
        children: [
          {
            title: "January",
            key: "a22",
          },
          {
            title: "February",
            key: "a23",
          },
        ],
      },
      {
        title: "2022",
        key: "a30",
        children: [
          {
            title: "January",
            key: "a24",
          },
          {
            title: "February",
            key: "a25",
          },
        ],
      },
      {
        title: "2021",
        key: "a31",
        children: [
          {
            title: "January",
            key: "a26",
          },
          {
            title: "February",
            key: "a27",
          },
        ],
      },
    ],
  },
];

const updateTreeData = (list, key, children) => {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
};

const HolidayTree = () => {
  const [treeData, setTreeData] = useState(initTreeData);

  useEffect(() => {
    var containerEl = document.getElementById("external-events-holiday");
    let draggable = new Draggable(containerEl, {
      itemSelector: ".fc-event",

      eventData: function (eventEl) {
        return {
          title: eventEl.innerText,
        };
      },
    });
    return () => draggable.destroy();
  }, []);

  const onLoadData = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            {
              title: "Point 1",
              key: `${key}a`,
              isLeaf: true,
              className: "fc-event",
              icon: <CarryOutOutlined />,
            },
            {
              title: "Point 2",
              key: `${key}b`,
              isLeaf: true,
              className: "fc-event",
              icon: <CarryOutOutlined />,
            },
          ])
        );
        resolve();
      }, 500);
    });

  const openKeys = (treeData) => {
    let defaultKeys = [];
    treeData.forEach((c) => {
      defaultKeys.push(c.key);

      c.children.forEach((d, idx) => {
        if (idx === 0) {
          defaultKeys.push(d.key);
        }
      });
    });
    return defaultKeys;
  };
  return (
    <div id="external-events-holiday">
      <Tree
        showLine={{
          showLeafIcon: false,
        }}
        height={window.innerHeight * 0.5}
        loadData={onLoadData}
        showIcon={true}
        defaultExpandedKeys={openKeys(treeData)}
        treeData={treeData}
      />
    </div>
  );
};
export default HolidayTree;
