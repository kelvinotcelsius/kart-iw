import React, { Fragment, useState } from 'react';

const GuestSidebar = () => {
  const [displayFAQ, toggleFAQ] = useState(false);

  return (
    <Fragment>
      <div id='sidebar'>
        <h1 id='header'>Make money by eating snacks.</h1>
        <p id='subheader'>
          Share a video of you eating something delicious and start earning
          today.
        </p>
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

export default GuestSidebar;
