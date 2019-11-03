const express = require("express");
const multer = require('multer');
const importService = require("../services/importService");

const upload = multer({ dest: 'tmp/csv/' });
const router = new express.Router();

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const { system, line, effectiveDate, file } = req.query;

    const result = await importService.importFareTable({
      effectiveDate,
      file,
      line,
      system,
    });

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
