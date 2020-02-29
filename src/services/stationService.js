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

const findStationByName = async (name) => {
  try {
    const station = await Station.findOne({
      system: "LIRR", // function is currently for use w/ LIRR only. no duplicate station names.
      name
    });
    return station;
  } catch (err) {
    console.log(`Error from findStationById(): ${err}`);
  }
};

const findStationsOnLine = async (line, system) => {
  try {
    const stations = await Station.find({
      lines: { $in: line },
      system
    });
    return _.sortBy(stations, ["name"]);
  } catch (err) {
    console.log(`Error from findStationsOnLine(): ${err}`);
  }
};

const findStationsInSystem = async (system) => {
  try {
    const stations = await Station.find({ system });
    return _.sortBy(stations, ["name"]);
  } catch (err) {
    console.log(`Error from findStationsOnLine(): ${err}`);
  }
};

const findLinesInSystem = async (system) => {
  try {
    const stations = await Station.find({ system });
    const lines = [];
    stations.forEach((s) => {
      s.lines.forEach(l => {
        lines.push(l);
      });
    });
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
  findStationById,
  findStationByName,
  findStationsInSystem,
  findStationsOnLine,
  findLinesInSystem,
  updateStation
};
