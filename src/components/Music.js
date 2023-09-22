import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAudio, fetchAllAudio } from '../redux/actions/musicActions';
import { useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from 'react-icons/ai';
import Player from './Player';

function Music({ socket, roomId }) {
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
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const [showAudioControls, setShowAudioControls] = useState(false);
    const dispatch = useDispatch();
    const audioFiles = useSelector((state) => state.audio.audioFiles);

    const audioRefs = useRef([]);

    // useEffect(() => {
    //     dispatch(fetchAllAudio());
    //     console.log(roomId)
    //     socket.on('playSong', ({ songIndex, roomId }) => {
    //         // console.log('Received playSong event:', { songIndex, roomId });
    //         // console.log({ songIndex, currentSongIndex })
    //         // console.log(currentSongIndex)
    //         if (songIndex !== null) {
    //             // console.log(currentSongIndex)
    //             // if(currentSongIndex === -1)
    //             console.log('Emitting playSong event:', { roomId: roomId, songIndex: songIndex });
    //             // socket.emit('playSong', { roomId: roomId, songIndex: songIndex });
    //             // setCurrentSongIndex(songIndex);
    //             // playSongByIndex(songIndex);
    //             // console.log('After updating currentSongIndex:', currentSongIndex);
    //             console.log('Received playSong event:', { roomId: roomId, songIndex: songIndex });
    //         } else {
    //             console.error(`Received 'playSong' event with null songIndex or the same song in room ${roomId}`);
    //         }
    //     });

    //     return () => {
    //         socket.off('playSong');
    //     };
    // }, [currentSongIndex]);


    useEffect(() => {
        dispatch(fetchAllAudio());
        console.log(roomId);

        socket.on('playSong', ({ songIndex, roomId }) => {
            if (songIndex !== null) {
                console.log('Received playSong event:', { roomId: roomId, songIndex: songIndex });
                setCurrentSongIndex(songIndex); // Update the currentSongIndex
                playSongByIndex(songIndex); // Call playSongByIndex with the received songIndex
            } else {
                console.error(`Received 'playSong' event with null songIndex or the same song in room ${roomId}`);
            }
        });

        return () => {
            socket.off('playSong');
        };
    }, [currentSongIndex]);


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
        console.log('Before updating currentSongIndex:', currentSongIndex);
        if (currentSongIndex === index) {
            return;
        }

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

                const nextIndex = currentSongIndex + 1;
                if (nextIndex < audioFiles.length) {
                    // playSongByIndex(nextIndex);
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

            try {
            if (audio.readyState >= 2) {
                setTimeout(() => {
                    audio.play();
                }, 0);
                    setIsPlaying(true);
                } else {
                    audio.addEventListener('canplay', () => {
                        audio.play();
                        setIsPlaying(true);
                    });
                }
            } catch (error) {
               console.log(error)
            }

            setShowAudioControls(true);

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
                                    ref={(audioRef) => (audioRefs.current[index] = audioRef)}
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
                <Player
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    progress={progress}
                    currentTime={currentTime}
                    totalDuration={totalDuration}
                    playPreviousSong={playPreviousSong}
                    togglePlayPause={togglePlayPause}
                    playNextSong={playNextSong}
                    stopAndHideAudioControls={stopAndHideAudioControls}
                    formatTime={formatTime}
                    isLoading={isLoading}
                    handleProgressChange={handleProgressChange}
                />
            )}
        </div >
    );
}

export default Music;