import React from "react";
import FilterStatus from "../../Common/components/FilterStatus";
import { useSelector } from "react-redux";

function FilterStatusContainer() {
  return <FilterStatus showTask={true} />;
}

export default FilterStatusContainer;
