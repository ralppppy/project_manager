import React from "react";

import { TableModalForm } from ".";

function TableHeader({
  HeaderComponent,
  QUERY_KEY,
  ModalFormComponent,
  apiPath,
  messageApi,
  onAfterSubmit,
  modalTitle,
  mutateTableData,
}) {
  return (
    <>
      {HeaderComponent}

      <TableModalForm
        onAfterSubmit={onAfterSubmit}
        QUERY_KEY={QUERY_KEY}
        ModalFormComponent={ModalFormComponent}
        apiPath={apiPath}
        messageApi={messageApi}
        modalTitle={modalTitle}
        mutateTableData={mutateTableData}
      />
    </>
  );
}

export default React.memo(TableHeader);
