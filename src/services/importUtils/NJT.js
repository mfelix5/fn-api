const _ = require("lodash");
const moment = require("moment");
const Station = require("../../models/station");
const utils = require("./utils")

const importFile = async ({ file }) => {
  try {
    const stationAndFareData = await utils.readCSV(file);
    const stationsAndFares = stationAndFareData.slice(4);
    const stationPromises = stationsAndFares.map(async row =>
      processStationData(stationAndFareData, row)
    );
    const stations = await Promise.all(stationPromises);
    return stations;
  } catch (error) {
    return `Error from NJT.importFile(): ${error}`;
  }
};

// helper functions

const processStationData = (data, row) => {
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
    name: row[0].split("-").join(" "),
    system: "NJT"
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
  importFile
};
