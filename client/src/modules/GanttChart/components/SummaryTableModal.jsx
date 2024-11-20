import { Modal } from "antd";
import React, { Suspense } from "react";
import { SummaryTable } from ".";
import { GanttChartController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";

function SummaryTableModal() {
  const dispatch = useDispatch();

  const { handlSummaryModalOpen } = GanttChartController({ dispatch });

  const summaryModalOpen = useSelector(
    (state) => state.ganttChart.summaryModalOpen
  );

  return (
    <Modal
      title="Summary"
      className="w-50"
      open={summaryModalOpen}
      destroyOnClose={true}
      onOk={() => handlSummaryModalOpen(false)}
      onCancel={() => handlSummaryModalOpen(false)}
    >
      <Suspense fallback={<></>}>
        <SummaryTable />
      </Suspense>
    </Modal>
  );
}

export default SummaryTableModal;
