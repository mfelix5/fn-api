const express = require("express");
require("./db/mongoose");
const calendarRoutes = require("./routes/calendarRoutes");
const importRoutes = require("./routes/importRoutes");
const stationRoutes = require("./routes/stationRoutes");
const queryRoutes = require("./routes/queryRoutes");

const dbInUse = process.env.NODE_ENV === "production"
  ? "production"
  : "dev";

try {
  const port = process.env.PORT || 3000;
  const app = express();
  app.use(express.json());
  app.use(calendarRoutes);
  app.use(importRoutes);
  app.use(stationRoutes);
  app.use(queryRoutes);
  app.listen(port, () => console.log(`Server running on port ${port} using ${dbInUse} database.`));
} catch (err) {
  console.log("Error from index.js", err);
}
