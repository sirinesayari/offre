/* eslint-disable */
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import { reducers } from "../reducers";
import { thunk } from "redux-thunk";

function saveToSessionStorage(store) {
  try {
      const serializedStore = JSON.stringify(store);
      window.sessionStorage.setItem('store', serializedStore);
  } catch(e) {
      console.log(e);
  }
}

function loadFromSessionStorage() {
  try {
      const serializedStore = window.sessionStorage.getItem('store');
      if(serializedStore === null) return undefined;
      return JSON.parse(serializedStore);
  } catch(e) {
      console.log(e);
      return undefined;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedState = loadFromSessionStorage();

const store = createStore(reducers, persistedState, composeEnhancers(applyMiddleware(thunk)));

store.subscribe(() => saveToSessionStorage(store.getState()));

export default store;
