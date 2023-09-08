import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAudio, fetchAllAudio } from '../redux/actions/musicActions';
import { useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from 'react-icons/ai'

function Music() {
    const navigate = useNavigate();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const dispatch = useDispatch();
    const audioFiles = useSelector(state => {
        return state.audio.audioFiles
    });

    useEffect(() => {
        setTimeout(() => {
            // console.log(audioFiles)
        }, 1000);
    }, [audioFiles])

    useEffect(() => {
        dispatch(fetchAllAudio());
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadModalShow = () => {
        setShowUploadModal(true);
    };

    const handleUploadModalClose = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
    };

    const handleUploadMusic = async () => {
        if (!selectedFile) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('audio', selectedFile);

            await dispatch(uploadAudio(formData));

            handleUploadModalClose();
            window.location.reload()
            showSuccessMessage('Audio file uploaded successfully', 5000);
        } catch (error) {
            console.error('Error uploading music:', error);
        }
    };

    const showSuccessMessage = (message, timeout = 5000) => {
        setSuccessMessage(message);

        setTimeout(() => {
            setSuccessMessage(null);
        }, timeout);
    };

    return (
        <div className='mt-5 mx-3'>
            {/* <Button className="position-fixed bottom-0 end-0 p-3 rounded-circle z-3 bg-dark" onClick={handleUploadModalShow}> */}
            <AiFillPlusCircle  className='position-fixed bottom-0 end-0 display-4 z-3 m-3' onClick={handleUploadModalShow}/>
        {/* </Button> */}

            <Modal show={showUploadModal} onHide={handleUploadModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Music</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="audioFile">
                            <Form.Label>Choose an audio file</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".mp3, .wav, .ogg"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUploadModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUploadMusic}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <div className='mt-5'>
                <h2>Music</h2>
                <ul className="list-group">
                {audioFiles?.length > 0 ? (
                    audioFiles.map((audio, index) => ( // Added 'index' parameter
                        <li className='list-group-item' key={audio._id}>
                            <h4 className='mb-3'>{index + 1}. {audio.name}</h4> {/* Display serial number */}
                            <audio controls className='w-100'>
                                <source src={`http://localhost:4000/music/getMusic/${audio.uniqueId}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </li>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </ul>
            </div>
        </div>
    );
}

export default Music;
