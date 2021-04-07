import React from 'react';
import PropTypes from 'prop-types';

const Field = ({
  id,
  label,
  type,
  minLength,
  maxLength,
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
          <span>{label}</span>
          <input
            className='form-row-input'
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
};

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  autoComplete: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Field;
