import React, { useState, useRef } from 'react';

const VideoPreview = () => {
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
    <div
      className='videopreview-wrapper'
      style={{
        backgroundImage: `url("https://kart-iw.s3.amazonaws.com/photo_5fe51b90db59a349a050d7bb.JPG")`,
      }}
    >
      <video
        src='https://v39-us.tiktokcdn.com/8b685913bb2b1d22e296b1819cec7194/5fe663d7/video/tos/useast2a/tos-useast2a-pve-0068/a2a878a7d029482d944ed5474ffcc9fa/?a=1233&br=3342&bt=1671&cd=0%7C0%7C1&cr=0&cs=0&cv=1&dr=0&ds=3&er=&l=20201225161224010190218096503D8F79&lr=tiktok_m&mime_type=video_mp4&qs=0&rc=Mzl2ZHl4cnVxeTMzOjczM0ApaDc1MzNkNjs2NzU3aDZpM2c2YjBjaHJmM2RfLS0wMTZzczQwLy1jNTJjLjJhLV8uLzY6Yw%3D%3D&vl=&vr='
        playsinline
        loop
        ratiowidth='calc(0.56 * (400px + (100vw - 768px) / 1152 * 100))'
        autoPlay
        ref={videoRef}
        onClick={onVideoPress}
      ></video>
    </div>
  );
};

export default VideoPreview;
