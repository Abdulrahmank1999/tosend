import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home(props) {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center items-center h-screen bg-[#f7f7ff]">
        Home Page
      </main>
    </>
  );
}
