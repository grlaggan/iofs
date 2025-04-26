import { observer } from "mobx-react-lite";
import { useContext, useState, useRef, useEffect } from "react";
import { Blurred } from "../../pages/_app";
import { RegContext } from "../../pages/_app";
import { Context } from "../../pages/_app";
import { CrossIcon } from "./icons";
import FormValidate from "../validate/validate";
import gsap from "gsap";

export const Registration = observer(() => {
  const { setIsAuthorization } = useContext(Blurred);
  const { setIsAuthProcess } = useContext(RegContext);
  const { store } = useContext(Context);

  const regRef = useRef(null);

  const [isValid, setIsValid] = useState(false);

  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const register = (username, password1, password2) => {
    store.registration(username, password1, password2);
    setIsAuthProcess(true);
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

    gsap.fromTo(
      regRef.current,
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
    <div className="authorization" ref={regRef}>
      <button className="icon" onClick={() => setIsAuthorization(() => false)}>
        <CrossIcon />
      </button>
      <h2 className="text-center text-2xl font-semibold mt-[48px] text-white mb-[25px]">
        Регистрация
      </h2>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          isValid && register(username, password1, password2);
        }}
        data-js-form
        noValidate
      >
        <div className="max-w-[393px] mx-auto">
          <input
            id="login"
            type="text"
            className="form__input mb-[10px]"
            placeholder="Имя пользователя"
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
            id="password1"
            type="password"
            className="form__input mb-[10px]"
            placeholder="Пароль"
            autoComplete="off"
            onChange={(e) => setPassword1(e.target.value)}
            value={password1}
            required
            aria-errormessage="password1-errors"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Пароль должен содержать минимум 8 символов, включая одну цифру, одну заглавную и одну строчную буквы"
          />
          <span
            className="form__input-errors text-red-300"
            id="password1-errors"
            data-js-form-input-errors
          ></span>
        </div>
        <div className="max-w-[393px] mx-auto">
          <input
            id="password2"
            type="password"
            className="form__input"
            placeholder="Повторить пароль"
            autoComplete="off"
            onChange={(e) => setPassword2(e.target.value)}
            value={password2}
            required
            aria-errormessage="password2-errors"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Пароль должен содержать минимум 8 символов, включая одну цифру, одну заглавную и одну строчную буквы"
          />
          <span
            className="form__input-errors text-red-300"
            id="password2-errors"
            data-js-form-input-errors
          ></span>
        </div>
        <button
          className="form__link ml-[54px] mt-3"
          onClick={() => setIsAuthProcess(true)}
        >
          Авторизация
        </button>
        <input
          className="form__authorize"
          type="submit"
          value="Зарегистрироваться"
          disabled={!username || !password1 || !password2 ? "true" : ""}
        />
      </form>
    </div>
  );
});
