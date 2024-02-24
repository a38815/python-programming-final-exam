import React from 'react';
import { Footer } from 'antd/es/layout/layout';
import { CopyrightCircleOutlined } from '@ant-design/icons';

const TLFooter = () => {
  return (
    <Footer className="py-6">
      <div className="text-center">
        Copyright <CopyrightCircleOutlined /> {new Date().getFullYear()}
      </div>
    </Footer>
  );
};

export default TLFooter;
