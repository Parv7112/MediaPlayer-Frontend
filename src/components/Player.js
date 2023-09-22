import React from 'react';
import {
  BsPlayCircleFill,
  BsFillPauseCircleFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsFillXCircleFill,
} from 'react-icons/bs';

function Player({
  currentSong,
  isPlaying,
  progress,
  currentTime,
  totalDuration,
  playPreviousSong,
  togglePlayPause,
  playNextSong,
  stopAndHideAudioControls,
  formatTime,
  isLoading,
  handleProgressChange,
}) {
  return (
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
            <button onClick={playPreviousSong} className="play-button bg-light">
              <BsSkipStartFill />
            </button>
            <button onClick={togglePlayPause} className="play-button bg-light">
              {isPlaying ? (
                <BsFillPauseCircleFill />
              ) : (
                <BsPlayCircleFill />
              )}
            </button>
            <button onClick={playNextSong} className="play-button bg-light">
              <BsSkipEndFill />
            </button>
            <button onClick={stopAndHideAudioControls} className="stop-button bg-light">
              <BsFillXCircleFill />
            </button>
          </div>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default Player;
