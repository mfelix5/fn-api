const _ = require("lodash");
const moment = require("moment");
const Station = require("../../models/station");
const utils = require("./utils")

const importFile = async ({ file }) => {
  try {
    const data = await utils.readCSV(file);
    console.log('data', data);
    return data;

  } catch (error) {
    return `Error from LIRR.importFile(): ${error}`;
  }
};

module.exports = {
  importFile
};