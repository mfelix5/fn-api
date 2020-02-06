const fs = require("fs");
const csv = require("fast-csv");

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

module.exports = {
  readCSV
}