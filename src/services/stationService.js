const _ = require("lodash");
const Station = require("../models/station");

const findStationById = async (id) => {
  try {
    const station = await Station.findById(id);
    return station;
  } catch (err) {
    console.log(`Error from findStationById(): ${err}`);
  }
};

const findStationByName = async (name, line, system) => {
  try {
    const foundStation = await Station.findOne({ name, line, system });
    return foundStation;
  } catch (err) {
    console.log(`Error from findStationByName(): ${err}`);
  }
};

const findStationsOnLine = async (line, system) => {
  try {
    const stations = await Station.find({ line, system });
    return _.sortBy(stations, ["name"]);
  } catch (err) {
    console.log(`Error from findStationsOnLine(): ${err}`);
  }
};

const findLinesInSystem = async (system) => {
  try {
    const stations = await Station.find({ system });
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
