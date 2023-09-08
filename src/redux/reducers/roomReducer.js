// // redux/reducers/roomReducer.js
// const initialState = {
//   createdRoomId: null,
//   joinedRoomMessage: '',
//   fetchedRoomId: null,
//   name: '', // Make sure 'name' is initially an empty string
// };

// const roomReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'CREATE_ROOM_SUCCESS':
//       return { ...state, createdRoomId: action.payload.roomId };
//     case 'JOIN_ROOM_SUCCESS':
//       return {
//         ...state,
//         joinedRoomMessage: action.payload.message,
//         name: action.payload.name,
//       };
//     case 'FETCH_ROOM_ID_SUCCESS':
//       return { ...state, fetchedRoomId: action.payload.roomId, name: action.payload.name };
//     default:
//       return state;
//   }
// };

// export default roomReducer;
