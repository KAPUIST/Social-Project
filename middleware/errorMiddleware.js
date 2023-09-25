exports.errorMiddleware = (err, req, res, next) => {
  const defaultErr = {
    statusCode: 404,
    success: "failed",
    message: err,
  };

  if (err?.name === "ValidationError") {
    defaultErr.statusCode = 404;
    defaultErr.message = Object.values(err, errors)
      .map((el) => el.message)
      .join(",");
  }

  res.status(defaultErr.statusCode).json({
    success: defaultErr.success,
    message: defaultErr.message,
  });
};
