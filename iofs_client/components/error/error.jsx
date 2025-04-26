import { observer } from "mobx-react-lite";
import { Context } from "../../pages/_app";
import { useContext, useEffect, useRef } from "react";
import gsap from "gsap";

export const Error = observer(({ text }) => {
  const { store } = useContext(Context);

  const errorRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      errorRef.current,
      {
        x: 0,
        opacity: 0,
      },
      {
        x: 216,
        opacity: 0.9,
        duration: 0.3,
      }
    );

    setTimeout(() => {
      gsap.to(errorRef.current, {
        x: 0,
        opacity: 0,
        duration: 0.5,
      });
    }, 4000);
  }, [store.errorAuth]);

  return (
    <div
      className="absolute top-[200px] left-[-200px] px-2 w-[200px] pt-3 h-[70px] flex bg-red-400 text-white error"
      onClick={() => store.setErrorAuth(false)}
      ref={errorRef}
    >
      {text}
    </div>
  );
});
