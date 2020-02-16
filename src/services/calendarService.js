const moment = require('moment');

const getCalendar = (month, year) => {
  try {
    if (!month || !year) throw new Error(`'month' and 'year' are required.`);

    const monthIndex = moment().month(month).format("M") - 1;
    const firstOfMonth = moment([year, monthIndex]).utc();
    const lastOfMonth = moment(firstOfMonth).endOf('month').utc();

    const firstFriday = firstOfMonth.clone();
    while (firstFriday.day() !== 5) firstFriday.add(1, "day");
    const secondFriday = firstFriday.clone().add(7, "days");
    const thirdFriday = firstFriday.clone().add(14, "days");
    const fourthFriday = firstFriday.clone().add(21, "days");
    const fifthFriday = firstFriday.clone().add(28, "days");

    const calendar = {};
    calendar.week1 = `${firstOfMonth} - ${firstFriday}`;
    calendar.week2 = `${firstFriday.clone().add(1, "days")} - ${secondFriday}`;
    calendar.week3 = `${firstFriday.clone().add(8, "days")} - ${thirdFriday}`;
    calendar.week4 = `${firstFriday.clone().add(15, "days")} - ${fourthFriday}`;

    if (fourthFriday < lastOfMonth) {
      const firstOfWeek = firstFriday.clone().add(22, "days")
      if (lastOfMonth < fifthFriday) {
        calendar.week5 = `${firstOfWeek} - ${lastOfMonth}`;
      } else {
        calendar.week5 = `${firstOfWeek} - ${fifthFriday}`;
      }
    }

    if (fifthFriday < lastOfMonth) {
      const firstOfWeek = firstFriday.clone().add(29, "days")
      calendar.week6 = `${firstOfWeek} - ${lastOfMonth}`;
    }

    return calendar;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getCalendar,
};
