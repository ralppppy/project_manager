import React from "react";
import { useQuill } from "react-quill";

function CustomToolbar({ darkMode }) {
  const quill = useQuill();

  if (!quill) {
    return null;
  }

  const setToolbarStyles = () => {
    const toolbar = quill.getModule("toolbar");
    if (toolbar) {
      const textColor = darkMode ? "#fff" : "#333";
      toolbar.container.style.color = textColor;
    }
  };

  // Call the function to initially set the toolbar styles
  setToolbarStyles();

  return null;
}

export default CustomToolbar;
