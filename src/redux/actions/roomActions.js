import axios from 'axios';

export const createRoom = (name, number) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:4000/room/createRoom', {
      name,
      number,
    });
    const roomId = response.data.roomId;
    dispatch({ type: 'CREATE_ROOM_SUCCESS', payload: { roomId } }); // Dispatch the success action
    return response;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};


export const fetchRoomId = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:4000/room/getRoomId'); 
    const roomId = response.data.roomId; 
    dispatch({ type: 'FETCH_ROOM_ID_SUCCESS', payload: { roomId } });
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
        payload: { message: response.data.message },
      });
    } else {
      console.log(response)
      throw new Error('Failed to join room: Server response indicates an error');
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
};

