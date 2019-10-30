const fs = require("fs");
const csv = require("fast-csv");
const moment = require("moment");
const _ = require("lodash");

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

module.exports = {
  importFareTable: async ({
    system,
    line,
    effectiveDate,
    file,
  }) => {
    try {
      const data = await readCSV(file);
      const fareObjects = data.map((row) => (
        {
          current: true,
          effectiveDate: moment(effectiveDate, "MM/DD/YYYY"),
          line,
          station: row[0],
          system,
          NYP: {
            "one-way": row[1],
            "one-way-reduced": row[2],
            weekly: row[3],
            monthly: row[4],
            "10-trip": row[5],
          },
          SEC: {
            "one-way": row[6],
            "one-way-reduced": row[7],
            weekly: row[8],
            monthly: row[9],
            "10-trip": row[10],
          },
        }
      ));
      // save to database
      return fareObjects;
    } catch (err) {
      console.log("Error from importFareTable():", err);
    }
  },

};
