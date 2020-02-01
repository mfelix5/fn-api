const fs = require("fs");
const csv = require("fast-csv");
const _ = require("lodash");
const moment = require("moment");
const Station = require("../models/station");

const importStationsAndFares = async ({ system, file }) => {
  try {
    if (!system || !file) {
      throw new Error(`'system' and 'file' are required.`);
    }
    if (system !== "NJT") {
      throw new Error(`NJT is currently the only system supported`);
    }

    const stationAndFareData = await readCSV(file);
    const stationsAndFares = stationAndFareData.slice(4);
    const stationPromises = stationsAndFares.map(async row =>
      processStationData(system, stationAndFareData, row)
    );
    const stations = await Promise.all(stationPromises);
    console.log("stations", stations);
    return stations;
  } catch (error) {
    return `Error from importStationsAndFares: ${error}`;
  }
};

// helper functions

const readCSV = file =>
  new Promise((resolve, reject) => {
    try {
      const fileRows = [];
      csv
        .parseFile(file)
        .on("data", data => fileRows.push(data))
        .on("end", () => {
          fs.unlinkSync(file);
          resolve(fileRows);
        });
    } catch (err) {
      reject(err);
    }
  });

const processStationData = (system, data, row) => {
  const line = data[0][1];
  const effectiveDate = data[1][1];
  const destinationsAndFareTypes = getDestinationFareTypes(data);

  Object.keys(destinationsAndFareTypes).forEach(dest => {
    let counter = destinationsAndFareTypes[dest]["startIndex"];
    Object.keys(destinationsAndFareTypes[dest]).forEach(key => {
      if (key !== "startIndex") {
        destinationsAndFareTypes[dest][key] = row[counter];
        counter++;
      }
    });
    delete destinationsAndFareTypes[dest]["startIndex"];
  });

  const destinations = removeDestinationsWithEmptyFares(destinationsAndFareTypes);

  // TODO: retire older data, use effectiveDate.

  const station = new Station({
    current: true,
    effectiveDate: moment(effectiveDate, "MM/DD/YYYY"),
    destinations,
    line,
    station: row[0].split("-").join(" "),
    system
  });
  return station.save();
};

const getDestinationFareTypes = data => {
  const destinations = data[2].filter(item => item.length);
  const result = {};
  destinations.forEach(dest => {
    result[dest] = {};
    const startIndex = data[2].findIndex(el => el === dest);
    const nextDestinationIndex = data[2].findIndex(
      el => data[2].indexOf(el) > startIndex
    );
    const endIndex =
      nextDestinationIndex > -1 ? nextDestinationIndex : data[2].length;
    const fareTypes = data[3].slice(startIndex, endIndex);
    result[dest].startIndex = startIndex;
    fareTypes.forEach(type => (result[dest][type] = null));
  });
  return result;
};

const removeDestinationsWithEmptyFares = destinations => {
  const toDelete = [];
  Object.keys(destinations).forEach(dest => {
    Object.keys(destinations[dest]).forEach(fare => {
      if (["...", "…"].includes(destinations[dest][fare])) {
        toDelete.push(dest);
      }
    });
  });
  _.uniq(toDelete).forEach(dest => {
    delete destinations[dest];
  });
  return destinations;
};

module.exports = {
  importStationsAndFares
};
