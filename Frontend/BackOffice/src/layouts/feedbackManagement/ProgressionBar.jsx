/* eslint-disable */
import React from 'react';
import './index.css'

const CustomProgress = ({ isLoading }) => {
  return (
    <div style={{ width: 500, height: 5, backgroundColor: '#E2E8F0', marginLeft:"-310px"}}>
      {isLoading && (
        <div
          style={{
            width: '50%',
            height: '100%',
            backgroundColor: '#e70e02',
            animation: 'progress-animation 1s infinite alternate',
          }}
        ></div>
      )}
    </div>
  );
};

export default CustomProgress;
