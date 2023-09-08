// redux/slices/roomSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createdRoomId: null,
  joinedRoomMessage: '',
  fetchedRoomId: null,
  name: '',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    createRoomSuccess: (state, action) => {
      state.createdRoomId = action.payload.roomId;
    },
    joinRoomSuccess: (state, action) => {
      state.joinedRoomMessage = action.payload.message;
      state.name = action.payload.name;
    },
    fetchRoomIdSuccess: (state, action) => {
      state.fetchedRoomId = action.payload.roomId;
      state.name = action.payload.name;
    },
  },
});

export const { createRoomSuccess, joinRoomSuccess, fetchRoomIdSuccess } = roomSlice.actions;
export default roomSlice.reducer;
