import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import * as serviceWorker from './serviceWorker'

import {applyMiddleware, createStore} from "redux"
import promiseMiddleware from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import Reducer from './modules/reducer'
import {CookiesProvider} from 'react-cookie'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

//middleware
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
//스토어 
const store = createStoreWithMiddleware(Reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__()
)
const persistor = persistStore(store);

ReactDOM.render(
  // <Provider store={store}>
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </CookiesProvider>
  ,

  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()