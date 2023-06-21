import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Skeleton, List, notification } from "antd";
import Head from "next/head";


export default function ListContact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const userid = useSelector((state) => state.AuthReducer.userId);
  const token = useSelector((state) => state.AuthReducer.token);
  const router = useRouter();

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .get("http://godesignapi.ranuvijay.me/contacts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((d) => {
        setData(d.data);
        setLoading(false);
      })
      .catch((e) => {
        api["error"]({
          message: "Error !!",
          description: "Something went wrong",
        });
        setLoading(false);
      });
  };

  const onDelete = (id) => {
    axios
      .delete(`http://godesignapi.ranuvijay.me/contacts/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((d) => {
        api["success"]({
          message: "Success !!",
          description: "Contact deleted. ",
        });
        getData();
      })
      .catch((e) => {
        api["error"]({
          message: "Error !!",
          description: "Something went wrong during delete.",
        });
      });
  };

  return (
    <>
      <Head>
        <title>Contact List - Twilio App</title>
        <meta name="description" content="Twilio WhatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className=" flex flex-col  px-4 mt-4 justify-center items-center pb-4">
        {contextHolder}

        {loading ? (
          <div className="bg-white w-full h-[80vh] py-16 px-6 ">
            <Skeleton
              active
              avatar
              paragraph={{
                rows: 4,
              }}
            />
          </div>
        ) : (
          <>
            <div className="bg-white w-full px-8 pt-8 pb-6 rounded-lg">
              <div
                className=" flex justify-between bg-[#f5f5f5] rounded-lg
               items-center px-4 py-3  font-semibold"
              >
                <div className="flex items-center justify-center ">
                  <ArrowLeftOutlined
                    style={{ color: "#1890ff" }}
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <p className="ml-2">Contact List</p>
                </div>
                <Link href="/console/createContact">
                  <Button type="link">Create Contact</Button>
                </Link>
              </div>
            </div>
            <List
              className="bg-white w-full px-8 pt-0 pb-6"
              itemLayout="vertical"
              size="large"
              dataSource={data ? data : []}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  extra={
                    <>
                      <Button
                        type="primary"
                        onClick={() => {
                          router.push({
                            pathname: "/console/updateContact",
                            query: { id: item.id },
                          });
                        }}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        danger
                        type="primary"
                        onClick={() => {
                          onDelete(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  }
                >
                  <List.Item.Meta
                    title={"Name: " + item.name}
                    description={"Mobile Number: " + item.phone_number}
                  />
                  {item.content}
                </List.Item>
              )}
            />
          </>
        )}
      </div>
    </>
  );
}
