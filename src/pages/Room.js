import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Music from '../components/Music';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoomIdSuccess } from '../redux/slices/roomSlice';
import socketIOClient from 'socket.io-client';

function RoomPage() {
  const { roomId } = useParams();
  const name = useSelector((state) => state.room.name);
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const [initial, setInitial] = useState(true)
  const [socketReady, setSocketReady] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  useEffect(() => {
    if (roomId && initial) {
      const socket = socketIOClient('http://localhost:4000'); // Replace with your server's URL

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
          console.log(socket)
          setSocket(socket)
          setSocketReady(true); // Mark the socket as ready

          if (socket) {
            socket.emit('joinRoom', roomId);
          }
    
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      };

      setInitial(false)

      fetchRoomData();
    }
  }, [roomId]);

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
          {socketReady && <Music socket={socket} roomId={roomId} {...{currentSongIndex, setCurrentSongIndex}} />} {/* Render Music component when socket is ready */}
        </main>
      </div>
    </div>

  );
}

export default RoomPage;
