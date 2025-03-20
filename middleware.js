const notFound = (req, res, next) => {
  res.status(404).json({ error: "Route not found" });
};

const errorHandler = (err, req, res, next) => {
  res.status(500).json({ error: err.message || "Internal Server Error" });
};

module.exports = { notFound, errorHandler };
