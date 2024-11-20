import { Typography, Table, Tag } from "antd";
import React from "react";

const { Text } = Typography;

const dataSource = [
  {
    key: "37115",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction:
      'QA Testing Result || Adjust Staff Order || If a user is moved to a group personal category that only has one (1) personal category, it\'ll be gone after re-opening the modal.\n\nRepro Steps:\t\n\t1. Navigate to Employee Planning > View > Adjust Staff Order\n\t2. Move one user to a group personal category that only has one (1) personal category\n\t3. Click ok\n\t4. Click Option > Adjust Staff Order\nExpected Result:\t\n\tUsers are still displayed under their group category\nActual Result:\t\n\tNo data shows under the group personal category in step 2. \nNote:\t\n\tThis also applies to the group personal category (that has only one personal category) that already has users under it.\n\nImg1: One employee will be moved to a Group solo\nImg2: The user is moved to the "Group Solo". Notice that the text beside the user is the same text for the group personal category.\nImg3: Clicked Ok and reopen the modal\n',
    last_change: {
      name: "Ralp  Yosores",
      description: "time_estimate",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-23 08:01:24",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36161",
    clients: "praxisplan GmbH",
    proj_name: "Praxisplan",
    instruction:
      "Ansicht, Personalplanung, Markwalder Stephanie, Krankheit GT ersichtlich. Bei Komprimierte Ansicht lückenhaft. Siehe Beispiel 10. und 14. April.",
    last_change: {
      name: "Ralp  Yosores",
      description: "status_update*Open",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20200125",
        name: "Alvera Principe",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-13 01:16:37",
      },
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-13 01:16:37",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "19916",
    clients: "_7_Exactflow",
    proj_name: "exactflow",
    instruction:
      'Please make a proposal for the dashboard: \n\n1. buildChart-File will be imported by us and saved (either as a file or in the db). \n2. Import-Data-File: Please check if this file can be stored either on db/file, so that other user do not need to import it again. \n3. Please make a proposal, where to insert the "import"-button. \n\nGoal: As less adjustment as possible in Raffis approach. ',
    last_change: {
      name: "Adrian Frei",
      description: "comment_added",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170002",
        name: "Adrian Frei",
        project_role: "Project Leader",
        is_working: "active",
        date_updated: "2023-03-24 17:54:18",
      },
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-24 17:54:18",
      },
    ],
    status: "Question",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "37171",
    clients: "praxisplan GmbH",
    proj_name: "Praxisplan",
    instruction:
      "Connected to point #125 || deleting entries should give a message: question: should absences also be deleted or only presence entries?",
    last_change: null,
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-24 08:07:49",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36625",
    clients: "praxisplan GmbH",
    proj_name: "Praxisplan",
    instruction:
      "Deleting\n- Adding Holidays and other long-term planned absences should not be deleted with loading the standard. if there is an absence on a day already in. The standardwoche cannot load an entry at this day\n- deleting entries should give an message: question: should absences also be deleted or only presence entries.",
    last_change: {
      name: "Alvera Principe",
      description: "status_update*Open",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-14 01:30:06",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "35841",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction: "Mobile Application || Generate mobile icon for viewing",
    last_change: {
      name: "Ralp  Yosores",
      description: "comment_added",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-02-21 08:48:05",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36535",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction: "Mobile Application || Show/Display the timelogs of the user",
    last_change: {
      name: "Ralp  Yosores",
      description: "comment_added",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-10 05:28:38",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36534",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction:
      "Mobile Application || Create API to fetch to insert time from the time management",
    last_change: {
      name: "Ralp  Yosores",
      description: "comment_added",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-10 05:28:00",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36533",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction:
      "Mobile Application || Create API to fetch the data of time management",
    last_change: null,
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-10 05:27:23",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36532",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction: "Mobile Application || Designing of the mobile timelogs",
    last_change: null,
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-10 05:26:34",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "37005",
    clients: "_7_Exactflow",
    proj_name: "exactflow",
    instruction:
      "Please remove any users / e-mail adresses of people that are not working for exact constrcut anymore (I saw Xenia, AJ, Diana.. in the Zeochem tool). Furthermore, please no longer use any person that does not need to access to tool. As for the Tester, I even suppose to use a standard-e-mail (though with changing pw)",
    last_change: null,
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-21 16:24:42",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
  {
    key: "36921",
    clients: "praxisplan GmbH",
    proj_name: "Zeiterfassung / Mitarbeiterplanung",
    instruction:
      "Komprimierte Ansicht || Added a shift in the Ansicht by double-clicking the shift Monitor(Dietary's Office) and filling in the start and end date as January 1 to January 8, 2023, to Employee M. On the Ansicht, the shift is not visible or plotted during the Holidays, which is the expected result. However, on the Komprimierte Ansicht, it seems that the shift is still plotted on the calendar table, which is not the intended behavior. Komprimierte Ansicht should reflect the plotted shifts on the Ansicht. Please refer to the attached sample images for further details.",
    last_change: {
      name: "Alvera Principe",
      description: "file_added",
      __typename: "PointHistory",
    },
    developers: [
      {
        id: "20170081",
        name: "Ralp  Yosores",
        project_role: "Project Staff",
        is_working: "active",
        date_updated: "2023-03-20 07:55:46",
      },
    ],
    status: "Open",
    priority: "Low",
    lastUpdated: "priority",
  },
];

const status = {
  Open: "green",
  Question: "blue",
};

const columns = [
  {
    title: "ID",
    dataIndex: "key",
    key: "key",
    width: "5%",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Clients",
    dataIndex: "clients",
    key: "clients",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Project Name",
    dataIndex: "proj_name",
    sorter: (a, b) => a.age - b.age,

    key: "proj_name",
  },
  {
    title: "Instruction",
    dataIndex: "instruction",
    sorter: (a, b) => a.age - b.age,

    key: "instruction",
    width: "30%",
    ellipsis: true,

    render: (value) => {
      return <Text style={{ cursor: "help" }}>{value}</Text>;
    },
  },
  {
    title: "Last Change",
    dataIndex: "last_change",
    sorter: (a, b) => a.age - b.age,

    key: "last_change",
    render: (value) => {
      return value?.name;
    },
  },
  {
    title: "Assigned To",
    dataIndex: "developers",
    sorter: (a, b) => a.age - b.age,

    key: "developers",
    render: () => {
      return <Tag color="magenta">magenta</Tag>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: (a, b) => a.age - b.age,

    key: "status",
    render: (value) => {
      return <Tag color={status[value]}>{value}</Tag>;
    },
  },
  {
    title: "Priority",
    dataIndex: "priority",
    sorter: (a, b) => a.age - b.age,

    key: "priority",
  },
  {
    title: "Last Updated",
    dataIndex: "lastUpdated",
    sorter: (a, b) => a.age - b.age,

    key: "lastUpdated",
  },
];
function TableFeedback() {
  return (
    <>
      <Table
        scroll={{ x: 1300 }}
        dataSource={dataSource}
        columns={columns}
        pagination={{ position: ["bottomRight"] }}
      />
    </>
  );
}

export default TableFeedback;
