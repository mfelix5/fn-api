const express = require("express");
const multer = require('multer');
const _ = require("lodash");
const importService = require("../services/importService");

const upload = multer({ dest: 'tmp/csv/' });
const router = new express.Router();

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const system = _.get(req, "query.system");
    const line = _.get(req, "query.line");
    const effectiveDate = _.get(req, "query.effectiveDate");
    const file = _.get(req, "file.path");

    const result = await importService.importFareTable({
      effectiveDate,
      file,
      line,
      system,
    });

    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
