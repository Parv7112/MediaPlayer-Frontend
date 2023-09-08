const initialState = {
  createdRoomId: null,
  joinedRoomMessage: '',
  fetchedRoomId: null,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ROOM_SUCCESS':
      console.log('Created Room ID:', action.payload.roomId);
      return { ...state, createdRoomId: action.payload.roomId };
    case 'JOIN_ROOM_SUCCESS':
      return { ...state, joinedRoomMessage: action.payload.message };
    case 'FETCH_ROOM_ID_SUCCESS':
      return { ...state, fetchedRoomId: action.payload.roomId }; // Update the state
    default:
      return state;
  }
};

export default roomReducer;
