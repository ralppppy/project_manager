import React from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import adaptivePlugin from "@fullcalendar/adaptive";
import { Card, Avatar, Typography, DatePicker } from "antd";
import data from "../../GanttChart/components/data.json";

const { Text } = Typography;

const CalendarView = () => {
  let teams = data.map((c, idx) => {
    return {
      id: c.id,
      title: c.name,
      groupId: c.group.id,
      index: idx,
    };
  });

  let teamA = teams.filter((c) => c.groupId === "2");
  let teamB = teams.filter((c) => c.groupId === "3");
  let events = [];
  teamA.forEach((c, idx) => {
    events.push(
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-01",
        end: "2023-06-05",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-05",
        end: "2023-06-08",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-08",
        end: "2023-06-10",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-10",
        end: "2023-06-20",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-20",
        end: idx % 2 === 0 ? "2023-06-27" : "2023-06-31",
      }
    );
  });

  teamB.forEach((c, idx) => {
    events.push(
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-01",
        end: "2023-06-05",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-05",
        end: "2023-06-08",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-08",
        end: "2023-06-10",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-10",
        end: "2023-06-20",
      },
      {
        resourceId: c.id,
        title: `Point ${c.id}`,
        start: "2023-06-20",
        end: idx % 2 === 0 ? "2023-06-27" : "2023-06-31",
      }
    );
  });

  let resources = [
    {
      id: 1,
      title: "Team A",
      eventAllow: () => false,
      businessHours: {
        daysOfWeek: [], // Mon,Wed,Fri
      },
      resourcesInitiallyExpanded: false,
      children: teamA,
    },
    {
      id: 2,
      title: "Team B",
      eventAllow: () => false,
      businessHours: {
        daysOfWeek: [teamB], // Mon,Wed,Fri
      },
      children: teamB,
    },
  ];

  return (
    <Card
      className="mb-3"
      title={<Text>Capacity Calendar</Text>}
      extra={
        // <div className="d-flex justify-content-end">
        <DatePicker className="mt-2 mb-2" />
        // </div>
      }
    >
      <FullCalendar
        // aspectRatio={1.6}
        height="auto"
        schedulerLicenseKey={"0911877386-fcs-1533626271"}
        resources={resources}
        resourceAreaHeaderContent={"Teams"}
        events={events}
        headerToolbar={{
          left: "today prev,next",
          center: "title",
          right: "resourceTimelineMonth,resourceTimelineYear",
        }}
        initialView="resourceTimelineMonth"
        plugins={[
          dayGridPlugin,
          resourceTimelinePlugin,
          interactionPlugin,
          adaptivePlugin,
        ]}
        resourceAreaWidth="15%"
        firstDay={1}
        droppable={true}
        editable={false}
        // slotDuration={"00:15:00"}
        timeZone={"UTC"}
        resourceLabelContent={(info) => {
          if (info.resource.id !== "1" && info.resource.id !== "2") {
            return (
              <>
                <Avatar
                  src={`https://i.pravatar.cc/150?img=${info.resource.extendedProps.index}`}
                />{" "}
                <Text>{info.resource.title}</Text>
              </>
            );
          } else {
            return <Text>{info.resource.title}</Text>;
          }
        }}
        views={{
          resourceTimelineYear: {
            slotLabelFormat: [
              {
                month: "long",
                year: "numeric",
              },
              {
                day: "2-digit",
                weekday: "short",
              },
            ],
          },
          resourceTimelineMonth: {
            slotLabelFormat: [
              {
                weekday: "short",
                day: "2-digit",
              },
            ],
          },
        }}
        // views={{
        //   resourceTimelineYear: {
        //     slotLabelFormat: [
        //       {
        //         month: "long",
        //         year: "numeric",
        //       },
        //       {
        //         day: "2-digit",
        //       },
        //     ],
        //   },
        //   resourceTimelineMonth: {
        //     slotLabelFormat: [
        //       {
        //         day: "2-digit",
        //       },
        //     ],
        //   },
        // }}
      />
    </Card>
  );
};

export default CalendarView;
