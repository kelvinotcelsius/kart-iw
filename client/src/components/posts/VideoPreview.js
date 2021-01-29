import React, { useState, useRef, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import './Post.css';

const VideoPreview = ({ previewImageURL, videoURL, creatorID, postID }) => {
  const [muted, setMute] = useState(true);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
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
      <div className='wrapper'>
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
          onMouseOver={(event) => event.target.play()}
          onMouseOut={(event) => event.target.pause()}
          muted={muted}
        />
        <div
          class={muted ? 'mute' : 'unmuted'}
          onClick={() => setMute(!muted)}
        ></div>
      </div>
    </Fragment>
  );
};

export default VideoPreview;
