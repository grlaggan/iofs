import { observer } from "mobx-react-lite";
import { Header } from "../../components/header";
import defaultAvatar from "../../components/post/images/default-avatar.png";
import { Context } from "../_app";
import { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const Change = observer(() => {
  const { store } = useContext(Context);

  const [username, setUsername] = useState(store.user.username);
  const [lastName, setLastName] = useState(store.user.last_name);
  const [firstName, setFirstName] = useState(store.user.first_name);
  const [email, setEmail] = useState(store.user.email);
  const [avatar, setAvatar] = useState(store.user.avatar);

  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const changeRef = useRef(null);
  const profileRef = useRef(null);
  const passwordRef = useRef(null);

  const [preview, setPreview] = useState(
    `http://127.0.0.1:5000${store.user?.avatar}`
  );

  const inputUploadAvatarRef = useRef(null);

  const change = () => {
    const formData = new FormData();

    if (username !== store.user.username) formData.append("username", username);
    if (lastName !== store.user.last_name)
      formData.append("last_name", lastName);
    if (firstName !== store.user.first_name)
      formData.append("first_name", firstName);
    if (email !== store.user.email) formData.append("email", email);
    if (avatar && avatar !== store.user.avatar)
      formData.append("avatar", avatar);

    store.change(formData);
    window.location.href = "/";
  };

  const changePassword = () => {
    try {
      store.changePassword(password, newPassword, confirmPassword);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    if (!selectedFile) return;

    setAvatar(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    store.checkAuth();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        profileRef.current,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
        }
      );
      gsap.fromTo(
        passwordRef.current,
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
        }
      );
    }, changeRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main className="main px-4" ref={changeRef}>
        <Link
          href="/"
          className="text-main-white text-xs mt-4 underline inline-block"
        >
          Назад
        </Link>
        <div className="flex gap-12 mx-16 flex-wrap">
          <form
            className="flex flex-col items-center gap-3"
            ref={profileRef}
            onSubmit={(e) => {
              e.preventDefault();
              change();
            }}
          >
            <input
              type="file"
              className="hidden"
              ref={inputUploadAvatarRef}
              accept="image/*"
              onChange={(e) => handleAvatarChange(e)}
            />
            <h3 className="text-main-white text-[28px] mt-5">
              Редактирование профиля
            </h3>
            <div
              className="h-[80px] w-[80px] rounded-full overflow-hidden"
              onClick={() => {
                inputUploadAvatarRef.current?.click();
              }}
            >
              <Image
                src={preview ? preview : defaultAvatar}
                width={80}
                height={80}
                unoptimized
                className="object-cover w-full h-full change-avatar"
                alt="User Avatar"
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                className="form-change__input"
                placeholder="Имя пользователя"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Фамилия
              </label>
              <input
                type="text"
                value={lastName}
                className="form-change__input"
                placeholder="Фамилия"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Имя
              </label>
              <input
                type="text"
                value={firstName}
                className="form-change__input"
                placeholder="Имя"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Email
              </label>
              <input
                type="email"
                value={email}
                className="form-change__input"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input
              type="submit"
              className="button cursor-pointer"
              value="Изменить"
            />
          </form>
          <form
            className="flex flex-col gap-3 items-start"
            ref={passwordRef}
            onSubmit={(e) => {
              e.preventDefault();
              changePassword();
            }}
          >
            <h3 className="text-main-white text-[28px] mt-5">
              Изменение пароля
            </h3>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                className="form-change__input"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                className="form-change__input"
                placeholder="New password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="" className="text-main-white text-xs">
                Подтвердить пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                className="form-change__input"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input
              type="submit"
              className="button cursor-pointer ml-[35%]"
              value="Изменить"
            />
          </form>
        </div>
      </main>
    </>
  );
});

export default Change;
