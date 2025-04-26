import "../styles/globals.css";
import { Roboto } from "next/font/google";
import { createContext, useState } from "react";
import { Authorization } from "../components/user-logic/authorization";
import { Registration } from "../components/user-logic/registration";
import Store from "../components/store";
import { observer } from "mobx-react-lite";
import { Error } from "../components/error";
import Head from "next/head";

const store = new Store();

const roboto = Roboto({ subsets: ["latin", "cyrillic"] });
export const Blurred = createContext();
export const Context = createContext({ store });
export const RegContext = createContext();

const App = observer(({ Component, pageProps }) => {
  const [isAuthorization, setIsAuthorization] = useState(false);
  const [isAuthProcess, setIsAuthProcess] = useState(false);

  return (
    <Context value={{ store }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {store.errorAuth && <Error text="Не удалось войти." />}
      {store.errorReg && <Error text="Не удалось зарегистрироваться." />}
      <Blurred value={{ isAuthorization, setIsAuthorization }}>
        <RegContext.Provider value={{ isAuthProcess, setIsAuthProcess }}>
          {isAuthorization && isAuthProcess && <Authorization />}
          {isAuthorization && !isAuthProcess && <Registration />}
          <div inert={isAuthorization ? true : undefined}>
            {store.loadUserLogin ? (
              <div class="frame">
                <span class="image image-loading">
                  <span class="spinner">
                    <span class="spinner-inner spinner-wandering-cubes">
                      <span class="spinner-item"></span>
                      <span class="spinner-item"></span>
                    </span>
                  </span>
                </span>
              </div>
            ) : (
              <div className={roboto.className}>
                <Component {...pageProps} />
              </div>
            )}
          </div>
        </RegContext.Provider>
      </Blurred>
    </Context>
  );
});

export default App;
