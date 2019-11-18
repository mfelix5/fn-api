const moment = require('moment');

const getCalendar = (month, year) => {
  try {
    if (!month || !year) throw new Error(`'month' and 'year' are required.`);

    const monthIndex = moment().month(month).format("M") - 1;
    const firstOfMonth = moment([year, monthIndex]).utc();
    const lastOfMonth = moment(firstOfMonth).endOf('month').utc();

    const firstFriday = firstOfMonth.clone();
    while (firstFriday.day() !== 5) firstFriday.add(1, "day");

    const calendar = {};
    calendar.week1 = `${firstOfMonth} - ${firstFriday}`;
    calendar.week2 = `${firstFriday.clone().add(1, "days")} - ${firstFriday.clone().add(7, "days")}`;
    calendar.week3 = `${firstFriday.clone().add(8, "days")} - ${firstFriday.clone().add(14, "days")}`;
    calendar.week4 = `${firstFriday.clone().add(15, "days")} - ${firstFriday.clone().add(21, "days")}`;

    if (firstFriday.clone().add(28, "days") <= lastOfMonth) {
      calendar.week5 = `${firstFriday.clone().add(22, "days")} - ${firstFriday.clone().add(28, "days")}`;
    }

    if (firstFriday.clone().add(29, "days") <= lastOfMonth) {
      calendar.week6 = `${firstFriday.clone().add(29, "days")} - ${lastOfMonth}`;
    }

    return calendar;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCalendar,
};
