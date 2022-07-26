export const allMonth = [
  "January ",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
export const allDate = [
  "Monday ",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "August"
]
export const cumputeDate = (time) => {
  if (!time) return
  const publishDate = new Date(time)
  return `${allMonth[publishDate.getMonth()]} ${publishDate.getDate()}`
} 