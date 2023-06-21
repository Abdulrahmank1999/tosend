import { useState, useEffect } from "react";
import Head from "next/head";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { userDetail, userLogin } from "../../store/actions.js";
import { useRouter } from "next/router.js";

export default function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.AuthReducer.token);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = (values) => {
    dispatch(userDetail(values));
  };

  useEffect(() => {
    if (userData) router.push("/console/message");
  }, [userData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    if ((token, userId, username)) {
      dispatch(userLogin(token, userId, username));
    }
  }, []);

  return (
    <>
      <Head>
        <title>LogIn - Twilio App</title>
        <meta name="description" content="Twilio WhatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {contextHolder} */}
      <main className="flex flex-col justify-center items-center h-screen bg-[#f7f7ff]">
        <div className="bg-[redd]">
          <p className="font-bold text-2xl mb-4">Sign In</p>
        </div>
        <div className="bg-white px-20 w-[32%] py-20 rounded-lg">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  );
}
