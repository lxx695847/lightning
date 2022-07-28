import Vue from 'vue';
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
export const formatDate = (time, { hasHour = true } = {}) => {
  const isEn = (location.pathname.startsWith('/zh') ? 'zh' : 'en') === 'en'
  if (!time) return isEn ? 'No Publish' : '未发布'
  const date = new Date(time)
  const year = date.getFullYear()
  const month = allMonth[date.getMonth()].slice(0, 3)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const apm = hours > 12 ? 'pm' : 'am'
  if (isEn) {
    const hourStr = hasHour ? `${hours}:${minutes > 9 ? minutes : '0' + minutes} ${apm}` : ''
    return `${date.getDate()} ${month} ${year} ${hourStr}`  
  }
  const hourStr = hasHour ? `${hours}:${minutes > 9 ? minutes : '0' + minutes}` : ''
  return `${year}年${date.getMonth() + 1}月${date.getDate()}日 ${hourStr}`
}