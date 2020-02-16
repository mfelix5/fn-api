const { expect } = require("chai");
const sinon = require("sinon");
const recommendationService = require("../src/services/recommendationService");
const stationService = require("../src/services/stationService");

describe("Recommendation Service", () => {
  let saveStub, stationStub;

  beforeEach(async () => {
    stationStub = sinon.stub(stationService, "findStationById");
    saveStub = sinon.stub(recommendationService, "saveQuery");
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe("NJT", () => {
    const userTravelInput = {
      userId: "12345",
      fareType: "regular",
      originId: "12345",
      destination: "New York",
      month: "2020-03-01",
      oneWaysNeeded: { week1: 10, week2: 8, week3: 0, week4: 6, week5: 0 }
    };

    it("should respond to query with a purchase and travel recommendation", async () => {
      stationStub.returns({
        destinations: {
          "New York": {
            "one-way-peak": 7.25,
            "one-way-reduced": 3.25,
            weekly: 65,
            monthly: 210,
            "10-trip-peak": 72.5
          },
          Hoboken: {
            "one-way-peak": 5.5,
            "one-way-reduced": 2.45,
            weekly: 51.5,
            monthly: 170,
            "10-trip-peak": 55
          }
        },
        name: "Anderson St",
        system: "NJT"
      });
      await recommendationService.getRecommendation(userTravelInput);
      const result = saveStub.args[0][0];

      expect(result).to.have.all.keys([
        "destination",
        "fareType",
        "fares",
        "month",
        "oneWaysNeeded",
        "origin",
        "originId",
        "recommendation",
        "userId"
      ]);

      expect(result.recommendation).to.have.all.keys([
        "message",
        "purchase",
        "savings",
        "totalCost",
        "use"
      ]);
    });
  });

  xdescribe("MTA", () => {});

  xdescribe("LIRR", () => {
    const userTravelInputLIRR = {
      userId: "12345",
      fareType: "regular",
      originId: "12345",
      destination: "Penn Station",
      month: "2020-04-01",
      oneWaysNeeded: { week1: 10, week2: 8, week3: 0, week4: 6, week5: 0 }
    };
  });

  // it("should recommend the simplest puchase option if costs are equal", () => {
  // });
  // it("should provide correct recommendation when discounted fares are used", () => {
  // });
});
