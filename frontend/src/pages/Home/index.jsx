import { useEffect, useState } from 'react';
import { Col, Pagination, Row, Spin, Typography } from 'antd';
import { HomeLayout } from '../../layouts';
import { ProductCard } from './components';
import { gql, useQuery } from '@apollo/client';

const Home = () => {
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const GET_PRODUCTS = gql`
    {
      products(input: {page: ${currentPage}, limit: ${pageSize}}) {
        _id,
        name,
        price,
        description,
        image,
      }
    }
  `;

  const { data, loading: isLoading } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    setDataSource(data?.products || []);
  }, [data]);

  return (
    <HomeLayout>
      <Typography.Title level={2} className="text-center">
        Danh sách sản phẩm
      </Typography.Title>

      <Spin spinning={isLoading}>
        <Row gutter={[12, 24]} justify="center">
          {dataSource.map((item) => (
            <Col span={6} key={item?._id}>
              <ProductCard
                data={{
                  ...item,
                }}
              />
            </Col>
          ))}

          {dataSource?.length === 0 && (
            <Typography>Chưa có sản phầm nào.</Typography>
          )}
        </Row>
      </Spin>

      {dataSource?.length > 0 && (
        <Row justify="end" className="mt-10">
          <Pagination
            showSizeChanger
            total={dataSource?.length}
            current={currentPage}
            pageSize={pageSize}
            showTotal={(total) => `${total} sản phẩm`}
            onChange={(page) => setCurrentPage(page)}
            onShowSizeChange={(_, size) => setPageSize(size)}
          />
        </Row>
      )}
    </HomeLayout>
  );
};

export default Home;
