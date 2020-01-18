const fs = require("fs");
const csv = require("fast-csv");
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

const importStationsAndFares = async ({ system, line, effectiveDate, file }) => {
  try {
    if (!system || !line || !effectiveDate || !file) {
      throw new Error(`'system', 'line', 'effectiveDate' and 'file' are required.`);
    }

    const data = await readCSV(file);
    const fareObjects = await Promise.all(data.map(async (row) => {
      const obj = {
        current: true,
        effectiveDate: moment(effectiveDate, "MM/DD/YYYY"),
        line,
        station: row[0],
        system,
        fares: {
          NYP: {
            "one-way": row[1],
            "one-way-reduced": row[2],
            weekly: row[3],
            monthly: row[4],
            "10-trip": row[5],
          },
          HOB: {
            "one-way": row[6],
            "one-way-reduced": row[7],
            weekly: row[8],
            monthly: row[9],
            "10-trip": row[10],
          },
        },
      };

      // if "current" station data alreay exists, change it to "current" false. TODO: incorporate effectiveDate into current logic
      const existingStation = await Station.findOne({
        line: obj.line,
        system: obj.system,
        station: obj.station,
        current: true,
      });
      if (existingStation) await Station.findOneAndUpdate({ _id: existingStation._id }, { current: false });

      const station = new Station(obj);
      return station.save();
    }));

    return fareObjects;
  } catch (error) {
    return error;
  }
};

module.exports = {
  importStationsAndFares,
};
