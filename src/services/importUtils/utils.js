const fs = require("fs");
const csv = require("fast-csv");

const normalizeFare = fare => {
  // delete any asterisks and make number
  return parseFloat(fare.replace("*", "").trim());
};

const normalizeFareType = fareType => {
  const type = fareType.trim().toLowerCase();
  if (["one-way", "peak one-way"].includes(type)) { return "one-way-peak"; }
  if (["off-peak one-way"].includes(type)) { return "one-way-off-peak"; }
  if (["sr. cit/disabled/m’care one-way", "one-way reduced"].includes(type)) { return "one-way-reduced"; }
  if (["10-trip", "peak ten-trip"].includes(type)) { return "10-trip-peak"; }
  if (["off-peak ten-trip"].includes(type)) { return "10-trip-off-peak"; }
  if (["on-board peak one-way"].includes(type)) { return "one-way-peak-on-board"; }
  if (["on-board off-peak one-way"].includes(type)) { return "one-way-off-peak-on-board"; }
  if (["one-way child"].includes(type)) { return "one-way-child"; }
  return type;
};

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
  normalizeFare,
  normalizeFareType,
  readCSV
}