const dayjs = require("dayjs");

const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const FormatMilliseconds = (milliseconds) => {
  const duration = dayjs.duration(milliseconds);

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  let formattedDuration = "";

  if (days > 0) {
    formattedDuration += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    formattedDuration += `${hours} hour${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  return formattedDuration.trim();
};

module.exports = { FormatMilliseconds };
