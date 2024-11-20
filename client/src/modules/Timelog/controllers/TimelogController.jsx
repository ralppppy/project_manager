import { TimelogServices } from "../services";
import { CalendarOutlined } from "@ant-design/icons";
import { setFilterDate, setStartEndDate } from "../models/TimelogModel";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import { Popover, Typography } from "antd";
import { AddTaskPopover } from "../components";
import { Suspense } from "react";

const { Text } = Typography;

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const {
  getUserTimelogTreeService,
  getUserFilterTimelogTreeService,
  getTimelogResources,
  getStatusFilterService,
  createTimelogData,
  getTimelogEvents,
  updateTimelogData,
  deleteTimelog,
} = TimelogServices();

const TimelogController = ({ dispatch, form, calendar, messageApi }) => {
  const getContrast = (hexcolor) => {
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === "#") {
      hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
      hexcolor = hexcolor
        .split("")
        .map(function (hex) {
          return hex + hex;
        })
        .join("");
    }

    // Convert to RGB value
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? "black" : "white";
  };

  const updateResource = (userEvents, resource) => {
    let hours_worked = userEvents.reduce((current, next) => {
      return current + parseInt(next.extendedProps.hours_worked);
    }, 0);
    resource?.setExtendedProp("hours_worked", hours_worked);
  };

  const handleUpdateTimelog = async (info, values) => {
    let { timelog_update_start, timelog_update_end, timelog_update_id } =
      values;

    let start_date = dayjs.utc(timelog_update_start).toISOString();
    let end_date = dayjs.utc(timelog_update_end).toISOString();

    let hours_worked = dayjs(end_date).diff(dayjs(start_date)) / 1000;
    let [{ data }, error] = await updateTimelogData(timelog_update_id, {
      hours_worked,
      start_date,
      end_date,
    });

    if (!error) {
      info.event.setDates(start_date, end_date);
      info.event.setExtendedProp("hours_worked", hours_worked);
      const resource = info.event._context.calendarApi.getResourceById(
        info.event._def.resourceIds[0]
      );

      let userEvents = info.event._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >= dayjs.utc(start_date).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(start_date).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(resource.id)
        );

      updateResource(userEvents, resource);
    }
  };

  const handleDeleteTimelog = async (info, organization_id) => {
    let params = {
      timelog_id: parseInt(info.event.id),
      organization_id,
    };

    let [{ data }, error] = await deleteTimelog(params);

    if (!error) {
      const resource = info.event._context.calendarApi.getResourceById(
        info.event._def.resourceIds[0]
      );

      let hours_worked = info.event.extendedProps.hours_worked;
      resource?.setExtendedProp(
        "hours_worked",
        parseInt(resource.extendedProps.hours_worked) - parseInt(hours_worked)
      );

      info.event.remove();
    }
  };
  const handleAddTimelog = async ({ values, task, user_id }) => {
    let { timelog_date, timelog_start, timelog_end } = values;

    if (!timelog_date || !timelog_start || !timelog_end) {
      messageApi.open({
        type: "error",
        content: `Invalid Start Time or End Time!`,
      });
      return;
    } else if (timelog_start >= timelog_end) {
      messageApi.open({
        type: "error",
        content: `Invalid Start Time or End Time!`,
      });
      return;
    }

    let calendarApi = calendar?.current?.getApi();

    let { client_id, id, organization_id, project_id, module_id } = task;
    let start_time = dayjs(timelog_start).format("HH:mm");
    let end_time = dayjs(timelog_end).format("HH:mm");
    let [startHour, startMin] = start_time.split(":");
    let [endHour, endMin] = end_time.split(":");
    let start_date = dayjs
      .utc(timelog_date)
      .set("hour", startHour)
      .set("minute", startMin)
      .toISOString();
    let end_date = dayjs
      .utc(timelog_date)
      .set("hour", endHour)
      .set("minute", endMin)
      .toISOString();

    //hours_worked in seconds
    let hours_worked = dayjs(end_date).diff(dayjs(start_date)) / 1000;

    let params = {
      organization_id,
      client_id,
      project_id,
      module_id,
      task_id: id,
      start_date,
      end_date,
      hours_worked,
      user_id,
    };

    let [{ data }, error] = await createTimelogData(params);

    if (!error) {
      let newTimelog = {
        resourceId: user_id,
        start: start_date,
        end: end_date,
        task_id: id,
        hours_worked,
        title: `${id} - ${task.title}`,
        editable: true,
      };
      calendarApi.addEvent(newTimelog);

      let updateThisEvent = calendarApi.getEvents().find((c) => !c.id);

      updateThisEvent.setProp("id", data.id);
      let resource = calendarApi.getResourceById(user_id);

      let userEvents = calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >=
              dayjs.utc(timelog_date).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(timelog_date).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(resource.id)
        );

      updateResource(userEvents, resource);

      messageApi.open({
        type: "success",
        content: `Timelog added!`,
      });

      form.resetFields();
    }
  };

  const handleDrop = async (e) => {
    let taskData = e.draggedEl.getAttribute("data-event");
    taskData = JSON.parse(taskData);
    let { client_id, id, organization_id, project_id, module_id } = taskData;
    let start_date = dayjs.utc(e.dateStr).toISOString();
    let end_date = dayjs.utc(e.dateStr).add(1, "hour").toISOString();

    let user_id = parseInt(e.resource._resource.id);
    // Convert the duration to seconds
    let hours_worked = dayjs(end_date).diff(dayjs(start_date)) / 1000;
    let params = {
      organization_id,
      client_id,
      project_id,
      module_id,
      task_id: id,
      start_date,
      end_date,
      hours_worked,
      user_id,
    };

    let [{ data }, error] = await createTimelogData(params);

    if (!error) {
      let updateThisEvent = e.resource._context.calendarApi
        .getEvents()
        .find((c) => !c.id);

      const resource = e.resource;
      updateThisEvent.setProp("id", data.id);
      updateThisEvent.setExtendedProp("hours_worked", hours_worked);
      updateThisEvent.setEnd(end_date);

      let userEvents = e.resource._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >= dayjs.utc(e.dateStr).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(e.dateStr).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(resource.id)
        );

      updateResource(userEvents, resource);
    }
  };

  const eventResize = async (e) => {
    let startDate = e.event.startStr;
    let endDate = e.event.endStr;
    let id = e.event.id;
    let hours_worked = dayjs(endDate).diff(dayjs(startDate)) / 1000;
    let [{ data }, error] = await updateTimelogData(id, {
      hours_worked,
      start_date: startDate,
      end_date: endDate,
    });

    if (!error) {
      e.event.setExtendedProp("hours_worked", hours_worked);
      const resource = e.event._context.calendarApi.getResourceById(
        e.event._def.resourceIds[0]
      );

      let userEvents = e.event._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >= dayjs.utc(startDate).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(startDate).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(resource.id)
        );

      updateResource(userEvents, resource);
    }
  };

  const eventDrop = async (e) => {
    let currentEventId = e.event.id;
    let currentResourceId = e.event._def.resourceIds[0];

    let oldResourceId = e?.oldResource?.id;

    let start_date = e.event.startStr;
    let end_date = e.event.endStr;

    let hours_worked = dayjs(end_date).diff(dayjs(start_date)) / 1000;

    let [{ data }, error] = await updateTimelogData(currentEventId, {
      hours_worked,
      user_id: currentResourceId,
      start_date,
      end_date,
    });

    if (!error) {
      e.event.setExtendedProp("hours_worked", hours_worked);

      const oldResource =
        e.oldEvent._context.calendarApi.getResourceById(oldResourceId);

      let oldUserEvents = e.event._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >= dayjs.utc(start_date).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(start_date).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(oldResource?.id)
        );

      updateResource(oldUserEvents, oldResource);

      const resource = e.event._context.calendarApi.getResourceById(
        e.event._def.resourceIds[0]
      );
      let currentUserEvents = e.event._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            c.startStr >= dayjs.utc(start_date).startOf("day").toISOString() &&
            c.endStr <= dayjs.utc(start_date).endOf("day").toISOString() &&
            parseInt(c._def.resourceIds[0]) === parseInt(resource.id)
        );
      updateResource(currentUserEvents, resource);
    }
  };
  const handleGetTimelogEvents = async (
    { organization_id },
    { startDate, endDate },
    user_id
  ) => {
    let [{ data }, error] = await getTimelogEvents({
      organization_id,
      startDate,
      endDate,
    });

    data = data.map((event) => {
      return { ...event, editable: event.resourceId === user_id };
    });
    return data;
  };

  const handleGetTimelogResources = async (
    organization_id,
    user_id,
    startDate,
    endDate
  ) => {
    let params = { organization_id, user_id, startDate, endDate };

    let [{ data }, error] = await getTimelogResources(params);

    data = data.map((c) => {
      let children = c.children.map((resourceItem) => {
        let { hours_worked } = resourceItem.user;

        return {
          ...resourceItem,
          hours_worked,
          eventAllow: () => user_id === resourceItem.user.id,
        };
      });
      return {
        ...c,
        children,
        eventAllow: () => false,
        businessHours: {
          daysOfWeek: [],
        },
      };
    });
    return data;
  };

  const handleSetStartEndDate = (params) => {
    dispatch(setStartEndDate(params));
  };

  const handleChangeDateFilter = (value) => {
    let start = dayjs.utc(value[0]).startOf("day").toISOString();
    let end = dayjs.utc(value[1]).endOf("day").toISOString();

    let payload = { start, end };
    dispatch(setFilterDate(payload));
  };

  const handleSearch = (treeData, search, filterStatusOptions) => {
    if (treeData) {
      let filteredData = treeData
        .map((c) => {
          let filteredProjects = c.children
            .map((p) => {
              let filteredModules = p.children
                .map((m) => {
                  let filteredTasks = m.children.filter((t) => {
                    if (filterStatusOptions.includes("All")) {
                      return t.searchTitle
                        .toLowerCase()
                        .includes(search.toLowerCase());
                    } else {
                      return (
                        t.searchTitle
                          .toLowerCase()
                          .includes(search.toLowerCase()) &&
                        filterStatusOptions.includes(t.task_status_id)
                      );
                    }
                  });

                  // Only include the module if it has matching tasks
                  if (filteredTasks.length > 0) {
                    return {
                      ...m,
                      children: filteredTasks, // Assign the filtered tasks to the module
                    };
                  } else {
                    return null; // Exclude the module if it has no matching tasks
                  }
                })
                .filter(Boolean); // Remove null values (modules with no matching tasks)

              // Only include the project if it has matching modules
              if (filteredModules.length > 0) {
                return {
                  ...p,
                  children: filteredModules, // Assign the filtered modules to the project
                };
              } else {
                return null; // Exclude the project if it has no matching modules
              }
            })
            .filter(Boolean); // Remove null values (projects with no matching modules)

          // Only include the category if it has matching projects
          if (filteredProjects.length > 0) {
            return {
              ...c,
              children: filteredProjects, // Assign the filtered projects to the category
            };
          } else {
            return null; // Exclude the category if it has no matching projects
          }
        })
        .filter(Boolean); // Remove null values (categories with no matching projects)

      // filteredData now contains the filtered structure with only matching tasks

      return filteredData;
    }
  };

  const handleGetStatusSelectData = async (organization_id) => {
    let params = { organization_id };
    let [{ data }, error] = await getStatusFilterService(params);

    return data;
  };

  const handleGetUserTreeData = async (
    organization_id,
    user_id,
    filterDate
  ) => {
    let params = { organization_id, user_id, filterDate };

    let [{ data }, error] = await getUserTimelogTreeService(params);
    return data;
  };
  const handleGetUserFilterTreeData = async (
    organization_id,
    user_id,
    filter,
    filterDate
  ) => {
    let params = { organization_id, user_id, filter, filterDate };

    let [{ data }, error] = await getUserFilterTimelogTreeService(params);

    const modifiedData = data.map((client) => ({
      ...client,
      children: client.children.map((project) => ({
        ...project,
        children: project.children.map((moduleItem) => ({
          ...moduleItem,
          children: moduleItem.children.map((task) => {
            return {
              ...task,
              searchTitle: `${task.id} - ${task.title}`,
              title: (
                <Suspense fallback={<></>}>
                  <Popover
                    content={<AddTaskPopover task={task} calendar={calendar} />}
                    title={`${task.id} - ${task.title}`}
                    trigger={"click"}
                  >
                    <Text
                      ellipsis={{
                        tooltip: task.title,
                      }}
                      style={{ width: "120px" }}
                    >
                      <CalendarOutlined /> {task.id} - {task.title}
                    </Text>
                  </Popover>
                </Suspense>
              ),
              key: `task_${task.id}`,
              isLeaf: true,
              className: "fc-event",
              "data-event": JSON.stringify({
                ...task,
              }),
            };
          }),
        })),
      })),
    }));

    return modifiedData;
  };

  return {
    handleGetTimelogResources,
    handleGetUserFilterTreeData,
    handleGetStatusSelectData,
    handleGetUserTreeData,
    handleChangeDateFilter,
    handleSearch,
    handleDrop,
    eventDrop,
    eventResize,
    handleGetTimelogEvents,
    handleSetStartEndDate,
    handleAddTimelog,
    handleUpdateTimelog,
    handleDeleteTimelog,
    getContrast,
  };
};

export default TimelogController;
