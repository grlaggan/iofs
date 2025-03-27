import { Header } from "../components/header";
import { Main } from "../components/main";
import { createContext, useState } from "react";

export const ApiUrlContext = createContext({
  urlForGetPosts: "",
  setUrlForGetPosts: () => {},
});

export default function HomePage() {
  const [urlForGetPosts, setUrlForGetPosts] = useState(
    "http://127.0.0.1:5000/posts/"
  );

  return (
    <ApiUrlContext.Provider value={{ urlForGetPosts, setUrlForGetPosts }}>
      <Header></Header>
      <Main></Main>
    </ApiUrlContext.Provider>
  );
}
