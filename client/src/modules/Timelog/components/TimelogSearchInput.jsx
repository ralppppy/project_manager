import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchValue } from "../models/TimelogModel";

const TimelogSearchInput = () => {
  const [searchTerm, setSearchTerm] = useState(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    let delayDebounceFn;
    if (typeof searchTerm !== "undefined") {
      delayDebounceFn = setTimeout(() => {
        // Perform the search with the current search term
        dispatch(setSearchValue(searchTerm));
      }, 300);
    }

    // Cleanup function to clear the timeout if the component unmounts or the search term changes
    return () => {
      dispatch(setSearchValue(""));
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
      className="w-100"
      placeholder="Search Task Title"
    />
  );
};

export default TimelogSearchInput;
