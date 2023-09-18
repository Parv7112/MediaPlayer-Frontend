import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../redux/actions/roomActions';
import Logo from '../assets/logo.png';
import Auth from './Auth';
import { getAuth } from 'firebase/auth';
import { fetchRoomIdSuccess } from '../redux/slices/roomSlice'; 

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const [isRoomIdEntered, setIsRoomIdEntered] = useState(false);
  const roomData = useSelector((state) => state.room); 

  const handleHomeClick = () => {
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/room/getRoom/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }

        const data = await response.json();
        console.log('Fetched Room Data:', data);

        dispatch(fetchRoomIdSuccess(data.room));
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    if (roomId) {
      fetchRoomData();
    }
  }, [dispatch, roomId]);

  const handleCreateRoom = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser; 
     
      if (!user) {
        alert('Please log in first to create a room.');
        return;
      }

      const response = await dispatch(createRoom(name, number));
      console.log('Create Room Response:', response);

      if (response && response.data && response.data.roomId) {
        const createdRoomId = response.data.roomId; 
        setRoomCreated(true);
        setRoomId(createdRoomId); 

        navigate(`/room/${createdRoomId}`);

        handleCreateModalClose();
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const auth = getAuth(); 
      const user = auth.currentUser; 

      if (!user) {
        alert('Please log in first to join a room.');
        return;
      }
  
      const response = await fetch('http://localhost:4000/room/addParticipant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
          participant: {
            uid: user.uid, 
            displayName: user.displayName,
            email: user.email,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to join room');
      }
  
      const data = await response.json();
      console.log('Joined room:', data);
      navigate(`/room/${roomId}`);
      handleJoinModalClose(true);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const handleExitRoom = async () => {
    const roomId = roomData.fetchedRoomId
    console.log(roomData.fetchedRoomId)
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        alert('Please log in first.');
        return;
      }
  
      console.log('Exit Room Request Data:', roomId, user.email);
  
      const response = await fetch('http://localhost:4000/room/removeParticipant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
          participant: {
            uid: user.uid,
            email: user.email,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to exit the room');
      }
  
      const data = await response.json();
      console.log('Exited the room:', data);
      navigate('/');
      window.location.reload()
    } catch (error) {
      console.error('Error exiting the room:', error);
    }
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalShow = () => {
    setShowCreateModal(true);
  };

  const handleJoinModalClose = () => {
    setShowJoinModal(false);
    setIsRoomIdEntered(false);
  };

  const handleJoinModalShow = () => {
    setShowJoinModal(true);
  };


  return (
    <div className=''>
      <nav className="navbar navbar-expand-lg mt-3 mx-3">
        <div className="container">
          <a className="navbar-brand fs-2 fw-bolder" onClick={handleHomeClick}>
            <img src={Logo} alt="Logo" className='logo me-3' />
            Music Player
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto fs-4 fw-bold ">
              {window.location.pathname === '/' ? <>
                <li className="nav-item">
                  <Button variant="secondary" className='nav-link' onClick={handleCreateModalShow}>
                    Create Room
                  </Button>
                </li>
                <li className="nav-item">
                  <Button variant="secondary" className='nav-link' onClick={handleJoinModalShow}>
                    Join Room
                  </Button>
                </li>
              </> : <>
                <li className="nav-item">
                  <Button variant="secondary" className='nav-link' onClick={handleExitRoom}>
                    Exit Room
                  </Button>
                </li>
              </>}
            </ul>
          </div>

          <Auth />

        </div>
      </nav>

      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Room Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="number">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your mobile number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateRoom}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showJoinModal} onHide={handleJoinModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Join Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="roomId">
              <Form.Label>Room ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setIsRoomIdEntered(true);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleJoinModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoinRoom}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Header;
