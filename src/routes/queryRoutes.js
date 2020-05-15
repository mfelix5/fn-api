const express = require("express");
const Query = require("../models/query");
const { getRecommendation } = require("../services/recommendationService");

const router = new express.Router();

router.post("/query", async (req, res) => {
  try {
    const userQuery = req.body;
    const result = await getRecommendation(userQuery);
    if (result instanceof Error) {
      return res.status(400).send(`Error: ${result.message}`);
    } else {
      return res.send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/query", async (req, res) => {
  try {
    const queries = await Query.find({});
    if (!queries) return res.status(404).send(`No queries found.`);
    return res.send(queries);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/query/:id", async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).send(`Query not found with id ${req.params.id}.`);
    return res.send(query);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/query/:id", async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!query) return res.status(404).send(`Query not found with id ${req.params.id}.`);
    return res.send(query);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/query/:id", async (req, res) => {
  try {
    const deleted = await Query.findOneAndDelete({
      _id: req.params.id
    });
    if (!deleted) return res.status(404).send(`Query not found with id ${req.params.id}.`);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
