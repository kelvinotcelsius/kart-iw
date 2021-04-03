import React, { useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';

import Login from '../auth/Login';
import Register from '../auth/Register';
import PaymentWrapper from '../shop/PaymentWrapper';
import externalURLIcon from '../../assets/images/icons/external-link.svg';

import './Post.css';

import { getPost } from '../../actions/post';
import { getProductFromPostId } from '../../actions/product';
import { getUser } from '../../actions/user';

import Spinner from '../layout/Spinner';

const Post = ({
  getPost,
  getProductFromPostId,
  post: { post, loading },
  product,
  auth: { isAuthenticated },
  getUser,
  user,
}) => {
  let { post_id, creator_id } = useParams();

  useEffect(() => {
    async function fetchData() {
      await getPost(post_id);
      await getProductFromPostId(post_id);
      await getUser(creator_id);
    }
    fetchData();
  }, [getPost, getProductFromPostId, getUser, post_id, creator_id]);
  const [loginModal, changeModal] = useState(true); // true = show login modal, false = show sign in modal
  const [modalStatus, showModal] = useState(false); // true = show modal, false = close modal
  const closeModal = () => showModal(false);

  const [showPayment, triggerPayment] = useState(false);

  const [muted, setMute] = useState(false);
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
    <div id='post'>
      {loading || product.loading || user.loading || post == null ? (
        <Spinner />
      ) : (
        <div className='post-wrapper'>
          <div className='post-video-wrapper'>
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
                className={playing ? 'playing' : 'paused'}
                onClick={() => onVideoPress()}
              ></div>
              <div
                className={muted ? 'muted' : 'unmuted'}
                onClick={() => setMute(!muted)}
              ></div>
            </div>
          </div>
          <div className='post-product-wrapper'>
            {!showPayment ? (
              <Fragment>
                <div className='product-data'>
                  <Link to={`/product/${product.product._id}`}>
                    <img
                      id='product-image'
                      src={product.product.picture}
                      alt='Product'
                    />
                  </Link>
                  <div className='product-info'>
                    <p id='product-name'>{product.product.name}</p>
                    <p id='product-description'>
                      {product.product.description}
                    </p>
                    <a
                      id='product-url'
                      href={`//${product.product.external_url}`}
                      rel='noreferrer'
                      target='_blank'
                    >
                      View product info
                      <img src={externalURLIcon} alt='external url icon' />
                    </a>
                  </div>
                </div>
                <div className='divider'></div>
                <div className='creator-data'>
                  <Link to={`/user/${post.creator_id}`}>
                    <img
                      id='post-profile-pic'
                      src={user.user.profile_pic}
                      alt='User profile'
                    />
                  </Link>
                  <div className='creator-info'>
                    <Link to={`/user/${post.creator_id}`}>
                      <p id='creator-username'>{user.user.username}</p>{' '}
                    </Link>
                    <p id='post-caption'>{post.caption}</p>
                  </div>
                </div>
                <div className='divider'></div>
                {isAuthenticated ? (
                  <Fragment></Fragment>
                ) : (
                  <Fragment>
                    <div className='post-login'>
                      <p id='post-login-title'>Login to purchase</p>
                      <p id='post-login-body'>
                        You can create videos for products you purchase. Every
                        purchase from your video earns you 10% commission. Learn
                        more{' '}
                        <Link className='url' to='/faq'>
                          here.
                        </Link>
                      </p>
                      <button
                        className='post-login-btn'
                        onClick={() => showModal((o) => !o)}
                      >
                        Login
                      </button>
                    </div>
                    <div className='modal'>
                      <Popup
                        className='popup'
                        open={modalStatus}
                        onClose={closeModal}
                        closeOnDocumentClick
                        contentStyle={{
                          borderRadius: '10px',
                          height: '600px',
                          overflowY: 'auto',
                          textAlign: 'center',
                          backgroundColor: 'white',
                          border: '1px solid ',
                        }}
                      >
                        {loginModal === true ? (
                          <Login
                            changeModal={changeModal}
                            closeModal={closeModal}
                          />
                        ) : (
                          <Register
                            changeModal={changeModal}
                            closeModal={closeModal}
                          />
                        )}
                      </Popup>
                    </div>
                    <div className='divider'></div>
                  </Fragment>
                )}
                {isAuthenticated ? (
                  <div className='purchase-btn-wrapper'>
                    <button
                      className='post-purchase-btn'
                      onClick={() => triggerPayment(true)}
                    >
                      <span className='purchase-btn-text'>
                        ${product.product.price}
                      </span>
                      <span className='purchase-btn-text'>Buy now</span>
                    </button>
                  </div>
                ) : (
                  <Fragment></Fragment>
                )}
              </Fragment>
            ) : (
              <Fragment>
                <PaymentWrapper
                  showPayment={showPayment}
                  triggerPayment={triggerPayment}
                  keys={{
                    stripe:
                      'pk_test_51IJgQfH8gVlzmKAC4VyQjXBmVAnxloBxer9cnuQeuw042BfkjMz7EiiRxFYPdUwIocpgKtXOcUlzQoLcewMjiHgk003TDp4mHE',
                  }}
                  creatorID={creator_id}
                  postID={post_id}
                  productID={product.product._id}
                  price={product.product.price}
                />
              </Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  getProductFromPostId: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  product: state.product,
  auth: state.auth,
  user: state.user,
});

export default connect(mapStateToProps, {
  getPost,
  getProductFromPostId,
  getUser,
})(Post);
