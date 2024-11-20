import { Affix, Avatar, Card, Tree, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import data from "./data.json";
import { useSelector } from "react-redux";
import { GanttChartController } from "../controllers";
import { useQuery } from "react-query";

const { Text } = Typography;

const GanttEvents = () => {
  const { handleGetDeparmentsWithUsers } = GanttChartController({});

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_DEPARTMENTS = ["departments", organization_id];

  const { data, mutate } = useQuery({
    queryKey: QUERY_KEY_DEPARTMENTS,
    queryFn: () =>
      handleGetDeparmentsWithUsers({
        organization_id,
      }),

    select: (data) => {
      data = data?.data?.map((d) => {
        let newChildren = d.children.map((c) => {
          return {
            ...c.user,
            isLeaf: true,
            className: "fc-event",
            "data-event": JSON.stringify({
              ...c.user,
              avatarUrl: `https://i.pravatar.cc/150?img=${c.id + 1}`,
            }),
            icon: (
              <Avatar
                size={"small"}
                src={`https://i.pravatar.cc/150?img=${c.id + 1}`}
              />
            ),
          };
        });
        return { ...d, children: newChildren };
      });

      return data;
    },

    enabled: !!organization_id,
    staleTime: Infinity,
  });

  useEffect(() => {
    var containerEl = document.getElementById("external-events-users");

    let draggable = new Draggable(containerEl, {
      itemSelector: ".fc-event",

      eventData: function (eventEl) {
        return {
          title: eventEl.innerText,
          "data-event": eventEl.getAttribute("data-event"),
        };
      },
    });
    return () => draggable.destroy();
  }, [data]);

  return (
    <div id="external-events-users">
      <Affix offsetTop={0.1}>
        <Card>
          <Tree
            showLine={{
              showLeafIcon: false,
            }}
            height={window.innerHeight * 0.8}
            showIcon={true}
            treeData={data}
            // defaultExpandedKeys={["a1"]}
          />
        </Card>
      </Affix>
    </div>
  );
};
export default GanttEvents;
