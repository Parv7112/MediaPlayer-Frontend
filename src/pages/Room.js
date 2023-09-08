import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Music from '../components/Music';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoomIdSuccess } from '../redux/slices/roomSlice';

function RoomPage() {
  const { roomId } = useParams();
  const name = useSelector((state) => state.room.name);
  const dispatch = useDispatch();

  useEffect(() => {
    // Make sure roomId is defined before making the API call
    if (roomId) {
      // Define the fetchRoomData function inside useEffect
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/room/getRoom/${roomId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch room data');
          }

          const data = await response.json();
          
          console.log('API Response:', data); // Log the API response

          // Dispatch the action with the fetched data
          dispatch(fetchRoomIdSuccess(data.room)); // Use data.room to access the 'name' field
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };

      fetchRoomData(); // Call the fetchRoomData function
    }
  }, [dispatch, roomId]); // Add roomId as a dependency

  return (
    <div>
      <h1 className='text-center mt-2'>{name} - {roomId}</h1>
      <Music />
    </div>
  );
}

export default RoomPage;
