import { AuthProvider } from "../components/user-logic";
import "../styles/globals.css";
import { Roboto } from "next/font/google";
import { createContext, useState } from "react";
import { Authorization } from "../components/user-logic";

const roboto = Roboto({ subsets: ["latin", "cyrillic"] });
export const Blurred = createContext();
export const ApiUrlContext = createContext({
  urlForGetPosts: "http://127.0.0.1:5000/posts/",
  setUrlForGetPosts: () => {},
});

export default function App({ Component, pageProps }) {
  const [isAuthorization, setIsAuthorization] = useState(false);
  const [urlForGetPosts, setUrlForGetPosts] = useState(
    "http://127.0.0.1:5000/posts/"
  );
  return (
    <AuthProvider>
      <ApiUrlContext.Provider value={{ urlForGetPosts, setUrlForGetPosts }}>
        <Blurred value={{ isAuthorization, setIsAuthorization }}>
          {isAuthorization && <Authorization />}
          <div className={roboto.className}>
            <Component {...pageProps} />
          </div>
        </Blurred>
      </ApiUrlContext.Provider>
    </AuthProvider>
  );
}
