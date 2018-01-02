import {observable, action, computed} from 'mobx'

import {formatTime} from './utils'

class Split {

  constructor(_time) {
    this.time = _time
    this.id = +new Date()
  }

  // seconds
  @observable time = 0

  @action updateTime = (_time) => {
    const m = _time.match(/(\d{1,2}):(\d{2})/)

    if(m != null) {
      const minutes = parseInt(m[1], 10) * 60 || 0
      const seconds = parseInt(m[2], 10) || 0
      this.time = minutes + seconds
    } else {
      console.log(`Failed to update time to ${_time}`)
    }
  }

  @computed get format() {
    return formatTime(this.time);
  }
}

class SplitStore {

  @observable splits = []

  @action addSplit = (time) => {
    const split = new Split(time)
    this.splits.push(split)
  }

  @action removeSplit = (atPos) => {
    console.log( `--/Splits in store:`, this.splits.map(e => e.time))
    console.log( `Removing split @${atPos} -> ${this.splits[atPos].time}` )
    this.splits.splice(atPos, 1)
    console.log( `++/Splits in store:`, this.splits.map(e => e.time))
  }

  @computed get totalTime() {
    return this.splits.reduce((a, b) => a + b.time, 0)
  }

  @computed get formattedTime() {
    return formatTime(this.totalTime)
  }

  @computed get formattedAvgTime() {
    return formatTime(this.totalTime/this.total)
  }

  @computed get total() {
    return this.splits.length
  }

  cumulative = (pos) => {
    const c = this.splits.slice(0, pos + 1).map(e => e.time).reduce((a, b) => a + b, 0)
    return formatTime(c);
  }

  avg = (pos) => {
    const c = this.splits.slice(0, pos + 1).map(e => e.time).reduce((a, b) => a + b, 0)
    return formatTime(c/(pos+1))
  }

}

const Store = window.store = new SplitStore()
Store.addSplit(5*60)

export default Store
