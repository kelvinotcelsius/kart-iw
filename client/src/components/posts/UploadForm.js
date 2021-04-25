import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addPost } from '../../actions/post';
import { setAlert } from '../../actions/alert';

import api from '../../utils/api';

import SelectSearch from 'react-select-search'; // Alternate library: https://www.digitalocean.com/community/tutorials/react-react-select
import spinnerGIF from '../layout/spinner.gif';

import './UploadForm.css';

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

const UploadForm = ({ history, addPost, setAlert }) => {
  const [purchases, setPurchases] = useState([]);
  const [selectedItemID, setItem] = useState('');
  const [displayFAQ, toggleFAQ] = useState(false);

  useEffect(() => {
    getPurchases();
  }, []);

  const getPurchases = async () => {
    const res = await api.get('/users/my/purchased_items');
    const arr = res.data;
    arr.forEach((obj) => renameKey(obj, '_id', 'value'));
    setPurchases(arr);
  };

  const [formData, setFormData] = useState({
    caption: '',
    video: '',
    preview: '',
  });
  const { caption } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSelectChange = (e) => {
    setItem(String(e));
  };

  const onImageChange = (e) => {
    try {
      if (e.target.files[0].type.includes('image')) {
        // Check file size, can't be over 5MB
        if (e.target.files[0].size / 1024 / 1024 > 5) {
          setAlert('Image must be less than 5MB!', 'danger');
          e.target.value = '';
          return;
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        }
      } else {
        setAlert('Only image files are allowed!', 'danger');
        e.target.value = '';
      }
    } catch (err) {
      setAlert('An error occured. Please refresh and try again', 'danger');
      console.log(err);
    }
  };

  const onVideoChange = (e) => {
    try {
      if (e.target.files[0].type.includes('video')) {
        // Check file size, can't be over 200MB
        if (e.target.files[0].size / 1024 / 1024 > 200) {
          setAlert('Video must be under 200MB!', 'danger');
          e.target.value = '';
          return;
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        }
      } else {
        setAlert('Only image files are allowed!', 'danger');
        e.target.value = '';
      }
    } catch (err) {
      setAlert('An error occured. Please refresh and try again', 'danger');
      console.log(err);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemID) {
      setAlert('Must select a product', 'danger');
      return;
    }

    var form_data = new FormData();

    for (var key in formData) {
      form_data.append(key, formData[key]);
    }
    // send id as separate arg
    addPost(form_data, selectedItemID, history);

    // Turn form button into spinner
    const button = document.getElementById('post-upload-btn');
    const spinner = document.createElement('div');
    spinner.innerHTML = `<img
    src=${spinnerGIF}
    style=${{ width: '50px', margin: 'auto', display: 'block' }}
    alt='Loading...'
  />`;
    button.parentNode.replaceChild(spinner, button);
  };

  return (
    <Fragment>
      <div id='upload-form'>
        <h1>Upload video</h1>
        <form
          className='form-page'
          onSubmit={(e) => onSubmit(e)}
          encType='multipart/form-data'
        >
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='product' className='form-row-label'>
                Product*
              </label>
              <br />
              <SelectSearch
                options={purchases}
                onChange={(e) => onSelectChange(e)}
                search
                placeholder='Select product'
              />
              {purchases === '' ? (
                <span style={{ fontSize: '10px' }}>
                  You can only upload videos for items you have purchased. Buy
                  your first snack <a href='/'>here</a>.
                </span>
              ) : (
                <p style={{ display: 'none' }}></p>
              )}
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='caption' className='form-row-label'>
                Caption*
              </label>
              <br />
              <input
                id='caption'
                className='form-field'
                placeholder='75 chars max'
                name='caption'
                value={caption}
                onChange={(e) => onChange(e)}
                maxLength='75'
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='preview' className='form-row-label'>
                Cover image* (10MB max)
              </label>
              <br />
              <input
                type='file'
                id='preview'
                name='preview'
                className='inputFile'
                onChange={(e) => onImageChange(e)}
                required
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='video' className='form-row-label'>
                Video* (200MB max and .mp4 only)
              </label>
              <br />
              <input
                type='file'
                id='video'
                name='video'
                className='inputFile'
                accept='video/mp4'
                onChange={(e) => onVideoChange(e)}
                required
              />
            </div>
          </div>
          <input
            type='submit'
            id='post-upload-btn'
            className='form-btn'
            value='Post'
          />
        </form>
        <div className='toggle-wrapper'>
          <h4 className='toggle-header' onClick={() => toggleFAQ(!displayFAQ)}>
            How to earn money on Kart
            {!displayFAQ ? (
              <i className='downToggle'></i>
            ) : (
              <i className='upToggle'></i>
            )}
          </h4>
        </div>
        {displayFAQ && (
          <div className='toggle-body'>
            <p>Kart pays you for buying food you love. 🥰</p>
            <p>
              To start, purchase something from a video of your choice. After
              you receive the product, you can start creating videos for it. 📱
            </p>
            <p>
              When people make purchases through your videos, you earn 10%
              commission.
            </p>
            <p>
              That means if your video for a $29.99 product leads to 100 sales,
              you earn $300. 💰💵
            </p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

UploadForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { addPost, setAlert })(UploadForm);
