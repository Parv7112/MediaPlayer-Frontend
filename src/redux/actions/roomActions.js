// redux/actions/roomActions.js
import axios from 'axios';

export const createRoom = (name, number) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:4000/room/createRoom', {
      name,
      number,
    });
    const roomId = response.data.roomId;
    dispatch({ type: 'CREATE_ROOM_SUCCESS', payload: { roomId } });
    return response;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const fetchRoomId = (roomId) => async (dispatch) => {
  try {
    if (!roomId) {
      // Handle the case where roomId is not defined (optional)
      console.error('RoomId is not defined.');
      return;
    }

    const response = await axios.get(`http://localhost:4000/room/getRoom/${roomId}`);
    const fetchedRoomId = response.data.roomId;
    const name = response.data.name;

    dispatch({ type: 'FETCH_ROOM_ID_SUCCESS', payload: { roomId: fetchedRoomId, name } });
  } catch (error) {
    console.error('Error fetching roomId:', error);
  }
};

export const joinRoom = (roomId) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:4000/room/joinRoom', {
      roomId,
    });

    if (response && response.data) {
      dispatch({
        type: 'JOIN_ROOM_SUCCESS',
        payload: {
          message: response.data.message,
          room: response.data.data,
          name: response.data.name,
        },
      });
    } else {
      console.error('Failed to join room: Server response indicates an error');
    }
  } catch (error) {
    console.error('Error joining room:', error);
  }
};
