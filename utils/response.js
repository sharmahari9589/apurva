let message = {
  noDataMessage: "No data found",
  errorMessage: "Something Went Wrong",
  catchMessage: "Internal Server Error !!!",
};

function response( successBool, message, dataValue=null) {
  return {
    success: successBool,
    msg: message,
    data: dataValue 
  }
}

module.exports = {message, response};
