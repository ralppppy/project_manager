import dayjs from "dayjs";
import { GanttChartServices } from "../services";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  setFilterModalOpen,
  setFilterToggleResourcesWithEvents,
  setModules,
  setStartEndDate,
  setSummaryModalOpen,
  setUsers,
  setUsersDropdownFilter,
} from "../models/GanttChartModel";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const GanttChartController = ({ calendar, dispatch }) => {
  const {
    getGanttChartResources,
    createGanttChartData,
    getGanttChartData,
    updateGanttChartData,
    getModuleDropdownDataService,
    getUserDropdownDataService,
    getDeparmentsWithUsers,
    getSummary,
  } = GanttChartServices();

  const getMinAndMaxDate = (theSameEventResource) => {
    let minStartDateOrig = dayjs.utc("9999-12-31"); // A very high date as initial value
    let maxEndDateOrig = dayjs.utc("0000-01-01"); // A very low date as initial value
    let minStartDate = dayjs.utc("9999-12-31"); // A very high date as initial value
    let maxEndDate = dayjs.utc("0000-01-01"); // A very low date as initial value

    // Use reduce to find the min start and max end
    theSameEventResource.reduce((prev, curr) => {
      // Compare the start date of the current object with the min start
      let currentStart = dayjs.utc(curr.startStr).startOf("day");
      if (currentStart < minStartDate) {
        minStartDate = currentStart;
      }

      // Compare the end date of the current object with the max end

      let currentEnd = curr.endStr
        ? dayjs.utc(curr.endStr).endOf("day")
        : dayjs.utc(curr.startStr).endOf("day");
      if (currentEnd > maxEndDate) {
        maxEndDate = currentEnd;
      }

      // Return the current object (not used in this example)
      return curr;
    }, {});

    minStartDate = minStartDate.isSame(minStartDateOrig) ? null : minStartDate;
    maxEndDate = maxEndDate.isSame(maxEndDateOrig) ? null : maxEndDate;

    return [minStartDate, maxEndDate];
  };
  const getMinAndMaxDate2 = (
    theSameEventResource,
    targetStartKey = "startDate",
    targetEndKey = "endDate",
    isSummary = false
  ) => {
    let format = isSummary ? null : "MM-DD-YYYY";

    let minStartDateOrig = dayjs.utc("9999-12-31"); // A very high date as initial value
    let maxEndDateOrig = dayjs.utc("0000-01-01"); // A very low date as initial value
    let minStartDate = dayjs.utc("9999-12-31"); // A very high date as initial value
    let maxEndDate = dayjs.utc("0000-01-01"); // A very low date as initial value

    // Use reduce to find the min start and max end
    theSameEventResource
      .filter((c) => c[targetStartKey] && c[targetEndKey])
      .reduce((prev, curr) => {
        // Compare the start date of the current object with the min start

        let currentStart = dayjs
          .utc(curr[targetStartKey], format)
          .startOf("day");

        if (currentStart < minStartDate) {
          minStartDate = currentStart;
        }

        // Compare the end date of the current object with the max end

        let currentEnd = curr[targetEndKey]
          ? dayjs.utc(curr[targetEndKey], format).endOf("day")
          : dayjs.utc(curr[targetStartKey], format).endOf("day");
        if (currentEnd > maxEndDate) {
          maxEndDate = currentEnd;
        }

        // Return the current object (not used in this example)
        return curr;
      }, {});

    minStartDate = minStartDate.isSame(minStartDateOrig) ? null : minStartDate;
    maxEndDate = maxEndDate.isSame(maxEndDateOrig) ? null : maxEndDate;

    return [minStartDate, maxEndDate];
  };

  const buildTotalRowResource = (
    overAllTotal,
    [startDate, endDate],
    allTotalHoursWorked
  ) => {
    return {
      id: "atotal-1",
      title: "Summary",
      eventAllow: () => false,
      startDate: startDate?.format("MM-DD-YYYY"),
      endDate: endDate?.format("MM-DD-YYYY"),
      resourcesInitiallyExpanded: false,
      filterResourcesWithEvents: false, // Enable resource filtering
      children: [],
      hours_worked: allTotalHoursWorked,
      durationInDays: overAllTotal,
      isTotal: true,
      businessHours: {
        daysOfWeek: [],
      },
    };
  };

  const handleGetGantChartResources = async (
    organization_id,
    { clientId, projectId },
    { startDate, endDate },
    modulesDropdownFilter
  ) => {
    let [{ data }, error] = await getGanttChartResources({
      organization_id,
      clientId,
      projectId,
      startDate,
      endDate,
      modulesDropdownFilter,
    });

    let overAllTotal = 0;

    let allReSources = [];

    let allTotalHoursWorked = 0;

    let newData = data.map((d) => {
      let allModuleChildResources = [];
      let totalDays = 0;

      let totalHoursWorked = 0;

      let totalChildDays = 0;

      d.children.forEach((child) => {
        totalDays += parseInt(child.durationInDays);

        totalHoursWorked += child.hours_worked || 0;

        allReSources.push(child);
        allModuleChildResources.push(child);

        child.children.forEach((cc) => {
          totalHoursWorked += cc.hours_worked || 0;

          allReSources.push(cc);
          allModuleChildResources.push(child);

          totalChildDays += parseInt(cc.durationInDays);
        });
      });

      let totalModuleDays = totalDays + totalChildDays;

      overAllTotal += totalModuleDays;

      allTotalHoursWorked += totalHoursWorked;

      let [startDate, endDate] = getMinAndMaxDate2(allModuleChildResources);

      return {
        ...d,
        id: `module-${d.id}`,
        eventAllow: () => false,
        resourcesInitiallyExpanded: false,
        durationInDays: totalModuleDays,
        startDate: startDate?.format("MM-DD-YYYY"),
        endDate: endDate?.format("MM-DD-YYYY"),
        isTotal: true,
        hours_worked: totalHoursWorked,
        businessHours: {
          daysOfWeek: [], // Mon,Wed,Fri
        },
      };
    });

    let totalMaxAndEndDate = getMinAndMaxDate2(allReSources);

    let totalSummary = buildTotalRowResource(
      overAllTotal,
      totalMaxAndEndDate,
      allTotalHoursWorked
    );

    newData.push(totalSummary);

    return newData;
  };

  const calculateTotalDays = (events) => {
    let totalDays = events.reduce((current, next) => {
      let currentDayTotal = next.endStr
        ? dayjs.utc(next.endStr).diff(next.startStr, "day") + 1
        : 1;

      return current + currentDayTotal;
    }, 0);

    return totalDays;
  };

  // const updateResourceSummaryAction = (theSameEventResource, resource) => {
  //   let [minStartDate, maxEndDate] = getMinAndMaxDate(theSameEventResource);

  //   let totalDays = calculateTotalDays(theSameEventResource);

  //   minStartDate = minStartDate ? minStartDate.format("MM-DD-YYYY") : null;
  //   maxEndDate = maxEndDate
  //     ? maxEndDate.add(1, "day").format("MM-DD-YYYY")
  //     : null;

  //   resource.setProp("startDate", minStartDate);
  //   resource.setProp("endDate", maxEndDate);
  //   resource.setExtendedProp("durationInDays", totalDays || "0");

  //   return totalDays;
  // };

  const updateResourceAction = (theSameEventResource, resource) => {
    let [minStartDate, maxEndDate] = getMinAndMaxDate(theSameEventResource);

    let totalDays = calculateTotalDays(theSameEventResource);

    minStartDate = minStartDate ? minStartDate.format("MM-DD-YYYY") : null;
    maxEndDate = maxEndDate
      ? maxEndDate.add(1, "day").format("MM-DD-YYYY")
      : null;

    resource.setProp("startDate", minStartDate);
    resource.setProp("endDate", maxEndDate);

    resource.setExtendedProp("durationInDays", totalDays || "0");
    return totalDays;
  };

  const getResourceTotalModule = (
    resource,
    module_id,
    currentResource,
    totalDays
  ) => {
    let child = resource.filter((c) => {
      return (
        parseInt(c.extendedProps.module_id) === parseInt(module_id) &&
        parseInt(c.id) !== parseInt(currentResource.id) &&
        !c.extendedProps.isTotal
      );
    });

    let newTotal = child.reduce((current, next) => {
      return current + parseInt(next.extendedProps.durationInDays);
    }, 0);

    let currentModuleParent = resource.find((c) => {
      let [_, modId] = c.id.split("-");
      return parseInt(modId) === parseInt(module_id);
    });
    currentModuleParent.setExtendedProp(
      "durationInDays",
      parseInt(newTotal) + parseInt(totalDays)
    );
  };

  const handleDrop = async (e, { organization_id, clientId, projectId }) => {
    let userData = e.draggedEl.getAttribute("data-event");

    userData = JSON.parse(userData);
    let { module_id } = e.resource._resource.extendedProps;

    let start_date = dayjs.utc(e.dateStr).toISOString();
    let end_date = dayjs.utc(e.dateStr).endOf("day").toISOString();

    let params = {
      organization_id,
      client_id: clientId,
      project_id: projectId,
      module_id,
      task_id: e.resource._resource.id,
      user_id: userData.id,
      start_date,
      end_date,
    };

    let [{ data }, error] = await createGanttChartData(params);

    if (!error) {
      let updateThisEvent = e.resource._context.calendarApi
        .getEvents()
        .find((c) => !c.id);
      updateThisEvent.setProp("id", data.id);
      updateThisEvent.setExtendedProp("id", data.user_id);
      updateThisEvent.setExtendedProp("module_id", data.module_id);

      updateThisEvent.setDates(start_date, end_date);

      let theSameEventResource = e.resource._context.calendarApi
        .getEvents()
        .filter(
          (c) => parseInt(c._def.resourceIds[0]) === parseInt(data.task_id)
        );

      const resourceParentSummary =
        e.resource._context.calendarApi.getResourceById(
          `module-${e.resource.extendedProps.module_id}`
        );
      let theSameParentModule = e.resource._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            parseInt(c.extendedProps.module_id) ===
            parseInt(e.resource.extendedProps.module_id)
        );

      theSameParentModule.push(updateThisEvent);

      updateResourceAction(theSameParentModule, resourceParentSummary);

      const resourceSummary =
        e.resource._context.calendarApi.getResourceById("atotal-1");

      let allEventResource = e.resource._context.calendarApi.getEvents();

      updateResourceAction(allEventResource, resourceSummary);

      let totalDays = updateResourceAction(theSameEventResource, e.resource);

      getResourceTotalModule(
        e.resource._context.calendarApi.getResources(),
        module_id,
        e.resource,
        totalDays
      );
    }
  };

  const handleGetEvents = async (
    { organization_id, clientId, projectId },
    { startDate, endDate }
  ) => {
    let [{ data }, error] = await getGanttChartData({
      organization_id,
      clientId,
      projectId,
      startDate,
      endDate,
    });

    return data;
  };

  const eventResize = async (e) => {
    let startDate = e.event.startStr;
    let endDate = e.event.endStr;
    let id = e.event.id;

    let [{ data }, error] = await updateGanttChartData(id, {
      start_date: startDate,
      end_date: endDate,
    });

    if (!error) {
      const resource = e.event._context.calendarApi.getResourceById(
        e.event._def.resourceIds[0]
      );

      const resourceSummary =
        e.event._context.calendarApi.getResourceById("atotal-1");
      const resourceParentSummary =
        e.event._context.calendarApi.getResourceById(
          `module-${resource.extendedProps.module_id}`
        );

      let theSameEventResource = e.event._context.calendarApi
        .getEvents()
        .filter((c) => c._def.resourceIds[0] === e.event._def.resourceIds[0]);

      let theSameParentModule = e.event._context.calendarApi
        .getEvents()
        .filter(
          (c) =>
            parseInt(c.extendedProps.module_id) ===
            parseInt(resource.extendedProps.module_id)
        );

      //Making sure that the new dropped event will be added to the array of events
      //If the event is not a newly dropped event, it does not matter.
      theSameParentModule.push(e.event);

      let allEventResource = e.event._context.calendarApi.getEvents();

      updateResourceAction(allEventResource, resourceSummary);

      updateResourceAction(theSameParentModule, resourceParentSummary);

      let totalDays = updateResourceAction(theSameEventResource, resource);

      let module_id = resource.extendedProps.module_id;

      getResourceTotalModule(
        e.event._context.calendarApi.getResources(),
        module_id,
        resource,
        totalDays
      );
    }
  };

  const eventDrop = async (e) => {
    let currentEventId = e.event.id;
    let currentResource = e.event._def.resourceIds[0];
    let currentResourceOld = e.oldEvent._def.resourceIds[0];
    const resource =
      e.event._context.calendarApi.getResourceById(currentResource);

    const oldResource =
      e.oldEvent._context.calendarApi.getResourceById(currentResourceOld);

    let module_id = resource.extendedProps.module_id;
    let module_id_old = oldResource.extendedProps.module_id;
    let start_date = e.event.startStr;
    let end_date = e.event.endStr;

    let [{ data }, error] = await updateGanttChartData(currentEventId, {
      task_id: currentResource,
      start_date: start_date,
      end_date,
      module_id: module_id,
    });

    //Set new module_id for this event
    e.event.setExtendedProp("module_id", module_id);

    let theSameEventResource = e.event._context.calendarApi
      .getEvents()
      .filter(
        (c) => parseInt(c._def.resourceIds[0]) === parseInt(currentResource)
      );

    let theSameEventResourceOld = e.oldEvent._context.calendarApi
      .getEvents()
      .filter(
        (c) => parseInt(c._def.resourceIds[0]) === parseInt(currentResourceOld)
      );

    let totalDays = updateResourceAction(theSameEventResource, resource);

    //START
    const resourceParentSummary = e.event._context.calendarApi.getResourceById(
      `module-${module_id}`
    );
    const resourceParentSummaryOld =
      e.event._context.calendarApi.getResourceById(`module-${module_id_old}`);

    let theSameParentModule = e.event._context.calendarApi
      .getEvents()
      .filter(
        (c) => parseInt(c.extendedProps.module_id) === parseInt(module_id)
      );
    let theSameParentModuleOld = e.event._context.calendarApi
      .getEvents()
      .filter(
        (c) => parseInt(c.extendedProps.module_id) === parseInt(module_id_old)
      );

    updateResourceAction(theSameParentModule, resourceParentSummary);
    updateResourceAction(theSameParentModuleOld, resourceParentSummaryOld);
    //END

    let totalDaysOld = updateResourceAction(
      theSameEventResourceOld,
      oldResource
    );

    const resourceSummary =
      e.event._context.calendarApi.getResourceById("atotal-1");

    let allEventResource = e.event._context.calendarApi.getEvents();

    updateResourceAction(allEventResource, resourceSummary);

    getResourceTotalModule(
      e.event._context.calendarApi.getResources(),
      module_id,
      resource,
      totalDays
    );
    getResourceTotalModule(
      e.event._context.calendarApi.getResources(),
      module_id_old,
      oldResource,
      totalDaysOld
    );
  };

  const handleSetStartEndDate = (params) => {
    dispatch(setStartEndDate(params));
  };

  const handleFilterModule = (value) => {
    dispatch(setModules(value));
  };

  const handleFilterUser = (value) => {
    dispatch(setUsers(value));
  };

  const handleGetModuleDropdownData = async ({
    organization_id,
    clientId,
    projectId,
    modulesDropdownFilter,
  }) => {
    let [{ data }, error] = await getModuleDropdownDataService({
      organization_id,
      clientId,
      projectId,
      modulesDropdownFilter,
    });

    return data;
  };
  const handleGetUsersDropdownData = async ({
    organization_id,
    clientId,
    projectId,
    modulesDropdownFilter,
  }) => {
    let [{ data }, error] = await getUserDropdownDataService({
      organization_id,
      clientId,
      projectId,
      modulesDropdownFilter,
    });

    return data;
  };

  const handleGetUserGanttInserted = (events) => {
    // Create a Set to store unique IDs
    const uniqueIds = new Set();

    // Use the filter method to filter the array based on unique IDs
    let uniqueArray = events?.filter((obj) => {
      if (!uniqueIds.has(obj.user_id)) {
        uniqueIds.add(obj.user_id);
        return true; // Include this object in the result
      }
      return false; // Skip this object as it's a duplicate
    });

    uniqueArray = uniqueArray?.map((c) => ({
      id: c.user_id,
      value: c.user_id,
      label: c.title,
    }));

    dispatch(setUsersDropdownFilter(uniqueArray));
  };

  const handleFilterResourcesWithEvents = () => {
    dispatch(setFilterToggleResourcesWithEvents());
  };

  const handleFilterModalOpen = (filterModalOpen) => {
    dispatch(setFilterModalOpen(filterModalOpen));
  };

  const handleGetSummary = async ({ organization_id, clientId, projectId }) => {
    let [data, error] = await getSummary({
      organization_id,
      clientId,
      projectId,
    });

    return data;
  };

  const handlSummaryModalOpen = (summaryModalOpen) => {
    dispatch(setSummaryModalOpen(summaryModalOpen));
  };

  const handleGetDeparmentsWithUsers = async ({ organization_id }) => {
    let [data, error] = await getDeparmentsWithUsers({
      organization_id,
    });

    return data;
  };

  return {
    handleGetGantChartResources,
    handleDrop,
    handleGetEvents,
    eventResize,
    eventDrop,
    handleSetStartEndDate,
    handleGetModuleDropdownData,
    handleFilterModule,
    handleGetUserGanttInserted,
    handleFilterUser,
    handleFilterResourcesWithEvents,
    handleFilterModalOpen,
    handleGetUsersDropdownData,
    handleGetSummary,
    getMinAndMaxDate2,
    handlSummaryModalOpen,
    handleGetDeparmentsWithUsers,
  };
};

export default GanttChartController;
