
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { IconButton, Slider, Typography } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, Fullscreen, Settings } from '@mui/icons-material';
import './VideoPlayer.css';

function VideoPlayer({ videoUrl, videoName, onClose, show }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => setDuration(video.duration);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (event, newValue) => {
        const video = videoRef.current;
        video.currentTime = newValue;
        setCurrentTime(newValue);
    };

    const handleVolumeChange = (event, newValue) => {
        const video = videoRef.current;
        video.volume = newValue;
        setVolume(newValue);
    };

    const toggleFullscreen = () => {
        const video = videoRef.current;
        if (video.requestFullscreen) {
            video.requestFullscreen();
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Modal show={show} onHide={onClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>{videoName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div 
                    className="video-container"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-100"
                        style={{ maxHeight: '70vh' }}
                        onClick={togglePlay}
                    />
                    
                    {showControls && (
                        <div className="video-controls">
                            <div className="progress-bar-container mb-2">
                                <Slider
                                    value={currentTime}
                                    max={duration}
                                    onChange={handleSeek}
                                    sx={{ color: '#ffffff' }}
                                />
                                <div className="time-display">
                                    <Typography variant="caption" sx={{ color: 'white' }}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </Typography>
                                </div>
                            </div>
                            
                            <div className="control-buttons">
                                <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                                    {isPlaying ? <Pause /> : <PlayArrow />}
                                </IconButton>
                                
                                <div className="volume-control">
                                    <IconButton sx={{ color: 'white' }}>
                                        <VolumeUp />
                                    </IconButton>
                                    <Slider
                                        value={volume}
                                        max={1}
                                        step={0.1}
                                        onChange={handleVolumeChange}
                                        sx={{ color: '#ffffff', width: 80 }}
                                    />
                                </div>
                                
                                <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                                    <Fullscreen />
                                </IconButton>
                                
                                <IconButton sx={{ color: 'white' }}>
                                    <Settings />
                                </IconButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default VideoPlayer;
