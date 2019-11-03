const _ = require("lodash");
const Station = require("../models/station");

const findStation = async (stationName, lineName, systemName) => {
  const station = await Station.findOne({ station: stationName, line: lineName, system: systemName });
  return station;
};

const findStationsOnLine = async (lineName, systemName) => {
  const stations = await Station.find({ line: lineName, system: systemName });
  return stations.map((s) => s.station);
};

const findLinesInSystem = async (systemName) => {
  const stations = await Station.find({ system: systemName });
  const lines = stations.map((s) => s.line);
  const linesInSytem = _.uniq(lines);
  return linesInSytem;
};

module.exports = {
  findStation,
  findStationsOnLine,
  findLinesInSystem,
};
