import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//  import { setSearchValue } from "../models/ModuleListModel";
import { setTastTitleSearch } from "../models/TasksListModel";
import { useLoaderData, useNavigate } from "react-router-dom";

const TaskSearchInput = () => {
  const [searchTerm, setSearchTerm] = useState(undefined);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageSizeInitial = useSelector((state) => state.module.pageSize);
  const tableQuery = useLoaderData();
  const pageSize = parseInt(tableQuery?.pagination?.pageSize);

  useEffect(() => {
    let delayDebounceFn;

    // Forward to route with page and pagesize if searchterm is not undefined
    if (typeof searchTerm !== "undefined") {
      delayDebounceFn = setTimeout(() => {
        const queryParams = new URLSearchParams({
          page: 1,
          pageSize: pageSize ? pageSize : pageSizeInitial,
        });
        dispatch(setTastTitleSearch(searchTerm));

        // dispatch(setSearchValue(searchTerm));
        navigate(`?${queryParams.toString()}`, { replace: true });
      }, 300);
    }

    // Cleanup function to clear the timeout if the component unmounts or the search term changes
    return () => {
      dispatch(setTastTitleSearch(""));
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Input
      allowClear
      autoFocus
      onChange={handleChange}
      className="mb-3 w-100"
      placeholder="Search for Task ID / Title"
    />
  );
};

export default TaskSearchInput;
