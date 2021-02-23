import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addPost } from '../../actions/post';
import api from '../../utils/api';
import SelectSearch from 'react-select-search'; // Alternate library: https://www.digitalocean.com/community/tutorials/react-react-select

import './UploadForm.css';

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

const UploadForm = ({ history, addPost }) => {
  const [purchases, setPurchases] = useState('');
  const [selectedItemID, setItem] = useState('');
  useEffect(() => {
    getPurchases();
  }, []);

  const getPurchases = async () => {
    const res = await api.get('/users/my/purchased_items');
    const arr = res.data;
    console.log(arr);
    arr.forEach((obj) => renameKey(obj, '_id', 'value'));
    console.log(arr);
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
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    var form_data = new FormData();

    for (var key in formData) {
      form_data.append(key, formData[key]);
    }
    // send id as separate arg
    addPost(form_data, selectedItemID, history);
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
          <div className='upload-form-row'>
            <div className='upload-form-field-wrapper'>
              <label htmlFor='caption' className='upload-label'>
                Product
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
          <div className='upload-form-row'>
            <div className='upload-form-field-wrapper'>
              <label htmlFor='caption' className='upload-label'>
                Caption
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
          <div className='upload-form-row'>
            <div className='upload-form-field-wrapper'>
              <label htmlFor='video' className='register-label'>
                Video
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
          </div>
          <div className='upload-form-row'>
            <div className='upload-form-field-wrapper'>
              <label htmlFor='preview' className='upload-label'>
                Cover image
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
            <input type='submit' className='form-btn' value='Post' />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

UploadForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(UploadForm);
