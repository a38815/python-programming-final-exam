import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi chúng tôi không thể tìm thấy trang này"
        extra={
          <Link
            to="/"
            className="no-underline inline px-4 py-2 text-sm font-medium leading-5 text-white uppercase transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow focus:outline-none focus:shadow-outline-blue active:bg-blue-600 hover:bg-blue-700"
          >
            Quay lại trang chủ
          </Link>
        }
      />
    </div>
  );
};

export default PageNotFound;
