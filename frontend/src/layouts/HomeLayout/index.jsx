import React from 'react';
import { TLFooter, TLHeader } from '../../components';

const HomeLayout = ({ children }) => {
  return (
    <>
      <TLHeader />
      <div className="mx-auto w-3/4 py-6 min-h-screen">{children}</div>
      <TLFooter />
    </>
  );
};

export default HomeLayout;
