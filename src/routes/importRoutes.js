const express = require("express");
const multer = require('multer');
const _ = require("lodash");
const importService = require("../services/importService");

const upload = multer({ dest: 'tmp/csv/' });
const router = new express.Router();

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const { system, effectiveDate } = req.query;
    const file = _.get(req, "file.path");
    const result = await importService.importStationsAndFares({ file, system, effectiveDate });

    if (result instanceof Error) {
      res.status(400).send(`Error: ${result.message}`);
    } else {
      res.send(result);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
