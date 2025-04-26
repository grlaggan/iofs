import { Header } from "../components/header";
import { Main } from "../components/main";
import { Context } from "./_app";
import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Blurred } from "./_app";
import Head from "next/head";

const HomePage = observer(() => {
  const { store } = useContext(Context);

  const { isAuthorization } = useContext(Blurred);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Главная страница</title>
      </Head>
      <Header></Header>
      <div className={isAuthorization && "blurred"}>
        <Main></Main>
      </div>
    </>
  );
});

export default HomePage;
