const Query = require("../models/query");
const stationService = require("../services/stationService");

const getRecommendation = async (travelData) => {
  try {
    ["origin", "destination", "line", "system", "fareType", "month", "oneWaysNeeded"].forEach((field) => {
      if (!travelData[field]) throw new Error(`${field} is required.`);
    });

    const { destination, fareType, line, oneWaysNeeded, onHand, origin, system } = travelData;

    const station = await stationService.findStation(origin, line, system);
    if (!station || !station.fares) throw new Error(`Unable to find station and fares.`);
    const { fares } = station;
    const routeFares = fares[destination];

    const recommendation = {
      purchase: {
        oneWay: 0,
        weekly: 0,
        monthly: 0,
      },
      use: {},
    };

    if (onHand) {
      const totalOneWaysNeeded = Object.values(oneWaysNeeded).reduce((a, b) => a + b);
      if (onHand.oneWay >= totalOneWaysNeeded) {
        recommendation.use = oneWaysNeeded;
        recommendation.message = "One ways on hand are sufficient for your planned travel.";
      }

      while (onHand.oneWay > 0) {
        // identify week with lowest non-zero travel
        let minWeek;
        Object.keys(oneWaysNeeded).forEach((week) => {
          if (oneWaysNeeded[week] > 0) {
            minWeek = (minWeek === undefined || oneWaysNeeded[week] < oneWaysNeeded[minWeek]) ? week : minWeek;
          }
        });
        // apply on hand tickets to minWeek
        if (oneWaysNeeded[minWeek] >= onHand.oneWay) {
          oneWaysNeeded[minWeek] -= onHand.oneWay;
          onHand.oneWay = 0;
        } else {
          onHand.oneWay -= oneWaysNeeded[minWeek];
          oneWaysNeeded[minWeek] = 0;
        }
      }
    }

    const leastExpensiveOptions = {};
    const leastExpensiveCosts = {};

    Object.keys(oneWaysNeeded).forEach((week) => {
      leastExpensiveOptions[(week)] = oneWaysNeeded[(week)] * routeFares["one-way"] < routeFares.weekly ? "oneWays" : "weekly";
      leastExpensiveCosts[(week)] = oneWaysNeeded[(week)] * routeFares["one-way"] < routeFares.weekly
        ? oneWaysNeeded[(week)] * routeFares["one-way"] : routeFares.weekly;
    });

    const costOfLeastExpensiveOptions = Object.values(leastExpensiveCosts).reduce((a, b) => 1 * a + 1 * b);
    const use = {};
    const purchase = {
      oneWay: 0,
      weekly: 0,
      monthly: 0,
    };

    if (costOfLeastExpensiveOptions < routeFares.monthly) {
      Object.keys(oneWaysNeeded).forEach((week) => {
        if (leastExpensiveOptions[week] === "oneWays") {
          purchase.oneWay += oneWaysNeeded[week];
          use[week] = "oneWays";
        } else if (leastExpensiveOptions[week] === "weekly") {
          purchase.weekly += 1;
          use[week] = "weekly";
        }
      });
      recommendation.savings = routeFares.monthly - costOfLeastExpensiveOptions;
      recommendation.totalCost = costOfLeastExpensiveOptions;
      recommendation.message = "A combination of one way and weekly tickets is your least expensive option."; // TODO: make message more dynamic/interesting
    } else {
      purchase.monthly = 1;
      Object.keys(oneWaysNeeded).forEach((week) => {
        use[week] = "monthly";
      });
      recommendation.totalCost = routeFares.monthly;
      recommendation.message = "A monthly ticket is your best option.";
    }

    recommendation.purchase = purchase;
    recommendation.use = use;

    const query = new Query({ ...travelData, recommendation });
    await query.save();
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getRecommendation,
};
