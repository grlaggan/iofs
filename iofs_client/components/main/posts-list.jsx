import { useState, useEffect, useContext } from "react";
import { Post } from "../post";
import { ApiUrlContext } from "../../pages/_app";
import { useAuth } from "../user-logic/auth-context";

export function PostsList() {
  const [posts, setPosts] = useState([]);
  const { urlForGetPosts } = useContext(ApiUrlContext);
  const { state } = useAuth();

  useEffect(() => {
    fetch(urlForGetPosts, {
      headers: state.accessToken
        ? { Authorization: `Bearer ${state.accessToken}` }
        : {},
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Did't get posts");
        }

        return response.json();
      })
      .then((posts) => {
        setPosts(posts);
      })
      .catch(() => []);
  }, [urlForGetPosts]);

  return (
    <div className="flex gap-5 flex-wrap mt-2 posts-list">
      {posts.map((post) => (
        <Post initialPost={post} />
      ))}
    </div>
  );
}
