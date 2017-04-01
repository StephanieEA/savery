const $ = require('jquery')
const moment = require('moment')

let currentTime = 0
let pause = false
let timer = null

const secondsToTime = (s) => {
  const momentTime = moment.duration(s, 'seconds');
  const sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds()
  const min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes()
  const hours = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours()
  return `${hours}:${min}:${sec}`
}

const resetTimer = (target, timer, pause) => {
  clearInterval(timer)
  target.text('START')
  pause = false
}


$('#increase-time').on('click', () => {
  currentTime = currentTime + 5
  timerDiv.innerHTML = secondsToTime(currentTime)
})

$('#decrease-time').on('click', (e) => {
  if (currentTime - 5 <= 0) {
    return
  } else {
    currentTime = currentTime - 5
    timerDiv.innerHTML = secondsToTime(currentTime)
  }
})

$('#start-timer').on('click', (e) => {
  const target = $(e.target)
  pause = !pause
  if (!pause) {
    resetTimer(target, timer, pause)
  } else {
    timer = setInterval(() => {
    if(currentTime <= 0) {
      resetTimer(target, timer, pause)
    } else {
      currentTime = currentTime - 1
      target.text('PAUSE')
    }
    timerDiv.innerHTML = secondsToTime(currentTime)
  }, 1000)
  }
})
