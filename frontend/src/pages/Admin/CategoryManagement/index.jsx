import { useEffect, useState } from "react";
import { Button, Dropdown, Row, Space, Table, Typography ,message} from "antd";
import AdminLayout from "../../../layouts/AdminLayout";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import CreateUpdateCate from "./components/CreateUpdateCate";
import { gql, useQuery,useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const CategoryManagement = () => {
  const [dataSource, setDataSource] = useState();
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const GET_CATEGORIES = gql`
    {
      categories(input: {page: ${currentPage}, limit: ${pageSize}}) {
        _id,
        name
      }
    }
  `;
  const DELETE_CATE = gql`
    mutation DeleteCategory($id: ID!){
      deleteCategory(_id: $id){
        _id
      }
    }
  `;

  const { data, loading: isLoading, refetch } = useQuery(GET_CATEGORIES);
  const [deleteItem] = useMutation(DELETE_CATE);

  const handleUpdate = (data) => {
    setVisible(true);
    setCurrentItem(data);
  };

  const handleDelete = (data) => {

    deleteItem({
      variables:{
        id: data?._id,
      }
    }).then(res=>{
      console.log("🚀 ~ handleDelete ~ res", res);
      message.success('Cập nhật dữ liệu thành công');
      refetch()
    }).catch(err=>{
      console.log("🚀 ~ handleDelete ~ err", err);
    })

    console.log("🚀 ~ handleDelete ~ data:", data);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(null);
  };

  const columns = [
    {
      title: "STT",
      key: "",
      dataIndex: "",
      align: "center",
      width: 80,
      render: (item, record, index) => {
        return index + 1;
      },
    },
    {
      title: "Tên danh mục",
      key: "name",
      dataIndex: "name",
      width: 250,
    },

    {
      title: "Hành động",
      key: "",
      dataIndex: "",
      width: 120,
      align: "center",
      render: (item, record) => {
        const items = [
          {
            key: "edit",
            label: "Chỉnh sửa",
            onClick: () => handleUpdate(record),
            icon: <EditOutlined />,
          },
          {
            key: "delete",
            label: "Xóa",
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
              trigger={["click", "hover"]}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    setDataSource(data?.categories || []);
  }, [data]);

  useEffect(() => {
    if (!visible) {
      refetch();
    }
  }, [refetch, visible]);

  return (
    <AdminLayout>
      <div>
        <Link to={"/admin/categories"}>Quản lý danh mục</Link> &nbsp; /&nbsp;
        <Link to={"/admin/products"}>Quản lý Sản phẩm</Link>
      </div>

      <Row justify="space-between" align="middle">
        <Typography.Title level={2}>Quản lý danh mục</Typography.Title>
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
          position: ["bottomRight"],
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
        // scroll={{ x: 768 }}
        rowKey={(record) => record?._id}
      />

      {visible && (
        <CreateUpdateCate
          visible={visible}
          onCancel={handleCancel}
          currentItem={currentItem}
        />
      )}
    </AdminLayout>
  );
};

export default CategoryManagement;
