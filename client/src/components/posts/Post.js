import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import './Post.css';

import { getPost } from '../../actions/post';

import Spinner from '../layout/Spinner';

const Post = ({ getPost, post: { post, loading }, match }) => {
  const history = useHistory();

  useEffect(() => {
    getPost(match.params.post_id);
  }, [getPost, match.params.post_id]);

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

  // const {
  //   video,
  //   preview,
  //   product_name,
  //   product_picture,
  //   caption,
  //   creator_username,
  //   creator_profile_pic,
  // } = post;

  return (
    <Fragment>
      {loading || post === null ? (
        <Spinner />
      ) : (
        <div className='post-wrapper'>
          <div className='post-video-wrapper'>
            <button
              className='back-btn'
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
            <div className='preview-video-wrapper'>
              <video
                className='preview-video'
                src={post.video}
                playsInline
                loop
                ratiowidth='calc(0.56 * (400px + (100vw - 768px) / 1152 * 100))'
                ratioheight='calc(400px + (100vw - 768px) / 1152 * 100)'
                ref={videoRef}
                onClick={() => onVideoPress()}
                poster={post.preview}
                onMouseOver={() => onVideoPress()}
                onMouseOut={() => onVideoPress()}
                muted={muted}
              />
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
          </div>
          <div className='post-product-wrapper'>
            <div className='product-info'>
              <img src={post.product_picture} alt='Product' />
              <p>{post.product_name}</p>
              <a href='/'>View product info</a>
            </div>
            <div className='creator-info'>
              <img src={post.creator_profile_pic} alt='User profile' />
              <p>{post.creator_username}</p>
              <p>{post.caption}</p>
            </div>
            <div className='post-login'>
              <p>Login to earn money</p>
              <p>
                You can earn money by purchasing with a registered account.
                Learn more <Link to='/faq'>here</Link>
              </p>
              <button>Login</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
