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
    if (roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/room/getRoom/${roomId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch room data');
          }

          const data = await response.json();
          console.log('API Response:', data);

          dispatch(fetchRoomIdSuccess(data.room));

          setParticipants(data.room.participants);
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };

      fetchRoomData();
    }
  }, [dispatch, roomId]);

  return (
    <div className="container-fluid">
      <div className="row">
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <h4 className="d-flex justify-content-between align-items-center fw-boldpx-3 mt-4 mb-1 mb-4">
              Participants
            </h4>
            <ul className="nav flex-column">
              {participants.map((participant, index) => (
                <li className="nav-item" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{participant.displayName}</h5>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h1 className='text-center mt-2'>{name} - {roomId}</h1>
          <Music roomId={roomId} />
        </main>
      </div>
    </div>

  );
}

export default RoomPage;
