import React, { useEffect, useRef, useState } from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
// import { FallBackLoaders } from '@core_common/components';
import adaptivePlugin from "@fullcalendar/adaptive";
import { Avatar, Card, Typography } from "antd";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { GanttChartController } from "../controllers";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import { FilterContainer, SummaryTableModal } from ".";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Text, Title } = Typography;
const GanttCalendar = () => {
  const calendar = useRef();

  const dispatch = useDispatch();

  const { clientId, projectId } = useSelector(
    (state) => state.common.selectedFilter
  );
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const modulesDropdownFilter = useSelector(
    (state) => state.ganttChart.modulesDropdownFilter
  );
  const filterResourcesWithEvents = useSelector(
    (state) => state.ganttChart.filterResourcesWithEvents
  );

  const { startDate, endDate } = useSelector((state) => state.ganttChart);

  const {
    handleGetGantChartResources,
    handleDrop,
    eventResize,
    handleGetEvents,
    eventDrop,
    handleSetStartEndDate,
    handleFilterResourcesWithEvents,
    handleFilterModalOpen,
    handleGetUserGanttInserted,
    handlSummaryModalOpen,
  } = GanttChartController({ calendar, dispatch });

  const GANTT_CHART_KEY = [
    "gantt_chart",
    clientId,
    projectId,
    startDate,
    endDate,
    modulesDropdownFilter,
  ];
  const GANTT_CHART_KEY_EVENTS = [
    "gantt_chart_events",
    organization_id,
    clientId,
    projectId,
    startDate,
    endDate,
  ];

  const { data: resources, isFetching } = useQuery({
    queryKey: GANTT_CHART_KEY,
    queryFn: () =>
      handleGetGantChartResources(
        organization_id,
        {
          clientId,
          projectId,
        },
        { startDate, endDate },
        modulesDropdownFilter
      ),

    enabled: !!organization_id && !!startDate && !!endDate,
    keepPreviousData: true,
    refetchOnWindowFocus: false, // default: true

    staleTime: 10,
  });

  const { data: events } = useQuery({
    queryKey: GANTT_CHART_KEY_EVENTS,
    queryFn: () =>
      handleGetEvents(
        { organization_id, clientId, projectId },
        { startDate, endDate }
      ),
    refetchOnWindowFocus: false, // default: true

    enabled: !!organization_id && !!startDate && !!endDate,
    keepPreviousData: true,
    staleTime: 10,
  });

  return (
    <Card className="mb-5">
      {/* <Filters calendar={calendar} /> */}
      <FilterContainer calendar={calendar} />

      <SummaryTableModal />

      <FullCalendar
        ref={calendar}
        resourceAreaHeaderContent={"Zeiterfassung / Mitarbeiterplanung"}
        resourceAreaHeaderClassNames={"w-100"}
        height="auto"
        // filterResourcesWithEvents={filterResourcesWithEvents}
        // schedulerLicenseKey={"0911877386-fcs-1533626271"}
        eventOverlap={false}
        resources={resources}
        events={events}
        initialView="resourceTimelineMonth"
        headerToolbar={{
          left: "today prev,next summaryButton",
          center: "title",
          right: "resourceTimelineMonth,resourceTimelineYear",
        }}
        customButtons={{
          summaryButton: {
            text: "Summary",
            click: function () {
              handlSummaryModalOpen(true);
            },
          },
          filterResultWithEvents: {
            text: filterResourcesWithEvents
              ? "Show all task"
              : "Only show task with dev",
            click: function () {
              handleFilterResourcesWithEvents();
            },
          },
          filterButton: {
            text: "Filter",
            click: function () {
              handleFilterModalOpen(true);
            },
          },
        }}
        datesSet={(e) => {
          handleSetStartEndDate({ startDate: e.startStr, endDate: e.endStr });
        }}
        // rerenderDelay={1000}
        resourceAreaColumns={[
          {
            headerContent: (
              <Text
                ellipsis={{ tooltip: "Task name" }}
                style={{ fontSize: 10 }}
              >
                Task name
              </Text>
            ),
            cellContent: (e) => {
              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text style={{ fontSize: 13 }} strong>
                    {e.fieldValue}
                  </Text>
                );
              } else {
                return e.fieldValue;
              }
            },
            field: "title",
            width: "20%",
          },
          {
            headerContent: (
              <Text
                ellipsis={{ tooltip: "Start Date" }}
                style={{ fontSize: 10 }}
              >
                Start Date
              </Text>
            ),
            field: "startDate",
            width: "7%",
            cellContent: (e) => {
              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text
                    style={{
                      fontSize: e.resource.id.includes("total") ? 14 : 12,
                    }}
                    strong
                  >
                    {e.fieldValue}
                  </Text>
                );
              } else {
                return e.fieldValue;
              }
            },
            cellClassNames: "text-center",
          },
          {
            headerContent: (
              <Text ellipsis={{ tooltip: "End Date" }} style={{ fontSize: 10 }}>
                End Date
              </Text>
            ),
            field: "endDate",
            cellContent: (e) => {
              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text
                    style={{
                      fontSize: e.resource.id.includes("total") ? 14 : 12,
                    }}
                    strong
                  >
                    {e.fieldValue}
                  </Text>
                );
              } else {
                return e.fieldValue;
              }
            },
            cellClassNames: "text-center",
            width: "7%",
          },
          {
            headerContent: (
              <Text
                ellipsis={{ tooltip: "Duration in days" }}
                style={{ fontSize: 10 }}
              >
                Duration in days
              </Text>
            ),
            field: "durationInDays",
            width: "7%",
            cellContent: (e) => {
              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text style={{ fontSize: 13 }} strong>
                    {e.fieldValue}
                  </Text>
                );
              } else {
                return e.fieldValue;
              }
            },
            cellClassNames: "text-center",
          },
          {
            headerContent: (
              <Text
                ellipsis={{ tooltip: "% Completed" }}
                style={{ fontSize: 10 }}
              >
                % Completed
              </Text>
            ),
            field: "percentCompleted",
            width: "7%",
            cellClassNames: "text-center",

            cellContent: (e) => {
              const ONE_HUNDRED_PERCENT = 100;
              let hoursWorkedInSeconds =
                e.resource.extendedProps.hours_worked || 0;

              const sixtyMinsInSeconds = 3600;

              let hoursWorked = hoursWorkedInSeconds / sixtyMinsInSeconds;

              let dayConverted = hoursWorked / 8;

              let durationInDays =
                parseInt(e.resource.extendedProps.durationInDays) || 0;

              let daysWorkOverTargetDuration = dayConverted / durationInDays;

              if (daysWorkOverTargetDuration === Infinity) {
                daysWorkOverTargetDuration = 1;
              }

              if (isNaN(daysWorkOverTargetDuration)) {
                daysWorkOverTargetDuration = 0;
              }

              let percent = Math.ceil(
                daysWorkOverTargetDuration * ONE_HUNDRED_PERCENT
              );

              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text style={{ fontSize: 13 }} strong>
                    {percent === Infinity
                      ? ""
                      : `${
                          percent > ONE_HUNDRED_PERCENT
                            ? ONE_HUNDRED_PERCENT
                            : percent
                        }%`}
                  </Text>
                );
              } else {
                return percent === Infinity ? "" : `${percent}%`;
              }
            },
          },
          {
            cellClassNames: "text-center",

            headerContent: (
              <Text
                ellipsis={{ tooltip: "Remaining Days" }}
                style={{ fontSize: 10 }}
              >
                Remaining Days
              </Text>
            ),
            field: "remainingDays",
            width: "7%",
            cellContent: (e) => {
              let hoursWorkedInSeconds =
                e.resource.extendedProps.hours_worked || 0;

              let hoursWorked = hoursWorkedInSeconds / 3600;

              let dayConverted = hoursWorked / 8;

              let durationInDays =
                parseInt(e.resource.extendedProps.durationInDays) || 0;

              let remainingDays = durationInDays - dayConverted;

              remainingDays = parseFloat(remainingDays).toFixed(1);

              let [days, decimalDays] = remainingDays.split(".");

              if (decimalDays === "0") {
                remainingDays = days;
              }

              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text style={{ fontSize: 13 }} strong>
                    {remainingDays}
                  </Text>
                );
              } else {
                return remainingDays;
              }
            },
          },
          {
            headerContent: (
              <Text
                ellipsis={{ tooltip: "Completed Days" }}
                style={{ fontSize: 10 }}
              >
                Completed Days
              </Text>
            ),
            field: "completedDays",
            cellClassNames: "text-center",

            width: "7%",

            cellContent: (e) => {
              let hoursWorkedInSeconds =
                e.resource.extendedProps.hours_worked || 0;

              let hoursWorked = hoursWorkedInSeconds / 3600;

              let dayConverted = hoursWorked / 8;

              dayConverted = parseFloat(dayConverted).toFixed(1);

              let [days, decimalDays] = dayConverted.split(".");

              if (decimalDays === "0") {
                dayConverted = days;
              }

              if (e.resource.extendedProps.isTotal) {
                return (
                  <Text style={{ fontSize: 13 }} strong>
                    {dayConverted}
                  </Text>
                );
              } else {
                return dayConverted;
              }
            },
          },
        ]}
        plugins={[
          dayGridPlugin,
          resourceTimelinePlugin,
          interactionPlugin,
          adaptivePlugin,
        ]}
        drop={(e) => handleDrop(e, { organization_id, clientId, projectId })}
        eventDrop={eventDrop}
        eventResize={eventResize}
        initialDate={dayjs.utc().toDate()}
        resourceAreaWidth="50%"
        firstDay={1}
        droppable={false}
        editable={true}
        nowIndicator={true}
        timeZone="UTC"
        eventContent={(info) => {
          let avatarUrl = "";

          if (info.event.extendedProps["data-event"]) {
            avatarUrl = JSON.parse(
              info.event.extendedProps["data-event"]
            ).avatarUrl;
          } else {
            avatarUrl = info.event.extendedProps.avatarUrl;
          }

          let url = `https://i.pravatar.cc/150?img=4`;

          return (
            <Text ellipsis={true}>
              <Avatar src={url} /> {info.event?.title}
            </Text>
          );
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
      />
    </Card>
  );
};

export default GanttCalendar;
