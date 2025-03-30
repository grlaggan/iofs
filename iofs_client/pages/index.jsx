import { Header } from "../components/header";
import { Main } from "../components/main";
import { createContext } from "react";
import { useInitAuth } from "../hooks";

export const ApiUrlContext = createContext({
  urlForGetPosts: "",
  setUrlForGetPosts: () => {},
});

export const Blurred = createContext();

export default function HomePage() {
  useInitAuth();
  // const [urlForGetPosts, setUrlForGetPosts] = useState(
  //   "http://127.0.0.1:5000/posts/"
  // );
  // const [isAuthorization, setIsAuthorization] = useState(false);

  return (
    <>
      <Header></Header>
      <Main></Main>
    </>
  );
}
