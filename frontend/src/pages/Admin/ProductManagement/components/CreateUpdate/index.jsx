import { useEffect } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { gql, useMutation, useQuery } from '@apollo/client';

const CreateUpdate = ({ visible, currentItem, onCancel }) => {
  const [form] = Form.useForm();

  const GET_CATEGORIES = gql`
    {
      categories(input: { page: 1, limit: 199 }) {
        _id
        name
      }
    }
  `;

  const { data } = useQuery(GET_CATEGORIES);
  console.log('🚀 ~ CreateUpdate ~ data:', data);

  const bodyType =
    '$name: String!, $price: Float, $description: String, $image: String, $categoryId: ID!';

  const CREATE = gql`
    mutation Create(${bodyType}) {
      createProduct(input: { name: $name, price: $price, description: $description, image: $image, categoryId: $categoryId}) {
        _id
      }
    }
  `;

  const UPDATE = gql`
    mutation Update(${bodyType}) {
      updateProduct(_id: "${currentItem?._id}", input: { name: $name, price: $price, description: $description, image: $image, categoryId: $categoryId }) {
        _id,
        name,
        price,
        description,
      }
    }
  `;

  const [create, { loading: creating }] = useMutation(CREATE);
  const [update, { loading: updating }] = useMutation(UPDATE);

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        ...currentItem,
        categoryId: currentItem?.category?._id,
      });
    }
  }, [currentItem]);

  const onFinish = (values) => {
    const body = {
      ...values,
      categoryId: values.categoryId || currentItem?.category._id,
    };

    if (currentItem) {
      update({ variables: { ...body } })
        .then((res) => {
          console.log('🚀 ~ create ~ res:', res);
          message.success('Cập nhật dữ liệu thành công');
          handleCancel();
        })
        .catch((err) => {
          console.log('🚀 ~ create ~ err:', err);
          message.error('Có lỗi xảy ra. Vui lòng thử  lại sau!');
        });
      return;
    }

    create({ variables: { ...body } })
      .then((res) => {
        console.log('🚀 ~ create ~ res:', res);
        message.success('Tạo mới dữ liệu thành công');
        handleCancel();
      })
      .catch((err) => {
        console.log('🚀 ~ create ~ err:', err);
        message.error('Có lỗi xảy ra. Vui lòng thử  lại sau!');
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      title={`${currentItem ? 'Cập nhật' : 'Thêm mới'}`}
      footer={[
        <Button key="CANCEL" danger onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="SUBMIT"
          type="primary"
          onClick={() => form.submit()}
          loading={creating || updating}
        >
          Đồng ý
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
        >
          <Input placeholder="Sản phẩm" />
        </Form.Item>
        <Form.Item name="price" label="Giá sản phẩm" initialValue={0}>
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => (value || '0')?.replace(/\$\s?|(,*)/g, '')}
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={data?.categories?.map((item) => ({
              label: item?.name,
              value: item?._id,
            }))}
          />
        </Form.Item>
        <Form.Item name="image" label="Ảnh sản phẩm">
          <Input placeholder="Link ảnh sản phẩm" />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={5} placeholder="Mô tả" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUpdate;
