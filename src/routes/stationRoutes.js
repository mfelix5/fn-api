const express = require("express");
const stationService = require("../services/stationService");

const router = new express.Router();

router.get("/station/:id", async (req, res) => {
  try {
    const station = await stationService.findStationById(req.params.id);
    if (!station) { return res.status(404).send(`Station not found with id ${req.params.id}.`); }
    res.send(station);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/station/:id", async (req, res) => {
  try {
    const station = await stationService.updateStation(req.params.id, req.body);
    if (!station) { return res.status(404).send(`Station not found with id ${req.params.id}. No update made`); }
    res.send(station);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/stations", async (req, res) => {
  try {
    const { line, system } = req.body;
    const result = await stationService.findStationsOnLine(line, system);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/stations", async (req, res) => {
  try {
    const { system } = req.query;
    const stations = await stationService.findStationsInSystem(system);
    if (!stations) { return res.status(404).send(`Stations not found.`); }
    res.send(stations);
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
