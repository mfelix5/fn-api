const { expect } = require('chai')
const { getCalendar } = require("../src/services/calendarService");

describe("Calendar Service", () => {

  it("should correcly return calendar for February - 2020 (29 days)", () => {
    const calendar = getCalendar("February", 2020);
    const weeks = Object.values(calendar);
    expect(weeks).to.have.lengthOf(5, "wrong number of weeks returned");

    const startDate = calendar.week1.split(" - ")[0];
    const endDate = calendar.week5.split(" - ")[1];
    expect(startDate).to.include("Sat Feb 01 2020");
    expect(endDate).to.include("Sat Feb 29 2020");
  });

  it("should correcly return calendar for February - 2021 (28 days)", () => {
    const calendar = getCalendar("February", 2021);
    const weeks = Object.values(calendar);
    expect(weeks).to.have.lengthOf(5, "wrong number of weeks returned");

    const startDate = calendar.week1.split(" - ")[0];
    const endDate = calendar.week5.split(" - ")[1];
    expect(startDate).to.include("Mon Feb 01 2021");
    expect(endDate).to.include("Sun Feb 28 2021");
  });

  it("should correcly return calendar for March - 2020", () => {
    const calendar = getCalendar("March", 2020);
    const weeks = Object.values(calendar);
    expect(weeks).to.have.lengthOf(5, "wrong number of weeks returned");

    const startDate = calendar.week1.split(" - ")[0];
    const endDate = calendar.week5.split(" - ")[1];
    expect(startDate).to.include("Sun Mar 01 2020");
    expect(endDate).to.include("Tue Mar 31 2020");
  });

  it("should correcly return calendar for April - 2020", () => {
    const calendar = getCalendar("April", 2020);
    const weeks = Object.values(calendar);
    expect(weeks).to.have.lengthOf(5, "wrong number of weeks returned");

    const startDate = calendar.week1.split(" - ")[0];
    const endDate = calendar.week5.split(" - ")[1];
    expect(startDate).to.include("Wed Apr 01 2020");
    expect(endDate).to.include("Thu Apr 30 2020");
  });

  it("should correcly return calendar for May - 2020 (6 weeks)", () => {
    const calendar = getCalendar("May", 2020);
    const weeks = Object.values(calendar);
    expect(weeks).to.have.lengthOf(6, "wrong number of weeks returned");

    const startDate = calendar.week1.split(" - ")[0];
    const endDate = calendar.week6.split(" - ")[1];
    expect(startDate).to.include("Fri May 01 2020");
    expect(endDate).to.include("Sun May 31 2020");
  });

});
