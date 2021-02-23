import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import VideoPreview from '../shop/VideoPreview';
import GuestSidebar from '../posts/GuestSidebar';
import Spinner from '../layout/Spinner';
import externalURLIcon from '../../assets/images/icons/external-link.svg';

import { getPostsbyProductID } from '../../actions/post';
import { getProduct } from '../../actions/product';

import './Product.css';
import '../posts/Post.css';

const Product = ({
  getPostsbyProductID,
  post,
  product,
  isAuthenticated,
  getProduct,
}) => {
  let { product_id } = useParams();
  useEffect(() => {
    async function fetchData() {
      await getProduct(product_id);
      await getPostsbyProductID(product_id);
    }
    fetchData();
  }, [getProduct, getPostsbyProductID, product_id]);

  return (
    <Fragment>
      <div id='product'>
        <div className='main-wrapper'>
          <div className='main-left-wrapper'>
            {isAuthenticated ? <div>Authenticated!</div> : <GuestSidebar />}
          </div>
          <div className='main-right-wrapper'>
            {post.loading || product.loading ? (
              <Spinner />
            ) : (
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
                <div className='three-video-wrapper'>
                  {post.posts.map((post) => (
                    <VideoPreview
                      key={post._id}
                      profPic={post.creator_profile_pic}
                      username={post.creator_username}
                      caption={post.caption}
                      postURL={post.url}
                      previewImageURL={post.preview}
                      videoURL={post.video}
                      postID={post._id}
                      creatorID={post.creator_id}
                      productName={post.product_name}
                      productPic={post.product_picture}
                      productID={post.product_id}
                      // NEED TO CHECK WHY I'M PASSING IN SO MANY PROPS, NOT USING THEM IN ACTUAL COMPONENT??
                    />
                  ))}
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Product.propTypes = {
  getPostsbyProductID: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  getProduct: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  product: state.product,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPostsbyProductID, getProduct })(
  Product
);
