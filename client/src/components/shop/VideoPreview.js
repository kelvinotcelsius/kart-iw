import React, { useState, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';

import './Product.css';

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
      <div className='post-preview-wrapper'>
        <div className='preview-video-wrapper'>
          <Link to={`/${creatorID}/${postID}`}>
            <video
              className='preview-video'
              src={videoURL}
              playsInline
              loop
              ref={videoRef}
              onClick={() => onVideoPress()}
              poster={previewImageURL}
              // onMouseOver={() => onVideoPress()}
              // onMouseOut={() => onVideoPress()}
              muted={muted}
            />
            <p className='hover-msg'>Click to view</p>
          </Link>
          <div className='video-controls-wrapper'>
            <div
              className={
                videoRef.current.paused || videoRef.current.paused == null
                  ? 'paused'
                  : 'playing'
              }
              onClick={() => onVideoPress()}
            ></div>
            <div
              className={muted ? 'muted' : 'unmuted'}
              onClick={() => setMute(!muted)}
            ></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default VideoPreview;
