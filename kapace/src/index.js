import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router'

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

// check BrowserHistory comompoent. Does the same?
const history = syncHistoryWithStore(browserHistory, routingStore)

const Root = (
  <Provider {...stores}>
    <Router history={history}>
      <Route path='/' component={App}/>
    </Router>
  </Provider>
)

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
