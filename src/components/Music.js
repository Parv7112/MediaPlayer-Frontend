import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAudio, fetchAllAudio } from '../redux/actions/musicActions';
import { useNavigate } from 'react-router-dom';
import {
    BsPlayCircleFill,
    BsFillPauseCircleFill,
    BsSkipStartFill,
    BsSkipEndFill,
    BsFillXCircleFill,
} from 'react-icons/bs';
import { AiFillPlusCircle } from 'react-icons/ai';

function Music({ socket, roomId, currentSongIndex, setCurrentSongIndex }) {
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
    // const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [showAudioControls, setShowAudioControls] = useState(false);
    const dispatch = useDispatch();
    const audioFiles = useSelector((state) => state.audio.audioFiles);

    const audioRefs = useRef([]); // Use audioRefs instead of audioControls

    useEffect(() => {
        // Fetch audio files when the component mounts
        dispatch(fetchAllAudio());
        // Set up Socket.io event listeners
        console.log(roomId)

        // socket.on('message', ()=>console.log('first'))

        socket.on('playSong', ({ songIndex, roomId }) => {
            console.log('Received playSong event:', { songIndex, roomId });
            console.log({songIndex, currentSongIndex})
            if (songIndex !== null && songIndex !== currentSongIndex) {
                // if(currentSongIndex === null)
                    // playSongByIndex(songIndex);
                setCurrentSongIndex(songIndex);
            } else {
                console.error(`Received 'playSong' event with null songIndex or the same song in room ${roomId}`);
            }
        });
    
        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('playSong');
        };
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
            // Reload the audio list
            dispatch(fetchAllAudio());
            showSuccessMessage('Audio file uploaded successfully', 5000);
        } catch (error) {
            console.error('Error uploading music:', error);
        }
    };

    const playSongByIndex = (index) => {
        console.log('playSongByIndex called with index:', index);
        console.log('currentSongIndex:', currentSongIndex);
        console.log(roomId)
        if (currentSongIndex === index) {
            return;
        }
    
        // Pause the currently playing audio (if any)
        if (currentAudio) {
            currentAudio.pause();
        }
    
        const audio = audioRefs.current[index];
    
        if (audio) {
            setCurrentAudio(audio);
            setCurrentSong(audioFiles[index]?.name || '');
    
            const onPlaying = () => {
                setIsLoading(false);
                setTotalDuration(audio.duration);
                audio.removeEventListener('playing', onPlaying);
            };
    
            const onEnded = () => {
                setCurrentSong('');
                setIsPlaying(false);
                setCurrentTime(0);
    
                // Play the next song if available
                const nextIndex = currentSongIndex + 1;
                if (nextIndex < audioFiles.length) {
                    // playSongByIndex(/nextIndex);
                }
    
                audio.removeEventListener('ended', onEnded);
            };
    
            const onTimeUpdate = () => {
                setProgress((audio.currentTime / audio.duration) * 100);
                setCurrentTime(audio.currentTime);
            };
    
            audio.addEventListener('playing', onPlaying);
            audio.addEventListener('ended', onEnded);
            audio.addEventListener('timeupdate', onTimeUpdate);
    
            // Play the selected audio if it's loaded
            if (audio.readyState >= 2) {
                audio.play();
                setIsPlaying(true);
            } else {
                // If the audio is not loaded, add an event listener to play it when it's ready
                audio.addEventListener('canplay', () => {
                    audio.play();
                    setIsPlaying(true);
                });
            }
    
            setShowAudioControls(true);
    
            // Emit the 'playSong' event to all participants in the same room
            console.log('Emitting playSong event:', { roomId: roomId, songIndex: index });
            socket.emit('playSong', { roomId: roomId, songIndex: index });
        }
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
            playSongByIndex(nextIndex);
        }
    };

    const playPreviousSong = () => {
        const previousIndex = currentSongIndex - 1;
        if (previousIndex >= 0) {
            playSongByIndex(previousIndex);
        }
    };

    const handleProgressChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        const newTime = (newProgress / 100) * totalDuration;
        setCurrentTime(newTime);
        setProgress(newProgress);

        if (currentAudio) {
            currentAudio.currentTime = newTime;
            if (isPlaying) {
                currentAudio.play();
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
                            <li className="list-group-item my-2 pointer" key={audio._id}>
                                <h4
                                    className="mb-2"
                                    onClick={() => playSongByIndex(index, roomId)}
                                >
                                    {index + 1}. {audio.name.slice(0, audio.name.length - 4)}
                                </h4>
                                <audio
                                    ref={(audioRef) => (audioRefs.current[index] = audioRef)} // Check that this line correctly sets audioRefs
                                    src={`http://localhost:4000/music/getMusic/${audio.uniqueId}`}
                                />
                            </li>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
            </div>
            {showAudioControls && (
                <div className="card position-fixed bottom-0 audio-controls p-3 pe-5 bg-light">
                    {currentSong && (
                        <div>
                            <div className="d-flex justify-content-center align-items-center">
                                <h3>{currentSong}</h3>
                            </div>
                            <br />
                            <div className="d-flex justify-content-center align-items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="w-100"
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(totalDuration)}</span>
                            </div>
                            <div className="d-flex justify-content-center align-items-center text-center">
                                <button
                                    onClick={playPreviousSong}
                                    className="play-button bg-light"
                                >
                                    <BsSkipStartFill />
                                </button>
                                <button
                                    onClick={togglePlayPause}
                                    className="play-button bg-light"
                                >
                                    {isPlaying ? (
                                        <BsFillPauseCircleFill />
                                    ) : (
                                        <BsPlayCircleFill />
                                    )}
                                </button>
                                <button
                                    onClick={playNextSong}
                                    className="play-button bg-light"
                                >
                                    <BsSkipEndFill />
                                </button>
                                <button
                                    onClick={stopAndHideAudioControls}
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
