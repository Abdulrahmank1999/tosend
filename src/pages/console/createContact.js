import React, { useState } from "react";
import { Button, Form, Input, Skeleton, notification, Row, Col } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function CreateContact() {
  const [form] = Form.useForm();
  const userid = useSelector((state) => state.AuthReducer.userId);
  const token = useSelector((state) => state.AuthReducer.token);
  const [api, contextHolder] = notification.useNotification();

  // const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const buttonItemLayout = {
    wrapperCol: {
      span: 8,
      offset: 0,
    },
  };

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post(
        "http://godesignapi.ranuvijay.me/contacts",
        {
          user_id: userid,
          name: values.name,
          phone_number: values.phnumber,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((d) => {
        setLoading(false);
        api["success"]({
          message: "Success !!",
          description: "Contact created. ",
        });
      })
      .catch((e) => {
        api["error"]({
          message: "Error !!",
          description: "Something went wrong",
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Create Contact - Twilio App</title>
        <meta name="description" content="Twilio WhatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" flex flex-col px-4 mt-4 justify-center items-center">
        {contextHolder}

        {loading ? (
          <div className="bg-white w-full h-[80vh] py-16 px-6 ">
            <Skeleton
              active
              avatar
              round
              paragraph={{
                rows: 4,
              }}
            />
          </div>
        ) : (
          <Form
            {...formItemLayout}
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="bg-white w-full px-8 pt-8 pb-6 rounded-lg"
          >
            <div
              className=" flex justify-between rounded-lg bg-[#f5f5f5]
              items-center px-4 py-3  font-semibold"
            >
              <div className="flex items-center justify-center">
                <ArrowLeftOutlined
                  style={{ color: "#1890ff" }}
                  onClick={() => {
                    router.back();
                  }}
                />
                <p className="ml-2">Create Contacts</p>
              </div>
              <Link href="/console/listContact">
                <Button type="link">View Contacts</Button>
              </Link>
            </div>
            <Row gutter={[32, 32]} className="pt-8">
              <Col
                xs={{ span: 24 }}
                // sm={{ span: 24 }}
                md={{ span: 12 }}
                // lg={{ span: 12 }}
                // xl={{ span: 12 }}
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Select user",
                    },
                  ]}
                >
                  <Input placeholder="input name" />
                </Form.Item>
              </Col>

              <Col
                xs={{ span: 24 }}
                // sm={{ span: 24 }}
                md={{ span: 12 }}
                // lg={{ span: 12 }}
                // xl={{ span: 12 }}
              >
                <Form.Item
                  name="phnumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Input mobile number",
                    },
                  ]}
                >
                  <Input placeholder="input mobile number" />
                </Form.Item>
              </Col>
            </Row>
            <br />

            <Form.Item {...buttonItemLayout}>
              <Button htmlType="submit" type="primary">
                Create Contact
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </>
  );
}
