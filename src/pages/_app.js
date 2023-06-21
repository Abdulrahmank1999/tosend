import "@/styles/globals.css";
import { Provider } from "react-redux";
import { useStore } from "../store/store.js";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { useEffect } from "react";

const LayoutApp = dynamic(() => import("../components/layoutApp.js"), {
  suspense: true,
});

const ReqLayout = ({ children }) => {
  const router = useRouter();
  const urlPath = router.pathname.slice(0, 8);

  return urlPath === "/console" ? (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Auth Layout..." size="small" />
        </div>
      }
    >
      <LayoutApp>{children}</LayoutApp>
    </Suspense>
  ) : (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Layout..." size="small" />
        </div>
      }
    >
      <div>{children}</div>
    </Suspense>
  );
};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    return () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    };
  }, []);
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <ReqLayout>
        <Component {...pageProps} />
      </ReqLayout>
    </Provider>
  );
}
