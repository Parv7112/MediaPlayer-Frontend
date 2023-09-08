import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createRoom, joinRoom } from '../redux/actions/roomActions';
import RoomPage from './Room';
import { useNavigate } from 'react-router-dom'; 
import Music from '../components/Music';

function Home() {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [roomId, setRoomId] = useState('');
    const [roomCreated, setRoomCreated] = useState(false);
    const [isRoomIdEntered, setIsRoomIdEntered] = useState(false);
    const [checkRoom] = useState(false);

    const dispatch = useDispatch();

    const handleCreateRoom = async () => {
        try {
            const response = await dispatch(createRoom(name, number));
            console.log(response);
            setRoomId(response.data.roomId)

            if (response && response.payload && response.payload.roomId) {
                setRoomCreated(true);
                setRoomId(response.payload.roomId);
            }
            handleCreateModalClose();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    
    useEffect(() => {
        if (showCreateModal && roomId !== '') {
            navigate(`/room/${roomId}`);
        }
    }, [roomId]);


    const handleJoinRoom = async () => {
        if (isRoomIdEntered) {
            try {
                await dispatch(joinRoom(roomId));

                console.log('Successfully joined the room');
                navigate(`/room/${roomId}`);
               
                handleJoinModalClose();
            } catch (error) {
                console.error('Error joining room:', error);
            }
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
            <h1 className='text-center'>Media Player</h1>
            <Button variant="primary" className='mx-3' onClick={handleCreateModalShow}>
                Create Room
            </Button>
            <Button variant="primary" onClick={handleJoinModalShow}>
                Join Room
            </Button>

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

            <Music />
        </div>
    );
}

export default Home;

