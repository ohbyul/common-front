import {combineReducers} from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import auth from './AuthReducer'

const persistConfig = {
  key: "root",            // localStorage에 저장
  storage,
  whitelist: ["auth"]     // auth, board.... reducer 중에 auth reducer만 localstorage에 저장 / blacklist -> 그것만 제외
};

const rootReducer = combineReducers({
  auth,
})

export default persistReducer(persistConfig, rootReducer);
