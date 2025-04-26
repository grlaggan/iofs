import { observer } from "mobx-react-lite";
import { Header } from "../../components/header";
import { Context } from "../_app";
import { useContext, useState, useRef, useEffect } from "react";
import { ArrowIconDown } from "../../components/post/icons";
import $api from "../../components/http";
import Link from "next/link";
import clsx from "clsx";
import gsap from "gsap";
import Head from "next/head";

const Create = observer(() => {
  const { store } = useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState("Математика");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [text, setText] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const createRef = useRef(null);

  const createPostUrl = "http://127.0.0.1:5000/posts/";

  const create = async () => {
    try {
      await $api.post(createPostUrl, {
        theme: theme,
        description: description,
        text: text,
        category: selectedCategory,
      });
      window.location.href = "/";
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const handleCategorySelect = (value) => {
    setShowSortDropdown(false);
    setSelectedCategory(value);
  };

  useEffect(() => {
    gsap.fromTo(
      createRef.current,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
      }
    );
  }, []);

  return (
    <>
      <Head>
        <title>Создание поста</title>
      </Head>
      <Header />
      <main className="main px-4" ref={createRef}>
        <Link
          href="/"
          className="text-main-white text-xs mt-4 underline inline-block"
        >
          Назад
        </Link>
        <form
          className="create flex flex-col items-start gap-2 max-w-[400px] ml-[64px]"
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
        >
          <h2 className="text-main-white text-[32px] mt-5 mb-6">
            Создание поста
          </h2>
          <div className="flex flex-col gap-2 items-start">
            <label htmlFor="theme" className="text-main-white ml-[10px]">
              Тема
            </label>
            <input
              id="theme"
              type="text"
              className="form-create__input"
              placeholder="Тема"
              required
              maxLength={32}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="inline-flex gap-3 items-center">
            <span className="text-main-white text-[14px]">Категория:</span>
            <div className="relative inline-block text-[14px]">
              <button
                onClick={(e) => {
                  setShowSortDropdown((lastValue) => {
                    e.preventDefault();
                    return !lastValue;
                  });
                }}
                className="filter"
              >
                {selectedCategory} <ArrowIconDown />
              </button>
              {showSortDropdown && (
                <div className="filter__show">
                  {store.categories.map((category) => (
                    <div
                      className={clsx(
                        "filter__show-part",
                        selectedCategory === category.name
                          ? "filter__show-part--selected"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        handleCategorySelect(category.name);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <label htmlFor="description" className="text-main-white ml-[10px]">
              Описание
            </label>
            <textarea
              className="form-create__textarea"
              placeholder="Описание"
              maxLength={100}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="off"
              required
            >
              {description}
            </textarea>
          </div>
          <div className="flex flex-col gap-2 items-start mt-4">
            <label htmlFor="description" className="text-main-white ml-[10px]">
              Текст
            </label>
            <textarea
              className="form-create__textarea--text"
              placeholder="Текст"
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
              required
            >
              {text}
            </textarea>
          </div>
          <input
            type="submit"
            className="button cursor-pointer mx-auto mt-4"
            value="Создать"
          />
        </form>
      </main>
    </>
  );
});

export default Create;
