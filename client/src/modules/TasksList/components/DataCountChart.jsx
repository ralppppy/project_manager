import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  //   Title,
  Tooltip
  //   Legend
);
// const data = {
//   //   labels: ["Label1", "Label2", "Label3", "Label4", "Label5"], // Replace with your data labels
//   datasets: [
//     {
//       parsing: {
//         xAxisKey: "key",
//         yAxisKey: "value",
//       },
//       data: [
//         { key: "Label1", value: 10 },
//         { key: "Label2", value: 5 },
//         { key: "Label3", value: 8 },
//         { key: "Label4", value: 12 },
//         { key: "Label5", value: 7 },
//       ], // Replace with your data values
//       backgroundColor: "rgba(54, 162, 235, 0.6)", // Replace with your desired bar color
//     },
//   ],
// };

// const options = {
//   maintainAspectRatio: false,
//   legend: { display: false },
//   tooltips: { enabled: false },
//   scales: {
//     x: {
//       display: false, // Hide the x-axis
//       ticks: {
//         display: false, // Hide the x-axis ticks
//       },
//       grid: {
//         display: false, // Hide the x-axis grid lines
//       },
//     },
//     y: {
//       display: false, // Hide the y-axis
//       ticks: {
//         display: false, // Hide the y-axis ticks
//       },
//       grid: {
//         display: false, // Hide the y-axis grid lines
//       },
//     },
//   },
//   plugins: {
//     datalabels: {
//       display: false, // Hide the data labels on the bars
//     },
//   },
// };

const data = {
  labels: ["Open", "Close"],
  datasets: [
    {
      label: "Implementation",
      data: [5, 7], // Replace with the count of Implementation tasks for Open and Close status
      backgroundColor: "rgba(54, 162, 235, 0.6)", // Replace with the color for Implementation tasks
    },
    {
      label: "Testing",
      data: [3, 4], // Replace with the count of Testing tasks for Open and Close status
      backgroundColor: "rgba(255, 99, 132, 0.6)", // Replace with the color for Testing tasks
    },
    {
      label: "Bug Fixing",
      data: [2, 6], // Replace with the count of Bug Fixing tasks for Open and Close status
      backgroundColor: "rgba(75, 192, 192, 0.6)", // Replace with the color for Bug Fixing tasks
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};
function DataCountChart() {
  return (
    <div className="w-100">
      <Bar data={data} options={options} width="100%" height={100} />
    </div>
  );
}

export default DataCountChart;
