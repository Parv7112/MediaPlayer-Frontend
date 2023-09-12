import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Music from '../components/Music';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoomIdSuccess } from '../redux/slices/roomSlice';

function RoomPage() {
  const { roomId } = useParams();
  const name = useSelector((state) => state.room.name);
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState([]);

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
          
          // Set the participants data
          setParticipants(data.room.participants);
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };

      fetchRoomData(); // Call the fetchRoomData function
    }
  }, [dispatch, roomId]); // Add roomId as a dependency

  return (
      <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <h4 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              Participants
            </h4>
            <ul className="nav flex-column">
              {participants.map((participant, index) => (
                <li className="nav-item" key={index}>
                  <span className="nav-link">
                    {participant.displayName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h1 className='text-center mt-2'>{name} - {roomId}</h1>
          <Music />
        </main>
      </div>
    </div>

  );
}

export default RoomPage;
