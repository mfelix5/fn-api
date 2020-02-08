const LIRR = require("./importUtils/LIRR");
const NJT = require("./importUtils/NJT");

const importStationsAndFares = async ({ system, file, effectiveDate }) => {
  try {
    if (!system || !file) {
      throw new Error(`'system' and 'file' are required.`);
    }

    if (!["LIRR", "NJT"].includes(system)) {
      throw new Error(`Transit system is not supported`);
    } else if (system === "LIRR") {
      return await LIRR.importFile({ file, effectiveDate });
    } else if (system === "NJT") {
      return await NJT.importFile({ file });
    }

  } catch (err) {
    console.log(`Error from importStationsAndFares: ${err}`);
  }
}

module.exports = {
  importStationsAndFares
};