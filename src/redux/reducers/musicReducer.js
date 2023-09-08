import { combineReducers } from 'redux';
import {
  UPLOAD_AUDIO_SUCCESS,
  FETCH_ALL_AUDIO_SUCCESS,
  FETCH_AUDIO_BY_ID_SUCCESS,
  DELETE_AUDIO_SUCCESS,
} from '../actions/musicActions';


const initialAudioState = {
  audioFiles: [],
};


const musicReducer = (state = initialAudioState, action) => {
  switch (action.type) {
    case UPLOAD_AUDIO_SUCCESS:
      return state;

    case FETCH_ALL_AUDIO_SUCCESS:
      return {
        ...state,
        audioFiles: [action.audioFiles],
      };

    case FETCH_AUDIO_BY_ID_SUCCESS:
      return {
        ...state,
        audioFiles: [...state.audioFiles, action.audioFiles],
      };
    case DELETE_AUDIO_SUCCESS:
      return state;
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  audio: musicReducer,
});

export default rootReducer;
