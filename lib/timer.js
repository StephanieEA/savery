let currentTime = 0
let run = false
let timer = null

const secondsToTime = (s, run) => {
  const momentTime = moment.duration(s, 'seconds');
  const sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds()
  const min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes()
  const hours = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours()
  return `${hours}:${min}:${sec}`
}
