const express = require("express");
const Query = require("../models/query");
const { getRecommendation } = require("../services/recommendationService");

const router = new express.Router();

router.post("/queries", async (req, res) => {
  try {
    const query = new Query(req.body);
    const recommendation = await getRecommendation(query);
    query.recommendation = recommendation;
    await query.save();
    res.send(query);
  } catch (err) {
    console.log('err', err);
    res.status(400).send(err);
  }
});

router.get("/queries", async (req, res) => {
  try {
    const queries = await Query.find({});
    if (!queries) return res.status(404).send(`No queries found.`);
    res.send(queries);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/queries/:id", async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).send(`Query not found with id ${req.params.id}.`);
    res.send(query);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
