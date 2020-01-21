const { expect } = require('chai')
const { getCalendar } = require("../src/services/calendarService");

xdescribe("Calendar Service", () => {
  it("should return calendars with the first week ending on the first Friday of the month", () => {
  });
  it("should correcly return calendar for month that spans six weeks", () => {
  });
  it("should correcly return calendar for month that spans five weeks", () => {
  });
  it("should correcly return calendar for February - 2020", () => {
    const result = getCalendar("February", 2020)
  });
  it("should correcly return calendar for February - 2021", () => {
    const result = getCalendar("February", 2021)
  });
})
