import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar, Badge } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../store/actions.js";
import axios from "axios";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Contacts", "sub1", <UserOutlined />, [
    getItem("Create Contact", "3"),
    getItem("Contact List", "4"),
  ]),
  getItem("Messages", "10", <MessageOutlined />),
];

export default function LayoutApp(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

  const [notificationData, setNotificationData] = useState(null);

  const token = useSelector((state) => state.AuthReducer.token);
  const userid = useSelector((state) => state.AuthReducer.username);


  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token]);

  const getData = async () => {
    try {
      axios
        .get("http://godesignapi.ranuvijay.me/notifications", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((d) => {
          setNotificationData(d.data);
        })
        .catch((e) => {});
    } catch (e) {}
  };

  useEffect(() => {
    if (token) {
      const intervalCall = setInterval(() => {
        getData();
      }, 10000);
      return () => {
        clearInterval(intervalCall);
      };
    }
  }, [token]);

  const onClickMenu = (e) => {
    if (e.key === "3") {
      router.push("/console/createContact");
    } else if (e.key === "4") {
      router.push("/console/listContact");
      // } else if (e.key === "9") {
      //   router.push("/console/twilio");
      // } else if (e.key === "1") {
      //   router.push("/console/dashboard");
    } else if (e.key === "10") {
      router.push("/console/message");
    }
  };

  const itemss = [
    {
      key: "2",
      label: <Link href="/console/notifications">Notification</Link>,
      icon: <NotificationOutlined />,
      disabled: false,
    },
    {
      key: "3",
      label: (
        <p
          onClick={() => {
            dispatch(userLogout());
          }}
        >
          Log Out
        </p>
      ),
      disabled: false,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Layout>
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex justify-center  mt-4 w-full">
          <p className="font-bold text-2xl text-white">Menu</p>
        </div>
        <Menu
          className="mt-[40px]"
          theme="dark"
          defaultSelectedKeys={["10"]}
          mode="inline"
          items={items}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="h-[70px] bg-gray-50 flex justify-between items-center">
          {/* <p className="font-bold text-lg">Twilio App</p> */}
          <p className="text-xl">
            Welcome <span className="font-bold text-2xl">{userid}</span>
          </p>
          <Dropdown
            menu={{
              items: itemss,
            }}
            className="cursor-pointer"
          >
            <Badge count={notificationData?.length}>
              <Avatar shape="square" icon={<UserOutlined />} />
            </Badge>
          </Dropdown>
        </Header>
        <Content className="bg-[#d9d9d9] min-h-[calc(100vh-70px)] max-h-[calc(100vh-70px)]  overflow-auto">
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}
