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

  const onFileChange = (e) => {
    try {
      // If file is a video
      if (e.target.files[0].type.includes('video')) {
        // Check file size, can't be over 200MB
        if (e.target.files[0].size > 209715200) {
          setAlert('File is too big!', 'danger');
          e.target.value = '';
          return;
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        }
      }

      // If file is an image
      if (e.target.files[0].type.includes('image')) {
        // Check file size, can't be over 5MB
        if (e.target.files[0].size > 5242880) {
          setAlert('File is too big!', 'danger');
          e.target.value = '';
          return;
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        }
      }
    } catch (err) {
      setAlert('An error occured. Please refresh and try again', 'danger');
      console.log(err);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
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
              <label htmlFor='caption' className='form-row-label'>
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
                onChange={(e) => onFileChange(e)}
              />
            </div>
          </div>
          <div className='form-row'>
            <div className='form-field-wrapper'>
              <label htmlFor='video' className='form-row-label'>
                Video* (200MB max)
              </label>
              <br />
              <input
                type='file'
                id='video'
                name='video'
                className='inputFile'
                onChange={(e) => onFileChange(e)}
              />
            </div>
            <input
              type='submit'
              id='post-upload-btn'
              className='form-btn'
              value='Post'
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

UploadForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { addPost, setAlert })(UploadForm);
