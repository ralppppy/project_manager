import { Spin, Tree } from "antd";
import React, { useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";
import { TimelogController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

const openKeys = (treeData) => {
  let defaultKeys = [];
  treeData?.forEach((c) => {
    defaultKeys.push(c.key);
    c.children.forEach((d) => {
      defaultKeys.push(d.key);
    });
  });
  return defaultKeys;
};

const FeedbackTree = ({ calendar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const filterDate = useSelector((state) => state.timelog.filterDate);
  const filterDataOptions = useSelector(
    (state) => state.timelog.filterDataOptions
  );
  const search = useSelector((state) => state.timelog.search);
  const user_id = useSelector((state) => state.login.user.id);
  const QUERY_KEY_TIMELOG_TREE = [
    "timelog_tree",
    organization_id,
    user_id,
    filterDataOptions,
    filterDate,
  ];

  const { handleGetUserFilterTreeData, handleSearch } = TimelogController({
    dispatch,
    queryClient,
    navigate,
    calendar,
  });

  const filterStatusOptions = useSelector(
    (state) => state.timelog.filterStatusOptions
  );

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEY_TIMELOG_TREE,
    queryFn: () =>
      handleGetUserFilterTreeData(
        organization_id,
        user_id,
        filterDataOptions,
        filterDate
      ),
    retry: false,
    enabled: !!organization_id || !!user_id,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  const filteredData = handleSearch(data, search, filterStatusOptions);

  useEffect(() => {
    var containerEl = document.getElementById("external-events-feedback");
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
  }, []);

  return (
    <div id="external-events-feedback">
      {data && (
        <Tree
          showLine={false}
          showLeafIcon={false}
          height={window.innerHeight * 0.5}
          showIcon={true}
          selectable={false}
          treeData={filteredData}
          defaultExpandAll={true}
        />
      )}
    </div>
  );
};
export default FeedbackTree;
