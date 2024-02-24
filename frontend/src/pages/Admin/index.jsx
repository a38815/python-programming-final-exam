import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const Admin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        token
      }
    }
  `;

  const [login, { loading }] = useMutation(LOGIN);

  const onFinish = (values) => {
    login({ variables: { ...values } })
      .then((res) => {
        const token = res?.data?.login?.token;

        if (token) {
          localStorage.setItem('accessToken', token);
          navigate('/admin/products');
        } else {
          message.error('Thông tin đăng nhập không chính xác');
        }
      })
      .catch((err) => {
        console.log('🚀 ~ login ~ err:', err);
        message.error('Thông tin đăng nhập không chính xác');
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="xl:w-1/4 shadow-xl">
        <Typography.Title level={2} className="text-center mb-8">
          ĐĂNG NHẬP
        </Typography.Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin.' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="mt-12">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Admin;
