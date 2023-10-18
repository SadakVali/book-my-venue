import { toast } from "react-hot-toast";

export const flattenObject = (inputObj) => {
  const filteredInputObj = { ...inputObj };
  ["allBookings", "createdAt", "updatedAt", "__v", "_id"].forEach(
    (key) => delete filteredInputObj[key]
  );
  // console.log(filteredInputObj);
  const flatObj = {};
  for (const key in filteredInputObj) {
    // console.log(key);
    if (Array.isArray(filteredInputObj[key])) {
      flatObj[key] = filteredInputObj[key];
    } else if (
      typeof filteredInputObj[key] === "object" &&
      filteredInputObj[key] !== null
    ) {
      // Recursively flatten nested objects
      const nestedFlatObj = flattenObject(filteredInputObj[key]);
      Object.assign(flatObj, nestedFlatObj);
    } else {
      // Add non-object values directly
      flatObj[key] = filteredInputObj[key];
    }
  }
  return flatObj;
};

export const getCurrentLocation = ({ setValue, trigger }) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
        trigger(["longitude", "latitude"]);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
          toast.error("User denied the request for Geolocation");
        else toast.error("An error occurred while getting your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else toast.error("Geolocation is not available in your browser");
};

// Convert Unix timestamp to local date and time
export const unixTimestampToLocal = (timestamp) => {
  // Multiply by 1000 to convert seconds to milliseconds
  const localDate = new Date(timestamp * 1000);
  const year = localDate.getFullYear();
  const month = localDate.getMonth() + 1;
  const date = localDate.getDate();
  const hours = localDate.getHours();
  return [year, month, date, hours];
};

// Convert local date and time to Unix timestamp
export const localToUnixTimestamp = (year, month, date, hours) => {
  const localDate = new Date(year, month - 1, date, hours, 0, 0, 0);
  return Math.floor(localDate.getTime() / 1000); // Divide by 1000 to get seconds
};

export const convertHourAMPMTo24Hour = (hours, period) => {
  if (period === "PM" && hours !== 12) hours = hours + 12;
  else if (period === "AM" && hours === 12) hours = 0;
  return hours;
};

export const createRangeArray = (start, end) => {
  const result = [];
  for (let i = start; i <= end; i++) result.push(i);
  return result;
};

// Function to check for conflicts
export const checkForConflict = (newBooking, existingBookings) => {
  const [newCheckInTimestamp, newCheckOutTimestamp] = newBooking;
  for (const existingBooking of existingBookings) {
    const [existingCheckInTimestamp, existingCheckOutTimestamp] =
      existingBooking;
    if (
      newCheckInTimestamp < existingCheckOutTimestamp &&
      newCheckOutTimestamp > existingCheckInTimestamp
    )
      return true;
  }
  return false;
};

export const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const convertHour24HourToAMPM = (hours) => {
  // hours = parseInt(hours);
  console.log({ hours });
  if (hours === 0) {
    return "12 : 00 AM";
  } else if (hours < 10) {
    return `0${hours} : 00 AM`;
  } else if (hours < 12) {
    return `${hours} : 00 AM`;
  } else if (hours === 12) {
    return "12 : 00 PM";
  } else if (hours - 12 < 10) {
    return `0${hours - 12} : 00 PM`;
  } else {
    return `${hours - 12} : 00 PM`;
  }
};

// Manager Home
const lastDateOfMonth = (nextMonth, nextMonthYear) => {
  const currentDate = new Date(nextMonthYear, nextMonth - 1, 1);
  let lastDayDate;
  while (currentDate.getMonth() + 1 === nextMonth) {
    lastDayDate = currentDate.getDate();
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return lastDayDate;
};

export const generateStartingAndEndingUnixTimeStamps = (
  selectedMonth,
  selectedYear
) => {
  const lastMonth = selectedMonth - 1 === 0 ? 12 : selectedMonth - 1;
  const lastMonthYear = lastMonth === 1 ? selectedYear - 1 : selectedYear;
  const nextMonth = selectedMonth + 1 === 13 ? 1 : selectedMonth + 1;
  const nextMonthYear = nextMonth === 1 ? selectedYear + 1 : selectedYear;
  const nextMonthLastDate = lastDateOfMonth(nextMonth, nextMonthYear);
  const startingUnixTimeStamp = localToUnixTimestamp(
    lastMonthYear,
    lastMonth,
    1,
    0
  );
  const endingUnixTimeStamp = localToUnixTimestamp(
    nextMonthYear,
    nextMonth,
    nextMonthLastDate,
    23
  );
  return { startingUnixTimeStamp, endingUnixTimeStamp };
};

export const generateBookingStatusOfEachDay = (
  selectedMonth,
  selectedYear,
  unixTimeStamps,
  setBookingStatus
) => {
  // console.log("START");
  const lastMonth = selectedMonth - 1 === 0 ? 12 : selectedMonth - 1;
  const lastMonthYear = lastMonth === 1 ? selectedYear - 1 : selectedYear;
  const nextMonth = selectedMonth + 1 === 13 ? 1 : selectedMonth + 1;
  const nextMonthYear = nextMonth === 1 ? selectedYear + 1 : selectedYear;
  const nextMonthLastDate = lastDateOfMonth(nextMonth, nextMonthYear);

  const dateIter = new Date(lastMonthYear, lastMonth - 1, 1);
  const bookingStatus = {};
  bookingStatus[
    `${dateIter.getDate()}/${dateIter.getMonth() + 1}/${dateIter.getFullYear()}`
  ] = null;
  // console.log(
  //   `${dateIter.getDate()}/${dateIter.getMonth() + 1}/${dateIter.getFullYear()}`
  // );
  dateIter.setDate(dateIter.getDate() + 1);
  while (
    !(
      dateIter.getFullYear() === nextMonthYear &&
      dateIter.getMonth() + 1 === nextMonth &&
      dateIter.getDate() === nextMonthLastDate
    )
  ) {
    bookingStatus[
      `${dateIter.getDate()}/${
        dateIter.getMonth() + 1
      }/${dateIter.getFullYear()}`
    ] = null;
    // console.log(
    //   `${dateIter.getDate()}/${
    //     dateIter.getMonth() + 1
    //   }/${dateIter.getFullYear()}`
    // );
    dateIter.setDate(dateIter.getDate() + 1);
  }
  bookingStatus[
    `${dateIter.getDate()}/${dateIter.getMonth() + 1}/${dateIter.getFullYear()}`
  ] = null;
  // console.log(
  //   `${dateIter.getDate()}/${dateIter.getMonth() + 1}/${dateIter.getFullYear()}`
  // );

  // console.log("HERE");

  for (let i = 0; i < unixTimeStamps.length; i += 1) {
    const [startUnixTiemStamp, endUnixTimeStamp] = unixTimeStamps[i];
    const [strYear, strMonth, strDay, strHours] =
      unixTimestampToLocal(startUnixTiemStamp);
    const [endYear, endMonth, endDay, endHours] =
      unixTimestampToLocal(endUnixTimeStamp);
    console.log({
      start: [strYear, strMonth, strDay, strHours],
      end: [endYear, endMonth, endDay, endHours],
    });
    const startDate = new Date(strYear, strMonth - 1, strDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const startDateKey = formatDate(startDate);
    const endDateKey = formatDate(endDate);
    if (startDateKey === endDateKey) {
      if (bookingStatus[startDateKey] !== true) {
        if (bookingStatus[startDateKey] === null)
          bookingStatus[startDateKey] = [
            null,
            [
              [
                convertHour24HourToAMPM(strHours),
                convertHour24HourToAMPM(endHours),
              ],
            ],
            null,
          ];
        else if (Array.isArray(bookingStatus[startDateKey]))
          bookingStatus[startDateKey][1].push([
            convertHour24HourToAMPM(strHours),
            convertHour24HourToAMPM(endHours),
          ]);
      } else console.log("CODING LOGICAL ERROR EXISTS 1");
      continue;
    } else {
      if (bookingStatus[startDateKey] !== true) {
        if (bookingStatus[startDateKey] === null)
          bookingStatus[startDateKey] = [
            null,
            [],
            convertHour24HourToAMPM(strHours),
          ];
        else if (Array.isArray(bookingStatus[startDateKey]))
          bookingStatus[startDateKey][2] = convertHour24HourToAMPM(strHours);
      } else console.log("CODING LOGICAL ERROR EXISTS 2");
      if (bookingStatus[endDateKey] !== true) {
        if (bookingStatus[endDateKey] === null)
          bookingStatus[endDateKey] = [
            convertHour24HourToAMPM(endHours),
            [],
            null,
          ];
        else if (Array.isArray(bookingStatus[endDateKey]))
          bookingStatus[endDateKey][0] = convertHour24HourToAMPM(endHours);
      } else console.log("CODING LOGICAL ERROR EXISTS 3");
    }

    const currentDate = startDate;
    if (formatDate(currentDate) === formatDate(endDate))
      console.log("CODING LOGICAL ERROR EXISTS 4");
    currentDate.setDate(currentDate.getDate() + 1);
    if (formatDate(currentDate) !== formatDate(endDate)) {
      // const startDate = new Date(2023, 0, 1); // January 1, 2023
      while (formatDate(currentDate) !== formatDate(endDate)) {
        if (formatDate(currentDate) in bookingStatus) {
          if (bookingStatus[formatDate(currentDate)] === null)
            bookingStatus[formatDate(currentDate)] = true;
          else
            console.log(
              `CODING LOGICAL ERROR EXISTS 5 ${formatDate(currentDate)} = ${
                bookingStatus[formatDate(currentDate)]
              }`
            );
        } else console.log(`NOT A LOGICAL ERROR`);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  console.log("LENGTH", Object.keys(bookingStatus).length);
  console.log(bookingStatus);
  // [
  //   {end: [2023, 11, 15, 14]
  //   start: [2023, 11, 12, 15]},

  //   {end: [2023, 12, 1, 14]
  //   start: [2023, 11, 29, 15]},

  //   {end: [2023, 12, 12, 14]
  //   start: [2023, 12, 10, 15]},

  //   {end: [2024, 1, 1, 14]
  //   start: [2023, 12, 30, 15]},

  //   {end: [2024, 1, 14, 14]
  //   start: [2024, 1, 12, 15]}
  //   ]

  // TODO: Need to eliminate before productioinization
  bookingStatus["15/12/2023"] = [
    8,
    [
      [9, 13],
      [14, 17],
    ],
    18,
  ];

  setBookingStatus(bookingStatus);
  // console.log("END");
};

export const unixAdjustment = (unixTime, type = "d") => {
  // console.log({ type });
  const [y, m, d, t] = unixTimestampToLocal(unixTime);
  if (type === "d")
    return [d < 10 ? `0${d}` : d, m < 10 ? `0${m}` : m, y].join("-");
  const res = convertHour24HourToAMPM(t);
  // console.log({ res });
  return res;
};
