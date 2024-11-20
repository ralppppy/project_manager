import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GanttChartController } from "../controllers";
import { Filters } from ".";
import { useQuery } from "react-query";

function FilterContainer({ calendar }) {
  const { clientId, projectId } = useSelector(
    (state) => state.common.selectedFilter
  );

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const dispatch = useDispatch();
  const QUERY_KEY_MODULE_LIST = [
    "module_list",
    organization_id,
    clientId,
    projectId,
  ];

  let { handleGetModuleDropdownData, handleFilterModule } =
    GanttChartController({ dispatch });

  const { data } = useQuery({
    queryKey: QUERY_KEY_MODULE_LIST,
    queryFn: () =>
      handleGetModuleDropdownData({
        organization_id,
        clientId,
        projectId,
      }),

    enabled: !!organization_id,
    staleTime: Infinity,
  });

  useEffect(() => {
    handleFilterModule(data?.map((c) => c.value));
  }, [JSON.stringify(data)]);

  return (
    <div>
      <Suspense fallback={<></>}>
        <Filters data={data} calendar={calendar} />
      </Suspense>
    </div>
  );
}

export default FilterContainer;
