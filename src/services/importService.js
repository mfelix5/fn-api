const NJT = require("./importUtils/NJT")

const importStationsAndFares = async ({ system, file }) => {
  try {
    if (!system || !file) {
      throw new Error(`'system' and 'file' are required.`);
    }

    if (!["LIRR", "NJT"].includes(system)) {
      throw new Error(`Transit system is not supported`);
    } else if (system === "LIRR") {
      console.log("LIRR!");
    } else if (system === "NJT") {
      const result = await NJT.importFile({ file });
      return result;
    }

  } catch (err) {
    console.log(`Error from importStationsAndFares: ${err}`);
  }
}

module.exports = {
  importStationsAndFares
}