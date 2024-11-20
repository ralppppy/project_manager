import { Button } from "antd";
import React, { Suspense } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ProjectController } from "../controllers";
import { useDispatch } from "react-redux";
import { ProjectModalForm } from ".";

function AddProjectButton({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const { handleChangeIsUpdateState, handleModalOpen } = ProjectController({
    dispatch,
  });

  return (
    <>
      <Button
        onClick={() => {
          handleChangeIsUpdateState(false);
          handleModalOpen(true);
        }}
        className="w-100"
        icon={<PlusOutlined />}
        type="primary"
      >
        Add Project
      </Button>
      <Suspense fallback={<></>}>
        <ProjectModalForm QUERY_KEY={QUERY_KEY} />
      </Suspense>
    </>
  );
}

export default React.memo(AddProjectButton);
