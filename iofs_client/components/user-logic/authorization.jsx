import { GoogleIcon } from "../main/icons";
import { GithubIcon } from "../main/icons";
import { useRef, useContext } from "react";
import { useApi } from "./api";
import { useAuth } from "./auth-context";
import { CrossIcon } from "./icons";
import { Blurred } from "../../pages/_app";

const loginAPI = "http://127.0.0.1:5000/api/token/";

export function Authorization() {
  const { setIsAuthorization } = useContext(Blurred);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);
  const { dispatch } = useAuth();

  const authorize = async () => {
    const username = usernameInput.current.value;
    const password = passwordInput.current.value;

    const response = await fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const { refresh, access, user } = await response.json();
    localStorage.setItem("refresh", refresh);
    dispatch({ type: "LOGIN_SUCCESS", payload: access, user: user });
    setIsAuthorization(() => false);
  };

  return (
    <div className="authorization">
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
          ref={usernameInput}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form__input"
          ref={passwordInput}
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
        <button className="form__link ml-[54px] mt-3">
          Зарегистрироваться
        </button>
        <input className="form__authorize" type="submit" value="Войти" />
      </form>
    </div>
  );
}
