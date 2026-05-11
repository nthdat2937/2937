POMODORO = 1

class Timer {
  constructor() {
    this.startAt = undefined
    this.endAt = undefined
    this.type = undefined
    this.duration = 0 // sec
    this.intervalId = undefined
    this.now = undefined
  }

  prepareStart(config) {
    this.startAt = config.startAt
    this.type = config.type
    this.duration = config.duration
    this.consideredPeriod = false
  }

  start() {
    if (this.intervalId) return

    this.now = new Date().getTime()
    this.intervalId = setInterval(() => {
      this.now = new Date().getTime()
      this.tic()

      if (this.countdown <= 0) this.complete()
    }, 1000)
  }

  complete() {
    setTimeout(() => {
      clearInterval(this.intervalId)
      this.endAt = this.now
      this.intervalId = undefined
      this.lastStrokeDashoffset = null

      postMessage({ event: 'complete', payload: { type: this.type } })
    }, 300)
  }

  stop() {
    clearInterval(this.intervalId)
    this.endAt = this.now
    this.intervalId = undefined
    this.lastStrokeDashoffset = null

    postMessage({ event: 'stop', payload: { type: this.type } })
  }

  get countdown() {
    return Math.round(this.duration - (this.now - this.startAt) / 1000)
  }

  get percentage() {
    return 100 - (100 * this.countdown) / this.duration
  }

  tic() {
    postMessage({
      event: 'changeCountdown',
      payload: {
        countdown: this.countdown,
        type: this.type,
        percentage: this.percentage,
        iconUrl: this.getIconUrl(this.percentage, this.type),
      },
    })

    if (!this.consideredPeriod && this.percentage > 50) {
      postMessage({
        event: 'increaseTimerCounter',
        payload: { type: this.type },
      })
      this.consideredPeriod = true
    }
  }

  getIconUrl(percentage, type) {
    const stokeFactor = percentage < 5 ? percentage : Math.round(percentage)
    const lastStrokeDashoffset = 126 - 1.26 * stokeFactor

    if (this.lastStrokeDashoffset === lastStrokeDashoffset) {
      return this.lastIconUrl
    }

    URL.revokeObjectURL(this.lastIconUrl)
    this.lastStrokeDashoffset = lastStrokeDashoffset
    const isPomodoro = type === POMODORO
    const bgColor = isPomodoro ? '#2563eb55' : '#05966933'
    const color = isPomodoro ? '#2563eb' : '#059669'
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style="transform: rotate(270deg); transform-origin: 50% 50%">
      <circle cx="25" cy="25" r="20" stroke="${bgColor}" stroke-width="10" fill="transparent" />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="${color}"
        stroke-width="10"
        stroke-dashoffset="${-lastStrokeDashoffset}"
        stroke-dasharray="339"
        fill="transparent"
      />
    </svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    this.lastIconUrl = URL.createObjectURL(blob)
    return this.lastIconUrl
  }
}

const timer = new Timer()

onmessage = function (e) {
  const { event, payload } = e.data
  timer[event](payload)
}

postMessage({ event: 'workerLoaded' })
