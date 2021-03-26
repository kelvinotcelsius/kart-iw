import React, { useState, useRef, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getProduct } from '../../actions/product';

import Spinner from '../layout/Spinner';

const ProfileVideoPreview = ({
  previewImageURL,
  videoURL,
  creatorID,
  postID,
  productID,
  product,
  getProduct,
}) => {
  useEffect(() => {
    async function fetchData() {
      await getProduct(productID);
    }
    fetchData();
  }, [getProduct, productID]);

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
      {product.loading ? (
        <Spinner />
      ) : (
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
              <p className='hover-msg'>Click to buy</p>
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
          <Link to={`/product/${productID}`}>
            <div className='product-wrapper'>
              <img
                className='product-image'
                src={product.product.picture}
                alt='product'
              />
              <p className='product-name'>{product.product.name}</p>
            </div>
          </Link>
        </div>
      )}
    </Fragment>
  );
};

ProfileVideoPreview.propTypes = {
  getProduct: PropTypes.func.isRequired,
  previewImageURL: PropTypes.string.isRequired,
  videoURL: PropTypes.string.isRequired,
  creatorID: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product,
});

export default connect(mapStateToProps, { getProduct })(ProfileVideoPreview);
