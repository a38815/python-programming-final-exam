import { useEffect, useState } from 'react';
import { Button, Dropdown, Row, Space, Table, Typography, message } from 'antd';
import AdminLayout from '../../../layouts/AdminLayout';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import CreateUpdate from './components/CreateUpdate';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const [dataSource, setDataSource] = useState();
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const GET_PRODUCTS = gql`
    {
      products(input: {page: ${currentPage}, limit: ${pageSize}}) {
        _id
        name
        price
        description
        image
        category{
          _id
          name
        }
      }
    }
  `;

  const DELETE = gql`
    mutation DeleteProduct($id: ID!) {
      deleteProduct(_id: $id) {
        _id
      }
    }
  `;

  const { data, loading: isLoading, refetch } = useQuery(GET_PRODUCTS);

  const [deleteItem] = useMutation(DELETE);

  const handleUpdate = (data) => {
    setVisible(true);
    setCurrentItem(data);
    refetch();
  };

  const handleDelete = (data) => {
    deleteItem({
      variables: {
        id: data?._id,
      },
    })
      .then(() => {
        message.success('Cập nhật dữ liệu thành công');

        refetch()
          .then((res) => {
            console.log('🚀 ~ refetch ~ res:', res);
            setDataSource(res?.data?.products || []);
          })
          .catch((e) => {
            console.log('🚀 ~ .then ~ e:', e);
          });
      })
      .catch((err) => {
        console.error('🚀 ~ handleDelete ~ err', err);
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(null);
    refetch();
  };

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ data?.products:', data?.products);
    setDataSource(data?.products || []);
  }, [data?.products]);

  useEffect(() => {
    if (!visible) {
      refetch();
    }
  }, [visible]);

  const columns = [
    {
      title: 'STT',
      key: '',
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (item, record, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'Giá sản phẩm',
      key: 'price',
      dataIndex: 'price',
      width: 250,
    },
    {
      title: 'Danh mục',
      key: 'category',
      dataIndex: ['category', 'name'],
      width: 250,
    },
    {
      title: 'Hành động',
      key: '',
      dataIndex: '',
      width: 120,
      align: 'center',
      render: (item, record) => {
        const items = [
          {
            key: 'edit',
            label: 'Chỉnh sửa',
            onClick: () => handleUpdate(record),
            icon: <EditOutlined />,
          },
          {
            key: 'delete',
            label: 'Xóa',
            danger: true,
            onClick: () => handleDelete(record),
            icon: <DeleteOutlined />,
          },
        ];

        return (
          <Space onClick={(evt) => evt.stopPropagation()}>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={['click', 'hover']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div>
        <Link to={'/admin/categories'}>Quản lý danh mục</Link> &nbsp; /&nbsp;
        <Link to={'/admin/products'}>Quản lý Sản phẩm</Link>
      </div>

      <Row justify="space-between" align="middle">
        <Typography.Title level={2}>Quản lý sản phẩm</Typography.Title>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          className="mb-4"
        >
          Thêm mới
        </Button>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        size="small"
        loading={isLoading}
        pagination={{
          position: ['bottomRight'],
          // total: dataSource?.total,
          showSizeChanger: true,
          onChange: (value) => {
            setCurrentPage(value);
          },
          current: currentPage,
          pageSize,
        }}
        onChange={(table) => {
          setPageSize(table?.pageSize);
        }}
        rowKey={(record) => record?._id}
      />

      {visible && (
        <CreateUpdate
          visible={visible}
          onCancel={handleCancel}
          currentItem={currentItem}
        />
      )}
    </AdminLayout>
  );
};

export default ProductManagement;
