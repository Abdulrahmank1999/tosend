import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { notification, Menu, Spin } from "antd";
import {
  MessageTwoTone,
  RightCircleTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Head from "next/head";

export default function Message() {
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);

  const [selectedConvName, setSelectedConvName] = useState(null);

  const token = useSelector((state) => state.AuthReducer.token);
  const [api, contextHolder] = notification.useNotification();

  const [filess, setFile] = useState(null);

  const textRef = useRef(null);
  const scrollREf = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  useEffect(() => {
    if (filess) {
      let dataa = new FormData();
      dataa.append("file", filess[0]);
      axios
        .post(
          `http://godesignapi.ranuvijay.me/conversations/${selectedConv}/media`,
          dataa,
          {
            headers: {
              Authorization: "Bearer " + token,
              Accept: "application/json",
            },
          }
        )
        .then((d) => {
          setMessage((message) => [...message, d.data]);
        })
        .catch((e) => {});
    }
  }, [filess]);

  useEffect(() => {
    // getConversations();
    getContacts();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      getallMessage();
    }
  }, [selectedConv]);

  const getallMessage = () => {
    axios
      .get(`http://godesignapi.ranuvijay.me/conversations/${selectedConv}/messages`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((d) => {
        setMessage(d.data);
      })
      .catch((e) => {});
  };

  const getContacts = () => {
    setLoading(true);
    axios
      .get("http://godesignapi.ranuvijay.me/contacts", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((d) => {
        setConversation(d.data);
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

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = conversation?.map((d) => {
    return getItem(d.name, d.id, <MessageTwoTone />);
  });

  useEffect(() => {
    if (selectedConv) {
      const d = conversation?.filter(
        (d) => JSON.stringify(d.id) === selectedConv
      )[0]?.contact_name;
      setSelectedConvName(d);
    }
  }, [selectedConv]);

  const sendTextMessage = (e) => {
    e.preventDefault();

    if (!selectedConv) {
      api["warning"]({
        message: "Select a conversation !!",
      });
    } else if (!text) {
      api["warning"]({
        message: "Type something!!",
      });
    } else {
      axios
        .post(
          `http://godesignapi.ranuvijay.me/conversations/${selectedConv}/messages`,
          {
            body: text,
            direction: "out",
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((d) => {
          textRef.current.reset();
          setText(null);
          setMessage((message) => [...message, d.data]);
        })
        .catch((e) => {
          api["error"]({
            message: "Error !!",
            description: "Something went wrong, Can't send message.",
          });
        });
    }
  };

  const timeStamp = (timestamp) => {
    let prefix = "";
    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff <= 1) {
      prefix = "just now...";
    } else if (timeDiff <= 60 && timeDiff > 1) {
      prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff <= 24 * 60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
      prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
      prefix = `${new Date(timestamp)}`;
    }
    return prefix;
  };

  const renderMessages = (messages) => {
    const currentUser = "out";
    return messages.map((message, i) => (
      <li
        key={message.id}
        className={
          message.direction === currentUser
            ? " max-md:max-w-full max-w-[45%] break-words rounded-xl overflow-wrap list-none"
            : " max-md:max-w-full max-w-[55%]  max-md:ml-2 ml-[45%] overflow-wrap break-words rounded-xl list-none"
        }
      >
        <div
          className={
            message.direction === currentUser
              ? "flex flex-col justify-start items-start my-4  rounded-xl "
              : "flex flex-col items-end justify-end my-4  rounded-xl "
          }
        >
          <div
            className={`${
              message.direction === currentUser
                ? "bg-[#ffffff] text-left"
                : "bg-[#ffffff] text-right"
            }  
            px-8 py-6 rounded-md
            shadow-[0_3px_10px_-5px_rgba(0,0,0,0.2)]
            `}
          >
            <div
              className={
                message.direction === currentUser
                  ? "flex items-center"
                  : "flex flex-row-reverse items-center"
              }
            >
              <b
                className={message.direction === currentUser ? "ml-0" : "mr-0"}
              >
                {message.direction !== currentUser && selectedConvName}
              </b>
            </div>

            <>
              {!message.body ? (
                !message.is_webhook ? (
                  message.file.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null ? (
                    <>
                      <div className="mt-3">
                        <a
                          href={`http://godesignapi.ranuvijay.me/static/images/${message.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://godesignapi.ranuvijay.me/static/images/${message.file}`}
                            width="100px"
                          ></img>
                        </a>
                      </div>
                      <br />
                    </>
                  ) : message.file.match(
                      /\.(mp4|webm|flv|avi|wmv|3gp|mp3)$/
                    ) !== null ? (
                    <div className="mt-3">
                      <video
                        controls
                        src={`http://godesignapi.ranuvijay.me/static/images/${message.file}`}
                        width="140px"
                      ></video>
                    </div>
                  ) : (
                    <p
                      style={{ wordBreak: "break-word" }}
                      className="my-3 break-words "
                    >
                      <a
                        href={`http://godesignapi.ranuvijay.me/static/images/${message.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[blue]"
                      >
                        Document Link
                      </a>
                    </p>
                  )
                ) : (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ wordBreak: "break-word" }}
                    className="my-3 break-words "
                    href={message.file}
                  >
                    Media Link{" "}
                  </a>
                )
              ) : (
                <p
                  style={{ wordBreak: "break-word" }}
                  className="my-3 break-words "
                >
                  {message.body}
                </p>
              )}

              <small
                className={
                  message.direction === currentUser
                    ? "text-gray-500"
                    : "text-gray-500 "
                }
              >
                {timeStamp(message.created_at)}
              </small>
            </>
          </div>
        </div>
      </li>
    ));
  };

  useEffect(() => {
    scrollREf.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  });

  return (
    <>
      <Head>
        <title>Messages - Twilio App</title>
        <meta name="description" content="Twilio WhatsApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {contextHolder}
      <div className="h-[calc(100vh-70px)] px-[10px] pt-[10px] ">
        <div
          className="bg-[#f0f0f0] flex flex-col px-4 pt-[15px] rounded-t-lg justify-between w-full 
        h-[calc(100vh-80px)] "
        >
          <div
            className=" flex justify-between rounded-t-lg bg-[#ffffff]
           items-center h-[50px] px-6 font-semibold"
          >
            <div className="flex items-center justify-center">
              <ArrowLeftOutlined
                style={{ color: "#1890ff" }}
                onClick={() => {
                  router.back();
                }}
              />
              <p className="ml-2">Messages</p>
            </div>
          </div>
          <div className="flex justify-between h-[calc(100vh-155px)] ">
            <div className="bg-[#ffffff] rounded-t-md w-[20%] pl-2 flex flex-col ">
              <p className="text-left pl-4 font-bold text-lg mt-4">
                Conversations
              </p>

              <div className="w-full overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Spin loading />
                  </div>
                ) : (
                  <Menu
                    onClick={(e) => {
                      setSelectedConv(e.key);
                      if (selectedConv !== e.key) {
                        textRef.current.reset();
                        setText(null);
                        setMessage(null);
                      }
                    }}
                    items={items}
                    className="bg-[#ffffff]"
                  />
                )}
              </div>
            </div>
            <div className="bg-[#ffffff] rounded-t-lg w-[79%] flex flex-col">
              <div className="bg-white h-[88%] rounded-t-md overflow-auto px-2 py-2">
                {message && renderMessages(message)}
                <div ref={scrollREf} />
              </div>
              <div className="bg-[#ffffff] mt-2 h-[12%] flex justify-start items-start pr-2">
                <form
                  className="pl-4 pr-4 pt-0  flex items-center justify-between w-full"
                  onSubmit={sendTextMessage}
                  ref={textRef}
                >
                  <textarea
                    className="rounded bg-[#fff] text-sm h-10 w-[88%]  px-4 pt-2
                    resize-none  focus:outline-0"
                    placeholder="Text here..."
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />

                  <label
                    className={
                      !selectedConv
                        ? "cursor-not-allowed flex flex-col items-center px-0 py-0 bg-white text-blue rounded-lg \
                         tracking-wide uppercase"
                        : //  cursor-pointer
                          "flex flex-col items-center px-2 py-2 bg-[#fff] text-blue rounded-lg \
                            tracking-wide uppercase cursor-pointer"
                    }
                  >
                    <svg
                      className="w-7 h-7"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    {selectedConv && (
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    )}
                  </label>
                  <button
                    disabled={selectedConv && text ? false : true}
                    type="submit"
                    className={`${
                      selectedConv && text
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } font-medium w-7 h-7 max-md:w-8 max-md:h-8 rounded-full bg-[#ff4309] 
                    flex  items-center justify-center mr-2 hover:opacity-80 transition`}
                  >
                    <RightCircleTwoTone style={{ fontSize: "30px" }} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
