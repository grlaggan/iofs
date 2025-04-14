import { observer } from "mobx-react-lite";
import { useContext, useState, useRef, useEffect } from "react";
import { Blurred } from "../../pages/_app";
import { RegContext } from "../../pages/_app";
import { Context } from "../../pages/_app";
import { CrossIcon } from "./icons";
import gsap from "gsap";

export const Registration = observer(() => {
  const { setIsAuthorization } = useContext(Blurred);
  const { setIsAuthProcess } = useContext(RegContext);
  const { store } = useContext(Context);

  const regRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const register = (username, password1, password2) => {
    store.registration(username, password1, password2);
    setIsAuthProcess(true);
  };

  useEffect(() => {
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
          register(username, password1, password2);
        }}
      >
        <input
          type="text"
          className="form__input mb-[10px]"
          placeholder="Имя пользователя"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <input
          type="password"
          className="form__input mb-[10px]"
          placeholder="Пароль"
          autoComplete="off"
          onChange={(e) => setPassword1(e.target.value)}
          value={password1}
          required
        />
        <input
          type="password"
          className="form__input"
          placeholder="Повторить пароль"
          autoComplete="off"
          onChange={(e) => setPassword2(e.target.value)}
          value={password2}
          required
        />
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
