import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAudio, fetchAllAudio } from '../redux/actions/musicActions';
import { useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
    BsPlayCircleFill,
    BsFillPauseCircleFill,
    BsSkipStartFill,
    BsSkipEndFill,
    BsFillXCircleFill, // Add the X button
} from 'react-icons/bs';

function Music() {
    const navigate = useNavigate();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [currentSong, setCurrentSong] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1); // Track the current song index
    const [showAudioControls, setShowAudioControls] = useState(false); // Track if audio controls section should be visible

    const dispatch = useDispatch();
    const audioFiles = useSelector((state) => {
        return state.audio.audioFiles;
    });

    const audioControls = useRef([]);

    useEffect(() => {
        setTimeout(() => {
            // console.log(audioFiles)
        }, 1000);
    }, [audioFiles]);

    useEffect(() => {
        dispatch(fetchAllAudio());
    }, [dispatch]);

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
            window.location.reload();
            showSuccessMessage('Audio file uploaded successfully', 5000);
        } catch (error) {
            console.error('Error uploading music:', error);
        }
    };

    const playAudio = (audioUrl, audioName, index) => {
        if (currentAudio) {
            if (isPlaying) {
                currentAudio.pause();
            }
        }

        const audio = audioControls.current[index];
        setCurrentAudio(audio);
        setCurrentSong(audioName);

        if (!isPlaying) {
            audio.play();
        }

        setIsPlaying(!isPlaying);

        setCurrentSongIndex(index); // Set the current song index

        audioControls.current.forEach((control, i) => {
            if (i !== index && control !== null) {
                control.pause();
            }
        });

        setIsLoading(true);

        audio.addEventListener('playing', () => {
            setIsLoading(false);
            setTotalDuration(audio.duration); // Set the total duration when audio starts playing
            setShowAudioControls(true); // Show the audio controls section when audio starts playing
        });

        audio.addEventListener('ended', () => {
            setCurrentSong('');
            setIsPlaying(false);
            setCurrentTime(0); // Reset current time when the audio ends
        });

        // Add event listener for timeupdate to update progress and current time
        audio.addEventListener('timeupdate', () => {
            setProgress((audio.currentTime / audio.duration) * 100);
            setCurrentTime(audio.currentTime);
        });
    };

    const togglePlayPause = () => {
        if (currentAudio) {
            if (isPlaying) {
                currentAudio.pause();
            } else {
                currentAudio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const showSuccessMessage = (message, timeout = 5000) => {
        setSuccessMessage(message);

        setTimeout(() => {
            setSuccessMessage(null);
        }, timeout);
    };

    const stopAndHideAudioControls = () => {
        if (currentAudio) {
            currentAudio.pause();
        }
        setShowAudioControls(false);
    };

    const playNextSong = () => {
        const nextIndex = currentSongIndex + 1;
        if (nextIndex < audioFiles.length) {
            const nextAudio = audioControls.current[nextIndex];
            if (nextAudio) {
                playAudio(
                    `http://localhost:4000/music/getMusic/${audioFiles[nextIndex].uniqueId}`,
                    audioFiles[nextIndex].name.slice(0, audioFiles[nextIndex].name.length - 4),
                    nextIndex
                );
            }
        }
    };

    const playPreviousSong = () => {
        const previousIndex = currentSongIndex - 1;
        if (previousIndex >= 0) {
            const previousAudio = audioControls.current[previousIndex];
            if (previousAudio) {
                playAudio(
                    `http://localhost:4000/music/getMusic/${audioFiles[previousIndex].uniqueId}`,
                    audioFiles[previousIndex].name.slice(0, audioFiles[previousIndex].name.length - 4),
                    previousIndex
                );
            }
        }
    };

    return (
        <div className="container mt-5">
            <AiFillPlusCircle
                className="position-fixed bottom-0 end-0 display-4 z-3 m-3"
                onClick={handleUploadModalShow}
            />
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
                <div className="alert alert-success">{successMessage}</div>
            )}

            <div className="mt-5 songs-container">
                <h2>Music</h2>
                <ul className="list-group">
                    {audioFiles?.length > 0 ? (
                        audioFiles.map((audio, index) => (
                            <li className="list-group-item my-2" key={audio._id}>
                                <h4
                                    className="mb-2"
                                    onClick={() =>
                                        playAudio(
                                            `http://localhost:4000/music/getMusic/${audio.uniqueId}`,
                                            audio.name.slice(0, audio.name.length - 4),
                                            index
                                        )
                                    }
                                >
                                    {index + 1}. {audio.name.slice(0, audio.name.length - 4)}
                                </h4>
                                <audio
                                    ref={(audioRef) => (audioControls.current[index] = audioRef)}
                                    src={`http://localhost:4000/music/getMusic/${audio.uniqueId}`}
                                />
                            </li>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
            </div>
            {showAudioControls && ( // Show audio controls section only when needed
                <div className="card position-fixed bottom-0 audio-controls p-3 pe-5 bg-light">
                    {currentSong && (
                        <div>
                            <div className="d-flex justify-content-center align-items-center">
                                <h3>{currentSong}</h3>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center align-items-center">
                                <progress max="100" className="w-100" value={progress}></progress>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(totalDuration)}</span>
                            </div>
                            <div className="d-flex justify-content-center align-items-center text-center">
                                <button
                                    onClick={() => playPreviousSong()}
                                    className="play-button bg-light"
                                >
                                    <BsSkipStartFill />
                                </button>
                                <button
                                    onClick={() => togglePlayPause()}
                                    className="play-button bg-light"
                                >
                                    {isPlaying ? (
                                        <BsFillPauseCircleFill />
                                    ) : (
                                        <BsPlayCircleFill />
                                    )}
                                </button>
                                <button
                                    onClick={() => playNextSong()}
                                    className="play-button bg-light"
                                >
                                    <BsSkipEndFill />
                                </button>
                                <button
                                    onClick={() => stopAndHideAudioControls()} // Stop and hide audio controls
                                    className="stop-button bg-light"
                                >
                                    <BsFillXCircleFill />
                                </button>
                            </div>
                        </div>
                    )}
                    {isLoading && <p>Loading...</p>}
                </div>
            )}
        </div>
    );
}

export default Music;
