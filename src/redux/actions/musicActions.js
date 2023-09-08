import axios from 'axios';
import {fetchAllAudioSuccess} from '../slices/musicSlice'

export const UPLOAD_AUDIO_SUCCESS = 'UPLOAD_AUDIO_SUCCESS';
export const FETCH_ALL_AUDIO_SUCCESS = 'FETCH_ALL_AUDIO_SUCCESS';
export const FETCH_AUDIO_BY_ID_SUCCESS = 'FETCH_AUDIO_BY_ID_SUCCESS'
export const DELETE_AUDIO_SUCCESS = 'DELETE_AUDIO_SUCCESS';

export const uploadAudioSuccess = () => ({ type: UPLOAD_AUDIO_SUCCESS });
// export const fetchAllAudioSuccess = (audioFiles) => ({ type: FETCH_ALL_AUDIO_SUCCESS, audioFiles });
export const fetchAudioByIdSuccess = (audioFiles) => ({ type: FETCH_AUDIO_BY_ID_SUCCESS, audioFiles})
export const deleteAudioSuccess = () => ({ type: DELETE_AUDIO_SUCCESS });

export const uploadAudio = (audioData) => async (dispatch) => {
  try {
    await axios.post('http://localhost:4000/music/upload', audioData);
    dispatch(uploadAudioSuccess());
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
};

export const fetchAllAudio = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:4000/music/getMusic');
    dispatch(fetchAllAudioSuccess(response.data));
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};

export const fetchAudioById = (audioId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:4000/music/getMusic/${audioId}`);
    dispatch(fetchAudioByIdSuccess(response.data));
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};

export const deleteAudio = (audioId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:4000/music/delete/${audioId}`);
    dispatch(deleteAudioSuccess());
  } catch (error) {
    console.error('Error deleting audio:', error);
  }
};
