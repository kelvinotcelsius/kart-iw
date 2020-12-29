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
    console.log(e);
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
    console.log(selectedItemID);
    // send id as separate arg
    addPost(form_data, selectedItemID, history);
  };

  return (
    <Fragment>
      <h1>Upload vido</h1>
      <form
        className='form-page'
        onSubmit={(e) => onSubmit(e)}
        encType='multipart/form-data'
      >
        <div className='form-row'>
          <div className='form-field-wrapper'>
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
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field-wrapper'>
            <label htmlFor='caption' className='upload-label'>
              Caption
            </label>
            <br />
            <input
              id='caption'
              className='form-field'
              placeholder='150 chars max'
              name='caption'
              value={caption}
              onChange={(e) => onChange(e)}
              maxLength='150'
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='form-field-wrapper'>
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
        <div className='form-row'>
          <div className='form-field-wrapper'>
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
    </Fragment>
  );
};

UploadForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(UploadForm);
