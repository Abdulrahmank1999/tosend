import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Skeleton, List, notification } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";
import Head from "next/head";

export default function Notifications() {
  const [notificationData, setNotificationData] = useState(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.AuthReducer.token);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://godesignapi.ranuvijay.me/notifications", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((d) => {
        setNotificationData(d.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (notificationData) {
      console.log(notificationData);
      const dd = notificationData?.map((d) => d.id);
      console.log(dd);
      axios
        .put(
          "http://godesignapi.ranuvijay.me/notification",
          {
            dataa: dd,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((d) => {
          console.log(d.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [notificationData]);

  return (
    <>
      <Head>
        <title>Notifications - Twilio App</title>
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
              items-center px-4 py-4  font-semibold"
              >
                <div className="flex items-center justify-center">
                  <ArrowLeftOutlined
                    style={{ color: "#1890ff" }}
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <p className="ml-2">Notifications</p>
                </div>
              </div>
            </div>
            <List
              className="bg-white w-full px-8 pt-0 pb-6"
              itemLayout="vertical"
              size="large"
              dataSource={notificationData ? notificationData : []}
              renderItem={(item) => (
                <List.Item key={item.title}>
                  <List.Item.Meta
                    title={
                      <Link href="/console/message">
                        <p className="text-[#1890ff]">{item.body}</p>
                      </Link>
                    }
                    description={
                      "Crteate On : " +
                      moment(item.created_at).format("D MMM YYYY, h:mm:ss a")
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </div>
    </>
  );
}
