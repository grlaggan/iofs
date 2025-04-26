import { useContext, useState, useRef, useEffect } from "react";
import { CrossIcon } from "./icons";
import { Blurred } from "../../pages/_app";
import { RegContext } from "../../pages/_app";
import { Context } from "../../pages/_app";
import { observer } from "mobx-react-lite";
import FormValidate from "../validate/validate";
import gsap from "gsap";

export const Authorization = observer(() => {
  const { setIsAuthorization } = useContext(Blurred);
  const { setIsAuthProcess } = useContext(RegContext);

  const authRef = useRef(null);

  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const { store } = useContext(Context);

  const [isValid, setIsValid] = useState(false);

  const authorize = () => {
    store.login(username, password);
    setIsAuthorization(false);
    store.setLoadUserLogin(true);
  };

  useEffect(() => {
    const formValidate = new FormValidate();

    document.addEventListener(
      "submit",
      (event) => {
        setIsValid(formValidate.onSubmit(event));
      },
      { capture: true }
    );

    document.addEventListener(
      "blur",
      (event) => {
        formValidate.onBlur(event);
      },
      { capture: true }
    );
  }, []);

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
          isValid && authorize();
        }}
        data-js-form
        noValidate
      >
        <div className="max-w-[393px] mx-auto">
          <input
            id="login"
            type="text"
            placeholder="Email или Имя пользователя"
            className="form__input"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            minLength={3}
            maxLength={12}
            aria-errormessage="login-errors"
            required
          />
          <span
            className="form__input-errors text-red-300"
            id="login-errors"
            data-js-form-input-errors
          ></span>
        </div>
        <div className="max-w-[393px] mx-auto">
          <input
            id="password"
            type="password"
            placeholder="Пароль"
            className="form__input"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            aria-errormessage="password-errors"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Пароль должен содержать минимум 8 символов, включая одну цифру, одну заглавную и одну строчную буквы"
            required
          />
          <span
            className="form__input-errors text-red-300"
            id="password-errors"
            data-js-form-input-errors
          ></span>
        </div>
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
