if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware.js");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/data", dataRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
