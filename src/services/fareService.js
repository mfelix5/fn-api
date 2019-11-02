const getFares = async (fareObject) => {
  try {
    const { origin, destination, system } = fareObject;

    // get fares from database

    return {
      oneWay: 13,
      weekly: 90,
      monthly: 359,
    };
  } catch (err) {
    console.log(`Error from getFares(): ${err}`);
  }
};

module.exports = {
  getFares,
};
