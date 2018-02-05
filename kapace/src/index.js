import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect } from 'react-router'

import {Provider} from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'

import createBrowserHistory from 'history/createBrowserHistory'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import Store from './Store.js'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()

const stores = {
  routing: routingStore,
  SplitStore: Store
}

// check BrowserHistory component. Does the same?
const history = syncHistoryWithStore(browserHistory, routingStore)

const Root = (
  <Provider {...stores}>
    <Router history={history}>
      <div>
        <Redirect from='/' to='/cumulative'/>
        <Route path='/cumulative' component={App}/>
      </div>
    </Router>
  </Provider>
)

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
