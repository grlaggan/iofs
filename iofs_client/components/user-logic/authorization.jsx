import { GoogleIcon } from "../main/icons";
import { GithubIcon } from "../main/icons";
import { useContext, useState, useRef, useEffect } from "react";
import { CrossIcon } from "./icons";
import { Blurred } from "../../pages/_app";
import { RegContext } from "../../pages/_app";
import { Context } from "../../pages/_app";
import { observer } from "mobx-react-lite";
import gsap from "gsap";

export const Authorization = observer(() => {
  const { setIsAuthorization } = useContext(Blurred);
  const { setIsAuthProcess } = useContext(RegContext);

  const authRef = useRef(null);

  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const { store } = useContext(Context);

  const authorize = () => {
    store.login(username, password);
    setIsAuthorization(false);
    store.setLoadUserLogin(true);
  };

  useEffect(() => {
    gsap.fromTo(
      authRef.current,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.2,
      }
    );
  }, []);

  return (
    <div className="authorization" ref={authRef}>
      <button className="icon" onClick={() => setIsAuthorization(() => false)}>
        <CrossIcon />
      </button>
      <h2 className="text-center text-2xl font-semibold mt-[48px] text-white mb-[25px]">
        Войти
      </h2>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          authorize();
        }}
      >
        <input
          type="text"
          placeholder="Email или Имя пользователя"
          className="form__input"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form__input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <div className="w-[390px] h-[1px] mx-auto bg-white opacity-50 my-[14px]"></div>
        <button className="form__oauth">
          <GoogleIcon />
          <span className="text-xs mr-[25%]">Продолжить с помощью Google</span>
        </button>
        <button className="form__oauth">
          <GithubIcon />
          <span className="text-xs mr-[25%]">Продолжить с помощью Github</span>
        </button>
        <button
          className="form__link ml-[54px] mt-3"
          onClick={() => setIsAuthProcess(false)}
        >
          Зарегистрироваться
        </button>
        <input
          className="form__authorize"
          type="submit"
          value="Войти"
          disabled={!username || !password ? "true" : ""}
        />
      </form>
    </div>
  );
});
