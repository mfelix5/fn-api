// const _ = require("lodash");
const fareService = require("../services/fareService");

const getRecommendation = async (travelObject) => {
  try {
    ["origin", "destination", "system", "fareType", "month", "oneWaysNeeded"].forEach((field) => {
      if (!travelObject[field]) throw new Error(`${field} is required.`);
    });

    const { destination, fareType, oneWaysNeeded, onHand, origin, system } = travelObject;

    const recommendation = {
      purchase: {
        oneWay: 0,
        weekly: 0,
        monthly: 0,
      },
      use: {},
    };

    const fares = await fareService.getFares({
      system, origin, destination, fareType,
    });

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
      leastExpensiveOptions[(week)] = oneWaysNeeded[(week)] * fares.oneWay < fares.weekly ? "oneWays" : "weekly";
      leastExpensiveCosts[(week)] = oneWaysNeeded[(week)] * fares.oneWay < fares.weekly
        ? oneWaysNeeded[(week)] * fares.oneWay : fares.weekly;
    });

    const costOfLeastExpensiveOptions = Object.values(leastExpensiveCosts).reduce((a, b) => a + b);
    const use = {};
    const purchase = {
      oneWay: 0,
      weekly: 0,
      monthly: 0,
    };

    if (costOfLeastExpensiveOptions < fares.monthly) {
      Object.keys(oneWaysNeeded).forEach((week) => {
        if (leastExpensiveOptions[week] === "oneWays") {
          purchase.oneWay += oneWaysNeeded[week];
          use[week] = "oneWays";
        } else if (leastExpensiveOptions[week] === "weekly") {
          purchase.weekly += 1;
          use[week] = "weekly";
        }
      });
      recommendation.savings = fares.monthly - costOfLeastExpensiveOptions;
      recommendation.totalCost = costOfLeastExpensiveOptions;
      recommendation.message = "A combination of one way and weekly tickets is your least expensive option."; // TODO: make message more dynamic/interesting
    } else {
      purchase.monthly = 1;
      Object.keys(oneWaysNeeded).forEach((week) => {
        use[week] = "monthly";
      });
      recommendation.totalCost = fares.monthly;
      recommendation.message = "A monthly ticket is your best option.";
    }

    recommendation.purchase = purchase;
    recommendation.use = use;
    return recommendation;
  } catch (err) {
    console.log(`Error from getRecommendation(): ${err}`);
  }
};

module.exports = {
  getRecommendation,
};
