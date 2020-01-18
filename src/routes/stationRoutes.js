const express = require("express");
const stationService = require("../services/stationService");

const router = new express.Router();

router.get("/station", async (req, res) => {
  try {
    const { line, station, system } = req.query;
    const result = await stationService.findStation(station, line, system);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/stations", async (req, res) => {
  try {
    const { line, system } = req.query;
    const result = await stationService.findStationsOnLine(line, system);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/lines", async (req, res) => {
  try {
    const { system } = req.query;
    const result = await stationService.findLinesInSystem(system);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
