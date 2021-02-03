import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import './Post.css';

import { getPost } from '../../actions/post';

import Spinner from '../layout/Spinner';

// Hook that alerts clicks outside of the passed ref
function useOutsideAlerter(ref, background) {
  const history = useHistory();

  useEffect(() => {
    // Function defining go back
    let back = (e) => {
      e.stopPropagation();
      history.push(background);
    };

    // Alert if clicked on outside of element
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        back(event);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, history, background]);
}

const PostModal = ({ getPost, post: { post, loading }, background }) => {
  let { post_id, creator_id } = useParams();

  useEffect(() => {
    getPost(post_id);
  }, [getPost, post_id]);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, background);

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
      <div className='post-background-wrapper'>
        <div className='post-wrapper' ref={wrapperRef}>
          {loading || post === null ? (
            <Spinner />
          ) : (
            <div className='modal'>
              <div className='post-video-wrapper'>
                {/* <button
                className='back-btn'
                onClick={() => {
                  history.goBack();
                }}
              >
                Back
              </button> */}
                <div className='preview-video-wrapper'>
                  <video
                    className='post-video'
                    src={post.video}
                    playsInline
                    loop
                    ref={videoRef}
                    onClick={() => onVideoPress()}
                    poster={post.preview}
                    muted={muted}
                  />
                  <div className='video-controls-wrapper'>
                    <div
                      className={videoRef.current.paused ? 'paused' : 'playing'}
                      onClick={() => setPlaying(!playing)}
                    ></div>
                    <div
                      className={muted ? 'muted' : 'unmuted'}
                      onClick={() => setMute(!muted)}
                    ></div>
                  </div>
                </div>
              </div>
              <div className='post-product-wrapper'>
                <div className='product-info'>
                  <img
                    className='product-image'
                    src={post.product_picture}
                    alt='Product'
                  />
                  <p>{post.product_name}</p>
                  <a href='/'>View product info</a>
                </div>
                <div className='creator-info'>
                  <img
                    className='preview-profile-pic'
                    src={post.creator_profile_pic}
                    alt='User profile'
                  />
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
        </div>
      </div>
    </Fragment>
  );
};

PostModal.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(PostModal);
