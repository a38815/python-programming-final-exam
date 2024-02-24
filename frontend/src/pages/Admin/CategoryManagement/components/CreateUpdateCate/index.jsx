import  { useEffect } from 'react';
import { Button, Form, Input,  Modal, message } from 'antd';
import { gql, useMutation } from '@apollo/client';

const CreateUpdateCate = ({ visible, currentItem, onCancel }) => {
  console.log("🚀 ~ CreateUpdateCate ~ currentItem:", currentItem)
  const [form] = Form.useForm();

  const bodyType =
    '$name: String!';

  const CREATE = gql`
    mutation Create(${bodyType}){
      createCategory(input: { name: $name }) {
        _id
      }
    }
  `;


  const UPDATE = gql`
    mutation Update(${bodyType}) {
      updateCategory(_id: "${currentItem?._id}", input: { name: $name }) {
        _id
      }
    }
  `;

  const [create, { loading: creating }] = useMutation(CREATE);
  const [update, { loading: updating }] = useMutation(UPDATE);



  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({ ...currentItem });
    }
  }, [currentItem]);

  const onFinish = (values) => {
    const body = { ...values };

    if (currentItem) {
      update({ variables: { ...body } })
        .then((res) => {
          console.log('🚀 ~ create ~ res:', res);
          message.success('Cập nhật dữ liệu thành công');
          onCancel();
        })
        .catch((err) => {
          console.log('🚀 ~ create ~ err:', err);
          message.error('Có lỗi xảy ra. Vui lòng thử  lại sau!');
        });
        return

    }

    console.log('🚀 ~ create ~ body:', body);
    create({ variables: { ...body } })
      .then((res) => {
        console.log('🚀 ~ create ~ res:', res);
        message.success('Tạo mới dữ liệu thành công');
        onCancel();

      })
      .catch((err) => {
        console.log('🚀 ~ create ~ err:', err);
        message.error('Có lỗi xảy ra. Vui lòng thử  lại sau!');
      });
  };

  return (
    <Modal
      open={visible}
      destroyOnClose
      onCancel={onCancel}
      title={`${currentItem ? 'Cập nhật' : 'Thêm mới'}`}
      footer={[
        <Button key="CANCEL" danger onClick={onCancel}>
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
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
        >
          <Input placeholder="Danh mục" />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateUpdateCate;
