const fs = require("fs");
const csv = require("fast-csv");
const _ = require("lodash");
const moment = require("moment");
const Station = require("../models/station");

const readCSV = (file) => new Promise((resolve, reject) => {
  try {
    const fileRows = [];
    csv.parseFile(file)
      .on("data", (data) => fileRows.push(data))
      .on("end", () => {
        fs.unlinkSync(file);
        resolve(fileRows);
      });
  } catch (err) {
    reject(err);
  }
});

const importStationsAndFares = async ({ system, file }) => {
  //TODO: Break this function apart so it's testable
  try {
    if (!system || !file) { throw new Error(`'system' and 'file' are required.`) }
    if (system !== "NJT") { throw new Error(`NJT is currently the only system supported`)}

    const data = await readCSV(file);
    const line = data[0][1];
    const effectiveDate = data[1][1];
    const destinations = data[2].filter(item => item.length);
    const stationsAndFares = data.slice(4);

    const destinationFareTypes = {};
    destinations.forEach(dest => {
      destinationFareTypes[dest] = {};
      const startIndex = data[2].findIndex(el => el === dest);
      const nextDestinationIndex = data[2].findIndex(el => data[2].indexOf(el) > startIndex);
      const endIndex = nextDestinationIndex > -1 ? nextDestinationIndex : data[2].length;
      const fareTypes = data[3].slice(startIndex, endIndex);
      destinationFareTypes[dest].startIndex = startIndex;
      fareTypes.forEach(type => destinationFareTypes[dest][type] = null);
    });

    const fareObjectPromises = stationsAndFares.map(async (row) => {

      const fares = _.cloneDeep(destinationFareTypes);

      Object.keys(fares).forEach(dest => {
        let counter = fares[dest]["startIndex"];
        Object.keys(fares[dest]).forEach(key => {
          if (key !== "startIndex") {
            fares[dest][key] = row[counter];
            counter++;
          }
        });
        delete fares[dest]["startIndex"]
      });

      //TODO: address "..." fares
      const obj = {
        current: true,
        effectiveDate: moment(effectiveDate, "MM/DD/YYYY"),
        fares,
        line,
        station: row[0].split("-").join(" "),
        system,
      };

      // TODO: incorporate effectiveDate into current logic
      const existingStation = await Station.findOne({
        line: obj.line,
        system: obj.system,
        station: obj.station,
        current: true,
      });
      if (existingStation) await Station.findOneAndUpdate({ _id: existingStation._id }, { current: false });

      const station = new Station(obj);
      return station.save();
    });

    const fareObjects = await Promise.all(fareObjectPromises)

    return fareObjects;
  } catch (error) {
    return `Error from importStationsAndFares: ${error}`;
  }
};

module.exports = {
  importStationsAndFares,
};
