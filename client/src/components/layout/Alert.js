import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './Layout.css';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    // whenever you map through an array and output JSX you need to add a key; see App.css for the className definitions
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// fetches the alert array created in state by the reducer and passes it as a prop to Alert.js
const mapStateToProps = (state) => ({
  alerts: state.alert, // state.alert is the state of the alert reducer (see root reducer src/components/reducers/index.js), this allows us to call props.alerts in the Alert component
});

export default connect(mapStateToProps)(Alert);
