import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import PostPreview from '../posts/PostPreview';
import GuestSidebar from '../posts/GuestSidebar';
import Spinner from '../layout/Spinner';
import externalURLIcon from '../../assets/images/icons/external-link.svg';

import { getPostsbyProductID } from '../../actions/post';
import { getProduct } from '../../actions/product';

import './Product.css';
import '../posts/Post.css';

const Product = ({ getPostsbyProductID, post, product, getProduct }) => {
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
          <div className='main-left-wrapper'>{<GuestSidebar />}</div>
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
                      href={`${product.product.external_url}`}
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
                    <PostPreview
                      key={post._id}
                      caption={post.caption}
                      postURL={post.url}
                      previewImageURL={post.preview}
                      videoURL={post.video}
                      postID={post._id}
                      creatorID={post.creator_id}
                      productID={post.product_id}
                      likes={post.likes}
                      showUserData={true}
                      showProductData={false}
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
  getProduct: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  product: state.product,
});

export default connect(mapStateToProps, { getPostsbyProductID, getProduct })(
  Product
);
