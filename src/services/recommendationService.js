const Query = require("../models/query");
const stationService = require("../services/stationService");

const getRecommendation = async (travelData) => {
  try {
    ["destination", "fareType", "month", "oneWaysNeeded", "originId"].forEach((field) => {
      if (!travelData[field]) throw new Error(`${field} is required.`);
    });

    const { destination, oneWaysNeeded, originId } = travelData;
    const station = await stationService.findStationById(originId);
    if (!station) throw new Error(`Unable to find station.`);
    const { destinations } = station;

    let fares;
    if (station.system === "NJT") {
      fares = destinations[destination];
    } else if (station.system === "LIRR") {
      fares = await module.exports.getFaresLIRR(station, destination);
    }

    const recommendation = {};
    const leastExpensiveOptions = {};
    const leastExpensiveCosts = {};

    Object.keys(oneWaysNeeded).forEach((week) => {
      if (oneWaysNeeded[week] > 0) {
        leastExpensiveOptions[(week)] = oneWaysNeeded[(week)] * fares["one-way-peak"] < fares["weekly"]
          ? "oneWays" : "weekly";
        leastExpensiveCosts[(week)] = oneWaysNeeded[(week)] * fares["one-way-peak"] < fares["weekly"]
          ? oneWaysNeeded[(week)] * fares["one-way-peak"] : fares["weekly"];
      }
    });

    const costOfLeastExpensiveOptions = Object.values(leastExpensiveCosts).reduce((a, b) => 1 * a + 1 * b);
    const use = {};
    const purchase = {
      oneWay: 0,
      weekly: 0,
      monthly: 0,
    };

    if (costOfLeastExpensiveOptions < fares["monthly"]) {
      Object.keys(oneWaysNeeded).forEach((week) => {
        if (leastExpensiveOptions[week] === "oneWays") {
          purchase.oneWay += oneWaysNeeded[week];
          use[week] = "oneWays";
        } else if (leastExpensiveOptions[week] === "weekly") {
          purchase.weekly += 1;
          use[week] = "weekly";
        }
      });
      recommendation.savings = fares["monthly"] - costOfLeastExpensiveOptions;
      recommendation.totalCost = costOfLeastExpensiveOptions;
      recommendation.message = "A combination of one way and weekly tickets is your least expensive option.";
    } else {
      purchase.monthly = 1;
      Object.keys(oneWaysNeeded).forEach((week) => { use[week] = "monthly" });
      recommendation.savings = costOfLeastExpensiveOptions - fares["monthly"];
      recommendation.totalCost = fares["monthly"];
      recommendation.message = "A monthly ticket is your least expensive option.";
    }

    recommendation.purchase = purchase;
    recommendation.use = use;
    const queryObj = { origin: station.name, ...travelData, recommendation, fares };
    const result = await module.exports.saveQuery(queryObj); // FIXME: Calling saveQuery via module.exports so that testing stub works correctly. There must be a better way.
    return result;
  } catch (error) {
    return error;
  }
};

const saveQuery = async (queryObj) => {
  const query = new Query(queryObj);
  const res = await query.save();
  return res;
}

const getFaresLIRR = async (station, destination) => {
  const destinationStation = await stationService.findStationByName(destination);
  const destinationFareZone = destinationStation["fareZone"];
  return station.destinations[destinationFareZone];
}

module.exports = {
  getFaresLIRR,
  getRecommendation,
  saveQuery
};