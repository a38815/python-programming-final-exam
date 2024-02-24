import React from 'react';
import { Footer, Header } from 'antd/es/layout/layout';
import { Row, Tooltip } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const TLHeader = ({ isLogin }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <Header>
            <Row justify="space-between" align="middle">
                <div>
                    <p
                        className="text-white text-[32px] font-semibold cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Web giới thiệu sản phẩm
                    </p>
                </div>
                <div>
                    {isLogin && (
                        <Tooltip title="Đăng xuất">
                            <LogoutOutlined
                                className="text-white text-xl cursor-pointer"
                                onClick={handleLogout}
                            />
                        </Tooltip>
                    )}
                </div>
                <div>
                    <p
                        className="text-white text-[32px] font-semibold cursor-pointer"
                        onClick={() => navigate('/admin')}
                    >
                        Admin
                    </p>
                </div>
            </Row>
        </Header>
    );
};

export default TLHeader;
