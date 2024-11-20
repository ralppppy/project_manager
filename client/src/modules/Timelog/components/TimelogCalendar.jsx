import React, { useEffect } from "react";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import adaptivePlugin from "@fullcalendar/adaptive";
import { Card, DatePicker, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { TimelogController } from "../controllers";
import { secondsToHHMM } from "../../../common/TimeHelper";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import TaskContent from "./TaskContent";

dayjs.extend(utc);
dayjs.extend(timezone);
const { Text } = Typography;
const TimelogCalendar = ({ calendar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleGetTimelogResources,
    handleDrop,
    eventDrop,
    eventResize,
    handleSetStartEndDate,
    handleGetTimelogEvents,
  } = TimelogController({
    dispatch,
    queryClient,
    navigate,
    calendar,
  });
  const { startDate, endDate } = useSelector((state) => state.timelog);
  const user_id = useSelector((state) => state.login.user.id);

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const QUERY_KEY_TIMELOG_RESOURCE = [
    "timelog_resource",
    organization_id,
    user_id,
    startDate,
    endDate,
  ];

  const QUERY_KEY_TIMELOG_EVENT = [
    "timelog_event",
    organization_id,
    startDate,
    endDate,
  ];

  const { data: resources, isFetching } = useQuery({
    queryKey: QUERY_KEY_TIMELOG_RESOURCE,
    queryFn: () =>
      handleGetTimelogResources(organization_id, user_id, startDate, endDate),
    refetchOnWindowFocus: false,
    enabled: !!organization_id || !!user_id,
    staleTime: 10,
    keepPreviousData: true,
  });

  const { data: events } = useQuery({
    queryKey: QUERY_KEY_TIMELOG_EVENT,
    queryFn: () =>
      handleGetTimelogEvents(
        { organization_id },
        { startDate, endDate },
        user_id
      ),
    refetchOnWindowFocus: false, // default: true
    enabled: !!organization_id && !!startDate && !!endDate,
    keepPreviousData: true,
    staleTime: 10,
  });

  useEffect(() => {
    setTimeout(() => {
      calendar?.current.calendar.setOption("height", "auto");
    }, 100);
  }, []);

  return (
    <Card>
      <div className="d-flex justify-content-end">
        <DatePicker
          defaultValue={dayjs.utc(startDate)}
          className="mb-2"
          onChange={(e) => {
            calendar?.current
              ?.getApi()
              .gotoDate(dayjs.utc(e).startOf("day").toISOString());
            handleSetStartEndDate({
              startDate: dayjs.utc(e).startOf("day").toISOString(),
              endDate: dayjs.utc(e).endOf("day").toISOString(),
            });
          }}
        />
      </div>
      <FullCalendar
        slotMaxTime={"22:00"}
        slotMinTime={"06:00"}
        ref={calendar}
        height={"50vh"}
        expandRows={false}
        schedulerLicenseKey={"0911877386-fcs-1533626271"}
        eventOverlap={true}
        resourcesInitiallyExpanded={true}
        resources={resources}
        events={events}
        initialDate={dayjs.utc(startDate).toDate()}
        // initialDate={dayjs.utc().toDate()}
        initialView="resourceTimelineDay"
        headerToolbar={{
          left: "today prev,next",
          center: "title",
          right: "resourceTimelineDay,dayGridMonth",
        }}
        plugins={[
          dayGridPlugin,
          resourceTimelinePlugin,
          interactionPlugin,
          adaptivePlugin,
        ]}
        resourceAreaWidth="30%"
        firstDay={1}
        droppable={false}
        editable={true}
        slotDuration={"00:15:00"}
        slotMinWidth={15}
        timeZone={"UTC"}
        // resourceLabelContent={(info) => {
        //   if (info.resource.id) {
        //     return (
        //       <>
        //         <Avatar
        //           src={`https://i.pravatar.cc/150?img=${info.resource.extendedProps.index}`}
        //         />{" "}
        //         <Text>{info.resource.title}</Text>
        //       </>
        //     );
        //   } else {
        //     return <Text>{info.resource.title}</Text>;
        //   }
        // }}
        eventContent={(info) => {
          return <TaskContent info={info} />;
        }}
        resourceAreaColumns={[
          {
            headerContent: <Text style={{ fontSize: 12 }}>Teams</Text>,
            cellContent: (e) => {
              return e.fieldValue;
            },
            field: "title",
            width: "2%",
          },
          {
            headerContent: <Text style={{ fontSize: 12 }}>Hours Worked</Text>,
            cellContent: (e) => {
              if (!e.resource._resource.extendedProps.groupId) {
                return secondsToHHMM(e.resource.extendedProps.hours_worked);
              }
            },
            field: "title",
            width: "1%",
          },
        ]}
        drop={(e) => handleDrop(e)}
        eventDrop={eventDrop}
        eventResize={eventResize}
        datesSet={(e) => {
          handleSetStartEndDate({ startDate: e.startStr, endDate: e.endStr });
        }}
      />
    </Card>
  );
};

export default TimelogCalendar;
