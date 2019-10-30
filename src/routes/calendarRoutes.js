const express = require("express");
const { getCalendar } = require("../services/calendarService");

const router = new express.Router();

router.get("/calendar", async (req, res) => {
  try {
    const { month, year } = req.query;
    const calendar = getCalendar(month, year);
    res.send(calendar);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
