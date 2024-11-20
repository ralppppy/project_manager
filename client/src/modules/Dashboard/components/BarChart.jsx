import React, { useEffect, useRef } from "react";

import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import Chart from "chart.js/auto"; // need this import for styling and other adapter

import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { Card, Spin, Typography, theme } from "antd";
import dayjs from "dayjs";
import { DashboardController } from "../controller";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import "../components/styles.css";
import { secondsToHHMM } from "../../../common/TimeHelper";

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);
const { Text, Title } = Typography;

const BarChart = () => {
  const { handleGetChartData } = DashboardController();
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { token } = theme.useToken();

  const QUERY_KEY_CHART = ["chart_data", organization_id];

  const { data: chartData, isFetching } = useQuery({
    queryKey: QUERY_KEY_CHART,
    queryFn: () => handleGetChartData(organization_id),
    refetchOnWindowFocus: false,
    select: (data) => {
      let { usersData } = data;
      data = data.datasets.map((c) => {
        return {
          ...c,
          data: c.data.map((d) => d),
        };
      });
      let usersDataLabel = usersData.map((c) => c.name);

      return { data, usersDataLabel, usersData };
    },
    enabled: !!organization_id,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  const data = {
    labels: chartData?.usersDataLabel,
    datasets: chartData?.data,
  };

  const options = {
    indexAxis: "y",
    // responsive: true,
    // maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        ticks: {
          color: token.colorTextBase,
        },
      },

      x: {
        stacked: true,
        beginAtZero: true,
        min: 0,
        max: 5,

        ticks: {
          steps: 5,
          stepSize: 1,
          color: token.colorTextBase,
          callback: (value, idx) => {
            return dayjs().add(idx, "day").format("MMM DD YYYY");
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        position: "nearest",
        xAlign: "center",
        yAlign: "center",
        boxPadding: 3,
        boxWidth: 6,
        boxHeight: 6,
        enabled: false,

        external: (context) => {
          function getBody(bodyItem) {
            return bodyItem.lines;
          }

          function getTaskTimelog(project) {
            let usersData = chartData?.usersData;

            let selectedUser = usersData.find(
              (user) => user.id === project["tasks.team.user.id"]
            );
            if (selectedUser) {
              // If a user with the matching ID is found, return their overall_total data
              let timelog = selectedUser.overall_total.find(
                (c) => c.project_id === project.id
              );
              return { ...project, timelog: timelog?.total_hours_worked || 0 };
            }

            // If no user with the matching ID is found, you can return an empty array or handle the case accordingly
            return [];
          }
          // Tooltip Element
          let tooltipEl = document.getElementById("chartjs-tooltip");

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.innerHTML = `
            <div class='custom-tooltip' 
            style='
            background-color: ${token.colorBgContainer}; 
            border-radius: ${token.borderRadiusLG}px; 
            padding: ${token.padding}px;
            color: ${token.colorTextBase};
            '>
            </div>`;
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          const tooltipModel = context.tooltip;

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove("above", "below", "no-transform");
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add("no-transform");
          }

          let parentTooltipEl = document.createElement("div");

          // Set Text
          if (tooltipModel.body) {
            const titleLines = tooltipModel.title || [];
            const bodyLines = tooltipModel.body.map(getBody);

            let innerHtml = "";
            let titleHtml = "";
            titleLines.forEach(function (title) {
              titleHtml += "<h4 class='text-center'>" + title + "</h4>";
            });

            bodyLines.forEach(function (body, i) {
              let [label, value] = body[0].split(": ");

              let project_estimated_hours = secondsToHHMM(value * 28800); // 28800 is decimal hours to seconds 8 hours per day time 36000 seconds
              let project = JSON.parse(label);
              project = getTaskTimelog(project);
              let timelog = secondsToHHMM(project.timelog);

              if (value > 0) {
                // if the value is 0 meaning the user has no task on that project or does not assigned to that project
                innerHtml += `<div class="d-flex justify-content-between"><li>${project.name} (${project["client.name"]})</li><div style='margin-left: 25px;'>${timelog} / ${project_estimated_hours}</div></div>`;
              }
            });

            parentTooltipEl.innerHTML = innerHtml;
            let tableRoot = tooltipEl.querySelector(".custom-tooltip");

            tableRoot.innerHTML = titleHtml + parentTooltipEl.outerHTML;
          }

          const position = context.chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left =
            40 + window.scrollX + tooltipModel.caretX + "px";
          tooltipEl.style.top =
            position.top + window.scrollY + tooltipModel.caretY + "px";

          tooltipEl.style.pointerEvents = "none";
        },
      },
    },
  };
  return (
    <>
      <Text strong>Capacity Calendar</Text>
      {isFetching ? (
        <Spin />
      ) : (
        <Card
          className="mb-2"
          // style={{
          //   maxHeight: "70vh",
          //   height: "60vh",
          //   overflowY: "scroll",
          // }}
        >
          <div>
            <Bar className="w-100 mb-4" options={options} data={data} />
          </div>
        </Card>
      )}
    </>
  );
};

export default BarChart;
