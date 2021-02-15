import React from 'react';
import PropTypes from 'prop-types';

const Field = ({
  id,
  label,
  type,
  min,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => {
  return (
    <div className='form-row'>
      <div className='form-field-wrapper'>
        <label htmlFor={id} className='form-row-label'>
          {label}
        </label>
        <br />
        <input
          className='FormRowInput'
          id={id}
          type={type}
          min={min}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  // min: PropTypes.string.isRequired,
  // placeholder: PropTypes.string.isRequired,
  // required: PropTypes.bool.isRequired,
  autoComplete: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Field;
