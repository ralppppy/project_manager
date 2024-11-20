const secondsToHHMM = (seconds) => {
  // Calculate hours and minutes
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Format hours and minutes with leading zeros if necessary
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Return the formatted time as HH:mm
  return `${formattedHours}:${formattedMinutes}`;
};

const secondsToHours = (seconds) => {
  // Calculate hours
  const hours = seconds / 3600;

  return isNaN(hours) ? 0 : hours;
};
export { secondsToHHMM, secondsToHours };
