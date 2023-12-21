import React from 'react';

import SIlogo from '../assets/smart-impulse-logo.svg';

export const Header = () => {
  return (
    <div className=" flex items-center my-2 mx-4">
      <div className="mx-2">
        <img src={SIlogo} alt={'logo'} className="w-12" />
      </div>
      <span className="text-2xl">Smart Impulse</span>
    </div>
  );
};
