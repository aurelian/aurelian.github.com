import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import './App.css'

@inject('SplitStore')
@observer
class App extends Component {

  addSplit = (ev) => {
    ev.preventDefault();
    this.props.SplitStore.addSplit(300)
  }

  render() {
    const {SplitStore} = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">KaPACE</h1>
        </header>

        <div className="App-container">
          <p>cummulative time: {SplitStore.formattedTime}</p>
          <p>average time: {SplitStore.formattedAvgTime} (splits: {SplitStore.total})</p>
          {SplitStore.splits.map( (sp, idx) =>
            <Split split={sp} pos={idx} key={sp.id}/>)}
          <button title="Add split"
            onClick={ e => this.addSplit(e) }>Add split</button>
        </div>

        <div className="App-debug">
          <DevTools />
        </div>
      </div>
    )
  }
}

@inject('SplitStore')
@observer
class Split extends Component {

  updateTime = (e) => {
    const split = this.props.split

    split.updateTime(e.target.value)
    e.target.value = split.format
  }

  removeSplit = (ev) => {
    ev.preventDefault()
    this.props.SplitStore.removeSplit(this.props.pos)
  }

  render() {
    const split = this.props.split
    const pos  = this.props.pos

    return(
      <div className="Split">
        <span>{pos + 1}. </span>
        <button onClick={e => this.removeSplit(e)}>(-)</button>
        <input size="8" required pattern="[0-9]{1,2}:[0-9]{2}" autoFocus type="text" defaultValue={split.format}
          onFocus={e => e.target.select()}
          onBlur={e => this.updateTime(e)} />
        <span> {this.props.SplitStore.cumulative(pos)} &mdash; {this.props.SplitStore.avg(pos)} </span>

      </div>
    )
  }
}

export default App
