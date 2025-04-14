import { useState, useEffect, useContext, useRef } from "react";
import { Post } from "../post";
import { Context } from "../../pages/_app";
import { observer } from "mobx-react-lite";
import gsap from "gsap";

export const PostsList = observer(() => {
  const [posts, setPosts] = useState([]);
  const [load, setLoad] = useState(false);
  const { store } = useContext(Context);

  const postsList = useRef(null);

  useEffect(() => {
    setLoad(true);

    const urlObj = new URL(store.urlPosts);

    if (
      (urlObj.searchParams.get("filter") == "of_user" ||
        "liked" ||
        "favorites") &&
      urlObj.searchParams.get("filter")
    ) {
      const ws = new WebSocket(
        `${store.urlPosts}&token=${localStorage.getItem("token")}`
      );
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data.posts);
        setPosts(() => data.posts);
        setLoad(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      gsap.fromTo(
        postsList.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        }
      );

      return () => {
        ws.close();
        setLoad(false);
      };
    } else {
      const ws = new WebSocket(store.urlPosts);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data.posts);
        setPosts(() => data.posts);
        setLoad(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      gsap.fromTo(
        postsList.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        }
      );

      return () => {
        ws.close();
        setLoad(false);
      };
    }
  }, [store.urlPosts]);

  useEffect(() => {}, []);

  return (
    <>
      {load ? (
        <div class="frame">
          <span class="image image-loading">
            <span class="spinner">
              <span class="spinner-inner spinner-wandering-cubes">
                <span class="spinner-item"></span>
                <span class="spinner-item"></span>
              </span>
            </span>
          </span>
        </div>
      ) : (
        <div ref={postsList} className="flex gap-5 flex-wrap mt-2 posts-list">
          {posts.map((post) => (
            <Post initialPost={post} key={post.id} />
          ))}
        </div>
      )}
    </>
  );
});
