const express = require("express");
const { getCalendar } = require("../services/calendarService");

const router = new express.Router();

router.get("/calendar", async (req, res) => {
  try {
    const { date } = req.query;
    const result = getCalendar(date);
    if (result instanceof Error) {
      res.status(400).send(`Error: ${result.message}`);
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
