import { createStore, combineReducers } from 'redux';
import app from './AppReducer';

const ConfigureStore = () => {

  const store = createStore(app);

  return store;
};

export const store = ConfigureStore();
