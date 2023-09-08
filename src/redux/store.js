import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import roomReducer from './slices/roomSlice';
import musicSlice from './slices/musicSlice';

const rootReducer = combineReducers({
  room: roomReducer,
  audio: musicSlice,
});

const initialState = {
  audio: {
    audioFiles: [],
  },
};


const store = createStore(
  rootReducer, 
  initialState,
  applyMiddleware(thunk));

export default store;
