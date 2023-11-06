import {applyMiddleware, createStore} from "redux";
import promiseMiddleware from 'react-promise'
import ReduxThunk from 'react-thunk'
// import Reducer from './modules/index'




const initialState = {
  sidebarShow: true,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)


// const store = createStoreWithMiddleware(Reducer,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(changeState)

export default store
