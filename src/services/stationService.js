const _ = require("lodash");
const Station = require("../models/station");

const findStationById = async (id) => {
  try {
    const station = await Station.findOne({ _id: id });
    return station;
  } catch (err) {
    console.log(`Error from findStationById(): ${err}`);
  }
};

const findStationByName = async (station, line, system) => {
  try {
    const foundStation = await Station.findOne({ station, line, system });
    return foundStation;
  } catch (err) {
    console.log(`Error from findStationByName(): ${err}`);
  }
};

const findStationsOnLine = async (lineName, systemName) => {
  try {
    const stations = await Station.find({ line: lineName, system: systemName });
    return _.sortBy(stations, ["station"]);
  } catch (err) {
    console.log(`Error from findStationsOnLine(): ${err}`);
  }
};

const findLinesInSystem = async (systemName) => {
  try {
    const stations = await Station.find({ system: systemName });
    const lines = stations.map((s) => s.line);
    return _.uniq(lines).sort();
  } catch (err) {
    console.log(`Error from findLinesInSystem(): ${err}`);
  }
};

const updateStation = async (id, update) => {
  try {
    if (!id) { return "_id required"};
    const station = await Station.findOneAndUpdate(
      { _id: id },
      { ...update },
      { new: true}
    );
    return station;
  } catch (err) {
    console.log(`Error from updateStation(): ${err}`);
  }
}

module.exports = {
  findStationByName,
  findStationById,
  findStationsOnLine,
  findLinesInSystem,
  updateStation
};
