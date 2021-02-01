import React, { useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Post.css';

const VideoPreview = ({ previewImageURL, videoURL, creatorID, postID }) => {
  const [muted, setMute] = useState(true);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(false);
  const onVideoPress = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <Fragment>
      <div className='preview-video-wrapper'>
        <Link to={`/${creatorID}/${postID}`}>
          <video
            className='preview-video'
            src={videoURL}
            playsInline
            loop
            ratiowidth='calc(0.56 * (400px + (100vw - 768px) / 1152 * 100))'
            ratioheight='calc(400px + (100vw - 768px) / 1152 * 100)'
            ref={videoRef}
            onClick={() => onVideoPress()}
            poster={previewImageURL}
            onMouseOver={() => onVideoPress()}
            onMouseOut={() => onVideoPress()}
            muted={muted}
          />
        </Link>
        <div className='video-controls-wrapper'>
          <div
            className={videoRef.current.paused ? 'paused' : 'playing'}
            onClick={() => setPlaying(!playing)}
          ></div>
          <div
            className={muted ? 'mute' : 'unmuted'}
            onClick={() => setMute(!muted)}
          ></div>
        </div>
      </div>
    </Fragment>
  );
};

export default VideoPreview;
