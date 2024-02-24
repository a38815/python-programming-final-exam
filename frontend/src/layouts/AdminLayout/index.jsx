import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';
import { TLFooter, TLHeader } from '../../components';

const AdminLayout = ({ children }) => {
  const checkAuth = localStorage.getItem('accessToken');

  return (
    <>
      {checkAuth ? (
        <>
          <TLHeader isLogin />
          <div className="mx-auto w-3/4 py-6 min-h-screen">{children}</div>
          <TLFooter />
        </>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <Result
            status="403"
            title="403"
            subTitle="Xin lỗi bạn không có quyền truy cập trang này"
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
      )}
    </>
  );
};

export default AdminLayout;
