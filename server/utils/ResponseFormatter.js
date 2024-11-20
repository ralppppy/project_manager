const formatResponse = (
  isSuccess,
  data,
  errorMessage = "Something went wrong",
  statusMessageSuccess = "success",
  statusMessageError = "error"
) => {
  if (isSuccess) {
    return {
      status: statusMessageSuccess,
      data: data,
    };
  }

  return {
    status: statusMessageError,
    message: errorMessage,
  };
};

module.exports = {
  formatResponse,
};
