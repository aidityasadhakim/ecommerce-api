function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err.message });
  }

  return res
    .status(500)
    .json({ success: false, message: `Error occured: ${err.message}` });
}

module.exports = errorHandler;
