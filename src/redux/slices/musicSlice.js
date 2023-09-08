import { createSlice } from '@reduxjs/toolkit';

const initialAudioState = {
  audioFiles: [],
};

const musicSlice = createSlice({
  name: 'music',
  initialState: initialAudioState,
  reducers: {
    uploadAudioSuccess: (state) => {
      // Define behavior for UPLOAD_AUDIO_SUCCESS if needed
      return state;
    },
    fetchAllAudioSuccess: (state, action) => {
      state.audioFiles = action.payload;
    },
    fetchAudioByIdSuccess: (state, action) => {
      state.audioFiles = [action.payload];
    },
    deleteAudioSuccess: (state) => {
      // Define behavior for DELETE_AUDIO_SUCCESS if needed
      return state;
    },
  },
});

export const {
  uploadAudioSuccess,
  fetchAllAudioSuccess,
  fetchAudioByIdSuccess,
  deleteAudioSuccess,
} = musicSlice.actions;

export default musicSlice.reducer;
